// Chinese (zh) display copy for templates. Slugs match app/editor/templates.ts
// exactly; the `scene` is shared from the English module (on-canvas sample
// text is demo content, translated in a later phase with the editor).
// Roblox API identifiers (UIGridLayout, RemoteEvent, ScreenGui, …) stay in
// English inside the Chinese prose, matching the existing zh homepage.

export type TemplateCategoryZh = "菜单" | "HUD" | "商店" | "设置";

export type TemplateZh = {
  slug: string;
  title: string;
  category: TemplateCategoryZh;
  tagline: string;
  description: string;
};

export const CATEGORIES_ZH: TemplateCategoryZh[] = ["菜单", "HUD", "商店", "设置"];

export const TEMPLATES_ZH: TemplateZh[] = [
  {
    slug: "main-menu",
    title: "Roblox 主菜单 GUI",
    category: "菜单",
    tagline: "标题界面:开始 / 设置 / 退出",
    description:
      "一个干净居中的主菜单:游戏标题、电蓝色的主“开始”按钮,以及次要操作按钮——用 UIListLayout 纵向堆叠,在任何屏幕尺寸上都保持整齐。",
  },
  {
    slug: "shop",
    title: "Roblox 商店 GUI",
    category: "商店",
    tagline: "带可滚动 UIGridLayout 的物品网格",
    description:
      "一个游戏商店面板:顶部标题加一个 ScrollingFrame,子元素通过 UIGridLayout 自动排成网格——放进多少物品都会自动平铺。",
  },
  {
    slug: "settings",
    title: "Roblox 设置 GUI",
    category: "设置",
    tagline: "用 UIListLayout 堆叠的开关行",
    description:
      "一个设置面板:每个选项是一行,左边标签、右边胶囊式开关,用 UIListLayout 纵向堆叠,内边距由 UIPadding 控制。",
  },
  {
    slug: "inventory",
    title: "Roblox 背包 GUI",
    category: "菜单",
    tagline: "物品 / 皮肤的格子网格",
    description:
      "一个固定 UIGridLayout 格子的背包——适合物品、皮肤或快捷栏。增删格子,网格自动重排。",
  },
  {
    slug: "loading-screen",
    title: "Roblox 加载界面 GUI",
    category: "菜单",
    tagline: "标题、进度条与轮播提示",
    description:
      "一个全屏加载界面:渐变背景、大标题、进度条(底框加动画填充)和一行提示。游戏加载时留下不错的第一印象。",
  },
  {
    slug: "leaderboard",
    title: "Roblox 排行榜 GUI",
    category: "HUD",
    tagline: "带分数高亮的排名行",
    description:
      "一个实时风格的排行榜:名次、名字、分数三列,首位高亮。行用 UIListLayout 堆叠,随玩家人数伸缩。",
  },
  {
    slug: "game-pass-shop",
    title: "Roblox Game Pass 商店 GUI",
    category: "商店",
    tagline: "带购买请求的高级通行证卡片",
    description:
      "一个精致的游戏通行证商店:三个可编辑档位加 RemoteEvent 购买请求。上线前把每个受信任的服务端处理器接到你的 Roblox Marketplace 购买流程上。",
  },
  {
    slug: "code-redeem",
    title: "Roblox 兑换码 GUI",
    category: "菜单",
    tagline: "兑换码输入、奖励示例与状态反馈",
    description:
      "一个聚焦的兑换码面板:可编辑输入框、反馈与奖励示例。在 Roblox Studio 里接好 TextBox 读取、校验、限流与发放奖励的逻辑。",
  },
  {
    slug: "daily-rewards",
    title: "Roblox 每日奖励 GUI",
    category: "菜单",
    tagline: "七日连签加服务端请求",
    description:
      "一个七日奖励日历:已领、当日、即将解锁三种状态加一个领取 RemoteEvent。在服务端校验时间、连签天数与重复领取。",
  },
  {
    slug: "quest-tracker",
    title: "Roblox 任务追踪 GUI",
    category: "HUD",
    tagline: "可展开的目标与进度 HUD",
    description:
      "一个紧凑的任务 HUD:可编辑目标、进度、奖励,以及可预览的详情开关。在你的游戏代码里接上实时任务数据与完成奖励。",
  },
  {
    slug: "health-bar",
    title: "Roblox 血条 GUI",
    category: "HUD",
    tagline: "血条、蓝条与经验条加金币计数",
    description:
      "一个玩家 HUD:绿色血条、蓝色蓝条和更细的经验条——每条都是胶囊底框加可由游戏状态驱动的填充——外加一个金币计数。放进 ScreenGui,在 Roblox Studio 脚本里更新填充比例即可。",
  },
  {
    slug: "notification-toast",
    title: "Roblox 通知 GUI",
    category: "HUD",
    tagline: "堆叠的彩色提示通知",
    description:
      "一组彩色提示通知——成功、信息、警告、错误——用 UIListLayout 堆叠,新通知会接到最后一条下面。每张卡片都可编辑;从服务端触发 RemoteEvent 即可推送实时通知。",
  },
  {
    slug: "chat",
    title: "Roblox 聊天 GUI",
    category: "HUD",
    tagline: "可滚动的消息记录加输入与发送",
    description:
      "一个自定义聊天面板:带彩色发送者名字的 ScrollingFrame 消息记录,外加 TextBox 和接到 RemoteEvent 的发送按钮。可用来替换默认 Roblox 聊天,或在 Studio 里加一个队伍频道。",
  },
];

export function getTemplateZh(slug: string): TemplateZh | undefined {
  return TEMPLATES_ZH.find((t) => t.slug === slug);
}
