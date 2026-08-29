// Per-spoke copy for the /avatar/<style> long-tail pages. Slugs are the
// canonical URL segment; each entry carries its target keyword's en+zh title,
// meta description, H1 intro and FAQ (mirrored into JSON-LD by the page).

import type { SpokeKey } from "./data";

export type SpokeCopy = {
  slug: SpokeKey;
  title: { en: string; zh: string };
  description: { en: string; zh: string };
  h1: { en: string; zh: string };
  intro: { en: string; zh: string };
  faq: { q: string; a: string; qZh: string; aZh: string }[];
};

export const SPOKES: SpokeCopy[] = [
  {
    slug: "preppy",
    title: {
      en: "Preppy Roblox Avatars — 5 Collared & Pastel Outfits with IDs",
      zh: "Preppy 风格 Roblox 形象搭配 —— 5 套学院风穿搭(真实 ID)",
    },
    description: {
      en: "Preppy Roblox avatar ideas with real catalog item IDs: collared shirts and ties, plaid skirts, pastel knits and polo outfits — most under R$200, one piece away from free.",
      zh: "Preppy 风格 Roblox 形象搭配灵感,每件都是真实商店 ID:带领衬衫领带、格纹短裙、粉彩针织 —— 大多不到 200 Robux。",
    },
    h1: {
      en: "Preppy Roblox Avatar Outfits",
      zh: "Preppy 学院风 Roblox 形象搭配",
    },
    intro: {
      en: "Preppy on Roblox means collars, ties, plaid and pastel knits — the campus look TikTok and Pinterest keep pinning. Each look below is built from real catalog items with their IDs shown, so you can copy, open the store page, and equip in minutes. Two of the five cost under R$130.",
      zh: "Roblox 上的 Preppy 意味着带领衫、领带、格纹和粉彩针织 —— TikTok 和 Pinterest 上最常被收藏的学院感。下面每套都由真实商店单品组成并标出 ID,复制、打开商店页、几分钟穿到身上。五套里有两套不到 130 Robux。",
    },
    faq: [
      {
        q: "What makes a Roblox avatar look preppy?",
        a: "Collared shirts (often with a tie), plaid or pleated skirts, knit sweaters and pastel or navy color palettes. Clean hair and minimal accessories do the rest.",
        qZh: "Roblox 形象怎么穿才有 preppy 感?",
        aZh: "带领衬衫(常配领带)、格纹或百褶短裙、针织毛衣,加上粉彩或藏青的配色。干净的发型和少量配饰就够了。",
      },
      {
        q: "How much does a preppy Roblox outfit cost?",
        a: "On this page, R$125–195. The single biggest saving is pairing one paid top with Roblox's official free pants and sneakers.",
        qZh: "一套 preppy 形象搭配要多少 Robux?",
        aZh: "本页在 125–195 Robux 之间。最大的省钱技巧是:一件付费上装,配官方免费的长裤和帆布鞋。",
      },
      {
        q: "Can boys wear these preppy outfits?",
        a: "Yes — Ivy Classic and Plaid Academy are built on collared shirts, ties and straight pants that work on any avatar body.",
        qZh: "男生能穿这些 preppy 搭配吗?",
        aZh: "能 —— 常春藤学院和格纹学园两套就是带领衬衫、领带加直筒裤的组合,任何体型都成立。",
      },
    ],
  },
  {
    slug: "matching",
    title: {
      en: "Matching Roblox Outfits — Couple & BFF Pairs with Item IDs",
      zh: "Roblox 情侣装/闺蜜装 —— 成对搭配与真实物品 ID",
    },
    description: {
      en: "Matching Roblox outfits for couples and best friends: heart sweaters, pink-and-blue couple jackets and BFF bracelet kits — every item is a real catalog ID you can copy and equip.",
      zh: "Roblox 情侣装和闺蜜装搭配:爱心毛衣、粉蓝情侣外套、闺蜜手链套装 —— 每件都是可复制 Equip 的真实商店 ID。",
    },
    h1: {
      en: "Matching Roblox Outfits for Couples & Best Friends",
      zh: "Roblox 情侣装 & 闺蜜装搭配",
    },
    intro: {
      en: "One for you, one for your duo. These matching looks use same-design-different-color items (or a shared bracelet) so both avatars read as a set — all real catalog IDs, R$135–140 per pair.",
      zh: "一人一件,成套出场。这些搭配用同款异色单品(或同一条闺蜜手链)让两个形象一眼成套 —— 全部真实商店 ID,每对 135–140 Robux。",
    },
    faq: [
      {
        q: "How do matching outfits work if we're on one account each?",
        a: "Each person buys their own piece — e.g. one takes the pink couple jacket, the other the blue. Both items are listed separately on this page so you can split the cost.",
        qZh: "我们各用各的账号,情侣装怎么买?",
        aZh: "各买各的那件 —— 比如一人粉情侣外套、一人蓝情侣外套。本页把两件都列出来了,可以分开买。",
      },
      {
        q: "Can these work for a trio instead of a pair?",
        a: "The BFF bracelet kit scales to any group size — everyone equips the same bracelet, and the tank top comes in other colors in the same catalog series.",
        qZh: "三个人能一起穿吗?",
        aZh: "闺蜜手链套装配多少人都行 —— 大家戴同一条手链,背心同系列还有别的配色可以在商店里找。",
      },
      {
        q: "Do matching items have to be the same item twice?",
        a: "No — same design in different colors (the heart sweaters, the BALESCO jackets) reads as a set while keeping each avatar distinct.",
        qZh: "情侣装必须是同一件买两次吗?",
        aZh: "不用 —— 同设计不同配色(爱心毛衣、BALESCO 外套)既成套又保留每个人的个性。",
      },
    ],
  },
  {
    slug: "cheap",
    title: {
      en: "Cheap Roblox Avatars — Free & Under-R$100 Outfits with IDs",
      zh: "便宜好看的 Roblox 形象搭配 —— 免费与百元内穿搭(真实 ID)",
    },
    description: {
      en: "Cheap Roblox avatar outfits that still look intentional: two entirely free looks and three under R$100 — every item a real catalog ID, no scams, no free-Robux nonsense.",
      zh: "便宜但好看的 Roblox 形象搭配:两套完全免费、三套不到 100 Robux —— 每件都是真实商店 ID。",
    },
    h1: {
      en: "Cheap Roblox Avatar Outfits (Free & Under R$100)",
      zh: "便宜好看的 Roblox 形象搭配(免费 & 百元内)",
    },
    intro: {
      en: "Looking expensive on Roblox isn't about spending Robux — it's about which free items you start from and where you put the one piece you do buy. Every look here totals under R$100, and two cost literally nothing.",
      zh: "在 Roblox 里穿得贵气,关键不是花多少 Robux,而是从哪些免费单品起步、把预算花在哪一件上。这里的搭配全套不到 100 Robux,有两套一分钱都不要。",
    },
    faq: [
      {
        q: "Are free Roblox avatar items safe?",
        a: "The free items on this page are Roblox's own official catalog items — equip them from roblox.com/my/avatar like any other. Never enter your password on a 'free Robux' site; there is no such thing.",
        qZh: "免费 Roblox 物品安全吗?",
        aZh: "本页的免费物品都是 Roblox 官方商店的商品,和其他物品一样在 roblox.com/my/avatar 里穿戴。别在任何“免费 Robux”网站输入密码 —— 那种东西不存在。",
      },
      {
        q: "What's the cheapest way to change my whole look?",
        a: "Keep the free base (hair, face, pants, sneakers) and buy exactly one paid top — R$60–70 transforms the outfit. That's the formula behind three looks on this page.",
        qZh: "最便宜的整体换装方法?",
        aZh: "保留免费基底(发型、脸、长裤、帆布鞋),只买一件付费上装 —— 60–70 Robux 就能换一套。本页三套都是这个公式。",
      },
      {
        q: "Why do some community items cost exactly R$60–75?",
        a: "That's the common price band for user-made clothing on the catalog. Prices can change; the item's catalog page always shows the current price.",
        qZh: "为什么社区服饰都恰好 60–75 Robux?",
        aZh: "这是商店里用户自制服饰的常见价位。价格会变,商品页永远显示当前价格。",
      },
    ],
  },
  {
    slug: "y2k",
    title: {
      en: "Y2K Roblox Avatar Outfits — Grunge, Sport & Cloud Fits with IDs",
      zh: "Y2K 风 Roblox 形象搭配 —— 格纹、运动与云朵穿搭(真实 ID)",
    },
    description: {
      en: "Y2K Roblox avatar outfits with real catalog item IDs: plaid knot tops, baggy pants, camo flare leggings and cloud ombre hair — full looks from R$135 to R$205.",
      zh: "Y2K 风 Roblox 形象搭配,每件都是真实商店 ID:格纹打结上衣、宽松长裤、迷彩喇叭裤、云朵渐变发 —— 全套 135–205 Robux。",
    },
    h1: {
      en: "Y2K Roblox Avatar Outfits",
      zh: "Y2K 风 Roblox 形象搭配",
    },
    intro: {
      en: "Low-rise silhouettes, plaid, camo and chunky sneakers — the 2000s never left Roblox. Three full Y2K looks below, each built from real catalog items with IDs ready to copy.",
      zh: "低腰轮廓、格纹、迷彩加厚底板鞋 —— 2000 年代从未离开 Roblox。下面三套完整 Y2K 搭配,全部真实商店 ID,复制即用。",
    },
    faq: [
      {
        q: "What items make a Roblox avatar look Y2K?",
        a: "Plaid knot tops, baggy or flare pants, camo prints, chunky sneakers and statement hair (ombre, clouds). One or two of these is enough — Y2K is a silhouette, not a costume.",
        qZh: "Roblox 形象怎么穿出 Y2K 感?",
        aZh: "格纹打结上衣、宽松或喇叭裤、迷彩、厚底板鞋,加挑染或云朵发型。有一两样就够了 —— Y2K 是轮廓感,不是戏服。",
      },
      {
        q: "How much does a Y2K Roblox outfit cost?",
        a: "On this page, R$135–205. The camo tank-and-leggings set is a two-in-one item, which is why Y2K Sport stays cheap.",
        qZh: "一套 Y2K 搭配要多少 Robux?",
        aZh: "本页 135–205 Robux。迷彩背心喇叭裤是一件两用的套装单品,所以千禧运动那套特别划算。",
      },
      {
        q: "Does Y2K work on free items alone?",
        a: "Partly — the free pants and sneakers cover the baggy-sneaker half, but the plaid or camo top is what sells the look, and those are community items around R$65–75.",
        qZh: "只用免费单品能穿出 Y2K 吗?",
        aZh: "一半能 —— 免费长裤帆布鞋解决了宽松+厚底那一半,但格纹或迷彩上装才是点睛的,那些是 65–75 Robux 的社区单品。",
      },
    ],
  },
];

export function getSpoke(slug: string): SpokeCopy | undefined {
  return SPOKES.find((s) => s.slug === slug);
}
