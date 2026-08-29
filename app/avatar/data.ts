// Curated Roblox avatar outfit looks for the /avatar ideas gallery (P0
// validation page for the "roblox avatar" keyword cluster). Every item ID was
// pulled live from the Roblox catalog search API (2026-08) — never guessed.
// Prices are `lowestPrice` at pull time and DO change; the page says so.
// Thumbnails render client-side through /api/roblox-thumbnail so CDN hash
// changes can't rot the page.

export type AvatarItem = {
  id: number;
  name: string;
  nameZh: string;
  type: "hair" | "face" | "head" | "top" | "bottom" | "shoes";
  /** lowestPrice in R$ at pull time; 0 = free */
  price: number;
};

export type AvatarStyle = "classic" | "casual" | "street" | "soft" | "formal";

export type AvatarLook = {
  slug: string;
  name: string;
  nameZh: string;
  style: AvatarStyle;
  blurb: string;
  blurbZh: string;
  items: AvatarItem[];
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
    items: [
      PAL_HAIR,
      MAN_FACE,
      ZIP_HOODIE,
      WETSUIT_PANTS,
      SNEAKERS_GRAY,
    ],
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
    items: [
      SILLY_FUN_HEAD,
      KNIT_SWEATER,
      WETSUIT_PANTS,
      SNEAKERS_GRAY,
    ],
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
];

export function lookTotalRs(look: AvatarLook): number {
  return look.items.reduce((sum, item) => sum + item.price, 0);
}

export const catalogUrl = (id: number) => `https://www.roblox.com/catalog/${id}/`;
