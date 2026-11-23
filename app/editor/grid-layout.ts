// UIGridLayout values that make Roblox lay a grid out the way the editor
// draws it, so a grid looks the same in Studio as on the canvas.
//
// Editor (Canvas.tsx / ScenePreview.tsx): `layout: "grid"` is a CSS grid with
// GRID_COLUMNS equal columns and GRID_GAP px gaps inside the container's
// UIPadding. Rows share the container height equally. Each child keeps its own
// Size (scale of the cell + offset px) and sits at the top-left of its cell.
//
// Roblox: UIGridLayout ignores each child's Size and gives every child
// CellSize, separated by CellPadding. Setting
//   CellSize    = the child's share of a cell
//   CellPadding = the rest of the cell + GRID_GAP
// puts every child exactly where the editor draws it. FillDirectionMaxCells
// pins the column count.
//
// Assumptions:
// - One CellSize fits all, so the first visible child's size is used. Grids
//   whose children have different sizes are drawn per-child in the editor
//   but uniformly in Roblox.
// - Inside a ScrollingFrame, scale values are relative to the canvas, which
//   the exports leave at Roblox's default CanvasSize of {0,0},{2,0} (twice
//   the frame height), so Y values are divided by that factor. The vertical
//   scrollbar narrows the canvas by its thickness, a few px per row.
// - Hidden children (initialVisible: false) take no cell, as in Roblox.

import type { SceneNode } from "./catalog";

export const GRID_COLUMNS = 3;
export const GRID_GAP = 8;
// Roblox's default ScrollingFrame.CanvasSize Y scale (also written by rbxmx.ts).
export const SCROLLING_CANVAS_Y_SCALE = 2;

export type UDim2Value = {
  scale: { x: number; y: number };
  offset: { x: number; y: number };
};

export type GridLayoutValues = {
  cellSize: UDim2Value;
  cellPadding: UDim2Value;
  maxCells: number;
};

const clean = (n: number) => (Object.is(n, -0) ? 0 : n);
const SCALE_STEP = 1e4; // scale precision: 4 decimals
const floorScale = (n: number) => clean(Math.floor(n * SCALE_STEP + 1e-9) / SCALE_STEP);
const roundScale = (n: number) => clean(Math.round(n * SCALE_STEP) / SCALE_STEP);

// Roblox UDim offsets are whole pixels and the per-cell rounding error repeats
// on every column/row, so cell size and cell *step* (size + padding) are
// rounded separately and the padding is their difference:
// - X is floored: UIGridLayout only puts a cell on the row if it fits, so a
//   step rounded up would drop the third column.
// - Y is rounded: rows only stack, so the drift stays under 0.5px per row.
function axis(
  cellScale: number,
  cellOffset: number,
  stepScale: number,
  stepOffset: number,
  mode: "floor" | "round"
) {
  const s = mode === "floor" ? floorScale : roundScale;
  const o = mode === "floor" ? Math.floor : Math.round;
  const cS = s(cellScale);
  const stepS = s(stepScale);
  const cO = o(cellOffset + 1e-9);
  const stepO = o(stepOffset + 1e-9);
  return {
    cell: { scale: cS, offset: clean(cO) },
    pad: { scale: roundScale(stepS - cS), offset: clean(stepO - cO) },
  };
}

export function gridLayoutFor(
  container: SceneNode,
  scene: SceneNode[]
): GridLayoutValues {
  const kids = scene.filter(
    (n) => n.parentId === container.id && n.initialVisible !== false
  );
  const first = kids[0];
  const size = first?.size ?? { x: 1, y: 1 };
  const sizeOffset = first?.sizeOffset ?? { x: 0, y: 0 };
  const rows = Math.max(1, Math.ceil(kids.length / GRID_COLUMNS));
  const pad = container.padding ?? 0;
  const k = container.cls === "ScrollingFrame" ? SCROLLING_CANVAS_Y_SCALE : 1;
  const g = GRID_GAP;
  const cols = GRID_COLUMNS;

  // One cell ("track") as scale of the parent's content box + offset px.
  // Width: (W - (cols-1)g) / cols.
  const trackW = { s: 1 / cols, o: (-(cols - 1) * g) / cols };
  // Height: the editor splits the *visible* content height H - 2p, while
  // Roblox measures scale against the canvas content height kH - 2p.
  const trackH = {
    s: 1 / (k * rows),
    o: (2 * pad * (1 / k - 1) - g * (rows - 1)) / rows,
  };

  // Cell = child's share of the track; step = track + gap.
  const x = axis(
    size.x * trackW.s,
    size.x * trackW.o + sizeOffset.x,
    trackW.s,
    trackW.o + g,
    "floor"
  );
  const y = axis(
    size.y * trackH.s,
    size.y * trackH.o + sizeOffset.y,
    trackH.s,
    trackH.o + g,
    "round"
  );

  return {
    cellSize: {
      scale: { x: x.cell.scale, y: y.cell.scale },
      offset: { x: x.cell.offset, y: y.cell.offset },
    },
    cellPadding: {
      scale: { x: x.pad.scale, y: y.pad.scale },
      offset: { x: x.pad.offset, y: y.pad.offset },
    },
    maxCells: cols,
  };
}
