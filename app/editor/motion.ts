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

function uniqueSceneGraph(scene: readonly SceneNode[]): {
  nodesById: Map<string, SceneNode>;
  ambiguousIds: Set<string>;
} {
  const nodesById = new Map<string, SceneNode>();
  const ambiguousIds = new Set<string>();
  for (const node of scene) {
    if (nodesById.has(node.id)) {
      nodesById.delete(node.id);
      ambiguousIds.add(node.id);
    } else if (!ambiguousIds.has(node.id)) {
      nodesById.set(node.id, node);
    }
  }
  return { nodesById, ambiguousIds };
}

function createVisibilityResolver(nodesById: ReadonlyMap<string, SceneNode>) {
  const visibleById = new Map<string, boolean>();

  return (start: SceneNode): boolean => {
    const cached = visibleById.get(start.id);
    if (cached !== undefined) return cached;

    const path: SceneNode[] = [];
    const pathIndex = new Map<string, number>();
    let current: SceneNode | undefined = start;
    let ancestorVisible = false;

    while (current) {
      const currentCached = visibleById.get(current.id);
      if (currentCached !== undefined) {
        ancestorVisible = currentCached;
        break;
      }
      if (pathIndex.has(current.id)) {
        ancestorVisible = false;
        break;
      }

      pathIndex.set(current.id, path.length);
      path.push(current);
      if (current.initialVisible === false) {
        ancestorVisible = false;
        break;
      }
      if (current.parentId == null) {
        ancestorVisible = true;
        break;
      }
      current = nodesById.get(current.parentId);
      if (!current) {
        ancestorVisible = false;
        break;
      }
    }

    for (let index = path.length - 1; index >= 0; index -= 1) {
      const pathNode = path[index];
      ancestorVisible = pathNode.initialVisible !== false && ancestorVisible;
      visibleById.set(pathNode.id, ancestorVisible);
    }
    return visibleById.get(start.id) ?? false;
  };
}

export function isEffectivelyInitiallyVisible(scene: readonly SceneNode[], node: SceneNode): boolean {
  const { nodesById, ambiguousIds } = uniqueSceneGraph(scene);
  if (ambiguousIds.has(node.id) || nodesById.get(node.id) !== node) return false;
  return createVisibilityResolver(nodesById)(node);
}

export function motionClosedOffset(
  direction: SlideDirection,
): Readonly<{ x: number; y: number }> {
  return CLOSED_OFFSETS[direction];
}

export function resolveSceneMotion(scene: readonly SceneNode[]): ReadonlyMap<string, ResolvedMotion> {
  const { nodesById, ambiguousIds } = uniqueSceneGraph(scene);
  const sanitizedById = new Map(
    [...nodesById.values()].map(
      (node) => [node.id, sanitizeMotion(node.motion, node.cls)] as const,
    ),
  );
  const preliminaryById = new Map<string, MotionPreset | undefined>();
  const slideBlockedById = new Map<string, boolean>();

  for (const node of nodesById.values()) {
    const storedPreset = sanitizedById.get(node.id)?.preset;
    const parent = node.parentId == null ? undefined : nodesById.get(node.parentId);
    const slideBlocked =
      storedPreset === "slide" && (parent?.layout === "list" || parent?.layout === "grid");
    preliminaryById.set(node.id, slideBlocked ? "fade" : storedPreset);
    slideBlockedById.set(node.id, slideBlocked);
  }

  type FinalizedPreset = {
    effectivePreset?: MotionPreset;
    fadeBlocked: boolean;
    effectiveFadeInAncestors: boolean;
  };
  const finalizedById = new Map<string, FinalizedPreset>();

  const finalizePreset = (node: SceneNode): FinalizedPreset => {
    const cached = finalizedById.get(node.id);
    if (cached) return cached;

    const path: SceneNode[] = [];
    const pathIndex = new Map<string, number>();
    let current: SceneNode | undefined = node;
    let ancestorFinalized: FinalizedPreset | undefined;

    while (current) {
      const currentCached = finalizedById.get(current.id);
      if (currentCached) {
        ancestorFinalized = currentCached;
        break;
      }

      const cycleStart = pathIndex.get(current.id);
      if (cycleStart !== undefined) {
        const cycleNodes = path.splice(cycleStart);
        for (const cycleNode of cycleNodes) {
          finalizedById.set(cycleNode.id, {
            effectivePreset: preliminaryById.get(cycleNode.id),
            fadeBlocked: false,
            effectiveFadeInAncestors: false,
          });
        }
        ancestorFinalized = finalizedById.get(current.id);
        break;
      }

      pathIndex.set(current.id, path.length);
      path.push(current);
      current = current.parentId == null ? undefined : nodesById.get(current.parentId);
    }

    for (let index = path.length - 1; index >= 0; index -= 1) {
      const pathNode = path[index];
      const effectiveFadeInAncestors =
        ancestorFinalized?.effectivePreset === "fade" ||
        ancestorFinalized?.effectiveFadeInAncestors === true;
      const preliminaryPreset = preliminaryById.get(pathNode.id);
      const fadeBlocked = preliminaryPreset === "fade" && effectiveFadeInAncestors;
      ancestorFinalized = {
        effectivePreset: fadeBlocked ? "scale" : preliminaryPreset,
        fadeBlocked,
        effectiveFadeInAncestors,
      };
      finalizedById.set(pathNode.id, ancestorFinalized);
    }

    return finalizedById.get(node.id) ?? {
      effectivePreset: preliminaryById.get(node.id),
      fadeBlocked: false,
      effectiveFadeInAncestors: false,
    };
  };

  const resolveVisibility = createVisibilityResolver(nodesById);
  for (const node of nodesById.values()) resolveVisibility(node);

  const resolved = new Map<string, ResolvedMotion>();
  const resolutionOrder =
    ambiguousIds.size === 0
      ? scene
      : [...scene].sort((left, right) =>
          left.id < right.id ? -1 : left.id > right.id ? 1 : 0,
        );
  for (const node of resolutionOrder) {
    if (resolved.has(node.id)) continue;
    if (ambiguousIds.has(node.id)) {
      resolved.set(
        node.id,
        Object.freeze({
          eligible: false,
          durationMs: MOTION_DEFAULTS.durationMs,
          slideDirection: MOTION_DEFAULTS.slideDirection,
          hover: false,
          slideBlocked: false,
          fadeBlocked: false,
          initialOpen: false,
        }),
      );
      continue;
    }

    const eligible = isMotionClass(node.cls);
    const sanitized = sanitizedById.get(node.id);
    const { effectivePreset, fadeBlocked } = finalizePreset(node);
    const initialOpen = effectivePreset !== undefined && resolveVisibility(node);

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
