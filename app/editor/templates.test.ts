import { describe, expect, it } from "vitest";
import type { SceneNode } from "./catalog";
import { TEMPLATES } from "./templates";

const expectedSlugs = [
  "game-pass-shop",
  "code-redeem",
  "daily-rewards",
  "quest-tracker",
] as const;

function requiredTemplate(slug: string) {
  const template = TEMPLATES.find((candidate) => candidate.slug === slug);
  if (!template) throw new Error(`Missing template: ${slug}`);
  return template;
}

function actionNodes(scene: SceneNode[]) {
  return scene.filter((node) => node.action);
}

describe("high-intent templates", () => {
  it("defines every required slug exactly once", () => {
    for (const slug of expectedSlugs) {
      expect(
        TEMPLATES.filter((template) => template.slug === slug)
      ).toHaveLength(1);
    }
    expect(new Set(TEMPLATES.map((template) => template.slug)).size).toBe(
      TEMPLATES.length
    );
  });

  it("keeps node IDs and references valid within every scene", () => {
    for (const template of TEMPLATES) {
      const ids = template.scene.map((node) => node.id);
      const idSet = new Set(ids);
      expect(idSet.size, template.slug).toBe(ids.length);

      for (const node of template.scene) {
        if (node.parentId) {
          expect(
            idSet.has(node.parentId),
            `${template.slug}:${node.name}`
          ).toBe(true);
        }
        if (
          node.action &&
          ["show", "hide", "toggle"].includes(node.action.type)
        ) {
          expect(node.action).toHaveProperty("targetId");
          expect(
            idSet.has(
              "targetId" in node.action ? node.action.targetId ?? "" : ""
            ),
            `${template.slug}:${node.name}`
          ).toBe(true);
        }
      }
    }
  });

  it("configures distinct game-pass purchase requests", () => {
    const scene = requiredTemplate("game-pass-shop").scene;
    const actions = actionNodes(scene).map((node) => node.action);
    expect(actions).toEqual([
      {
        type: "remoteEvent",
        eventName: "PurchaseGamePass",
        argument: "vip",
      },
      {
        type: "remoteEvent",
        eventName: "PurchaseGamePass",
        argument: "double-coins",
      },
      {
        type: "remoteEvent",
        eventName: "PurchaseGamePass",
        argument: "speed-coil",
      },
    ]);
    expect(
      scene
        .filter((node) => node.name.startsWith("PassCard"))
        .map((node) => node.size.x)
    ).toEqual([1, 1, 1]);
  });

  it("does not fake dynamic code redemption with a static action", () => {
    const template = requiredTemplate("code-redeem");
    expect(
      template.scene.some(
        (node) => node.cls === "TextBox" && node.name === "CodeInput"
      )
    ).toBe(true);
    expect(actionNodes(template.scene)).toHaveLength(0);
  });

  it("configures the daily claim request", () => {
    const scene = requiredTemplate("daily-rewards").scene;
    expect(actionNodes(scene).map((node) => node.action)).toEqual([
      {
        type: "remoteEvent",
        eventName: "ClaimDailyReward",
        argument: "day-4",
      },
    ]);
    expect(scene.find((node) => node.name === "DayGrid")?.layout).toBeUndefined();
    expect(
      scene
        .filter((node) => /^Day\d+$/.test(node.name))
        .map((node) => node.pos.x)
    ).toEqual([0, 0.14, 0.28, 0.42, 0.56, 0.7, 0.84]);
  });

  it("keeps the quest toggle outside the details it controls", () => {
    const scene = requiredTemplate("quest-tracker").scene;
    const details = scene.find((node) => node.name === "QuestDetails");
    const toggle = scene.find((node) => node.name === "ToggleDetails");
    expect(details).toBeDefined();
    expect(toggle?.parentId).not.toBe(details?.id);
    expect(toggle?.action).toEqual({ type: "toggle", targetId: details?.id });
  });

  it("defines the shop item grid layout explicitly", () => {
    const itemGrid = requiredTemplate("shop").scene.find(
      (node) => node.name === "ItemGrid"
    );

    expect(itemGrid).toMatchObject({
      cls: "ScrollingFrame",
      layout: "grid",
      automaticCanvasSize: "y",
      gridCellSize: {
        scale: { x: 0.3, y: 0 },
        offset: { x: 0, y: 120 },
      },
      gridCellPadding: {
        scale: { x: 0.02, y: 0 },
        offset: { x: 4, y: 8 },
      },
    });
  });

  it("defines the inventory slots grid layout explicitly", () => {
    const slots = requiredTemplate("inventory").scene.find(
      (node) => node.name === "Slots"
    );

    expect(slots).toMatchObject({
      layout: "grid",
      gridCellSize: {
        scale: { x: 0.22, y: 0 },
        offset: { x: 0, y: 92 },
      },
      gridCellPadding: {
        scale: { x: 0, y: 0 },
        offset: { x: 8, y: 8 },
      },
    });
  });
});
