import { describe, expect, it } from "vitest";
import {
  CLOTHING_UV_REGIONS,
  ROBLOX_CLOTHING_HEIGHT,
  ROBLOX_CLOTHING_WIDTH,
  SHIRT_STYLE_PRESETS,
  buildClothingTemplateSvg,
  validateClothingDimensions,
} from "./shirt-uv";

describe("shirt-uv", () => {
  it("keeps all 18 official Roblox UV regions inside 585x559 without overlap", () => {
    expect(CLOTHING_UV_REGIONS).toHaveLength(18);
    for (const region of CLOTHING_UV_REGIONS) {
      expect(region.x).toBeGreaterThanOrEqual(0);
      expect(region.y).toBeGreaterThanOrEqual(0);
      expect(region.x + region.width).toBeLessThanOrEqual(ROBLOX_CLOTHING_WIDTH);
      expect(region.y + region.height).toBeLessThanOrEqual(ROBLOX_CLOTHING_HEIGHT);
    }

    for (let i = 0; i < CLOTHING_UV_REGIONS.length; i++) {
      const a = CLOTHING_UV_REGIONS[i]!;
      for (let j = i + 1; j < CLOTHING_UV_REGIONS.length; j++) {
        const b = CLOTHING_UV_REGIONS[j]!;
        const overlaps =
          a.x < b.x + b.width &&
          a.x + a.width > b.x &&
          a.y < b.y + b.height &&
          a.y + a.height > b.y;
        expect(overlaps, `${a.id} overlaps ${b.id}`).toBe(false);
      }
    }
  });

  it("validates exact, scaled, and invalid clothing image dimensions", () => {
    expect(validateClothingDimensions(585, 559)).toMatchObject({
      valid: true,
      status: "exact",
    });
    expect(validateClothingDimensions(1170, 1118)).toMatchObject({
      valid: true,
      status: "scaled",
    });
    expect(validateClothingDimensions(512, 512)).toMatchObject({
      valid: false,
      status: "invalid",
    });
    expect(validateClothingDimensions(0, 559).valid).toBe(false);
  });

  it("renders deterministic 585x559 SVG with and without UV guides", () => {
    const preset = SHIRT_STYLE_PRESETS[0]!;
    const cleanSvg = buildClothingTemplateSvg(preset, {
      includeGuides: false,
      includeLabels: false,
    });
    expect(cleanSvg).toContain('width="585" height="559"');
    expect(cleanSvg).not.toContain('fill="#0f172a"');
    expect(cleanSvg).toContain("BLOX");

    const guidedSvg = buildClothingTemplateSvg(preset, {
      includeGuides: true,
      includeLabels: true,
      blankTemplateOnly: true,
    });
    expect(guidedSvg).toContain("Torso Top");
    expect(guidedSvg).toContain("R Front");
  });
});
