import type {
  MotionPreset,
  NodeMotion,
  RobloxClass,
  SceneNode,
  SlideDirection,
} from "./catalog";

export type ResolvedMotionDefaults = Readonly<{
  durationMs: number;
  slideDirection: SlideDirection;
  easingStyle: "quad";
  easingDirection: "out";
  closedScale: number;
  hoverScale: number;
  slideOffsetPx: number;
}>;

export type ResolvedMotion = Readonly<{
  eligible: boolean;
  preset?: MotionPreset;
  effectivePreset?: MotionPreset;
  durationMs: number;
  slideDirection: SlideDirection;
  hover: boolean;
  slideBlocked: boolean;
  fadeBlocked: boolean;
  initialOpen: boolean;
}>;

export const MOTION_DEFAULTS: ResolvedMotionDefaults = Object.freeze({
  closedScale: 0.92,
  hoverScale: 1.03,
  slideOffsetPx: 24,
  durationMs: 240,
  slideDirection: "left",
  easingStyle: "quad",
  easingDirection: "out",
});

const MOTION_CLASSES: readonly RobloxClass[] = Object.freeze([
  "Frame",
  "ScrollingFrame",
  "TextLabel",
  "TextButton",
  "TextBox",
  "ImageLabel",
]);

const PRESETS: readonly MotionPreset[] = Object.freeze(["fade", "slide", "scale"]);
const DIRECTIONS: readonly SlideDirection[] = Object.freeze(["left", "right", "up", "down"]);
const CLOSED_OFFSETS: Readonly<Record<SlideDirection, Readonly<{ x: number; y: number }>>> =
  Object.freeze({
    left: Object.freeze({ x: -MOTION_DEFAULTS.slideOffsetPx, y: 0 }),
    right: Object.freeze({ x: MOTION_DEFAULTS.slideOffsetPx, y: 0 }),
    up: Object.freeze({ x: 0, y: -MOTION_DEFAULTS.slideOffsetPx }),
    down: Object.freeze({ x: 0, y: MOTION_DEFAULTS.slideOffsetPx }),
  });

function isMember<T extends string>(value: unknown, values: readonly T[]): value is T {
  return typeof value === "string" && values.includes(value as T);
}

export function isMotionClass(cls: RobloxClass): boolean {
  return MOTION_CLASSES.includes(cls);
}

export function sanitizeMotion(raw: unknown, cls: RobloxClass): NodeMotion | undefined {
  if (!isMotionClass(cls) || raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    return undefined;
  }

  const source = raw as Record<string, unknown>;
  const motion: NodeMotion = {};
  if (isMember(source.preset, PRESETS)) motion.preset = source.preset;
  if (typeof source.durationMs === "number" && Number.isFinite(source.durationMs)) {
    motion.durationMs = Math.min(2000, Math.max(100, Math.round(source.durationMs)));
  }
  if (isMember(source.slideDirection, DIRECTIONS)) motion.slideDirection = source.slideDirection;
  if (cls === "TextButton" && source.hover === true) motion.hover = true;

  return Object.keys(motion).length > 0 ? motion : undefined;
}

function ancestorChain(
  node: SceneNode,
  nodesById: ReadonlyMap<string, SceneNode>,
): SceneNode[] | undefined {
  const ancestors: SceneNode[] = [];
  const visited = new Set<string>([node.id]);
  let parentId = node.parentId;

  while (parentId !== undefined && parentId !== null) {
    if (visited.has(parentId)) return undefined;
    visited.add(parentId);
    const parent = nodesById.get(parentId);
    if (!parent) return undefined;
    ancestors.push(parent);
    parentId = parent.parentId;
  }

  return ancestors;
}

export function isEffectivelyInitiallyVisible(scene: readonly SceneNode[], node: SceneNode): boolean {
  if (node.initialVisible === false) return false;
  const nodesById = new Map(scene.map((candidate) => [candidate.id, candidate]));
  const ancestors = ancestorChain(node, nodesById);
  return ancestors !== undefined && ancestors.every((ancestor) => ancestor.initialVisible !== false);
}

export function motionClosedOffset(
  direction: SlideDirection,
): Readonly<{ x: number; y: number }> {
  return CLOSED_OFFSETS[direction];
}

export function resolveSceneMotion(scene: readonly SceneNode[]): ReadonlyMap<string, ResolvedMotion> {
  const nodesById = new Map(scene.map((node) => [node.id, node]));
  const sanitizedById = new Map(
    scene.map((node) => [node.id, sanitizeMotion(node.motion, node.cls)] as const),
  );
  const preliminaryById = new Map<string, MotionPreset | undefined>();
  const slideBlockedById = new Map<string, boolean>();

  for (const node of scene) {
    const storedPreset = sanitizedById.get(node.id)?.preset;
    const parent = node.parentId == null ? undefined : nodesById.get(node.parentId);
    const slideBlocked =
      storedPreset === "slide" && (parent?.layout === "list" || parent?.layout === "grid");
    preliminaryById.set(node.id, slideBlocked ? "fade" : storedPreset);
    slideBlockedById.set(node.id, slideBlocked);
  }

  const cycleIds = new Set<string>();
  const checkedIds = new Set<string>();
  for (const start of scene) {
    const path: string[] = [];
    const pathIndex = new Map<string, number>();
    let current: SceneNode | undefined = start;

    while (current && !checkedIds.has(current.id)) {
      const cycleStart = pathIndex.get(current.id);
      if (cycleStart !== undefined) {
        for (const id of path.slice(cycleStart)) cycleIds.add(id);
        break;
      }
      pathIndex.set(current.id, path.length);
      path.push(current.id);
      current = current.parentId == null ? undefined : nodesById.get(current.parentId);
    }
    for (const id of path) checkedIds.add(id);
  }

  type FinalizedPreset = {
    effectivePreset?: MotionPreset;
    fadeBlocked: boolean;
    effectiveFadeInAncestors: boolean;
  };
  const finalizedById = new Map<string, FinalizedPreset>();
  const visiting = new Set<string>();

  const finalizePreset = (node: SceneNode): FinalizedPreset => {
    const cached = finalizedById.get(node.id);
    if (cached) return cached;

    const preliminaryPreset = preliminaryById.get(node.id);
    if (cycleIds.has(node.id) || visiting.has(node.id)) {
      const cycleResult = {
        effectivePreset: preliminaryPreset,
        fadeBlocked: false,
        effectiveFadeInAncestors: false,
      };
      finalizedById.set(node.id, cycleResult);
      return cycleResult;
    }

    visiting.add(node.id);
    const parent = node.parentId == null ? undefined : nodesById.get(node.parentId);
    const parentFinalized = parent ? finalizePreset(parent) : undefined;
    visiting.delete(node.id);

    const effectiveFadeInAncestors =
      parentFinalized?.effectivePreset === "fade" ||
      parentFinalized?.effectiveFadeInAncestors === true;
    const fadeBlocked = preliminaryPreset === "fade" && effectiveFadeInAncestors;
    const result = {
      effectivePreset: fadeBlocked ? "scale" : preliminaryPreset,
      fadeBlocked,
      effectiveFadeInAncestors,
    } satisfies FinalizedPreset;
    finalizedById.set(node.id, result);
    return result;
  };

  const resolved = new Map<string, ResolvedMotion>();
  for (const node of scene) {
    const eligible = isMotionClass(node.cls);
    const sanitized = sanitizedById.get(node.id);
    const { effectivePreset, fadeBlocked } = finalizePreset(node);
    const initialOpen =
      effectivePreset !== undefined && isEffectivelyInitiallyVisible(scene, node);

    resolved.set(
      node.id,
      Object.freeze({
        eligible,
        ...(eligible && sanitized?.preset !== undefined ? { preset: sanitized.preset } : {}),
        ...(eligible && effectivePreset !== undefined ? { effectivePreset } : {}),
        durationMs: eligible ? sanitized?.durationMs ?? MOTION_DEFAULTS.durationMs : MOTION_DEFAULTS.durationMs,
        slideDirection: eligible
          ? sanitized?.slideDirection ?? MOTION_DEFAULTS.slideDirection
          : MOTION_DEFAULTS.slideDirection,
        hover: eligible ? sanitized?.hover === true : false,
        slideBlocked: eligible ? slideBlockedById.get(node.id) === true : false,
        fadeBlocked: eligible ? fadeBlocked : false,
        initialOpen: eligible ? initialOpen : false,
      }),
    );
  }

  return resolved;
}
