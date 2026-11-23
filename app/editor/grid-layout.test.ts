import { describe, expect, it } from "vitest";
import type { SceneNode } from "./catalog";
import {
  GRID_COLUMNS,
  GRID_GAP,
  gridLayoutFor,
  SCROLLING_CANVAS_Y_SCALE,
  type UDim2Value,
} from "./grid-layout";
import { parseSceneDocument, serializeSceneDocument } from "./persistence";
import { sceneToRbxmx } from "./rbxmx";
import { generateLuau } from "./scene";
import { getTemplate } from "./templates";

type Rect = { x: number; y: number; w: number; h: number };

const node = (over: Partial<SceneNode>): SceneNode =>
  ({
    id: "n",
    cls: "Frame",
    name: "N",
    pos: { x: 0, y: 0 },
    size: { x: 1, y: 1 },
    color: "#000000",
    transparency: 0,
    zindex: 1,
    ...over,
  }) as SceneNode;

function gridScene(opts: {
  cls: "Frame" | "ScrollingFrame";
  padding: number;
  count: number;
  size: { x: number; y: number };
  sizeOffset?: { x: number; y: number };
}): { container: SceneNode; scene: SceneNode[] } {
  const container = node({ id: "grid", cls: opts.cls, layout: "grid", padding: opts.padding });
  const kids = Array.from({ length: opts.count }, (_, i) =>
    node({ id: `k${i}`, parentId: "grid", size: opts.size, sizeOffset: opts.sizeOffset })
  );
  return { container, scene: [container, ...kids] };
}

// Editor model (Canvas.tsx / ScenePreview.tsx): CSS grid, 3 equal columns,
// 8px gaps, rows stretched over the visible content box, children sized by
// their own scale+offset within the cell, top-left aligned.
function editorRects(W: number, H: number, pad: number, count: number, size: { x: number; y: number }, off = { x: 0, y: 0 }): Rect[] {
  const rows = Math.ceil(count / GRID_COLUMNS);
  const trackW = (W - 2 * pad - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS;
  const trackH = (H - 2 * pad - GRID_GAP * (rows - 1)) / rows;
  return Array.from({ length: count }, (_, i) => ({
    x: pad + (i % GRID_COLUMNS) * (trackW + GRID_GAP),
    y: pad + Math.floor(i / GRID_COLUMNS) * (trackH + GRID_GAP),
    w: size.x * trackW + off.x,
    h: size.y * trackH + off.y,
  }));
}

// Roblox model: UIGridLayout resolves CellSize/CellPadding against the
// parent's content box (canvas for a ScrollingFrame, minus UIPadding) and fills
// rows left to right, FillDirectionMaxCells per row.
function robloxRects(W: number, H: number, pad: number, count: number, k: number, cellSize: UDim2Value, cellPadding: UDim2Value, maxCells: number): Rect[] {
  const cw = W - 2 * pad;
  const ch = k * H - 2 * pad;
  const resolve = (u: UDim2Value) => ({
    x: u.scale.x * cw + u.offset.x,
    y: u.scale.y * ch + u.offset.y,
  });
  const cell = resolve(cellSize);
  const gap = resolve(cellPadding);
  const perRow = Math.min(maxCells, Math.floor((cw + gap.x) / (cell.x + gap.x)));
  return Array.from({ length: count }, (_, i) => ({
    x: pad + (i % perRow) * (cell.x + gap.x),
    y: pad + Math.floor(i / perRow) * (cell.y + gap.y),
    w: cell.x,
    h: cell.y,
  }));
}

describe("gridLayoutFor", () => {
  const cases = [
    { cls: "Frame" as const, padding: 6, count: 8, size: { x: 0.3, y: 0.22 } },
    { cls: "ScrollingFrame" as const, padding: 8, count: 6, size: { x: 0.3, y: 0.3 } },
    { cls: "Frame" as const, padding: 10, count: 3, size: { x: 1, y: 1 } },
    { cls: "Frame" as const, padding: 0, count: 20, size: { x: 0.92, y: 0.8 } },
    { cls: "ScrollingFrame" as const, padding: 8, count: 7, size: { x: 0.95, y: 0.9 }, sizeOffset: { x: -4, y: 6 } },
  ];

  it.each(cases)(
    "places $count children of a $cls (padding $padding) where the editor draws them",
    (c) => {
      const { container, scene } = gridScene(c);
      const values = gridLayoutFor(container, scene);
      const k = c.cls === "ScrollingFrame" ? SCROLLING_CANVAS_Y_SCALE : 1;
      for (const [W, H] of [[550, 330], [1100, 600], [320, 240]]) {
        const want = editorRects(W, H, c.padding, c.count, c.size, c.sizeOffset);
        const got = robloxRects(W, H, c.padding, c.count, k, values.cellSize, values.cellPadding, values.maxCells);
        expect(got.length).toBe(want.length);
        // All three columns must fit on a row in Roblox.
        expect(new Set(got.map((r) => r.x)).size).toBe(Math.min(GRID_COLUMNS, c.count));
        got.forEach((r, i) => {
          // Whole-pixel offsets: X is floored (<1px per column), Y rounded
          // (<0.5px per row), so the drift grows slightly with the index.
          const row = Math.floor(i / GRID_COLUMNS);
          expect(Math.abs(r.x - want[i].x)).toBeLessThan(2.5);
          expect(Math.abs(r.y - want[i].y)).toBeLessThan(1 + 0.5 * row);
          expect(Math.abs(r.w - want[i].w)).toBeLessThan(1.5);
          expect(Math.abs(r.h - want[i].h)).toBeLessThan(1);
        });
      }
    }
  );

  it("ignores hidden children, which take no cell in Roblox", () => {
    const { container, scene } = gridScene({ cls: "Frame", padding: 0, count: 4, size: { x: 1, y: 1 } });
    scene[4] = { ...scene[4], initialVisible: false };
    // 3 visible children -> 1 row -> full-height cells.
    expect(gridLayoutFor(container, scene).cellSize.scale.y).toBe(1);
  });

  it("gives the shop template's scrolling item grid scaled cells, not 100x100 px", () => {
    const scene = getTemplate("shop")!.scene;
    const grid = scene.find((n) => n.layout === "grid")!;
    expect(gridLayoutFor(grid, scene)).toEqual({
      // Items fill their cells: three columns and two rows with 8px gaps,
      // the rows measured against the 2x-tall scrolling canvas.
      cellSize: { scale: { x: 0.3333, y: 0.25 }, offset: { x: -6, y: -8 } },
      cellPadding: { scale: { x: 0, y: 0 }, offset: { x: 8, y: 8 } },
      maxCells: 3,
    });
  });
});

describe("grid exports", () => {
  const scene = getTemplate("shop")!.scene;

  it("Luau export writes the computed cell size, padding and column cap", () => {
    const luau = generateLuau(scene);
    expect(luau).not.toContain("UDim2.fromOffset(100, 100)");
    expect(luau).toMatch(/_grid\.CellSize = UDim2\.new\(0\.3333, -6, 0\.25, -8\)/);
    expect(luau).toMatch(/_grid\.CellPadding = UDim2\.new\(0, 8, 0, 8\)/);
    expect(luau).toContain("_grid.FillDirectionMaxCells = 3");
  });

  it(".rbxmx export writes the same values", () => {
    const xml = sceneToRbxmx(scene);
    expect(xml).toContain(
      '<UDim2 name="CellSize"><XS>0.3333</XS><XO>-6</XO><YS>0.25</YS><YO>-8</YO></UDim2>'
    );
    expect(xml).toContain('<int name="FillDirectionMaxCells">3</int>');
  });

  it("plugin JSON carries the computed values, and they are dropped on import", () => {
    const json = serializeSceneDocument(scene);
    const doc = JSON.parse(json) as { scene: Array<SceneNode & { gridLayout?: unknown }> };
    const gridNode = doc.scene.find((n) => n.layout === "grid")!;
    expect(gridNode.gridLayout).toEqual(gridLayoutFor(gridNode, scene));
    expect(doc.scene.filter((n) => n.gridLayout).length).toBe(1);

    const parsed = parseSceneDocument(json);
    expect(parsed.length).toBe(scene.length);
    expect(JSON.stringify(parsed)).not.toContain("gridLayout");
  });
});
