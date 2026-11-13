import { describe, expect, it } from "vitest";
import { strFromU8, unzipSync } from "fflate";
import { SAMPLE_SCENE } from "./catalog";
import {
  GAMEPASS_ICON_PRESETS,
  kitGamepassIcons,
  renderGamepassIconSvg,
} from "./gamepass-icons";
import { createAllIconsPackZip, createKitProPackage, createStudioRbxmxZip } from "./kit-package";
import { kitToRbxmx } from "./rbxmx";
import { getKit, KITS } from "./kits";
import { getKitZh } from "./kits.zh";
import { getTemplate } from "./templates";
import { getTheme } from "./themes";

describe("kit registry coherence", () => {
  it("covers six kits with valid zh entries, templates and themes", () => {
    expect(KITS.length).toBe(6);
    for (const kit of KITS) {
      const zh = getKitZh(kit.slug);
      expect(zh, `missing zh prose for ${kit.slug}`).toBeDefined();
      expect(zh?.screens.length, `screen count mismatch on ${kit.slug}`).toBe(
        kit.screens.length
      );
      expect(getTheme(kit.theme), `unknown theme on ${kit.slug}`).toBeDefined();
      expect(kit.screens.length, `${kit.slug} must bundle five screens`).toBe(5);
      for (const screen of kit.screens) {
        expect(
          getTemplate(screen.template),
          `${kit.slug} references unknown template ${screen.template}`
        ).toBeDefined();
      }
    }
  });

  it("exposes exactly six kit gamepass icons per kit with unique ids", () => {
    const seenIds = new Set<string>();
    for (const kit of KITS) {
      const icons = kitGamepassIcons(kit.slug);
      expect(icons.length, `${kit.slug} icon count`).toBe(6);
      for (const icon of icons) {
        expect(seenIds.has(icon.id), `duplicate icon id ${icon.id}`).toBe(false);
        seenIds.add(icon.id);
        expect(renderGamepassIconSvg(icon)).toContain('width="512"');
      }
    }
  });

  it("ships the twelve canonical presets", () => {
    expect(GAMEPASS_ICON_PRESETS.map((icon) => icon.id)).toEqual([
      "vip-crown",
      "2x-cash",
      "auto-hatch",
      "3x-luck",
      "speed-boost",
      "starter-pack",
      "mega-gems",
      "admin-shield",
      "2x-sword-dmg",
      "daily-gift",
      "super-rebirth",
      "boss-hunter",
    ]);
  });

  it("rejects empty icon titles", () => {
    expect(() =>
      renderGamepassIconSvg({ ...GAMEPASS_ICON_PRESETS[0]!, titleTop: "  " })
    ).toThrow(/titleTop/i);
  });
});

describe("createKitProPackage", () => {
  it("bundles the unified rbxmx, per-screen files and six icons", () => {
    const kit = getKit("simulator-kit");
    expect(kit).toBeDefined();
    const bundle = createKitProPackage(kit!);
    expect(bundle.filename).toBe("simulator-kit-pro.zip");
    expect(bundle.bytes.length).toBeGreaterThan(0);

    const files = unzipSync(bundle.bytes);
    expect(Object.keys(files)).toContain("simulator-kit-complete.rbxmx");
    expect(Object.keys(files)).toContain("screens/01-main-menu.rbxmx");
    expect(Object.keys(files)).toContain("screens/01-main-menu.client.lua");
    expect(Object.keys(files)).toContain("screens/05-settings.rbxmx");
    expect(Object.keys(files)).toContain("server/simulator-kit.server.lua");
    expect(Object.keys(files)).toContain("scenes/01-main-menu.json");
    expect(Object.keys(files)).toContain("README-STUDIO.md");

    const iconNames = Object.keys(files).filter(
      (name) => name.startsWith("icons/") && name.endsWith(".svg")
    );
    expect(iconNames.length).toBe(6);
    for (const iconName of iconNames) {
      const iconSvg = strFromU8(files[iconName]!);
      expect(iconSvg).toContain('width="512"');
      expect(iconSvg).toContain('height="512"');
    }

    const completeXml = strFromU8(files["simulator-kit-complete.rbxmx"]!);
    expect(completeXml.match(/<Item class="ScreenGui"/g)?.length).toBe(5);
    expect(completeXml).toContain("KitScreenSwitcher");
  });

  it("emits all five ScreenGuis for a kit through kitToRbxmx", () => {
    const kit = getKit("rng-aura-kit");
    expect(kit).toBeDefined();
    const xml = kitToRbxmx(kit!);
    expect(xml.match(/<Item class="ScreenGui"/g)?.length).toBe(5);
    expect(xml).toContain(">01_");
    expect(xml).toContain(">05_");
  });

  it("fails fast for a kit with no screens", () => {
    expect(() =>
      createKitProPackage({ ...getKit("simulator-kit")!, screens: [] })
    ).toThrow(/no screens/i);
  });
});

describe("createStudioRbxmxZip", () => {
  it("bundles rbxmx, client script, project and guide", () => {
    const bundle = createStudioRbxmxZip(SAMPLE_SCENE, "print('client')", null);
    expect(bundle.filename).toBe("game-menu.zip");
    expect(bundle.rbxmxFilename).toBe("game-menu.rbxmx");
    expect(bundle.rbxmxXml).toContain('version="4"');
    expect(bundle.bytes.length).toBeGreaterThan(0);

    const files = unzipSync(bundle.bytes);
    expect(Object.keys(files)).toContain("game-menu.rbxmx");
    expect(Object.keys(files)).toContain("roblox-gui.client.lua");
    expect(Object.keys(files)).toContain("project.json");
    expect(Object.keys(files)).toContain("STUDIO-IMPORT.md");
    expect(Object.keys(files)).not.toContain("roblox-gui.server.lua");

    const rbxmxXml = strFromU8(files["game-menu.rbxmx"]!);
    expect(rbxmxXml).toContain('<string name="Name">GameMenu</string>');
  });

  it("includes the server script when provided", () => {
    const bundle = createStudioRbxmxZip(
      SAMPLE_SCENE,
      "print('client')",
      "print('server')"
    );
    const files = unzipSync(bundle.bytes);
    expect(Object.keys(files)).toContain("roblox-gui.server.lua");
  });
});

describe("createAllIconsPackZip", () => {
  it("bundles all presets, kit variants and the pass-shop rbxmx", () => {
    const pack = createAllIconsPackZip();
    expect(pack.filename).toBe("roblox-gamepass-icon-pack-pro.zip");
    expect(pack.bytes.length).toBeGreaterThan(0);

    const files = unzipSync(pack.bytes);
    expect(Object.keys(files)).toContain("game-pass-shop.rbxmx");

    const iconNames = Object.keys(files).filter(
      (name) => name.startsWith("icons/") && name.endsWith(".svg")
    );
    expect(iconNames.length).toBe(GAMEPASS_ICON_PRESETS.length + KITS.length * 6);
    const iconIds = iconNames.map((name) =>
      name.replace("icons/", "").replace(/\.svg$/, "")
    );
    expect(new Set(iconIds).size).toBe(iconIds.length);

    const shopXml = strFromU8(files["game-pass-shop.rbxmx"]!);
    expect(shopXml.match(/<Item class="ScreenGui"/g)?.length).toBe(1);

    for (const iconName of iconNames.slice(0, 3)) {
      const iconSvg = strFromU8(files[iconName]!);
      expect(iconSvg).toContain('width="512"');
      expect(iconSvg).toContain('height="512"');
    }
  });
});
