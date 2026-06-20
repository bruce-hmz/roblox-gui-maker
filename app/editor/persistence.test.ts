import { describe, expect, it } from "vitest";
import type { SceneNode } from "./catalog";
import {
  parseSceneDocument,
  sanitizeScene,
  sceneDocumentFilename,
  serializeSceneDocument,
} from "./persistence";

const node = (overrides: Partial<SceneNode> = {}): SceneNode => ({
  id: "node",
  cls: "Frame",
  name: "Node",
  parentId: null,
  pos: { x: 0, y: 0 },
  size: { x: 1, y: 1 },
  color: "#000000",
  transparency: 0,
  cornerRadius: 0,
  zindex: 1,
  ...overrides,
});

describe("sanitizeScene", () => {
  it("sanitizes layout values while preserving valid scrolling canvas sizing", () => {
    const scene = sanitizeScene([
      node({
        cls: "ScrollingFrame",
        layout: "grid",
        gridCellSize: {
          scale: { x: 2, y: -1 },
          offset: { x: 12.7, y: 9000 },
        },
        automaticCanvasSize: "y",
      }),
    ]);

    expect(scene?.[0]).toMatchObject({
      layout: "grid",
      gridCellSize: {
        scale: { x: 1, y: 0 },
        offset: { x: 13, y: 4096 },
      },
      automaticCanvasSize: "y",
    });
  });

  it("drops invalid layout enums without removing the node", () => {
    const scene = sanitizeScene([
      {
        ...node(),
        layout: "columns",
        listDirection: "diagonal",
        layoutHorizontalAlignment: "middle",
        layoutVerticalAlignment: "baseline",
        automaticCanvasSize: "both",
      },
    ]);

    expect(scene).toHaveLength(1);
    expect(scene?.[0]).not.toHaveProperty("layout");
    expect(scene?.[0]).not.toHaveProperty("listDirection");
    expect(scene?.[0]).not.toHaveProperty("layoutHorizontalAlignment");
    expect(scene?.[0]).not.toHaveProperty("layoutVerticalAlignment");
    expect(scene?.[0]).not.toHaveProperty("automaticCanvasSize");
  });

  it("keeps AutomaticCanvasSize only on ScrollingFrame nodes", () => {
    const scene = sanitizeScene([
      node({ id: "frame", cls: "Frame", automaticCanvasSize: "xy" }),
      node({
        id: "scrolling-frame",
        cls: "ScrollingFrame",
        automaticCanvasSize: "xy",
      }),
    ]);

    expect(scene?.[0]).not.toHaveProperty("automaticCanvasSize");
    expect(scene?.[1].automaticCanvasSize).toBe("xy");
  });

  it("sanitizes visual fields by class and bounds", () => {
    const scene = sanitizeScene([
      node({
        cls: "ImageLabel",
        image: "1818",
        imageColor: "#abcdef",
        rotation: 999,
        stroke: {
          color: "#123456",
          transparency: 3,
          thickness: 200,
        },
      }),
      node({
        id: "text",
        cls: "TextLabel",
        text: "Label",
        image: "rbxassetid://9",
        textScaled: true,
        textWrapped: true,
      }),
    ]);

    expect(scene?.[0]).toMatchObject({
      image: "rbxassetid://1818",
      imageColor: "#abcdef",
      rotation: 360,
      stroke: {
        color: "#123456",
        transparency: 1,
        thickness: 100,
      },
    });
    expect(scene?.[1]).not.toHaveProperty("image");
    expect(scene?.[1]).toMatchObject({
      textScaled: true,
      textWrapped: true,
    });
  });

  it("drops malformed optional visual fields without removing the node", () => {
    const scene = sanitizeScene([
      {
        ...node({ cls: "ImageLabel" }),
        image: "https://example.com/image.png",
        imageColor: "blue",
        rotation: "quarter turn",
        textScaled: "yes",
        textWrapped: 1,
        stroke: {
          color: "red",
          transparency: "none",
          thickness: null,
        },
      },
    ]);

    expect(scene).toHaveLength(1);
    expect(scene?.[0]).not.toHaveProperty("image");
    expect(scene?.[0]).not.toHaveProperty("imageColor");
    expect(scene?.[0]).not.toHaveProperty("rotation");
    expect(scene?.[0]).not.toHaveProperty("textScaled");
    expect(scene?.[0]).not.toHaveProperty("textWrapped");
    expect(scene?.[0]).not.toHaveProperty("stroke");
  });

  it("preserves a valid Teleport action", () => {
    const scene = sanitizeScene([
      node({
        cls: "TextButton",
        action: { type: "teleport", placeId: "12345678901234" } as SceneNode["action"],
      }),
    ]);

    expect(scene?.[0].action).toEqual({
      type: "teleport",
      placeId: "12345678901234",
    });
  });

  it.each(["0", "01", "9007199254740992"])(
    "removes invalid Teleport Place ID %s without removing its button",
    (placeId) => {
      const scene = sanitizeScene([
        node({
          id: "teleport-button",
          cls: "TextButton",
          action: { type: "teleport", placeId } as SceneNode["action"],
        }),
      ]);

      expect(scene).toHaveLength(1);
      expect(scene?.[0].action).toBeUndefined();
    }
  );

  it("preserves a valid RemoteEvent action with a trimmed event name", () => {
    const scene = sanitizeScene([
      node({
        cls: "TextButton",
        action: {
          type: "remoteEvent",
          eventName: "  ShopAction  ",
          argument: "buy_sword",
        },
      }),
    ]);

    expect(scene?.[0].action).toEqual({
      type: "remoteEvent",
      eventName: "ShopAction",
      argument: "buy_sword",
    });
  });

  it("removes an invalid RemoteEvent action without removing its button", () => {
    const scene = sanitizeScene([
      node({
        id: "shop-button",
        cls: "TextButton",
        action: {
          type: "remoteEvent",
          eventName: "Shop-Action",
          argument: "buy_sword",
        },
      }),
    ]);

    expect(scene).toHaveLength(1);
    expect(scene?.[0].id).toBe("shop-button");
    expect(scene?.[0].action).toBeUndefined();
  });

  it.each([
    { type: "show" as const, targetId: "panel" },
    { type: "hide" as const, targetId: "panel" },
    { type: "toggle" as const, targetId: "panel" },
    { type: "hideGui" as const },
  ])("keeps the existing $type action compatible", (action) => {
    expect(
      sanitizeScene([node({ cls: "TextButton", action })])?.[0].action
    ).toEqual(action);
  });

  it("sanitizes responsive geometry without sharing optional vectors", () => {
    const raw = node({
      posOffset: { x: 12.4, y: -3.6 },
      sizeOffset: { x: 20, y: 10 },
      anchor: { x: 2, y: -1 },
      minSize: { x: 320, y: 180 },
      maxSize: { x: 960, y: 540 },
    });

    const scene = sanitizeScene([raw]);
    const sanitized = scene?.[0];

    expect(sanitized).toMatchObject({
      posOffset: { x: 12, y: -4 },
      sizeOffset: { x: 20, y: 10 },
      anchor: { x: 1, y: 0 },
      minSize: { x: 320, y: 180 },
      maxSize: { x: 960, y: 540 },
    });
    expect(sanitized?.posOffset).not.toBe(raw.posOffset);
    expect(sanitized?.sizeOffset).not.toBe(raw.sizeOffset);
    expect(sanitized?.anchor).not.toBe(raw.anchor);
    expect(sanitized?.minSize).not.toBe(raw.minSize);
    expect(sanitized?.maxSize).not.toBe(raw.maxSize);

    if (!sanitized?.posOffset) throw new Error("Expected sanitized position offset");
    sanitized.posOffset.x = 99;
    expect(raw.posOffset).toEqual({ x: 12.4, y: -3.6 });
  });

  it("drops invalid nodes, repairs orphans, and breaks parent cycles", () => {
    const scene = sanitizeScene([
      node({ id: "orphan", parentId: "missing" }),
      node({ id: "a", parentId: "b" }),
      node({ id: "b", parentId: "a" }),
      { id: "invalid", cls: "Bogus" },
    ]);

    expect(scene?.map(({ id, parentId }) => ({ id, parentId }))).toEqual([
      { id: "orphan", parentId: null },
      { id: "a", parentId: null },
      { id: "b", parentId: "a" },
    ]);
  });

  it("preserves every relationship in a long valid parent chain", () => {
    const raw = Array.from({ length: 200 }, (_, index) =>
      node({
        id: `node-${index}`,
        parentId: index === 0 ? null : `node-${index - 1}`,
      })
    );

    const scene = sanitizeScene(raw);

    expect(scene?.map(({ parentId }) => parentId)).toEqual(
      raw.map(({ parentId }) => parentId)
    );
  });

  it("returns null for non-arrays and arrays without valid nodes", () => {
    expect(sanitizeScene({ scene: [] })).toBeNull();
    expect(sanitizeScene([])).toBeNull();
    expect(sanitizeScene([null, { id: "invalid", cls: "Bogus" }])).toBeNull();
  });
});

describe("scene project documents", () => {
  it("round-trips every approved layout field in document version 1", () => {
    const scene: SceneNode[] = [
      node({
        cls: "ScrollingFrame",
        layout: "grid",
        padding: 16,
        listDirection: "horizontal",
        listGap: { scale: 0.05, offset: 8 },
        layoutHorizontalAlignment: "right",
        layoutVerticalAlignment: "bottom",
        gridCellSize: {
          scale: { x: 0.25, y: 0.5 },
          offset: { x: 12, y: 24 },
        },
        gridCellPadding: {
          scale: { x: 0.01, y: 0.02 },
          offset: { x: 4, y: 6 },
        },
        automaticCanvasSize: "xy",
      }),
    ];

    const serialized = serializeSceneDocument(scene);

    expect(JSON.parse(serialized).version).toBe(1);
    expect(parseSceneDocument(serialized)).toEqual(scene);
  });

  it("round-trips visual asset properties", () => {
    const scene = [
      node({
        cls: "ImageLabel",
        image: "rbxassetid://1818",
        imageColor: "#12abef",
        rotation: 15,
        stroke: {
          color: "#010203",
          transparency: 0.25,
          thickness: 2,
        },
      }),
    ];

    const serialized = serializeSceneDocument(scene);

    expect(JSON.parse(serialized).version).toBe(1);
    expect(parseSceneDocument(serialized)).toEqual(scene);
  });

  it("round-trips a Teleport action without changing document version 1", () => {
    const scene: SceneNode[] = [
      node({
        id: "teleport-button",
        cls: "TextButton",
        action: { type: "teleport", placeId: "12345678901234" } as SceneNode["action"],
      }),
    ];

    const serialized = serializeSceneDocument(scene);

    expect(JSON.parse(serialized).version).toBe(1);
    expect(parseSceneDocument(serialized)).toEqual(scene);
  });

  it("round-trips a RemoteEvent action without changing document version 1", () => {
    const scene: SceneNode[] = [
      node({
        id: "shop-button",
        cls: "TextButton",
        action: {
          type: "remoteEvent",
          eventName: "ShopAction",
          argument: "buy_sword",
        },
      }),
    ];

    const serialized = serializeSceneDocument(scene);

    expect(JSON.parse(serialized).version).toBe(1);
    expect(parseSceneDocument(serialized)).toEqual(scene);
  });

  it("round-trips a versioned scene document", () => {
    const scene: SceneNode[] = [
      node({
        id: "screen",
        cls: "ScreenGui",
        name: "Main Menu",
      }),
      node({
        id: "play-button",
        cls: "TextButton",
        name: "Play",
        parentId: "screen",
        posOffset: { x: 12, y: -4 },
        sizeOffset: { x: 20, y: 10 },
        anchor: { x: 0.5, y: 1 },
        aspectRatio: 16 / 9,
        minSize: { x: 320, y: 180 },
        maxSize: { x: 960, y: 540 },
        action: { type: "hideGui" },
      }),
    ];

    const serialized = serializeSceneDocument(scene);

    expect(JSON.parse(serialized)).toMatchObject({
      format: "roblox-gui-maker",
      version: 1,
      scene,
    });
    expect(parseSceneDocument(serialized)).toEqual(scene);
  });

  it.each([
    ["invalid JSON", "{", "This file is not valid JSON."],
    [
      "wrong format",
      JSON.stringify({ format: "other", version: 1, scene: [node()] }),
      "This is not a Roblox GUI Maker project.",
    ],
    [
      "unsupported version",
      JSON.stringify({
        format: "roblox-gui-maker",
        version: 2,
        scene: [node()],
      }),
      "Project version 2 is not supported.",
    ],
    [
      "empty scene",
      JSON.stringify({ format: "roblox-gui-maker", version: 1, scene: [] }),
      "The project contains no valid GUI elements.",
    ],
  ])("rejects %s", (_label, text, message) => {
    expect(() => parseSceneDocument(text)).toThrowError(message);
  });
});

describe("sceneDocumentFilename", () => {
  it("slugifies the root ScreenGui name", () => {
    expect(
      sceneDocumentFilename([
        node({ cls: "ScreenGui", name: "Main Menu!" }),
      ])
    ).toBe("main-menu.json");
  });

  it("separates camel-cased template names", () => {
    expect(
      sceneDocumentFilename([node({ cls: "ScreenGui", name: "MainMenu" })])
    ).toBe("main-menu.json");
  });

  it("uses the fallback without a root ScreenGui", () => {
    expect(sceneDocumentFilename([node({ cls: "Frame" })])).toBe(
      "roblox-gui-project.json"
    );
  });

  it("uses the fallback when the root name has no ASCII letters or digits", () => {
    expect(
      sceneDocumentFilename([node({ cls: "ScreenGui", name: "主菜单" })])
    ).toBe("roblox-gui-project.json");
  });
});
