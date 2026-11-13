import { describe, expect, it } from "vitest";
import type { SceneNode } from "./catalog";
import { KITS } from "./kits";
import { kitToRbxmx, rbxmxFilename, sceneToRbxmx } from "./rbxmx";

let nodeCounter = 0;
function node(overrides: Partial<SceneNode> & Pick<SceneNode, "cls">): SceneNode {
  nodeCounter += 1;
  return {
    id: `n${nodeCounter}`,
    name: overrides.name ?? overrides.cls,
    parentId: null,
    pos: { x: 0.25, y: 0.3 },
    size: { x: 0.5, y: 0.4 },
    color: "#1d1f29",
    transparency: 0,
    cornerRadius: 0,
    zindex: 1,
    ...overrides,
  };
}

function rootGui(name = "TestGui"): SceneNode {
  return node({
    cls: "ScreenGui",
    name,
    pos: { x: 0, y: 0 },
    size: { x: 1, y: 1 },
    transparency: 1,
    cornerRadius: 0,
    zindex: 0,
  });
}

describe("sceneToRbxmx — document structure", () => {
  it("rejects an empty scene", () => {
    expect(() => sceneToRbxmx([])).toThrow(/empty/i);
  });

  it("emits a version-4 roblox document with one ScreenGui root", () => {
    const xml = sceneToRbxmx([rootGui()]);
    expect(
      xml.startsWith('<roblox xmlns:xmime="http://www.w3.org/2005/05/xmlmime"')
    ).toBe(true);
    expect(xml.endsWith("</roblox>")).toBe(true);
    expect(xml).toContain('version="4"');
    expect(xml.match(/<Item class="ScreenGui"/g)?.length).toBe(1);
    expect(xml).toContain('<bool name="ResetOnSpawn">false</bool>');
    expect(xml).toContain('<bool name="IgnoreGuiInset">true</bool>');
    expect(xml).toContain('<token name="ZIndexBehavior">1</token>');
    expect(xml).toContain('<bool name="Enabled">true</bool>');
    expect(xml).toContain('<int name="DisplayOrder">0</int>');
  });

  it("honors screenGuiName / enabled / displayOrder options", () => {
    const xml = sceneToRbxmx([rootGui()], {
      screenGuiName: "Custom",
      enabled: false,
      displayOrder: 3,
    });
    expect(xml).toContain('<string name="Name">Custom</string>');
    expect(xml).toContain('<bool name="Enabled">false</bool>');
    expect(xml).toContain('<int name="DisplayOrder">3</int>');
  });

  it("assigns deterministic sequential RBX referents", () => {
    const gui = rootGui();
    const frame = node({ cls: "Frame", name: "Panel" });
    const xml = sceneToRbxmx([gui, frame]);
    const referents = xml.match(/referent="([^"]+)"/g) ?? [];
    expect(referents).toEqual(['referent="RBX0001"', 'referent="RBX0002"']);
    expect(xml).toBe(sceneToRbxmx([gui, frame]));
  });

  it("derives the .rbxmx filename from the root ScreenGui", () => {
    expect(rbxmxFilename([rootGui("MainMenu")])).toBe("main-menu.rbxmx");
  });

  it("emits a screen background frame for styled ScreenGui roots", () => {
    const gui = rootGui();
    gui.transparency = 0;
    const xml = sceneToRbxmx([gui]);
    expect(xml).toContain('<string name="Name">ScreenBackground</string>');
    expect(xml).toContain(
      '<UDim2 name="Size"><XS>1</XS><XO>0</XO><YS>1</YS><YO>0</YO></UDim2>'
    );
    expect(xml).toContain('<int name="ZIndex">0</int>');
  });
});

describe("sceneToRbxmx — node properties", () => {
  it("escapes XML text and attributes", () => {
    const xml = sceneToRbxmx([
      rootGui(),
      node({ cls: "TextLabel", name: 'Title<"x">', text: "a<b>&c'd" }),
    ]);
    expect(xml).toContain("Title&lt;&quot;x&quot;&gt;");
    expect(xml).toContain("a&lt;b&gt;&amp;c&apos;d");
    expect(xml).not.toContain("a<b>");
  });

  it("emits UDim2 position/size with scale and offset channels", () => {
    const xml = sceneToRbxmx([
      rootGui(),
      node({
        cls: "Frame",
        name: "Panel",
        pos: { x: 0.3, y: 0.16 },
        posOffset: { x: 4, y: -6 },
        size: { x: 0.4, y: 0.5 },
        sizeOffset: { x: 10, y: 0 },
      }),
    ]);
    expect(xml).toContain(
      '<UDim2 name="Position"><XS>0.3</XS><XO>4</XO><YS>0.16</YS><YO>-6</YO></UDim2>'
    );
    expect(xml).toContain(
      '<UDim2 name="Size"><XS>0.4</XS><XO>10</XO><YS>0.5</YS><YO>0</YO></UDim2>'
    );
    expect(xml).toContain('<Vector2 name="AnchorPoint"><X>0</X><Y>0</Y></Vector2>');
    expect(xml).toContain('<int name="BorderSizePixel">0</int>');
    expect(xml).toContain('<bool name="Visible">true</bool>');
  });

  it("normalizes Color3 channels to 0..1 with four decimals", () => {
    const xml = sceneToRbxmx([
      rootGui(),
      node({ cls: "Frame", name: "Panel", color: "#00a2ff" }),
    ]);
    expect(xml).toContain(
      '<Color3 name="BackgroundColor3"><R>0.0000</R><G>0.6353</G><B>1.0000</B></Color3>'
    );
  });

  it("emits text properties and a GothamSSm FontFace", () => {
    const xml = sceneToRbxmx([
      rootGui(),
      node({
        cls: "TextButton",
        name: "Play",
        text: "PLAY",
        font: "GothamBold",
        textSize: 20,
        textColor: "#001d34",
      }),
    ]);
    expect(xml).toContain('<string name="Text">PLAY</string>');
    expect(xml).toContain('<float name="TextSize">20</float>');
    expect(xml).toContain('<bool name="TextScaled">false</bool>');
    expect(xml).toContain("<Weight>700</Weight>");
    expect(xml).toContain("<Style>Normal</Style>");
    expect(xml).toContain("rbxasset://fonts/families/GothamSSm.json");
  });

  it("maps alternate fonts to their families", () => {
    const xml = sceneToRbxmx([
      rootGui(),
      node({ cls: "TextLabel", name: "Mono", text: "print(1)", font: "Code" }),
    ]);
    expect(xml).toContain("rbxasset://fonts/families/Inconsolata.json");
    expect(xml).toContain("<Weight>400</Weight>");
  });

  it("emits UICorner / UIGradient / UIStroke modifiers", () => {
    const xml = sceneToRbxmx([
      rootGui(),
      node({
        cls: "Frame",
        name: "Card",
        cornerRadius: 18,
        gradient: {
          stops: [
            { at: 0.25, color: "#15171f" },
            { at: 0.75, color: "#00a2ff" },
          ],
          rotation: 45,
        },
        stroke: { color: "#00a2ff", transparency: 0.5, thickness: 1.5 },
      }),
    ]);
    expect(xml).toContain('<Item class="UICorner"');
    expect(xml).toContain('<UDim name="CornerRadius"><S>0</S><O>18</O></UDim>');
    expect(xml).toContain('<Item class="UIGradient"');
    expect(xml).toContain('<float name="Rotation">45</float>');
    const sequence =
      /<ColorSequence name="Color">([^<]+)<\/ColorSequence>/.exec(xml)?.[1] ?? "";
    expect(sequence.startsWith("0 ")).toBe(true);
    expect(sequence.endsWith(" 0")).toBe(true);
    expect(sequence).toContain(" 0.0824 ");
    expect(sequence).toContain(" 1 ");
    expect(xml).toContain('<Item class="UIStroke"');
    expect(xml).toContain('<float name="Thickness">1.5</float>');
  });

  it("emits UIListLayout and UIPadding for list containers", () => {
    const xml = sceneToRbxmx([
      rootGui(),
      node({ cls: "Frame", name: "List", layout: "list", padding: 8 }),
    ]);
    expect(xml).toContain('<Item class="UIListLayout"');
    expect(xml).toContain('<Item class="UIPadding"');
  });

  it("emits ScrollingFrame canvas properties and UIGridLayout", () => {
    const xml = sceneToRbxmx([
      rootGui(),
      node({ cls: "ScrollingFrame", name: "Grid", layout: "grid" }),
    ]);
    expect(xml).toContain(
      '<UDim2 name="CanvasSize"><XS>0</XS><XO>0</XO><YS>2</YS><YO>0</YO></UDim2>'
    );
    expect(xml).toContain('<int name="ScrollBarThickness">6</int>');
    expect(xml).toContain('<Item class="UIGridLayout"');
  });

  it("emits ImageLabel content and tint", () => {
    const xml = sceneToRbxmx([
      rootGui(),
      node({ cls: "ImageLabel", name: "Icon", image: "rbxassetid://123", imageColor: "#ffffff" }),
    ]);
    expect(xml).toContain("<Content name=\"Image\"><url>rbxassetid://123</url></Content>");
    expect(xml).toContain('<Color3 name="ImageColor3">');
  });

  it("marks nodes hidden when initialVisible is false", () => {
    const xml = sceneToRbxmx([
      rootGui(),
      node({ cls: "Frame", name: "Modal", initialVisible: false }),
    ]);
    expect(xml).toContain('<bool name="Visible">false</bool>');
  });

  it("rejects invalid hex colors instead of emitting broken XML", () => {
    expect(() =>
      sceneToRbxmx([rootGui(), node({ cls: "Frame", name: "Bad", color: "notahex" })])
    ).toThrow(/notahex/);
  });
});

describe("sceneToRbxmx — GuiInteractionController", () => {
  it("is absent when no button has an action", () => {
    const xml = sceneToRbxmx([
      rootGui(),
      node({ cls: "TextButton", name: "Plain", text: "HI" }),
    ]);
    expect(xml).not.toContain('<Item class="LocalScript"');
    expect(xml).not.toContain("GuiInteractionController");
  });

  it("wires hideGui, tweens, remote events and teleports", () => {
    const gui = rootGui();
    const modal = node({ cls: "Frame", name: "Modal", parentId: gui.id, initialVisible: false });
    const open = node({
      cls: "TextButton",
      name: "Open",
      parentId: gui.id,
      text: "OPEN",
      action: {
        type: "show",
        targetId: modal.id,
        transition: { style: "slide", duration: 0.35, direction: "up" },
      },
    });
    const close = node({
      cls: "TextButton",
      name: "Close",
      parentId: gui.id,
      text: "CLOSE",
      action: { type: "hide", targetId: modal.id },
    });
    const buy = node({
      cls: "TextButton",
      name: "Buy",
      parentId: gui.id,
      text: "BUY",
      action: { type: "remoteEvent", eventName: "PurchaseGamePass", argument: "vip" },
    });
    const leave = node({
      cls: "TextButton",
      name: "Leave",
      parentId: gui.id,
      text: "LEAVE",
      action: { type: "teleport", placeId: "123456" },
    });
    const xml = sceneToRbxmx([gui, modal, open, close, buy, leave]);

    expect(xml).toContain('<Item class="LocalScript"');
    expect(xml).toContain("GuiInteractionController");
    expect(xml).toContain("resolveNode({{&quot;Modal&quot;, 1}})");
    expect(xml).toContain(".Activated:Connect");
    expect(xml).toContain("TweenService:Create(target, info,");
    expect(xml).toContain("PurchaseGamePass");
    expect(xml).toContain("teleportRequest:FireServer(&quot;123456&quot;)");
  });

  it("emits gui.Enabled toggling for hideGui buttons", () => {
    const xml = sceneToRbxmx([
      rootGui(),
      node({
        cls: "TextButton",
        name: "Quit",
        text: "QUIT",
        action: { type: "hideGui" },
      }),
    ]);
    expect(xml).toContain("gui.Enabled = false");
  });

  it("omits wiring for buttons whose target is missing", () => {
    const xml = sceneToRbxmx([
      rootGui(),
      node({
        cls: "TextButton",
        name: "Ghost",
        text: "GHOST",
        action: { type: "toggle", targetId: "missing" },
      }),
    ]);
    expect(xml).toContain('<Item class="LocalScript"');
    expect(xml).not.toContain("Activated");
  });
});

describe("kitToRbxmx", () => {
  it("emits five ScreenGuis plus a switcher for every kit", () => {
    for (const kit of KITS) {
      const xml = kitToRbxmx(kit);
      expect(xml.match(/<Item class="ScreenGui"/g)?.length).toBe(5);
      expect(xml).toContain("KitScreenSwitcher");
      expect(xml).toContain(">01_");
      expect((xml.match(/<Item class="LocalScript"/g) ?? []).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("enables the first screen, HUD overlays, and disables modal screens", () => {
    const simulator = kitToRbxmx(KITS[0]!);
    expect((simulator.match(/<bool name="Enabled">true<\/bool>/g) ?? []).length).toBe(1);
    expect((simulator.match(/<bool name="Enabled">false<\/bool>/g) ?? []).length).toBe(4);

    const rngAura = kitToRbxmx(KITS.find((kit) => kit.slug === "rng-aura-kit")!);
    expect((rngAura.match(/<bool name="Enabled">true<\/bool>/g) ?? []).length).toBe(2);
  });

  it("is deterministic for the same kit", () => {
    const kit = KITS[1]!;
    expect(kitToRbxmx(kit)).toBe(kitToRbxmx(kit));
  });

  it("fails fast on unknown screen templates", () => {
    const broken = { ...KITS[0]!, screens: [{ role: "X", template: "no-such-template" }] };
    expect(() => kitToRbxmx(broken)).toThrow(/no-such-template/);
  });
});
