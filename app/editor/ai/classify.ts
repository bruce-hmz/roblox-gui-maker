// Heuristic prompt classifier. Two jobs:
// 1. The mock provider (AI_PROVIDER=mock) turns a prompt into a spec without
//    any network call — used by e2e tests and local dev.
// 2. The API route's fallback ladder uses classifyScreenType() to pick the
//    closest existing template when the LLM path fails entirely.
// Deliberately simple: keyword matching + number extraction, fully
// deterministic and unit-tested. It does not need to be clever — the real
// provider is the LLM; this is the floor, not the ceiling.

import {
  defaultBlocksFor,
  type BarStat,
  type GuiDesignSpec,
  type MenuButtonItem,
  type ScreenType,
} from "./spec";

// Weighted keyword scoring beats check order: a "title screen with Play,
// Settings and Shop" mentions settings/shop but IS a main menu. Strong
// identity phrases outweigh passing mentions; ties resolve toward the more
// specific screen type.
const SCREEN_SIGNALS: Record<ScreenType, [string, number][]> = {
  "daily-rewards": [
    ["daily reward", 5],
    ["reward calendar", 4],
    ["login reward", 4],
    ["streak", 3],
  ],
  inventory: [
    ["inventory", 4],
    ["backpack", 4],
    ["hotbar", 2],
    ["item slot", 2],
    ["slots", 1],
  ],
  settings: [
    ["settings", 3],
    ["options menu", 4],
    ["volume", 1],
    ["toggle", 1],
  ],
  hud: [
    ["hud", 4],
    ["health", 2],
    ["stamina", 2],
    ["mana", 2],
    ["skill", 2],
    ["ultimate", 2],
    ["xp", 1],
  ],
  shop: [
    ["shop", 3],
    ["store", 3],
    ["game pass", 3],
    ["gamepass", 3],
    ["robux", 2],
    ["purchase", 1],
  ],
  "main-menu": [
    ["main menu", 5],
    ["title screen", 5],
    ["play button", 2],
    ["menu", 1],
  ],
};

// Tie-break priority: most specific screen type first.
const TIE_ORDER: ScreenType[] = [
  "daily-rewards",
  "inventory",
  "settings",
  "hud",
  "shop",
  "main-menu",
];

export function classifyScreenType(prompt: string): ScreenType {
  const p = prompt.toLowerCase();
  let best: ScreenType = "main-menu";
  let bestScore = 0;
  for (const screenType of TIE_ORDER) {
    let score = 0;
    for (const [phrase, weight] of SCREEN_SIGNALS[screenType]) {
      if (p.includes(phrase)) score += weight;
    }
    if (score > bestScore) {
      bestScore = score;
      best = screenType;
    }
  }
  return best;
}

const WORD_NUMBERS: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
};

function countNear(prompt: string, pattern: string): number | null {
  const p = prompt.toLowerCase();
  const wordMatch = p.match(
    new RegExp(`(\\d+|${Object.keys(WORD_NUMBERS).join("|")})[- ]?${pattern}`, "i")
  );
  if (!wordMatch) return null;
  const token = wordMatch[1];
  const value = /^\d+$/.test(token) ? parseInt(token, 10) : WORD_NUMBERS[token];
  return Number.isFinite(value) ? value : null;
}

function detectGenre(prompt: string): GuiDesignSpec["genre"] {
  const p = prompt.toLowerCase();
  if (p.includes("anime") || p.includes("battleground")) return "anime";
  if (p.includes("horror") || p.includes("scary") || p.includes("backrooms")) {
    return "horror";
  }
  if (p.includes("simulator") || p.includes("clicker") || p.includes("pet")) {
    return "simulator";
  }
  if (p.includes("rpg") || p.includes("dungeon") || p.includes("quest")) {
    return "rpg";
  }
  if (p.includes("tycoon")) return "tycoon";
  return "generic";
}

// Build a complete spec from a plain prompt — the mock provider's brain.
export function mockSpecFromPrompt(prompt: string): GuiDesignSpec {
  const screenType = classifyScreenType(prompt);
  const genre = detectGenre(prompt);
  const spec: GuiDesignSpec = { screenType, genre, blocks: [] };

  const titleMatch = prompt.match(/(?:called|named|titled)\s+["“']?([^"”'.]{2,40})/i);
  if (titleMatch) spec.title = titleMatch[1].trim().toUpperCase().slice(0, 40);

  const p = prompt.toLowerCase();

  if (screenType === "hud") {
    const stats: BarStat[] = [];
    if (p.includes("health") || p.includes("hp")) stats.push("health");
    if (p.includes("stamina") || p.includes("energy")) stats.push("stamina");
    if (p.includes("mana") || p.includes("chakra")) stats.push("mana");
    if (p.includes("xp") || p.includes("level bar") || p.includes("experience")) {
      stats.push("xp");
    }
    for (const stat of stats) spec.blocks.push({ type: "stat-bar", stat });

    const skills = countNear(prompt, "(?:skills?|abilities?)");
    spec.blocks.push({ type: "skill-bar", slots: skills ?? 4 });

    if (p.includes("ultimate") || p.includes("super meter")) {
      spec.blocks.push({ type: "ultimate-meter" });
    }

    const currencies: string[] = [];
    if (p.includes("coin")) currencies.push("Coins");
    if (p.includes("gem")) currencies.push("Gems");
    if (p.includes("robux")) currencies.push("Robux");
    if (currencies.length > 0) {
      spec.blocks.push({ type: "currency-display", currencies });
    }
  } else if (screenType === "shop") {
    const passes = countNear(prompt, "(?:game\\s?pass(?:es)?|pass(?:es)?)");
    if (passes && passes > 1) {
      spec.blocks.push({
        type: "game-pass-grid",
        passes: Array.from({ length: Math.min(passes, 6) }, (_, i) => ({
          name: `PASS ${i + 1}`,
          price: `${(i + 1) * 99 + 50} R$`,
        })),
      });
    } else {
      const items = countNear(prompt, "(?:items?|slot?s?|cards?)");
      spec.blocks.push({ type: "item-grid", count: Math.min(items ?? 6, 12) });
    }
  } else if (screenType === "inventory") {
    const slots = countNear(prompt, "(?:slots?|spaces?|items?)");
    spec.blocks.push({ type: "item-grid", count: Math.min(slots ?? 12, 24) });
    if (p.includes("detail") || p.includes("inspect")) {
      spec.blocks.push({ type: "item-details" });
    }
  } else if (screenType === "daily-rewards") {
    const days = countNear(prompt, "(?:-?\\s?day|\\s?days)");
    spec.blocks.push({ type: "reward-calendar", days: Math.min(days ?? 7, 14) });
  } else if (screenType === "settings") {
    const options: string[] = [];
    if (p.includes("music")) options.push("Music");
    if (p.includes("sfx") || p.includes("sound")) options.push("Sound Effects");
    if (p.includes("graphic") || p.includes("quality")) options.push("Graphics");
    if (p.includes("particle")) options.push("Particles");
    if (p.includes("camera")) options.push("Camera Shake");
    spec.blocks.push({
      type: "setting-toggles",
      options: options.length > 0 ? options : ["Music", "Sound Effects", "Graphics"],
    });
  } else {
    const items: MenuButtonItem[] = [];
    if (p.includes("play") || p.includes("start")) {
      items.push({ label: "PLAY", intent: "play" });
    }
    if (p.includes("shop") || p.includes("store")) {
      items.push({ label: "SHOP", intent: "shop" });
    }
    if (p.includes("setting")) items.push({ label: "SETTINGS", intent: "settings" });
    if (p.includes("credit")) items.push({ label: "CREDITS", intent: "credits" });
    if (p.includes("quit") || p.includes("exit") || p.includes("leave")) {
      items.push({ label: "QUIT", intent: "quit" });
    }
    spec.blocks.push({
      type: "menu-buttons",
      items: items.length > 0 ? items.slice(0, 6) : defaultBlocksFor("main-menu")[0]!.type === "menu-buttons"
        ? (defaultBlocksFor("main-menu")[0] as { items: MenuButtonItem[] }).items
        : [],
    });
  }

  if (spec.blocks.length === 0) spec.blocks = defaultBlocksFor(screenType);
  return spec;
}
