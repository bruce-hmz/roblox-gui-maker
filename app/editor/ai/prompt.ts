// Server-only prompt construction for spec generation. Kept as data so the
// provider layer stays transport-only and the prompt can evolve without
// touching API plumbing. Never import from a client component.

import { MOODS, GENRES, type ScreenType } from "./spec";

const BLOCK_REFERENCE = `Blocks by screenType (use ONLY these):
main-menu:
  {"type":"menu-buttons","items":[{"label":"PLAY","intent":"play"},{"label":"SETTINGS","intent":"settings"}]}
  intent: "play" | "settings" | "shop" | "credits" | "quit"  (max 6 items, labels <= 16 chars)
shop:
  {"type":"game-pass-grid","passes":[{"name":"VIP PASS","price":"399 R$"}]}   (max 6)
  {"type":"item-grid","count":9}                                              (1-30)
inventory:
  {"type":"item-grid","count":20}    (1-30)
  {"type":"item-details"}
hud:
  {"type":"stat-bar","stat":"health"}   stat: "health"|"stamina"|"mana"|"xp", optional "label"
  {"type":"skill-bar","slots":4,"position":"bottom-center"}   slots 1-8, position: "top-left"|"top-center"|"top-right"|"bottom-left"|"bottom-center"|"bottom-right"
  {"type":"ultimate-meter","position":"bottom-center"}
  {"type":"currency-display","currencies":["Coins"]}   max 3
daily-rewards:
  {"type":"reward-calendar","days":7}   (3-14)
settings:
  {"type":"setting-toggles","options":["Music","Sound Effects"]}   (max 8)`;

const EXAMPLE = `{"screenType":"hud","genre":"anime","mood":"neon","title":null,"blocks":[{"type":"stat-bar","stat":"health"},{"type":"stat-bar","stat":"stamina"},{"type":"skill-bar","slots":4,"position":"bottom-center"},{"type":"ultimate-meter"}]}`;

export function systemPrompt(): string {
  return [
    "You convert a request for a Roblox game interface into ONE JSON object (a GuiDesignSpec). You output JSON only — no markdown, no prose, no code.",
    "",
    "Top-level fields (use ONLY these):",
    `screenType (required): ${SCREEN_TYPE_LIST}`,
    `genre (optional): ${GENRES.join(" | ")}`,
    `mood (optional): ${MOODS.join(" | ")} — infer from words like neon/anime/dark/cute/fantasy when the user hints a style`,
    "title (optional, <= 40 chars) — game or screen title ONLY if the user names one, else null",
    "primaryColor / accentColor (optional, \"#rrggbb\") — ONLY if the user explicitly names a color",
    "blocks (required): the blocks below that match what the user asked for",
    "",
    BLOCK_REFERENCE,
    "",
    "Rules:",
    "- UI text is short, uppercase English (e.g. \"PLAY\", \"VIP PASS\").",
    "- Extract counts from the prompt (\"four skills\" -> slots:4, \"20 slots\" -> count:20).",
    "- Pick ONE screenType — the dominant ask. Ignore requests for 3D models, images, scripts, sounds, or anything not listed above; map leftovers onto the closest supported block.",
    "- Unknown or unsupported concepts must be omitted, never invented.",
    "",
    "Example output shape:",
    EXAMPLE,
  ].join("\n");
}

const SCREEN_TYPE_LIST: string =
  '"main-menu" | "shop" | "inventory" | "hud" | "daily-rewards" | "settings"';

export function userPromptContent(prompt: string, locale: string): string {
  const localeNote =
    locale === "zh"
      ? "\n(The request may be in Chinese — understand it, but UI labels in the spec stay English.)"
      : "";
  return `User request:\n"""${prompt}"""${localeNote}`;
}

export function repairPromptContent(
  prompt: string,
  locale: string,
  errors: string[]
): string {
  return [
    userPromptContent(prompt, locale),
    "",
    "Your previous answer was rejected by the validator:",
    ...errors.slice(0, 6).map((e) => `- ${e}`),
    "Return the corrected JSON object only, using the supported fields and blocks.",
  ].join("\n");
}
