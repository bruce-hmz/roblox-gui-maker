// Deterministic 1920x1080 Roblox Experience Thumbnail & 512x512 Game Icon specs,
// safe-zone overlays, and genre presets. Zero DOM or Node imports.

export const THUMBNAIL_WIDTH = 1920;
export const THUMBNAIL_HEIGHT = 1080;
export const GAME_ICON_SIZE = 512;

export type SafeZoneRect = {
  id: string;
  labelEn: string;
  labelZh: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

// Coordinates in 1920x1080 canvas pixels representing Roblox Discover UI
// badges/overlays and the center 1:1 square Game Icon crop.
export const ROBLOX_SAFE_ZONES = {
  // 5% inner title-safe frame
  titleSafe: {
    id: "title-safe",
    labelEn: "5% Title Safe Margin",
    labelZh: "5% 安全边距线",
    x: 96,
    y: 54,
    width: 1728,
    height: 972,
  },
  // Bottom-left Discover card rating/player pill overlay area
  bottomLeftOverlay: {
    id: "bottom-left",
    labelEn: "Discover Bottom-Left Pill",
    labelZh: "探索页左下角评分/在线遮挡区",
    x: 36,
    y: 888,
    width: 560,
    height: 156,
  },
  // Top-right event/sponsored badge area
  topRightOverlay: {
    id: "top-right",
    labelEn: "Top-Right Event Badge Area",
    labelZh: "右上角活动/标签遮挡区",
    x: 1540,
    y: 36,
    width: 344,
    height: 140,
  },
} as const;

export type ThumbnailPreset = {
  id: string;
  nameEn: string;
  nameZh: string;
  bgStart: string;
  bgEnd: string;
  accentColor: string;
  headlineTop: string;
  headlineBottom: string;
  subtitle: string;
  badgeText: string;
  sunburst: boolean;
};

export const THUMBNAIL_PRESETS: readonly ThumbnailPreset[] = [
  {
    id: "simulator-update",
    nameEn: "Simulator Update",
    nameZh: "模拟器大更新",
    bgStart: "#1e3a8a",
    bgEnd: "#091128",
    accentColor: "#facc15",
    headlineTop: "MEGA PETS",
    headlineBottom: "UPDATE 12",
    subtitle: "2X COINS + 5 NEW WORLDS",
    badgeText: "UPD",
    sunburst: true,
  },
  {
    id: "anime-battleground",
    nameEn: "Anime Battleground",
    nameZh: "动漫格斗战场",
    bgStart: "#7f1d1d",
    bgEnd: "#0f0c18",
    accentColor: "#38bdf8",
    headlineTop: "AWAKENED",
    headlineBottom: "CURSED FORMS",
    subtitle: "NEW DOMAIN + BOSS RAID",
    badgeText: "NEW",
    sunburst: true,
  },
  {
    id: "horror-survival",
    nameEn: "Horror Survival",
    nameZh: "恐怖逃生",
    bgStart: "#18181b",
    bgEnd: "#040406",
    accentColor: "#ef4444",
    headlineTop: "CHAPTER 4",
    headlineBottom: "THE BASEMENT",
    subtitle: "CAN YOU SURVIVE NIGHT 5?",
    badgeText: "HORROR",
    sunburst: false,
  },
  {
    id: "obby-mega-stage",
    nameEn: "Obby Mega Stage",
    nameZh: "跑酷冲关",
    bgStart: "#0f766e",
    bgEnd: "#082f49",
    accentColor: "#4cddb1",
    headlineTop: "750 STAGES",
    headlineBottom: "MEGA OBBY",
    subtitle: "FREE COILS + SECRET BADGES",
    badgeText: "2X XP",
    sunburst: true,
  },
  {
    id: "tycoon-empire",
    nameEn: "Tycoon Empire",
    nameZh: "大亨帝国",
    bgStart: "#4c1d95",
    bgEnd: "#111827",
    accentColor: "#f59e0b",
    headlineTop: "BUILD YOUR",
    headlineBottom: "SPACE EMPIRE",
    subtitle: "REBIRTH TIER 10 LIVE",
    badgeText: "CODES",
    sunburst: true,
  },
  {
    id: "rng-aura-roll",
    nameEn: "RNG Aura Roll",
    nameZh: "RNG 抽卡光环",
    bgStart: "#311042",
    bgEnd: "#090a14",
    accentColor: "#c084fc",
    headlineTop: "1 IN 100M",
    headlineBottom: "CELESTIAL AURA",
    subtitle: "3X LUCK WEEKEND EVENT",
    badgeText: "3X LUCK",
    sunburst: true,
  },
] as const;

/** Computes the centered 1:1 square region inside a 1920x1080 thumbnail for 512x512 Game Icon export. */
export function computeIconCropRect(
  width = THUMBNAIL_WIDTH,
  height = THUMBNAIL_HEIGHT
): { x: number; y: number; size: number } {
  const size = Math.min(width, height);
  return {
    x: Math.round((width - size) / 2),
    y: Math.round((height - size) / 2),
    size,
  };
}

export function buildThumbnailFilename(
  headline: string,
  variant: "1920x1080" | "512x512"
): string {
  const slug =
    headline
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "roblox-thumbnail";
  return `${slug}-${variant}.png`;
}
