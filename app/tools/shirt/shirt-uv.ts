// Deterministic Roblox Classic Clothing (585x559) UV coordinates, validation,
// presets, and SVG template builder. Zero DOM or Node imports so it runs in
// both browser client components and Vitest / Edge workers.

export const ROBLOX_CLOTHING_WIDTH = 585;
export const ROBLOX_CLOTHING_HEIGHT = 559;

export type ClothingPart = "torso" | "rightLimb" | "leftLimb";

export type ClothingFaceName =
  | "top"
  | "front"
  | "back"
  | "left"
  | "right"
  | "outer"
  | "inner"
  | "bottom";

export type ClothingUvRect = {
  id: string;
  part: ClothingPart;
  face: ClothingFaceName;
  labelEn: string;
  labelZh: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

// Exact official Roblox 585x559 Classic Shirt / Pants template pixel rects.
export const CLOTHING_UV_REGIONS: readonly ClothingUvRect[] = [
  // Torso
  {
    id: "torsoTop",
    part: "torso",
    face: "top",
    labelEn: "Torso Top",
    labelZh: "躯干顶部",
    x: 231,
    y: 8,
    width: 128,
    height: 64,
  },
  {
    id: "torsoFront",
    part: "torso",
    face: "front",
    labelEn: "Front",
    labelZh: "前胸",
    x: 231,
    y: 74,
    width: 128,
    height: 128,
  },
  {
    id: "torsoBack",
    part: "torso",
    face: "back",
    labelEn: "Back",
    labelZh: "后背",
    x: 427,
    y: 74,
    width: 128,
    height: 128,
  },
  {
    id: "torsoRight",
    part: "torso",
    face: "right",
    labelEn: "R Side",
    labelZh: "右侧面",
    x: 165,
    y: 74,
    width: 64,
    height: 128,
  },
  {
    id: "torsoLeft",
    part: "torso",
    face: "left",
    labelEn: "L Side",
    labelZh: "左侧面",
    x: 361,
    y: 74,
    width: 64,
    height: 128,
  },
  {
    id: "torsoBottom",
    part: "torso",
    face: "bottom",
    labelEn: "Torso Bottom",
    labelZh: "躯干底部",
    x: 231,
    y: 204,
    width: 128,
    height: 64,
  },

  // Right Limb (Right Arm on Shirt / Right Leg on Pants)
  {
    id: "rightLimbTop",
    part: "rightLimb",
    face: "top",
    labelEn: "R Top",
    labelZh: "右顶面",
    x: 217,
    y: 289,
    width: 64,
    height: 64,
  },
  {
    id: "rightLimbFront",
    part: "rightLimb",
    face: "front",
    labelEn: "R Front",
    labelZh: "右前面",
    x: 217,
    y: 355,
    width: 64,
    height: 128,
  },
  {
    id: "rightLimbOuter",
    part: "rightLimb",
    face: "outer",
    labelEn: "R Outer",
    labelZh: "右外侧",
    x: 151,
    y: 355,
    width: 64,
    height: 128,
  },
  {
    id: "rightLimbBack",
    part: "rightLimb",
    face: "back",
    labelEn: "R Back",
    labelZh: "右背面",
    x: 85,
    y: 355,
    width: 64,
    height: 128,
  },
  {
    id: "rightLimbInner",
    part: "rightLimb",
    face: "inner",
    labelEn: "R Inner",
    labelZh: "右内侧",
    x: 19,
    y: 355,
    width: 64,
    height: 128,
  },
  {
    id: "rightLimbBottom",
    part: "rightLimb",
    face: "bottom",
    labelEn: "R Bottom",
    labelZh: "右底面",
    x: 217,
    y: 485,
    width: 64,
    height: 64,
  },

  // Left Limb (Left Arm on Shirt / Left Leg on Pants)
  {
    id: "leftLimbTop",
    part: "leftLimb",
    face: "top",
    labelEn: "L Top",
    labelZh: "左顶面",
    x: 308,
    y: 289,
    width: 64,
    height: 64,
  },
  {
    id: "leftLimbFront",
    part: "leftLimb",
    face: "front",
    labelEn: "L Front",
    labelZh: "左前面",
    x: 308,
    y: 355,
    width: 64,
    height: 128,
  },
  {
    id: "leftLimbOuter",
    part: "leftLimb",
    face: "outer",
    labelEn: "L Outer",
    labelZh: "左外侧",
    x: 374,
    y: 355,
    width: 64,
    height: 128,
  },
  {
    id: "leftLimbBack",
    part: "leftLimb",
    face: "back",
    labelEn: "L Back",
    labelZh: "左背面",
    x: 440,
    y: 355,
    width: 64,
    height: 128,
  },
  {
    id: "leftLimbInner",
    part: "leftLimb",
    face: "inner",
    labelEn: "L Inner",
    labelZh: "左内侧",
    x: 506,
    y: 355,
    width: 64,
    height: 128,
  },
  {
    id: "leftLimbBottom",
    part: "leftLimb",
    face: "bottom",
    labelEn: "L Bottom",
    labelZh: "左底面",
    x: 308,
    y: 485,
    width: 64,
    height: 64,
  },
] as const;

export type ClothingDimensionValidation = {
  valid: boolean;
  status: "exact" | "scaled" | "invalid";
  messageEn: string;
  messageZh: string;
};

/** Validates uploaded clothing texture dimensions against Roblox's 585x559 spec. */
export function validateClothingDimensions(
  width: number,
  height: number
): ClothingDimensionValidation {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return {
      valid: false,
      status: "invalid",
      messageEn: "Invalid image dimensions. Export a 585×559 PNG template.",
      messageZh: "图片尺寸无效，请使用 585×559 像素的 PNG 模板。",
    };
  }

  if (width === ROBLOX_CLOTHING_WIDTH && height === ROBLOX_CLOTHING_HEIGHT) {
    return {
      valid: true,
      status: "exact",
      messageEn: "Exact 585×559 px — ready for Roblox Creator Hub upload.",
      messageZh: "标准 585×559 像素 — 可直接上传至 Roblox 服装后台。",
    };
  }

  const expectedRatio = ROBLOX_CLOTHING_WIDTH / ROBLOX_CLOTHING_HEIGHT;
  const actualRatio = width / height;
  if (Math.abs(actualRatio - expectedRatio) <= 0.02) {
    return {
      valid: true,
      status: "scaled",
      messageEn: `${width}×${height} px matches 585:559 aspect ratio (preview scaled; export at 585×559 before uploading).`,
      messageZh: `${width}×${height} 像素符合 585:559 比例（预览已自动缩放；上传前请导出为 585×559）。`,
    };
  }

  return {
    valid: false,
    status: "invalid",
    messageEn: `${width}×${height} px does not match Roblox's required 585×559 Classic Clothing template.`,
    messageZh: `${width}×${height} 像素不符合 Roblox 官方 585×559 经典服装模板比例。`,
  };
}

export type ClothingKind = "shirt" | "pants";
export type CollarStyle = "crew" | "hoodie" | "vneck" | "zip";

export type ShirtDesignSpec = {
  id: string;
  nameEn: string;
  nameZh: string;
  kind: ClothingKind;
  baseColor: string;
  sleeveColor: string;
  accentColor: string;
  collarStyle: CollarStyle;
  chestStripe: boolean;
  frontText: string;
  sleeveLengthRatio: number; // 0.35 (short) .. 1 (full)
};

export const SHIRT_STYLE_PRESETS: readonly ShirtDesignSpec[] = [
  {
    id: "streetwear-hoodie",
    nameEn: "Streetwear Hoodie",
    nameZh: "街头连帽卫衣",
    kind: "shirt",
    baseColor: "#1b202e",
    sleeveColor: "#252c40",
    accentColor: "#00a2ff",
    collarStyle: "hoodie",
    chestStripe: true,
    frontText: "BLOX",
    sleeveLengthRatio: 1,
  },
  {
    id: "anime-battle-jersey",
    nameEn: "Anime Battle Jersey",
    nameZh: "动漫战斗队服",
    kind: "shirt",
    baseColor: "#131722",
    sleeveColor: "#c50005",
    accentColor: "#f5a524",
    collarStyle: "vneck",
    chestStripe: true,
    frontText: "07",
    sleeveLengthRatio: 0.55,
  },
  {
    id: "tactical-vest",
    nameEn: "Tactical Vest",
    nameZh: "战术作战背心",
    kind: "shirt",
    baseColor: "#2b332b",
    sleeveColor: "#3c453a",
    accentColor: "#9aa7b8",
    collarStyle: "zip",
    chestStripe: false,
    frontText: "UNIT",
    sleeveLengthRatio: 0.9,
  },
  {
    id: "cyber-neon-jacket",
    nameEn: "Cyber Neon Jacket",
    nameZh: "赛博霓虹夹克",
    kind: "shirt",
    baseColor: "#101426",
    sleeveColor: "#191f3a",
    accentColor: "#4cddb1",
    collarStyle: "zip",
    chestStripe: true,
    frontText: "CYBER",
    sleeveLengthRatio: 1,
  },
  {
    id: "varsity-classic",
    nameEn: "Varsity Classic",
    nameZh: "美式棒球夹克",
    kind: "shirt",
    baseColor: "#1e3a8a",
    sleeveColor: "#e2e8f0",
    accentColor: "#f2b53c",
    collarStyle: "crew",
    chestStripe: false,
    frontText: "R",
    sleeveLengthRatio: 0.95,
  },
  {
    id: "cozy-pastel-sweater",
    nameEn: "Cozy Pastel Sweater",
    nameZh: "治愈系马卡龙毛衣",
    kind: "shirt",
    baseColor: "#f4a2b8",
    sleeveColor: "#fbcfe8",
    accentColor: "#fff7ed",
    collarStyle: "crew",
    chestStripe: true,
    frontText: "COZY",
    sleeveLengthRatio: 0.92,
  },
] as const;

export const SKIN_TONE_PRESETS: readonly { id: string; nameEn: string; nameZh: string; color: string }[] = [
  { id: "classic-yellow", nameEn: "Classic Brick", nameZh: "经典积木黄", color: "#f5cd30" },
  { id: "light-peach", nameEn: "Light Peach", nameZh: "浅桃肤色", color: "#f6d5b8" },
  { id: "warm-tan", nameEn: "Warm Tan", nameZh: "小麦色", color: "#d7a176" },
  { id: "deep-brown", nameEn: "Deep Brown", nameZh: "深棕肤色", color: "#7a4e32" },
  { id: "slate-gray", nameEn: "Neutral Slate", nameZh: "中性灰", color: "#94a3b8" },
];

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function contrastTextColor(hex: string): string {
  const match = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return "#ffffff";
  const rgb = parseInt(match[1], 16);
  const r = (rgb >> 16) & 255;
  const g = (rgb >> 8) & 255;
  const b = rgb & 255;
  const luma = 0.299 * r + 0.587 * g + 0.114 * b;
  return luma > 160 ? "#11131c" : "#ffffff";
}

function safeHex(hex: string, fallback: string): string {
  return /^#[0-9a-f]{6}$/i.test(hex.trim()) ? hex.trim() : fallback;
}

const REGION_GUIDE_COLORS: Record<ClothingPart, string> = {
  torso: "#2563eb",
  rightLimb: "#0d9488",
  leftLimb: "#7c3aed",
};

/**
 * Renders deterministic 585x559 SVG template markup for Roblox Classic Shirts or Pants.
 * When `includeGuides` is false, the outside area remains transparent so the exported
 * raster PNG can be uploaded directly to Roblox Creator Hub.
 */
export function buildClothingTemplateSvg(
  spec: ShirtDesignSpec,
  options: { includeGuides: boolean; includeLabels: boolean; blankTemplateOnly?: boolean }
): string {
  const base = safeHex(spec.baseColor, "#1b202e");
  const sleeve = safeHex(spec.sleeveColor, "#252c40");
  const accent = safeHex(spec.accentColor, "#00a2ff");
  const sleeveRatio = Math.max(0.25, Math.min(1, spec.sleeveLengthRatio));
  const labelText = escapeXml(spec.frontText.trim().slice(0, 10));
  const inkOnBase = contrastTextColor(base);

  const pieces: string[] = [];

  if (options.includeGuides) {
    pieces.push(`<rect x="0" y="0" width="${ROBLOX_CLOTHING_WIDTH}" height="${ROBLOX_CLOTHING_HEIGHT}" fill="#0f172a" />`);
  }

  if (!options.blankTemplateOnly) {
    // Torso faces
    for (const r of CLOTHING_UV_REGIONS) {
      if (r.part === "torso") {
        pieces.push(`<rect x="${r.x}" y="${r.y}" width="${r.width}" height="${r.height}" fill="${base}" />`);
      } else {
        const limbHeight =
          r.face === "top" || r.face === "bottom"
            ? r.height
            : Math.round(r.height * sleeveRatio);
        if (r.face !== "bottom" || sleeveRatio >= 0.98) {
          const fill = spec.kind === "pants" ? base : sleeve;
          pieces.push(`<rect x="${r.x}" y="${r.y}" width="${r.width}" height="${limbHeight}" fill="${fill}" />`);
          if (r.face !== "top" && r.face !== "bottom" && sleeveRatio >= 0.35) {
            // Cuff trim
            pieces.push(
              `<rect x="${r.x}" y="${r.y + Math.max(0, limbHeight - 10)}" width="${r.width}" height="8" fill="${accent}" opacity="0.9" />`
            );
          }
        }
      }
    }

    // Chest stripe across front, back, and torso sides
    if (spec.chestStripe) {
      pieces.push(`<rect x="165" y="138" width="390" height="16" fill="${accent}" />`);
    }

    // Collar / waistband detailing on front torso (231, 74, 128, 128)
    if (spec.kind === "shirt") {
      if (spec.collarStyle === "crew") {
        pieces.push(
          `<path d="M 271 74 Q 295 96 319 74" fill="none" stroke="${accent}" stroke-width="6" stroke-linecap="round" />`
        );
      } else if (spec.collarStyle === "vneck") {
        pieces.push(
          `<path d="M 273 74 L 295 104 L 317 74" fill="none" stroke="${accent}" stroke-width="6" stroke-linejoin="round" />`
        );
      } else if (spec.collarStyle === "hoodie") {
        pieces.push(
          `<path d="M 267 74 Q 295 102 323 74" fill="none" stroke="${accent}" stroke-width="8" stroke-linecap="round" />`,
          `<rect x="285" y="88" width="4" height="26" rx="2" fill="${accent}" />`,
          `<rect x="301" y="88" width="4" height="26" rx="2" fill="${accent}" />`
        );
      } else if (spec.collarStyle === "zip") {
        pieces.push(
          `<rect x="293" y="74" width="4" height="128" fill="${accent}" opacity="0.85" />`,
          `<rect x="289" y="82" width="12" height="6" rx="2" fill="${inkOnBase}" opacity="0.85" />`
        );
      }
    } else {
      // Pants waistband + center seam hint
      pieces.push(
        `<rect x="165" y="74" width="390" height="14" fill="${accent}" />`,
        `<rect x="293" y="102" width="4" height="100" fill="${inkOnBase}" opacity="0.22" />`
      );
    }

    // Front emblem / text
    if (labelText && spec.kind === "shirt") {
      const textY = spec.chestStripe ? 128 : 138;
      pieces.push(
        `<text x="295" y="${textY}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-weight="800" font-size="22" letter-spacing="1.5" fill="${inkOnBase}">${labelText}</text>`
      );
    }
  }

  if (options.includeGuides) {
    for (const r of CLOTHING_UV_REGIONS) {
      const stroke = REGION_GUIDE_COLORS[r.part];
      const fillOpacity = options.blankTemplateOnly ? "0.28" : "0.08";
      pieces.push(
        `<rect x="${r.x}" y="${r.y}" width="${r.width}" height="${r.height}" fill="${stroke}" fill-opacity="${fillOpacity}" stroke="${stroke}" stroke-width="1.5" />`
      );
      if (options.includeLabels) {
        pieces.push(
          `<text x="${r.x + r.width / 2}" y="${r.y + r.height / 2 + 4}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-weight="700" font-size="11" fill="#f8fafc">${escapeXml(r.labelEn)}</text>`
        );
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${ROBLOX_CLOTHING_WIDTH}" height="${ROBLOX_CLOTHING_HEIGHT}" viewBox="0 0 ${ROBLOX_CLOTHING_WIDTH} ${ROBLOX_CLOTHING_HEIGHT}">${pieces.join("")}</svg>`;
}
