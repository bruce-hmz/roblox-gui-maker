// Chinese (zh) prose for guides. Only the translated strings live here; the
// Luau `code` blocks are kept from the English Guide via getGuideZh() overlay
// (no code duplication). Slugs match guides-data.ts exactly. Roblox API
// identifiers (ScreenGui, UIGradient, UDim2, RemoteEvent, …) stay in English
// inside the Chinese prose, matching the existing zh homepage.

import { getGuide, type Guide } from "./guides-data";

type GuideZhSection = { heading: string; paragraphs?: string[]; tip?: string };

type GuideZhProse = {
  title: string;
  description: string;
  category: string;
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
      "用 ScrollingFrame、UIGridLayout 做统一格子、过滤标签,以及从脚本运行时填充数据,搭建一个 Roblox 背包 GUI —— 附可直接复制的 Luau。",
    category: "HUD",
    intro:
      "背包把玩家拥有的所有东西显示成一排可点击装备或使用的格子。它的结构是一个 ScrollingFrame,里面用 UIGridLayout 排出统一尺寸的格子,外加一个模板格子,由你的脚本按每件物品克隆一次。本指南用 Luau 搭一个,并对应编辑器里的 inventory 模板。",
    sections: [
      {
        heading: "1. 用 ScrollingFrame + UIGridLayout 做统一格子",
        paragraphs: [
          "ScrollingFrame 是可滚动容器;里面的 UIGridLayout 会自动把每个子元素排成统一网格。CellSize 和 CellPadding 设一次,任意数量的格子都能正确平铺。",
        ],
      },
      {
        heading: "2. 每件物品克隆一个模板格子",
        paragraphs: [
          "做一个格子 Frame(带 UICorner 和一个 ImageLabel 当图标),把它当作模板保留。为每件拥有的物品克隆它,而不是内联构造每个格子 —— 这样布局代码很小,而且每个格子都一模一样。",
        ],
        tip: "用 Slot_<物品id> 这样的命名约定,这样你的脚本能按 id 找到、装备或移除格子。",
      },
      {
        heading: "3. 从玩家数据填充格子",
        paragraphs: [
          "遍历玩家拥有的物品,克隆模板,设置图标和名字,然后把它挂到 ScrollingFrame 下。UIGridLayout 会自动定位,画布随 AutomaticCanvasSize 增长。",
        ],
      },
    ],
    faq: [
      {
        q: "运行时怎么增删物品?",
        a: "克隆模板格子并挂到 ScrollingFrame 下即增加;对格子调用 Destroy() 即移除。UIGridLayout 会自动重排剩余格子。",
      },
      {
        q: "怎么显示当前装备的是哪件?",
        a: "给模板格子加一个初始透明的 UIStroke,在玩家点击的格子上把它的 Transparency 关掉。彩色描边就是一个清晰的选择边框。",
      },
    ],
    relatedGuides: [{ slug: "how-to-use-uilistlayout-in-roblox", title: "如何在 Roblox 里使用 UIListLayout" }],
  },

  "how-to-make-a-roblox-code-redeem-gui": {
    title: "如何制作 Roblox 兑换码 GUI",
    description:
      "做一个 Roblox 兑换码/创作者码 GUI:一个 TextBox 输入、一个到服务器的 RemoteEvent、以及服务端校验和发放奖励 —— 附可直接复制的 Luau。",
    category: "菜单",
    intro:
      "兑换码面板让玩家输入一个兑换码或创作者码并领取奖励。界面很简单 —— 一个 TextBox 加一个兑换按钮 —— 但安全是单向的:客户端只发送码,由服务器决定是否有效并发放奖励。本指南用 Luau 搭好两端。",
    sections: [
      {
        heading: "1. TextBox 输入和兑换按钮",
        paragraphs: [
          "TextBox 收集码,TextButton 发起请求。点击时读取输入框文本,通过 RemoteEvent 发给服务器。",
        ],
      },
      {
        heading: "2. 在服务端校验兑换码",
        paragraphs: [
          "把有效码及其奖励放在一个服务端 Script 里。对传入的码做规范化(转大写、去空格),查表,未知就忽略。客户端永远看不到这个列表。",
        ],
        tip: "永远不要信任客户端。只有服务器知道哪些码有效,也必须由它来发放金币或物品。",
      },
      {
        heading: "3. 把结果反馈给玩家",
        paragraphs: [
          "发放后,通过 RemoteEvent(或 RemoteFunction 返回)回传客户端,让 UI 显示“已领取奖励”或“兑换码无效”。奖励逻辑留在服务端,提示信息留在客户端。",
        ],
      },
    ],
    faq: [
      {
        q: "为什么必须由服务器校验兑换码?",
        a: "客户端可能被作弊者修改。如果由客户端决定奖励,任何人都能给自己发任何东西。服务器才是有效码和已发奖励的唯一真相来源。",
      },
      {
        q: "怎么让兑换码过期或只能用一次?",
        a: "在 DataStore 里按玩家记录兑换情况(或在全局过期后从表里移除该码)。发放前在服务端检查。",
      },
    ],
    relatedGuides: [{ slug: "how-to-make-a-roblox-shop-gui", title: "如何制作 Roblox 商店 GUI" }],
  },

  "how-to-make-a-roblox-daily-rewards-gui": {
    title: "如何制作 Roblox 每日奖励 GUI",
    description:
      "搭建一个 Roblox 每日奖励/连签日历 GUI:一个 7 天网格,带已领、当日、未解锁三种状态,服务端连签追踪,以及一个领取 RemoteEvent —— 附 Luau。",
    category: "菜单",
    intro:
      "每日奖励界面显示一排天数卡片 —— 已领的天数变暗、今天可领、未来的天数锁定 —— 加一个领取按钮。视觉状态只是背景色的区别;真正的逻辑在服务端:记录玩家上次领取的时间和连签天数,只有进入了新一天才发放奖励。",
    sections: [
      {
        heading: "1. 一个带视觉状态的 7 天网格",
        paragraphs: [
          "每天是一个按状态上色的 Frame:已领(变暗)、当日(高亮)、未解锁(弱化)。用 UIListLayout 或手动位置排列 —— 编辑器的 daily-rewards 模板已经替你做好了。",
        ],
      },
      {
        heading: "2. 在服务端追踪连签",
        paragraphs: [
          "按玩家存储 lastClaimTime 和 streak(DataStore)。收到领取请求时,把服务器时间和上次领取对比:不到一天就忽略;在两天以内就推进连签;否则重置为第 1 天。",
        ],
        tip: "天的边界永远用 os.time()(服务器时钟)。客户端的时钟可能不准或被篡改。",
      },
      {
        heading: "3. 把结果反映到 UI",
        paragraphs: [
          "服务器发放后,把新的连签天数和上次领取日告诉客户端。客户端重新给天数卡片上色(把今天标为已领、高亮明天),让日历和服务端的真实状态保持同步。",
        ],
      },
    ],
    faq: [
      {
        q: "怎么在多次会话间保存连签?",
        a: "把 lastClaimTime 和 streak 存到按 UserId 索引的 DataStore 里。玩家加入时加载,每次领取后保存。",
      },
      {
        q: "玩家漏了一天会怎样?",
        a: "由你决定:把连签重置为 1,或者在宽限期内(比如两天)保留。上面的代码在隔了两天后重置。",
      },
    ],
    relatedGuides: [{ slug: "how-to-make-a-roblox-shop-gui", title: "如何制作 Roblox 商店 GUI" }],
  },

  "how-to-make-a-roblox-quest-tracker-gui": {
    title: "如何制作 Roblox 任务追踪 HUD",
    description:
      "做一个 Roblox 任务追踪 HUD:一个常驻角落面板,带目标、实时补间进度条,以及展开/收起开关 —— 附可直接复制的 Luau。",
    category: "HUD",
    intro:
      "任务追踪器是一个钉在屏幕角落的小面板,显示当前目标和一条随进度增长的进度条。它在游玩过程中一直可见,所以必须紧凑。本指南搭建这个 HUD、一条平滑的进度条,以及一个展开/收起详情的开关。",
    sections: [
      {
        heading: "1. 一个紧凑的角落面板",
        paragraphs: [
          "用 AnchorPoint 加基于 scale 的 Position 把面板锚定在角落,这样在任何屏幕尺寸上都紧贴边缘。一个 TextLabel 放目标,一对嵌套 Frame(背景+填充)做进度条。",
        ],
      },
      {
        heading: "2. 一条会补间的进度条",
        paragraphs: [
          "进度条是一个背景 Frame 加一个子填充 Frame。更新进度时,把填充的 Size 在 X 轴 scale 上从当前值补间到新比例 —— TweenService 让它滑过去而不是跳变。",
        ],
        tip: "保持 HUD 小巧且不挡游玩区域。锚定角落并用 scale 尺寸,这样手机和桌面落点一致。",
      },
      {
        heading: "3. 从游戏事件更新,并收起详情",
        paragraphs: [
          "用你的游戏事件(捡到物品、击败敌人)驱动 setProgress,让进度条实时动。加一个开关按钮,用显示/隐藏动作控制一个详情面板 —— 编辑器会替你生成那段 Luau,你还可以用 scale 过渡给它加动画。",
        ],
      },
    ],
    faq: [
      {
        q: "怎么让进度条平滑填充?",
        a: "用 TweenService:Create 作用于填充 Frame 的 Size,从当前 X scale 补间到新比例。0.3 秒的 Quad 缓动看起来跟手又不抖。",
      },
      {
        q: "怎么知道任务完成了?",
        a: "进度到达目标时,触发一个 BindableEvent(服务端)或在客户端检查,然后发放奖励、标记任务完成,并隐藏或重新上色追踪器。",
      },
    ],
    relatedGuides: [{ slug: "how-to-animate-roblox-guis-with-tweenservice", title: "如何用 TweenService 给 Roblox GUI 加动画" }],
  },

  "how-to-make-a-roblox-main-menu-gui": {
    title: "如何制作 Roblox 主菜单 GUI",
    description:
      "一步步来:用 ScreenGui、居中面板、标题和用 UIListLayout 堆叠的 Play/Settings 按钮,搭建一个 Roblox 主菜单 GUI,外加处理按钮点击的 Luau。",
    category: "菜单",
    intro:
      "主菜单是玩家加入你游戏后看到的第一样东西。本指南用 Luau 从零搭一个 —— 一个 ScreenGui 容器、一个居中面板、一个标题,以及用 UIListLayout 自动堆叠的 Play / Settings 按钮。你也可以从编辑器里现成的主菜单模板开始再自定义。",
    sections: [
      {
        heading: "1. 创建 ScreenGui 容器",
        paragraphs: [
          "每个屏幕界面都装在一个 ScreenGui 里。把它放进本地玩家的 PlayerGui 让它渲染在他的屏幕上,并把 ResetOnSpawn 设为 false,让菜单在重生后依然存在。",
        ],
      },
      {
        heading: "2. 加一个居中面板和标题",
        paragraphs: [
          "一个 Frame 当菜单背景,UICorner 给它圆角,一个 TextLabel 显示游戏标题。AnchorPoint 0.5,0.5 加 Position 0.5,0.5 让面板正好居中在屏幕上。",
        ],
      },
      {
        heading: "3. 用 UIListLayout 堆叠按钮",
        paragraphs: [
          "往面板里放一个 UIListLayout,之后你加的每个子元素都会自动堆叠 —— 无需手动定位。设 Padding 控制间距,HorizontalAlignment 居中它们。",
        ],
      },
      {
        heading: "4. 让按钮做点事",
        paragraphs: [
          "每个按钮是一个 TextButton。连接 MouseButton1Click,在玩家点击时执行代码 —— 这里 PLAY 会隐藏菜单并开始游戏。",
        ],
        tip: "用 gui.Enabled = false 隐藏菜单并保留它,或者如果你再也不会显示它就用 gui:Destroy()。",
      },
    ],
    faq: [
      {
        q: "怎么让菜单在屏幕上居中?",
        a: "把面板的 AnchorPoint 设为 Vector2.new(0.5, 0.5),Position 设为 UDim2.fromScale(0.5, 0.5)。面板就会以自己的中点而不是左上角居中。",
      },
      {
        q: "为什么重生后菜单就没了?",
        a: "ScreenGui 默认在重生时重置。在 ScreenGui 上设 ResetOnSpawn = false 让它常驻。",
      },
    ],
  },

  "how-to-make-a-roblox-shop-gui": {
    title: "如何制作 Roblox 商店 GUI",
    description:
      "搭建一个 Roblox 商店 GUI:一个用 UIGridLayout 自动平铺物品的 ScrollingFrame、带图片和价格的物品格,以及一个让购买真正在服务端生效的 RemoteEvent。",
    category: "商店",
    intro:
      "一个商店需要三样东西:一个可滚动区域、自动排成网格的物品,以及一个让购买真正发生的途径。本指南用 ScrollingFrame + UIGridLayout 搭界面,再通过 RemoteEvent 接好购买动作让服务器校验它。从商店模板开始可以跳过布局工作。",
    sections: [
      {
        heading: "1. 面板和可滚动网格",
        paragraphs: [
          "一个 Frame 装下所有东西;ScrollingFrame 是放物品的地方。给 ScrollingFrame 加一个 UIGridLayout,每个物品格就会自动平铺成网格 —— 加多少物品都会重排。",
        ],
      },
      {
        heading: "2. 一个物品格",
        paragraphs: [
          "每个物品是一个 Frame,带一个 ImageLabel、一个价格标签和一个购买按钮。因为有 UIGridLayout,只要把它挂到 ScrollingFrame 下就自动落位到网格里。",
        ],
      },
      {
        heading: "3. 通过 RemoteEvent 接通购买",
        paragraphs: [
          "永远不要把钱财交给客户端。购买按钮触发一个 RemoteEvent;服务器检查玩家买得起、扣除货币、发放物品。",
        ],
        tip: "购买永远在服务端校验。客户端可以用任意 itemId 触发 RemoteEvent,所以服务器必须重新核对价格和归属。",
      },
    ],
    faq: [
      {
        q: "怎么让商店平滑滚动?",
        a: "用带 AutomaticCanvasSize = Enum.AutomaticSize.Y 的 ScrollingFrame,再用 UISizeConstraint 或 UIGridLayout 的格子来定义高度。ScrollBarThickness 控制滚动条宽度。",
      },
      {
        q: "物品怎么排成网格?",
        a: "给 ScrollingFrame 挂一个 UIGridLayout。设 CellSize 和 CellPadding;每个子 Frame 就会自动排成行列。",
      },
    ],
  },

  "how-to-make-a-roblox-loading-screen-gui": {
    title: "如何制作 Roblox 加载界面 GUI",
    description:
      "做一个 Roblox 加载界面:一个全屏带渐变的 Frame、标题、一条用 TweenService 动画的进度条和一条轮播提示,游戏就绪后移除它。",
    category: "菜单",
    intro:
      "加载界面在资源流入时盖住整个视口。本指南搭一个带渐变背景的全屏 Frame、一个大标题、一条填充从 0 补间到满的进度条,以及一行提示。游戏就绪后,你销毁这个 GUI。另外也有一个加载界面模板可以从头开始。",
    sections: [
      {
        heading: "1. 全屏背景和标题",
        paragraphs: [
          "在 ScreenGui 上设 IgnoreGuiInset = true,让 Frame 盖住整个视口(包括顶部状态栏)。背景 Frame 上加一个 UIGradient 给它层次感。",
        ],
      },
      {
        heading: "2. 进度条",
        paragraphs: [
          "进度条是两个 Frame:一条暗色轨道和一条彩色填充。填充从 Scale 0 宽度开始,随加载推进把它补间上去。",
        ],
      },
      {
        heading: "3. 加上动画并清理",
        paragraphs: [
          "用 TweenService 让填充增长。加载完成后 Destroy 这个 GUI,让它彻底消失。",
        ],
        tip: "在真实游戏里,用实际的资源加载进度驱动填充,而不是固定计时器,这样它不会在游戏就绪前就跑完。",
      },
    ],
    faq: [
      {
        q: "怎么连顶部状态栏也盖住?",
        a: "在 ScreenGui 上设 IgnoreGuiInset = true。那么第一个 Size 为 UDim2.fromScale(1,1) 的 Frame 就盖住整个视口。",
      },
      {
        q: "怎么给进度条加动画?",
        a: "用 TweenService 把填充 Frame 的 Size 从 UDim2.fromScale(0,1) 补间到 UDim2.fromScale(1,1),然后在 tween.Completed 里 Destroy 这个 GUI。",
      },
    ],
  },

  "how-to-use-uilistlayout-in-roblox": {
    title: "如何在 Roblox 里使用 UIListLayout",
    description:
      "UIListLayout 会自动把容器的子元素排成一行或一列。学习关键属性 —— FillDirection、Padding、对齐、SortOrder —— 附一个可运行的 Luau 示例。",
    category: "布局",
    intro:
      "UIListLayout 是 Roblox 里自动把一个 Frame 的子元素按纵向列表或横向一行排开的对象。你不用手动给每个按钮定位,只要往容器里放一个 UIListLayout,子元素就自己排好。本指南讲解那些重要的属性和一个完整示例。",
    sections: [
      {
        heading: "1. 把它放进容器",
        paragraphs: ["UIListLayout 是它所控制容器的子元素。一旦挂上去,每个同级的 Frame、按钮或标签都会被排好。"],
      },
      {
        heading: "2. 方向、间距和对齐",
        paragraphs: [
          "FillDirection 选纵向或横向。Padding 设子元素之间的间距。HorizontalAlignment 和 VerticalAlignment 在容器内定位整组排列。",
        ],
      },
      {
        heading: "3. 用 SortOrder 控制顺序",
        paragraphs: [
          "默认子元素按布局顺序、再按名字排序。把 SortOrder 设为 LayoutOrder,给每个子元素一个 LayoutOrder 数字,就能控制确切顺序。",
        ],
        tip: "把 UIListLayout 和同一容器上的 UIPadding 搭配,让整组排列离边缘留白 —— 不用给每个子元素加外边距。",
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
    ],
  },

  "how-to-make-a-roblox-global-leaderboard-gui": {
    title: "如何制作 Roblox 全局排行榜 GUI",
    description:
      "用 OrderedDataStore 搭建一个跨服给所有玩家排名的全局 Roblox 排行榜,然后在 GUI 里显示前列 —— 附保存、排序和渲染行的完整 Luau。",
    category: "数据",
    intro:
      "全局排行榜按某个统计(比如总金币)给每个玩家排名,而且排名跨服保留。难的不是 GUI —— 而是用 OrderedDataStore 存储可排序数据并把前列玩家读回来。本指南覆盖完整闭环:保存分数、取前 10 名、把它们渲染成行。从排行榜模板开始可以得到行布局。",
    sections: [
      {
        heading: "1. 用 OrderedDataStore 存储可排名数据",
        paragraphs: ["OrderedDataStore 保持值可排序。用玩家的 UserId 当键、分数当值,这样每个玩家只出现一次。"],
      },
      {
        heading: "2. 读取前列玩家",
        paragraphs: [
          "GetSortedAsync 按顺序返回条目。传 false 表示降序(最高在前)和页大小。GetCurrentPage 给出排好序的 { key, value } 列表。",
        ],
        tip: "GetNameFromUserIdAsync 是一次网络调用 —— 把名字缓存起来,免得每次刷新都重新拉同一个玩家。",
      },
      {
        heading: "3. 把列表发给客户端并生成行",
        paragraphs: [
          "用一个 RemoteEvent 把前列列表发出去;每个客户端按条目生成一行。因为面板有 UIListLayout,挂上每一行就自动堆叠。",
        ],
      },
    ],
    faq: [
      {
        q: "全局排行榜多久刷新一次?",
        a: "OrderedDataStore 有严格的速率限制。缓存前列列表,用服务端循环每 30–60 秒刷新一次,绝不要在每次分数变化时刷新。",
      },
      {
        q: "为什么一个玩家出现了两次?",
        a: "你用了 UserId 以外的东西当键。永远用 tostring(player.UserId) 当键,这样每个玩家正好对应一条记录。",
      },
    ],
  },

  "how-to-animate-roblox-guis-with-tweenservice": {
    title: "如何用 TweenService 给 Roblox GUI 加动画",
    description:
      "让 Roblox GUI 更有质感:让面板从屏外滑入、淡入弹出、串联动画 —— 全靠 TweenService 和合适的 EasingStyle。",
    category: "动画",
    intro:
      "静态的 GUI 显得扁平。TweenService 会在时间推移中插值 Position、Size、透明度等属性,所以菜单能滑入、按钮能弹出、通知能淡入。本指南讲解几乎所有 Roblox UI 动画背后的三种模式。",
    sections: [
      {
        heading: "1. 让面板滑入到位",
        paragraphs: ["先把面板放在屏外,再把它的 Position 补间到最终位置。TweenInfo 控制时长和缓动。"],
      },
      {
        heading: "2. 用 Size 淡入弹出",
        paragraphs: [
          "把 Size 从小补间到满,BackgroundTransparency 从 1 补间到 0,就是弹入效果。多个属性可以放在同一个补间里。",
        ],
      },
      {
        heading: "3. 用 Completed 串联动画",
        paragraphs: ["连接到一个补间的 Completed 信号来启动下一个 —— 适合做“先入场再揭示”。"],
        tip: "EasingStyle 很影响观感:Back 会过冲(俏皮)、Quad 平滑、Elastic 弹跳。按情绪选,别随便挑。",
      },
    ],
    faq: [
      {
        q: "能给 TextColor3 或颜色做补间吗?",
        a: "能 —— TweenService 给 TextColor3、BackgroundColor3 等 Color3 属性做动画的方式和给 Position 做的一样。",
      },
      {
        q: "怎么让动画永远循环?",
        a: "在 TweenInfo 里设 Reverses = true 和 RepeatCount = -1,补间就会来回不停地跑。",
      },
    ],
  },

  "how-to-make-a-draggable-roblox-gui": {
    title: "如何制作可拖拽的 Roblox GUI",
    description:
      "用 UserInputService 让玩家用鼠标或触屏把一个 Roblox GUI Frame 在屏幕上拖来拖去 —— 包括防止它跳到光标位置的偏移修正。",
    category: "交互",
    intro:
      "一个可拖拽的窗口、背包或设置面板用起来很原生。诀窍在 UserInputService:按下开始拖、InputChanged 时移动 Frame、松开停止。关键细节是在开始时记录光标和 Frame 之间的偏移,这样它不会一下子吸到角落。",
    sections: [
      {
        heading: "1. 追踪按下、移动和松开",
        paragraphs: [
          "在标题栏(不是整个面板)上监听,这样里面的按钮还能用。InputBegan 开始拖;UserInputService.InputChanged 移动它;InputEnded 停止。",
        ],
      },
      {
        heading: "2. 让 Frame 跟着光标移动",
        paragraphs: [
          "在 InputChanged 里,把光标自 dragStart 以来的位移加到 Frame 的起始位置上。在 UDim2.new 里混合 Scale 和 Offset,无论 Frame 原本怎么定位都能正常工作。",
        ],
        tip: "用一个标题栏 Frame 来拖动,而不是整个面板 —— 否则拖动会吞掉里面按钮的点击。",
      },
    ],
    faq: [
      {
        q: "为什么抓取时 Frame 会跳到光标位置?",
        a: "你把 Position 直接设成了光标位置。正确做法是在拖动开始时记录 startPos = frame.Position,再把光标的位移(delta)加到它上面,这样 Frame 保留它的抓取点。",
      },
      {
        q: "这在手机上能用吗?",
        a: "能 —— 在 InputBegan 和 InputEnded 里把 Enum.UserInputType.Touch 当成 MouseButton1 一样处理,在 InputChanged 里处理 Touch。",
      },
    ],
  },

  "how-to-make-a-responsive-roblox-gui": {
    title: "如何制作响应式的 Roblox GUI",
    description:
      "做一个在手机、平板、桌面都好看的 Roblox GUI:用 Scale 而非 Offset 定尺寸、用 AnchorPoint 居中、用 UITextSizeConstraint 限制文字、用 UIScale 缩小整段。",
    category: "布局",
    intro:
      "Roblox 跑在从手机到 4K 显示器的各种设备上,所以用固定像素尺寸搭的 GUI 在不对的屏幕上就会错位。解决办法是用 Scale(屏幕的几分之几)而不是 Offset(像素)来思考,锚定元素让它们重新居中,限制文字让它保持可读。本指南讲解每个响应式 Roblox UI 背后的四个习惯。",
    sections: [
      {
        heading: "1. 用 Scale 而不是 Offset 定尺寸",
        paragraphs: [
          "UDim2 有一个 Scale 分量和一个 Offset 分量。fromScale(0.4, 0.6) 表示屏幕的 40%/60% —— 它会自适应。fromOffset(400, 600) 表示固定像素 —— 它不会。",
        ],
      },
      {
        heading: "2. 用 AnchorPoint 居中",
        paragraphs: [
          "Position 0.5, 0.5 把左上角放在屏幕中心。设 AnchorPoint 0.5, 0.5,元素就以自己的中点居中。",
        ],
      },
      {
        heading: "3. 保持文字可读",
        paragraphs: [
          "TextScaled 会让文字放大到填满它的框,在大屏上会变得很大。一个 UITextSizeConstraint 给最大字号设上限,让它保持整洁。",
        ],
        tip: "编辑器的 桌面 / 平板 / 手机 切换能在每种视口预览同一个 GUI —— 用 Scale 搭建,三种都检查一遍。",
      },
    ],
    faq: [
      {
        q: "为什么我的 GUI 在手机上很小?",
        a: "它是用 Offset(像素)定尺寸的。改用 UDim2.fromScale 的 Scale,让 GUI 是屏幕的几分之几,从而适配每种设备。",
      },
      {
        q: "怎么在小屏上缩小整个 GUI?",
        a: "给 ScreenGui 挂一个 UIScale 并设它的 Scale 属性(比如 0.8),一起缩小所有后代 —— 适合在手机上塞下密集的 HUD。",
      },
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
    description: zh.description,
    category: zh.category,
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
