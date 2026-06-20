import type { RobloxClass, SceneNode } from "./catalog";
import { sanitizeResponsiveGeometry } from "./geometry";
import { sanitizeLayoutFields } from "./layout";
import { sanitizeRemoteEventAction } from "./remote-events";
import { sanitizeTeleportAction } from "./teleports";
import { FONTS } from "./scene";
import { normalizeRobloxAssetId } from "./image-assets";

const PROJECT_FORMAT = "roblox-gui-maker";
const PROJECT_VERSION = 1;

// Decorators are properties on saved nodes, never standalone scene objects.
const VALID_CLS: ReadonlySet<RobloxClass> = new Set<RobloxClass>([
  "ScreenGui",
  "Frame",
  "TextLabel",
  "TextButton",
  "TextBox",
  "ImageLabel",
  "ScrollingFrame",
]);

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const isFiniteNum = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);
const isHex = (value: unknown): value is string =>
  typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value);

function sanitizeNode(raw: unknown): SceneNode | null {
  if (!raw || typeof raw !== "object") return null;
  const source = raw as Record<string, unknown>;
  if (typeof source.id !== "string" || !source.id) return null;
  if (
    typeof source.cls !== "string" ||
    !VALID_CLS.has(source.cls as RobloxClass)
  ) {
    return null;
  }
  if (typeof source.name !== "string") return null;

  const pos = source.pos as Record<string, unknown> | undefined;
  const size = source.size as Record<string, unknown> | undefined;
  if (!pos || !isFiniteNum(pos.x) || !isFiniteNum(pos.y)) return null;
  if (!size || !isFiniteNum(size.x) || !isFiniteNum(size.y)) return null;
  if (
    !isHex(source.color) ||
    !isFiniteNum(source.transparency) ||
    !isFiniteNum(source.cornerRadius) ||
    !isFiniteNum(source.zindex)
  ) {
    return null;
  }

  const node: SceneNode = {
    id: source.id,
    cls: source.cls as RobloxClass,
    name: source.name,
    parentId:
      typeof source.parentId === "string" || source.parentId === null
        ? source.parentId
        : null,
    pos: { x: clamp01(pos.x), y: clamp01(pos.y) },
    size: { x: clamp01(size.x), y: clamp01(size.y) },
    color: source.color,
    transparency: clamp01(source.transparency),
    cornerRadius: Math.max(0, source.cornerRadius),
    zindex: Math.round(source.zindex),
    ...sanitizeResponsiveGeometry(source),
    ...sanitizeLayoutFields(source, source.cls as RobloxClass),
  };

  if (typeof source.text === "string") node.text = source.text;
  if (
    typeof source.font === "string" &&
    (FONTS as readonly string[]).includes(source.font)
  ) {
    node.font = source.font;
  }
  if (isFiniteNum(source.textSize)) node.textSize = Math.max(1, source.textSize);
  if (isHex(source.textColor)) node.textColor = source.textColor;
  if (isFiniteNum(source.rotation)) {
    node.rotation = Math.max(-360, Math.min(360, source.rotation));
  }

  if (source.cls === "ImageLabel") {
    if (typeof source.image === "string") {
      const image = normalizeRobloxAssetId(source.image);
      if (image) node.image = image;
    }
    if (isHex(source.imageColor)) node.imageColor = source.imageColor;
  }

  if (typeof source.text === "string") {
    if (typeof source.textScaled === "boolean") {
      node.textScaled = source.textScaled;
    }
    if (typeof source.textWrapped === "boolean") {
      node.textWrapped = source.textWrapped;
    }
  }

  const stroke = source.stroke as Record<string, unknown> | undefined;
  if (
    stroke &&
    isHex(stroke.color) &&
    isFiniteNum(stroke.transparency) &&
    isFiniteNum(stroke.thickness)
  ) {
    node.stroke = {
      color: stroke.color,
      transparency: clamp01(stroke.transparency),
      thickness: Math.max(0, Math.min(100, stroke.thickness)),
    };
  }

  const gradient = source.gradient as Record<string, unknown> | undefined;
  if (gradient && isHex(gradient.from) && isHex(gradient.to)) {
    node.gradient = { from: gradient.from, to: gradient.to };
  }
  if (isFiniteNum(source.layoutOrder)) {
    node.layoutOrder = Math.max(0, Math.round(source.layoutOrder));
  }
  if (typeof source.initialVisible === "boolean") {
    node.initialVisible = source.initialVisible;
  }

  if (source.cls === "TextButton") {
    const action = source.action as Record<string, unknown> | undefined;
    if (
      action &&
      (action.type === "show" ||
        action.type === "hide" ||
        action.type === "toggle")
    ) {
      node.action = {
        type: action.type,
        ...(typeof action.targetId === "string"
          ? { targetId: action.targetId }
          : {}),
      };
    } else if (action?.type === "hideGui") {
      node.action = { type: "hideGui" };
    } else {
      const remoteEventAction = sanitizeRemoteEventAction(action);
      const teleportAction = sanitizeTeleportAction(action);
      if (remoteEventAction) node.action = remoteEventAction;
      else if (teleportAction) node.action = teleportAction;
    }
  }

  return node;
}

function repairParents(scene: SceneNode[]): void {
  const nodesById = new Map<string, SceneNode>();
  for (const node of scene) {
    if (!nodesById.has(node.id)) nodesById.set(node.id, node);
  }

  for (const node of scene) {
    if (node.parentId && !nodesById.has(node.parentId)) node.parentId = null;
  }

  for (const node of scene) {
    const chain = new Set<string>([node.id]);
    let currentId = node.parentId;
    let guard = scene.length + 1;
    while (currentId && guard-- > 0) {
      if (chain.has(currentId)) {
        node.parentId = null;
        break;
      }
      chain.add(currentId);
      currentId = nodesById.get(currentId)?.parentId ?? null;
    }
  }
}

export function sanitizeScene(raw: unknown): SceneNode[] | null {
  if (!Array.isArray(raw)) return null;
  const scene = raw
    .map(sanitizeNode)
    .filter((node): node is SceneNode => node !== null);
  if (scene.length === 0) return null;
  repairParents(scene);
  return scene;
}

export function parseSceneDocument(text: string): SceneNode[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("This file is not valid JSON.");
  }

  if (
    !parsed ||
    typeof parsed !== "object" ||
    Array.isArray(parsed) ||
    (parsed as Record<string, unknown>).format !== PROJECT_FORMAT
  ) {
    throw new Error("This is not a Roblox GUI Maker project.");
  }

  const document = parsed as Record<string, unknown>;
  if (document.version !== PROJECT_VERSION) {
    throw new Error(
      `Project version ${String(document.version)} is not supported.`
    );
  }

  const scene = sanitizeScene(document.scene);
  if (!scene) {
    throw new Error("The project contains no valid GUI elements.");
  }
  return scene;
}

export function serializeSceneDocument(scene: SceneNode[]): string {
  return JSON.stringify(
    { format: PROJECT_FORMAT, version: PROJECT_VERSION, scene },
    null,
    2
  );
}

export function sceneDocumentFilename(scene: SceneNode[]): string {
  const root = scene.find(
    (node) => node.cls === "ScreenGui" && !node.parentId
  );
  const slug = root?.name
    .normalize("NFKD")
    .replace(/[^\x00-\x7F]/g, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return slug ? `${slug}.json` : "roblox-gui-project.json";
}
