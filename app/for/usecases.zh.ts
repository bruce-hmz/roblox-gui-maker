// Chinese (zh) prose for use-case landing pages. Slugs match usecases.ts;
// getUseCaseZh() overlays zh prose on the English UseCase, keeping `properties`
// (Roblox API names — not translated), `template`, and `relatedGuide` from en.

import { getUseCase, type UseCase } from "./usecases";

type UseCaseZhProse = {
  title: string;
  noun: string;
  blurb: string;
  metaDescription?: string;
  needs: string[];
  howTo: string[];
  tips: string[];
};

const USE_CASES_ZH_PROSE: Record<string, UseCaseZhProse> = {
  "main-menus": {
    title: "Roblox GUI Maker:主菜单",
    noun: "主菜单",
    blurb:
      "主菜单是玩家加入后第一眼看到的东西。它需要标题、一个清晰的主操作(Play),以及整齐堆叠的次要按钮 —— 还得有模有样。",
    needs: [
      "一个居中面板,带标题和一摞操作按钮",
      "能打开或关闭其它面板的按钮(设置、制作人员)",
      "基于 scale 的尺寸,在手机和桌面上都居中",
    ],
    howTo: [
      "把 ScreenGui 和 Frame 拖到画布上。把 Frame 的 AnchorPoint 设为 0.5, 0.5、Position 设为 {0.5, 0}, {0.5, 0},这样它在每种屏幕上都居中。",
      "顶部放一个 TextLabel 当游戏标题,然后用带 Padding 的 UIListLayout 把 TextButton 在下面堆叠起来。",
      "给每个按钮接上显示/隐藏其它面板 —— 编辑器会替你生成显示/隐藏的 Luau。",
      "导出 Luau,把客户端脚本粘进 StarterGui,在桌面和手机视口都测一下。",
    ],
    tips: [
      "主 Frame 用 UDim2.fromScale 让它在所有设备上缩放,再用 UDim2.fromOffset 微调内边距。",
      "给 Frame 边框加一个 UIStroke,免图片就有干净边缘。",
      "按钮文字要短 —— 「Play」「Settings」「Quit」 —— 手机上长标签会很挤。",
    ],
  },

  "shop-menus": {
    metaDescription:
      "用 Roblox GUI Maker 做商店菜单:一个可滚动区域,物品在里面排成网格,每个带图标和价格,外加一种让购买真正到达服务器的途径。",
    title: "Roblox GUI Maker:商店菜单",
    noun: "商店菜单",
    blurb:
      "商店需要一个可滚动区域,物品在里面排成网格,每个带图标和价格,外加一种让购买真正到达服务器的途径。",
    needs: [
      "一个子物品用 UIGridLayout 自动平铺的 ScrollingFrame",
      "可复用的物品格(图标 + 价格 + 购买按钮)",
      "一个让服务器校验并发放购买的 RemoteEvent",
    ],
    howTo: [
      "从一个填满大半屏的 ScreenGui 和 ScrollingFrame 开始。在里面加一个 UIGridLayout 让子 Frame 自动平铺。",
      "做一个物品格 Frame,里面放一个 ImageLabel(图标)、一个 TextLabel(价格)、一个 TextButton(购买)。每件物品复制一个。",
      "在 ReplicatedStorage 里加一个 RemoteEvent。编辑器会生成点击时触发它的客户端 LocalScript 和监听它的服务端 Script。",
      "导出两份脚本。LocalScript 放 StarterGui 下,Script 放 ServerScriptService 下。",
    ],
    tips: [
      "UIGridLayout.CellSize 用 scale 值让物品在手机上缩放。一个好的起点是 {0, 150}, {0, 180}。",
      "物品图标加 UIAspectRatioConstraint,这样无论 Frame 多大都保持正方形。",
      "购买永远在服务端校验 —— 经济动作绝不信任客户端。",
    ],
  },

  "inventory-screens": {
    title: "Roblox GUI Maker:背包界面",
    noun: "背包界面",
    blurb:
      "背包把玩家拥有的所有东西显示出来,通常是一排可点击装备或使用的格子。增删物品,网格应自动重排,不用手动调布局。",
    needs: [
      "一个统一格子的固定 UIGridLayout",
      "物品多过一屏时可滚动",
      "能从脚本运行时填充的格子单元",
    ],
    howTo: [
      "建一个带 UIGridLayout 的 ScrollingFrame。CellSize 设成方形如 {0, 100}, {0, 100},CellPadding 设成 {0, 8}, {0, 8}。",
      "做一个格子 Frame,带 BackgroundColor3、UICorner 和放 ImageLabel 的空间。这是你的模板格。",
      "顶部加过滤标签 —— 用一排 TextButton 的 UIListLayout。每个标签接上显示/隐藏对应格子。",
      "导出,在游戏脚本里接好填充逻辑 —— 遍历玩家数据克隆格子模板。",
    ],
    tips: [
      "格子用一致的命名(Slot1、Slot2…),游戏脚本能按索引找到。",
      "加一个选中态高亮 —— 玩家点格子时出现的 UIStroke。",
      "大背包考虑在网格上方加一行分类过滤,减少视觉杂乱。",
    ],
  },

  "simulator-huds": {
    title: "Roblox GUI Maker:模拟器 HUD",
    noun: "模拟器 HUD",
    blurb:
      "模拟器 HUD 把货币、属性和动作按钮塞进屏幕四角,并每帧更新。它整局都在屏上,所以必须紧凑、清晰。",
    needs: [
      "锚定在角落的货币和属性读数",
      "常驻动作按钮(转生、宠物、商店)",
      "小巧、绝不挡游玩的画面占用",
    ],
    howTo: [
      "把 ScreenGui 拖到画布上。用 AnchorPoint 和带 scale 值的 Position 加角落 Frame,锚到左上和右上。",
      "为货币(金币、宝石)加 TextLabel,每个旁边一个 ImageLabel 图标。多个属性用 UIListLayout 堆叠。",
      "动作按钮(转生、宠物、商店)放底部或侧栏。Size 用 offset 让它们保持固定的、好点的尺寸。",
      "导出,把你游戏的属性变化事件接上,实时更新 TextLabel.Text。",
    ],
    tips: [
      "HUD 元素放在安全区 —— 避开顶部 60px(Roblox CoreGui 偏移)和底部 40px(聊天栏)。",
      "用 UITextSizeConstraint 防止文字在小屏上变得不可读。",
      "相关属性归到一个半透明 Frame 里,读起来是一个整体。",
    ],
  },

  "settings-panels": {
    title: "Roblox GUI Maker:设置面板",
    noun: "设置面板",
    blurb:
      "设置面板让玩家调音乐、音效、粒子 —— 通常是一排行,每行一个标签和一个开关。它从菜单打开,关回菜单。",
    needs: [
      "用 UIListLayout 堆叠的行(每行标签 + 开关)",
      "接在按钮上的打开/关闭行为",
      "UIPadding,让内容不贴边",
    ],
    howTo: [
      "建一个宽约为屏幕 60% 的 Frame。加各边相等的 UIPadding。",
      "里面加一个 Padding 为 {0, 12} 的 UIListLayout。每个子元素是一行 Frame,里面一个 TextLabel 和一个开关 Frame。",
      "开关 Frame 在两个视觉状态间切换 —— 编辑器的显示/隐藏动作替你接好。",
      "顶部加一个关闭按钮。接上隐藏设置面板、重新显示父菜单。",
    ],
    tips: [
      "用一致的行高(40–48px offset),列表看起来统一。",
      "把开关状态存在 ModuleScript 或 Attributes 里,其它脚本不用查 GUI 就能读设置。",
      "相关设置组上方加小节标题 TextLabel(音频、画面、操作)。",
    ],
  },

  "loading-screens": {
    metaDescription:
      "用 Roblox GUI Maker 做加载界面:资源流入时盖住整个视口 —— 标题、一条会填满的进度条和一条轮播提示。游戏就绪后它消失。",
    title: "Roblox GUI Maker:加载界面",
    noun: "加载界面",
    blurb:
      "加载界面在资源流入时盖住整个视口 —— 标题、一条会填满的进度条和一条轮播提示。游戏就绪后它消失。",
    needs: [
      "一个全屏背景(IgnoreGuiInset)带渐变",
      "一条能从空补间到满的进度条",
      "加载完成时干净的销毁",
    ],
    howTo: [
      "加一个开了 IgnoreGuiInset 的 ScreenGui。里面放一个铺满全屏的 Frame(Size = {1,0},{1,0})。",
      "加背景 ImageLabel 或渐变 Frame,然后标题 TextLabel 和一个较小的轮播提示。",
      "做进度条:一个背景 Frame 加一个子 Frame,后者的 Size X scale 从 0 补间到 1。",
      "导出。游戏脚本里随内容加载补间进度条宽度,就绪后销毁 ScreenGui。",
    ],
    tips: [
      "用 TweenService:Create 给进度条的 Size 加平滑填充动画。",
      "用一条每 3–5 秒换一次 TextLabel.Text 的协程轮播提示。",
      "加载 ScreenGui 用完一定要 Destroy —— 别只设 Visible = false,它还在渲染。",
    ],
  },

  "leaderboards": {
    metaDescription:
      "用 Roblox GUI Maker 做排行榜:按某项属性给玩家排名、激发竞争。每行显示名次、名字和分数,首位高亮,并随玩家增多而增长。",
    title: "Roblox GUI Maker:排行榜",
    noun: "排行榜",
    blurb:
      "排行榜按某项属性给玩家排名、激发竞争。每行显示名次、名字和分数,首位高亮,并随玩家增多而增长。",
    needs: [
      "用 UIListLayout 堆叠、随人数缩放的行",
      "每行名次、名字、分数三列",
      "首位高亮以奖励领先者",
    ],
    howTo: [
      "建一个锚到屏幕右侧的 Frame。里面加 UIListLayout 自动堆叠行。",
      "做一行 Frame,带三个 TextLabel:名次、玩家名、分数。行 Size 用 scale 宽 + offset 高。",
      "给第一行加高亮样式 —— 不同的 BackgroundColor3 或一个 UIStroke。",
      "导出。游戏脚本里排序玩家属性并克隆行模板填充列表。",
    ],
    tips: [
      "用 GetChildren() 数量随玩家加入动态设置滚动框的 CanvasSize。",
      "前 3 行配色(金、银、铜)做视觉层级。",
      "排行榜用定时器(每 5–10 秒)更新,而不是每帧,减少 GUI 抖动。",
    ],
  },

  "admin-panels": {
    title: "Roblox GUI Maker:管理面板",
    noun: "管理面板",
    blurb:
      "管理面板给版主一个隐藏界面来踢人、封人或传送玩家。它用指令或按键打开,列出玩家,通过服务端检查执行特权动作。",
    needs: [
      "一个用管理键或指令切换的隐藏面板",
      "一个带每行动作按钮的可滚动玩家列表",
      "每个动作的服务端权限检查",
    ],
    howTo: [
      "建一个关掉 ResetOnSpawn 的 ScreenGui。加一个初始 Visible = false 的 Frame。",
      "里面建一个带 UIListLayout 的 ScrollingFrame 当玩家列表。每行一个 TextLabel(名字)和几个 TextButton(踢、封、传送)。",
      "每个动作加一个 RemoteEvent。编辑器会生成带校验边界的独立服务端处理器。",
      "导出。把打开/关闭接到按键(UserInputService)或聊天指令。服务端 Script 执行前检查管理等级。",
    ],
    tips: [
      "绝不信任客户端权限检查 —— 管理等级永远在服务端校验。",
      "管理名单用 ModuleScript,这样不用动 GUI 代码就能更新。",
      "破坏性动作(踢、封)前加确认对话框,防止误点。",
    ],
  },
};

// Overlays zh prose onto the en UseCase, keeping en properties/template/relatedGuide.
export function getUseCaseZh(slug: string): UseCase | undefined {
  const en = getUseCase(slug);
  const zh = USE_CASES_ZH_PROSE[slug];
  if (!en || !zh) return undefined;
  return {
    ...en,
    title: zh.title,
    noun: zh.noun,
    blurb: zh.blurb,
    // Per locale, like the other prose: never inherit the English override.
    metaDescription: zh.metaDescription,
    needs: zh.needs,
    howTo: zh.howTo,
    tips: zh.tips,
  };
}
