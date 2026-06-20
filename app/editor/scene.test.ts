import { describe, expect, it } from "vitest";
import type { SceneNode } from "./catalog";
import {
  applyPreviewAction,
  createPreviewVisibility,
  createNode,
  duplicateSubtree,
  generateLuau,
  orderedChildren,
  reparentNode,
  reorderSibling,
  removeSubtree,
  previewActionNotice,
} from "./scene";

const node = (overrides: Partial<SceneNode>): SceneNode => ({
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

function actionScene(action: NonNullable<SceneNode["action"]>): SceneNode[] {
  return [
    node({ id: "root", cls: "ScreenGui", name: "Gui" }),
    node({
      id: "panel",
      cls: "Frame",
      name: "Panel",
      parentId: "root",
      initialVisible: false,
    }),
    node({
      id: "button",
      cls: "TextButton",
      name: "Button",
      parentId: "root",
      text: "GO",
      action,
    }),
  ];
}

describe("button actions", () => {
  it("fires valid Teleport requests through one internal RemoteEvent lookup", () => {
    const scene = actionScene({ type: "teleport", placeId: "123" });
    scene.push(node({
      id: "second-button",
      cls: "TextButton",
      name: "Second",
      parentId: "root",
      action: { type: "teleport", placeId: "456" },
    }));

    const code = generateLuau(scene);

    expect(code).toContain('local rgm = ReplicatedStorage:WaitForChild("RGM")');
    expect(code.match(/WaitForChild\("TeleportRequest"\)/g)).toHaveLength(1);
    expect(code).toContain('teleportRequest:FireServer("123")');
    expect(code).toContain('teleportRequest:FireServer("456")');
  });

  it("does not wire a skipped duplicate-id Teleport button", () => {
    const scene = actionScene({ type: "teleport", placeId: "123" });
    scene.push(node({
      id: "button",
      cls: "TextButton",
      name: "Duplicate",
      parentId: "root",
      action: { type: "teleport", placeId: "456" },
    }));

    const code = generateLuau(scene);

    expect(code).toContain('teleportRequest:FireServer("123")');
    expect(code).not.toContain('teleportRequest:FireServer("456")');
    expect(code.match(/\.Activated:Connect/g)).toHaveLength(1);
  });

  it("ignores malformed runtime Teleport actions", () => {
    const scene = actionScene({ type: "teleport", placeId: "01" } as NonNullable<SceneNode["action"]>);

    const code = generateLuau(scene);

    expect(code).not.toContain("TeleportRequest");
    expect(code).not.toContain("FireServer");
  });

  it.each([
    ["show", "el0.Visible = true"],
    ["hide", "el0.Visible = false"],
    ["toggle", "el0.Visible = not el0.Visible"],
  ] as const)("generates %s panel behavior", (type, statement) => {
    const code = generateLuau(actionScene({ type, targetId: "panel" }));

    expect(code).toContain("el0.Visible = false");
    expect(code).toContain("el1.Activated:Connect(function()");
    expect(code).toContain(statement);
  });

  it("generates hide-GUI behavior", () => {
    const code = generateLuau(actionScene({ type: "hideGui" }));

    expect(code).toContain("gui.Enabled = false");
  });

  it("does not generate an invalid target action", () => {
    const code = generateLuau(actionScene({ type: "show", targetId: "missing" }));

    expect(code).not.toContain("Activated:Connect");
  });

  it("looks up each remote once and fires from every remote button", () => {
    const scene = actionScene({ type: "remoteEvent", eventName: "ShopAction", argument: "buy_sword" });
    scene.push(node({
      id: "second-button",
      cls: "TextButton",
      name: "Second",
      parentId: "root",
      action: { type: "remoteEvent", eventName: "ShopAction", argument: 'buy"shield' },
    }));

    const code = generateLuau(scene);

    expect(code).toContain('local ReplicatedStorage = game:GetService("ReplicatedStorage")');
    expect(code).toContain('local remotes = ReplicatedStorage:WaitForChild("Remotes")');
    expect(code.match(/local remote0 = remotes:WaitForChild\("ShopAction"\)/g)).toHaveLength(1);
    expect(code).toContain('remote0:FireServer("buy_sword")');
    expect(code).toContain('remote0:FireServer("buy\\"shield")');
    expect(code.match(/remote0:FireServer/g)).toHaveLength(2);
    expect(code).not.toContain('Instance.new("RemoteEvent")');
  });

  it("wires only the first emitted TextButton when node ids are duplicated", () => {
    const scene = actionScene({ type: "remoteEvent", eventName: "ShopAction", argument: "first" });
    scene.push(node({
      id: "button",
      cls: "TextButton",
      name: "Duplicate",
      parentId: "root",
      action: { type: "remoteEvent", eventName: "ShopAction", argument: "second" },
    }));

    const code = generateLuau(scene);

    expect(code).toContain('remote0:FireServer("first")');
    expect(code).not.toContain('remote0:FireServer("second")');
    expect(code.match(/\.Activated:Connect/g)).toHaveLength(1);
  });

  it("does not look up a different event from a skipped duplicate id", () => {
    const scene = actionScene({ type: "remoteEvent", eventName: "ShopAction", argument: "first" });
    scene.push(node({
      id: "button",
      cls: "TextButton",
      name: "Duplicate",
      parentId: "root",
      action: { type: "remoteEvent", eventName: "AdminAction", argument: "second" },
    }));

    const code = generateLuau(scene);

    expect(code).toContain('remotes:WaitForChild("ShopAction")');
    expect(code).toContain('remote0:FireServer("first")');
    expect(code).not.toContain("AdminAction");
    expect(code).not.toContain('FireServer("second")');
  });

  it.each([
    { type: "remoteEvent", argument: "buy_sword" },
    { type: "remoteEvent", eventName: "ShopAction" },
    { type: "remoteEvent", eventName: " ShopAction ", argument: "buy_sword" },
    { type: "remoteEvent", eventName: "Shop-Action", argument: "buy_sword" },
    { type: "remoteEvent", eventName: "ShopAction", argument: "x".repeat(201) },
  ])("ignores malformed runtime remote action %#", (action) => {
    const scene = actionScene(action as NonNullable<SceneNode["action"]>);

    expect(() => generateLuau(scene)).not.toThrow();
    const code = generateLuau(scene);
    expect(code).not.toContain("ReplicatedStorage");
    expect(code).not.toContain("FireServer");
  });

  it("does not emit remote services for visibility-only actions", () => {
    const code = generateLuau(actionScene({ type: "toggle", targetId: "panel" }));

    expect(code).toContain("el0.Visible = not el0.Visible");
    expect(code).not.toContain("ReplicatedStorage");
  });
});

describe("responsive Luau geometry", () => {
  it("exports offsets, anchor, aspect ratio, and size constraints", () => {
    const code = generateLuau([
      node({ id: "root", cls: "ScreenGui", name: "Gui" }),
      node({
        id: "panel",
        parentId: "root",
        pos: { x: 0.5, y: 0.25 },
        posOffset: { x: 12, y: -4 },
        size: { x: 0.4, y: 0.2 },
        sizeOffset: { x: 20, y: 10 },
        anchor: { x: 0.5, y: 1 },
        aspectRatio: 1.778,
        minSize: { x: 320, y: 180 },
        maxSize: { x: 960, y: 540 },
      }),
    ]);

    expect(code).toContain("el0.Position = UDim2.new(0.5, 12, 0.25, -4)");
    expect(code).toContain("el0.Size = UDim2.new(0.4, 20, 0.2, 10)");
    expect(code).toContain("el0.AnchorPoint = Vector2.new(0.5, 1)");
    expect(code).toContain('local el0_aspect = Instance.new("UIAspectRatioConstraint")');
    expect(code).toContain("el0_aspect.AspectRatio = 1.778");
    expect(code).toContain("el0_aspect.DominantAxis = Enum.DominantAxis.Width");
    expect(code).toContain('local el0_size = Instance.new("UISizeConstraint")');
    expect(code).toContain("el0_size.MinSize = Vector2.new(320, 180)");
    expect(code).toContain("el0_size.MaxSize = Vector2.new(960, 540)");
  });

  it("exports scale-only geometry without constraint instances", () => {
    const code = generateLuau([
      node({ id: "root", cls: "ScreenGui", name: "Gui" }),
      node({ id: "panel", parentId: "root", pos: { x: 0.2, y: 0.3 }, size: { x: 0.4, y: 0.5 } }),
    ]);

    expect(code).toContain("el0.Position = UDim2.new(0.2, 0, 0.3, 0)");
    expect(code).toContain("el0.Size = UDim2.new(0.4, 0, 0.5, 0)");
    expect(code).not.toContain("UIAspectRatioConstraint");
    expect(code).not.toContain("UISizeConstraint");
    expect(code).not.toContain("AnchorPoint");
  });

  it("exports responsive horizontal list layout properties", () => {
    const code = generateLuau([
      node({ id: "root", cls: "ScreenGui", name: "Gui" }),
      node({
        id: "list",
        parentId: "root",
        layout: "list",
        listDirection: "horizontal",
        listGap: { scale: 0.1, offset: 12 },
        layoutHorizontalAlignment: "center",
        layoutVerticalAlignment: "bottom",
      }),
    ]);

    expect(code).toContain("el0_list.FillDirection = Enum.FillDirection.Horizontal");
    expect(code).toContain("el0_list.Padding = UDim.new(0.1, 12)");
    expect(code).toContain("el0_list.HorizontalAlignment = Enum.HorizontalAlignment.Center");
    expect(code).toContain("el0_list.VerticalAlignment = Enum.VerticalAlignment.Bottom");
  });

  it("exports responsive grid layout properties", () => {
    const code = generateLuau([
      node({ id: "root", cls: "ScreenGui", name: "Gui" }),
      node({
        id: "grid",
        parentId: "root",
        layout: "grid",
        gridCellSize: {
          scale: { x: 0.25, y: 0.5 },
          offset: { x: 12, y: 24 },
        },
        gridCellPadding: {
          scale: { x: 0.01, y: 0.02 },
          offset: { x: 4, y: 6 },
        },
        layoutHorizontalAlignment: "right",
        layoutVerticalAlignment: "center",
      }),
    ]);

    expect(code).toContain("el0_grid.CellSize = UDim2.new(0.25, 12, 0.5, 24)");
    expect(code).toContain("el0_grid.CellPadding = UDim2.new(0.01, 4, 0.02, 6)");
    expect(code).toContain("el0_grid.HorizontalAlignment = Enum.HorizontalAlignment.Right");
    expect(code).toContain("el0_grid.VerticalAlignment = Enum.VerticalAlignment.Center");
  });

  it("exports responsive list layout on the root ScreenGui", () => {
    const code = generateLuau([
      node({
        id: "root",
        cls: "ScreenGui",
        name: "Gui",
        transparency: 1,
        gradient: { from: "#112233", to: "#445566" },
        layout: "list",
        listDirection: "horizontal",
        listGap: { scale: 0.2, offset: 16 },
        layoutHorizontalAlignment: "center",
        layoutVerticalAlignment: "bottom",
      }),
      node({ id: "child", parentId: "root", name: "Child" }),
    ]);

    expect(code).toContain('local gui_content = Instance.new("Frame")');
    expect(code).toContain("gui_content.Size = UDim2.fromScale(1, 1)");
    expect(code).toContain("gui_content.BackgroundTransparency = 1");
    expect(code).toContain("gui_content.Parent = gui");
    expect(code).toContain('local gui_content_list = Instance.new("UIListLayout")');
    expect(code).toContain("gui_content_list.FillDirection = Enum.FillDirection.Horizontal");
    expect(code).toContain("gui_content_list.Padding = UDim.new(0.2, 16)");
    expect(code).toContain("gui_content_list.HorizontalAlignment = Enum.HorizontalAlignment.Center");
    expect(code).toContain("gui_content_list.VerticalAlignment = Enum.VerticalAlignment.Bottom");
    expect(code).toContain("gui_content_list.Parent = gui_content");
    expect(code).toContain("gui_bg.Parent = gui");
    expect(code).toContain("el0.Parent = gui_content");
  });

  it("exports responsive grid layout on the root ScreenGui", () => {
    const code = generateLuau([
      node({
        id: "root",
        cls: "ScreenGui",
        name: "Gui",
        layout: "grid",
        gridCellSize: {
          scale: { x: 0.25, y: 0.5 },
          offset: { x: 12, y: 24 },
        },
        gridCellPadding: {
          scale: { x: 0.01, y: 0.02 },
          offset: { x: 4, y: 6 },
        },
        layoutHorizontalAlignment: "right",
        layoutVerticalAlignment: "center",
      }),
      node({ id: "child", parentId: "root", name: "Child" }),
    ]);

    expect(code).toContain('local gui_content = Instance.new("Frame")');
    expect(code).toContain("gui_content.Size = UDim2.fromScale(1, 1)");
    expect(code).toContain("gui_content.BackgroundTransparency = 1");
    expect(code).toContain("gui_content.Parent = gui");
    expect(code).toContain('local gui_content_grid = Instance.new("UIGridLayout")');
    expect(code).toContain("gui_content_grid.CellSize = UDim2.new(0.25, 12, 0.5, 24)");
    expect(code).toContain("gui_content_grid.CellPadding = UDim2.new(0.01, 4, 0.02, 6)");
    expect(code).toContain("gui_content_grid.HorizontalAlignment = Enum.HorizontalAlignment.Right");
    expect(code).toContain("gui_content_grid.VerticalAlignment = Enum.VerticalAlignment.Center");
    expect(code).toContain("gui_content_grid.Parent = gui_content");
    expect(code).toContain("gui_bg.Parent = gui");
    expect(code).toContain("el0.Parent = gui_content");
  });

  it("preserves exact finite scale values in layout dimensions", () => {
    const listCode = generateLuau([
      node({ id: "root", cls: "ScreenGui", name: "Gui" }),
      node({
        id: "list",
        parentId: "root",
        layout: "list",
        listGap: { scale: 0.123456, offset: 8 },
      }),
    ]);
    const gridCode = generateLuau([
      node({ id: "root", cls: "ScreenGui", name: "Gui" }),
      node({
        id: "grid",
        parentId: "root",
        layout: "grid",
        gridCellSize: {
          scale: { x: 0.0004, y: 0.500001 },
          offset: { x: 12, y: 24 },
        },
      }),
    ]);

    expect(listCode).toContain("el0_list.Padding = UDim.new(0.123456, 8)");
    expect(gridCode).toContain(
      "el0_grid.CellSize = UDim2.new(0.0004, 12, 0.500001, 24)"
    );
  });

  it("preserves legacy list and grid layout defaults", () => {
    const listCode = generateLuau([
      node({ id: "root", cls: "ScreenGui", name: "Gui" }),
      node({ id: "list", parentId: "root", layout: "list" }),
    ]);
    const gridCode = generateLuau([
      node({ id: "root", cls: "ScreenGui", name: "Gui" }),
      node({ id: "grid", parentId: "root", layout: "grid" }),
    ]);

    expect(listCode).toContain("el0_list.FillDirection = Enum.FillDirection.Vertical");
    expect(listCode).toContain("el0_list.Padding = UDim.new(0, 8)");
    expect(gridCode).toContain("el0_grid.CellSize = UDim2.new(0, 100, 0, 100)");
    expect(gridCode).toContain("el0_grid.CellPadding = UDim2.new(0, 8, 0, 8)");
  });

  it("exports vertical automatic canvas sizing for ScrollingFrames", () => {
    const code = generateLuau([
      node({ id: "root", cls: "ScreenGui", name: "Gui" }),
      node({
        id: "scroll",
        cls: "ScrollingFrame",
        parentId: "root",
        automaticCanvasSize: "y",
      }),
    ]);

    expect(code).toContain("el0.AutomaticCanvasSize = Enum.AutomaticSize.Y");
    expect(code).toContain("el0.CanvasSize = UDim2.fromScale(0, 0)");
  });

  it("does not export disabled or inapplicable automatic canvas sizing", () => {
    const disabledCode = generateLuau([
      node({ id: "root", cls: "ScreenGui", name: "Gui" }),
      node({
        id: "scroll",
        cls: "ScrollingFrame",
        parentId: "root",
        automaticCanvasSize: "none",
      }),
    ]);
    const frameCode = generateLuau([
      node({ id: "root", cls: "ScreenGui", name: "Gui" }),
      node({
        id: "frame",
        cls: "Frame",
        parentId: "root",
        automaticCanvasSize: "y",
      }),
    ]);

    expect(disabledCode).not.toContain("AutomaticCanvasSize");
    expect(disabledCode).not.toContain("CanvasSize");
    expect(frameCode).not.toContain("AutomaticCanvasSize");
    expect(frameCode).not.toContain("CanvasSize");
  });
});

describe("visual asset Luau", () => {
  it("exports image, rotation, text, and stroke properties", () => {
    const code = generateLuau([
      node({ id: "root", cls: "ScreenGui", name: "Gui" }),
      node({
        id: "image",
        cls: "ImageLabel",
        name: "Icon",
        parentId: "root",
        image: "rbxassetid://1818",
        imageColor: "#12abef",
        rotation: 15,
        stroke: {
          color: "#010203",
          transparency: 0.25,
          thickness: 2,
        },
      }),
      node({
        id: "label",
        cls: "TextLabel",
        name: "Title",
        parentId: "root",
        text: "TITLE",
        textScaled: true,
        textWrapped: true,
      }),
    ]);

    expect(code).toContain('el0.Image = "rbxassetid://1818"');
    expect(code).toContain(
      "el0.ImageColor3 = Color3.fromRGB(18, 171, 239)"
    );
    expect(code).toContain("el0.Rotation = 15");
    expect(code).toContain('local el0_stroke = Instance.new("UIStroke")');
    expect(code).toContain(
      "el0_stroke.Color = Color3.fromRGB(1, 2, 3)"
    );
    expect(code).toContain("el0_stroke.Transparency = 0.25");
    expect(code).toContain("el0_stroke.Thickness = 2");
    expect(code).toContain("el0_stroke.Parent = el0");
    expect(code).toContain("el1.TextScaled = true");
    expect(code).toContain("el1.TextWrapped = true");
  });
});

describe("scene action state", () => {
  it("clears actions that target a deleted subtree", () => {
    const scene = actionScene({ type: "show", targetId: "panel" });

    const remaining = removeSubtree(scene, "panel");

    expect(remaining.find((item) => item.id === "button")?.action).toBeUndefined();
  });

  it("applies preview actions without mutating the scene", () => {
    const scene = actionScene({ type: "toggle", targetId: "panel" });
    const initial = createPreviewVisibility(scene);

    const next = applyPreviewAction(scene, initial, "button");

    expect(initial.panel).toBe(false);
    expect(next.panel).toBe(true);
    expect(scene.find((item) => item.id === "panel")?.initialVisible).toBe(false);
  });

  it("hides the root GUI in preview", () => {
    const scene = actionScene({ type: "hideGui" });

    const next = applyPreviewAction(scene, createPreviewVisibility(scene), "button");

    expect(next.root).toBe(false);
  });

  it("returns the same preview visibility reference for a remote action", () => {
    const scene = actionScene({ type: "remoteEvent", eventName: "ShopAction", argument: "buy_sword" });
    const visibility = createPreviewVisibility(scene);

    expect(applyPreviewAction(scene, visibility, "button")).toBe(visibility);
  });

  it("keeps remote actions when their argument matches a deleted node id", () => {
    const scene = actionScene({ type: "remoteEvent", eventName: "ShopAction", argument: "panel" });

    const remaining = removeSubtree(scene, "panel");

    expect(remaining.find((item) => item.id === "button")?.action).toEqual({
      type: "remoteEvent",
      eventName: "ShopAction",
      argument: "panel",
    });
  });

  it("keeps Teleport actions when their Place ID matches a deleted node id", () => {
    const scene = actionScene({ type: "teleport", placeId: "123" });
    scene.find((item) => item.id === "panel")!.id = "123";

    const remaining = removeSubtree(scene, "123");

    expect(remaining.find((item) => item.id === "button")?.action).toEqual({
      type: "teleport",
      placeId: "123",
    });
  });

  it("returns a non-live Preview notice for Teleport actions", () => {
    const scene = actionScene({ type: "teleport", placeId: "123" });
    const visibility = createPreviewVisibility(scene);

    expect(applyPreviewAction(scene, visibility, "button")).toBe(visibility);
    expect(previewActionNotice(scene, "button")).toBe(
      "Teleport to Place 123. Preview does not run live teleports."
    );
  });

  it("deep-clones RemoteEvent actions when duplicating a button", () => {
    const scene = actionScene({ type: "remoteEvent", eventName: "ShopAction", argument: "buy_sword" });

    const result = duplicateSubtree(scene, "button");
    const sourceAction = scene.find((item) => item.id === "button")!.action;
    const cloneAction = result?.nodes[0].action;

    expect(cloneAction).toEqual(sourceAction);
    expect(cloneAction).not.toBe(sourceAction);
  });

  it("deep-clones Teleport actions when duplicating a button", () => {
    const scene = actionScene({ type: "teleport", placeId: "123" });

    const result = duplicateSubtree(scene, "button");
    const sourceAction = scene.find((item) => item.id === "button")!.action;
    const cloneAction = result?.nodes[0].action;

    expect(cloneAction).toEqual(sourceAction);
    expect(cloneAction).not.toBe(sourceAction);
  });

  it("deep-clones stroke data when duplicating a node", () => {
    const source = node({
      stroke: { color: "#123456", transparency: 0.5, thickness: 3 },
    });

    const result = duplicateSubtree([source], source.id);
    const cloneStroke = result?.nodes[0].stroke;

    expect(cloneStroke).toEqual(source.stroke);
    expect(cloneStroke).not.toBe(source.stroke);
    if (!cloneStroke) throw new Error("Expected duplicated stroke");
    cloneStroke.color = "#ffffff";
    expect(source.stroke?.color).toBe("#123456");
  });

  it("deep-clones nested layout values when duplicating a grid container", () => {
    const source = node({
      layout: "grid",
      listGap: { scale: 0.1, offset: 8 },
      gridCellSize: {
        scale: { x: 0.25, y: 0.5 },
        offset: { x: 12, y: 24 },
      },
      gridCellPadding: {
        scale: { x: 0.01, y: 0.02 },
        offset: { x: 4, y: 6 },
      },
    });

    const clone = duplicateSubtree([source], source.id)?.nodes[0];
    if (!clone?.listGap || !clone.gridCellSize || !clone.gridCellPadding) {
      throw new Error("Expected duplicated layout values");
    }
    clone.gridCellSize.scale.x = 0.75;
    clone.gridCellSize.offset.x = 100;
    clone.gridCellPadding.scale.x = 0.2;
    clone.listGap.offset = 32;

    expect(source.gridCellSize?.scale.x).toBe(0.25);
    expect(source.gridCellSize?.offset.x).toBe(12);
    expect(source.gridCellPadding?.scale.x).toBe(0.01);
    expect(source.listGap?.offset).toBe(8);
  });
});

describe("hierarchy mutations", () => {
  const hierarchyScene = (): SceneNode[] => [
    node({ id: "root", cls: "ScreenGui", name: "Gui", layoutOrder: 0 }),
    node({ id: "left", cls: "Frame", name: "Left", parentId: "root", layoutOrder: 0 }),
    node({ id: "right", cls: "Frame", name: "Right", parentId: "root", layoutOrder: 1 }),
    node({
      id: "first",
      cls: "TextButton",
      name: "First",
      parentId: "left",
      layoutOrder: 0,
      action: { type: "show", targetId: "right" },
    }),
    node({ id: "second", cls: "TextLabel", name: "Second", parentId: "left", layoutOrder: 1 }),
    node({ id: "nested", cls: "Frame", name: "Nested", parentId: "first", layoutOrder: 0 }),
    node({ id: "right-child", cls: "TextLabel", name: "RightChild", parentId: "right" }),
  ];

  it("reparents a node into a container and preserves its action", () => {
    const moved = reparentNode(hierarchyScene(), "first", "right");
    const first = moved.find((item) => item.id === "first");

    expect(first?.parentId).toBe("right");
    expect(first?.layoutOrder).toBe(1);
    expect(first?.action).toEqual({ type: "show", targetId: "right" });
  });

  it.each([
    ["non-container", "first", "second"],
    ["itself", "left", "left"],
    ["its descendant", "left", "nested"],
    ["the root", "root", "right"],
  ])("rejects moving a node onto %s", (_label, id, parentId) => {
    const scene = hierarchyScene();

    expect(reparentNode(scene, id, parentId)).toBe(scene);
  });

  it("reorders siblings and normalizes layout order", () => {
    const scene = hierarchyScene();

    const reordered = reorderSibling(scene, "second", "first", "before");

    expect(orderedChildren(reordered, "left").map((item) => item.id)).toEqual([
      "second",
      "first",
    ]);
    expect(orderedChildren(reordered, "left").map((item) => item.layoutOrder)).toEqual([0, 1]);
  });

  it("rejects reordering nodes from different parents", () => {
    const scene = hierarchyScene();

    expect(reorderSibling(scene, "first", "right", "after")).toBe(scene);
  });

  it("orders equal or missing layout values by stable scene order", () => {
    const scene = hierarchyScene().map((item) =>
      item.id === "first" || item.id === "second"
        ? { ...item, layoutOrder: undefined }
        : item
    );

    expect(orderedChildren(scene, "left").map((item) => item.id)).toEqual([
      "first",
      "second",
    ]);
  });

  it("exports explicit LayoutOrder", () => {
    const code = generateLuau(hierarchyScene());

    expect(code).toContain("el0.LayoutOrder = 0");
    expect(code).toContain("el3.LayoutOrder = 1");
  });

  it("normalizes duplicate LayoutOrder values during export", () => {
    const scene = hierarchyScene().map((item) =>
      item.id === "second" ? { ...item, layoutOrder: 0 } : item
    );

    const code = generateLuau(scene);

    expect(code).toContain("el1.LayoutOrder = 0");
    expect(code).toContain("el3.LayoutOrder = 1");
  });

  it("appends a duplicated subtree after its siblings", () => {
    const scene = hierarchyScene().map((item) =>
      item.id === "first"
        ? {
            ...item,
            posOffset: { x: 1, y: 2 },
            sizeOffset: { x: 3, y: 4 },
            anchor: { x: 0.5, y: 1 },
            minSize: { x: 100, y: 50 },
            maxSize: { x: 500, y: 250 },
          }
        : item
    );

    const result = duplicateSubtree(scene, "first");
    const combined = result ? [...scene, ...result.nodes] : scene;
    const source = scene.find((item) => item.id === "first")!;
    const clone = result?.nodes.find((item) => item.id === result.newId)!;

    clone.posOffset!.x = 99;
    clone.sizeOffset!.x = 99;
    clone.anchor!.x = 0;
    clone.minSize!.x = 0;
    clone.maxSize!.x = 0;

    expect(orderedChildren(combined, "left").at(-1)?.id).toBe(result?.newId);
    expect(source.posOffset?.x).toBe(1);
    expect(source.sizeOffset?.x).toBe(3);
    expect(source.anchor?.x).toBe(0.5);
    expect(source.minSize?.x).toBe(100);
    expect(source.maxSize?.x).toBe(500);
  });

  it("appends a new node after siblings without explicit order", () => {
    const scene = hierarchyScene().map((item) =>
      item.parentId === "left" ? { ...item, layoutOrder: undefined } : item
    );

    const created = createNode("TextLabel", scene, "left");

    expect(orderedChildren([...scene, created], "left").at(-1)?.id).toBe(created.id);
  });
});
