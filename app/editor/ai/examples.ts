// Official AI examples: fixed GuiDesignSpecs with the prompt that would
// produce them. Doubles as (a) homepage showcase cards, (b) /editor?example=
// deep links that need no LLM, (c) the visual-regression fixtures, and (d)
// the human quality benchmark for real-model evaluation.

import type { SceneNode } from "../catalog";
import { composeScene } from "./composer";
import type { GuiDesignSpec } from "./spec";

export type AiExample = {
  slug: string;
  prompt: string;
  title: string;
  tagline: string;
  spec: GuiDesignSpec;
};

export const AI_EXAMPLES: AiExample[] = [
  {
    slug: "anime-battleground-hud",
    prompt:
      "Create an anime battleground HUD with health, stamina, four skills and an ultimate meter.",
    title: "Anime Battleground HUD",
    tagline: "Health, stamina, 4 skills, ultimate meter — neon anime vibe",
    spec: {
      screenType: "hud",
      genre: "anime",
      mood: "neon",
      blocks: [
        { type: "stat-bar", stat: "health" },
        { type: "stat-bar", stat: "stamina" },
        { type: "skill-bar", slots: 4 },
        { type: "ultimate-meter" },
        { type: "currency-display", currencies: ["Coins"] },
      ],
    },
  },
  {
    slug: "simulator-shop",
    prompt: "Create a modern simulator shop with six game passes.",
    title: "Simulator Shop",
    tagline: "Six game-pass cards with purchase RemoteEvents",
    spec: {
      screenType: "shop",
      genre: "simulator",
      title: "PREMIUM SHOP",
      blocks: [
        {
          type: "game-pass-grid",
          passes: [
            { name: "VIP PASS", price: "399 R$" },
            { name: "DOUBLE COINS", price: "249 R$" },
            { name: "SPEED COIL", price: "149 R$" },
            { name: "LUCKY CLOVER", price: "199 R$" },
            { name: "MEGA BACKPACK", price: "299 R$" },
            { name: "AUTO HATCHER", price: "499 R$" },
          ],
        },
      ],
    },
  },
  {
    slug: "rpg-inventory",
    prompt:
      "Create an RPG inventory with 20 item slots and an item details panel.",
    title: "RPG Inventory",
    tagline: "20-slot grid with an item details panel — fantasy palette",
    spec: {
      screenType: "inventory",
      genre: "rpg",
      mood: "fantasy",
      blocks: [{ type: "item-grid", count: 20 }, { type: "item-details" }],
    },
  },
  {
    slug: "horror-main-menu",
    prompt: "Create a dark horror main menu with Play, Settings and Credits.",
    title: "Horror Main Menu",
    tagline: "Play / Settings / Credits with working panel wiring",
    spec: {
      screenType: "main-menu",
      genre: "horror",
      mood: "dark",
      title: "THE ASYLUM",
      blocks: [
        {
          type: "menu-buttons",
          items: [
            { label: "PLAY", intent: "play" },
            { label: "SETTINGS", intent: "settings" },
            { label: "CREDITS", intent: "credits" },
          ],
        },
      ],
    },
  },
  {
    slug: "seven-day-rewards",
    prompt: "Create a seven-day daily rewards interface.",
    title: "7-Day Daily Rewards",
    tagline: "Streak calendar with a server-validated claim button",
    spec: {
      screenType: "daily-rewards",
      blocks: [{ type: "reward-calendar", days: 7 }],
    },
  },
  {
    slug: "game-settings",
    prompt:
      "Create a game settings panel with music, SFX, graphics and a close button.",
    title: "Game Settings Panel",
    tagline: "Music / SFX / Graphics toggles with a close action",
    spec: {
      screenType: "settings",
      blocks: [
        {
          type: "setting-toggles",
          options: ["Music", "SFX", "Graphics"],
        },
      ],
    },
  },
];

export function getAiExample(slug: string): AiExample | undefined {
  return AI_EXAMPLES.find((e) => e.slug === slug);
}

export function exampleScene(example: AiExample): SceneNode[] {
  return composeScene(example.spec);
}
