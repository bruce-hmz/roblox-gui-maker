import type { CSSProperties } from "react";
import type {
  AutomaticCanvasSize,
  LayoutHorizontalAlignment,
  LayoutVerticalAlignment,
  ListDirection,
  RobloxClass,
  SceneNode,
  UDim2Value,
  UDimValue,
} from "./catalog";

export const DEFAULT_LIST_GAP: UDimValue = Object.freeze({
  scale: 0,
  offset: 8,
});

export const DEFAULT_GRID_CELL_SIZE: UDim2Value = Object.freeze({
  scale: Object.freeze({ x: 0, y: 0 }),
  offset: Object.freeze({ x: 100, y: 100 }),
});

export const DEFAULT_GRID_CELL_PADDING: UDim2Value = Object.freeze({
  scale: Object.freeze({ x: 0, y: 0 }),
  offset: Object.freeze({ x: 8, y: 8 }),
});

type ListLayout = {
  direction: ListDirection;
  gap: UDimValue;
  horizontalAlignment: LayoutHorizontalAlignment;
  verticalAlignment: LayoutVerticalAlignment;
};

type GridLayout = {
  cellSize: UDim2Value;
  cellPadding: UDim2Value;
  horizontalAlignment: LayoutHorizontalAlignment;
  verticalAlignment: LayoutVerticalAlignment;
};

const HORIZONTAL_ALIGNMENTS = ["left", "center", "right"] as const;
const VERTICAL_ALIGNMENTS = ["top", "center", "bottom"] as const;
const LIST_DIRECTIONS = ["vertical", "horizontal"] as const;
const CANVAS_SIZES = ["none", "x", "y", "xy"] as const;
const ROBLOX_AUTOMATIC_CANVAS_SIZE: Record<
  AutomaticCanvasSize,
  "None" | "X" | "Y" | "XY"
> = {
  none: "None",
  x: "X",
  y: "Y",
  xy: "XY",
};
const LAYOUT_CONTAINERS: ReadonlySet<RobloxClass> = new Set([
  "ScreenGui",
  "Frame",
  "ScrollingFrame",
]);

export function resolveListLayout(node: SceneNode): ListLayout {
  return {
    direction: node.listDirection ?? "vertical",
    gap: node.listGap ?? DEFAULT_LIST_GAP,
    horizontalAlignment: node.layoutHorizontalAlignment ?? "left",
    verticalAlignment: node.layoutVerticalAlignment ?? "top",
  };
}

export function resolveGridLayout(node: SceneNode): GridLayout {
  return {
    cellSize: node.gridCellSize ?? DEFAULT_GRID_CELL_SIZE,
    cellPadding: node.gridCellPadding ?? DEFAULT_GRID_CELL_PADDING,
    horizontalAlignment: node.layoutHorizontalAlignment ?? "left",
    verticalAlignment: node.layoutVerticalAlignment ?? "top",
  };
}

export function udimCss(value: UDimValue): string {
  const percent = formatCssNumber(value.scale * 100);
  if (value.scale === 0) return `${value.offset}px`;
  if (value.offset === 0) return `${percent}%`;
  return `calc(${percent}% + ${value.offset}px)`;
}

export function layoutChildrenStyle(node: SceneNode): CSSProperties {
  const canvasSize = node.cls === "ScrollingFrame" ? node.automaticCanvasSize ?? "none" : "none";
  const style: CSSProperties = {
    position: "absolute",
    inset: 0,
    padding: node.padding === undefined ? undefined : `${node.padding}px`,
    overflowX: canvasSize === "x" || canvasSize === "xy" ? "auto" : "hidden",
    overflowY: canvasSize === "y" || canvasSize === "xy" ? "auto" : "hidden",
  };

  if (node.layout === "list") {
    const layout = resolveListLayout(node);
    const horizontal = layout.direction === "horizontal";
    return {
      ...style,
      display: "flex",
      flexDirection: horizontal ? "row" : "column",
      gap: udimCss(layout.gap),
      justifyContent: horizontal
        ? flexHorizontalAlignment(layout.horizontalAlignment)
        : flexVerticalAlignment(layout.verticalAlignment),
      alignItems: horizontal
        ? flexVerticalAlignment(layout.verticalAlignment)
        : flexHorizontalAlignment(layout.horizontalAlignment),
    };
  }

  if (node.layout === "grid") {
    const layout = resolveGridLayout(node);
    return {
      ...style,
      display: "grid",
      gridTemplateColumns: `repeat(auto-fill, ${udimCss(axisValue(layout.cellSize, "x"))})`,
      gridAutoRows: udimCss(axisValue(layout.cellSize, "y")),
      columnGap: udimCss(axisValue(layout.cellPadding, "x")),
      rowGap: udimCss(axisValue(layout.cellPadding, "y")),
      justifyContent: gridHorizontalAlignment(layout.horizontalAlignment),
      alignContent: gridVerticalAlignment(layout.verticalAlignment),
    };
  }

  return style;
}

export function sanitizeLayoutFields(raw: unknown, cls: RobloxClass): Partial<SceneNode> {
  if (!LAYOUT_CONTAINERS.has(cls) || !isRecord(raw)) return {};

  const fields: Partial<SceneNode> = {};
  if (raw.layout === "list" || raw.layout === "grid") fields.layout = raw.layout;
  if (typeof raw.padding === "number" && Number.isFinite(raw.padding)) {
    fields.padding = clamp(Math.round(raw.padding), 0, 4096);
  }
  if (isMember(raw.listDirection, LIST_DIRECTIONS)) fields.listDirection = raw.listDirection;
  const listGap = sanitizeUDim(raw.listGap);
  if (listGap) fields.listGap = listGap;
  if (isMember(raw.layoutHorizontalAlignment, HORIZONTAL_ALIGNMENTS)) {
    fields.layoutHorizontalAlignment = raw.layoutHorizontalAlignment;
  }
  if (isMember(raw.layoutVerticalAlignment, VERTICAL_ALIGNMENTS)) {
    fields.layoutVerticalAlignment = raw.layoutVerticalAlignment;
  }
  const gridCellSize = sanitizeUDim2(raw.gridCellSize);
  if (gridCellSize) fields.gridCellSize = gridCellSize;
  const gridCellPadding = sanitizeUDim2(raw.gridCellPadding);
  if (gridCellPadding) fields.gridCellPadding = gridCellPadding;
  if (cls === "ScrollingFrame" && isMember(raw.automaticCanvasSize, CANVAS_SIZES)) {
    fields.automaticCanvasSize = raw.automaticCanvasSize;
  }
  return fields;
}

export function robloxHorizontalAlignment(value: LayoutHorizontalAlignment): "Left" | "Center" | "Right" {
  return value === "left" ? "Left" : value === "right" ? "Right" : "Center";
}

export function robloxVerticalAlignment(value: LayoutVerticalAlignment): "Top" | "Center" | "Bottom" {
  return value === "top" ? "Top" : value === "bottom" ? "Bottom" : "Center";
}

export function robloxListDirection(value: ListDirection): "Vertical" | "Horizontal" {
  return value === "vertical" ? "Vertical" : "Horizontal";
}

export function robloxAutomaticCanvasSize(value: AutomaticCanvasSize): "None" | "X" | "Y" | "XY" {
  return ROBLOX_AUTOMATIC_CANVAS_SIZE[value];
}

function sanitizeUDim(raw: unknown): UDimValue | undefined {
  if (!isRecord(raw) || !isFiniteNumber(raw.scale) || !isFiniteNumber(raw.offset)) return undefined;
  return {
    scale: clamp(raw.scale, 0, 1),
    offset: clamp(Math.round(raw.offset), 0, 4096),
  };
}

function sanitizeUDim2(raw: unknown): UDim2Value | undefined {
  if (!isRecord(raw) || !isRecord(raw.scale) || !isRecord(raw.offset)) return undefined;
  const x = sanitizeUDim({ scale: raw.scale.x, offset: raw.offset.x });
  const y = sanitizeUDim({ scale: raw.scale.y, offset: raw.offset.y });
  if (!x || !y) return undefined;
  return {
    scale: { x: x.scale, y: y.scale },
    offset: { x: x.offset, y: y.offset },
  };
}

function axisValue(value: UDim2Value, axis: "x" | "y"): UDimValue {
  return { scale: value.scale[axis], offset: value.offset[axis] };
}

function flexHorizontalAlignment(value: LayoutHorizontalAlignment): CSSProperties["justifyContent"] {
  return value === "left" ? "flex-start" : value === "right" ? "flex-end" : "center";
}

function flexVerticalAlignment(value: LayoutVerticalAlignment): CSSProperties["justifyContent"] {
  return value === "top" ? "flex-start" : value === "bottom" ? "flex-end" : "center";
}

function gridHorizontalAlignment(value: LayoutHorizontalAlignment): CSSProperties["justifyContent"] {
  return value === "left" ? "start" : value === "right" ? "end" : "center";
}

function gridVerticalAlignment(value: LayoutVerticalAlignment): CSSProperties["alignContent"] {
  return value === "top" ? "start" : value === "bottom" ? "end" : "center";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isMember<const T extends readonly string[]>(value: unknown, values: T): value is T[number] {
  return typeof value === "string" && values.some((candidate) => candidate === value);
}

function formatCssNumber(value: number): string {
  return Number(value.toFixed(6)).toString();
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
