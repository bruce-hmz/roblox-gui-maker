// Chinese (zh) prose for game UI kits. Slugs match kits.ts; getKitZh() overlays
// zh prose on the en Kit, keeping `theme` and each screen's `template` from en
// (only the display `role` is translated).

import { getKit, type Kit } from "./kits";

type KitZhProse = {
  name: string;
  tagline: string;
  description: string;
  // Same length/order as the English kit's screens — only the role label.
  screens: { role: string }[];
};

const KITS_ZH_PROSE: Record<string, KitZhProse> = {
  "simulator-kit": {
    name: "模拟器专业 UI Kit",
    tagline: "一套点击/模拟器游戏的五屏配套界面 —— 暖色日落主题",
    description:
      "一套完整的模拟器界面:主菜单、金币商店、Game Pass 商店、每日奖励日历和设置面板 —— 全部共用一个暖色主题,看起来像同一个游戏。",
    screens: [
      { role: "主菜单" },
      { role: "金币商店" },
      { role: "Game Pass 商店" },
      { role: "每日奖励" },
      { role: "设置" },
    ],
  },
  "quest-rpg-kit": {
    name: "任务 RPG UI Kit",
    tagline: "一套 RPG 的五屏配套界面 —— 冷色极地主题",
    description:
      "一套角色扮演界面:主菜单、背包网格、商店、排行榜和任务追踪 —— 统一在一个冷色主题下,可直接塞进冒险游戏。",
    screens: [
      { role: "主菜单" },
      { role: "背包" },
      { role: "商店" },
      { role: "排行榜" },
      { role: "任务追踪" },
    ],
  },
  "tycoon-kit": {
    name: "大亨帝国 UI Kit",
    tagline: "一套大亨游戏的五屏配套界面 —— 翡翠主题",
    description:
      "一套大亨经营界面:主菜单、VIP 与通行证商店、现金与滴管升级商店、兑换码面板和大亨排行榜 —— 统一在深翡翠主题下,看起来像同一个游戏。",
    screens: [
      { role: "主菜单" },
      { role: "VIP 与通行证商店" },
      { role: "现金与滴管升级" },
      { role: "兑换码" },
      { role: "大亨排行榜" },
    ],
  },
  "rng-aura-kit": {
    name: "RNG 光环抽取 UI Kit",
    tagline: "一套 RNG/光环抽取游戏的五屏配套界面 —— 皇室紫主题",
    description:
      "一套运气抽取界面:抽取主菜单、光环仓库、幸运与自动抽取通行证、连续签到奖励和稀有掉落横幅 —— 统一在皇室紫主题下,可直接塞进 RNG 游戏。",
    screens: [
      { role: "抽取主菜单" },
      { role: "光环仓库" },
      { role: "幸运与自动抽取通行证" },
      { role: "连续签到奖励" },
      { role: "稀有掉落横幅" },
    ],
  },
  "obby-shop-kit": {
    name: "跑酷闯关变现 UI Kit",
    tagline: "一套 Obby/跑酷游戏的五屏变现界面 —— 绯红主题",
    description:
      "一套跑酷变现界面:关卡主菜单、跳关与加速线圈通行证、游玩与每日礼包、增益兑换码和关卡 HUD 血条 —— 统一在绯红主题下,开箱即用。",
    screens: [
      { role: "关卡主菜单" },
      { role: "跳关与加速线圈通行证" },
      { role: "游玩与每日礼包" },
      { role: "增益兑换码" },
      { role: "关卡 HUD 血条" },
    ],
  },
  "tower-defense-kit": {
    name: "塔防指挥 UI Kit",
    tagline: "一套塔防游戏的五屏配套界面 —— Nexus 冷蓝主题",
    description:
      "一套塔防指挥界面:大厅主菜单、单位阵容、抽卡与宝箱商店、波次任务追踪和无尽波次排行榜 —— 统一在经典 Nexus 冷蓝主题下。",
    screens: [
      { role: "大厅主菜单" },
      { role: "单位阵容" },
      { role: "抽卡与宝箱商店" },
      { role: "波次任务" },
      { role: "无尽波次排行" },
    ],
  },
};

export function getKitZh(slug: string): Kit | undefined {
  const en = getKit(slug);
  const zh = KITS_ZH_PROSE[slug];
  if (!en || !zh) return undefined;
  return {
    ...en,
    name: zh.name,
    tagline: zh.tagline,
    description: zh.description,
    screens: en.screens.map((s, i) => ({ ...s, role: zh.screens[i]?.role ?? s.role })),
  };
}

// Display names for theme slugs (slugs are machine keys; this is presentation only).
export const THEME_ZH: Record<string, string> = {
  sunset: "日落",
  arctic: "极地",
  nexus: "Nexus",
  emerald: "翡翠",
  royal: "皇室紫",
  crimson: "绯红",
};
