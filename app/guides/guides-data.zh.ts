// Chinese (zh) prose for guides. Only the translated strings live here; the
// Luau `code` blocks are kept from the English Guide via getGuideZh() overlay
// (no code duplication). Slugs match guides-data.ts exactly. Roblox API
// identifiers (ScreenGui, UIGradient, UDim2, RemoteEvent, …) stay in English
// inside the Chinese prose, matching the existing zh homepage.

import { getGuide, type Guide } from "./guides-data";

type GuideZhSection = { heading: string; paragraphs?: string[]; tip?: string };

type GuideZhProse = {
  title: string;
  metaTitle?: string;
  description: string;
  category: string;
  customCta?: { href: string; label: string };
  intro: string;
  // Same length and order as the English guide's sections.
  sections: GuideZhSection[];
  faq: { q: string; a: string }[];
  relatedGuides?: { slug: string; title: string }[];
};

const GUIDES_ZH_PROSE: Record<string, GuideZhProse> = {
  "how-to-design-polished-roblox-ui": {
    title: "如何设计精致的 Roblox UI(渐变、描边与层次感)",
    description:
      "用多色 UIGradient、发光的 UIStroke 边框和层次感,做出有现代高级感的 Roblox UI —— 附可直接复制的 Luau。无需 Photoshop 或图片素材。",
    category: "设计",
    intro:
      "大多数 Roblox UI 看起来很扁平,因为 Frame、TextButton 和 TextLabel 默认就是纯色矩形。把一个上线游戏的界面和起步工程区分开的精致感,来自两个大家没充分使用的原生特性:UIGradient(多色渐变制造层次)和 UIStroke(半透明的彩色边缘,呈现为辉光)。本指南讲解这两者,附可直接粘进 Roblox Studio 的 Luau —— 而且这里的每一项技巧都内置在可视化编辑器里。",
    sections: [
      {
        heading: "1. 为什么原生 Roblox UI 看起来很扁(以及怎么修)",
        paragraphs: [
          "一个普通的 Frame 就是单一纯色。Frame 没有内置的光照或阴影,所以满屏 Frame 看起来像线框。解决办法不是改用图片 —— 而是叠加 Roblox 自带的装饰器:UICorner 做圆角、UIGradient 在表面做颜色渐变、UIStroke 做边框。叠在一起,一个扁平矩形就能看起来有凸起、有光感。",
        ],
      },
      {
        heading: "2. 用多色 UIGradient 制造层次",
        paragraphs: [
          "UIGradient 接受一个 ColorSequence,这意味着你不受限于两种颜色 —— 可以设任意多个关键点。同色系里一个较亮的高位 stop 渐变到一个较暗的低位 stop,会让面板看起来像从上方接光。Rotation 以度为单位(0 是从左到右,90 是从上到下)。",
        ],
        tip: "亮、暗两个 stop 的色相要接近(只调亮度)。15–20% 的亮度差看起来是层次感;差别再大就开始像横幅了。",
      },
      {
        heading: "3. 用 UIStroke 让边缘发光",
        paragraphs: [
          "UIStroke 能给任何 GUI 对象画边框。把它加粗、降低 Transparency、用强调色,就会呈现为元素周围一圈柔和辉光 —— 这是现代游戏商店和奖励界面的标志性观感。",
        ],
        tip: "描边颜色要和元素的用途对应:蓝色代表信息,金色代表高级/付费,绿色代表成功。整屏一致的强调色,才是“经过设计”的感觉。",
      },
      {
        heading: "4. 用渐变填充做有光泽的按钮",
        paragraphs: [
          "一个纯色按钮看起来像标签。给它一个从浅到深的双色渐变(都是它动作色的色阶),就会像一个能按下去的实体按钮。",
        ],
      },
      {
        heading: "5. 在编辑器里 vs 在 Studio 里",
        paragraphs: [
          "上面的每一项技巧都内置在可视化编辑器里。打开 game-pass-shop 模板就能看到已经应用好的渐变填充和强调色 UIStroke 辉光,然后实时调色并导出 Luau —— 导出的脚本里是真实的 Instance.new('UIGradient') 和 Instance.new('UIStroke') 调用及 ColorSequence 关键点,可直接粘进 StarterGui 下的 LocalScript。",
        ],
        tip: "原生渐变和描边能让你的 UI 保持可编辑、响应式、可脚本化。它们比不过带渲染 3D 角色的定制 Photoshop 美术 —— 那需要图片素材 —— 但对于干净、现代、有高级感的界面,它们是对的工具。",
      },
    ],
    faq: [
      {
        q: "UIGradient 能用超过两种颜色吗?",
        a: "可以。UIGradient.Color 是一个 ColorSequence,所以你可以加任意多个 ColorSequenceKeypoint stop,每个放在 0 到 1 之间的任意位置。",
      },
      {
        q: "怎么在 Roblox UI 上做辉光效果?",
        a: "加一个 UIStroke,设一个鲜艳的 Color,把 Thickness 调到 2 左右,Transparency 设在 0.5–0.7 左右。一根粗的、半透明的强调色描边就会呈现为辉光边缘。",
      },
      {
        q: "原生 Roblox UI 能做投影吗?",
        a: "Frame 无法原生模糊,所以真正的柔影需要一张模糊过的图片素材。你可以用一个偏移的、半透明的深色 Frame 衬在面板后面来近似阴影,或者依赖渐变层次加 UIStroke 边缘来代替。",
      },
    ],
    relatedGuides: [{ slug: "how-to-make-a-roblox-main-menu-gui", title: "如何制作 Roblox 主菜单 GUI" }],
  },

  "how-to-make-a-roblox-inventory-gui": {
    title: "如何制作 Roblox 背包 GUI",
    description:
      "一步步制作 Roblox 背包 GUI：使用 ScrollingFrame + UIGridLayout 自动排版格子、复用模板槽位、清空旧格不删布局组件，以及服务端校验的装备 RemoteEvent。",
    category: "HUD",
    intro:
      "背包 GUI 用来把玩家拥有的武器、工具、宠物或装扮展示成可点击装备的网格。在 Roblox Studio 里最稳妥的做法是：用 ScrollingFrame 配 UIGridLayout 自动排版，并按服务器同步的数据克隆一套隐藏模板格子。下面提供完整的层级搭建、防误删子元素技巧与装备验证流程。",
    sections: [
      {
        heading: "1. 搭建 ScreenGui 与 ScrollingFrame + UIGridLayout",
        paragraphs: [
          "把背包 ScreenGui 放在 StarterGui 下，并将 ResetOnSpawn 设为 false，防止玩家重生后丢掉开关状态或脚本引用。在主面板内部放入 ScrollingFrame，将 AutomaticCanvasSize 设为 Enum.AutomaticSize.Y、CanvasSize 设为 UDim2.new(0, 0, 0, 0)，滚动条就能随物品增加自动伸长。",
          "在 ScrollingFrame 内放入 UIGridLayout。如果希望格子在手机与电脑屏幕上都保持正方形，可以配合 Scale 宽度或给模板格子加上 UIAspectRatioConstraint，避免窄屏横向溢出。",
        ],
      },
      {
        heading: "2. 制作一个可复用的模板格子（Button + UIStroke）",
        paragraphs: [
          "不要在循环里手写几十行 Instance.new 来拼格子。提前做好一个样式完整的模板格子（包含圆角 UICorner、图标 ImageLabel、右下角数量标签与初始 Transparency = 1 的 UIStroke），存放在 LocalScript 下随时克隆。",
          "把格子根节点设为 ImageButton 或 TextButton（Text 留空），这样鼠标、触屏和手柄都能稳定触发 Activated 事件。",
        ],
        tip: "把克隆出的格子命名为 Slot_<itemId>，并用 LayoutOrder 控制稀有度或获得顺序，UIGridLayout 会自动按序排列。",
      },
      {
        heading: "3. 填充玩家数据，并在刷新时保留布局组件",
        paragraphs: [
          "每次服务端发来新背包列表或玩家切换分类标签（例如 武器 / 宠物 / 消耗品）时，必须先清理旧格子，但绝不能用 ClearAllChildren() 把 UIGridLayout 和 UIPadding 一起删掉。循环遍历时判断 child:IsA(\"GuiObject\") 再 Destroy 即可。",
        ],
      },
      {
        heading: "4. 在服务端校验装备与使用请求",
        paragraphs: [
          "客户端 GUI 只负责展示列表并发出装备意图。ServerScriptService 中的 Script 必须在发 Tool 或加属性前，核对服务端缓存或 DataStore 里该玩家确实拥有对应 itemId。",
        ],
        tip: "记得开启 ScrollingFrame.ClipsDescendants = true，这样滚动出上下边界的格子会被面板边缘干净裁切。",
      },
    ],
    faq: [
      {
        q: "运行时怎么安全地增删背包物品？",
        a: "新增时克隆模板格子并设好 Parent 到 ScrollingFrame；移除时对目标格子调用 Destroy()。UIGridLayout 会自动重排剩余格子的位置。",
      },
      {
        q: "为什么清空背包重绘之后，UIGridLayout 布局全乱了？",
        a: "因为直接调用了 scroll:ClearAllChildren()，把 UIGridLayout 和 UIPadding 也一起删掉了。务必改为遍历 scroll:GetChildren() 并只销毁 child:IsA(\"GuiObject\")。",
      },
      {
        q: "怎么高亮显示当前已装备的格子？",
        a: "给模板格子预先挂一个 Transparency = 1 的 UIStroke。当玩家点击或服务端确认装备某格时，清除上一格的高亮并把当前格的 UIStroke.Transparency 设为 0。",
      },
      {
        q: "怎么做武器、宠物等分类过滤标签？",
        a: "在 populateInventory 函数里传入当前分类，克隆前过滤掉不匹配的 item.category，或者直接把不匹配格子的 Visible 设为 false——UIGridLayout 会自动跳过不可见格子。",
      },
    ],
    relatedGuides: [
      { slug: "how-to-use-uilistlayout-in-roblox", title: "如何在 Roblox 里使用 UIListLayout" },
      { slug: "how-to-make-a-responsive-roblox-gui", title: "如何制作响应式的 Roblox GUI" },
      { slug: "how-to-open-a-gui-with-a-key-in-roblox", title: "如何用按键打开 Roblox GUI" },
    ],
  },

  "how-to-make-a-roblox-code-redeem-gui": {
    title: "如何制作 Roblox 兑换码 GUI",
    description:
      "制作一个防作弊的 Roblox 兑换码/创作者码 GUI：TextBox 输入、ClearTextOnFocus 防误清空、RemoteFunction 服务端校验、有效期与 DataStore 防重复领取。",
    category: "菜单",
    intro:
      "兑换码界面让玩家输入活动码或创作者支持码领取金币或道具。客户端只需要一个 TextBox、一个按钮和状态文本，但防刷机制、有效码表与重复领取记录必须完全放在服务端。本指南提供客户端与服务端完整实现思路与常见踩坑解答。",
    sections: [
      {
        heading: "1. 搭建 TextBox 输入框、兑换按钮与状态提示",
        paragraphs: [
          "在 StarterGui 的面板里放入 TextBox（建议关闭 ClearTextOnFocus = false，方便玩家改错字而不用重输一遍）、REDEEM 按钮，以及下方的状态 TextLabel 用来展示“领取成功”或“兑换码无效/已领取”。",
        ],
      },
      {
        heading: "2. 在服务端校验兑换码与过期时间",
        paragraphs: [
          "把所有有效兑换码放在 ServerScriptService 的 Script 中，外挂永远无法从客户端内存窥探列表。收到请求后先做 typeof 校验和频控冷却，再用 string.upper 与去掉空白字符规范化输入，并核对可选的 os.time() 过期时间戳。",
        ],
        tip: "务必加入按玩家冷却时间（如 1.5 秒）并在 Players.PlayerRemoving 时清理冷却记录，防止暴力刷包和内存泄漏。",
      },
      {
        heading: "3. 把已兑换记录写入玩家 DataStore",
        paragraphs: [
          "如果只用服务端局部表记录已领状态，玩家换服后又可以再领一次。把已兑换的码表（例如 RedeemedCodes[code] = true）存进玩家 DataStore 存档，并在异步保存前先标记状态，杜绝并发双击刷奖励。",
        ],
      },
      {
        heading: "4. 优化提示反馈与移动端输入体验",
        paragraphs: [
          "用绿色文字反馈成功、红色文字提示错误，仅在成功时清空 TextBox，并避免把输入框放得太靠屏幕底端，以免手机系统弹出软键盘时遮挡按钮。",
        ],
      },
    ],
    faq: [
      {
        q: "兑换码 GUI 用 RemoteEvent 还是 RemoteFunction 更好？",
        a: "两者都可以，但 RemoteFunction 能直接返回 (ok, message) 给客户端更新状态文本，一次往返就能完成反馈；配合客户端防抖与服务端限流即可安全使用。",
      },
      {
        q: "怎么防止同一玩家重复使用同一个兑换码？",
        a: "在每个玩家的 DataStore 存档表里保存 RedeemedCodes[code] = true 字典。服务端发奖前先检查该键是否存在。",
      },
      {
        q: "作弊者能在客户端逆向出我的有效兑换码吗？",
        a: "不能，前提是 CODES 表只存在于 ServerScriptService 或 ServerStorage 中。Roblox 不会把服务端脚本和容器内容复制到客户端。",
      },
      {
        q: "为什么玩家手机输入法带了个末尾空格就提示无效？",
        a: "移动端输入法经常在自动补全后多塞一个空格。服务端先执行 string.upper((string.gsub(rawInput, \"%s+\", \"\"))) 即可自动兼容大小写与误触空格。",
      },
    ],
    relatedGuides: [
      { slug: "how-to-make-a-roblox-shop-gui", title: "如何制作 Roblox 商店 GUI" },
      { slug: "how-to-make-a-roblox-daily-rewards-gui", title: "如何制作 Roblox 每日奖励 GUI" },
      { slug: "how-to-script-a-roblox-gui", title: "如何给 Roblox GUI 写脚本(点击、开关与缓动)" },
    ],
  },

  "how-to-make-a-roblox-daily-rewards-gui": {
    title: "如何制作 Roblox 每日奖励 GUI",
    description:
      "搭建 7 天 Roblox 每日登录签到奖励 GUI：已领/当日可领/未解锁三态卡片、服务端 UTC 日历时间判断、DataStore 连续天数保存与断签处理。",
    category: "菜单",
    intro:
      "7 天每日奖励系统是提升次日留存最常用的 UI 模块之一。前台只需用 7 张状态卡片区分已领、今天可领与未解锁，真正关键的是后端用服务端 os.time() 与 DataStore 验证日期并记录连签，彻底杜绝玩家改系统时间刷奖励。",
    sections: [
      {
        heading: "1. 排版 7 天网格与三种卡片视觉状态",
        paragraphs: [
          "用 Day1 到 Day7 七个 Frame 搭配支持自动换行的 UIListLayout 或 UIGridLayout，这样宽屏能横排、手机窄屏也能优雅折行。分别给“已领取”（暗色对勾）、“今日可领”（电蓝色边框高亮）和“未解锁”（灰暗锁定）设计清晰辨识度。",
        ],
      },
      {
        heading: "2. 用服务端时间检验资格并推进连签",
        paragraphs: [
          "千万不要在 LocalScript 里判断日期，客户端设备时钟可被玩家随意修改。服务端通过 math.floor(os.time() / 86400) 计算 UTC 天序号：与上次领取日相同则拒绝，正好大 1 则连签加一，跨天断档则重置回第 1 天。",
        ],
        tip: "用 UTC 日索引（os.time() / 86400 取整）比严格等满 24 小时对玩家更友好：玩家昨天晚上 9 点签到、今天晚上 7 点上线也能顺利领到第二天奖励。",
      },
      {
        heading: "3. 根据服务端同步结果刷新日历高亮",
        paragraphs: [
          "玩家进服和领奖成功后，服务端通过 SyncDailyRewards 发送最新 { streak, canClaim }。客户端再按真实状态重绘 7 张卡片的颜色与领取按钮状态，让 UI 与服务端完全同步。",
        ],
      },
      {
        heading: "4. 在主 HUD 图标上加未领取红点提醒",
        paragraphs: [
          "成熟的游戏通常不在加载完成时粗暴弹窗挡路，而是在 state.canClaim 为 true 时于侧边 HUD 按钮亮起红点角标，引导玩家主动打开领取。",
        ],
      },
    ],
    faq: [
      {
        q: "每日签到按满 24 小时判断，还是按自然日判断好？",
        a: "按 UTC 自然日索引（math.floor(os.time() / 86400)）体验最好，避免玩家每天上线时间稍微提前一两小时却被卡住不能签。",
      },
      {
        q: "连续签到天数跨服怎么保存？",
        a: "把 lastDayIndex 和 streak 存入按玩家 UserId 索引的 DataStore 数据表，进服读取并在每次领奖及离服时用 UpdateAsync 写入。",
      },
      {
        q: "领完第 7 天之后第 8 天怎么办？",
        a: "使用 (profile.streak % 7) + 1 就能在第 8 天平滑循环回第 1 天，老玩家也能持续每天上线领奖。",
      },
      {
        q: "玩家修改 Windows 或手机日期能提前领奖励吗？",
        a: "不能，只要所有判断都在 ServerScriptService 中使用 os.time() 读取 Roblox 服务端时间即可。",
      },
    ],
    relatedGuides: [
      { slug: "how-to-make-a-roblox-code-redeem-gui", title: "如何制作 Roblox 兑换码 GUI" },
      { slug: "how-to-make-a-roblox-shop-gui", title: "如何制作 Roblox 商店 GUI" },
      { slug: "how-to-animate-roblox-guis-with-tweenservice", title: "如何用 TweenService 给 Roblox GUI 加动画" },
    ],
  },

  "how-to-make-a-roblox-quest-tracker-gui": {
    title: "如何制作 Roblox 任务追踪 HUD",
    description:
      "打造紧凑的 Roblox 角落任务追踪 HUD：避开顶部系统栏锚定、双层进度条 TweenService 平滑补间、手机折叠开关，以及服务端事件驱动更新。",
    category: "HUD",
    intro:
      "任务追踪器是在玩家探索地图时常驻角落的微型面板，用来提示当前目标和完成度。做好它有三个关键：用安全锚点和 UISizeConstraint 控制体积不挡视野、用双层裁切 Frame 配 TweenService 推进进度条，以及给移动端准备一键折叠按钮。",
    sections: [
      {
        heading: "1. 锚定角落位置并避开 Roblox 系统按钮",
        paragraphs: [
          "把面板锚定在右上或中左侧边缘（例如 AnchorPoint = 1, 0、Y Scale 在 0.14 左右），避免撞上右上角核心栏或左上角聊天与菜单按钮。加上 UISizeConstraint 限制最小/最大像素范围，防止超宽屏拉伸变形或手机遮半屏。",
        ],
      },
      {
        heading: "2. 用轨道 + 填充双层 Frame 做平滑进度条",
        paragraphs: [
          "进度条由底层 Track Frame 和子级 Fill Frame 组成。给 Track 打开 ClipsDescendants = true 保证低百分比时圆角不被顶破，进度变动时用 TweenService 把 Fill.Size.X.Scale 插值到 math.clamp(current / goal, 0, 1)。",
        ],
        tip: "任务标题尽量控制在 8–12 个字以内（例如“收集 10 个星辰碎片”），小字号在手机竖屏或横屏上才不会换行挤压布局。",
      },
      {
        heading: "3. 给小屏幕加一个折叠/展开按钮",
        paragraphs: [
          "手机玩家屏幕空间寸土寸金，在面板标题栏放一个“− / +”小按钮，点击后切换主体内容 Visible 并缓动高度，既可随时查看目标，也不挡战斗视野。",
        ],
      },
      {
        heading: "4. 由服务端事件稳定驱动进度",
        paragraphs: [
          "击杀或收集计数统一在服务端统计，变化时再触发 QuestUpdated:FireClient(player, data)。客户端只负责渲染文字、条长度和完成高亮动画，不参与判定。",
        ],
      },
    ],
    faq: [
      {
        q: "怎么让任务进度条平滑推进而不是一跳一跳？",
        a: "把比例算成 math.clamp(current / goal, 0, 1)，然后用 TweenService:Create 在 0.25–0.35 秒内把 Fill.Size 过渡到 UDim2.fromScale(ratio, 1)。",
      },
      {
        q: "任务 HUD 放在哪里才不会跟 Roblox 官方按钮重叠？",
        a: "避开最左上角（菜单、聊天）和最右上角核心图标区。要么将 Y 起点设在 0.12–0.16 之间，要么在 ScreenGui 上保持 IgnoreGuiInset = false。",
      },
      {
        q: "如果要同时追踪 2–3 个活跃任务怎么改？",
        a: "把外层 TrackerPanel 改成竖向 UIListLayout 容器，将单个任务卡片抽成模板，按活跃任务表克隆多张即可。",
      },
      {
        q: "为什么进度条很短的时候圆角会露出来变方？",
        a: "给外层 Track 开启 ClipsDescendants = true，或者同时给 Track 与 Fill 都挂上相同 CornerRadius 的 UICorner。",
      },
    ],
    relatedGuides: [
      { slug: "how-to-animate-roblox-guis-with-tweenservice", title: "如何用 TweenService 给 Roblox GUI 加动画" },
      { slug: "how-to-make-a-responsive-roblox-gui", title: "如何制作响应式的 Roblox GUI" },
    ],
  },

  "how-to-make-a-roblox-main-menu-gui": {
    title: "如何制作 Roblox 主菜单 GUI",
    description:
      "零基础分步制作 Roblox 主菜单 GUI：ScreenGui 防重生复位设置、AnchorPoint 居中面板、UIListLayout 自动排按钮、BlurEffect 模糊背景与 .Activated 跨设备点击。",
    category: "菜单",
    intro:
      "主菜单决定了玩家进服前几秒的第一印象。菜单偏移、重生后反复弹出、手机按不到按钮，大多源自漏设了几个关键属性。本指南一步步带你配置 ScreenGui、居中响应式容器、UIListLayout 按钮栈，并用 .Activated 和 BlurEffect 做出丝滑开局切换。",
    sections: [
      {
        heading: "1. 正确配置 ScreenGui 容器属性",
        paragraphs: [
          "在 StarterGui 下新建 ScreenGui 并命名为 MainMenu。把 ResetOnSpawn 设为 false，防止角色死亡重生时主菜单重新弹出来；若要让暗色遮罩铺满全屏不留顶部黑边，同时将 IgnoreGuiInset 设为 true。",
        ],
      },
      {
        heading: "2. 用 AnchorPoint 居中面板并限制尺寸上下限",
        paragraphs: [
          "把 AnchorPoint = Vector2.new(0.5, 0.5) 和 Position = UDim2.fromScale(0.5, 0.5) 配合使用，面板才会严格按中心点居中。再加一层 UISizeConstraint 和 UIPadding，在带鱼屏上不会铺得过宽，在手机上也不会小得看不清。",
        ],
      },
      {
        heading: "3. 用 UIListLayout 与 LayoutOrder 自动堆叠按钮",
        paragraphs: [
          "在面板里放一个 UIListLayout 并设 SortOrder = Enum.SortOrder.LayoutOrder。给标题、Play、Shop、Settings 分别设好 LayoutOrder = 1, 2, 3, 4，以后随时加“更新日志”按钮都不用重新算 Y 坐标。",
        ],
      },
      {
        heading: "4. 用 .Activated 绑定 Play 与摄像头/模糊切换",
        paragraphs: [
          "按钮点击尽量使用 Activated 而非 MouseButton1Click，它在鼠标点击、手机触控和手柄确认键下都能稳定触发。玩家点 Play 后关闭 Lighting 里的 BlurEffect、隐藏菜单并打开游戏内 HUD。",
        ],
        tip: "如果游戏内设置了“返回主菜单”或暂停设置入口，请用 gui.Enabled = false 隐藏菜单，不要直接 gui:Destroy()。",
      },
    ],
    faq: [
      {
        q: "怎么让主菜单在电脑、平板和手机上永远严格居中？",
        a: "把 AnchorPoint 设为 Vector2.new(0.5, 0.5)、Position 设为 UDim2.fromScale(0.5, 0.5)，并用 Scale 配 UISizeConstraint 控制宽高比例。",
      },
      {
        q: "为什么玩家每次角色死亡重生后主菜单又弹出来了？",
        a: "因为 ScreenGui 的 ResetOnSpawn 默认是 true，重生时 Roblox 会重新从 StarterGui 克隆一份。将其设为 false 即可解决。",
      },
      {
        q: "按钮事件应该绑 Activated 还是 MouseButton1Click？",
        a: "推荐优先绑 Activated，它原生兼容 PC 鼠标、移动端触摸以及主机手柄选择确认。",
      },
      {
        q: "怎么在主菜单后面固定相机俯瞰大厅场景？",
        a: "在 LocalScript 中把 workspace.CurrentCamera.CameraType 设为 Enum.CameraType.Scriptable，赋值为地图内预放镜头 Part 的 CFrame；点 Play 时切回 Enum.CameraType.Custom。",
      },
    ],
    relatedGuides: [
      { slug: "how-to-open-a-gui-with-a-key-in-roblox", title: "如何用按键打开 Roblox GUI" },
      { slug: "how-to-script-a-roblox-gui", title: "如何给 Roblox GUI 写脚本(点击、开关与缓动)" },
      { slug: "how-to-use-uilistlayout-in-roblox", title: "如何在 Roblox 里使用 UIListLayout" },
      { slug: "how-to-import-rbxmx-into-roblox-studio", title: "如何把 .rbxmx GUI 模型文件导入 Roblox Studio" },
    ],
  },

  "how-to-make-a-roblox-shop-gui": {
    title: "如何制作 Roblox 商店 GUI",
    description:
      "制作安全可上线的 Roblox 道具商店 GUI：ScrollingFrame + UIGridLayout 自动货架网格、ModuleScript 商品配置表，以及服务端扣币校验的 RemoteEvent 完整流程。",
    category: "商店",
    intro:
      "一个能直接上架使用的商店 GUI 必须把“展示”与“交易校验”彻底分开：前端用 ScrollingFrame 配 UIGridLayout 让再多商品都能自动排列，前后端共用一份 ModuleScript 目录，而扣金币和发道具全部交由服务端 Script 核对，避免作弊者绕过客户端。",
    sections: [
      {
        heading: "1. 搭建商店外框、关闭按钮与 ScrollingFrame 网格",
        paragraphs: [
          "在 StarterGui > ShopGui 下放一个居中面板，顶部放置标题和关闭按钮，正文区域放满 ScrollingFrame。开启 AutomaticCanvasSize = Enum.AutomaticSize.Y 并配合 ClipsDescendants = true，再在内部放入 UIGridLayout 与 UIPadding。",
        ],
      },
      {
        heading: "2. 用一份共享的 ModuleScript 管理商品目录",
        paragraphs: [
          "把商品 ID、名称、价格和图标 rbxassetid 写在 ReplicatedStorage 的 ShopCatalog ModuleScript 里，让客户端生成卡片、服务端核价时读同一份配置，加新商品时只改一处。",
        ],
      },
      {
        heading: "3. 用 RemoteEvent 提交购买并由服务端扣款校验",
        paragraphs: [
          "客户端点击购买按钮时只能上传 itemId 字符串，绝对不能把价格传给服务端。ServerScriptService 里的 Script 按 itemId 查表拿真实价格，核对玩家金币余额并扣除后再发放道具。",
        ],
        tip: "如果要售卖 Robux 游戏通行证（Game Pass），请使用 MarketplaceService:PromptGamePassPurchase 而非自建金币 RemoteEvent。",
      },
      {
        heading: "4. 用 Enabled 开关商店以保留图片缓存与滚动位置",
        paragraphs: [
          "关闭商店时直接把 ShopGui.Enabled 设为 false 而不是销毁重建，下次打开无需重新加载图标和创建实例，响应更干脆。",
        ],
      },
    ],
    faq: [
      {
        q: "怎么让商店随着商品增多平滑自动延伸滚动区域？",
        a: "在 ScrollingFrame 上设 AutomaticCanvasSize = Enum.AutomaticSize.Y 且 CanvasSize = UDim2.new(0, 0, 0, 0)，并加上 UIPadding 避免卡片贴边。",
      },
      {
        q: "商品卡片怎样自动按网格行列对齐？",
        a: "把 UIGridLayout 挂进 ScrollingFrame，设置好 CellSize 和 CellPadding，子级每个商品卡片就会自动从左到右折行排布。",
      },
      {
        q: "为什么不能在客户端判断钱够不够再发 RemoteEvent 给服务器发道具？",
        a: "作弊者可以直接伪造任何 RemoteEvent 参数调用。客户端只传 itemId，金币扣除与权限检查必须由服务端独立完成。",
      },
      {
        q: "游戏币商店和 Game Pass（通行证）商店有什么区别？",
        a: "游戏币商店使用你自己的 RemoteEvent 和服务端金币数值；Game Pass 商店需要调用 Roblox 的 MarketplaceService:PromptGamePassPurchase 来走 Robux 购买弹窗。",
      },
    ],
    relatedGuides: [
      { slug: "how-to-make-a-roblox-gamepass-shop-gui", title: "如何制作 Roblox 游戏通行证（Game Pass）商店 GUI" },
      { slug: "how-to-script-a-roblox-gui", title: "如何给 Roblox GUI 写脚本(点击、开关与缓动)" },
      { slug: "how-to-make-a-roblox-inventory-gui", title: "如何制作 Roblox 背包 GUI" },
    ],
  },

  "how-to-make-a-roblox-loading-screen-gui": {
    title: "如何制作 Roblox 加载界面 GUI",
    description:
      "制作真正的 Roblox 自定义加载界面：放在 ReplicatedFirst 替换默认加载屏、用 ContentProvider:PreloadAsync 驱动实时进度条、渐隐淡出并 Destroy 释放拦截。",
    category: "菜单",
    intro:
      "好的加载界面应当在玩家进服第一刻立刻覆盖视口，反映真实资源预加载进度而不是干等假倒计时，并在就绪后平滑淡出并销毁。关键技巧是把脚本和 LoadingScreen 放进 ReplicatedFirst，并用 ContentProvider:PreloadAsync 驱动进度条。",
    sections: [
      {
        heading: "1. 把加载脚本放进 ReplicatedFirst 抢先显示",
        paragraphs: [
          "StarterGui 的脚本会等默认内容复制后才执行，导致原版加载画面一闪而过。把 LoadingScreen 和 LocalScript 放进 ReplicatedFirst，在第一行调用 ReplicatedFirst:RemoveDefaultLoadingScreen() 并克隆进 PlayerGui。",
          "把 IgnoreGuiInset 设为 true、DisplayOrder 设为 100，确保全屏底图完全盖住顶部状态栏并覆盖所有其他界面。",
        ],
      },
      {
        heading: "2. 制作胶囊进度条与轮播提示语",
        paragraphs: [
          "外层轨道 Track 与内层填充 Fill 都用圆角（CornerRadius = UDim.new(1, 0)），开启轨道 ClipsDescendants。配合一条每 2.5 秒轮换的玩法小提示，加载过程不枯燥。",
        ],
      },
      {
        heading: "3. 用 ContentProvider:PreloadAsync 驱动真实进度",
        paragraphs: [
          "把关键 UI 贴图、大厅模型和音效放进列表，逐批或分步交给 ContentProvider:PreloadAsync，每完成一项就用 TweenService 把 Fill 比例丝滑推进到对应百分比。",
        ],
        tip: "优先预加载 UI 图片、主大厅和必听音效即可，不要把整张大地图所有细节全塞进阻塞队列，以免低配手机玩家卡在加载页太久。",
      },
      {
        heading: "4. 渐隐淡出并 Destroy 彻底清除遮罩",
        paragraphs: [
          "先检查 game:IsLoaded() 保证核心场景就绪，再用 CanvasGroup 的 GroupTransparency 淡出到 1。动画结束后必须调用 loadingGui:Destroy()，防止透明全屏 Frame 挡住后续主菜单点击。",
        ],
      },
    ],
    faq: [
      {
        q: "怎么让加载界面完全盖住 Roblox 顶部状态栏？",
        a: "把 ScreenGui.IgnoreGuiInset 设为 true，并把背景 Frame 的 Size 设为 UDim2.fromScale(1, 1)。",
      },
      {
        q: "为什么进服时还会闪一下 Roblox 默认黑色加载界面？",
        a: "把 LoadingScreen 和 LocalScript 移到 ReplicatedFirst，并在脚本第一行就调用 ReplicatedFirst:RemoveDefaultLoadingScreen()。",
      },
      {
        q: "加载界面需要加“跳过”按钮吗？",
        a: "建议加上：一旦 game:IsLoaded() 为 true 且关键 UI 加载完就显示 Skip 按钮，回访玩家会非常喜欢这个细节。",
      },
      {
        q: "为什么加载界面淡出变透明之后，后面的开始按钮点不动？",
        a: "只把透明度改成 1 而没 Destroy() 或关掉 Enabled 时，全屏透明 Frame 仍可能拦截输入。淡出完成后务必调用 loadingGui:Destroy()。",
      },
    ],
    relatedGuides: [
      { slug: "how-to-make-a-roblox-main-menu-gui", title: "如何制作 Roblox 主菜单 GUI" },
      { slug: "how-to-animate-roblox-guis-with-tweenservice", title: "如何用 TweenService 给 Roblox GUI 加动画" },
      { slug: "roblox-gui-script-generator", title: "Roblox GUI 脚本生成器" },
    ],
  },

  "how-to-use-uilistlayout-in-roblox": {
    title: "如何在 Roblox 里使用 UIListLayout",
    metaTitle: "Roblox UIListLayout 用法:LayoutOrder、AbsoluteContentSize、Position",
    description:
      "一份完整的 Roblox UIListLayout 指南:Padding 与对齐、LayoutOrder 排序、AbsoluteContentSize 自动撑高、Position 覆盖 —— 全部附可直接复制的 Luau。",
    category: "布局",
    intro:
      "UIListLayout 是 Roblox 里自动把一个 Frame 的子元素排成纵向列表或横向一行的布局对象。你不用手动给每个按钮定位,只要往容器里放一个 UIListLayout,子元素就自己排好 —— 增删、调序,排列即时更新。本指南讲清楚每个重要属性,然后是接下来最容易踩坑的三件事:用 LayoutOrder 控制顺序、用 AbsoluteContentSize 让容器随内容撑高、以及当布局忽略子元素 Position 时位置覆盖怎么做。全程附 Luau 示例,最后是一个可直接粘进 Studio 的完整设置菜单。",
    sections: [
      {
        heading: "1. UIListLayout 是做什么的",
        paragraphs: [
          "UIListLayout 是布局对象,不是可见元素:它自己没有尺寸和颜色。把它挂到任意容器 —— Frame、ScrollingFrame、面板 —— 从这一刻起容器的子元素就自动排好。子元素保留自己的 Size,布局只接管它们的 Position,按排序把它们从上到下(或从左到右)堆叠。新子元素挂上的瞬间就入列,所以你可以用循环批量生成行,全程不碰 Position。",
          "要记住的唯一规则:一个容器一个布局,而且布局必须是它所控制容器的子级。与布局同级的 Frame、按钮、标签会被排列;这些 Frame 里面的元素不会 —— 布局只控制直接同级元素。",
          "那为什么不用手动定位?因为手搭的列表是个维护陷阱:每个 Position 都是一个数字,插一行、改一个高度、适配手机,全都要重算。一个 UIListLayout 就是一个替你永远算这笔账的对象 —— 这也是为什么几乎所有上线 Roblox 游戏的菜单、商店、排行榜面板都在用它。",
        ],
      },
      {
        heading: "2. 方向、间距和对齐",
        paragraphs: [
          "三个属性决定排列形态。FillDirection 选轴:Enum.FillDirection.Vertical 从上到下堆叠,Horizontal 从左到右。Padding 是一个 UDim,其 Offset 部分设子元素之间的像素间距 —— UDim.new(0, 12) 表示每个元素之间留 12 像素。HorizontalAlignment 和 VerticalAlignment 决定整组排列在容器里的位置,纵向列表可以居中、靠左或靠右,不用动任何子元素。",
          "对齐作用于整组排列,不作用于单个子元素。想让一组按钮居中、另一组靠左,就是两个容器各带各的布局 —— 各自设置对齐。",
        ],
        tip: "把 UIListLayout 和同一容器上的 UIPadding 搭配,让整组排列离面板边缘留白 —— 这份间距作用于整组,而不是每个子元素。",
      },
      {
        heading: "3. 用 LayoutOrder 控制顺序",
        paragraphs: [
          "默认情况下 UIListLayout 按 LayoutOrder 排序子元素,同名次再按 Name 决胜 —— 这就是为什么改个元素名字菜单顺序会变。稳妥的写法是把 SortOrder 显式设为 Enum.SortOrder.LayoutOrder,并给每个子元素明确的 LayoutOrder 数字。数字小的在前,允许负数,序列有空洞也没关系 —— 行编号用 10、20、30,之后想插一行用 15 就行,不用重新编号。",
          "SortOrder.Name 是另一个选项:子元素按 Name 属性的字母序排。对名字本身已编码顺序的生成式列表方便,但 LayoutOrder 不怕改名,在代码里读起来也更像刻意为之。",
        ],
        tip: "如果在 Studio 里改了个元素名字列表就重排,多半是 LayoutOrder 同名次被 Name 决胜(或 SortOrder.Name)—— 给每个子元素唯一的 LayoutOrder 就好。",
      },
      {
        heading: "4. 用 AbsoluteContentSize 让容器自适应",
        paragraphs: [
          "UIListLayout 始终知道自己的排列需要多大空间,并以只读属性 AbsoluteContentSize 暴露出来:一个 Vector2,纵向列表时 Y 是整摞的总高(所有子元素高度加 Padding 间距),横向时 X 是总宽。子元素增删或改尺寸时它会更新,所以它是做「容器随内容撑高」的关键 —— 排行榜、设置菜单、任务日志都靠它。",
          "两种用法。普通 Frame 上,监听布局的 AbsoluteContentSize 变更信号,把 Frame 高度设成一样;ScrollingFrame 上,同样地驱动 CanvasSize,让可滚动区域永远正好等于排列高度 —— 不用猜,也不会溢出。",
          "一个时机细节:信号在布局计算之后才触发,所以初始化时也要手动设一次尺寸 —— 否则第一帧会以你的占位高度渲染。这个只闪一帧的错误尺寸,就是大家反馈的「自适应面板闪一下」 bug 的来源。",
        ],
        tip: "新版 Roblox 上常常可以省掉手动绑定:把容器的 AutomaticSize 设为 Enum.AutomaticSize.Y,它就会自己随布局内容撑高。",
      },
      {
        heading: "5. Position 覆盖:当 UIListLayout 忽略 Position",
        paragraphs: [
          "UIListLayout 接管容器的那一刻,就拥有了子元素的 Position —— 你设置的任何值都会在下一次布局时被覆盖。这是「我设的 Position 不生效」问题的第一大来源:属性没问题,是布局赢了。AnchorPoint 仍然作用于每个子元素在分到的槽位里,ZIndex 也不受影响,但容器的直接子元素永远逃不出排列。",
          "逃生舱是嵌套。把想自由定位的元素包进一个中间 Frame,给这个包装 Frame 一个 LayoutOrder,让它正常占一个槽位。布局排列的是包装 Frame —— 而包装内部没有布局,Position 照常生效。关闭按钮压在标题行上、通知角标钉在列表条目一角,都是这么做的。",
        ],
        tip: "UICorner、UIStroke、UIPadding 这类装饰器不参与排列 —— 只有可见的 GuiObject 占槽位 —— 所以它们可以继续做容器的直接子级。",
      },
      {
        heading: "6. 完整示例:一个设置菜单",
        paragraphs: [
          "把上面全部装进一个可运行的 LocalScript:居中面板、UIPadding 留白、显式 LayoutOrder 排序的 UIListLayout、标题,以及用 helper 函数生成的三行。放进 StarterGui 的 LocalScript 里直接就能跑。",
          "行编号用了 10、20、30,之后想加第四行,取中间任意 LayoutOrder 即可,已有代码一行不动。每行都出自同一个 helper,所以像素级一致 —— 这正是把定位交给布局的意义所在。",
          "接下来给按钮接线就是普通的 Activated 代码 —— 开关、缓动等在 GUI 脚本指南里有讲。",
        ],
      },
    ],
    faq: [
      {
        q: "UIListLayout 也能横向排吗?",
        a: "能 —— 设 FillDirection = Enum.FillDirection.Horizontal,子元素就从左到右(或按对齐方式从右到左)排开。",
      },
      {
        q: "为什么我的子元素之间没有间距?",
        a: "把布局的 Padding 设为一个 UDim 值,比如 UDim.new(0, 10)。不设的话,子元素会紧贴。",
      },
      {
        q: "UIListLayout 的 AbsoluteContentSize 是什么?",
        a: "一个只读 Vector2,表示排列好的子元素占用的总尺寸:纵向列表时 Y 是整摞的总高(子元素加 Padding 间距)。用 GetPropertyChangedSignal(\"AbsoluteContentSize\") 监听它,用来给 Frame 或 ScrollingFrame 的 CanvasSize 自适应尺寸。",
      },
      {
        q: "为什么 UIListLayout 忽略我给子元素设的 Position?",
        a: "因为布局控制着它容器所有直接子元素的 Position。想让某个元素自由定位,就把它包进一个 Frame,给包装 Frame 一个 LayoutOrder 让它排进列表,再对包装内部的元素设 Position。",
      },
      {
        q: "运行时怎么调整子元素顺序?",
        a: "直接改子元素的 LayoutOrder 属性 —— 列表立即重排,不需要重建。在 SortOrder.LayoutOrder 下这就是官方支持的挪行方式,比如每次分数变化后重排排行榜。",
      },
    ],
    relatedGuides: [
      { slug: "how-to-make-a-roblox-main-menu-gui", title: "如何制作 Roblox 主菜单 GUI" },
      { slug: "how-to-make-a-roblox-inventory-gui", title: "如何制作 Roblox 背包 GUI" },
      { slug: "how-to-script-a-roblox-gui", title: "如何给 Roblox GUI 写脚本(点击、开关与缓动)" },
    ],
  },

  "how-to-make-a-roblox-global-leaderboard-gui": {
    title: "如何制作 Roblox 全局排行榜 GUI",
    description:
      "制作跨服 Roblox 全局排行榜 GUI：使用 OrderedDataStore 存储排名分数、缓存 GetNameFromUserIdAsync 用户名避免限流，并用 UIListLayout 渲染前 10 行。",
    category: "数据",
    intro:
      "全局排行榜会把所有服务器的玩家按总金币、击杀数或等级排序，并在重启与换服后持久保留。界面本身只是 ScrollingFrame 或 UIListLayout 排出的几行模板，真正考验稳健性的是 OrderedDataStore 频控管理、用户名缓存与服务端定时广播。",
    sections: [
      {
        heading: "1. 用 OrderedDataStore 按 UserId 存储整型分数",
        paragraphs: [
          "OrderedDataStore 只能存整数且按数值大小排序。务必用 tostring(player.UserId) 作键、分数作值，这样玩家改名后榜单依然准确且不会重复占榜。保存时优先用 UpdateAsync 防止旧服数据覆盖新纪录。",
        ],
      },
      {
        heading: "2. 服务端定时读取榜单并缓存玩家用户名",
        paragraphs: [
          "通过 GetSortedAsync(false, 10) 读取降序前 10 名，再用 Players:GetNameFromUserIdAsync 查询昵称（或配合 Players:GetUserThumbnailAsync 取头像）。记住一定要把 userId 对应的名字缓存在表里，避免每次刷新重复请求导致超过 API 配额。",
        ],
        tip: "GetNameFromUserIdAsync 属于异步网络请求，建议用 pcall 包裹并缓存结果；全局榜每 60 秒刷新一次足够满足大多数游戏。",
      },
      {
        heading: "3. 下发榜单并在客户端克隆行模板",
        paragraphs: [
          "服务端把整理好的前 10 数组通过 RemoteEvent 推给所有客户端（同时新玩家进服时主动推一次缓存榜单）。客户端销毁旧的 GuiObject 行（保留 UIListLayout）后按序克隆 RowTemplate 填入名次、玩家名和格式化分数，前三名可额外换上金银铜高亮。",
        ],
      },
      {
        heading: "4. 兼容 SurfaceGui 实体大屏与 ScreenGui 弹窗",
        paragraphs: [
          "同一份行列表逻辑既可以放进 Lobby 大厅木牌上的 SurfaceGui，也能放进主 HUD 按钮弹出的 ScreenGui 面板里；只需在 SurfaceGui 上设好 PixelsPerStud 清晰度即可。",
        ],
      },
    ],
    faq: [
      {
        q: "全局排行榜应该多久刷新一次最合适？",
        a: "OrderedDataStore 有严格的读取频率限制。建议在服务端统一每 60 秒拉取并缓存一次，进服玩家直接读取缓存表，切忌每次玩家分数变动都重新 GetSortedAsync。",
      },
      {
        q: "为什么排行榜里同一个玩家出现了两次？",
        a: "说明你用玩家名字当 Key，或混用了测试账号与不同前缀。永远使用 tostring(player.UserId) 作为 OrderedDataStore 的唯一键。",
      },
      {
        q: "怎么显示 1.2K、3.5M 这种简写分数而不是一长串数字？",
        a: "OrderedDataStore 内部必须存纯整数（比如 1250000），客户端渲染 RowTemplate 时再用格式化函数把整数转换成 1.25M 展示即可。",
      },
      {
        q: "OrderedDataStore 能在客户端 LocalScript 里直接读取吗？",
        a: "不能，所有 DataStoreService 调用都必须在 ServerScriptService 的服务端 Script 里运行，再通过 RemoteEvent 把只读列表同步给客户端。",
      },
    ],
    relatedGuides: [
      { slug: "how-to-script-a-roblox-gui", title: "如何给 Roblox GUI 写脚本(点击、开关与缓动)" },
      { slug: "roblox-gui-code-structure", title: "看懂 Roblox GUI 代码:Instance.new、UDim2 与 Parenting" },
      { slug: "how-to-use-uilistlayout-in-roblox", title: "如何在 Roblox 里使用 UIListLayout" },
    ],
  },

  "how-to-animate-roblox-guis-with-tweenservice": {
    title: "如何用 TweenService 给 Roblox GUI 加动画",
    description:
      "精通 Roblox GUI TweenService 动效：菜单滑入与 CanvasGroup 整体淡入、按钮悬停弹性按压、取消旧补间防鬼畜冲突，以及 EasingStyle 实战搭配。",
    category: "动画",
    intro:
      "生硬闪现的弹窗会让整款游戏显得廉价，而恰当的 TweenService 过渡动画能立刻拉高 UI 质感。无论滑入、缩放弹出、按钮按压回弹还是 CanvasGroup 整体淡出，掌握正确取消旧动画的习惯就能杜绝反复快速开关导致的闪烁和位置错乱。",
    sections: [
      {
        heading: "1. 滑入入场与 Back / Quint 缓动选择",
        paragraphs: [
          "把面板先放在屏幕外（例如 Position = UDim2.fromScale(0.5, 1.4)），再用 TweenInfo(0.32, Enum.EasingStyle.Quint, Enum.EasingDirection.Out) 补间到目标中心点；需要活泼可爱的模拟/宠物风格弹窗时可换用 Back，科技和严谨竞技 UI 更适合 Quint 或 Quad。",
        ],
      },
      {
        heading: "2. 用 CanvasGroup 实现整个面板整体淡入淡出",
        paragraphs: [
          "如果把一个包含十几层文字和图片的子面板逐一改 Transparency，不仅代码繁琐，重叠加透明还会露底透视。把弹窗外框设为 CanvasGroup 并对 GroupTransparency 在 1 和 0 之间做 Tween，就能让整套 UI 统一平滑淡入淡出。",
        ],
        tip: "弹窗完全关闭（GroupTransparency = 1）后顺手把 ScreenGui.Enabled 设为 false 或 Active 关闭，既省掉 CanvasGroup 显存渲染，也不会拦截点击。",
      },
      {
        heading: "3. 做一套丝滑的按钮悬停与按压回弹动画",
        paragraphs: [
          "连接 MouseEnter、MouseLeave、MouseButton1Down 和 Activated，对按钮内包容器或 UIScale 做 5% 的轻幅缩放（例如悬停放大到 1.05，按下缩到 0.96，松开弹回 1），手感立刻明显提升，而且不会破坏父级 UIListLayout 的排版。",
        ],
        tip: "对按钮做缩放动画时，直接补间里面加一个 UIScale 的 Scale 属性最安全——绝不要直接修改受 UIListLayout 控制的按钮 Size！",
      },
      {
        heading: "4. 用缓存引用 Cancel() 上一个补间防止快速点击抽搐",
        paragraphs: [
          "玩家疯狂连点开关按钮时，两个反向 Tween 同时改 Position 会互相打架。每次创建新 Tween 前先对上一次保存的变量调用 currentTween:Cancel()，动画就能随时自然打断并平滑折返。",
        ],
      },
    ],
    faq: [
      {
        q: "TweenService 能直接补间 BackgroundColor3 或 TextColor3 吗？",
        a: "可以，Position、Size、Rotation、ImageTransparency 和 Color3 属性都可以放进同一个目标表里同时过渡。",
      },
      {
        q: "为什么给 UIListLayout 里的按钮做放大 Tween 时其他按钮位置乱跳？",
        a: "因为 UIListLayout 会根据子元素的 Size 重新计算所有兄弟间距。正确做法是给按钮里挂一个 UIScale，然后补间 UIScale.Scale，它只影响视觉缩放而不改变布局占用尺寸。",
      },
      {
        q: "怎么做一个无限呼吸闪烁的提示角标？",
        a: "把 TweenInfo 第四个参数 RepeatCount 设为 -1，第五个参数 Reverses 设为 true，调用一次 Play() 就会无限来回循环。",
      },
      {
        q: "为什么快速开关菜单两次后，面板在打开瞬间突然又关掉了？",
        a: "因为旧关闭动画的 Completed 回调依然触发并把 ScreenGui.Enabled 设成了 false。记得每次启动新动画前先对旧补间 :Cancel()，并在回调里加状态判断。",
      },
    ],
    relatedGuides: [
      { slug: "how-to-script-a-roblox-gui", title: "如何给 Roblox GUI 写脚本(点击、开关与缓动)" },
      { slug: "how-to-design-polished-roblox-ui", title: "如何设计精致的 Roblox UI(渐变、描边与层次感)" },
      { slug: "how-to-make-a-roblox-main-menu-gui", title: "如何制作 Roblox 主菜单 GUI" },
    ],
  },

  "how-to-make-a-draggable-roblox-gui": {
    title: "如何制作可拖拽的 Roblox GUI",
    description:
      "制作流畅跨平台的 Roblox 可拖拽窗口 GUI：使用 UserInputService 兼容鼠标与触屏、固定点击偏移防跳变、限制不拖出屏幕边界。",
    category: "交互",
    intro:
      "老版 Frame.Draggable 属性早已被 Roblox 官方弃用且常在多点触控下失效。现代写法是用标题栏监听 InputBegan 触发拖拽、UserInputService.InputChanged 更新偏移，再把坐标夹紧在屏幕视口范围内，防止玩家一不小心把设置窗拖到屏幕外面再也抓不回来。",
    sections: [
      {
        heading: "1. 只监听标题栏（DragHandle）的按下事件",
        paragraphs: [
          "把拖拽触发区绑在顶部标题栏或空白把手 Frame 上，千万不要绑在整块主面板上，否则会和里面的 ScrollingFrame、滑块和按钮抢点击事件。",
        ],
      },
      {
        heading: "2. 记录起始坐标与偏移量，避免刚一按就瞬移跳角",
        paragraphs: [
          "按下瞬间同时保存 dragStart = input.Position 和 startPos = frame.Position；移动时用 delta = input.Position - dragStart 叠加上去，确保鼠标或手指点住标题栏哪个像素，窗口就稳稳贴在手下。",
        ],
      },
      {
        heading: "3. 用 math.clamp 把窗口限制在屏幕可视区域内",
        paragraphs: [
          "玩家拖拽太猛或缩小窗口时，面板很容易被甩出视口边缘。用 AbsoluteSize 计算屏幕可移动边界并做 math.clamp，让窗口四条边始终留在安全区内。",
        ],
        tip: "如果你的玩家会在屏幕尺寸变化时拖窗口，记得先换算好 AnchorPoint 对应的最小/最大像素边界，再做 clamp。",
      },
      {
        heading: "4. 全局 InputEnded 与关闭弹窗时自动复位拖拽状态",
        paragraphs: [
          "有时候玩家鼠标拖出游戏窗口外才松键，因此必须在 UserInputService.InputEnded（而不仅是标题栏自身）里把 dragging 置回 false，以免出现鼠标松开了窗口却还粘在指针上的 Bug。",
        ],
      },
    ],
    faq: [
      {
        q: "为什么我用 Frame.Draggable = true 没反应或者效果很卡？",
        a: "Frame.Draggable 已被 Roblox 长期标记为废弃（Deprecated），对 Scale、触控与多层嵌套支持很差，新项目应统一改用 UserInputService 实现。",
      },
      {
        q: "为什么刚点下标题栏准备拖的时候，窗口突然跳走一大截？",
        a: "因为直接把鼠标坐标赋给了 frame.Position。必须先记下按下瞬间的 dragStart 和 startPos，再用差值 delta 叠加。",
      },
      {
        q: "这套拖拽脚本在手机和平板触屏上能用吗？",
        a: "可以——在 InputBegan、InputChanged 和 InputEnded 里同时兼容 Enum.UserInputType.Touch，或者直接支持 UIDragDetector 实例。",
      },
      {
        q: "听说 Roblox 出了原生 UIDragDetector，可以直接用吗？",
        a: "可以！在面板里挂一个 Roblox 官方的 UIDragDetector 并设好 BoundingUI，几乎零脚本就能拖；需要自定义平滑惯性、吸附或拖拽权限时，手写 UserInputService 更灵活。",
      },
    ],
    relatedGuides: [
      { slug: "how-to-open-a-gui-with-a-key-in-roblox", title: "如何用按键打开 Roblox GUI" },
      { slug: "how-to-make-a-responsive-roblox-gui", title: "如何制作响应式的 Roblox GUI" },
    ],
  },

  "how-to-make-a-responsive-roblox-gui": {
    title: "如何制作响应式的 Roblox GUI",
    description:
      "让同一套 Roblox GUI 在 1080p、4K 电脑、平板与竖横屏手机上都比例协调：Scale 尺寸、AnchorPoint 居中、UIAspectRatioConstraint 锁定比例、UITextSizeConstraint 与 UIScale。",
    category: "布局",
    intro:
      "Roblox 玩家超过一半使用手机和平板，剩下的用笔记本、带鱼屏甚至主机电视。如果在 Studio 里用固定像素（Offset）摆 UI，自己电脑看起来正好，到手机上就会溢出或者小得点不到。养成这五个排版习惯，就能一次做对全端适配。",
    sections: [
      {
        heading: "1. 用 Scale（比例）而不是 Offset（像素）定主体位置和大小",
        paragraphs: [
          "UDim2 有 Scale（屏幕或父容器百分比）和 Offset（固定像素）两套分量。主体弹窗和 HUD 容器务必用 Scale（例如 UDim2.fromScale(0.42, 0.58)），只在内边距 UIPadding、圆角 UICorner 或极小图标间隙使用少量像素 Offset。",
        ],
      },
      {
        heading: "2. 配合 AnchorPoint 锁住中心与边缘锚点",
        paragraphs: [
          "居中弹窗设 AnchorPoint(0.5, 0.5) + Position(0.5, 0.5)；右下角按钮设 AnchorPoint(1, 1) + Position(0.97, 0.96)。只有锚点选对方向，面板在屏幕拉宽或压扁时才不会歪出边界。",
        ],
      },
      {
        heading: "3. 用 UIAspectRatioConstraint 保住方形卡片和图标不变形",
        paragraphs: [
          "纯 Scale 在 16:9 电脑和超窄手机上会把正方形格子拉成扁长条。给商品卡片、背包格子或主容器加一个 UIAspectRatioConstraint（AspectRatio = 1 做正方形，或设 1.6 保持弹窗长宽比），搭配 UISizeConstraint 限制最小可触控宽度。",
        ],
      },
      {
        heading: "4. 用 UITextSizeConstraint 控制字号上限，用 UIScale 统一缩放 HUD",
        paragraphs: [
          "打开 TextScaled = true 能让小屏文字缩小适应框体，但如果不配 UITextSizeConstraint（例如 MaxTextSize = 24, MinTextSize = 11），大显示器上的正文会变得像标题一样刺眼；角落 HUD 密度较高时，还能按视口宽度用脚本调整 ScreenGui 下的 UIScale。",
        ],
        tip: "在 Roblox GUI Maker 编辑器顶栏或 Studio 的 Test -> Device 模拟器里，务必依次切换到 iPhone / iPad / 1080p 视口检验一遍再导出。",
      },
    ],
    faq: [
      {
        q: "为什么在 Studio 电脑画布看着正好，一到手机就飞出屏幕外面？",
        a: "通常是 Position 或 Size 写在了 Offset（像素）上，比如 X Offset 800 在手机横屏下会直接冲出屏幕。改成 Scale 并加 UISizeConstraint / UIAspectRatioConstraint 即可。",
      },
      {
        q: "Roblox Studio 在哪里模拟手机、平板和不同分辨率屏幕？",
        a: "在 Studio 顶部菜单打开 Test -> Device（或 Home/View 里的 Emulator 工具），即可一键切换 iPhone、iPad、Xbox 和 4K 画面实时检验 GUI 适配效果。",
      },
      {
        q: "怎么不逐一改尺寸，就把整套密集 HUD 在手机上整体缩小一圈？",
        a: "给对应 ScreenGui 挂一个 UIScale，并在检测到手机窄屏时把 UIScale.Scale 设为 0.8–0.85，整个层级会等比一起缩小。",
      },
      {
        q: "TextScaled 打开后文字一大一小看起来很乱怎么办？",
        a: "TextScaled 会尽量把每个字填满盒子，短词和长句字号差距极大。保持相同行高按钮并用 UITextSizeConstraint 锁死 MaxTextSize（例如 20），或者统一启用 AutomaticSize + 固定字号。",
      },
    ],
    relatedGuides: [
      { slug: "how-to-make-a-gui-in-roblox", title: "如何在 Roblox 里制作 GUI" },
      { slug: "how-to-use-uilistlayout-in-roblox", title: "如何在 Roblox 里使用 UIListLayout" },
      { slug: "how-to-design-polished-roblox-ui", title: "如何设计精致的 Roblox UI(渐变、描边与层次感)" },
    ],
  },

  "roblox-gui-script-generator": {
    title: "Roblox GUI 脚本生成器",
    description:
      "用一个可视化的 Roblox GUI 脚本生成器搭建响应式界面、预览交互,并导出客户端 Luau、服务端处理器、JSON 或完整的 ZIP 项目。",
    category: "导出",
    intro:
      "一个有用的 Roblox GUI 脚本生成器应该做的,远不止打印一段好看的示例代码。它应该让你检查层级、编辑真实的 Roblox 属性、预览重要状态,并在任何东西进入 Studio 之前就搞清楚哪段代码跑在客户端、哪段跑在服务端。本指南讲解这套流程,以及让生成的 UI 代码保持诚实的那些边界。",
    sections: [
      {
        heading: "一个 Roblox GUI 脚本生成器应该生成什么",
        paragraphs: [
          "核心产出是一个由 Roblox 实例(如 Frame、TextLabel、TextButton、ScrollingFrame)和布局辅助对象构成的 ScreenGui 层级。名字、父子关系、颜色、透明度、文字、字体、ZIndex 和响应式几何都应该在导出前可见,而不是藏在一个提示背后。",
          "生成器还可以接好可预测的界面行为。显示、隐藏或切换一个面板属于客户端脚本。RemoteEvent 和 Teleport 动作需要一个额外的服务端脚本,因为服务器掌握权威的游戏行为。",
        ],
      },
      {
        heading: "把可视化层级变成 Roblox 实例",
        paragraphs: [
          "画布上的每个对象都变成一个带显式父级的 Instance.new 调用。一个子面板应该挂到它的容器下,而不是重建为一个扁平列表。这个层级对布局对象、可见性、裁剪,以及按名字查找元素的脚本都很重要。",
          "生成的变量应该稳定、可读、能检查。你应该能把画布和 Luau 对照着看,认出同一个 ScreenGui、那些 Frame、标签、按钮和约束。",
        ],
      },
      {
        heading: "把客户端 UI 和服务端动作分开",
        paragraphs: [
          "渲染玩家界面、响应本地按钮按下,属于 LocalScript。客户端可以请求一个动作,但不能被信任去发放货币、给予物品、批准购买,或选择一个不受限的传送目的地。",
          "对于配置好的 RemoteEvent 和 Teleport 动作,Roblox GUI Maker 会生成一个独立的服务端文件。RemoteEvent 处理器包含一个显式的校验边界。Teleport 处理器只接受在导出 GUI 里配置过的 Place ID。你的游戏仍需校验玩家状态、权限、价格、归属和速率限制。",
        ],
        tip: "把从 RemoteEvent 收到的每个值都当成不可信输入,哪怕对应的按钮是编辑器生成的。",
      },
      {
        heading: "选择 Luau、JSON 还是 ZIP 导出",
        paragraphs: [
          "当你只需要生成的 ScreenGui 和本地交互时,用客户端 Luau 下载。当项目含 RemoteEvent 或 Teleport 行为时,下载服务端 Luau。GUI 没有服务端动作时,服务端文件会被省略。",
          "JSON 保留可编辑的场景,从而能导回浏览器编辑器。ZIP 压缩包把 README 说明、project.json、客户端 Luau 和可选的服务端 Luau 合并成一个浏览器生成的下载。它是一份交接包,不是原生的 Roblox model 文件。",
        ],
      },
      {
        heading: "在 Roblox Studio 里安装生成的脚本",
        paragraphs: [
          "在 StarterGui 下新建一个 LocalScript,把客户端 Luau 粘进去。当包里包含 roblox-gui.server.lua 时,在 ServerScriptService 下新建一个 Script,把服务端输出粘进去。运行体验,确认 ScreenGui 出现在 PlayerGui 里。",
          "把 project.json 留在 Studio 外,作为日后浏览器改动的可编辑源。如果你修改了场景,重新导出并有意识地替换生成的脚本,而不是手工合并不相关的版本。",
        ],
      },
      {
        heading: "测试行为,把安全留在服务端",
        paragraphs: [
          "导出前预览每种设备尺寸和每个配置好的可见状态。在 Studio 里,当 RemoteEvent 或传送依赖玩家特定状态时,用不止一个玩家来测试。已发布的传送必须从已发布的体验里测试,因为 Studio 试玩无法证明线上的 TeleportService 路径。",
          "生成的代码是一个清晰的起点,不等于一个游戏的经济是安全的。审查每个服务端回调,拒绝意外的参数,需要时强制冷却,并把 datastore、购买、奖励和权限检查留在服务端。",
        ],
      },
    ],
    faq: [
      {
        q: "Roblox GUI 脚本生成器导出什么?",
        a: "它导出 ScreenGui 和本地交互的客户端 Luau、配置好的 RemoteEvent 或 Teleport 动作的可选服务端 Luau、一个可编辑的 JSON 场景,以及一个含相关项目文件和说明的 ZIP 压缩包。",
      },
      {
        q: "生成的 Roblox GUI 脚本放哪?",
        a: "客户端输出放在 StarterGui 下的 LocalScript 里。可选的服务端输出放在 ServerScriptService 下的 Script 里。",
      },
      {
        q: "它会生成一个完整游戏的逻辑吗?",
        a: "不会。它生成 UI 实例和选中的交互接线。安全的购买、奖励、背包、权限、datastore 和其它游戏系统仍由你负责。",
      },
      {
        q: "导出后我还能编辑项目吗?",
        a: "能。导出 project.json,之后导回 Roblox GUI Maker。JSON 保留可编辑的场景,而 Luau 和 ZIP 服务于 Studio 交接流程。",
      },
    ],
    relatedGuides: [{ slug: "how-to-make-a-gui-in-roblox", title: "如何在 Roblox 里制作 GUI" }],
  },

  "how-to-make-a-gui-in-roblox": {
    title: "如何在 Roblox 里制作 GUI",
    description:
      "学习如何在 Roblox 里制作 GUI:规划玩家任务、搭建 ScreenGui 层级、创建响应式布局、接通按钮、预览状态,并在 Studio 里测试。",
    category: "入门",
    intro:
      "当你把一个 Roblox GUI 当作一小段玩家流程、而不是一堆 Frame 来对待时,它就好搭得多。从一个屏幕和一个主要动作开始,组织好层级,把几何做响应式,然后接通并测试行为。本指南按这个顺序,从一个空白 ScreenGui 走到一个导出到 Roblox Studio 的项目。",
    sections: [
      {
        heading: "想清楚这个 GUI 帮玩家做什么",
        paragraphs: [
          "按它的职责给屏幕命名:主菜单、商店、背包、设置、加载界面或 HUD。写下玩家首先该注意的主要动作。主菜单可能以 Play 打头;商店可能以选中物品和 Buy 按钮打头。",
          "第一版要窄。定义默认状态、主要动作,以及一种离开或关闭屏幕的方式。等核心路径跑通,再加多余的标签和装饰性状态。",
        ],
      },
      {
        heading: "搭一个清晰的 ScreenGui 层级",
        paragraphs: [
          "用一个 ScreenGui 作根,再把相关元素挂到具名容器下。一个菜单面板应该拥有它的标题和按钮。一个设置面板应该拥有它的各行。清晰的名字让生成的代码可读,也让后续脚本能找到正确对象而不用遍历整个 PlayerGui。",
          "布局辅助对象应该挂到它们所排列的容器下。UIListLayout 堆叠同级,UIGridLayout 平铺物品格,UIPadding 制造内部空间,UICorner 或 UIGradient 改变外观而不会变成单独的视觉面板。",
        ],
      },
      {
        heading: "把布局做响应式",
        paragraphs: [
          "该跟随视口的比例用 Scale,小而固定的细节(比如内边距或最小触控尺寸)用 Offset。用 AnchorPoint 居中重要面板,而不是用随意的负偏移去补偿。",
          "宽高比和尺寸约束让面板保持可用,不会变得太宽、太小或不可读。在花时间打磨之前,在桌面、平板、手机预览里检查同一个场景。",
        ],
      },
      {
        heading: "把按钮接到可见状态",
        paragraphs: [
          "从你能看到的界面行为开始:显示一个设置面板、隐藏一个菜单、切换一个背包,或禁用整个 GUI。预览这些状态,确认每个目标都有清晰的名字。",
          "当按钮请求服务端掌握的工作时用 RemoteEvent。只在已知目标 Place ID 时用 Teleport 动作。客户端可以发请求,但服务器必须决定玩家是否被允许完成它。",
        ],
        tip: "永远不要把货币奖励、购买批准、物品发放或权限检查只放在 LocalScript 里。",
      },
      {
        heading: "预览桌面、平板和手机状态",
        paragraphs: [
          "预览不仅是视觉检查。按预定顺序点按钮,确认面板开关正常,留意那些把玩家困住、没有可见返回途径的状态。RemoteEvent 和 Teleport 预览应解释这个请求,而不是假装执行了真实的线上服务端行为。",
          "在每个设备尺寸上重复这条路径。留意被裁剪的标签、变得太小的按钮、意外的横向滚动,以及主要动作落到视口以下的面板。",
        ],
      },
      {
        heading: "导出、安装并在 Roblox Studio 里测试",
        paragraphs: [
          "想要场景 JSON、生成脚本和放置说明打包在一起时,下载 ZIP 压缩包。把客户端 Luau 放在 StarterGui 下的 LocalScript 里,可选的服务端 Luau 放在 ServerScriptService 下的 Script 里。",
          "在 Studio 里运行游戏,确认 ScreenGui 出现在 PlayerGui 里。用正确的多人或已发布环境测试服务端动作。保留 JSON 导出,这样你可以修改可编辑的设计,而不是把生成的 Luau 当作唯一来源。",
        ],
      },
    ],
    faq: [
      {
        q: "在 Roblox 里该在哪创建 ScreenGui?",
        a: "对于手工搭建的 Studio 工程,把一个 ScreenGui 放在 StarterGui 下,Roblox 会把它复制进每个玩家的 PlayerGui。生成的客户端 Luau 也可以从 StarterGui 下的 LocalScript 里创建 ScreenGui。",
      },
      {
        q: "怎么让 Roblox GUI 在手机上正常工作?",
        a: "用 Scale 做响应式比例,用 AnchorPoint 做稳定对齐,用宽高比或尺寸约束做可读限制。导出前在手机、平板、桌面尺寸下预览界面。",
      },
      {
        q: "Roblox GUI 什么时候需要服务端代码?",
        a: "纯可见性变化可以留在客户端。购买、奖励、权限、传送、datastore 和其它权威游戏动作需要服务端校验。",
      },
      {
        q: "我能从模板开始而不是空白屏吗?",
        a: "能。打开主菜单、商店、设置、背包、加载界面或排行榜模板,替换占位文字,预览状态,然后导出结果。",
      },
    ],
    relatedGuides: [{ slug: "roblox-gui-script-generator", title: "读懂生成的 Roblox GUI 脚本" }],
  },

  "roblox-ui-design": {
    title: "Roblox UI 设计 —— 布局、配色与尺寸指南",
    description:
      "Roblox UI 设计基础:UDim2 尺寸、AnchorPoint 对齐、配色方案、字体搭配、用 UIListLayout 做间距,以及面向手机和桌面的响应式模式。",
    category: "设计",
    intro:
      "好的 Roblox UI 设计不在于花哨的图片 —— 而在于干净的层级、可读的文字、一致的间距,以及能扛住每种屏幕尺寸的布局。本指南讲你在写一行脚本之前就要做的核心设计决策:如何给元素定尺寸、对齐、挑颜色、选字体,以及搭出在手机和桌面上都好看的响应式布局。",
    sections: [
      {
        heading: "1. UDim2 —— Roblox UI 尺寸的根基",
        paragraphs: [
          "每个 Roblox GUI 元素都用 UDim2 表示 Position 和 Size。一个 UDim2 有两个轴,每个轴都有一个 Scale 分量(0–1,父级的几分之几)和一个 Offset 分量(像素)。理解何时用哪个,是最重要的一项 Roblox UI 设计技能。",
          "该随父级放大缩小的东西用 Scale:面板宽度、行高、间距比例。必须保持固定像素尺寸的东西用 Offset:图标尺寸、圆角半径、小间隙。",
          "一个常见模式:主面板用 Size = UDim2.fromScale(0.8, 0.6),里面的图标用 Size = UDim2.fromOffset(32, 32)。这样面板按比例、图标保持清晰。",
        ],
        tip: "如果你只用 Offset,你的 GUI 会在一个屏幕尺寸上完美、在其它所有尺寸上错位。永远从 Scale 开始,只给固定尺寸细节加 Offset。",
      },
      {
        heading: "2. AnchorPoint 和对齐",
        paragraphs: [
          "AnchorPoint 决定元素的 Position 指的是它的哪个角。默认是 (0, 0) —— 左上角。设成 (0.5, 0.5),元素就以它的 Position 坐标为中心居中。",
          "要居中面板,永远把 AnchorPoint 设为 (0.5, 0.5)、Position 设为 UDim2.fromScale(0.5, 0.5)。这样无论屏幕多大面板都居中。",
          "对于角落 HUD,用 AnchorPoint (0, 0) 是左上、(1, 0) 是右上、(0, 1) 是左下、(1, 1) 是右下。然后用 (0.02, 0) 或 (0.98, 0) 这样的 Scale 值做 Position,让它离边缘留一点边距。",
        ],
      },
      {
        heading: "3. 在 Roblox 里好用的配色方案",
        paragraphs: [
          "Roblox 游戏跑在五花八门的屏幕上 —— 明亮的笔记本显示器、昏暗的手机屏,以及介于其间的一切。你的配色需要在哪都可读,有足够对比度。",
          "一套安全的起步配色:深色背景(Color3.fromRGB(18, 18, 24))、浅色文字(Color3.fromRGB(230, 230, 240)),再加一个强调色(Color3.fromRGB(0, 162, 255) 用于可交互元素)。这给文字带来 12:1 以上的对比度。",
          "大面积背景避免纯白(#FFFFFF) —— 在暗色游戏里很刺眼。改用米白(#E6E6F0)或很浅的蓝灰。",
          "状态色:绿色(#22C55E)表示成功、红色(#EF4444)表示错误、黄色(#EAB308)表示警告。全 UI 保持一致。",
        ],
        tip: "把亮度调到 50% 测试你的颜色 —— 如果文字仍然看得清,对比度就够亮屋子里的手机玩家用了。",
      },
      {
        heading: "4. 字体搭配和文字层级",
        paragraphs: [
          "Roblox 自带好几款字体。想要干净的现代感:标题用 GothamBold 或 GothamBlack,正文用 GothamMedium,技术标签用 Code。",
          "建立清晰的文字层级:H1(标题)28–36px,H2(小节标题)20–24px,正文 14–16px,说明 11–12px。全 GUI 坚持这些字号。",
          "行高比你想的更重要。在 Roblox 里,TextLabel.TextWrapped = true 配上充裕的 Frame 高度,能给你自然的行距。别把文字塞进逼仄的 Frame。",
          "深色背景用高亮度(200+)的 TextColor3。浅色背景用低亮度(30–60)。绝不用中灰文字 —— 它在两者上都看不清。",
        ],
      },
      {
        heading: "5. 用 UIListLayout 和 UIPadding 做间距",
        paragraphs: [
          "UIListLayout 相当于 Roblox 版的 CSS flexbox。把它放进一个 Frame,每个子元素就自动堆叠 —— 纵向或横向,带可配置的间距和对齐。",
          "用 UIPadding 给父 Frame 制造一致的外边距。一条好规则:外边距 16px,元素之间 8–12px。这符合现代网页设计惯例,玩家也觉得自然。",
          "对于网格(商店、背包),用带 Scale 的 CellSize 的 UIGridLayout 做响应式列。UDim2.fromScale(0.3, 0) 配一个 UIAspectRatioConstraint,能给你随父级缩放的正方形单元格。",
          "对于按钮行,用 FillDirection = Horizontal 的 UIListLayout 和一个小的 Padding 值。每个按钮给一个固定的 Offset 宽度,这样在手机上也好点。",
        ],
        tip: "如果布局看起来挤,先加大 UIPadding,再去加大 Frame 尺寸。留白是免费的,而且让一切更可读。",
      },
      {
        heading: "6. 面向手机和桌面的响应式设计",
        paragraphs: [
          "Roblox 玩家用手机、平板、桌面,有时还在同一局服务器里。你的 GUI 必须在所有这些上都好用。",
          "核心原则:容器和布局用基于 Scale 的尺寸,再用 UITextSizeConstraint 和 UIAspectRatioConstraint 精细控制文字和宽高比。",
          "手机:最小触控目标是 44×44 像素(Apple HIG 标准)。按钮至少保持这个尺寸。可点元素之间用至少 8px 的 UIListLayout 间距。",
          "桌面:你可以用更密的布局、更小的文字。但保持同样的基于 Scale 的结构,让布局自然重排。",
          "用 Roblox Studio 模拟器在 360×640(手机)、768×1024(平板)、1920×1080(桌面)下测试。如果三种都好看,它在哪都好用。",
        ],
      },
      {
        heading: "7. 视觉层级和信息架构",
        paragraphs: [
          "每个屏幕都该有一个清晰的焦点 —— 玩家该第一眼看的东西。用尺寸、颜色和位置把视线引过去。",
          "把相关元素视觉上分组。一个 BackgroundColor3 略有不同、带 UICorner 的 Frame 就构成一张卡片,表示“这些东西是一组”。",
          "组与组之间用一致的间距(16–24px),组内用更紧的间距(8–12px)。这构成一种玩家直觉能懂的视觉节奏。",
          "限制每个屏幕的可见动作数量。一个主菜单需要 3–5 个按钮,不是 15 个。要更多的话,用子屏幕或标签。",
        ],
      },
      {
        heading: "8. 用 Roblox GUI Maker 导出和迭代",
        paragraphs: [
          "一旦你写了 500 行 Luau,设计决策就很难推翻了。Roblox GUI Maker 让你可视化预览布局、测试响应式行为、导出干净代码 —— 从而在落脚本之前先迭代设计。",
          "从匹配你屏幕类型(主菜单、商店、背包、HUD)的模板开始,在可视化编辑器里调属性,在多种设备尺寸下预览,布局感觉对了再导出。",
          "导出的 Luau 用真实的 Roblox 属性名(BackgroundColor3、UDim2、UIListLayout),所以你边设计边学 API。你在编辑器里调的每个属性,都直接对应一行你能读、能改的 Luau。",
        ],
      },
    ],
    faq: [
      {
        q: "Roblox GUI 最好用什么字体?",
        a: "标题用 GothamBold、正文用 GothamMedium 是最稳的现代组合。避免 SourceSans 之类的旧字体 —— 它们看起来过时,而且在各平台渲染不一致。",
      },
      {
        q: "怎么让 Roblox GUI 在手机上好看?",
        a: "用基于 Scale 的尺寸,把触控目标保持在 44×44 像素以上,在 360×640 分辨率下测试,用 UIListLayout 自动重排。UITextSizeConstraint 防止文字在小屏上变得不可读。",
      },
      {
        q: "Roblox GUI 用什么颜色最好?",
        a: "深色背景(18, 18, 24)配浅色文字(230, 230, 240)和一个强调色(0, 162, 255),能在所有屏幕类型上给你最好的对比度。避免纯白背景 —— 改用米白。",
      },
      {
        q: "Roblox GUI 定尺寸该用 Scale 还是 Offset?",
        a: "容器、面板和该随屏幕缩放的布局元素用 Scale。图标、圆角半径和固定尺寸细节用 Offset。绝不要只用 Offset —— 你的 GUI 会在不同屏幕尺寸上错位。",
      },
      {
        q: "怎么在 Roblox 里把一个 GUI 元素居中?",
        a: "把 AnchorPoint 设为 (0.5, 0.5)、Position 设为 UDim2.fromScale(0.5, 0.5)。这样无论屏幕多大,元素都在父级上居中。",
      },
      {
        q: "UIListLayout 和 UIGridLayout 有什么区别?",
        a: "UIListLayout 把子元素排成单行或单列。UIGridLayout 把子元素排成多行多列的网格。按钮栏和设置列表用 UIListLayout;物品格和背包界面用 UIGridLayout。",
      },
    ],
    relatedGuides: [
      { slug: "how-to-make-a-responsive-roblox-gui", title: "如何制作响应式的 Roblox GUI" },
      { slug: "how-to-use-uilistlayout-in-roblox", title: "如何在 Roblox 里使用 UIListLayout" },
    ],
  },
  "roblox-gui-code-structure": {
    title: "看懂 Roblox GUI 代码:Instance.new、UDim2 与 Parenting",
    description:
      "干净的 Roblox GUI Luau 是怎么组织的:每个元素都是一个 Instance.new,用 UDim2 的 Scale 定位,通过 Parenting 组成一棵树,再加上让它跑起来的属性和按钮处理。附可直接复制的 Luau。",
    category: "入门",
    intro:
      "每个 Roblox GUI 本质上就是 Luau:一棵用 Instance.new 搭起来、用 UDim2 定位、通过父子关系和事件处理连起来的 Instance 树。让你不敢改的烂代码和能直接上线的干净代码,差别就在几条一致的习惯上。本指南讲清楚可上线的 Roblox GUI Luau 是怎么组织的 —— 也就是可视化编辑器导出的那种结构 —— 让你看得懂、改得动、也能自己写。",
    sections: [
      {
        heading: "1. 「干净」的 Roblox GUI 代码长什么样",
        paragraphs: [
          "干净的 GUI 代码可读、可预期、改起来安全。三条习惯就能做到:每个元素都用 Instance.new 创建;用基于 Scale(0–1,相对父级)的 UDim2 给它尺寸和位置;最后再设 Parent —— 设完其它属性之后。这三条也正是可视化编辑器导出的 Luau 所遵循的,所以它读起来像手写代码,而不是生成的乱炖。",
          "收益是实打实的:每个 Frame 都用同样方式创建时,扫一眼脚本就能看出这棵树;位置都基于 Scale 时,UI 在任何屏幕尺寸下都成立;Parenting 有意识时,布局和层级顺序自然就对了。",
        ],
        tip: "如果一段生成或复制的脚本把 Parent 设在其它属性之前,把它挪到最后 —— Roblox 在 Instance 有了 Parent 的那一刻就开始同步它,所以先设好属性能避免一帧的默认值。",
      },
      {
        heading: "2. 每个 GUI 元素都是一个 Instance(Instance.new)",
        paragraphs: [
          "Frame、TextLabel、TextButton、TextBox、ImageLabel、ScrollingFrame,以及 UICorner、UIGradient 这些装饰器,都是 Instance。每个都用 Instance.new(className) 创建,然后按名字设它的属性 —— 和你在 Roblox Studio 属性面板里看到的名字一模一样。",
          "给每个 Instance 起名字。一个叫 Play 的按钮在代码和 Explorer 里都搜得到;留着默认名 TextButton 的就搜不到。当树很深时,名字也成了你推理时用的「变量」。",
        ],
      },
      {
        heading: "3. 用 UDim2 定位和 sizing:Scale 与 Offset",
        paragraphs: [
          "UDim2 是 Roblox 用来放置和度量 UI 的类型。一个 UDim2 接受四个数:UDim2.new(scaleX, offsetX, scaleY, offsetY)。Scale 部分是相对父级的比例(0.5 = 父级宽度的一半);Offset 部分是像素。该随屏幕伸缩的用 Scale,只有固定细节(圆角、内边距)才用 Offset。",
          "fromScale 和 fromOffset 是常用快捷方式:UDim2.fromScale(0.4, 0.6) 表示父级的 40% × 60%,像素偏移为零。用 Scale 搭建,同一个 GUI 才会在手机和桌面上都正确。",
        ],
        tip: "AnchorPoint 改变位置以什么为基准。设 AnchorPoint = (0.5, 0.5) 加 Position = fromScale(0.5, 0.5),元素就在父级里完美居中,任何屏幕都成立。",
      },
      {
        heading: "4. Parenting:决定布局和顺序的那棵树",
        paragraphs: [
          "Parent 是定义 GUI 结构的那一个属性。设 panel.Parent = gui,面板就成了 ScreenGui 的子级;设 button.Parent = panel,按钮就继承面板的坐标系。整个界面是一棵以 ScreenGui 为根的树,Roblox 会把它复制进每个玩家的 PlayerGui。",
          "ZIndex 控制同级重叠时谁画在上面,它是相对同一父级下的兄弟而言的。把每个元素挂到概念上「拥有它」的容器下 —— 菜单面板拥有它的按钮 —— 这棵树本身就成了布局的文档。",
        ],
      },
      {
        heading: "5. 几乎每个元素都会设的那几个属性",
        paragraphs: [
          "一小撮属性覆盖了 GUI 的大部分需要:BackgroundColor3(一个 Color3.fromRGB)、BackgroundTransparency(0 = 实心,1 = 不可见)、ZIndex、Visible 管的是「盒子」。文字元素再加 Text、Font、TextSize、TextColor3。给只显示文字的标签设 BackgroundTransparency = 1,免得它默认的灰底透出来。",
          "Color3.fromRGB 接受 0–255 的值,和任何取色器里看到的数字一样。保持一个不大的、一致的颜色色板,而不是每个元素一个独立十六进制值 —— 这种一致性才让一个屏幕看起来「是设计过的」。",
        ],
        tip: "Enum.Font.GothamBold、GothamMedium、GothamBlack 覆盖了大多数现代 Roblox UI。标题选一个粗体、正文选一个中等粗细,到处复用。",
      },
      {
        heading: "6. 用一个干净的 Activated 处理器接按钮",
        paragraphs: [
          "一个 TextButton 在它的 Activated 事件触发时做事。用 button.Activated:Connect(function() ... end) 接一个函数,函数体保持小 —— 通常是切换另一个 frame 的 Visible,或触发一个 RemoteEvent。给目标 frame 起清楚的名字,处理器读起来就像英语。",
          "想要 show/hide 显得更精致,用 TweenService 做动画而不是硬切。无论哪种,处理器的职责是改变一处状态,而不是把游戏逻辑埋进 UI。",
        ],
      },
      {
        heading: "7. 烂的 GUI 代码:要避开的反模式",
        paragraphs: [
          "大多数难维护的 Roblox GUI 脚本都有同样的味道:只用了像素位置(到处 UDim2.fromOffset),在别的屏幕上就崩;属性顺序乱七八糟,Parent 夹在中间;Instance 不命名,留着 Frame1、Frame2;还有把同样五行样板拷了十遍。",
          "修复是机械的:改用基于 Scale 的 UDim2、给一切命名、最后再 Parent、把重复的 Instance 搭建抽成一个 helper —— 或者更简单:用可视化工具搭好整个东西,再读它的产出。干净代码不靠聪明,靠每次都用同一种方式做同一件事。",
        ],
        tip: "如果你第十次复制粘贴一段 Instance.new 代码块,这就是信号:要么包成一个函数,要么可视化搭建再导出。",
      },
      {
        heading: "8. 这段脚本在 Roblox Studio 里放哪",
        paragraphs: [
          "把客户端 GUI 代码放在 StarterGui 下(ScreenGui 里)或 StarterPlayerScripts 下的 LocalScript 里。必须权威的代码 —— 购买、奖励、权限 —— 放在 ServerScriptService 下的 Script 里,通过 RemoteEvent 触达。",
          "可视化编辑器两者都导出:一个搭建 GUI 的客户端 LocalScript,加上一个可选的服务端 Script,里面已经把 RemoteEvent 处理器和校验边界分好了。粘到对应位置,界面就按预览那样工作。",
        ],
      },
    ],
    faq: [
      {
        q: "Instance.new 在 Roblox 里做什么?",
        a: "Instance.new(className) 创建一个 Roblox 类的新 Instance —— Frame、TextButton、UICorner、ScreenGui 等等。它返回这个对象,你可以设它的属性并把它挂进树里。",
      },
      {
        q: "Roblox GUI 代码里的 UDim2 是什么?",
        a: "UDim2 是表示二维位置和尺寸的数据类型。UDim2.new(scaleX, offsetX, scaleY, offsetY) 把相对父级的 Scale(0–1)和像素 Offset 合在一起,让同一个值既能响应式、又能精确到像素。",
      },
      {
        q: "Parent 该设在其它属性之前还是之后?",
        a: "之后。Roblox 在 Instance 有了 Parent 的那一刻就开始同步它,所以先把 Name、Size、Position、颜色设好,最后再赋 Parent,能避免一帧默认值闪过。",
      },
      {
        q: "这跟在 Studio 编辑器里搭 GUI 有什么不同?",
        a: "Studio 的属性面板和代码,最终都是同样的 Instance。直接写或生成 Luau,让结构显式、可复制粘贴、可版本化 —— 还能让你用一段脚本重建整个 GUI。",
      },
    ],
    relatedGuides: [
      { slug: "how-to-make-a-gui-in-roblox", title: "如何在 Roblox 里制作 GUI" },
      { slug: "roblox-gui-script-generator", title: "读懂生成的 Roblox GUI 脚本" },
    ],
  },

  "how-to-script-a-roblox-gui": {
    title: "如何给 Roblox GUI 写脚本(点击、开关与缓动)",
    description:
      "面向新手的 Roblox GUI 脚本入门:LocalScript 放在哪、连接 TextButton 点击、切换可见性、用 TweenService 做动画 —— 附可直接粘贴的 Luau 代码。",
    category: "脚本",
    intro:
      "搭好 Frame 只是 Roblox GUI 的一半,另一半是脚本:让关闭按钮真的关闭、让商店能开能关、让面板滑入而不是突然弹出。本指南覆盖几乎每个 GUI 脚本都要用到的四块内容:StarterGui 下的 LocalScript、连接按钮、可见性开关,以及 TweenService 动画。每段代码都是完整可直接粘贴的。",
    sections: [
      {
        heading: "1. GUI 脚本放哪:StarterGui 下的 LocalScript",
        paragraphs: [
          "每个玩家各自看到的 GUI 属于客户端。把一个 LocalScript 放进 StarterGui(或直接放进 ScreenGui),玩家加入时 Roblox 会把它克隆进每个人的 PlayerGui。普通的 Script(服务端脚本)在 PlayerGui 里不会运行。",
          "如果 GUI 是在 Studio 里搭的,脚本可以通过 player 对象访问它;如果你改用代码创建 GUI,脚本也可以自己 Instance.new 出每个实例 —— 本编辑器导出的代码用的就是这种做法。",
        ],
        tip: "给菜单、商店这类 GUI 设 ResetOnSpawn = false,否则玩家每次重生 GUI 都会消失重建。",
      },
      {
        heading: "2. 连接按钮点击(所有按钮背后的同一个模式)",
        paragraphs: [
          "每个可交互元素的接线方式都一样:拿到实例引用,把一个函数连接到它的 Activated 事件(鼠标和触摸都适用),在函数里做具体的事。选 Activated 而不是 MouseButton1Click,是因为它同时支持手机点按。",
        ],
        tip: "点击没反应时,先在连接的函数里加个 print。控制台没输出说明路径或事件名错了 —— 十有八九是 WaitForChild 里的 Name 打错了。",
      },
      {
        heading: "3. 用一个按钮开关 GUI",
        paragraphs: [
          "商店和设置面板通常由 HUD 按钮打开、右上角的 X 关闭。干净的做法是翻转 ScreenGui.Enabled —— 为 false 时 Roblox 直接不再渲染整棵树,隐藏是白送的。",
        ],
      },
      {
        heading: "4. 用 TweenService 给面板加动画",
        paragraphs: [
          "淡入或滑入的 GUI 观感立刻上一个档次,而 TweenService 几行就能做到:创建一个 Tween,给它目标属性表、时长和缓动样式,然后 :Play()。位置补间可以直接插值 UDim2。",
        ],
        tip: "要淡入淡出而不是滑动,就补间 NumberValue 再映射到 CanvasGroup 的 GroupTransparency —— 逐个补间 TextTransparency 是绕远路。",
      },
      {
        heading: "5. 客户端和服务端的唯一铁律",
        paragraphs: [
          "点击发生在客户端,但游戏必须强制执行的一切 —— 货币、购买、发放物品、权限 —— 发生在服务端。模式是:LocalScript 触发 RemoteEvent,ServerScriptService 里的 Script 监听、校验、然后应用结果。",
          "如果这个变化纯粹是视觉上的(打开面板、高亮一个标签),它可以永远留在客户端。",
        ],
      },
      {
        heading: "6. 在这里写脚本,或在那里写脚本",
        paragraphs: [
          "可视化编辑器生成的正是这种形状的代码:一个在 ScreenGui 下搭层级、为可见性动作接好 Activated 处理器的 LocalScript,加上一个处理 Fire RemoteEvent 动作的可选服务端 Script。可视化搭好布局、导出,再对照本指南读生成的 Luau —— 结构会一节一节对上。",
        ],
      },
    ],
    faq: [
      {
        q: "为什么我的 GUI 按钮点了没反应?",
        a: "三个常见原因:脚本用了普通 Script 而不是 LocalScript(Script 在 PlayerGui 里不运行)、WaitForChild 的路径和按钮实际的 Name 不一致,或连接建立时实例还不存在。在处理器里加个 print 就能分辨是哪种。",
      },
      {
        q: "该用 MouseButton1Click 还是 Activated?",
        a: "用 Activated。它对鼠标点击和触摸点按都会触发,而 MouseButton1Click 面向鼠标。两者都在 GuiButton(TextButton、ImageButton)上。",
      },
      {
        q: "怎么让玩家按键关闭 GUI?",
        a: "连接 UserInputService.InputBegan,判断 input.KeyCode,翻转 ScreenGui.Enabled —— 配套教程《如何用按键打开 Roblox GUI》有完整代码,包括 gameProcessedEvent 防抖。",
      },
      {
        q: "LocalScript 能用代码创建整个 GUI 吗?",
        a: "能 —— Instance.new 每个元素、设属性、自底向上设父级。本编辑器导出的 Luau 正是这么做的,这让 GUI 可以由一个文件完整重建。",
      },
    ],
    relatedGuides: [
      { slug: "how-to-make-a-gui-in-roblox", title: "如何在 Roblox 里制作 GUI" },
      { slug: "how-to-open-a-gui-with-a-key-in-roblox", title: "如何用按键打开 Roblox GUI" },
      { slug: "how-to-animate-roblox-guis-with-tweenservice", title: "如何用 TweenService 给 Roblox GUI 加动画" },
    ],
  },

  "how-to-open-a-gui-with-a-key-in-roblox": {
    title: "如何用按键打开 Roblox GUI",
    description:
      "把 M、B 这类按键绑定到 Roblox GUI 的开关:UserInputService.InputBegan 切换、gameProcessedEvent 防止聊天时误触,以及用 ContextActionService 支持手柄。",
    category: "脚本",
    intro:
      "按 M 开地图、按 B 开背包、按 Tab 开排行榜 —— 按键开关是 Roblox 里被问得最多的 GUI 问题之一。机制本身只是一个 UserInputService 事件,但有两个细节让所有人踩坑:玩家在 TextBox 里打字时事件照样触发,以及开关可能同时写到了客户端和服务端。本指南给出做对的完整模式,外加对手柄友好的变体。",
    sections: [
      {
        heading: "1. 核心:UserInputService.InputBegan",
        paragraphs: [
          "UserInputService 在客户端对每次按键、点按和按钮按下触发 InputBegan。在 LocalScript 里监听它,把 input.KeyCode 和你想要的键比较,然后翻转 ScreenGui 的 Enabled 属性。机制就这么多。",
        ],
        tip: "gameProcessed 为 true 表示 Roblox 已经消费了这个输入 —— 玩家正在聊天框或 TextBox 里打字。开头就 return,菜单才不会打到一半弹出来。",
      },
      {
        heading: "2. 哪些按键适合绑定",
        paragraphs: [
          "避开 Roblox 和常见游戏已经占用的键:W A S D 和方向键(移动)、斜杠(聊天)、Escape(Roblox 菜单)、回车。M、B、I、G、K 这些字母,以及 Tab 和 Q,是常用且无冲突的选择。F 键和回车常与平台 UI 冲突。",
          "Enum.KeyCode 列出了所有可绑定的按键和手柄按钮 —— 同一段 InputBegan 代码也可以绑 Enum.KeyCode.ButtonX 来覆盖手柄玩家。",
        ],
      },
      {
        heading: "3. 带过渡地显示和隐藏",
        paragraphs: [
          "直接翻转 Enabled 是瞬间生效的。想要菜单淡入或滑入,就保持 GUI 启用、改为补间一个属性 —— CanvasGroup 的 GroupTransparency 做淡入淡出,面板的 Position 做滑动 —— 关闭补间结束后再禁用它。",
        ],
      },
      {
        heading: "4. 手柄和手机玩家",
        paragraphs: [
          "键盘不是唯一的输入。要让一个绑定同时覆盖键盘和手柄、还自带手机上的屏幕按钮,用 ContextActionService:它把一个动作名映射到多个按键码,传入标题后会在手机上自动显示触摸按钮,GUI 关闭时还能解绑。",
        ],
        tip: "BindAction 的第三个参数(这里的 true)是 createTouchButton —— 开启后手机上会出现一个带文字的圆形按钮,触发同一个处理函数。",
      },
      {
        heading: "5. 开关留在客户端",
        paragraphs: [
          "打开自己的菜单是视觉变化,所以它属于 LocalScript —— 不需要 RemoteEvent。需要跨到服务端的只有后果:如果按这个键会买东西或领奖励,那么 GUI 里的按钮照常触发 RemoteEvent、由服务端校验,和其它按钮完全一样。",
        ],
      },
    ],
    faq: [
      {
        q: "为什么在聊天框打字时 GUI 也会打开?",
        a: "你漏了 gameProcessedEvent 防护。UserInputService 传给处理函数的第二个参数,在 Roblox 已消费该输入(聊天、TextBox)时为 true。每个处理器开头都写上:if gameProcessed then return end。",
      },
      {
        q: "怎么在服务端检测按键?",
        a: "做不到 —— 输入只存在于客户端。在 LocalScript 里检测,若服务端需要响应就触发 RemoteEvent。永远不要信任客户端上报的奖励或权限;在服务端校验。",
      },
      {
        q: "UserInputService 和 ContextActionService 有什么区别?",
        a: "UserInputService 上报原始输入 —— 一个事件,你自己过滤按键。ContextActionService 把命名动作绑定到多个输入,能创建手机触摸按钮,支持优先级和重绑定。单个按键两者都行;跨平台菜单更适合 ContextActionService。",
      },
      {
        q: "能让玩家自定义按键吗?",
        a: "能 —— 存下玩家选的 Enum.KeyCode,比较时用它而不是硬编码。捕获选择的方法:玩家点击“重新绑定”按钮后,监听下一次 InputBegan 并保存 input.KeyCode。",
      },
    ],
    relatedGuides: [
      { slug: "how-to-script-a-roblox-gui", title: "如何给 Roblox GUI 写脚本(点击、开关与缓动)" },
      { slug: "how-to-make-a-roblox-main-menu-gui", title: "如何制作 Roblox 主菜单 GUI" },
      { slug: "how-to-make-a-draggable-roblox-gui", title: "如何制作可拖拽的 Roblox GUI" },
    ],
  },

  "how-to-import-rbxmx-into-roblox-studio": {
    title: "如何把 .rbxmx GUI 模型文件导入 Roblox Studio",
    description:
      "不用任何插件把 .rbxmx XML GUI 模型导入 Roblox Studio StarterGui：详细 Explorer 操作步骤、.rbxmx 与 .lua 脚本对比，以及顶部状态栏裁切与重生问题排查。",
    category: "工作流",
    customCta: {
      href: "/editor",
      label: "打开编辑器（支持免费 .lua 与 Pro .rbxmx 导出）",
    },
    intro:
      "如果你从 Roblox GUI Maker 导出了 .rbxmx 模型文件（或者收到美术/程序同事发来的 UI 模型包），直接导入 Studio 就能把现成的 ScreenGui、Frame、UIGradient 和 LocalScript 一次性放进层级树里。下面讲解正确导入 StarterGui 的步骤、.rbxmx 与纯 Luau 脚本的区别，以及导入后常见小问题排查。",
    sections: [
      {
        heading: "1. .rbxmx 模型文件与 .lua 运行时脚本怎么选",
        paragraphs: [
          ".lua GUI 脚本会在玩家进服后用 Instance.new 动态搭出界面，非常适合放进 Git 或 Rojo 团队工作流；而 .rbxmx 是 Roblox Studio 原生 XML 模型格式，导入后能立刻在视口和 Properties 面板里可视化微调圆角、渐变、描边与间距。",
        ],
      },
      {
        heading: "2. 在 Roblox Studio 里把 .rbxmx 导入 StarterGui",
        paragraphs: [
          "打开你的地图项目并展开 Explorer 面板。GUI 文件务必放进 StarterGui（绝不要直接插到 Workspace），这样 Roblox 才会自动克隆给每个进入游戏的玩家。",
          "在 StarterGui 上点击鼠标右键 -> 选择 Insert from File...（从文件插入）-> 选中你的 .rbxmx 文件（单个界面或完整 Kit 的 *-complete.rbxmx），随后按 F5 Play 即可直接测试按钮和切换逻辑。",
        ],
        tip: "请直接在 Roblox Studio 内右键 StarterGui -> Insert from File... 导入，不要在系统桌面直接双击 .rbxmx 文件。",
      },
      {
        heading: "3. 把配套服务端脚本移入 ServerScriptService",
        paragraphs: [
          "界面展示、开关与动画保留在 StarterGui 的 LocalScript 里，而扣金币、兑换码、每日签到以及 Marketplace 购买验证必须放在服务端。若你的 UI 套件压缩包内含 server/*.server.lua 文件，请在 ServerScriptService 新建 Script 粘入并在 ReplicatedStorage 建好对应 RemoteEvent。",
        ],
      },
      {
        heading: "4. 排查导入后顶部留白、重生复现或全屏点击问题",
        paragraphs: [
          "如果全屏背景上方空了一条缝，选中 ScreenGui 把 IgnoreGuiInset 改为 true；如果角色死亡重生时主菜单又自己弹出来，请把 ResetOnSpawn 改为 false；若导入了 5 屏完整 Kit，可检查其中自带的 KitScreenSwitcher LocalScript 如何控制默认启动屏。",
        ],
        tip: "由于 .rbxmx 使用 Roblox Studio 原生格式，所有组件均可完全离线导入与发布，不需要额外购买或安装任何 Studio 插件。",
      },
    ],
    faq: [
      {
        q: ".rbxmx GUI 模型应该导入到 Explorer 的哪个节点下？",
        a: "右键 StarterGui -> Insert from File... 选中 .rbxmx 文件。若误放到 Workspace 下，玩家进入游戏后屏幕上不会显示该界面。",
      },
      {
        q: "打开 .rbxmx 模型需要在 Studio 里安装插件吗？",
        a: "不需要。.rbxmx 是 Roblox 官方原生支持的 XML 模型格式，Studio 自带的 Insert from File... 即可完整还原所有实例、UICorner、UIGradient 与脚本。",
      },
      {
        q: "为什么导入的全屏菜单或加载页最顶端空了一条？",
        a: "Roblox 默认为左上角/右上角核心栏预留安全边距。选中 ScreenGui 并开启 IgnoreGuiInset = true 即可铺满整块屏幕。",
      },
      {
        q: "单屏 .rbxmx 和 UI Kit 里的 -complete.rbxmx 完整包有什么区别？",
        a: "单屏 .rbxmx 导入一个独立的 ScreenGui；而 Pro UI Kit 的 -complete.rbxmx 把全部 5 个统一风格界面和 KitScreenSwitcher 导航脚本打包在一起，导入一次按 Play 即可直接联动。",
      },
    ],
    relatedGuides: [
      { slug: "how-to-make-a-gui-in-roblox", title: "如何在 Roblox 里制作 GUI" },
      { slug: "roblox-gui-code-structure", title: "看懂 Roblox GUI 代码:Instance.new、UDim2 与 Parenting" },
      { slug: "how-to-make-a-roblox-main-menu-gui", title: "如何制作 Roblox 主菜单 GUI" },
    ],
  },

  "how-to-make-roblox-gamepass-icons": {
    title: "如何制作并上传 Roblox 通行证图标（512×512 规范）",
    description:
      "一文搞懂 Roblox 通行证（Game Pass）与徽章图标规范：512x512 尺寸、商店页圆形裁切安全区设计、Creator Dashboard 上传步骤，以及游戏内 ImageLabel 展示。",
    category: "设计",
    customCta: {
      href: "/zh/gamepass-icon-maker",
      label: "打开免费 512x512 通行证图标生成器",
    },
    intro:
      "Roblox 通行证（Game Pass）和徽章图标会同时出现在两个截然不同的位置：游戏详情页 Store 商店标签里的圆形缩略图，以及游戏内商店 GUI 里的圆角方卡。如果图标徽章或文字画得太靠四角，网页商店页一裁切就会被切掉边。下面给出 512x512 安全区标准与官方上传流程。",
    sections: [
      {
        heading: "1. 严格使用 512x512 正方形 PNG 并留出圆形安全区",
        paragraphs: [
          "导出通行证与徽章图标时统一选用 512x512 像素 1:1 正方形 PNG（支持透明通道或实底卡片），高对比度轮廓在手机端 64x64 列表缩略图里依然清晰。",
          "核心徽章、双倍字样和光圈务必收在画布中间约 82%–88% 的圆形安全区内（四周保留约 30–40px 边距），这样在网页端被强制裁成圆形时关键信息丝毫不缺，放到游戏内方卡里也同样饱满。",
        ],
      },
      {
        heading: "2. 挑选一眼看懂卖点的徽章、外框与超短标语",
        paragraphs: [
          "优秀通行证图标能让玩家半秒钟看懂功能：皇冠/VIP 代表尊贵特权、闪电/飞靴代表 2 倍速度、磁铁代表自动拾取、双剑代表双倍伤害。居中主符号最多配 1–2 个短词（例如 VIP、2X COINS），切忌在小图里塞长句子。",
        ],
        tip: "使用本站免费的通行证图标生成器（/zh/gamepass-icon-maker），可直接切换暗黑奇幻、动漫、跑酷、模拟器与科幻配色，实时开关圆形安全区预览并一键下载 512x512 PNG。",
      },
      {
        heading: "3. 在 Roblox Creator Dashboard 上传并拿到 Pass ID",
        paragraphs: [
          "登录 create.roblox.com，依次打开 Creations -> 选择你的 Experience -> Monetization -> Passes -> Create a Pass。点击 Change Image 上传你的 512x512 PNG，写好名称与简介并保存。",
          "等待图片审核通过后，复制 Pass ID 用于 PromptGamePassPurchase；如果还要在游戏内自定义商店界面展示图标，同时复制对应贴图的 rbxassetid:// Asset ID。",
        ],
      },
      {
        heading: "4. 在游戏内商店 GUI 的 ImageLabel 里无变形显示",
        paragraphs: [
          "给显示图标的 ImageLabel 设置 ScaleType = Enum.ScaleType.Fit，同时放一个 AspectRatio = 1 的 UIAspectRatioConstraint 锁定正方形比例，再把 BackgroundTransparency 设为 1 贴合你的商店卡片底色。",
        ],
      },
    ],
    faq: [
      {
        q: "Roblox Gamepass 通行证图标应该做多大分辨率？",
        a: "推荐使用 512x512 像素的 1:1 正方形 PNG 图片，清晰度足够覆盖桌面端与移动端商店页及游戏内高清卡片。",
      },
      {
        q: "为什么我上传到 Roblox 商店页面的通行证图标四周被切掉一圈？",
        a: "因为 Roblox 在游戏主页 Store 标签会给 Pass 和 Badge 图标套上圆形遮罩。所有文字与徽章边界都必须放在内切圆形安全区之内。",
      },
      {
        q: "通行证图标可以用透明背景 PNG 吗？",
        a: "完全可以。透明底 PNG 在网站商店圆形框和游戏内深色发光商店卡片里都能自然融合。",
      },
      {
        q: "Pass ID 和图片 Asset ID 有什么区别，分别怎么用？",
        a: "Pass ID 用来传给 MarketplaceService:PromptGamePassPurchase 和 UserOwnsGamePassAsync 验证购买；图片 Asset ID（rbxassetid://...）则填在游戏内 ImageLabel.Image 上显示图样。",
      },
    ],
    relatedGuides: [
      { slug: "how-to-make-a-roblox-gamepass-shop-gui", title: "如何制作 Roblox 游戏通行证（Game Pass）商店 GUI" },
      { slug: "how-to-design-polished-roblox-ui", title: "如何设计精致的 Roblox UI(渐变、描边与层次感)" },
      { slug: "how-to-make-a-roblox-shop-gui", title: "如何制作 Roblox 商店 GUI" },
    ],
  },

  "how-to-make-a-roblox-gamepass-shop-gui": {
    title: "如何制作 Roblox 游戏通行证（Game Pass）商店 GUI",
    description:
      "制作并编写 Roblox Game Pass 通行证商店 GUI：三列/网格卡片排版、MarketplaceService:PromptGamePassPurchase 拉起 Robux 弹窗、已拥有状态同步与服务端校验。",
    category: "商店",
    intro:
      "与扣游戏金币的普通商店不同，Game Pass（通行证）商店直接调用 Roblox 原生 MarketplaceService 弹出 Robux 购买确认。做得好的通行证商店能清晰突出主力 VIP/双倍卡、购买后立刻切换成 OWNED 已拥有状态，并在玩家进服与中途购买时由服务端可靠发放永久特权。",
    sections: [
      {
        heading: "1. 排版通行证卡片与高价值高亮区",
        paragraphs: [
          "用 UIListLayout 或等分 Scale 卡片呈现每个通行证：上方配 1:1 正方形 512x512 通行证图标，中间是名称和 1 句核心收益（如“永久 +100% 金币收益”），底部配高对比度 Robux 购买按钮；主力 VIP 卡可以叠加金色或电蓝色 UIGradient 与 UIStroke 提升点击转化。",
        ],
      },
      {
        heading: "2. 在 LocalScript 里安全唤起 Robux 购买弹窗",
        paragraphs: [
          "把所有 PassId 统一放进 ReplicatedStorage 配置表。玩家点击购买按钮前，先通过 pcall 检查 UserOwnsGamePassAsync：若已拥有则把按钮直接灰显为 OWNED，否则调用 MarketplaceService:PromptGamePassPurchase(localPlayer, passId)。",
        ],
      },
      {
        heading: "3. 监听 PromptGamePassPurchaseFinished 即时刷新已购买状态",
        paragraphs: [
          "在客户端同时监听 MarketplaceService.PromptGamePassPurchaseFinished，核对 player == localPlayer 且 wasPurchased == true 后，立刻把按钮改写成 OWNED 并禁用重复点击，玩家不用重进服务器就能看到变化。",
        ],
        tip: "绝对不要只靠客户端脚本发双倍属性或 VIP 称号！所有实质加成与权限都必须在 ServerScriptService 里独立核验并生效。",
      },
      {
        heading: "4. 在 ServerScriptService 为新进服与即时购买玩家发放特权",
        paragraphs: [
          "服务端 Script 在 Players.PlayerAdded 时用 pcall 查询一次 UserOwnsGamePassAsync 并把状态缓存到 Player Attribute（如 HasVIP = true），同时监听服务端 PromptGamePassPurchaseFinished 做到进服必有、中途买完秒发。",
        ],
      },
    ],
    faq: [
      {
        q: "怎么在 Roblox Studio 里免费测试 Game Pass 购买流程？",
        a: "直接在 Studio 里按 Play 运行测试，调用 PromptGamePassPurchase 会弹出虚拟免费测试购买框（不扣真实 Robux），确认后同样会正常触发 PromptGamePassPurchaseFinished（wasPurchased = true）。",
      },
      {
        q: "为什么频繁调用 UserOwnsGamePassAsync 会报错或被限流？",
        a: "UserOwnsGamePassAsync 需要访问 Roblox 线上接口。正确方式是进服 PlayerAdded 时用 pcall 检查并缓存在玩家 Attribute 里，购买完成事件里再同步更新该缓存。",
      },
      {
        q: "Game Pass 和 Developer Product（开发者商品）脚本有什么区别？",
        a: "永久只买一次的特权（如 VIP、双倍金币）用 Game Pass 和 PromptGamePassPurchase；可无限重复购买的消耗品（如金币礼包、十连抽）要用 Developer Product 和 MarketplaceService.ProcessReceipt。",
      },
      {
        q: "去哪里制作适配 Game Pass 商店卡片的配套图标？",
        a: "访问本站免费的 Roblox 通行证图标生成器（/zh/gamepass-icon-maker），挑选徽章与配色导出 512x512 PNG / SVG，或配合 5 屏 Pro UI Kit 成套下载。",
      },
    ],
    relatedGuides: [
      { slug: "how-to-make-roblox-gamepass-icons", title: "如何制作并上传 Roblox 通行证图标（512×512 规范）" },
      { slug: "how-to-make-a-roblox-shop-gui", title: "如何制作 Roblox 商店 GUI" },
      { slug: "how-to-import-rbxmx-into-roblox-studio", title: "如何把 .rbxmx GUI 模型文件导入 Roblox Studio" },
    ],
  },
};

// Overlays the Chinese prose onto the English Guide, keeping the English Luau
// `code` blocks (and any section the zh data omits). Returns a full Guide so the
// zh view can consume the same type as the English guide page.
export function getGuideZh(slug: string): Guide | undefined {
  const en = getGuide(slug);
  const zh = GUIDES_ZH_PROSE[slug];
  if (!en || !zh) return undefined;
  return {
    ...en,
    title: zh.title,
    metaTitle: zh.metaTitle ?? en.metaTitle,
    description: zh.description,
    category: zh.category,
    customCta: zh.customCta ?? en.customCta,
    intro: zh.intro,
    sections: en.sections.map((s, i) => ({
      ...s,
      heading: zh.sections[i]?.heading ?? s.heading,
      paragraphs: zh.sections[i]?.paragraphs ?? s.paragraphs,
      tip: zh.sections[i]?.tip ?? s.tip,
    })),
    faq: zh.faq,
    relatedGuides: zh.relatedGuides ?? en.relatedGuides,
  };
}
