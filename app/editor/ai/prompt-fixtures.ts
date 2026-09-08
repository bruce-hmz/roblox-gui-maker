// Prompt fixtures: 30 classified prompts (5 per supported screen type) used
// by unit tests, the mock provider, and the 50-prompt real-model evaluation
// (scripts/eval-ai-gui.mjs adds 20 more). Never send these prompts to
// analytics — they exist for pipelines only.

import type { ScreenType } from "./spec";

export type PromptFixture = {
  prompt: string;
  screenType: ScreenType;
};

export const PROMPT_FIXTURES: PromptFixture[] = [
  // main-menu ×5
  { prompt: "Create a horror main menu with Play, Settings and Credits.", screenType: "main-menu" },
  { prompt: "Create an anime game title screen with Play, Shop and Settings.", screenType: "main-menu" },
  { prompt: "Create a tycoon main menu with a Play button and a Quit button.", screenType: "main-menu" },
  { prompt: "Create a main menu for my RPG dungeon game named Iron Depths.", screenType: "main-menu" },
  { prompt: "Create a dark scary title screen with play, shop, settings, credits and quit.", screenType: "main-menu" },
  // shop ×5
  { prompt: "Create a modern simulator shop with six game passes.", screenType: "shop" },
  { prompt: "Create a game pass store with three passes for my obby.", screenType: "shop" },
  { prompt: "Create a Robux purchase shop with 4 game passes, dark blue theme.", screenType: "shop" },
  { prompt: "Create a pet simulator shop with 6 passes and rounded buttons.", screenType: "shop" },
  { prompt: "Create an item store with 9 items for my tycoon.", screenType: "shop" },
  // inventory ×5
  { prompt: "Create an RPG inventory with 20 item slots and item details panel.", screenType: "inventory" },
  { prompt: "Create a backpack UI with 12 slots for my adventure game.", screenType: "inventory" },
  { prompt: "Create an anime battleground inventory with 16 slots.", screenType: "inventory" },
  { prompt: "Create a hotbar inventory with 8 slots.", screenType: "inventory" },
  { prompt: "Create an inventory screen with 24 slots and a details panel, fantasy style.", screenType: "inventory" },
  // hud ×5
  { prompt: "Create an anime battleground HUD with health, stamina, four skills and an ultimate meter.", screenType: "hud" },
  { prompt: "Create a simulator HUD with health and coins.", screenType: "hud" },
  { prompt: "Create an RPG HUD with health, mana and 6 ability buttons.", screenType: "hud" },
  { prompt: "Create a horror HUD with stamina and 2 skills.", screenType: "hud" },
  { prompt: "Create a battleground HUD with health, xp, gems and 4 skills.", screenType: "hud" },
  // daily-rewards ×5
  { prompt: "Create a seven-day daily rewards interface.", screenType: "daily-rewards" },
  { prompt: "Create a daily rewards calendar with 14 days for my simulator.", screenType: "daily-rewards" },
  { prompt: "Create a login streak reward screen with 7 days.", screenType: "daily-rewards" },
  { prompt: "Create a 5-day daily rewards popup.", screenType: "daily-rewards" },
  { prompt: "Create a daily reward calendar for my tycoon with ten days.", screenType: "daily-rewards" },
  // settings ×5
  { prompt: "Create a game settings panel with music, SFX, graphics and close button.", screenType: "settings" },
  { prompt: "Create a settings menu with Music and Sound Effects toggles.", screenType: "settings" },
  { prompt: "Create an options menu with music, sfx, graphics, particles and camera shake.", screenType: "settings" },
  { prompt: "Create a settings panel for my horror game with volume options.", screenType: "settings" },
  { prompt: "Create a graphics quality settings screen with a close button.", screenType: "settings" },
];

// 20 additional prompts for the real-model eval (mix of supported, adjacent,
// and adversarial inputs — the eval measures spec validity, not classifier
// accuracy).
export const EVAL_EXTRA_PROMPTS: string[] = [
  "Create a neon cyberpunk shop with 5 game passes.",
  "Create a cute pet simulator main menu with Play and Shop.",
  "Create a battleground HUD with health, mana, 5 skills and an ultimate.",
  "Create a tycoon shop with 4 passes.",
  "Create an anime HUD with stamina and 3 skills and coins.",
  "Create a horror game settings panel with SFX and music.",
  "Create a 7 day reward calendar for my RNG game.",
  "Create an RPG inventory with 30 slots.",
  "Create a sci-fi main menu called STAR FORGE.",
  "Create a shop UI with six game passes for a clicker.",
  "Create a fantasy HUD with health, xp and 4 abilities.",
  "Create a daily rewards screen with 10 days.",
  "Create an inventory with 9 slots and details.",
  "Create a settings panel with graphics quality and a close button.",
  "Create a simulator main menu with Play, Shop, Settings and Credits.",
  "Create a battleground ultimate HUD with health and stamina.",
  "Create a game pass store with 2 passes.",
  "Create a dark inventory with 18 slots.",
  "Create a mining tycoon HUD with coins and 3 skills.",
  "Create a scary main menu with Play and Quit.",
];
