import { describe, expect, it } from "vitest";
import {
  GAME_ICON_SIZE,
  ROBLOX_SAFE_ZONES,
  THUMBNAIL_HEIGHT,
  THUMBNAIL_PRESETS,
  THUMBNAIL_WIDTH,
  buildThumbnailFilename,
  computeIconCropRect,
} from "./thumbnail-spec";

describe("thumbnail-spec", () => {
  it("defines exact 1920x1080 and 512x512 Roblox dimensions and safe zones", () => {
    expect(THUMBNAIL_WIDTH).toBe(1920);
    expect(THUMBNAIL_HEIGHT).toBe(1080);
    expect(GAME_ICON_SIZE).toBe(512);

    for (const zone of Object.values(ROBLOX_SAFE_ZONES)) {
      expect(zone.x).toBeGreaterThanOrEqual(0);
      expect(zone.y).toBeGreaterThanOrEqual(0);
      expect(zone.x + zone.width).toBeLessThanOrEqual(THUMBNAIL_WIDTH);
      expect(zone.y + zone.height).toBeLessThanOrEqual(THUMBNAIL_HEIGHT);
    }
  });

  it("computes the centered 1:1 icon crop square inside 1920x1080", () => {
    expect(computeIconCropRect()).toEqual({ x: 420, y: 0, size: 1080 });
  });

  it("ships 6 genre presets and builds clean filenames", () => {
    expect(THUMBNAIL_PRESETS).toHaveLength(6);
    expect(buildThumbnailFilename("MEGA PETS UPDATE 12", "1920x1080")).toBe(
      "mega-pets-update-12-1920x1080.png"
    );
    expect(buildThumbnailFilename("   ", "512x512")).toBe(
      "roblox-thumbnail-512x512.png"
    );
  });
});
