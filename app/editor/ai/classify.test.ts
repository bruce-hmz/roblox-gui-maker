import { describe, expect, it } from "vitest";
import { classifyScreenType, mockSpecFromPrompt } from "./classify";
import { PROMPT_FIXTURES } from "./prompt-fixtures";
import { composeScene } from "./composer";
import { parseGuiDesignSpec } from "./spec";

describe("classifyScreenType", () => {
  it("classifies all 30 fixtures correctly", () => {
    const misses = PROMPT_FIXTURES.filter(
      (f) => classifyScreenType(f.prompt) !== f.screenType
    );
    expect(misses).toEqual([]);
  });

  it("prefers screen identity over passing mentions", () => {
    expect(
      classifyScreenType("Create a title screen with Play, Shop and Settings")
    ).toBe("main-menu");
    expect(
      classifyScreenType("Create a horror main menu with Play and Settings")
    ).toBe("main-menu");
    expect(classifyScreenType("Create a settings menu with music toggles")).toBe(
      "settings"
    );
    expect(classifyScreenType("do something random")).toBe("main-menu");
  });
});

describe("mockSpecFromPrompt", () => {
  it("extracts counts from digits and word numbers", () => {
    const hud = mockSpecFromPrompt(
      "Create an anime battleground HUD with health, stamina, four skills and an ultimate meter."
    );
    expect(hud.screenType).toBe("hud");
    expect(hud.blocks).toContainEqual({ type: "skill-bar", slots: 4 });
    expect(hud.blocks).toContainEqual({ type: "ultimate-meter" });
    expect(hud.blocks).toContainEqual({ type: "stat-bar", stat: "health" });
    expect(hud.blocks).toContainEqual({ type: "stat-bar", stat: "stamina" });

    const inventory = mockSpecFromPrompt(
      "Create an RPG inventory with 20 item slots and item details panel."
    );
    expect(inventory.blocks).toContainEqual({ type: "item-grid", count: 20 });
    expect(inventory.blocks).toContainEqual({ type: "item-details" });

    const shop = mockSpecFromPrompt(
      "Create a modern simulator shop with six game passes."
    );
    const passGrid = shop.blocks.find((b) => b.type === "game-pass-grid");
    expect(passGrid && passGrid.type === "game-pass-grid").toBeTruthy();
    if (passGrid?.type === "game-pass-grid") expect(passGrid.passes).toHaveLength(6);

    const rewards = mockSpecFromPrompt("Create a seven-day daily rewards interface.");
    expect(rewards.blocks).toContainEqual({ type: "reward-calendar", days: 7 });
  });

  it("produces specs that validate and compose for every fixture", () => {
    for (const fixture of PROMPT_FIXTURES) {
      const spec = mockSpecFromPrompt(fixture.prompt);
      const parsed = parseGuiDesignSpec(spec);
      expect(parsed.ok, fixture.prompt).toBe(true);
      if (parsed.ok) {
        expect(() => composeScene(parsed.spec), fixture.prompt).not.toThrow();
        expect(parsed.spec.screenType).toBe(fixture.screenType);
      }
    }
  });
});
