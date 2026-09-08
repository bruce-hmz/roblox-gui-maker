// GuiDesignSpec — the only shape the AI is allowed to produce.
//
// The spec describes WHAT a screen needs (type, blocks, labels, style hints).
// The composer (composer.ts) decides HOW a correct Roblox GUI is built from
// it. parseGuiDesignSpec() is the single authority: everything the model
// returns must survive it — enums are checked, numbers clamped, labels
// cleaned and capped, unknown fields and unsupported blocks are dropped with
// warnings, and an empty block list auto-fills that screen type's defaults.
// Nothing unvalidated reaches the scene.

export type ScreenType =
  | "main-menu"
  | "shop"
  | "inventory"
  | "hud"
  | "daily-rewards"
  | "settings";

export const SCREEN_TYPES: readonly ScreenType[] = [
  "main-menu",
  "shop",
  "inventory",
  "hud",
  "daily-rewards",
  "settings",
] as const;

export type Genre =
  | "simulator"
  | "rpg"
  | "anime"
  | "horror"
  | "tycoon"
  | "generic";

export const GENRES: readonly Genre[] = [
  "simulator",
  "rpg",
  "anime",
  "horror",
  "tycoon",
  "generic",
] as const;

export type Mood = "clean" | "dark" | "neon" | "fantasy" | "cute";

export const MOODS: readonly Mood[] = [
  "clean",
  "dark",
  "neon",
  "fantasy",
  "cute",
] as const;

// Button semantics the composer knows how to wire with EXISTING actions.
// "play" → hideGui, "settings"/"shop" → show panel, others → inert.
export type MenuIntent = "play" | "settings" | "shop" | "credits" | "quit";
export const MENU_INTENTS: readonly MenuIntent[] = [
  "play",
  "settings",
  "shop",
  "credits",
  "quit",
] as const;

export type BarStat = "health" | "stamina" | "mana" | "xp";
export const BAR_STATS: readonly BarStat[] = [
  "health",
  "stamina",
  "mana",
  "xp",
] as const;

export type HudPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";
export const HUD_POSITIONS: readonly HudPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
] as const;

export type MenuButtonItem = { label: string; intent: MenuIntent };
export type GamePassSpec = { name: string; price?: string };

export type GuiBlockSpec =
  // main-menu
  | { type: "menu-buttons"; items: MenuButtonItem[] }
  // shop
  | { type: "game-pass-grid"; passes: GamePassSpec[] }
  // shop | inventory
  | { type: "item-grid"; count: number }
  // inventory
  | { type: "item-details" }
  // hud
  | { type: "stat-bar"; stat: BarStat; label?: string }
  | { type: "skill-bar"; slots: number; position?: HudPosition }
  | { type: "ultimate-meter"; position?: HudPosition }
  | { type: "currency-display"; currencies: string[] }
  // daily-rewards
  | { type: "reward-calendar"; days: number }
  // settings
  | { type: "setting-toggles"; options: string[] };

export type GuiDesignSpec = {
  screenType: ScreenType;
  genre?: Genre;
  title?: string;
  mood?: Mood;
  primaryColor?: string; // #rrggbb
  accentColor?: string; // #rrggbb
  blocks: GuiBlockSpec[];
};

// ---- limits ----------------------------------------------------------------

export const LIMITS = {
  promptChars: 600,
  labelChars: 16,
  optionChars: 22,
  titleChars: 40,
  menuButtons: 6,
  gamePasses: 6,
  itemSlots: 30,
  skillSlots: 8,
  calendarDays: 14,
  settingOptions: 8,
  currencies: 3,
  statBars: 4,
  maxNodes: 150,
} as const;

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

export function isHexColor(value: unknown): value is string {
  return typeof value === "string" && HEX_RE.test(value);
}

// Strip control characters / line breaks and collapse whitespace so a label
// is always a single clean line before it reaches a node name or Text.
function cleanText(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max)
    .trim();
  return cleaned.length > 0 ? cleaned : null;
}

function clampInt(value: unknown, min: number, max: number, fallback: number): number {
  const n =
    typeof value === "number" && Number.isFinite(value) ? Math.round(value) : NaN;
  if (Number.isNaN(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

function pickEnum<T extends string>(
  value: unknown,
  allowed: readonly T[]
): T | undefined {
  return typeof value === "string" && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : undefined;
}

// Blocks each screen type understands; anything else is dropped (warning).
const BLOCKS_BY_SCREEN: Record<ScreenType, readonly string[]> = {
  "main-menu": ["menu-buttons"],
  shop: ["game-pass-grid", "item-grid"],
  inventory: ["item-grid", "item-details"],
  hud: ["stat-bar", "skill-bar", "ultimate-meter", "currency-display"],
  "daily-rewards": ["reward-calendar"],
  settings: ["setting-toggles"],
};

// What the composer builds when a spec has no usable blocks (fallback level
// 2.5 — the model still provided the screen type, so honor it).
export function defaultBlocksFor(screenType: ScreenType): GuiBlockSpec[] {
  switch (screenType) {
    case "main-menu":
      return [
        {
          type: "menu-buttons",
          items: [
            { label: "PLAY", intent: "play" },
            { label: "SHOP", intent: "shop" },
            { label: "SETTINGS", intent: "settings" },
            { label: "QUIT", intent: "quit" },
          ],
        },
      ];
    case "shop":
      return [
        {
          type: "game-pass-grid",
          passes: [
            { name: "VIP PASS", price: "399 R$" },
            { name: "DOUBLE COINS", price: "249 R$" },
            { name: "SPEED BOOST", price: "149 R$" },
          ],
        },
      ];
    case "inventory":
      return [{ type: "item-grid", count: 12 }, { type: "item-details" }];
    case "hud":
      return [
        { type: "stat-bar", stat: "health" },
        { type: "stat-bar", stat: "stamina" },
        { type: "skill-bar", slots: 4 },
        { type: "currency-display", currencies: ["Coins"] },
      ];
    case "daily-rewards":
      return [{ type: "reward-calendar", days: 7 }];
    case "settings":
      return [
        {
          type: "setting-toggles",
          options: ["Music", "Sound Effects", "Graphics"],
        },
      ];
  }
}

export type SpecParseResult =
  | { ok: true; spec: GuiDesignSpec; warnings: string[] }
  | { ok: false; errors: string[] };

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;

export function parseGuiDesignSpec(raw: unknown): SpecParseResult {
  const warnings: string[] = [];
  const source = asRecord(raw);
  if (!source) return { ok: false, errors: ["Spec must be a JSON object."] };

  const screenType = pickEnum(source.screenType, SCREEN_TYPES);
  if (!screenType) {
    return {
      ok: false,
      errors: [
        `screenType must be one of: ${SCREEN_TYPES.join(", ")}.`,
      ],
    };
  }

  const genre = pickEnum(source.genre, GENRES);
  if (source.genre !== undefined && !genre) warnings.push("Unknown genre dropped.");
  const mood = pickEnum(source.mood, MOODS);
  if (source.mood !== undefined && !mood) warnings.push("Unknown mood dropped.");

  const title = cleanText(source.title, LIMITS.titleChars) ?? undefined;
  if (source.title !== undefined && !title) warnings.push("Invalid title dropped.");

  const primaryColor = isHexColor(source.primaryColor)
    ? source.primaryColor.toLowerCase()
    : undefined;
  if (source.primaryColor !== undefined && !primaryColor) {
    warnings.push("primaryColor must be #rrggbb — dropped.");
  }
  const accentColor = isHexColor(source.accentColor)
    ? source.accentColor.toLowerCase()
    : undefined;
  if (source.accentColor !== undefined && !accentColor) {
    warnings.push("accentColor must be #rrggbb — dropped.");
  }

  if (!Array.isArray(source.blocks)) {
    return { ok: false, errors: ["blocks must be an array."] };
  }
  if (source.blocks.length > 24) {
    warnings.push("Too many blocks — kept the first 24.");
  }

  const allowed = BLOCKS_BY_SCREEN[screenType];
  const seenStatBars = new Set<BarStat>();
  const blocks: GuiBlockSpec[] = [];

  for (const rawBlock of source.blocks.slice(0, 24)) {
    const block = asRecord(rawBlock);
    if (!block) {
      warnings.push("Non-object block dropped.");
      continue;
    }
    const type = typeof block.type === "string" ? block.type : null;
    if (!type || !allowed.includes(type)) {
      warnings.push(
        type
          ? `Block "${type}" is not supported for ${screenType} — dropped.`
          : "Block without type dropped."
      );
      continue;
    }

    switch (type) {
      case "menu-buttons": {
        const rawItems = Array.isArray(block.items) ? block.items : [];
        const items: MenuButtonItem[] = [];
        for (const rawItem of rawItems) {
          const item = asRecord(rawItem);
          if (!item) continue;
          const label = cleanText(item.label, LIMITS.labelChars);
          if (!label) continue;
          items.push({
            label,
            intent: pickEnum(item.intent, MENU_INTENTS) ?? "credits",
          });
        }
        const capped = items.slice(0, LIMITS.menuButtons);
        if (capped.length < items.length) {
          warnings.push(`menu-buttons capped at ${LIMITS.menuButtons} items.`);
        }
        if (capped.length > 0) blocks.push({ type: "menu-buttons", items: capped });
        else warnings.push('Empty "menu-buttons" dropped.');
        break;
      }
      case "game-pass-grid": {
        const rawPasses = Array.isArray(block.passes) ? block.passes : [];
        const passes: GamePassSpec[] = [];
        for (const rawPass of rawPasses) {
          const pass = asRecord(rawPass);
          if (!pass) continue;
          const name = cleanText(pass.name, LIMITS.labelChars);
          if (!name) continue;
          passes.push({
            name,
            ...(cleanText(pass.price, LIMITS.optionChars)
              ? { price: cleanText(pass.price, LIMITS.optionChars)! }
              : {}),
          });
        }
        const capped = passes.slice(0, LIMITS.gamePasses);
        if (capped.length < passes.length) {
          warnings.push(`game-pass-grid capped at ${LIMITS.gamePasses} passes.`);
        }
        if (capped.length > 0) blocks.push({ type: "game-pass-grid", passes: capped });
        else warnings.push('Empty "game-pass-grid" dropped.');
        break;
      }
      case "item-grid": {
        blocks.push({
          type: "item-grid",
          count: clampInt(block.count, 1, LIMITS.itemSlots, 8),
        });
        break;
      }
      case "item-details": {
        blocks.push({ type: "item-details" });
        break;
      }
      case "stat-bar": {
        const stat = pickEnum(block.stat, BAR_STATS);
        if (!stat) {
          warnings.push(`stat-bar without a valid stat — dropped.`);
          break;
        }
        if (seenStatBars.has(stat)) {
          warnings.push(`Duplicate ${stat} stat-bar dropped.`);
          break;
        }
        seenStatBars.add(stat);
        blocks.push({
          type: "stat-bar",
          stat,
          ...(cleanText(block.label, LIMITS.labelChars)
            ? { label: cleanText(block.label, LIMITS.labelChars)! }
            : {}),
        });
        break;
      }
      case "skill-bar": {
        blocks.push({
          type: "skill-bar",
          slots: clampInt(block.slots, 1, LIMITS.skillSlots, 4),
          ...(pickEnum(block.position, HUD_POSITIONS)
            ? { position: pickEnum(block.position, HUD_POSITIONS)! }
            : {}),
        });
        break;
      }
      case "ultimate-meter": {
        blocks.push({
          type: "ultimate-meter",
          ...(pickEnum(block.position, HUD_POSITIONS)
            ? { position: pickEnum(block.position, HUD_POSITIONS)! }
            : {}),
        });
        break;
      }
      case "currency-display": {
        const rawList = Array.isArray(block.currencies) ? block.currencies : [];
        const currencies: string[] = [];
        for (const rawCurrency of rawList) {
          const name = cleanText(rawCurrency, LIMITS.labelChars);
          if (name && !currencies.includes(name)) currencies.push(name);
        }
        const capped = currencies.slice(0, LIMITS.currencies);
        if (capped.length > 0) {
          blocks.push({ type: "currency-display", currencies: capped });
        } else {
          warnings.push('currency-display without names dropped.');
        }
        break;
      }
      case "reward-calendar": {
        blocks.push({
          type: "reward-calendar",
          days: clampInt(block.days, 3, LIMITS.calendarDays, 7),
        });
        break;
      }
      case "setting-toggles": {
        const rawOptions = Array.isArray(block.options) ? block.options : [];
        const options: string[] = [];
        for (const rawOption of rawOptions) {
          const option = cleanText(rawOption, LIMITS.optionChars);
          if (option && !options.includes(option)) options.push(option);
        }
        const capped = options.slice(0, LIMITS.settingOptions);
        if (capped.length > 0) {
          blocks.push({ type: "setting-toggles", options: capped });
        } else {
          warnings.push('Empty "setting-toggles" dropped.');
        }
        break;
      }
    }
  }

  if (seenStatBars.size > LIMITS.statBars) {
    warnings.push("stat-bar entries capped at 4.");
  }

  if (blocks.length === 0) {
    warnings.push(
      "No supported blocks — filled in sensible defaults for this screen type."
    );
    blocks.push(...defaultBlocksFor(screenType));
  }

  const spec: GuiDesignSpec = {
    screenType,
    blocks,
    ...(genre ? { genre } : {}),
    ...(title ? { title } : {}),
    ...(mood ? { mood } : {}),
    ...(primaryColor ? { primaryColor } : {}),
    ...(accentColor ? { accentColor } : {}),
  };
  return { ok: true, spec, warnings };
}
