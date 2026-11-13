import { describe, expect, it } from "vitest";
import type { SceneNode } from "./catalog";
import { applyTheme, getTheme, THEMES, type Palette } from "./themes";

function node(overrides: Partial<SceneNode>): SceneNode {
  return {
    id: "n",
    cls: "Frame",
    name: "N",
    pos: { x: 0, y: 0 },
    size: { x: 1, y: 1 },
    color: "#15171f",
    transparency: 0,
    cornerRadius: 8,
    zindex: 1,
    ...overrides,
  };
}

// A target palette with obviously distinct values so assertions are unambiguous.
const target: Palette = {
  surface: "#0a0a0a",
  panel: "#111111",
  panelRaised: "#222222",
  primary: "#ff0000",
  onPrimary: "#00ff00",
  accent: "#0000ff",
  success: "#00ffff",
  ink: "#ffffff",
  inkDim: "#cccccc",
  inkMute: "#888888",
};

describe("applyTheme — structural recoloring", () => {
  it("recolors the primary action color", () => {
    const out = applyTheme([node({ color: "#00a2ff" })], target);
    expect(out[0].color).toBe(target.primary);
  });

  it("recolors surface / panel / panel-raised by layer", () => {
    const out = applyTheme(
      [
        node({ id: "bg", color: "#0b0d14" }),
        node({ id: "panel", color: "#15171f" }),
        node({ id: "raised", color: "#1d1f29" }),
      ],
      target,
    );
    expect(out[0].color).toBe(target.surface);
    expect(out[1].color).toBe(target.panel);
    expect(out[2].color).toBe(target.panelRaised);
  });

  it("recolors ink text colors", () => {
    const out = applyTheme(
      [node({ color: "#000000", transparency: 1, textColor: "#e1e1ef", text: "x" })],
      target,
    );
    expect(out[0].textColor).toBe(target.ink);
  });

  it("recolors on-primary text", () => {
    const out = applyTheme(
      [node({ color: "#00a2ff", textColor: "#001d34", text: "PLAY" })],
      target,
    );
    expect(out[0].textColor).toBe(target.onPrimary);
  });

  it("recolors gradient stops", () => {
    const out = applyTheme(
      [
        node({
          color: "#0b0d14",
          gradient: { stops: [{ at: 0, color: "#15171f" }, { at: 1, color: "#00a2ff" }] },
        }),
      ],
      target,
    );
    expect(out[0].gradient?.stops[0]?.color).toBe(target.panel);
    expect(out[0].gradient?.stops[1]?.color).toBe(target.primary);
  });

  it("recolors stroke color", () => {
    const out = applyTheme(
      [node({ stroke: { color: "#00a2ff", transparency: 0, thickness: 2 } })],
      target,
    );
    expect(out[0].stroke?.color).toBe(target.primary);
  });
});

describe("applyTheme — preservation", () => {
  it("keeps decorative / unmapped colors unchanged", () => {
    const out = applyTheme(
      [
        node({ id: "gold", color: "#fbbf24" }),
        node({ id: "purple", color: "#a78bfa" }),
      ],
      target,
    );
    expect(out[0].color).toBe("#fbbf24");
    expect(out[1].color).toBe("#a78bfa");
  });

  it("does not mutate the input scene", () => {
    const original = node({ color: "#00a2ff" });
    applyTheme([original], target);
    expect(original.color).toBe("#00a2ff");
  });

  it("tolerates hex without a leading hash", () => {
    const out = applyTheme([node({ color: "00a2ff" })], target);
    expect(out[0].color).toBe(target.primary);
  });
});

describe("themes registry", () => {
  it("exposes the six palettes", () => {
    expect(THEMES.map((t) => t.name)).toEqual([
      "nexus",
      "sunset",
      "arctic",
      "emerald",
      "royal",
      "crimson",
    ]);
  });

  it("getTheme resolves by name and returns undefined for unknown", () => {
    expect(getTheme("sunset")?.name).toBe("sunset");
    expect(getTheme("emerald")?.primary).toBe("#10b981");
    expect(getTheme("royal")?.primary).toBe("#a855f7");
    expect(getTheme("crimson")?.primary).toBe("#f43f5e");
    expect(getTheme("nope")).toBeUndefined();
  });
});
