// Pure scene logic: create a node, and generate clean Luau from the tree.
// No React, no side effects.

import type { RobloxClass, SceneNode } from "./catalog";
import {
  resolveGridLayout,
  resolveListLayout,
  robloxAutomaticCanvasSize,
  robloxHorizontalAlignment,
  robloxListDirection,
  robloxVerticalAlignment,
} from "./layout-config";
import { collectRemoteEventBindings, luauString } from "./remote-events";
import {
  collectTeleportPlaceIds,
  sanitizeTeleportAction,
} from "./teleports";

export const FONTS = [
  "GothamBlack",
  "GothamBold",
  "GothamSemibold",
  "GothamMedium",
  "Gotham",
  "ArialBold",
  "Arial",
  "Code",
  "Highway",
] as const;

type Defaults = {
  pos: { x: number; y: number };
  size: { x: number; y: number };
  color: string;
  transparency: number;
  cornerRadius: number;
  text?: string;
  font?: string;
  textSize?: number;
  textColor?: string;
};

const DEFAULTS: Partial<Record<RobloxClass, Defaults>> = {
  ScreenGui: { pos: { x: 0, y: 0 }, size: { x: 1, y: 1 }, color: "#0c0e17", transparency: 1, cornerRadius: 0 },
  Frame: { pos: { x: 0.36, y: 0.4 }, size: { x: 0.28, y: 0.24 }, color: "#282933", transparency: 0, cornerRadius: 10 },
  TextLabel: { pos: { x: 0.32, y: 0.32 }, size: { x: 0.36, y: 0.07 }, color: "#000000", transparency: 1, cornerRadius: 0, text: "Label", font: "GothamMedium", textSize: 18, textColor: "#e1e1ef" },
  TextButton: { pos: { x: 0.32, y: 0.5 }, size: { x: 0.36, y: 0.09 }, color: "#00a2ff", transparency: 0, cornerRadius: 10, text: "Button", font: "GothamBold", textSize: 18, textColor: "#001d34" },
  TextBox: { pos: { x: 0.32, y: 0.62 }, size: { x: 0.36, y: 0.08 }, color: "#242836", transparency: 0, cornerRadius: 6, text: "Type here...", font: "GothamMedium", textSize: 16, textColor: "#bec7d4" },
  ImageLabel: { pos: { x: 0.36, y: 0.36 }, size: { x: 0.28, y: 0.28 }, color: "#32343e", transparency: 0, cornerRadius: 8 },
  ScrollingFrame: { pos: { x: 0.3, y: 0.28 }, size: { x: 0.4, y: 0.44 }, color: "#1d1f29", transparency: 0, cornerRadius: 8 },
};

const NAMES: Partial<Record<RobloxClass, string>> = {
  ScreenGui: "ScreenGui",
  Frame: "Frame",
  TextLabel: "Label",
  TextButton: "Button",
  TextBox: "Input",
  ImageLabel: "Image",
  ScrollingFrame: "List",
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

export function createNode(
  cls: RobloxClass,
  scene: SceneNode[],
  parentId: string | null = null
): SceneNode {
  const fallback: Defaults = { pos: { x: 0.4, y: 0.4 }, size: { x: 0.4, y: 0.2 }, color: "#282933", transparency: 0, cornerRadius: 8 };
  const d = DEFAULTS[cls] ?? fallback;
  const z = scene.reduce((m, n) => Math.max(m, n.zindex), 0) + 1;
  const off = (scene.filter((n) => n.cls === cls).length % 5) * 0.02;
  const layoutOrder = scene.length;
  return {
    id: crypto.randomUUID(),
    cls,
    name: NAMES[cls] ?? cls,
    parentId,
    pos: { x: clamp01(d.pos.x + off), y: clamp01(d.pos.y + off) },
    size: { ...d.size },
    color: d.color,
    transparency: d.transparency,
    cornerRadius: d.cornerRadius,
    zindex: z,
    layoutOrder,
    ...(d.text !== undefined ? { text: d.text } : {}),
    ...(d.font !== undefined ? { font: d.font } : {}),
    ...(d.textSize !== undefined ? { textSize: d.textSize } : {}),
    ...(d.textColor !== undefined ? { textColor: d.textColor } : {}),
  };
}

// Deep-clone a node and its descendants with fresh ids, remapping parentId
// within the subtree so cloned children point to cloned parents. Offset and
// raise z so the duplicate sits beside and on top of the original.
export function duplicateSubtree(
  scene: SceneNode[],
  id: string
): { nodes: SceneNode[]; newId: string } | null {
  const target = scene.find((n) => n.id === id);
  if (!target) return null;

  const subtree: SceneNode[] = [target];
  const seen = new Set<string>([target.id]);
  const collect = (parentId: string) => {
    for (const n of scene) {
      if ((n.parentId ?? null) === parentId && !seen.has(n.id)) {
        seen.add(n.id);
        subtree.push(n);
        collect(n.id);
      }
    }
  };
  collect(target.id);

  const idMap = new Map<string, string>();
  for (const n of subtree) idMap.set(n.id, crypto.randomUUID());

  const maxZ = scene.reduce((m, n) => Math.max(m, n.zindex), 0);
  const nodes = subtree.map((n) => ({
    ...n,
    pos: { x: clamp01(n.pos.x + 0.03), y: clamp01(n.pos.y + 0.03) },
    size: { ...n.size },
    ...(n.posOffset ? { posOffset: { ...n.posOffset } } : {}),
    ...(n.sizeOffset ? { sizeOffset: { ...n.sizeOffset } } : {}),
    ...(n.anchor ? { anchor: { ...n.anchor } } : {}),
    ...(n.minSize ? { minSize: { ...n.minSize } } : {}),
    ...(n.maxSize ? { maxSize: { ...n.maxSize } } : {}),
    ...(n.listGap ? { listGap: { ...n.listGap } } : {}),
    ...(n.gridCellSize
      ? {
          gridCellSize: {
            scale: { ...n.gridCellSize.scale },
            offset: { ...n.gridCellSize.offset },
          },
        }
      : {}),
    ...(n.gridCellPadding
      ? {
          gridCellPadding: {
            scale: { ...n.gridCellPadding.scale },
            offset: { ...n.gridCellPadding.offset },
          },
        }
      : {}),
    ...(n.gradient ? { gradient: { ...n.gradient } } : {}),
    ...(n.stroke ? { stroke: { ...n.stroke } } : {}),
    ...(n.action ? { action: { ...n.action } } : {}),
    ...(n.motion ? { motion: { ...n.motion } } : {}),
    id: idMap.get(n.id)!,
    parentId: n.parentId ? idMap.get(n.parentId) ?? n.parentId : n.parentId,
    zindex: maxZ + 1,
    layoutOrder:
      n.id === target.id
        ? scene.length
        : n.layoutOrder,
  }));

  return { nodes, newId: idMap.get(target.id)! };
}

export type PreviewVisibility = Record<string, boolean>;

export function createPreviewVisibility(scene: readonly SceneNode[]): PreviewVisibility {
  return Object.fromEntries(scene.map((node) => [node.id, node.initialVisible !== false]));
}

export type PreviewVisibilityActionTarget = Readonly<{
  targetId: string;
  request: "show" | "hide" | "toggle";
}>;

export function findUniqueSceneNode(
  scene: readonly SceneNode[],
  nodeId: string,
): SceneNode | null {
  let found: SceneNode | null = null;
  for (const node of scene) {
    if (node.id !== nodeId) continue;
    if (found) return null;
    found = node;
  }
  return found;
}

export function resolvePreviewActionTarget(
  scene: readonly SceneNode[],
  buttonId: string,
): PreviewVisibilityActionTarget | null {
  const button = findUniqueSceneNode(scene, buttonId);
  if (button?.cls !== "TextButton") return null;
  const action = button.action;
  if (
    !action ||
    (action.type !== "show" && action.type !== "hide" && action.type !== "toggle") ||
    typeof action.targetId !== "string"
  ) {
    return null;
  }

  const target = findUniqueSceneNode(scene, action.targetId);
  return target && (target.cls === "Frame" || target.cls === "ScrollingFrame")
    ? { targetId: target.id, request: action.type }
    : null;
}

export function applyPreviewAction(
  scene: SceneNode[],
  visibility: PreviewVisibility,
  buttonId: string
): PreviewVisibility {
  const action = scene.find((node) => node.id === buttonId)?.action;
  if (!action) return visibility;

  if (action.type === "hideGui") {
    const root = scene.find((node) => node.cls === "ScreenGui" && !node.parentId);
    return root ? { ...visibility, [root.id]: false } : visibility;
  }
  if (action.type === "remoteEvent" || action.type === "teleport") {
    return visibility;
  }

  const target = scene.find(
    (node) =>
      node.id === action.targetId &&
      (node.cls === "Frame" || node.cls === "ScrollingFrame")
  );
  if (!target) return visibility;

  const visible = visibility[target.id] ?? target.initialVisible !== false;
  return {
    ...visibility,
    [target.id]: action.type === "show" ? true : action.type === "hide" ? false : !visible,
  };
}

export function previewActionNotice(
  scene: readonly SceneNode[],
  buttonId: string
): string | null {
  const action = scene.find((node) => node.id === buttonId)?.action;
  if (action?.type === "remoteEvent") {
    return "RemoteEvent actions run in Roblox Studio.";
  }
  if (action?.type === "teleport") {
    return `Teleport to Place ${action.placeId}. Preview does not run live teleports.`;
  }
  return null;
}

export function removeSubtree(scene: SceneNode[], id: string): SceneNode[] {
  const doomed = new Set<string>([id]);
  let foundChild = true;
  while (foundChild) {
    foundChild = false;
    for (const node of scene) {
      if (node.parentId && doomed.has(node.parentId) && !doomed.has(node.id)) {
        doomed.add(node.id);
        foundChild = true;
      }
    }
  }

  return scene
    .filter((node) => !doomed.has(node.id))
    .map((node) =>
      node.action &&
      (node.action.type === "show" ||
        node.action.type === "hide" ||
        node.action.type === "toggle") &&
      node.action.targetId &&
      doomed.has(node.action.targetId)
        ? { ...node, action: undefined }
        : node
    );
}

export function orderedChildren(
  scene: SceneNode[],
  parentId: string | null
): SceneNode[] {
  const index = new Map(scene.map((node, position) => [node.id, position]));
  return scene
    .filter((node) => (node.parentId ?? null) === parentId)
    .sort((a, b) => {
      const aOrder = a.layoutOrder ?? index.get(a.id) ?? 0;
      const bOrder = b.layoutOrder ?? index.get(b.id) ?? 0;
      return aOrder - bOrder || (index.get(a.id) ?? 0) - (index.get(b.id) ?? 0);
    });
}

export function reparentNode(
  scene: SceneNode[],
  nodeId: string,
  parentId: string
): SceneNode[] {
  const moving = scene.find((node) => node.id === nodeId);
  const parent = scene.find((node) => node.id === parentId);
  if (
    !moving ||
    !parent ||
    moving.cls === "ScreenGui" ||
    moving.id === parent.id ||
    moving.parentId === parent.id ||
    (parent.cls !== "ScreenGui" && parent.cls !== "Frame" && parent.cls !== "ScrollingFrame")
  ) {
    return scene;
  }

  let ancestor: SceneNode | undefined = parent;
  const seenAncestors = new Set<string>();
  while (ancestor) {
    if (ancestor.id === moving.id) return scene;
    if (seenAncestors.has(ancestor.id)) return scene;
    seenAncestors.add(ancestor.id);
    ancestor = ancestor.parentId
      ? scene.find((node) => node.id === ancestor?.parentId)
      : undefined;
  }

  const oldParentId = moving.parentId ?? null;
  const oldSiblings = orderedChildren(scene, oldParentId).filter((node) => node.id !== moving.id);
  const newSiblings = [
    ...orderedChildren(scene, parent.id).filter((node) => node.id !== moving.id),
    moving,
  ];
  const orderById = new Map<string, number>();
  oldSiblings.forEach((node, order) => orderById.set(node.id, order));
  newSiblings.forEach((node, order) => orderById.set(node.id, order));

  return scene.map((node) => {
    if (node.id === moving.id) {
      return { ...node, parentId: parent.id, layoutOrder: orderById.get(node.id) };
    }
    return orderById.has(node.id)
      ? { ...node, layoutOrder: orderById.get(node.id) }
      : node;
  });
}

export function reorderSibling(
  scene: SceneNode[],
  nodeId: string,
  targetId: string,
  position: "before" | "after"
): SceneNode[] {
  const moving = scene.find((node) => node.id === nodeId);
  const target = scene.find((node) => node.id === targetId);
  if (
    !moving ||
    !target ||
    moving.id === target.id ||
    moving.cls === "ScreenGui" ||
    (moving.parentId ?? null) !== (target.parentId ?? null)
  ) {
    return scene;
  }

  const parentId = moving.parentId ?? null;
  const siblings = orderedChildren(scene, parentId).filter((node) => node.id !== moving.id);
  const targetIndex = siblings.findIndex((node) => node.id === target.id);
  if (targetIndex < 0) return scene;
  siblings.splice(position === "before" ? targetIndex : targetIndex + 1, 0, moving);
  const orderById = new Map(siblings.map((node, order) => [node.id, order]));
  return scene.map((node) =>
    orderById.has(node.id) ? { ...node, layoutOrder: orderById.get(node.id) } : node
  );
}

// ---- Luau generation -------------------------------------------------------

const fmt = (n: number) => Number(n.toFixed(3)).toString();
const vector2 = (vector: { x: number; y: number }) =>
  `Vector2.new(${fmt(vector.x)}, ${fmt(vector.y)})`;
const udim2 = (
  scale: { x: number; y: number },
  offset: { x: number; y: number } = { x: 0, y: 0 }
) =>
  `UDim2.new(${fmt(scale.x)}, ${fmt(offset.x)}, ${fmt(scale.y)}, ${fmt(offset.y)})`;
const layoutNumber = (n: number) => (Object.is(n, -0) ? "0" : n.toString());
const layoutUdim = (value: { scale: number; offset: number }) =>
  `UDim.new(${layoutNumber(value.scale)}, ${layoutNumber(value.offset)})`;
const layoutUdim2 = (
  scale: { x: number; y: number },
  offset: { x: number; y: number }
) =>
  `UDim2.new(${layoutNumber(scale.x)}, ${layoutNumber(offset.x)}, ${layoutNumber(scale.y)}, ${layoutNumber(offset.y)})`;
function color3(hex: string): string {
  const m = /^#?([0-9a-f]{6})$/i.exec((hex ?? "").trim());
  if (!m) return "Color3.fromRGB(255, 255, 255)";
  const n = parseInt(m[1], 16);
  return `Color3.fromRGB(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
}

const fontEnum = (font?: string) =>
  `Enum.Font.${font && (FONTS as readonly string[]).includes(font) ? font : "GothamMedium"}`;

// Lighten (pct > 0) or darken (pct < 0) a hex color by a percentage of 255.
export function shade(hex: string, pct: number): string {
  const m = /^#?([0-9a-f]{6})$/i.exec((hex ?? "").trim());
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const adj = (c: number) =>
    Math.max(0, Math.min(255, Math.round(c + (pct / 100) * 255)));
  const toHex = (v: number) => v.toString(16).padStart(2, "0");
  return `#${toHex(adj((n >> 16) & 255))}${toHex(adj((n >> 8) & 255))}${toHex(
    adj(n & 255)
  )}`;
}

export function generateLuau(scene: SceneNode[]): string {
  const out: string[] = ["-- Generated by Roblox GUI Maker"];
  out.push('local player = game:GetService("Players").LocalPlayer');

  const childrenOf = (id: string | null) => orderedChildren(scene, id);
  const rootGui = scene.find(
    (n) => n.cls === "ScreenGui" && (n.parentId ?? null) === null
  );

  const varNames = new Map<string, string>();
  let counter = 0;
  const nameOf = (id: string) => {
    let v = varNames.get(id);
    if (!v) {
      v = `el${counter++}`;
      varNames.set(id, v);
    }
    return v;
  };

  const emitLayout = (node: SceneNode, parentVar: string) => {
    if (node.layout === "list") {
      const layout = resolveListLayout(node);
      out.push("");
      out.push(`local ${parentVar}_list = Instance.new("UIListLayout")`);
      out.push(
        `${parentVar}_list.FillDirection = Enum.FillDirection.${robloxListDirection(layout.direction)}`
      );
      out.push(`${parentVar}_list.Padding = ${layoutUdim(layout.gap)}`);
      out.push(
        `${parentVar}_list.HorizontalAlignment = Enum.HorizontalAlignment.${robloxHorizontalAlignment(layout.horizontalAlignment)}`
      );
      out.push(
        `${parentVar}_list.VerticalAlignment = Enum.VerticalAlignment.${robloxVerticalAlignment(layout.verticalAlignment)}`
      );
      out.push(`${parentVar}_list.SortOrder = Enum.SortOrder.LayoutOrder`);
      out.push(`${parentVar}_list.Parent = ${parentVar}`);
    }
    if (node.layout === "grid") {
      const layout = resolveGridLayout(node);
      out.push("");
      out.push(`local ${parentVar}_grid = Instance.new("UIGridLayout")`);
      out.push(
        `${parentVar}_grid.CellSize = ${layoutUdim2(layout.cellSize.scale, layout.cellSize.offset)}`
      );
      out.push(
        `${parentVar}_grid.CellPadding = ${layoutUdim2(layout.cellPadding.scale, layout.cellPadding.offset)}`
      );
      out.push(
        `${parentVar}_grid.HorizontalAlignment = Enum.HorizontalAlignment.${robloxHorizontalAlignment(layout.horizontalAlignment)}`
      );
      out.push(
        `${parentVar}_grid.VerticalAlignment = Enum.VerticalAlignment.${robloxVerticalAlignment(layout.verticalAlignment)}`
      );
      out.push(`${parentVar}_grid.SortOrder = Enum.SortOrder.LayoutOrder`);
      out.push(`${parentVar}_grid.Parent = ${parentVar}`);
    }
  };

  const emitPadding = (node: SceneNode, parentVar: string) => {
    if (!node.padding) return;
    out.push("");
    out.push(`local ${parentVar}_pad = Instance.new("UIPadding")`);
    out.push(`${parentVar}_pad.PaddingTop = UDim.new(0, ${node.padding})`);
    out.push(`${parentVar}_pad.PaddingBottom = UDim.new(0, ${node.padding})`);
    out.push(`${parentVar}_pad.PaddingLeft = UDim.new(0, ${node.padding})`);
    out.push(`${parentVar}_pad.PaddingRight = UDim.new(0, ${node.padding})`);
    out.push(`${parentVar}_pad.Parent = ${parentVar}`);
  };

  const rootHasEffectivePadding =
    typeof rootGui?.padding === "number" &&
    Number.isFinite(rootGui.padding) &&
    rootGui.padding > 0;
  const rootUsesContent = Boolean(rootGui?.layout) || rootHasEffectivePadding;

  // Always emit a ScreenGui wrapper parented to PlayerGui.
  out.push('local gui = Instance.new("ScreenGui")');
  if (rootGui) {
    out.push(`gui.Name = ${luauString(rootGui.name)}`);
    out.push("gui.ResetOnSpawn = false");
    out.push("gui.IgnoreGuiInset = true");
    varNames.set(rootGui.id, rootUsesContent ? "gui_content" : "gui");
  }
  out.push('gui.Parent = player:WaitForChild("PlayerGui")');
  if (rootGui && rootUsesContent) {
    out.push("");
    out.push('local gui_content = Instance.new("Frame")');
    out.push("gui_content.Size = UDim2.fromScale(1, 1)");
    out.push("gui_content.BackgroundTransparency = 1");
    out.push("gui_content.Parent = gui");
    emitLayout(rootGui, "gui_content");
    if (rootHasEffectivePadding) emitPadding(rootGui, "gui_content");
  }

  // ScreenGui has no background in Roblox; if the root carried visual styling
  // (e.g. the loading-screen gradient), reproduce it on a full-screen Frame.
  if (rootGui && (rootGui.transparency < 1 || rootGui.gradient)) {
    out.push("");
    out.push('local gui_bg = Instance.new("Frame")');
    out.push("gui_bg.Size = UDim2.fromScale(1, 1)");
    out.push("gui_bg.Position = UDim2.fromScale(0, 0)");
    out.push(`gui_bg.BackgroundColor3 = ${color3(rootGui.color)}`);
    out.push(`gui_bg.BackgroundTransparency = ${fmt(rootGui.transparency)}`);
    out.push("gui_bg.ZIndex = 0");
    if (rootGui.gradient) {
      out.push('local gui_bg_grad = Instance.new("UIGradient")');
      out.push(`gui_bg_grad.Color = ColorSequence.new(${color3(rootGui.gradient.from)}, ${color3(rootGui.gradient.to)})`);
      out.push("gui_bg_grad.Rotation = 45");
      out.push("gui_bg_grad.Parent = gui_bg");
    }
    out.push("gui_bg.Parent = gui");
  }

  const visited = new Set<string>();
  const emittedNodes = new Set<SceneNode>();
  const emit = (node: SceneNode, parentVar: string) => {
    if (visited.has(node.id)) return; // cycle guard against malformed scenes
    visited.add(node.id);
    emittedNodes.add(node);
    const v = nameOf(node.id);
    out.push("");
    out.push(`local ${v} = Instance.new(${luauString(node.cls)})`);
    out.push(`${v}.Name = ${luauString(node.name)}`);
    out.push(`${v}.Size = ${udim2(node.size, node.sizeOffset)}`);
    out.push(`${v}.Position = ${udim2(node.pos, node.posOffset)}`);
    if (node.anchor && (node.anchor.x !== 0 || node.anchor.y !== 0)) {
      out.push(`${v}.AnchorPoint = ${vector2(node.anchor)}`);
    }
    if (node.rotation) out.push(`${v}.Rotation = ${fmt(node.rotation)}`);
    if (node.transparency >= 1) {
      out.push(`${v}.BackgroundTransparency = 1`);
    } else {
      out.push(`${v}.BackgroundColor3 = ${color3(node.color)}`);
      out.push(`${v}.BackgroundTransparency = ${fmt(node.transparency)}`);
    }
    out.push(`${v}.ZIndex = ${node.zindex}`);
    const siblingOrder = childrenOf(node.parentId ?? null).findIndex((sibling) => sibling.id === node.id);
    out.push(`${v}.LayoutOrder = ${siblingOrder}`);

    const automaticCanvasSize = node.automaticCanvasSize ?? "none";
    if (node.cls === "ScrollingFrame" && automaticCanvasSize !== "none") {
      out.push(
        `${v}.AutomaticCanvasSize = Enum.AutomaticSize.${robloxAutomaticCanvasSize(automaticCanvasSize)}`
      );
      out.push(`${v}.CanvasSize = UDim2.fromScale(0, 0)`);
    }

    if (node.cls === "ImageLabel") {
      if (node.image) out.push(`${v}.Image = ${luauString(node.image)}`);
      if (node.imageColor) {
        out.push(`${v}.ImageColor3 = ${color3(node.imageColor)}`);
      }
    }

    if (node.cornerRadius > 0) {
      out.push("");
      out.push(`local ${v}_corner = Instance.new("UICorner")`);
      out.push(`${v}_corner.CornerRadius = UDim.new(0, ${node.cornerRadius})`);
      out.push(`${v}_corner.Parent = ${v}`);
    }
    if (node.gradient) {
      out.push("");
      out.push(`local ${v}_grad = Instance.new("UIGradient")`);
      out.push(
        `${v}_grad.Color = ColorSequence.new(${color3(node.gradient.from)}, ${color3(node.gradient.to)})`
      );
      out.push(`${v}_grad.Rotation = 45`);
      out.push(`${v}_grad.Parent = ${v}`);
    }
    if (node.stroke) {
      out.push("");
      out.push(`local ${v}_stroke = Instance.new("UIStroke")`);
      out.push(`${v}_stroke.Color = ${color3(node.stroke.color)}`);
      out.push(
        `${v}_stroke.Transparency = ${fmt(node.stroke.transparency)}`
      );
      out.push(`${v}_stroke.Thickness = ${fmt(node.stroke.thickness)}`);
      out.push(`${v}_stroke.Parent = ${v}`);
    }
    emitLayout(node, v);
    emitPadding(node, v);
    if (node.text != null) {
      out.push(`${v}.Text = ${luauString(node.text)}`);
      out.push(`${v}.Font = ${fontEnum(node.font)}`);
      out.push(`${v}.TextSize = ${node.textSize ?? 14}`);
      out.push(`${v}.TextColor3 = ${color3(node.textColor ?? "#e1e1ef")}`);
      if (node.textScaled) out.push(`${v}.TextScaled = true`);
      if (node.textWrapped) out.push(`${v}.TextWrapped = true`);
    }
    if (node.initialVisible === false) out.push(`${v}.Visible = false`);

    if (node.aspectRatio) {
      out.push("");
      out.push(`local ${v}_aspect = Instance.new("UIAspectRatioConstraint")`);
      out.push(`${v}_aspect.AspectRatio = ${fmt(node.aspectRatio)}`);
      out.push(`${v}_aspect.DominantAxis = Enum.DominantAxis.Width`);
      out.push(`${v}_aspect.Parent = ${v}`);
    }
    if (node.minSize || node.maxSize) {
      out.push("");
      out.push(`local ${v}_size = Instance.new("UISizeConstraint")`);
      if (node.minSize) out.push(`${v}_size.MinSize = ${vector2(node.minSize)}`);
      if (node.maxSize) out.push(`${v}_size.MaxSize = ${vector2(node.maxSize)}`);
      out.push(`${v}_size.Parent = ${v}`);
    }

    out.push(`${v}.Parent = ${parentVar}`);

    for (const child of childrenOf(node.id)) emit(child, v);
  };

  // Root children use its mapped content container; other top-level nodes use gui.
  for (const n of childrenOf(null)) {
    if (n === rootGui) {
      const rootParentVar = varNames.get(n.id) ?? "gui";
      for (const child of childrenOf(n.id)) emit(child, rootParentVar);
    } else {
      emit(n, "gui");
    }
  }

  const emittedScene = scene.filter((node) => emittedNodes.has(node));
  const remoteBindings = collectRemoteEventBindings(emittedScene);
  const teleportPlaceIds = collectTeleportPlaceIds(emittedScene);
  if (remoteBindings.length > 0 || teleportPlaceIds.length > 0) {
    out.push("");
    out.push('local ReplicatedStorage = game:GetService("ReplicatedStorage")');
  }
  if (remoteBindings.length > 0) {
    out.push('local remotes = ReplicatedStorage:WaitForChild("Remotes")');
    for (const binding of remoteBindings) {
      out.push(
        `local ${binding.variable} = remotes:WaitForChild(${luauString(binding.eventName)})`
      );
    }
  }
  if (teleportPlaceIds.length > 0) {
    out.push('local rgm = ReplicatedStorage:WaitForChild("RGM")');
    out.push('local teleportRequest = rgm:WaitForChild("TeleportRequest")');
  }

  for (const node of scene) {
    if (node.cls !== "TextButton" || !node.action || !emittedNodes.has(node)) continue;
    const buttonVar = varNames.get(node.id);
    if (!buttonVar) continue;

    let statement: string | null = null;
    if (node.action.type === "hideGui") {
      statement = "gui.Enabled = false";
    } else if (node.action.type === "remoteEvent") {
      const eventName = node.action.eventName;
      const binding = remoteBindings.find(
        (candidate) => candidate.eventName === eventName
      );
      if (binding) {
        statement = `${binding.variable}:FireServer(${luauString(node.action.argument)})`;
      }
    } else if (node.action.type === "teleport") {
      const action = sanitizeTeleportAction(node.action);
      if (action && teleportPlaceIds.includes(action.placeId)) {
        statement = `teleportRequest:FireServer(${luauString(action.placeId)})`;
      }
    } else {
      const action = node.action;
      const target = scene.find(
        (candidate) =>
          candidate.id === action.targetId &&
          (candidate.cls === "Frame" || candidate.cls === "ScrollingFrame")
      );
      const targetVar = target ? varNames.get(target.id) : undefined;
      if (targetVar) {
        statement =
          action.type === "show"
            ? `${targetVar}.Visible = true`
            : action.type === "hide"
              ? `${targetVar}.Visible = false`
              : `${targetVar}.Visible = not ${targetVar}.Visible`;
      }
    }
    if (!statement) continue;

    out.push("");
    out.push(`${buttonVar}.Activated:Connect(function()`);
    out.push(`\t${statement}`);
    out.push("end)");
  }

  return out.join("\n");
}
