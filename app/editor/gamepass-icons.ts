// Deterministic, zero-API 512x512 Roblox Gamepass & Shop badge SVG generator.
// Pure functions only: same spec in, same SVG bytes out. Used to bundle
// ready-to-upload monetization icons alongside kit exports.

import { getKit } from "./kits";
import { getTheme } from "./themes";

export type GamepassEmblem =
  | "crown"
  | "coins"
  | "lightning"
  | "clover"
  | "gem"
  | "egg"
  | "shield"
  | "sword"
  | "gift"
  | "star"
  | "rocket"
  | "skull";

export type GamepassRimStyle =
  | "gold"
  | "cyber"
  | "emerald"
  | "royal"
  | "crimson"
  | "obsidian";

export type GamepassIconShape = "circle" | "rounded-square";

export type GamepassIconSpec = {
  id: string;
  titleTop: string;
  titleBottom?: string;
  emblem: GamepassEmblem;
  rim: GamepassRimStyle;
  primaryColor: string;
  secondaryColor: string;
  shape: GamepassIconShape;
  sunburst: boolean;
  glow: boolean;
};

const RIM_PRESETS: Record<
  GamepassRimStyle,
  { stops: [string, string, string, string]; metal: string }
> = {
  gold: { stops: ["#ffe9a8", "#f2b53c", "#8a5a13", "#ffd166"], metal: "#f2b53c" },
  cyber: { stops: ["#b7f4ff", "#39dbeb", "#0e7d94", "#6ce9ff"], metal: "#39dbeb" },
  emerald: { stops: ["#a7f3d0", "#2fd398", "#0b5f43", "#6ee7b7"], metal: "#2fd398" },
  royal: { stops: ["#e9d5ff", "#c084fc", "#5b21a8", "#d8b4fe"], metal: "#c084fc" },
  crimson: { stops: ["#fecdd3", "#fb7185", "#7a0e2e", "#fda4af"], metal: "#fb7185" },
  obsidian: { stops: ["#e2e8f0", "#9aa7b8", "#2c3542", "#c3ccd8"], metal: "#9aa7b8" },
};

// 12 polished monetization presets covering the highest-converting Roblox
// gamepass archetypes.
export const GAMEPASS_ICON_PRESETS: GamepassIconSpec[] = [
  {
    id: "vip-crown",
    titleTop: "VIP",
    emblem: "crown",
    rim: "gold",
    primaryColor: "#f5a524",
    secondaryColor: "#5c3a08",
    shape: "circle",
    sunburst: true,
    glow: true,
  },
  {
    id: "2x-cash",
    titleTop: "2X CASH",
    emblem: "coins",
    rim: "gold",
    primaryColor: "#ffb028",
    secondaryColor: "#6e3b06",
    shape: "circle",
    sunburst: false,
    glow: false,
  },
  {
    id: "auto-hatch",
    titleTop: "AUTO",
    titleBottom: "HATCH",
    emblem: "egg",
    rim: "cyber",
    primaryColor: "#38bdf8",
    secondaryColor: "#083344",
    shape: "circle",
    sunburst: false,
    glow: true,
  },
  {
    id: "3x-luck",
    titleTop: "3X LUCK",
    emblem: "clover",
    rim: "emerald",
    primaryColor: "#10b981",
    secondaryColor: "#03301f",
    shape: "circle",
    sunburst: false,
    glow: false,
  },
  {
    id: "speed-boost",
    titleTop: "2X SPEED",
    emblem: "lightning",
    rim: "gold",
    primaryColor: "#fde047",
    secondaryColor: "#713f12",
    shape: "circle",
    sunburst: false,
    glow: true,
  },
  {
    id: "starter-pack",
    titleTop: "STARTER",
    titleBottom: "PACK",
    emblem: "gift",
    rim: "obsidian",
    primaryColor: "#6366f1",
    secondaryColor: "#151239",
    shape: "rounded-square",
    sunburst: false,
    glow: false,
  },
  {
    id: "mega-gems",
    titleTop: "MEGA GEMS",
    emblem: "gem",
    rim: "royal",
    primaryColor: "#a855f7",
    secondaryColor: "#2e0a4f",
    shape: "rounded-square",
    sunburst: true,
    glow: true,
  },
  {
    id: "admin-shield",
    titleTop: "ADMIN",
    emblem: "shield",
    rim: "obsidian",
    primaryColor: "#475569",
    secondaryColor: "#0b1220",
    shape: "circle",
    sunburst: false,
    glow: false,
  },
  {
    id: "2x-sword-dmg",
    titleTop: "2X DMG",
    emblem: "sword",
    rim: "crimson",
    primaryColor: "#f43f5e",
    secondaryColor: "#450a1c",
    shape: "circle",
    sunburst: false,
    glow: true,
  },
  {
    id: "daily-gift",
    titleTop: "DAILY",
    titleBottom: "GIFT",
    emblem: "star",
    rim: "gold",
    primaryColor: "#f59e0b",
    secondaryColor: "#451a03",
    shape: "circle",
    sunburst: true,
    glow: false,
  },
  {
    id: "super-rebirth",
    titleTop: "REBIRTH",
    emblem: "rocket",
    rim: "royal",
    primaryColor: "#8b5cf6",
    secondaryColor: "#23074a",
    shape: "circle",
    sunburst: true,
    glow: true,
  },
  {
    id: "boss-hunter",
    titleTop: "BOSS",
    titleBottom: "HUNTER",
    emblem: "skull",
    rim: "crimson",
    primaryColor: "#dc2626",
    secondaryColor: "#2f0608",
    shape: "circle",
    sunburst: false,
    glow: false,
  },
];

// Per-kit icon plans: emblem + titles matched to the genre; colors and rim are
// derived from the kit's theme at build time.
type KitIconPlan = {
  baseId: string;
  emblem: GamepassEmblem;
  titleTop: string;
  titleBottom?: string;
  sunburst?: boolean;
  glow?: boolean;
  shape?: GamepassIconShape;
};

const KIT_ICON_PLANS: Record<string, { rim: GamepassRimStyle; icons: KitIconPlan[] }> = {
  "simulator-kit": {
    rim: "gold",
    icons: [
      { baseId: "vip", emblem: "crown", titleTop: "VIP", sunburst: true, glow: true },
      { baseId: "cash", emblem: "coins", titleTop: "2X CASH" },
      { baseId: "auto", emblem: "lightning", titleTop: "AUTO", titleBottom: "FARM" },
      { baseId: "luck", emblem: "clover", titleTop: "3X LUCK" },
      { baseId: "rebirth", emblem: "star", titleTop: "REBIRTH", sunburst: true },
      { baseId: "starter", emblem: "gift", titleTop: "STARTER", titleBottom: "PACK", shape: "rounded-square" },
    ],
  },
  "quest-rpg-kit": {
    rim: "cyber",
    icons: [
      { baseId: "vip", emblem: "crown", titleTop: "VIP", sunburst: true, glow: true },
      { baseId: "gold", emblem: "coins", titleTop: "2X GOLD" },
      { baseId: "xp", emblem: "lightning", titleTop: "XP BOOST" },
      { baseId: "luck", emblem: "clover", titleTop: "LUCKY", titleBottom: "CHARM" },
      { baseId: "potion", emblem: "gem", titleTop: "POTION", titleBottom: "PACK" },
      { baseId: "starter", emblem: "gift", titleTop: "STARTER", titleBottom: "PACK", shape: "rounded-square" },
    ],
  },
  "tycoon-kit": {
    rim: "emerald",
    icons: [
      { baseId: "vip", emblem: "crown", titleTop: "VIP", sunburst: true, glow: true },
      { baseId: "cash", emblem: "coins", titleTop: "2X CASH" },
      { baseId: "auto", emblem: "lightning", titleTop: "AUTO", titleBottom: "DROP" },
      { baseId: "luck", emblem: "clover", titleTop: "3X LUCK" },
      { baseId: "rebirth", emblem: "star", titleTop: "REBIRTH", sunburst: true },
      { baseId: "starter", emblem: "gift", titleTop: "STARTER", titleBottom: "PACK", shape: "rounded-square" },
    ],
  },
  "rng-aura-kit": {
    rim: "royal",
    icons: [
      { baseId: "vip", emblem: "crown", titleTop: "VIP", sunburst: true, glow: true },
      { baseId: "luck", emblem: "clover", titleTop: "3X LUCK" },
      { baseId: "roll", emblem: "lightning", titleTop: "AUTO", titleBottom: "ROLL" },
      { baseId: "aura", emblem: "gem", titleTop: "MEGA AURA" },
      { baseId: "fast-roll", emblem: "rocket", titleTop: "FAST ROLL", sunburst: true },
      { baseId: "pity", emblem: "star", titleTop: "PITY", titleBottom: "STAR" },
    ],
  },
  "obby-shop-kit": {
    rim: "crimson",
    icons: [
      { baseId: "vip", emblem: "crown", titleTop: "VIP", sunburst: true, glow: true },
      { baseId: "skip", emblem: "lightning", titleTop: "SKIP", titleBottom: "STAGE" },
      { baseId: "coil", emblem: "rocket", titleTop: "SPEED", titleBottom: "COIL" },
      { baseId: "coins", emblem: "coins", titleTop: "2X COINS" },
      { baseId: "revive", emblem: "shield", titleTop: "REVIVE" },
      { baseId: "starter", emblem: "gift", titleTop: "STARTER", titleBottom: "PACK", shape: "rounded-square" },
    ],
  },
  "tower-defense-kit": {
    rim: "cyber",
    icons: [
      { baseId: "vip", emblem: "crown", titleTop: "VIP", sunburst: true, glow: true },
      { baseId: "cash", emblem: "coins", titleTop: "2X CASH" },
      { baseId: "summon", emblem: "lightning", titleTop: "AUTO", titleBottom: "SUMMON" },
      { baseId: "xp", emblem: "star", titleTop: "2X XP" },
      { baseId: "base", emblem: "shield", titleTop: "BASE", titleBottom: "SHIELD" },
      { baseId: "starter", emblem: "gift", titleTop: "STARTER", titleBottom: "PACK", shape: "rounded-square" },
    ],
  },
};

export function kitGamepassIcons(kitSlug: string): GamepassIconSpec[] {
  const kit = getKit(kitSlug);
  if (!kit) {
    throw new Error(`kitGamepassIcons: unknown kit slug "${kitSlug}"`);
  }
  const theme = getTheme(kit.theme);
  if (!theme) {
    throw new Error(
      `kitGamepassIcons: kit "${kitSlug}" references unknown theme "${kit.theme}"`
    );
  }
  const plan = KIT_ICON_PLANS[kitSlug];
  if (!plan) {
    throw new Error(`kitGamepassIcons: no icon plan registered for kit "${kitSlug}"`);
  }
  const idPrefix = kitSlug.replace(/-kit$/, "");
  return plan.icons.map((icon) => ({
    id: `${idPrefix}-${icon.baseId}`,
    titleTop: icon.titleTop,
    ...(icon.titleBottom !== undefined ? { titleBottom: icon.titleBottom } : {}),
    emblem: icon.emblem,
    rim: plan.rim,
    primaryColor: theme.primary,
    secondaryColor: theme.surface,
    shape: icon.shape ?? "circle",
    sunburst: icon.sunburst ?? false,
    glow: icon.glow ?? false,
  }));
}

// ---- Emblem artwork ---------------------------------------------------------

type EmblemTone = { light: string; metal: string; deep: string };

// Crisp geometric vector art per emblem, drawn in the 512x512 canvas around the
// center-top of the badge. Tones: light (main body), metal (rim-tinted accent),
// deep (shadows / cutouts).
function emblemArtXml(emblem: GamepassEmblem, tone: EmblemTone): string {
  switch (emblem) {
    case "crown":
      return (
        `<path d="M256 104 L298 166 L352 134 L334 234 L178 234 L160 134 L214 166 Z" fill="${tone.metal}"/>` +
        `<rect x="170" y="234" width="172" height="46" rx="12" fill="${tone.light}"/>` +
        `<circle cx="256" cy="104" r="14" fill="${tone.light}"/>` +
        `<circle cx="160" cy="134" r="12" fill="${tone.light}"/>` +
        `<circle cx="352" cy="134" r="12" fill="${tone.light}"/>` +
        `<rect x="196" y="246" width="36" height="22" rx="7" fill="${tone.deep}" opacity="0.75"/>` +
        `<rect x="280" y="246" width="36" height="22" rx="7" fill="${tone.deep}" opacity="0.75"/>` +
        `<path d="M214 166 L256 104 L256 196 Z" fill="#ffffff" opacity="0.25"/>`
      );
    case "coins":
      return (
        `<ellipse cx="234" cy="246" rx="88" ry="28" fill="${tone.metal}"/>` +
        `<ellipse cx="234" cy="230" rx="88" ry="28" fill="${tone.light}"/>` +
        `<ellipse cx="234" cy="230" rx="56" ry="16" fill="${tone.metal}" opacity="0.55"/>` +
        `<circle cx="292" cy="168" r="60" fill="${tone.metal}"/>` +
        `<circle cx="292" cy="158" r="60" fill="${tone.light}"/>` +
        `<circle cx="292" cy="158" r="38" fill="none" stroke="${tone.deep}" stroke-width="9" opacity="0.5"/>` +
        `<path d="M270 158 L292 136 L314 158 L292 180 Z" fill="${tone.metal}" opacity="0.4"/>`
      );
    case "lightning":
      return (
        `<path d="M284 88 L184 224 L246 224 L222 304 L340 160 L272 160 L318 88 Z" fill="${tone.light}"/>` +
        `<path d="M284 88 L318 88 L272 160 L246 160 Z" fill="${tone.metal}" opacity="0.55"/>` +
        `<path d="M184 224 L246 224 L222 304 Z" fill="${tone.deep}" opacity="0.3"/>`
      );
    case "clover":
      return (
        `<circle cx="256" cy="150" r="42" fill="${tone.light}"/>` +
        `<circle cx="214" cy="216" r="42" fill="${tone.light}"/>` +
        `<circle cx="298" cy="216" r="42" fill="${tone.light}"/>` +
        `<circle cx="256" cy="192" r="18" fill="${tone.metal}"/>` +
        `<path d="M256 252 Q252 292 228 314 L214 302 Q238 282 240 252 Z" fill="${tone.metal}"/>` +
        `<circle cx="244" cy="136" r="10" fill="#ffffff" opacity="0.5"/>`
      );
    case "gem":
      return (
        `<path d="M256 100 L346 170 L256 296 L166 170 Z" fill="${tone.light}"/>` +
        `<path d="M256 100 L346 170 L256 296 Z" fill="${tone.deep}" opacity="0.28"/>` +
        `<path d="M256 100 L256 296 L166 170 Z" fill="${tone.metal}" opacity="0.5"/>` +
        `<path d="M256 100 L298 148 L256 196 L214 148 Z" fill="#ffffff" opacity="0.5"/>`
      );
    case "egg":
      return (
        `<path d="M256 96 C312 96 338 186 338 234 C338 288 302 318 256 318 C210 318 174 288 174 234 C174 186 200 96 256 96 Z" fill="${tone.light}"/>` +
        `<path d="M256 96 C312 96 338 186 338 234 C338 288 302 318 256 318 Z" fill="${tone.metal}" opacity="0.35"/>` +
        `<ellipse cx="228" cy="150" rx="20" ry="30" fill="#ffffff" opacity="0.55" transform="rotate(-18 228 150)"/>` +
        `<circle cx="286" cy="210" r="9" fill="${tone.deep}" opacity="0.45"/>` +
        `<circle cx="240" cy="246" r="7" fill="${tone.deep}" opacity="0.45"/>`
      );
    case "shield":
      return (
        `<path d="M256 100 L346 128 L346 206 C346 266 310 300 256 322 C202 300 166 266 166 206 L166 128 Z" fill="${tone.light}"/>` +
        `<path d="M256 100 L346 128 L346 206 C346 266 310 300 256 322 Z" fill="${tone.metal}" opacity="0.45"/>` +
        `<path d="M256 151 L268.3 186 L305.5 186.9 L276 209.5 L286.6 245.1 L256 224 L225.4 245.1 L236 209.5 L206.5 186.9 L243.7 186 Z" fill="${tone.deep}" opacity="0.6"/>`
      );
    case "sword":
      return (
        `<path d="M256 84 L284 112 L284 246 L256 272 L228 246 L228 112 Z" fill="${tone.light}"/>` +
        `<path d="M256 84 L284 112 L284 246 L256 272 Z" fill="${tone.metal}" opacity="0.45"/>` +
        `<rect x="194" y="248" width="124" height="20" rx="10" fill="${tone.metal}"/>` +
        `<rect x="242" y="268" width="28" height="36" rx="9" fill="${tone.deep}" opacity="0.7"/>` +
        `<circle cx="256" cy="312" r="15" fill="${tone.metal}"/>` +
        `<path d="M256 84 L284 112 L284 130 L256 102 Z" fill="#ffffff" opacity="0.45"/>`
      );
    case "gift":
      return (
        `<rect x="172" y="192" width="168" height="116" rx="12" fill="${tone.light}"/>` +
        `<rect x="236" y="160" width="40" height="148" fill="${tone.deep}" opacity="0.55"/>` +
        `<rect x="158" y="160" width="196" height="36" rx="10" fill="${tone.metal}"/>` +
        `<path d="M256 160 C224 118 184 130 194 158 C200 174 232 172 256 160 Z" fill="${tone.metal}"/>` +
        `<path d="M256 160 C288 118 328 130 318 158 C312 174 280 172 256 160 Z" fill="${tone.metal}"/>` +
        `<path d="M256 192 L340 214 L340 236 L256 214 Z" fill="#ffffff" opacity="0.25"/>`
      );
    case "star":
      return (
        `<path d="M256 104 L278.3 165.3 L343.5 167.6 L292.1 207.7 L310.1 270.4 L256 234 L201.9 270.4 L219.9 207.7 L168.5 167.6 L233.7 165.3 Z" fill="${tone.light}"/>` +
        `<path d="M256 104 L278.3 165.3 L256 234 L233.7 165.3 Z" fill="#ffffff" opacity="0.4"/>` +
        `<path d="M256 104 L343.5 167.6 L292.1 207.7 L278.3 165.3 Z" fill="${tone.metal}" opacity="0.5"/>`
      );
    case "rocket":
      return (
        `<path d="M256 88 C300 122 314 172 314 224 L314 262 L198 262 L198 224 C198 172 212 122 256 88 Z" fill="${tone.light}"/>` +
        `<path d="M256 88 C300 122 314 172 314 224 L314 262 L256 262 Z" fill="${tone.metal}" opacity="0.4"/>` +
        `<circle cx="256" cy="178" r="27" fill="${tone.deep}" opacity="0.55"/>` +
        `<circle cx="256" cy="178" r="27" fill="none" stroke="#ffffff" stroke-width="6" opacity="0.6"/>` +
        `<path d="M198 230 L160 288 L198 274 Z" fill="${tone.metal}"/>` +
        `<path d="M314 230 L352 288 L314 274 Z" fill="${tone.metal}"/>` +
        `<path d="M238 272 L256 322 L274 272 Z" fill="${tone.metal}"/>` +
        `<path d="M248 276 L256 298 L264 276 Z" fill="#ffffff" opacity="0.5"/>`
      );
    case "skull":
      return (
        `<path d="M256 100 C318 100 350 144 350 194 C350 224 334 244 318 252 L318 284 C318 296 308 302 298 302 L214 302 C204 302 194 296 194 284 L194 252 C178 244 162 224 162 194 C162 144 194 100 256 100 Z" fill="${tone.light}"/>` +
        `<path d="M256 100 C318 100 350 144 350 194 C350 224 334 244 318 252 L318 284 C318 296 308 302 298 302 L256 302 Z" fill="${tone.metal}" opacity="0.35"/>` +
        `<circle cx="226" cy="196" r="24" fill="${tone.deep}" opacity="0.75"/>` +
        `<circle cx="286" cy="196" r="24" fill="${tone.deep}" opacity="0.75"/>` +
        `<path d="M256 224 L243 250 L269 250 Z" fill="${tone.deep}" opacity="0.75"/>` +
        `<rect x="230" y="266" width="12" height="22" rx="3" fill="${tone.deep}" opacity="0.6"/>` +
        `<rect x="250" y="266" width="12" height="22" rx="3" fill="${tone.deep}" opacity="0.6"/>` +
        `<rect x="270" y="266" width="12" height="22" rx="3" fill="${tone.deep}" opacity="0.6"/>`
      );
  }
}

// 16 fixed-width rays fanning out from the badge center, clipped to the badge.
function sunburstXml(): string {
  const rays: string[] = [];
  for (let rayIndex = 0; rayIndex < 16; rayIndex += 1) {
    const centerAngle = ((rayIndex * 360) / 16 - 90) * (Math.PI / 180);
    const halfAngle = ((360 / 16) / 2) * 0.62 * (Math.PI / 180);
    const pointAt = (angle: number) =>
      `${(256 + 430 * Math.cos(angle)).toFixed(1)},${(256 + 430 * Math.sin(angle)).toFixed(1)}`;
    rays.push(
      `<polygon points="256,256 ${pointAt(centerAngle - halfAngle)} ${pointAt(centerAngle + halfAngle)}" fill="#ffffff"/>`
    );
  }
  return `<g opacity="0.16">${rays.join("")}</g>`;
}

function escapeXmlText(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function assertHexColor(specId: string, field: string, value: string): void {
  if (!/^#[0-9a-f]{6}$/i.test(value.trim())) {
    throw new Error(
      `gamepass icon "${specId}": ${field} must be a #rrggbb hex color, got "${value}"`
    );
  }
}

export function renderGamepassIconSvg(spec: GamepassIconSpec): string {
  if (!spec.id.trim()) {
    throw new Error('gamepass icon: "id" is empty');
  }
  if (!spec.titleTop.trim()) {
    throw new Error(`gamepass icon "${spec.id}": "titleTop" is empty`);
  }
  if (spec.titleBottom !== undefined && !spec.titleBottom.trim()) {
    throw new Error(`gamepass icon "${spec.id}": "titleBottom" is empty`);
  }
  assertHexColor(spec.id, "primaryColor", spec.primaryColor);
  assertHexColor(spec.id, "secondaryColor", spec.secondaryColor);

  const rim = RIM_PRESETS[spec.rim];
  const tone: EmblemTone = { light: "#ffffff", metal: rim.metal, deep: "#1d2430" };
  const round = spec.shape === "circle";

  const clipShape = round
    ? '<circle cx="256" cy="256" r="240"/>'
    : '<rect x="32" y="32" width="448" height="448" rx="96"/>';
  const rimShape = round
    ? '<circle cx="256" cy="256" r="230" fill="none" stroke="url(#rim-gradient)" stroke-width="20"/>'
    : '<rect x="42" y="42" width="428" height="428" rx="88" fill="none" stroke="url(#rim-gradient)" stroke-width="20"/>';
  const glowShape = round
    ? `<circle cx="256" cy="256" r="248" fill="none" stroke="${rim.metal}" stroke-width="8" opacity="0.5"/>`
    : `<rect x="24" y="24" width="464" height="464" rx="104" fill="none" stroke="${rim.metal}" stroke-width="8" opacity="0.5"/>`;

  const titleTopSize = spec.titleBottom !== undefined ? 62 : 70;
  const titleTopY = spec.titleBottom !== undefined ? 398 : 430;
  const fontFamily = "'Montserrat', 'Fredoka', 'Arial Black', Impact, sans-serif";
  const titleTopXml =
    `<text x="256" y="${titleTopY}" text-anchor="middle" font-family="${fontFamily}" ` +
    `font-size="${titleTopSize}" font-weight="900" letter-spacing="2" paint-order="stroke fill" ` +
    `stroke="#14100a" stroke-width="14" stroke-linejoin="round" fill="#ffffff">` +
    `${escapeXmlText(spec.titleTop.trim())}</text>`;
  const titleBottomXml =
    spec.titleBottom !== undefined
      ? `<text x="256" y="460" text-anchor="middle" font-family="${fontFamily}" ` +
        `font-size="40" font-weight="900" letter-spacing="3" paint-order="stroke fill" ` +
        `stroke="#14100a" stroke-width="14" stroke-linejoin="round" fill="#ffd166">` +
        `${escapeXmlText(spec.titleBottom.trim())}</text>`
      : "";

  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">',
    "<defs>",
    `<radialGradient id="badge-bg" cx="50%" cy="34%" r="82%"><stop offset="0" stop-color="${spec.primaryColor}"/><stop offset="1" stop-color="${spec.secondaryColor}"/></radialGradient>`,
    `<linearGradient id="rim-gradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${rim.stops[0]}"/><stop offset="0.35" stop-color="${rim.stops[1]}"/><stop offset="0.7" stop-color="${rim.stops[2]}"/><stop offset="1" stop-color="${rim.stops[3]}"/></linearGradient>`,
    '<radialGradient id="badge-sheen" cx="50%" cy="26%" r="60%"><stop offset="0" stop-color="#ffffff" stop-opacity="0.26"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>',
    `<clipPath id="badge-clip">${clipShape}</clipPath>`,
    '<filter id="emblem-shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="10" stdDeviation="8" flood-color="#000000" flood-opacity="0.35"/></filter>',
    "</defs>",
    spec.glow ? glowShape : "",
    '<g clip-path="url(#badge-clip)">',
    '<rect width="512" height="512" fill="url(#badge-bg)"/>',
    spec.sunburst ? sunburstXml() : "",
    '<rect width="512" height="512" fill="url(#badge-sheen)"/>',
    '<path d="M124 190 A 158 158 0 0 1 300 104" fill="none" stroke="#ffffff" stroke-opacity="0.4" stroke-width="24" stroke-linecap="round"/>',
    "</g>",
    rimShape,
    `<g filter="url(#emblem-shadow)">${emblemArtXml(spec.emblem, tone)}</g>`,
    titleTopXml,
    titleBottomXml,
    "</svg>",
  ].join("\n");
}
