import { describe, expect, it } from "vitest";
import type { SceneNode } from "./catalog";
import {
  DEFAULT_GRID_CELL_PADDING,
  DEFAULT_GRID_CELL_SIZE,
  DEFAULT_LIST_GAP,
  layoutChildrenStyle,
  resolveGridLayout,
  resolveListLayout,
  robloxAutomaticCanvasSize,
  robloxHorizontalAlignment,
  robloxListDirection,
  robloxVerticalAlignment,
  sanitizeLayoutFields,
  udimCss,
} from "./layout";

const node = (overrides: Partial<SceneNode> = {}): SceneNode => ({
  id: "container",
  cls: "Frame",
  name: "Container",
  pos: { x: 0, y: 0 },
  size: { x: 1, y: 1 },
  color: "#ffffff",
  transparency: 0,
  cornerRadius: 0,
  zindex: 1,
  ...overrides,
});

describe("layout defaults", () => {
  it("resolves legacy lists with vertical, eight-pixel, top-left defaults", () => {
    expect(resolveListLayout(node({ layout: "list" }))).toEqual({
      direction: "vertical",
      gap: DEFAULT_LIST_GAP,
      horizontalAlignment: "left",
      verticalAlignment: "top",
    });
    expect(DEFAULT_LIST_GAP).toEqual({ scale: 0, offset: 8 });
  });

  it("resolves legacy grids with 100-pixel cells, eight-pixel padding, and top-left defaults", () => {
    expect(resolveGridLayout(node({ layout: "grid" }))).toEqual({
      cellSize: DEFAULT_GRID_CELL_SIZE,
      cellPadding: DEFAULT_GRID_CELL_PADDING,
      horizontalAlignment: "left",
      verticalAlignment: "top",
    });
    expect(DEFAULT_GRID_CELL_SIZE).toEqual({
      scale: { x: 0, y: 0 },
      offset: { x: 100, y: 100 },
    });
    expect(DEFAULT_GRID_CELL_PADDING).toEqual({
      scale: { x: 0, y: 0 },
      offset: { x: 8, y: 8 },
    });
  });
});

describe("CSS layout mapping", () => {
  it.each([
    [{ scale: 0, offset: 8 }, "8px"],
    [{ scale: 0.25, offset: 0 }, "25%"],
    [{ scale: 0.25, offset: 8 }, "calc(25% + 8px)"],
  ] as const)("maps a UDim value to CSS", (value, expected) => {
    expect(udimCss(value)).toBe(expected);
  });

  it("maps horizontal list axes and alignment to flexbox", () => {
    expect(
      layoutChildrenStyle(
        node({
          layout: "list",
          listDirection: "horizontal",
          listGap: { scale: 0, offset: 12 },
          layoutHorizontalAlignment: "center",
          layoutVerticalAlignment: "bottom",
          padding: 16,
        }),
      ),
    ).toMatchObject({
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "row",
      gap: "12px",
      padding: "16px",
      justifyContent: "center",
      alignItems: "flex-end",
      overflowX: "hidden",
      overflowY: "hidden",
    });
  });

  it("maps vertical list alignment to physical vertical and horizontal axes", () => {
    expect(
      layoutChildrenStyle(
        node({
          layout: "list",
          listDirection: "vertical",
          layoutHorizontalAlignment: "right",
          layoutVerticalAlignment: "center",
        }),
      ),
    ).toMatchObject({
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-end",
    });
  });

  it("maps grid dimensions, gaps, and alignment to CSS grid", () => {
    expect(
      layoutChildrenStyle(
        node({
          layout: "grid",
          gridCellSize: {
            scale: { x: 0.3, y: 0 },
            offset: { x: 0, y: 120 },
          },
          gridCellPadding: {
            scale: { x: 0.02, y: 0 },
            offset: { x: 4, y: 8 },
          },
          layoutHorizontalAlignment: "center",
          layoutVerticalAlignment: "bottom",
        }),
      ),
    ).toMatchObject({
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, 30%)",
      gridAutoRows: "120px",
      columnGap: "calc(2% + 4px)",
      rowGap: "8px",
      justifyContent: "center",
      alignContent: "end",
    });
  });

  it.each([
    ["none", "hidden", "hidden"],
    ["x", "auto", "hidden"],
    ["y", "hidden", "auto"],
    ["xy", "auto", "auto"],
  ] as const)("maps automatic canvas mode %s to axis overflow", (mode, overflowX, overflowY) => {
    expect(
      layoutChildrenStyle(node({ cls: "ScrollingFrame", automaticCanvasSize: mode })),
    ).toMatchObject({ overflowX, overflowY });
  });
});

describe("Roblox enum mapping", () => {
  it("returns enum member suffixes consumable by Luau generation", () => {
    expect(robloxHorizontalAlignment("right")).toBe("Right");
    expect(robloxVerticalAlignment("bottom")).toBe("Bottom");
    expect(robloxListDirection("horizontal")).toBe("Horizontal");
    expect(robloxAutomaticCanvasSize("xy")).toBe("XY");
  });
});

describe("layout sanitization", () => {
  it("omits malformed values and clamps valid UDim components", () => {
    expect(
      sanitizeLayoutFields(
        {
          layout: "list",
          listDirection: "diagonal",
          listGap: { scale: 2, offset: 5000 },
        },
        "Frame",
      ),
    ).toEqual({
      layout: "list",
      listGap: { scale: 1, offset: 4096 },
    });
  });

  it("retains automatic canvas size only for scrolling frames", () => {
    expect(sanitizeLayoutFields({ automaticCanvasSize: "y" }, "Frame")).toEqual({});
    expect(sanitizeLayoutFields({ automaticCanvasSize: "xy" }, "ScrollingFrame")).toEqual({
      automaticCanvasSize: "xy",
    });
  });
});
