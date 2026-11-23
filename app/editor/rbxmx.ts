// Deterministic Roblox Studio model (.rbxmx) export: converts a scene tree into
// native Roblox XML <Item> nodes (plus the interactive LocalScript when any
// button declares an action), so the file can be dragged straight into
// StarterGui — no runtime builder script, fully deterministic referent ids.

import type { Gradient, NodeAction, SceneNode, Transition } from "./catalog";
import { gridLayoutFor } from "./grid-layout";
import { kitScene, type Kit } from "./kits";
import { collectRemoteEventBindings, luauString } from "./remote-events";
import { orderedChildren } from "./scene";
import { sceneDocumentFilename } from "./persistence";
import { sanitizeTeleportAction, teleportButtons } from "./teleports";

const ROBLOX_XML_OPEN =
  '<roblox xmlns:xmime="http://www.w3.org/2005/05/xmlmime" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://www.roblox.com/roblox.xsd" version="4">';

const TEXT_CLASSES = new Set(["TextLabel", "TextButton", "TextBox"]);

// Kit screens on these templates are always-on overlays; every other screen is
// a switchable page (screen 0 enabled, the rest start disabled).
const HUD_TEMPLATES = new Set(["quest-tracker", "health-bar", "notification-toast"]);

type ReferentCounter = { next: () => string };
type LocalScriptSpec = { name: string; source: string };

function createReferentCounter(): ReferentCounter {
  let emitted = 0;
  return {
    next: () => {
      emitted += 1;
      return `RBX${String(emitted).padStart(4, "0")}`;
    },
  };
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function xmlNumber(value: number): string {
  return Number(value.toFixed(6)).toString();
}

function color3Channels(hex: string): [string, string, string] {
  const match = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) {
    throw new Error(`rbxmx export: "${hex}" is not a valid #rrggbb color`);
  }
  const rgb = parseInt(match[1], 16);
  const channel = (shift: number) => (((rgb >> shift) & 255) / 255).toFixed(4);
  return [channel(16), channel(8), channel(0)];
}

function color3Xml(name: string, hex: string, indent: string): string {
  const [r, g, b] = color3Channels(hex);
  return `${indent}<Color3 name="${name}"><R>${r}</R><G>${g}</G><B>${b}</B></Color3>`;
}

function udim2Xml(
  name: string,
  scale: { x: number; y: number },
  offset: { x: number; y: number },
  indent: string
): string {
  return (
    `${indent}<UDim2 name="${name}">` +
    `<XS>${xmlNumber(scale.x)}</XS><XO>${xmlNumber(offset.x)}</XO>` +
    `<YS>${xmlNumber(scale.y)}</YS><YO>${xmlNumber(offset.y)}</YO></UDim2>`
  );
}

function vector2Xml(
  name: string,
  vector: { x: number; y: number },
  indent: string
): string {
  return (
    `${indent}<Vector2 name="${name}">` +
    `<X>${xmlNumber(vector.x)}</X><Y>${xmlNumber(vector.y)}</Y></Vector2>`
  );
}

// ColorSequence body: "time r g b 0" per keypoint in ascending order, with the
// 0 and 1 endpoints guaranteed so Roblox accepts the sequence.
function colorSequenceXml(grad: Gradient): string {
  const stops = [...grad.stops].sort((a, b) => a.at - b.at);
  if (stops.length === 0) {
    throw new Error("rbxmx export: gradient has no stops");
  }
  const keypoints = [...stops];
  if (keypoints[0].at > 0) {
    keypoints.unshift({ at: 0, color: keypoints[0].color });
  }
  if (keypoints[keypoints.length - 1].at < 1) {
    keypoints.push({ at: 1, color: keypoints[keypoints.length - 1].color });
  }
  return keypoints
    .map((stop) => {
      const [r, g, b] = color3Channels(stop.color);
      return `${xmlNumber(stop.at)} ${r} ${g} ${b} 0`;
    })
    .join(" ");
}

const FONT_FACES: Record<string, { family: string; weight: number }> = {
  GothamBlack: { family: "GothamSSm", weight: 900 },
  GothamBold: { family: "GothamSSm", weight: 700 },
  GothamSemibold: { family: "GothamSSm", weight: 600 },
  GothamMedium: { family: "GothamSSm", weight: 500 },
  Gotham: { family: "GothamSSm", weight: 400 },
  ArialBold: { family: "arial", weight: 700 },
  Arial: { family: "arial", weight: 400 },
  Code: { family: "Inconsolata", weight: 400 },
  Highway: { family: "HighwayGothic", weight: 400 },
};

function fontFaceXml(font: string | undefined, indent: string): string {
  const face =
    (font !== undefined && FONT_FACES[font]) || FONT_FACES.GothamMedium;
  return (
    `${indent}<Font name="FontFace">` +
    `<Family><url>rbxasset://fonts/families/${face.family}.json</url></Family>` +
    `<Weight>${face.weight}</Weight><Style>Normal</Style></Font>`
  );
}

// ---- Scene tree → XML Items -------------------------------------------------

function siblingIndex(scene: SceneNode[], node: SceneNode): number {
  return orderedChildren(scene, node.parentId ?? null).findIndex(
    (sibling) => sibling.id === node.id
  );
}

function emitGradientItem(
  grad: Gradient,
  lines: string[],
  referentCounter: ReferentCounter,
  depth: number
): void {
  const indent = "  ".repeat(depth);
  const propIndent = "  ".repeat(depth + 2);
  lines.push(`${indent}<Item class="UIGradient" referent="${referentCounter.next()}">`);
  lines.push(`${indent}  <Properties>`);
  lines.push(
    `${propIndent}<ColorSequence name="Color">${colorSequenceXml(grad)}</ColorSequence>`
  );
  lines.push(`${propIndent}<float name="Rotation">${xmlNumber(grad.rotation ?? 0)}</float>`);
  lines.push(`${indent}  </Properties>`);
  lines.push(`${indent}</Item>`);
}

function emitScreenBackground(
  rootGui: SceneNode,
  lines: string[],
  referentCounter: ReferentCounter
): void {
  const depth = 1;
  const indent = "  ".repeat(depth);
  const propIndent = "  ".repeat(depth + 2);
  lines.push(`${indent}<Item class="Frame" referent="${referentCounter.next()}">`);
  lines.push(`${indent}  <Properties>`);
  lines.push(`${propIndent}<string name="Name">ScreenBackground</string>`);
  lines.push(`${propIndent}<bool name="Visible">true</bool>`);
  lines.push(`${propIndent}${udim2Xml("Position", { x: 0, y: 0 }, { x: 0, y: 0 }, "")}`);
  lines.push(`${propIndent}${udim2Xml("Size", { x: 1, y: 1 }, { x: 0, y: 0 }, "")}`);
  lines.push(`${propIndent}${vector2Xml("AnchorPoint", { x: 0, y: 0 }, "")}`);
  lines.push(`${propIndent}<float name="Rotation">0</float>`);
  lines.push(color3Xml("BackgroundColor3", rootGui.color, propIndent));
  lines.push(
    `${propIndent}<float name="BackgroundTransparency">${xmlNumber(rootGui.transparency)}</float>`
  );
  lines.push(`${propIndent}<int name="BorderSizePixel">0</int>`);
  lines.push(`${propIndent}<int name="ZIndex">0</int>`);
  lines.push(`${indent}  </Properties>`);
  if (rootGui.gradient) {
    emitGradientItem(rootGui.gradient, lines, referentCounter, depth + 1);
  }
  lines.push(`${indent}</Item>`);
}

function emitSceneNode(
  node: SceneNode,
  scene: SceneNode[],
  lines: string[],
  referentCounter: ReferentCounter,
  visited: Set<string>,
  depth: number
): void {
  if (visited.has(node.id)) return;
  visited.add(node.id);

  const indent = "  ".repeat(depth);
  const propIndent = "  ".repeat(depth + 2);

  lines.push(`${indent}<Item class="${node.cls}" referent="${referentCounter.next()}">`);
  lines.push(`${indent}  <Properties>`);
  lines.push(`${propIndent}<string name="Name">${escapeXml(node.name)}</string>`);
  lines.push(
    `${propIndent}${udim2Xml("Position", node.pos, node.posOffset ?? { x: 0, y: 0 }, "")}`
  );
  lines.push(
    `${propIndent}${udim2Xml("Size", node.size, node.sizeOffset ?? { x: 0, y: 0 }, "")}`
  );
  lines.push(`${propIndent}${vector2Xml("AnchorPoint", node.anchor ?? { x: 0, y: 0 }, "")}`);
  lines.push(`${propIndent}<float name="Rotation">${xmlNumber(node.rotation ?? 0)}</float>`);
  lines.push(color3Xml("BackgroundColor3", node.color, propIndent));
  lines.push(
    `${propIndent}<float name="BackgroundTransparency">${xmlNumber(node.transparency)}</float>`
  );
  lines.push(`${propIndent}<int name="BorderSizePixel">0</int>`);
  lines.push(`${propIndent}<int name="ZIndex">${node.zindex}</int>`);
  lines.push(`${propIndent}<int name="LayoutOrder">${siblingIndex(scene, node)}</int>`);
  lines.push(`${propIndent}<bool name="Visible">${node.initialVisible !== false}</bool>`);

  if (TEXT_CLASSES.has(node.cls)) {
    lines.push(`${propIndent}<string name="Text">${escapeXml(node.text ?? "")}</string>`);
    lines.push(`${propIndent}<float name="TextSize">${xmlNumber(node.textSize ?? 14)}</float>`);
    lines.push(color3Xml("TextColor3", node.textColor ?? "#e1e1ef", propIndent));
    lines.push(`${propIndent}<bool name="TextScaled">${node.textScaled === true}</bool>`);
    lines.push(`${propIndent}<bool name="TextWrapped">${node.textWrapped === true}</bool>`);
    lines.push(fontFaceXml(node.font, propIndent));
  }
  if (node.cls === "ScrollingFrame") {
    lines.push(
      `${propIndent}${udim2Xml("CanvasSize", { x: 0, y: 2 }, { x: 0, y: 0 }, "")}`
    );
    lines.push(`${propIndent}<int name="ScrollBarThickness">6</int>`);
  }
  if (node.cls === "ImageLabel") {
    lines.push(
      `${propIndent}<Content name="Image"><url>${escapeXml(node.image ?? "")}</url></Content>`
    );
    lines.push(color3Xml("ImageColor3", node.imageColor ?? "#ffffff", propIndent));
  }
  lines.push(`${indent}  </Properties>`);

  for (const child of orderedChildren(scene, node.id)) {
    emitSceneNode(child, scene, lines, referentCounter, visited, depth + 1);
  }

  if (node.cornerRadius > 0) {
    lines.push(`${indent}  <Item class="UICorner" referent="${referentCounter.next()}">`);
    lines.push(`${indent}    <Properties>`);
    lines.push(
      `${propIndent}<UDim name="CornerRadius"><S>0</S><O>${xmlNumber(node.cornerRadius)}</O></UDim>`
    );
    lines.push(`${indent}    </Properties>`);
    lines.push(`${indent}  </Item>`);
  }
  if (node.gradient) {
    emitGradientItem(node.gradient, lines, referentCounter, depth + 1);
  }
  if (node.stroke) {
    lines.push(`${indent}  <Item class="UIStroke" referent="${referentCounter.next()}">`);
    lines.push(`${indent}    <Properties>`);
    lines.push(color3Xml("Color", node.stroke.color, propIndent));
    lines.push(
      `${propIndent}<float name="Transparency">${xmlNumber(node.stroke.transparency)}</float>`
    );
    lines.push(`${propIndent}<float name="Thickness">${xmlNumber(node.stroke.thickness)}</float>`);
    lines.push(`${indent}    </Properties>`);
    lines.push(`${indent}  </Item>`);
  }
  if (node.layout === "list") {
    lines.push(`${indent}  <Item class="UIListLayout" referent="${referentCounter.next()}">`);
    lines.push(`${indent}    <Properties>`);
    lines.push(`${propIndent}<token name="FillDirection">0</token>`);
    lines.push(`${propIndent}<UDim name="Padding"><S>0</S><O>8</O></UDim>`);
    lines.push(`${propIndent}<token name="SortOrder">2</token>`);
    lines.push(`${indent}    </Properties>`);
    lines.push(`${indent}  </Item>`);
  }
  if (node.layout === "grid") {
    // Cell size/padding reproduce the editor's grid (see grid-layout.ts).
    const grid = gridLayoutFor(node, scene);
    lines.push(`${indent}  <Item class="UIGridLayout" referent="${referentCounter.next()}">`);
    lines.push(`${indent}    <Properties>`);
    lines.push(
      `${propIndent}${udim2Xml("CellSize", grid.cellSize.scale, grid.cellSize.offset, "")}`
    );
    lines.push(
      `${propIndent}${udim2Xml("CellPadding", grid.cellPadding.scale, grid.cellPadding.offset, "")}`
    );
    lines.push(`${propIndent}<int name="FillDirectionMaxCells">${grid.maxCells}</int>`);
    lines.push(`${propIndent}<token name="SortOrder">2</token>`);
    lines.push(`${indent}    </Properties>`);
    lines.push(`${indent}  </Item>`);
  }
  if (node.padding !== undefined && node.padding > 0) {
    lines.push(`${indent}  <Item class="UIPadding" referent="${referentCounter.next()}">`);
    lines.push(`${indent}    <Properties>`);
    for (const side of ["PaddingTop", "PaddingBottom", "PaddingLeft", "PaddingRight"]) {
      lines.push(`${propIndent}<UDim name="${side}"><S>0</S><O>${xmlNumber(node.padding)}</O></UDim>`);
    }
    lines.push(`${indent}    </Properties>`);
    lines.push(`${indent}  </Item>`);
  }
  if (node.aspectRatio !== undefined && node.aspectRatio > 0) {
    lines.push(
      `${indent}  <Item class="UIAspectRatioConstraint" referent="${referentCounter.next()}">`
    );
    lines.push(`${indent}    <Properties>`);
    lines.push(`${propIndent}<float name="AspectRatio">${xmlNumber(node.aspectRatio)}</float>`);
    lines.push(`${propIndent}<token name="DominantAxis">0</token>`);
    lines.push(`${indent}    </Properties>`);
    lines.push(`${indent}  </Item>`);
  }
  if (node.minSize || node.maxSize) {
    lines.push(`${indent}  <Item class="UISizeConstraint" referent="${referentCounter.next()}">`);
    lines.push(`${indent}    <Properties>`);
    if (node.minSize) lines.push(vector2Xml("MinSize", node.minSize, propIndent));
    if (node.maxSize) lines.push(vector2Xml("MaxSize", node.maxSize, propIndent));
    lines.push(`${indent}    </Properties>`);
    lines.push(`${indent}  </Item>`);
  }

  lines.push(`${indent}</Item>`);
}

function emitLocalScript(
  script: LocalScriptSpec,
  lines: string[],
  referentCounter: ReferentCounter,
  depth: number
): void {
  const indent = "  ".repeat(depth);
  const propIndent = "  ".repeat(depth + 2);
  lines.push(`${indent}<Item class="LocalScript" referent="${referentCounter.next()}">`);
  lines.push(`${indent}  <Properties>`);
  lines.push(`${propIndent}<string name="Name">${escapeXml(script.name)}</string>`);
  lines.push(
    `${propIndent}<ProtectedString name="Source">${escapeXml(script.source)}</ProtectedString>`
  );
  lines.push(`${indent}  </Properties>`);
  lines.push(`${indent}</Item>`);
}

function emitScreenGuiDocument(
  scene: SceneNode[],
  lines: string[],
  referentCounter: ReferentCounter,
  options: { screenGuiName?: string; enabled?: boolean; displayOrder?: number },
  localScripts: LocalScriptSpec[]
): void {
  const rootGui = scene.find(
    (node) => node.cls === "ScreenGui" && !node.parentId
  );
  const guiName = options.screenGuiName ?? rootGui?.name ?? "ScreenGui";

  lines.push(`<Item class="ScreenGui" referent="${referentCounter.next()}">`);
  lines.push("  <Properties>");
  lines.push(`    <string name="Name">${escapeXml(guiName)}</string>`);
  lines.push('    <bool name="ResetOnSpawn">false</bool>');
  lines.push('    <bool name="IgnoreGuiInset">true</bool>');
  lines.push(`    <bool name="Enabled">${options.enabled ?? true}</bool>`);
  lines.push(`    <int name="DisplayOrder">${options.displayOrder ?? 0}</int>`);
  lines.push('    <token name="ZIndexBehavior">1</token>');
  lines.push("  </Properties>");

  const visited = new Set<string>();
  if (rootGui) {
    visited.add(rootGui.id);
    if (rootGui.transparency < 1 || rootGui.gradient) {
      emitScreenBackground(rootGui, lines, referentCounter);
    }
  }
  for (const child of orderedChildren(scene, null)) {
    if (rootGui && child.id === rootGui.id) {
      for (const subChild of orderedChildren(scene, rootGui.id)) {
        emitSceneNode(subChild, scene, lines, referentCounter, visited, 1);
      }
      continue;
    }
    emitSceneNode(child, scene, lines, referentCounter, visited, 1);
  }
  for (const script of localScripts) {
    emitLocalScript(script, lines, referentCounter, 1);
  }
  lines.push("</Item>");
}

// ---- GuiInteractionController ----------------------------------------------

const LUAU_SLIDE_OFFSET = 0.2;
const luauNumber = (value: number) => Number(value.toFixed(3)).toString();

// 1-based occurrence of `node` among same-named ordered siblings, so the
// generated Luau can resolve duplicate sibling names unambiguously.
function siblingOccurrence(scene: SceneNode[], node: SceneNode): number {
  let occurrence = 0;
  for (const sibling of orderedChildren(scene, node.parentId ?? null)) {
    if (sibling.name === node.name) occurrence += 1;
    if (sibling.id === node.id) break;
  }
  return Math.max(1, occurrence);
}

// Luau literal `{{"Name", occurrence}, ...}` describing the child path from the
// ScreenGui down to `node`.
function guiPathLuaLiteral(scene: SceneNode[], node: SceneNode): string {
  const nodesById = new Map(scene.map((sceneNode) => [sceneNode.id, sceneNode]));
  const chain: SceneNode[] = [];
  const visited = new Set<string>();
  let cursor: SceneNode | undefined = node;
  while (cursor && cursor.cls !== "ScreenGui" && !visited.has(cursor.id)) {
    visited.add(cursor.id);
    chain.unshift(cursor);
    cursor = cursor.parentId ? nodesById.get(cursor.parentId) : undefined;
  }
  const steps = chain.map(
    (chainNode) => `{${luauString(chainNode.name)}, ${siblingOccurrence(scene, chainNode)}}`
  );
  return `{${steps.join(", ")}}`;
}

function tweenBodyLines(
  action: { type: "show" | "hide" },
  transition: Transition,
  target: SceneNode
): string[] {
  const info = `TweenInfo.new(${luauNumber(transition.duration)}, Enum.EasingStyle.Quad, Enum.EasingDirection.Out)`;
  const prop = transition.style === "scale" ? "Size" : "Position";
  const restPoint = transition.style === "scale" ? target.size : target.pos;
  const rest = `UDim2.fromScale(${luauNumber(restPoint.x)}, ${luauNumber(restPoint.y)})`;
  let away: string;
  if (transition.style === "scale") {
    away = `UDim2.fromScale(${luauNumber(target.size.x * 0.5)}, ${luauNumber(target.size.y * 0.5)})`;
  } else {
    const dir = transition.direction ?? "left";
    const dx = dir === "left" ? -LUAU_SLIDE_OFFSET : dir === "right" ? LUAU_SLIDE_OFFSET : 0;
    const dy = dir === "up" ? -LUAU_SLIDE_OFFSET : dir === "down" ? LUAU_SLIDE_OFFSET : 0;
    away = `UDim2.fromScale(${luauNumber(target.pos.x + dx)}, ${luauNumber(target.pos.y + dy)})`;
  }
  return action.type === "show"
    ? [
        "target.Visible = true",
        `target.${prop} = ${away}`,
        `local info = ${info}`,
        `local tween = TweenService:Create(target, info, {${prop} = ${rest}})`,
        "tween:Play()",
      ]
    : [
        `local info = ${info}`,
        `local tween = TweenService:Create(target, info, {${prop} = ${away}})`,
        "tween.Completed:Connect(function()",
        "\ttarget.Visible = false",
        `\ttarget.${prop} = ${rest}`,
        "end)",
        "tween:Play()",
      ];
}

// Luau source for the LocalScript that wires button actions in the imported
// model. Returns null when no TextButton declares an action.
function guiInteractionControllerSource(scene: SceneNode[]): string | null {
  const buttons = scene.filter(
    (node): node is SceneNode & { action: NodeAction } =>
      node.cls === "TextButton" && node.action !== undefined
  );
  if (buttons.length === 0) return null;

  const remoteBindings = collectRemoteEventBindings(scene);
  const teleportList = teleportButtons(scene);
  const needsTweenService = buttons.some(
    (button) =>
      (button.action.type === "show" || button.action.type === "hide") &&
      button.action.transition !== undefined
  );

  const out: string[] = [
    "-- Generated by Roblox GUI Maker (.rbxmx native edition)",
    "-- Wires scene buttons: visibility toggles, tweens, RemoteEvents, teleports.",
    "-- Nodes resolve by {name, occurrence} paths so duplicate names stay safe.",
    "local gui = script.Parent",
    "",
    "local function resolveNode(path)",
    "\tlocal node = gui",
    "\tfor _, step in ipairs(path) do",
    "\t\tlocal seen = 0",
    "\t\tlocal matched = nil",
    "\t\tfor _, child in ipairs(node:GetChildren()) do",
    '\t\t\tif child.Name == step[1] then',
    "\t\t\t\tseen = seen + 1",
    "\t\t\t\tif seen == step[2] then",
    "\t\t\t\t\tmatched = child",
    "\t\t\t\t\tbreak",
    "\t\t\t\tend",
    "\t\t\tend",
    "\t\tend",
    "\t\tif not matched then",
    "\t\t\treturn nil",
    "\t\tend",
    "\t\tnode = matched",
    "\tend",
    "\treturn node",
    "end",
  ];

  if (needsTweenService) {
    out.push("", 'local TweenService = game:GetService("TweenService")');
  }
  if (remoteBindings.length > 0 || teleportList.length > 0) {
    out.push("", 'local ReplicatedStorage = game:GetService("ReplicatedStorage")');
  }
  if (remoteBindings.length > 0) {
    out.push('local remotes = ReplicatedStorage:WaitForChild("Remotes")');
    for (const binding of remoteBindings) {
      out.push(
        `local ${binding.variable} = remotes:WaitForChild(${luauString(binding.eventName)})`
      );
    }
  }
  if (teleportList.length > 0) {
    out.push('local rgm = ReplicatedStorage:WaitForChild("RGM")');
    out.push('local teleportRequest = rgm:WaitForChild("TeleportRequest")');
  }

  for (const button of buttons) {
    const action = button.action;
    let body: string[] | null = null;
    let target: SceneNode | undefined;

    if (
      action.type === "show" ||
      action.type === "hide" ||
      action.type === "toggle"
    ) {
      target = scene.find(
        (candidate) =>
          candidate.id === action.targetId &&
          (candidate.cls === "Frame" || candidate.cls === "ScrollingFrame")
      );
      if (!target) continue;
      if (action.type === "toggle") {
        body = ["target.Visible = not target.Visible"];
      } else if (action.transition) {
        body = tweenBodyLines(action, action.transition, target);
      } else {
        body = [
          action.type === "show" ? "target.Visible = true" : "target.Visible = false",
        ];
      }
    } else if (action.type === "hideGui") {
      body = ["gui.Enabled = false"];
    } else if (action.type === "remoteEvent") {
      const binding = remoteBindings.find(
        (candidate) => candidate.eventName === action.eventName
      );
      body = binding
        ? [`${binding.variable}:FireServer(${luauString(action.argument)})`]
        : null;
    } else {
      const sanitized = sanitizeTeleportAction(action);
      body = sanitized
        ? [`teleportRequest:FireServer(${luauString(sanitized.placeId)})`]
        : null;
    }
    if (!body) continue;

    out.push("do");
    out.push(`\tlocal button = resolveNode(${guiPathLuaLiteral(scene, button)})`);
    if (target) {
      out.push(`\tlocal target = resolveNode(${guiPathLuaLiteral(scene, target)})`);
    }
    out.push(`\tif button${target ? " and target" : ""} then`);
    out.push("\t\tbutton.Activated:Connect(function()");
    for (const line of body) out.push(`\t\t\t${line}`);
    out.push("\t\tend)");
    out.push("\tend");
    out.push("end");
  }

  return `${out.join("\n")}\n`;
}

// ---- KitScreenSwitcher ------------------------------------------------------

function kitScreenSwitcherSource(
  pages: Array<{ name: string; label: string }>,
  hudScreens: Array<{ name: string }>
): string {
  if (pages.length === 0) {
    throw new Error("kitToRbxmx: kit has no switchable pages");
  }
  const luaStringList = (values: string[]) =>
    `{ ${values.map((value) => luauString(value)).join(", ")} }`;
  const digitKeys = ["One", "Two", "Three", "Four", "Five"]
    .slice(0, Math.min(pages.length, 5))
    .map((key, index) => `\t[Enum.KeyCode.${key}] = ${index + 1},`)
    .join("\n");
  const barWidth = pages.length * 92 + 12;

  return [
    "-- Generated by Roblox GUI Maker (kit screen switcher)",
    "-- Click the top tabs or press number keys in Studio Play Solo to flip screens.",
    "-- HUD screens stay enabled on every page.",
    "local gui = script.Parent",
    "local container = gui.Parent",
    'local UserInputService = game:GetService("UserInputService")',
    "",
    `local pageScreenNames = ${luaStringList(pages.map((page) => page.name))}`,
    `local pageLabels = ${luaStringList(pages.map((page) => page.label))}`,
    `local hudScreenNames = ${luaStringList(hudScreens.map((screen) => screen.name))}`,
    "",
    "local pageScreens = {}",
    "for _, screenName in ipairs(pageScreenNames) do",
    "\tlocal screen = container:FindFirstChild(screenName)",
    '\tif screen and screen:IsA("ScreenGui") then',
    "\t\ttable.insert(pageScreens, screen)",
    "\tend",
    "end",
    "",
    "local hudScreens = {}",
    "for _, screenName in ipairs(hudScreenNames) do",
    "\tlocal screen = container:FindFirstChild(screenName)",
    '\tif screen and screen:IsA("ScreenGui") then',
    "\t\ttable.insert(hudScreens, screen)",
    "\tend",
    "end",
    "",
    "local switcherBar = nil",
    "local function showPage(pageIndex)",
    "\tfor index, screen in ipairs(pageScreens) do",
    "\t\tscreen.Enabled = index == pageIndex",
    "\tend",
    "\tif switcherBar then",
    "\t\t-- The tab bar rides on whichever page is visible.",
    "\t\tswitcherBar.Parent = pageScreens[pageIndex] or gui",
    "\tend",
    "end",
    "",
    'switcherBar = Instance.new("Frame")',
    'switcherBar.Name = "KitScreenTabs"',
    "switcherBar.AnchorPoint = Vector2.new(0.5, 0)",
    "switcherBar.Position = UDim2.new(0.5, 0, 0, 8)",
    `switcherBar.Size = UDim2.new(0, ${barWidth}, 0, 34)`,
    "switcherBar.BackgroundColor3 = Color3.fromRGB(12, 14, 23)",
    "switcherBar.BackgroundTransparency = 0.25",
    "switcherBar.BorderSizePixel = 0",
    "switcherBar.ZIndex = 50",
    'local tabLayout = Instance.new("UIListLayout")',
    "tabLayout.FillDirection = Enum.FillDirection.Horizontal",
    "tabLayout.Padding = UDim.new(0, 6)",
    "tabLayout.SortOrder = Enum.SortOrder.LayoutOrder",
    "tabLayout.HorizontalAlignment = Enum.HorizontalAlignment.Center",
    "tabLayout.VerticalAlignment = Enum.VerticalAlignment.Center",
    "tabLayout.Parent = switcherBar",
    'local barCorner = Instance.new("UICorner")',
    "barCorner.CornerRadius = UDim.new(0, 10)",
    "barCorner.Parent = switcherBar",
    "",
    "for index, screen in ipairs(pageScreens) do",
    '\tlocal tab = Instance.new("TextButton")',
    '\ttab.Name = "Tab" .. index',
    "\ttab.LayoutOrder = index",
    "\ttab.Size = UDim2.new(0, 86, 0, 24)",
    "\ttab.BackgroundColor3 = Color3.fromRGB(0, 162, 255)",
    "\ttab.BorderSizePixel = 0",
    "\ttab.Font = Enum.Font.GothamBold",
    "\ttab.TextScaled = true",
    '\ttab.TextColor3 = Color3.fromRGB(0, 29, 52)',
    "\ttab.Text = pageLabels[index] or screen.Name",
    "\ttab.ZIndex = 51",
    "\ttab.Parent = switcherBar",
    '\tlocal tabCorner = Instance.new("UICorner")',
    "\ttabCorner.CornerRadius = UDim.new(0, 8)",
    "\ttabCorner.Parent = tab",
    "\ttab.Activated:Connect(function()",
    "\t\tshowPage(index)",
    "\tend)",
    "end",
    "",
    "local digitKeys = {",
    digitKeys,
    "}",
    "UserInputService.InputBegan:Connect(function(input, processed)",
    "\tif processed then return end",
    "\tlocal pageIndex = digitKeys[input.KeyCode]",
    "\tif pageIndex and pageScreens[pageIndex] then",
    "\t\tshowPage(pageIndex)",
    "\tend",
    "end)",
    "",
    "showPage(1)",
  ].join("\n");
}

// ---- Public API -------------------------------------------------------------

export function rbxmxFilename(scene: SceneNode[]): string {
  return sceneDocumentFilename(scene).replace(/\.json$/, ".rbxmx");
}

export function sceneToRbxmx(
  scene: SceneNode[],
  options?: {
    screenGuiName?: string;
    enabled?: boolean;
    displayOrder?: number;
  }
): string {
  if (scene.length === 0) {
    throw new Error("sceneToRbxmx: cannot export an empty scene");
  }
  const interactionSource = guiInteractionControllerSource(scene);
  const localScripts: LocalScriptSpec[] = interactionSource
    ? [{ name: "GuiInteractionController", source: interactionSource }]
    : [];
  const lines: string[] = [ROBLOX_XML_OPEN];
  emitScreenGuiDocument(
    scene,
    lines,
    createReferentCounter(),
    options ?? {},
    localScripts
  );
  lines.push("</roblox>");
  return lines.join("\n");
}

// Kit screens whose template must resolve, pre-computed so the switcher source
// can reference every screen name before any XML is emitted.
type PreparedKitScreen = {
  scene: SceneNode[];
  template: string;
  screenName: string;
  label: string;
  enabled: boolean;
};

export function kitToRbxmx(kit: Kit): string {
  if (kit.screens.length === 0) {
    throw new Error(`kitToRbxmx: kit "${kit.slug}" has no screens`);
  }

  const preparedScreens: PreparedKitScreen[] = kit.screens.map(
    (screen, index) => {
      const screenScene = kitScene(kit, screen.template);
      if (!screenScene) {
        throw new Error(
          `kitToRbxmx: kit "${kit.slug}" screen template "${screen.template}" with theme "${kit.theme}" could not be resolved`
        );
      }
      const rootGui = screenScene.find(
        (node) => node.cls === "ScreenGui" && !node.parentId
      );
      if (!rootGui) {
        throw new Error(
          `kitToRbxmx: kit "${kit.slug}" screen "${screen.template}" has no ScreenGui root`
        );
      }
      return {
        scene: screenScene,
        template: screen.template,
        screenName: `${String(index + 1).padStart(2, "0")}_${rootGui.name}`,
        label: rootGui.name,
        enabled: index === 0 || HUD_TEMPLATES.has(screen.template),
      };
    }
  );

  const pages = preparedScreens
    .filter((screen) => !HUD_TEMPLATES.has(screen.template))
    .map((screen) => ({ name: screen.screenName, label: screen.label }));
  const hudScreens = preparedScreens
    .filter((screen) => HUD_TEMPLATES.has(screen.template))
    .map((screen) => ({ name: screen.screenName }));
  const switcherSource = kitScreenSwitcherSource(pages, hudScreens);

  const lines: string[] = [ROBLOX_XML_OPEN];
  const referentCounter = createReferentCounter();
  preparedScreens.forEach((screen, index) => {
    const localScripts: LocalScriptSpec[] = [];
    const interactionSource = guiInteractionControllerSource(screen.scene);
    if (interactionSource) {
      localScripts.push({
        name: "GuiInteractionController",
        source: interactionSource,
      });
    }
    if (index === 0) {
      localScripts.push({ name: "KitScreenSwitcher", source: switcherSource });
    }
    emitScreenGuiDocument(
      screen.scene,
      lines,
      referentCounter,
      {
        screenGuiName: screen.screenName,
        enabled: screen.enabled,
        displayOrder: index,
      },
      localScripts
    );
  });
  lines.push("</roblox>");
  return lines.join("\n");
}
