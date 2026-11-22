import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const PLUGIN_PATH = resolve(
  process.cwd(),
  "public/studio-plugin/RobloxGuiMakerSync.lua"
);

describe("RobloxGuiMakerSync.lua", () => {
  const source = readFileSync(PLUGIN_PATH, "utf8");

  it("supports all 7 scene classes and Studio decorators offline", () => {
    for (const cls of [
      "ScreenGui",
      "Frame",
      "TextLabel",
      "TextButton",
      "TextBox",
      "ImageLabel",
      "ScrollingFrame",
      "UICorner",
      "UIStroke",
      "UIGradient",
      "UIListLayout",
      "UIGridLayout",
      "UIPadding",
      "UIAspectRatioConstraint",
      "UISizeConstraint",
    ]) {
      expect(source).toContain(cls);
    }
    expect(source).toContain("JSONDecode");
    expect(source).toContain("ChangeHistoryService");
  });

  it("stays strictly offline with zero remote requests or external requires", () => {
    expect(source).not.toMatch(/GetAsync|PostAsync|RequestAsync|require\s*\(/);
  });
});
