// Curated Roblox avatar outfit looks for the /avatar gallery and its style
// spokes (/avatar/preppy, /avatar/matching, /avatar/cheap, /avatar/y2k).
// Every item ID was pulled live from the Roblox catalog search API (2026-08)
// — never guessed; memory-sourced candidates that failed verification were
// dropped. Prices are `lowestPrice` at pull time and DO change; the pages say
// so. Thumbnails render client-side through /api/roblox-thumbnail so CDN
// hash changes can't rot the pages.

export type AvatarItem = {
  id: number;
  name: string;
  nameZh: string;
  type: "hair" | "face" | "head" | "top" | "bottom" | "shoes" | "extra";
  /** lowestPrice in R$ at pull time; 0 = free */
  price: number;
};

export type AvatarStyle = "classic" | "casual" | "street" | "soft" | "formal";

/** Long-tail spokes this look appears on. */
export type SpokeKey = "preppy" | "matching" | "cheap" | "y2k";

export type AvatarLook = {
  slug: string;
  name: string;
  nameZh: string;
  style: AvatarStyle;
  blurb: string;
  blurbZh: string;
  items: AvatarItem[];
  spokes?: SpokeKey[];
};

export const STYLE_LABELS: Record<AvatarStyle, { en: string; zh: string }> = {
  classic: { en: "Classic", zh: "经典" },
  casual: { en: "Casual", zh: "日常" },
  street: { en: "Street", zh: "街头" },
  soft: { en: "Soft", zh: "甜妹" },
  formal: { en: "Formal", zh: "正装" },
};

const MAN_FACE: AvatarItem = {
  id: 949,
  name: "Man Face",
  nameZh: "Man Face(经典笑脸)",
  type: "face",
  price: 0,
};
const PAL_HAIR: AvatarItem = {
  id: 63690008,
  name: "Pal Hair",
  nameZh: "Pal Hair(经典黑色短发)",
  type: "hair",
  price: 0,
};
const SNEAKERS_GRAY: AvatarItem = {
  id: 872,
  name: "Roblox Sneakers - Gray",
  nameZh: "Roblox Sneakers - Gray(官方灰帆布鞋)",
  type: "shoes",
  price: 0,
};
const WETSUIT_PANTS: AvatarItem = {
  id: 9120251003,
  name: "Wetsuit Pants - Black",
  nameZh: "Wetsuit Pants - Black(黑色长裤)",
  type: "bottom",
  price: 0,
};
const ZIP_HOODIE: AvatarItem = {
  id: 7192553841,
  name: "Zip Hoodie - Black",
  nameZh: "Zip Hoodie - Black(黑色连帽外套)",
  type: "top",
  price: 0,
};
const KNIT_SWEATER: AvatarItem = {
  id: 9240757332,
  name: "Knit Sweater - Black",
  nameZh: "Knit Sweater - Black(黑色针织毛衣)",
  type: "top",
  price: 0,
};
const SILLY_FUN_HEAD: AvatarItem = {
  id: 299652,
  name: "Silly Fun",
  nameZh: "Silly Fun(趣味大头)",
  type: "head",
  price: 0,
};

export const AVATAR_LOOKS: AvatarLook[] = [
  {
    slug: "classic-start",
    name: "Classic Start",
    nameZh: "经典开局",
    style: "classic",
    blurb:
      "The upgraded starter: iconic free hair and face with Roblox's own free hoodie, pants and sneakers. Zero Robux, instantly recognizable.",
    blurbZh:
      "升级版开局装:标志性的免费发型和脸,配上 Roblox 官方免费的外套、长裤和帆布鞋。零 Robux,一眼就是老玩家。",
    items: [PAL_HAIR, MAN_FACE, ZIP_HOODIE, WETSUIT_PANTS, SNEAKERS_GRAY],
    spokes: ["cheap"],
  },
  {
    slug: "clean-campus",
    name: "Clean Campus",
    nameZh: "清爽学院",
    style: "casual",
    blurb:
      "Knit sweater, straight black pants and gray sneakers — a soft, tidy everyday fit built entirely from official free items.",
    blurbZh:
      "针织毛衣配黑色直筒裤和灰色帆布鞋 —— 全部由官方免费单品组成的干净日常风。",
    items: [SILLY_FUN_HEAD, KNIT_SWEATER, WETSUIT_PANTS, SNEAKERS_GRAY],
    spokes: ["cheap"],
  },
  {
    slug: "street-layer",
    name: "Street Layer",
    nameZh: "街头层叠",
    style: "street",
    blurb:
      "Hoodie over straight pants with chunky sneakers. Three cheap community items that read far more expensive than they are.",
    blurbZh:
      "连帽卫衣叠直筒裤,配厚底板鞋。三件平价社区单品,穿出来的效果远超价格。",
    items: [
      { id: 17775630860, name: "Hoodie", nameZh: "连帽卫衣", type: "top", price: 65 },
      { id: 139763292663915, name: "Pants", nameZh: "直筒长裤", type: "bottom", price: 75 },
      { id: 166188584127803, name: "Sneakers", nameZh: "厚底板鞋", type: "shoes", price: 60 },
    ],
  },
  {
    slug: "soft-pastel",
    name: "Soft Pastel",
    nameZh: "奶油甜妹",
    style: "soft",
    blurb:
      "Pink curls with a skirt-and-hoodie pairing — the soft-girl formula, kept under R$200.",
    blurbZh:
      "粉色卷发配短裙加连帽卫衣 —— 经典甜妹公式,整套控制在 200 Robux 以内。",
    items: [
      { id: 16367335212, name: "Pink Curls Hair", nameZh: "粉色卷发", type: "hair", price: 65 },
      { id: 15012025344, name: "Hoodie", nameZh: "连帽卫衣", type: "top", price: 70 },
      { id: 17706000198, name: "Skirt", nameZh: "短裙", type: "bottom", price: 60 },
    ],
    spokes: ["preppy"],
  },
  {
    slug: "hime-school",
    name: "Hime School",
    nameZh: "姬发式校园",
    style: "classic",
    blurb:
      "Hime-cut hair with a bonnet, school-uniform energy from a skirt and hoodie combo. Neat, and entirely under R$200.",
    blurbZh:
      "带蕾丝软帽的姬发式发型,短裙加卫衣的学院搭配。整洁乖巧,整套不到 200 Robux。",
    items: [
      { id: 14846709566, name: "Hime Cut Lace Bonnet Hair - Blonde", nameZh: "姬发式蕾丝帽金发", type: "hair", price: 65 },
      { id: 16092660628, name: "Hoodie", nameZh: "连帽卫衣", type: "top", price: 70 },
      { id: 17593623859, name: "Skirt", nameZh: "短裙", type: "bottom", price: 60 },
    ],
  },
  {
    slug: "y2k-cloud",
    name: "Y2K Cloud",
    nameZh: "千禧云朵",
    style: "street",
    blurb:
      "Ombre hair with a cloud accessory, cropped jacket and baggy pants — the Y2K silhouette on a budget.",
    blurbZh:
      "带云朵发饰的渐变发色,短外套配宽松长裤 —— 平价版 Y2K 轮廓。",
    items: [
      { id: 77908797932794, name: "ombre hair with cloud of nemuri", nameZh: "云朵渐变发", type: "hair", price: 65 },
      { id: 79730315899945, name: "Jacket", nameZh: "短外套", type: "top", price: 65 },
      { id: 75282985905560, name: "Pants", nameZh: "宽松长裤", type: "bottom", price: 75 },
    ],
    spokes: ["y2k"],
  },
  {
    slug: "formal-night",
    name: "Formal Night",
    nameZh: "正装之夜",
    style: "formal",
    blurb:
      "A tailored suit with sleek black hair. Two items, one clean formal look — cheapest dress-up on this page.",
    blurbZh:
      "剪裁利落的西装配黑色长发。两件单品搞定一套正装 —— 全页最省钱的换装方案。",
    items: [
      { id: 14794842263, name: "Witchy Vampire Hair - Black", nameZh: "女巫黑色长发", type: "hair", price: 65 },
      { id: 15477073437, name: "Suit", nameZh: "西装", type: "top", price: 60 },
    ],
  },
  {
    slug: "weekend-sport",
    name: "Weekend Sport",
    nameZh: "周末运动",
    style: "casual",
    blurb:
      "Free classic hair over a fresh hoodie and relaxed pants — an easy weekend fit that costs less than R$150.",
    blurbZh:
      "免费经典发型配新卫衣和宽松长裤 —— 轻松的周末风,整套不到 150 Robux。",
    items: [
      PAL_HAIR,
      { id: 13325262415, name: "Hoodie", nameZh: "连帽卫衣", type: "top", price: 70 },
      { id: 119874103032352, name: "Pants", nameZh: "宽松长裤", type: "bottom", price: 75 },
    ],
  },

  // ---- Preppy spoke ----
  {
    slug: "ivy-classic",
    name: "Ivy Classic",
    nameZh: "常春藤学院",
    style: "classic",
    blurb:
      "Collared shirt with a black tie over the pastel plaid skirt and free gray sneakers — the campus-uniform formula for R$125.",
    blurbZh:
      "带领衬衫配黑领带,下搭粉彩格纹短裙和免费帆布鞋 —— 125 Robux 拿下学院制服公式。",
    items: [
      { id: 106648863300157, name: "White Collared Shirt w/ Black Tie", nameZh: "白色带领衬衫配黑领带", type: "top", price: 60 },
      { id: 12822225927, name: "Punk Skirt Pastel", nameZh: "粉彩格纹短裙", type: "bottom", price: 65 },
      SNEAKERS_GRAY,
    ],
    spokes: ["preppy"],
  },
  {
    slug: "pastel-prep",
    name: "Pastel Prep",
    nameZh: "粉彩预备生",
    style: "soft",
    blurb:
      "Oversized pastel off-shoulder sweater with the pastel skirt — soft prep in two pieces plus free sneakers, R$130 total.",
    blurbZh:
      "粉彩一字肩oversized毛衣配粉彩短裙 —— 两件单品加免费帆布鞋,130 Robux 的软糯学院风。",
    items: [
      { id: 83324415868020, name: "oversized pastel rainbow off shoulder sweater", nameZh: "粉彩彩虹一字肩毛衣", type: "top", price: 65 },
      { id: 12822225927, name: "Punk Skirt Pastel", nameZh: "粉彩格纹短裙", type: "bottom", price: 65 },
      SNEAKERS_GRAY,
    ],
    spokes: ["preppy"],
  },
  {
    slug: "plaid-academy",
    name: "Plaid Academy",
    nameZh: "格纹学园",
    style: "classic",
    blurb:
      "90s plaid jacket layered over the collared shirt and tie, straight black pants underneath — R$130, reads twice the price.",
    blurbZh:
      "90 年代格纹外套叠穿带领衬衫领带,内搭黑色直筒裤 —— 130 Robux,观感翻倍。",
    items: [
      { id: 105835582630469, name: "90s Plaid Jacket", nameZh: "90年代格纹外套", type: "top", price: 70 },
      { id: 106648863300157, name: "White Collared Shirt w/ Black Tie", nameZh: "白色带领衬衫配黑领带", type: "top", price: 60 },
      WETSUIT_PANTS,
    ],
    spokes: ["preppy"],
  },
  {
    slug: "pink-polo",
    name: "Pink Polo",
    nameZh: "粉发 Polo 学院",
    style: "soft",
    blurb:
      "White polo collar, pleated skirt, pink curls — the preppy look TikTok keeps pinning, for R$190.",
    blurbZh:
      "白色 Polo 领衫配百褶裙和粉色卷发 —— TikTok 和 Pinterest 上最火的那套学院感,190 Robux。",
    items: [
      { id: 18357795712, name: "White Polo Collared Shirt", nameZh: "白色 Polo 领衬衫", type: "top", price: 65 },
      { id: 17706000198, name: "Skirt", nameZh: "百褶短裙", type: "bottom", price: 60 },
      { id: 16367335212, name: "Pink Curls Hair", nameZh: "粉色卷发", type: "hair", price: 65 },
    ],
    spokes: ["preppy"],
  },

  // ---- Matching spoke ----
  {
    slug: "sweetheart-sweaters",
    name: "Sweetheart Sweaters",
    nameZh: "甜心情侣毛衣",
    style: "soft",
    blurb:
      "His-and-hers heart sweaters — pink and blue variants of the same design. One for you, one for your duo: R$140 a pair.",
    blurbZh:
      "同款异色的爱心毛衣 —— 粉蓝两色。一人一件,情侣档 140 Robux 成套。",
    items: [
      { id: 116754308389267, name: "Sweater Couple Heart (Pink)", nameZh: "爱心情侣毛衣·粉", type: "top", price: 70 },
      { id: 130201222200062, name: "Sweater Couple Heart (Blue)", nameZh: "爱心情侣毛衣·蓝", type: "top", price: 70 },
    ],
    spokes: ["matching"],
  },
  {
    slug: "pink-blue-jackets",
    name: "Pink & Blue Jackets",
    nameZh: "粉蓝情侣外套",
    style: "casual",
    blurb:
      "Matching BALESCO couple jackets in pink and blue — the easiest duo flex on this page at R$140 for both.",
    blurbZh:
      "BALESCO 同系列情侣外套,一粉一蓝 —— 全页最省事的双人组合,两件 140 Robux。",
    items: [
      { id: 77069412596714, name: "Sweet Pink Couple Jacket - BALESCO", nameZh: "甜心情侣外套·粉 BALESCO", type: "top", price: 70 },
      { id: 101467458502575, name: "Sweet Blue Couple Jacket - BALESCO", nameZh: "甜心情侣外套·蓝 BALESCO", type: "top", price: 70 },
    ],
    spokes: ["matching"],
  },
  {
    slug: "bff-basics",
    name: "BFF Basics",
    nameZh: "闺蜜基础款",
    style: "casual",
    blurb:
      "Matching hearts tank with flared leggings, finished with the 3.0 BFF bracelet — best-friend kit for R$135 each.",
    blurbZh:
      "爱心背心配喇叭裤,再戴上 3.0 闺蜜手链 —— 每人 135 Robux 的闺蜜装。",
    items: [
      { id: 77642575267742, name: "Hearts Tank Top - Matching Flared Leggings", nameZh: "爱心背心配喇叭裤套装", type: "top", price: 65 },
      { id: 13188286842, name: "3.0 BFF Bracelet", nameZh: "3.0 闺蜜手链", type: "extra", price: 70 },
    ],
    spokes: ["matching"],
  },

  // ---- Cheap spoke (everything under R$100) ----
  {
    slug: "one-piece-glow",
    name: "One-Piece Glow Up",
    nameZh: "一件生效",
    style: "formal",
    blurb:
      "One R$60 suit over the free classic hair and face — the whole look costs less than a lunch, and looks intentional.",
    blurbZh:
      "一件 60 Robux 的西装,配免费经典发型和脸 —— 整套比一顿饭还便宜,但看起来是有想法的。",
    items: [
      { id: 15477073437, name: "Suit", nameZh: "西装", type: "top", price: 60 },
      PAL_HAIR,
      MAN_FACE,
    ],
    spokes: ["cheap"],
  },
  {
    slug: "campus-basics",
    name: "Campus Basics",
    nameZh: "校园基本款",
    style: "casual",
    blurb:
      "A single R$65 hoodie dropped on Roblox's free pants and sneakers — the cheapest street fit that doesn't look free.",
    blurbZh:
      "一件 65 Robux 的连帽卫衣,套上官方免费长裤和帆布鞋 —— 最便宜的街头风,但一点也不显得免费。",
    items: [
      { id: 17775630860, name: "Hoodie", nameZh: "连帽卫衣", type: "top", price: 65 },
      WETSUIT_PANTS,
      SNEAKERS_GRAY,
    ],
    spokes: ["cheap"],
  },
  {
    slug: "skirt-starter",
    name: "Skirt Starter",
    nameZh: "短裙入门",
    style: "soft",
    blurb:
      "Free knit sweater tucked into a R$60 skirt with the free gray sneakers — soft, simple, R$60 all in.",
    blurbZh:
      "免费针织毛衣塞进 60 Robux 的短裙,配免费灰帆布鞋 —— 温柔简单,全套 60 Robux。",
    items: [
      KNIT_SWEATER,
      { id: 17706000198, name: "Skirt", nameZh: "短裙", type: "bottom", price: 60 },
      SNEAKERS_GRAY,
    ],
    spokes: ["cheap"],
  },

  // ---- Y2K spoke ----
  {
    slug: "y2k-grunge",
    name: "Y2K Grunge",
    nameZh: "千禧格纹",
    style: "street",
    blurb:
      "Plaid knot top, baggy color-pop pants and sleek black hair — the 90s-revival fit, R$205 all in.",
    blurbZh:
      "格纹打结上衣配彩色宽松裤和黑色长发 —— 90 年代复兴风,全套 205 Robux。",
    items: [
      { id: 87451001207637, name: "Plaid Knot Top (Black)", nameZh: "格纹打结上衣·黑", type: "top", price: 65 },
      { id: 79083024233485, name: "Baggy Pants Couple color", nameZh: "彩色宽松长裤", type: "bottom", price: 75 },
      { id: 14794842263, name: "Witchy Vampire Hair - Black", nameZh: "女巫黑色长发", type: "hair", price: 65 },
    ],
    spokes: ["y2k"],
  },
  {
    slug: "y2k-sport",
    name: "Y2K Sport",
    nameZh: "千禧运动",
    style: "street",
    blurb:
      "Pink camo tank with flared leggings and chunky sneakers — sporty Y2K for R$135 plus free hair.",
    blurbZh:
      "粉色迷彩背心配喇叭裤和厚底板鞋 —— 运动系 Y2K,135 Robux 加免费发型。",
    items: [
      { id: 88188124413503, name: "Pink Camo Flare Leggings - Matching Tank Top", nameZh: "粉迷彩背心喇叭裤套装", type: "top", price: 75 },
      { id: 166188584127803, name: "Sneakers", nameZh: "厚底板鞋", type: "shoes", price: 60 },
      PAL_HAIR,
    ],
    spokes: ["y2k"],
  },
];

export function lookTotalRs(look: AvatarLook): number {
  return look.items.reduce((sum, item) => sum + item.price, 0);
}

export const catalogUrl = (id: number) => `https://www.roblox.com/catalog/${id}/`;

export function looksForSpoke(spoke: SpokeKey): AvatarLook[] {
  return AVATAR_LOOKS.filter((l) => l.spokes?.includes(spoke));
}
