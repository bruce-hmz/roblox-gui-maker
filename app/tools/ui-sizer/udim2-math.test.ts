import { describe, expect, it } from "vitest";
import {
  VIEWPORT_PRESETS,
  generateResponsiveConstraintLuau,
  pixelsToScale,
  scaleToPixels,
} from "./udim2-math";

describe("udim2-math", () => {
  it("converts pixels to UDim2 scale and back accurately", () => {
    expect(pixelsToScale(480, 270, 1920, 1080)).toEqual({ x: 0.25, y: 0.25 });
    expect(scaleToPixels(0.25, 0.25, 1920, 1080)).toEqual({ x: 480, y: 270 });
    expect(pixelsToScale(100, 50, 0, 0)).toEqual({ x: 100, y: 50 });
  });

  it("emits valid Luau with UDim2.fromScale, AnchorPoint, and constraints", () => {
    const code = generateResponsiveConstraintLuau({
      instanceName: "ShopPanel",
      scalePos: { x: 0.5, y: 0.5 },
      scaleSize: { x: 0.4, y: 0.55 },
      anchorPoint: { x: 0.5, y: 0.5 },
      aspectRatio: 1.45,
      minSize: { x: 280, y: 190 },
      maxSize: { x: 760, y: 520 },
    });
    expect(code).toContain("UDim2.fromScale(0.5, 0.5)");
    expect(code).toContain("UIAspectRatioConstraint");
    expect(code).toContain("AspectRatio = 1.45");
    expect(code).toContain("UISizeConstraint");
    expect(code).toContain("Vector2.new(280, 190)");
  });

  it("includes desktop, laptop, tablet, mobile, and 4K viewport presets", () => {
    expect(VIEWPORT_PRESETS.length).toBeGreaterThanOrEqual(5);
  });
});
