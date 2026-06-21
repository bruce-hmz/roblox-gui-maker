// Catalog: palette components + the initial preview scene.
// Static data only — instance creation and Luau generation live in scene.ts.

export type RobloxClass =
  | "ScreenGui"
  | "Frame"
  | "TextLabel"
  | "TextButton"
  | "TextBox"
  | "ImageLabel"
  | "ScrollingFrame"
  | "UICorner"
  | "UIGradient"
  | "UIListLayout"
  | "UIGridLayout"
  | "UIPadding";

export type DeviceKind = "desktop" | "tablet" | "mobile";

export type VisibilityAction =
  | { type: "show" | "hide" | "toggle"; targetId?: string }
  | { type: "hideGui" };

export type RemoteEventAction = {
  type: "remoteEvent";
  eventName: string;
  argument: string;
};

export type TeleportAction = {
  type: "teleport";
  placeId: string;
};

export type NodeAction = VisibilityAction | RemoteEventAction | TeleportAction;

export type MotionPreset = "fade" | "slide" | "scale";
export type SlideDirection = "left" | "right" | "up" | "down";
export type NodeMotion = {
  preset?: MotionPreset;
  durationMs?: number;
  slideDirection?: SlideDirection;
  hover?: boolean;
};

export type StrokeStyle = {
  color: string;
  transparency: number;
  thickness: number;
};

export type UDimValue = { scale: number; offset: number };
export type UDim2Value = {
  scale: { x: number; y: number };
  offset: { x: number; y: number };
};
export type ListDirection = "vertical" | "horizontal";
export type LayoutHorizontalAlignment = "left" | "center" | "right";
export type LayoutVerticalAlignment = "top" | "center" | "bottom";
export type AutomaticCanvasSize = "none" | "x" | "y" | "xy";

// How a palette item behaves:
//  - add:    drops a new positioned node onto the canvas
//  - apply:  modifies the currently selected node (e.g. UICorner rounds it)
//  - soon:   needs the nested-container model (arrives with drag/drop)
export type PaletteMode = "add" | "apply" | "soon";

export type PaletteItem = { cls: RobloxClass; hint: string; mode: PaletteMode };
export type PaletteGroup = { label: string; items: PaletteItem[] };

export const PALETTE: PaletteGroup[] = [
  {
    label: "Objects",
    items: [
      { cls: "ScreenGui", hint: "Root screen container", mode: "add" },
      { cls: "Frame", hint: "Solid rectangle", mode: "add" },
      { cls: "TextLabel", hint: "Static text", mode: "add" },
      { cls: "TextButton", hint: "Clickable text", mode: "add" },
      { cls: "TextBox", hint: "Player text input", mode: "add" },
      { cls: "ImageLabel", hint: "Image display", mode: "add" },
      { cls: "ScrollingFrame", hint: "Scrollable list", mode: "add" },
    ],
  },
  {
    label: "Effects & Layout",
    items: [
      { cls: "UICorner", hint: "Round selected", mode: "apply" },
      { cls: "UIGradient", hint: "Gradient on selected", mode: "apply" },
      { cls: "UIListLayout", hint: "Stack selected's kids", mode: "apply" },
      { cls: "UIGridLayout", hint: "Grid selected's kids", mode: "apply" },
      { cls: "UIPadding", hint: "Pad selected container", mode: "apply" },
    ],
  },
];

// One node in the scene. pos / size are UDim-like scale (0..1 of the canvas).
export type SceneNode = {
  id: string;
  cls: RobloxClass;
  name: string;
  pos: { x: number; y: number };
  posOffset?: { x: number; y: number };
  size: { x: number; y: number };
  sizeOffset?: { x: number; y: number };
  anchor?: { x: number; y: number };
  aspectRatio?: number;
  minSize?: { x: number; y: number };
  maxSize?: { x: number; y: number };
  color: string; // BackgroundColor3 hex
  transparency: number; // 0..1
  cornerRadius: number; // px (UICorner)
  gradient?: { from: string; to: string };
  layout?: "list" | "grid"; // auto-arrange this node's children
  padding?: number; // px on all sides (UIPadding)
  listDirection?: ListDirection;
  listGap?: UDimValue;
  layoutHorizontalAlignment?: LayoutHorizontalAlignment;
  layoutVerticalAlignment?: LayoutVerticalAlignment;
  gridCellSize?: UDim2Value;
  gridCellPadding?: UDim2Value;
  automaticCanvasSize?: AutomaticCanvasSize;
  layoutOrder?: number;
  initialVisible?: boolean;
  motion?: NodeMotion;
  action?: NodeAction;
  parentId?: string | null; // null/undefined = child of the ScreenGui root
  text?: string;
  font?: string;
  textSize?: number;
  textColor?: string;
  image?: string;
  imageColor?: string;
  rotation?: number;
  textScaled?: boolean;
  textWrapped?: boolean;
  stroke?: StrokeStyle;
  zindex: number;
};

export const SAMPLE_SCENE: SceneNode[] = [
  {
    id: "root",
    cls: "ScreenGui",
    name: "GameMenu",
    pos: { x: 0, y: 0 },
    size: { x: 1, y: 1 },
    color: "#0c0e17",
    transparency: 1,
    cornerRadius: 0,
    zindex: 0,
  },
  {
    id: "panel",
    cls: "Frame",
    name: "MenuPanel",
    pos: { x: 0.3, y: 0.22 },
    size: { x: 0.4, y: 0.56 },
    color: "#1d1f29",
    transparency: 0,
    cornerRadius: 16,
    zindex: 1,
  },
  {
    id: "title",
    cls: "TextLabel",
    name: "Title",
    pos: { x: 0.36, y: 0.28 },
    size: { x: 0.28, y: 0.08 },
    color: "#000000",
    transparency: 1,
    cornerRadius: 0,
    text: "MAIN MENU",
    font: "GothamBold",
    textSize: 26,
    textColor: "#e1e1ef",
    zindex: 2,
  },
  {
    id: "play",
    cls: "TextButton",
    name: "PlayBtn",
    pos: { x: 0.36, y: 0.42 },
    size: { x: 0.28, y: 0.09 },
    color: "#00a2ff",
    transparency: 0,
    cornerRadius: 10,
    text: "PLAY",
    font: "GothamBold",
    textSize: 20,
    textColor: "#001d34",
    zindex: 2,
  },
  {
    id: "settings",
    cls: "TextButton",
    name: "SettingsBtn",
    pos: { x: 0.36, y: 0.54 },
    size: { x: 0.28, y: 0.09 },
    color: "#282933",
    transparency: 0,
    cornerRadius: 10,
    text: "SETTINGS",
    font: "GothamMedium",
    textSize: 16,
    textColor: "#e1e1ef",
    zindex: 2,
  },
  {
    id: "coins",
    cls: "TextLabel",
    name: "CoinsLabel",
    pos: { x: 0.04, y: 0.05 },
    size: { x: 0.2, y: 0.06 },
    color: "#1d1f29",
    transparency: 0,
    cornerRadius: 999,
    text: "1,250",
    font: "GothamBold",
    textSize: 15,
    textColor: "#4cddb1",
    zindex: 2,
  },
];
