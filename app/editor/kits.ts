// Game UI Kits (Phase 1): a Kit bundles several existing single-screen templates
// under one shared theme, so they read as a cohesive game UI rather than loose
// fragments. Adding a kit is data-only — pick screens (existing template slugs)
// and a theme. kitScene recolors a screen with the kit's theme via applyTheme.

import type { SceneNode } from "./catalog";
import { getTemplate } from "./templates";
import { applyTheme, getTheme } from "./themes";

export type KitScreen = { role: string; template: string };

export type Kit = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  theme: string; // Theme.name
  // Template slug of the screen shown on the kit's card. Kits share most
  // templates and themes only recolor accents, so each kit gets a different
  // cover screen to keep the gallery cards distinguishable.
  cover: string;
  screens: KitScreen[];
};

export const KITS: Kit[] = [
  {
    slug: "simulator-kit",
    name: "Simulator Pro UI Kit",
    tagline: "Five cohesive screens for a clicker/simulator — warm sunset theme",
    description:
      "A complete simulator interface set: a main menu, a coin shop, a game pass storefront, a daily rewards calendar, and a settings panel — all sharing one warm theme so they look like one game.",
    theme: "sunset",
    cover: "daily-rewards",
    screens: [
      { role: "Main menu", template: "main-menu" },
      { role: "Coin shop", template: "shop" },
      { role: "Game pass store", template: "game-pass-shop" },
      { role: "Daily rewards", template: "daily-rewards" },
      { role: "Settings", template: "settings" },
    ],
  },
  {
    slug: "quest-rpg-kit",
    name: "Quest RPG UI Kit",
    tagline: "Five cohesive screens for an RPG — cool arctic theme",
    description:
      "A role-playing interface set: a main menu, an inventory grid, a shop, a leaderboard, and a quest tracker — unified under one cool theme and ready to drop into an adventure game.",
    theme: "arctic",
    cover: "quest-tracker",
    screens: [
      { role: "Main menu", template: "main-menu" },
      { role: "Inventory", template: "inventory" },
      { role: "Shop", template: "shop" },
      { role: "Leaderboard", template: "leaderboard" },
      { role: "Quest tracker", template: "quest-tracker" },
    ],
  },
  {
    slug: "tycoon-kit",
    name: "Tycoon Empire UI Kit",
    tagline: "Five cohesive screens for a tycoon — rich emerald theme",
    description:
      "A tycoon empire interface set: a main menu, a VIP & game pass store, a cash & dropper upgrade shop, a promo code panel, and a top tycoons leaderboard — unified under one deep emerald theme.",
    theme: "emerald",
    cover: "code-redeem",
    screens: [
      { role: "Main menu", template: "main-menu" },
      { role: "VIP & pass store", template: "game-pass-shop" },
      { role: "Cash & dropper upgrades", template: "shop" },
      { role: "Promo codes", template: "code-redeem" },
      { role: "Top tycoons", template: "leaderboard" },
    ],
  },
  {
    slug: "rng-aura-kit",
    name: "RNG & Aura Roll UI Kit",
    tagline: "Five cohesive screens for an RNG/aura roller — royal violet theme",
    description:
      "A luck-based roller interface set: a roll hub menu, an aura storage inventory, a luck & auto-roll pass store, a streak rewards calendar, and a rare-drop notification stack — unified under one royal violet theme.",
    theme: "royal",
    cover: "game-pass-shop",
    screens: [
      { role: "Roll hub menu", template: "main-menu" },
      { role: "Aura storage", template: "inventory" },
      { role: "Luck & auto-roll passes", template: "game-pass-shop" },
      { role: "Streak rewards", template: "daily-rewards" },
      { role: "Rare drop banner", template: "notification-toast" },
    ],
  },
  {
    slug: "obby-shop-kit",
    name: "Obby & Parkour Monetization Kit",
    tagline: "Five monetization-ready screens for an obby — crimson action theme",
    description:
      "A parkour monetization set: a stage menu, a skip-stage & speed-coil pass store, a playtime & daily gifts calendar, a boost code panel, and a stage HUD health bar — unified under one obsidian crimson theme.",
    theme: "crimson",
    cover: "main-menu",
    screens: [
      { role: "Stage menu", template: "main-menu" },
      { role: "Skip stage & coil passes", template: "game-pass-shop" },
      { role: "Playtime & daily gifts", template: "daily-rewards" },
      { role: "Boost codes", template: "code-redeem" },
      { role: "Stage HUD bar", template: "health-bar" },
    ],
  },
  {
    slug: "tower-defense-kit",
    name: "Tower Defense Command UI Kit",
    tagline: "Five cohesive screens for tower defense — electric nexus theme",
    description:
      "A tower defense command set: a lobby menu, a unit loadout inventory, a summon & crate shop, a wave missions tracker, and an endless wave leaderboard — unified under the classic electric nexus theme.",
    theme: "nexus",
    cover: "leaderboard",
    screens: [
      { role: "Lobby menu", template: "main-menu" },
      { role: "Unit loadout", template: "inventory" },
      { role: "Summon & crate shop", template: "shop" },
      { role: "Wave missions", template: "quest-tracker" },
      { role: "Endless wave ranks", template: "leaderboard" },
    ],
  },
];

export function getKit(slug: string): Kit | undefined {
  return KITS.find((k) => k.slug === slug);
}

// A kit screen's scene, recolored with the kit's theme. Returns undefined if the
// template or theme can't be resolved.
export function kitScene(kit: Kit, templateSlug: string): SceneNode[] | undefined {
  const tpl = getTemplate(templateSlug);
  const theme = getTheme(kit.theme);
  if (!tpl || !theme) return undefined;
  return applyTheme(tpl.scene, theme);
}
