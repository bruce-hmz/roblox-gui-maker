import { describe, expect, it } from "vitest";
import type { SceneNode } from "./catalog";
import {
  MOTION_DEFAULTS,
  isEffectivelyInitiallyVisible,
  isMotionClass,
  motionClosedOffset,
  resolveSceneMotion,
  sanitizeMotion,
} from "./motion";

const node = (overrides: Partial<SceneNode> = {}): SceneNode => ({
  id: "node",
  cls: "Frame",
  name: "Node",
  pos: { x: 0, y: 0 },
  size: { x: 1, y: 1 },
  color: "#000000",
  transparency: 0,
  cornerRadius: 0,
  zindex: 0,
  ...overrides,
});

describe("motion sanitization", () => {
  it("preserves valid TextButton motion and rounds its duration", () => {
    expect(
      sanitizeMotion(
        { preset: "slide", durationMs: 248.6, slideDirection: "right", hover: true },
        "TextButton",
      ),
    ).toEqual({ preset: "slide", durationMs: 249, slideDirection: "right", hover: true });
  });

  it("rejects unsupported classes and objects without valid members", () => {
    expect(sanitizeMotion({ preset: "fade" }, "ScreenGui")).toBeUndefined();
    expect(sanitizeMotion({ preset: "fade" }, "UIListLayout")).toBeUndefined();
    expect(sanitizeMotion({}, "Frame")).toBeUndefined();
    expect(sanitizeMotion({ preset: "Fade", slideDirection: "LEFT", hover: false }, "TextButton"))
      .toBeUndefined();
  });

  it("omits invalid optional members while retaining valid members", () => {
    expect(
      sanitizeMotion(
        { preset: "scale", durationMs: "250", slideDirection: "sideways", hover: true },
        "TextButton",
      ),
    ).toEqual({ preset: "scale", hover: true });
  });

  it.each([
    [99.5, 100],
    [100.5, 101],
    [1999.6, 2000],
    [3000, 2000],
  ])("rounds and clamps finite durations (%s)", (durationMs, expected) => {
    expect(sanitizeMotion({ durationMs }, "Frame")).toEqual({ durationMs: expected });
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, "240"])(
    "omits a non-finite or non-number duration (%s)",
    (durationMs) => {
      expect(sanitizeMotion({ preset: "fade", durationMs }, "Frame")).toEqual({ preset: "fade" });
    },
  );

  it("accepts only exact lowercase presets and directions", () => {
    expect(sanitizeMotion({ preset: "fade", slideDirection: "left" }, "Frame")).toEqual({
      preset: "fade",
      slideDirection: "left",
    });
    expect(sanitizeMotion({ preset: "slide", slideDirection: "up" }, "Frame")).toEqual({
      preset: "slide",
      slideDirection: "up",
    });
    expect(sanitizeMotion({ preset: "scale", slideDirection: "down" }, "Frame")).toEqual({
      preset: "scale",
      slideDirection: "down",
    });
    expect(sanitizeMotion({ preset: "SLIDE", slideDirection: "Right" }, "Frame")).toBeUndefined();
  });

  it("keeps inactive duration/direction but only keeps true hover on TextButton", () => {
    expect(sanitizeMotion({ durationMs: 300, slideDirection: "right", hover: false }, "TextButton"))
      .toEqual({ durationMs: 300, slideDirection: "right" });
    expect(sanitizeMotion({ preset: "fade", hover: true }, "TextLabel")).toEqual({ preset: "fade" });
    expect(sanitizeMotion({ hover: true }, "TextButton")).toEqual({ hover: true });
  });
});

describe("motion constants", () => {
  it("exposes frozen runtime defaults", () => {
    expect(MOTION_DEFAULTS).toEqual({
      closedScale: 0.92,
      hoverScale: 1.03,
      slideOffsetPx: 24,
      durationMs: 240,
      slideDirection: "left",
      easingStyle: "quad",
      easingDirection: "out",
    });
    expect(Object.isFrozen(MOTION_DEFAULTS)).toBe(true);
  });

  it.each([
    ["left", { x: -24, y: 0 }],
    ["right", { x: 24, y: 0 }],
    ["up", { x: 0, y: -24 }],
    ["down", { x: 0, y: 24 }],
  ] as const)("returns an immutable %s slide offset", (direction, expected) => {
    const offset = motionClosedOffset(direction);
    expect(offset).toEqual(expected);
    expect(Object.isFrozen(offset)).toBe(true);
  });

  it("recognizes exactly the motion-capable Roblox classes", () => {
    for (const cls of ["Frame", "ScrollingFrame", "TextLabel", "TextButton", "TextBox", "ImageLabel"] as const) {
      expect(isMotionClass(cls)).toBe(true);
    }
    for (const cls of ["ScreenGui", "UICorner", "UIGradient", "UIListLayout", "UIGridLayout", "UIPadding"] as const) {
      expect(isMotionClass(cls)).toBe(false);
    }
  });
});

describe("motion resolution", () => {
  it("returns one frozen result per node and disables unsupported nodes", () => {
    const scene = [
      node({ id: "root", cls: "ScreenGui", motion: { preset: "fade" } }),
      node({ id: "frame", parentId: "root", motion: { preset: "slide" } }),
      node({ id: "helper", cls: "UICorner", parentId: "frame", motion: { preset: "scale" } }),
    ];
    const resolved = resolveSceneMotion(scene);

    expect([...resolved.keys()]).toEqual(["root", "frame", "helper"]);
    expect(resolved.get("root")).toEqual({
      eligible: false,
      durationMs: 240,
      slideDirection: "left",
      hover: false,
      slideBlocked: false,
      fadeBlocked: false,
      initialOpen: false,
    });
    expect(resolved.get("frame")).toMatchObject({
      eligible: true,
      preset: "slide",
      effectivePreset: "slide",
      durationMs: 240,
      slideDirection: "left",
      hover: false,
      initialOpen: true,
    });
    expect(resolved.get("helper")?.effectivePreset).toBeUndefined();
    for (const value of resolved.values()) expect(Object.isFrozen(value)).toBe(true);
  });

  it("re-sanitizes hostile runtime motion and defaults hover-only duration", () => {
    const scene = [
      node({
        id: "hostile",
        cls: "TextButton",
        motion: {
          preset: "FADE",
          durationMs: Number.POSITIVE_INFINITY,
          hover: true,
        } as unknown as SceneNode["motion"],
      }),
    ];
    expect(resolveSceneMotion(scene).get("hostile")).toEqual({
      eligible: true,
      durationMs: 240,
      slideDirection: "left",
      hover: true,
      slideBlocked: false,
      fadeBlocked: false,
      initialOpen: false,
    });
  });

  it("checks initial visibility through the full ancestor chain", () => {
    const scene = [
      node({ id: "root", cls: "ScreenGui" }),
      node({ id: "hidden", parentId: "root", initialVisible: false }),
      node({ id: "middle", parentId: "hidden" }),
      node({ id: "child", parentId: "middle", motion: { preset: "scale" } }),
      node({ id: "hover", cls: "TextButton", parentId: "root", motion: { hover: true } }),
      node({ id: "plain", parentId: "root" }),
    ];
    expect(isEffectivelyInitiallyVisible(scene, scene[3])).toBe(false);
    expect(isEffectivelyInitiallyVisible(scene, scene[5])).toBe(true);
    const resolved = resolveSceneMotion(scene);
    expect(resolved.get("child")?.initialOpen).toBe(false);
    expect(resolved.get("hover")?.initialOpen).toBe(false);
    expect(resolved.get("plain")?.initialOpen).toBe(false);
  });

  it("applies layout Slide and effective Fade ancestor precedence without mutation", () => {
    const scene = [
      node({ id: "root", cls: "ScreenGui" }),
      node({ id: "topFade", parentId: "root", motion: { preset: "fade" } }),
      node({ id: "layout", parentId: "topFade", layout: "list" }),
      node({ id: "slide", parentId: "layout", motion: { preset: "slide", slideDirection: "right" } }),
      node({ id: "directFade", parentId: "topFade", motion: { preset: "fade" } }),
      node({ id: "nestedFade", parentId: "directFade", motion: { preset: "fade" } }),
    ];
    const original = structuredClone(scene);
    const resolved = resolveSceneMotion(scene);

    expect(resolved.get("topFade")).toMatchObject({ effectivePreset: "fade", fadeBlocked: false });
    expect(resolved.get("slide")).toMatchObject({
      preset: "slide",
      effectivePreset: "scale",
      slideBlocked: true,
      fadeBlocked: true,
      slideDirection: "right",
    });
    expect(resolved.get("directFade")).toMatchObject({
      preset: "fade",
      effectivePreset: "scale",
      fadeBlocked: true,
    });
    expect(resolved.get("nestedFade")).toMatchObject({ effectivePreset: "scale", fadeBlocked: true });
    expect(scene).toEqual(original);
  });

  it("resolves layout-only Slide to Fade and direct Fade ancestry to Scale", () => {
    const scene = [
      node({ id: "layout", layout: "grid" }),
      node({ id: "slide", parentId: "layout", motion: { preset: "slide" } }),
      node({ id: "fade", motion: { preset: "fade" } }),
      node({ id: "childFade", parentId: "fade", motion: { preset: "fade" } }),
    ];
    const resolved = resolveSceneMotion(scene);
    expect(resolved.get("slide")).toMatchObject({ effectivePreset: "fade", slideBlocked: true, fadeBlocked: false });
    expect(resolved.get("childFade")).toMatchObject({ effectivePreset: "scale", fadeBlocked: true });
  });

  it("resolves child-first arrays through parent links", () => {
    const scene = [
      node({ id: "child", parentId: "layout", motion: { preset: "slide" } }),
      node({ id: "layout", parentId: "fade", layout: "list" }),
      node({ id: "fade", motion: { preset: "fade" } }),
    ];
    expect(resolveSceneMotion(scene).get("child")).toMatchObject({
      effectivePreset: "scale",
      slideBlocked: true,
      fadeBlocked: true,
    });
  });

  it("fails closed for missing parents and safely handles cycles", () => {
    const missing = node({ id: "missing", parentId: "absent", motion: { preset: "fade" } });
    expect(isEffectivelyInitiallyVisible([missing], missing)).toBe(false);
    expect(resolveSceneMotion([missing]).get("missing")?.initialOpen).toBe(false);

    const cycle = [
      node({ id: "a", parentId: "b", motion: { preset: "fade" } }),
      node({ id: "b", parentId: "a", motion: { preset: "fade" } }),
    ];
    expect(() => resolveSceneMotion(cycle)).not.toThrow();
    expect(resolveSceneMotion(cycle).get("a")?.effectivePreset).toBe("fade");
    expect(resolveSceneMotion(cycle).get("b")?.effectivePreset).toBe("fade");
  });
});
