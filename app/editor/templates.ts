// Pre-made GUI templates. Each is a SceneNode[] the editor can load directly
// via /editor?template=<slug>, and ScenePreview can render read-only.
// They double as long-tail SEO pages (/templates/<slug>) and showcase the
// nesting + layout features (UIListLayout / UIGridLayout / gradients).

import type { RobloxClass, SceneNode } from "./catalog";

export type TemplateCategory = "Menus" | "HUD" | "Shop" | "Settings";

export type Template = {
  slug: string;
  title: string;
  category: TemplateCategory;
  tagline: string;
  description: string;
  scene: SceneNode[];
};

let counter = 0;
function mk(cls: RobloxClass, overrides: Partial<SceneNode> = {}): SceneNode {
  return {
    id: `tpl-${counter++}`,
    cls,
    name: overrides.name ?? cls,
    parentId: overrides.parentId ?? null,
    pos: overrides.pos ?? { x: 0.4, y: 0.4 },
    size: overrides.size ?? { x: 0.2, y: 0.1 },
    color: overrides.color ?? "#1d1f29",
    transparency: overrides.transparency ?? 0,
    cornerRadius: overrides.cornerRadius ?? 8,
    zindex: overrides.zindex ?? 1,
    ...(overrides.text !== undefined ? { text: overrides.text } : {}),
    ...(overrides.font ? { font: overrides.font } : {}),
    ...(overrides.textSize ? { textSize: overrides.textSize } : {}),
    ...(overrides.textColor ? { textColor: overrides.textColor } : {}),
    ...(overrides.gradient ? { gradient: overrides.gradient } : {}),
    ...(overrides.layout !== undefined ? { layout: overrides.layout } : {}),
    ...(overrides.padding !== undefined ? { padding: overrides.padding } : {}),
    ...(overrides.listDirection !== undefined
      ? { listDirection: overrides.listDirection }
      : {}),
    ...(overrides.listGap !== undefined
      ? { listGap: { ...overrides.listGap } }
      : {}),
    ...(overrides.layoutHorizontalAlignment !== undefined
      ? { layoutHorizontalAlignment: overrides.layoutHorizontalAlignment }
      : {}),
    ...(overrides.layoutVerticalAlignment !== undefined
      ? { layoutVerticalAlignment: overrides.layoutVerticalAlignment }
      : {}),
    ...(overrides.gridCellSize !== undefined
      ? {
          gridCellSize: {
            scale: { ...overrides.gridCellSize.scale },
            offset: { ...overrides.gridCellSize.offset },
          },
        }
      : {}),
    ...(overrides.gridCellPadding !== undefined
      ? {
          gridCellPadding: {
            scale: { ...overrides.gridCellPadding.scale },
            offset: { ...overrides.gridCellPadding.offset },
          },
        }
      : {}),
    ...(overrides.automaticCanvasSize !== undefined
      ? { automaticCanvasSize: overrides.automaticCanvasSize }
      : {}),
    ...(overrides.initialVisible !== undefined ? { initialVisible: overrides.initialVisible } : {}),
    ...(overrides.action ? { action: overrides.action } : {}),
  };
}

const FLOW = { x: 0, y: 0 };

const mainMenu = (() => {
  const root = mk("ScreenGui", { name: "MainMenu", pos: { x: 0, y: 0 }, size: { x: 1, y: 1 }, color: "#0b0d14", transparency: 1, cornerRadius: 0 });
  const panel = mk("Frame", { name: "Panel", parentId: root.id, pos: { x: 0.3, y: 0.16 }, size: { x: 0.4, y: 0.68 }, color: "#15171f", cornerRadius: 18, layout: "list", padding: 20 });
  const title = mk("TextLabel", { name: "Title", parentId: panel.id, pos: FLOW, size: { x: 1, y: 0.18 }, color: "#000000", transparency: 1, text: "GAME TITLE", font: "GothamBlack", textSize: 30, textColor: "#99cbff" });
  const play = mk("TextButton", { name: "Play", parentId: panel.id, pos: FLOW, size: { x: 1, y: 0.14 }, color: "#00a2ff", cornerRadius: 10, text: "PLAY", font: "GothamBold", textSize: 20, textColor: "#001d34", action: { type: "hideGui" } });
  const settingsPanel = mk("Frame", { name: "SettingsPanel", parentId: root.id, pos: { x: 0.3, y: 0.24 }, size: { x: 0.4, y: 0.52 }, color: "#15171f", cornerRadius: 18, initialVisible: false, layout: "list", padding: 20, zindex: 5 });
  const settings = mk("TextButton", { name: "Settings", parentId: panel.id, pos: FLOW, size: { x: 1, y: 0.14 }, color: "#282933", cornerRadius: 10, text: "SETTINGS", font: "GothamMedium", textSize: 16, textColor: "#e1e1ef", action: { type: "show", targetId: settingsPanel.id } });
  const quit = mk("TextButton", { name: "Quit", parentId: panel.id, pos: FLOW, size: { x: 1, y: 0.14 }, color: "#282933", cornerRadius: 10, text: "QUIT", font: "GothamMedium", textSize: 16, textColor: "#e1e1ef" });
  const settingsTitle = mk("TextLabel", { name: "SettingsTitle", parentId: settingsPanel.id, pos: FLOW, size: { x: 1, y: 0.25 }, color: "#000000", transparency: 1, text: "SETTINGS", font: "GothamBold", textSize: 24, textColor: "#e1e1ef", zindex: 6 });
  const close = mk("TextButton", { name: "CloseSettings", parentId: settingsPanel.id, pos: FLOW, size: { x: 1, y: 0.18 }, color: "#282933", cornerRadius: 10, text: "CLOSE", font: "GothamMedium", textSize: 16, textColor: "#e1e1ef", action: { type: "hide", targetId: settingsPanel.id }, zindex: 6 });
  return [root, panel, title, play, settings, quit, settingsPanel, settingsTitle, close];
})();

const shop = (() => {
  const root = mk("ScreenGui", { name: "Shop", pos: { x: 0, y: 0 }, size: { x: 1, y: 1 }, color: "#0b0d14", transparency: 1, cornerRadius: 0 });
  const panel = mk("Frame", { name: "ShopPanel", parentId: root.id, pos: { x: 0.18, y: 0.12 }, size: { x: 0.64, y: 0.76 }, color: "#15171f", cornerRadius: 16, layout: "list", padding: 16 });
  const header = mk("Frame", { name: "Header", parentId: panel.id, pos: FLOW, size: { x: 1, y: 0.12 }, color: "#000000", transparency: 1, layout: "list" });
  const title = mk("TextLabel", { name: "Title", parentId: header.id, pos: FLOW, size: { x: 1, y: 1 }, color: "#000000", transparency: 1, text: "🛒  SHOP", font: "GothamBold", textSize: 26, textColor: "#e1e1ef" });
  const grid = mk("ScrollingFrame", {
    name: "ItemGrid",
    parentId: panel.id,
    pos: FLOW,
    size: { x: 1, y: 0.7 },
    color: "#0e0f16",
    cornerRadius: 10,
    layout: "grid",
    padding: 8,
    gridCellSize: {
      scale: { x: 0.3, y: 0 },
      offset: { x: 0, y: 120 },
    },
    gridCellPadding: {
      scale: { x: 0.02, y: 0 },
      offset: { x: 4, y: 8 },
    },
    automaticCanvasSize: "y",
  });
  const colors = ["#00a2ff", "#4cddb1", "#c50005", "#99cbff", "#ffb4a9", "#b083ff"];
  const items = colors.map((c, i) =>
    mk("Frame", { name: `Item${i}`, parentId: grid.id, pos: FLOW, size: { x: 0.3, y: 0.3 }, color: c, cornerRadius: 8, transparency: 0.15 })
  );
  return [root, panel, header, title, grid, ...items];
})();

const settingsTpl = (() => {
  const root = mk("ScreenGui", { name: "Settings", pos: { x: 0, y: 0 }, size: { x: 1, y: 1 }, color: "#0b0d14", transparency: 1, cornerRadius: 0 });
  const panel = mk("Frame", { name: "SettingsPanel", parentId: root.id, pos: { x: 0.28, y: 0.16 }, size: { x: 0.44, y: 0.68 }, color: "#15171f", cornerRadius: 16, layout: "list", padding: 18 });
  const title = mk("TextLabel", { name: "Title", parentId: panel.id, pos: FLOW, size: { x: 1, y: 0.14 }, color: "#000000", transparency: 1, text: "SETTINGS", font: "GothamBold", textSize: 24, textColor: "#e1e1ef" });
  const rows = ["Music", "Sound Effects", "Particles"].map((label, i) => {
    const row = mk("Frame", { name: `Row${i}`, parentId: panel.id, pos: FLOW, size: { x: 1, y: 0.16 }, color: "#1d1f29", cornerRadius: 8 });
    const lbl = mk("TextLabel", { name: "Label", parentId: row.id, pos: { x: 0.04, y: 0.3 }, size: { x: 0.6, y: 0.4 }, color: "#000000", transparency: 1, text: label, font: "GothamMedium", textSize: 16, textColor: "#e1e1ef" });
    const toggle = mk("Frame", { name: "Toggle", parentId: row.id, pos: { x: 0.82, y: 0.3 }, size: { x: 0.12, y: 0.4 }, color: i === 2 ? "#3a3d48" : "#4cddb1", cornerRadius: 999 });
    return [row, lbl, toggle];
  });
  return [root, panel, title, ...rows.flat()];
})();

const inventory = (() => {
  const root = mk("ScreenGui", { name: "Inventory", pos: { x: 0, y: 0 }, size: { x: 1, y: 1 }, color: "#0b0d14", transparency: 1, cornerRadius: 0 });
  const panel = mk("Frame", { name: "InvPanel", parentId: root.id, pos: { x: 0.22, y: 0.14 }, size: { x: 0.56, y: 0.72 }, color: "#15171f", cornerRadius: 16, layout: "list", padding: 16 });
  const title = mk("TextLabel", { name: "Title", parentId: panel.id, pos: FLOW, size: { x: 1, y: 0.12 }, color: "#000000", transparency: 1, text: "INVENTORY", font: "GothamBold", textSize: 22, textColor: "#99cbff" });
  const grid = mk("Frame", {
    name: "Slots",
    parentId: panel.id,
    pos: FLOW,
    size: { x: 1, y: 0.82 },
    color: "#000000",
    transparency: 1,
    layout: "grid",
    padding: 6,
    gridCellSize: {
      scale: { x: 0.22, y: 0 },
      offset: { x: 0, y: 92 },
    },
    gridCellPadding: {
      scale: { x: 0, y: 0 },
      offset: { x: 8, y: 8 },
    },
  });
  const slots = Array.from({ length: 8 }, (_, i) =>
    mk("Frame", { name: `Slot${i}`, parentId: grid.id, pos: FLOW, size: { x: 0.3, y: 0.22 }, color: i % 3 === 0 ? "#243042" : "#1d1f29", cornerRadius: 8 })
  );
  return [root, panel, title, grid, ...slots];
})();

const loadingScreen = (() => {
  const root = mk("ScreenGui", { name: "Loading", pos: { x: 0, y: 0 }, size: { x: 1, y: 1 }, color: "#0b0d14", transparency: 0, cornerRadius: 0, gradient: { from: "#141a2e", to: "#0b0d14" } });
  const title = mk("TextLabel", { name: "Title", parentId: root.id, pos: { x: 0.2, y: 0.36 }, size: { x: 0.6, y: 0.12 }, color: "#000000", transparency: 1, text: "LOADING", font: "GothamBlack", textSize: 44, textColor: "#99cbff" });
  const barBg = mk("Frame", { name: "BarBg", parentId: root.id, pos: { x: 0.3, y: 0.56 }, size: { x: 0.4, y: 0.03 }, color: "#1d1f29", cornerRadius: 999 });
  const barFill = mk("Frame", { name: "BarFill", parentId: barBg.id, pos: { x: 0, y: 0 }, size: { x: 0.65, y: 1 }, color: "#00a2ff", cornerRadius: 999 });
  const tip = mk("TextLabel", { name: "Tip", parentId: root.id, pos: { x: 0.2, y: 0.66 }, size: { x: 0.6, y: 0.06 }, color: "#000000", transparency: 1, text: "Tip: press F to pay respects", font: "GothamMedium", textSize: 15, textColor: "#89919d" });
  return [root, title, barBg, barFill, tip];
})();

const leaderboard = (() => {
  const root = mk("ScreenGui", { name: "Leaderboard", pos: { x: 0, y: 0 }, size: { x: 1, y: 1 }, color: "#0b0d14", transparency: 1, cornerRadius: 0 });
  const panel = mk("Frame", { name: "Board", parentId: root.id, pos: { x: 0.32, y: 0.14 }, size: { x: 0.36, y: 0.72 }, color: "#15171f", cornerRadius: 14, layout: "list", padding: 10 });
  const title = mk("TextLabel", { name: "Title", parentId: panel.id, pos: FLOW, size: { x: 1, y: 0.12 }, color: "#000000", transparency: 1, text: "LEADERBOARD", font: "GothamBold", textSize: 18, textColor: "#e1e1ef" });
  const rows = [
    ["1", "Alex", "9,820"],
    ["2", "Mia", "8,104"],
    ["3", "Kai", "7,551"],
    ["4", "Zoe", "6,330"],
  ].map(([rank, name, score], i) => {
    const row = mk("Frame", { name: `Row${i}`, parentId: panel.id, pos: FLOW, size: { x: 1, y: 0.14 }, color: i === 0 ? "#103048" : "#1d1f29", cornerRadius: 8 });
    const rankEl = mk("TextLabel", { name: "Rank", parentId: row.id, pos: { x: 0.04, y: 0.25 }, size: { x: 0.12, y: 0.5 }, color: "#000000", transparency: 1, text: rank, font: "GothamBold", textSize: 18, textColor: i === 0 ? "#99cbff" : "#bec7d4" });
    const nameEl = mk("TextLabel", { name: "Name", parentId: row.id, pos: { x: 0.2, y: 0.3 }, size: { x: 0.5, y: 0.4 }, color: "#000000", transparency: 1, text: name, font: "GothamMedium", textSize: 16, textColor: "#e1e1ef" });
    const scoreEl = mk("TextLabel", { name: "Score", parentId: row.id, pos: { x: 0.66, y: 0.3 }, size: { x: 0.3, y: 0.4 }, color: "#000000", transparency: 1, text: score, font: "GothamMedium", textSize: 15, textColor: "#4cddb1" });
    return [row, rankEl, nameEl, scoreEl];
  });
  return [root, panel, title, ...rows.flat()];
})();

const gamePassShop = (() => {
  const root = mk("ScreenGui", {
    name: "GamePassShop",
    pos: { x: 0, y: 0 },
    size: { x: 1, y: 1 },
    color: "#0b0d14",
    transparency: 1,
    cornerRadius: 0,
  });
  const panel = mk("Frame", {
    name: "PassShopPanel",
    parentId: root.id,
    pos: { x: 0.12, y: 0.14 },
    size: { x: 0.76, y: 0.72 },
    color: "#151923",
    cornerRadius: 18,
    layout: "list",
    padding: 16,
  });
  const title = mk("TextLabel", {
    name: "ShopTitle",
    parentId: panel.id,
    pos: FLOW,
    size: { x: 1, y: 0.1 },
    color: "#000000",
    transparency: 1,
    text: "PREMIUM PASSES",
    font: "GothamBold",
    textSize: 25,
    textColor: "#e6f4ff",
  });
  const subtitle = mk("TextLabel", {
    name: "ShopSubtitle",
    parentId: panel.id,
    pos: FLOW,
    size: { x: 1, y: 0.08 },
    color: "#000000",
    transparency: 1,
    text: "Permanent upgrades for every adventure",
    font: "GothamMedium",
    textSize: 13,
    textColor: "#8da2b8",
  });
  const passGrid = mk("Frame", {
    name: "PassGrid",
    parentId: panel.id,
    pos: FLOW,
    size: { x: 1, y: 0.7 },
    color: "#000000",
    transparency: 1,
    layout: "grid",
    padding: 10,
  });
  const passDefinitions = [
    {
      key: "vip",
      name: "VIP PASS",
      benefit: "Gold name + VIP lounge",
      price: "399 R$",
      accent: "#38bdf8",
      buttonName: "BuyVip",
    },
    {
      key: "double-coins",
      name: "DOUBLE COINS",
      benefit: "Earn 2x coins forever",
      price: "249 R$",
      accent: "#a78bfa",
      buttonName: "BuyDoubleCoins",
    },
    {
      key: "speed-coil",
      name: "SPEED COIL",
      benefit: "Move faster in every world",
      price: "149 R$",
      accent: "#34d399",
      buttonName: "BuySpeedCoil",
    },
  ];
  const passes = passDefinitions.map((pass, index) => {
    const card = mk("Frame", {
      name: `PassCard${index + 1}`,
      parentId: passGrid.id,
      pos: FLOW,
      size: { x: 1, y: 0.82 },
      color: "#202735",
      cornerRadius: 12,
      layout: "list",
      padding: 10,
    });
    const badge = mk("TextLabel", {
      name: "PassBadge",
      parentId: card.id,
      pos: FLOW,
      size: { x: 1, y: 0.18 },
      color: pass.accent,
      cornerRadius: 8,
      text: pass.name,
      font: "GothamBold",
      textSize: 14,
      textColor: "#07111c",
    });
    const benefit = mk("TextLabel", {
      name: "PassBenefit",
      parentId: card.id,
      pos: FLOW,
      size: { x: 1, y: 0.25 },
      color: "#000000",
      transparency: 1,
      text: pass.benefit,
      font: "GothamMedium",
      textSize: 12,
      textColor: "#c8d3df",
    });
    const price = mk("TextLabel", {
      name: "PassPrice",
      parentId: card.id,
      pos: FLOW,
      size: { x: 1, y: 0.18 },
      color: "#000000",
      transparency: 1,
      text: pass.price,
      font: "GothamBold",
      textSize: 18,
      textColor: "#fbbf24",
    });
    const buy = mk("TextButton", {
      name: pass.buttonName,
      parentId: card.id,
      pos: FLOW,
      size: { x: 1, y: 0.2 },
      color: pass.accent,
      cornerRadius: 8,
      text: "BUY PASS",
      font: "GothamBold",
      textSize: 13,
      textColor: "#07111c",
      action: {
        type: "remoteEvent",
        eventName: "PurchaseGamePass",
        argument: pass.key,
      },
    });
    return [card, badge, benefit, price, buy];
  });
  return [root, panel, title, subtitle, passGrid, ...passes.flat()];
})();

const codeRedeem = (() => {
  const root = mk("ScreenGui", {
    name: "CodeRedeem",
    pos: { x: 0, y: 0 },
    size: { x: 1, y: 1 },
    color: "#0b0d14",
    transparency: 1,
    cornerRadius: 0,
  });
  const panel = mk("Frame", {
    name: "RedeemPanel",
    parentId: root.id,
    pos: { x: 0.27, y: 0.15 },
    size: { x: 0.46, y: 0.7 },
    color: "#151923",
    cornerRadius: 18,
    layout: "list",
    padding: 18,
  });
  const title = mk("TextLabel", {
    name: "RedeemTitle",
    parentId: panel.id,
    pos: FLOW,
    size: { x: 1, y: 0.12 },
    color: "#000000",
    transparency: 1,
    text: "REDEEM A CODE",
    font: "GothamBold",
    textSize: 24,
    textColor: "#c4b5fd",
  });
  const subtitle = mk("TextLabel", {
    name: "RedeemSubtitle",
    parentId: panel.id,
    pos: FLOW,
    size: { x: 1, y: 0.1 },
    color: "#000000",
    transparency: 1,
    text: "Enter a creator code to unlock your reward",
    font: "GothamMedium",
    textSize: 13,
    textColor: "#9aa7b7",
  });
  const input = mk("TextBox", {
    name: "CodeInput",
    parentId: panel.id,
    pos: FLOW,
    size: { x: 1, y: 0.12 },
    color: "#202735",
    cornerRadius: 9,
    text: "ENTER-CODE",
    font: "GothamMedium",
    textSize: 15,
    textColor: "#d8dee9",
  });
  const redeem = mk("TextButton", {
    name: "RedeemCode",
    parentId: panel.id,
    pos: FLOW,
    size: { x: 1, y: 0.12 },
    color: "#8b5cf6",
    cornerRadius: 9,
    text: "REDEEM",
    font: "GothamBold",
    textSize: 15,
    textColor: "#ffffff",
  });
  const status = mk("TextLabel", {
    name: "RedeemStatus",
    parentId: panel.id,
    pos: FLOW,
    size: { x: 1, y: 0.09 },
    color: "#000000",
    transparency: 1,
    text: "Enter a code to check your reward",
    font: "GothamMedium",
    textSize: 12,
    textColor: "#a5b4c3",
  });
  const rewardsTitle = mk("TextLabel", {
    name: "RewardExamplesTitle",
    parentId: panel.id,
    pos: FLOW,
    size: { x: 1, y: 0.09 },
    color: "#000000",
    transparency: 1,
    text: "RECENT REWARDS",
    font: "GothamBold",
    textSize: 12,
    textColor: "#c4b5fd",
  });
  const rewardRows = ["LAUNCHDAY  -  500 Coins", "WELCOME  -  Starter Crate"].map(
    (reward, index) =>
      mk("TextLabel", {
        name: `RewardExample${index + 1}`,
        parentId: panel.id,
        pos: FLOW,
        size: { x: 1, y: 0.09 },
        color: "#202735",
        cornerRadius: 7,
        text: reward,
        font: "GothamMedium",
        textSize: 12,
        textColor: "#d8dee9",
      })
  );
  return [
    root,
    panel,
    title,
    subtitle,
    input,
    redeem,
    status,
    rewardsTitle,
    ...rewardRows,
  ];
})();

const dailyRewards = (() => {
  const root = mk("ScreenGui", {
    name: "DailyRewards",
    pos: { x: 0, y: 0 },
    size: { x: 1, y: 1 },
    color: "#0b0d14",
    transparency: 1,
    cornerRadius: 0,
  });
  const panel = mk("Frame", {
    name: "RewardsPanel",
    parentId: root.id,
    pos: { x: 0.1, y: 0.16 },
    size: { x: 0.8, y: 0.68 },
    color: "#151923",
    cornerRadius: 18,
    layout: "list",
    padding: 15,
  });
  const title = mk("TextLabel", {
    name: "RewardsTitle",
    parentId: panel.id,
    pos: FLOW,
    size: { x: 1, y: 0.1 },
    color: "#000000",
    transparency: 1,
    text: "DAILY REWARDS",
    font: "GothamBold",
    textSize: 25,
    textColor: "#fbbf24",
  });
  const streak = mk("TextLabel", {
    name: "StreakStatus",
    parentId: panel.id,
    pos: FLOW,
    size: { x: 1, y: 0.08 },
    color: "#000000",
    transparency: 1,
    text: "4 DAY STREAK  |  Come back tomorrow to keep it going",
    font: "GothamMedium",
    textSize: 13,
    textColor: "#a7b2c1",
  });
  const dayGrid = mk("Frame", {
    name: "DayGrid",
    parentId: panel.id,
    pos: FLOW,
    size: { x: 1, y: 0.42 },
    color: "#000000",
    transparency: 1,
  });
  const rewards = ["100", "150", "200", "350", "500", "750", "CRATE"];
  const dayPositions = [0, 0.14, 0.28, 0.42, 0.56, 0.7, 0.84];
  const days = rewards.map((reward, index) => {
    const day = index + 1;
    const isClaimed = day < 4;
    const isCurrent = day === 4;
    const card = mk("Frame", {
      name: `Day${day}`,
      parentId: dayGrid.id,
      pos: { x: dayPositions[index], y: 0.08 },
      size: { x: 0.13, y: 0.8 },
      color: isCurrent ? "#9a6b12" : isClaimed ? "#243445" : "#202735",
      cornerRadius: 9,
      layout: "list",
      padding: 6,
    });
    const dayLabel = mk("TextLabel", {
      name: "DayLabel",
      parentId: card.id,
      pos: FLOW,
      size: { x: 1, y: 0.3 },
      color: "#000000",
      transparency: 1,
      text: isCurrent ? "TODAY" : `DAY ${day}`,
      font: "GothamBold",
      textSize: 11,
      textColor: isCurrent ? "#fff4cc" : "#c8d3df",
    });
    const amount = mk("TextLabel", {
      name: "RewardAmount",
      parentId: card.id,
      pos: FLOW,
      size: { x: 1, y: 0.35 },
      color: "#000000",
      transparency: 1,
      text: reward,
      font: "GothamBold",
      textSize: 14,
      textColor: isCurrent ? "#fbbf24" : "#e5e7eb",
    });
    const state = mk("TextLabel", {
      name: "RewardState",
      parentId: card.id,
      pos: FLOW,
      size: { x: 1, y: 0.22 },
      color: "#000000",
      transparency: 1,
      text: isClaimed ? "CLAIMED" : isCurrent ? "READY" : "LOCKED",
      font: "GothamMedium",
      textSize: 9,
      textColor: isClaimed ? "#7dd3fc" : isCurrent ? "#fde68a" : "#758295",
    });
    return [card, dayLabel, amount, state];
  });
  const currentReward = mk("TextLabel", {
    name: "CurrentReward",
    parentId: panel.id,
    pos: FLOW,
    size: { x: 1, y: 0.1 },
    color: "#202735",
    cornerRadius: 8,
    text: "TODAY: 350 COINS",
    font: "GothamBold",
    textSize: 15,
    textColor: "#fde68a",
  });
  const claim = mk("TextButton", {
    name: "ClaimReward",
    parentId: panel.id,
    pos: FLOW,
    size: { x: 1, y: 0.11 },
    color: "#fbbf24",
    cornerRadius: 9,
    text: "CLAIM DAY 4",
    font: "GothamBold",
    textSize: 15,
    textColor: "#211600",
    action: {
      type: "remoteEvent",
      eventName: "ClaimDailyReward",
      argument: "day-4",
    },
  });
  return [
    root,
    panel,
    title,
    streak,
    dayGrid,
    ...days.flat(),
    currentReward,
    claim,
  ];
})();

const questTracker = (() => {
  const root = mk("ScreenGui", {
    name: "QuestTracker",
    pos: { x: 0, y: 0 },
    size: { x: 1, y: 1 },
    color: "#0b0d14",
    transparency: 1,
    cornerRadius: 0,
  });
  const panel = mk("Frame", {
    name: "QuestTrackerPanel",
    parentId: root.id,
    pos: { x: 0.65, y: 0.08 },
    size: { x: 0.31, y: 0.38 },
    color: "#151923",
    cornerRadius: 14,
    layout: "list",
    padding: 12,
  });
  const header = mk("Frame", {
    name: "QuestHeader",
    parentId: panel.id,
    pos: FLOW,
    size: { x: 1, y: 0.22 },
    color: "#000000",
    transparency: 1,
  });
  const title = mk("TextLabel", {
    name: "QuestTitle",
    parentId: header.id,
    pos: { x: 0, y: 0.15 },
    size: { x: 0.75, y: 0.7 },
    color: "#000000",
    transparency: 1,
    text: "ACTIVE QUEST",
    font: "GothamBold",
    textSize: 15,
    textColor: "#6ee7b7",
  });
  const details = mk("Frame", {
    name: "QuestDetails",
    parentId: panel.id,
    pos: FLOW,
    size: { x: 1, y: 0.7 },
    color: "#202735",
    cornerRadius: 10,
  });
  const toggle = mk("TextButton", {
    name: "ToggleDetails",
    parentId: header.id,
    pos: { x: 0.82, y: 0.12 },
    size: { x: 0.16, y: 0.76 },
    color: "#263346",
    cornerRadius: 7,
    text: "-",
    font: "GothamBold",
    textSize: 18,
    textColor: "#c8d3df",
    action: { type: "toggle", targetId: details.id },
  });
  const questName = mk("TextLabel", {
    name: "QuestName",
    parentId: details.id,
    pos: { x: 0.06, y: 0.08 },
    size: { x: 0.88, y: 0.18 },
    color: "#000000",
    transparency: 1,
    text: "Crystal Collector",
    font: "GothamBold",
    textSize: 16,
    textColor: "#f1f5f9",
  });
  const objective = mk("TextLabel", {
    name: "QuestObjective",
    parentId: details.id,
    pos: { x: 0.06, y: 0.28 },
    size: { x: 0.88, y: 0.15 },
    color: "#000000",
    transparency: 1,
    text: "Collect crystal shards",
    font: "GothamMedium",
    textSize: 12,
    textColor: "#aab6c5",
  });
  const progressBackground = mk("Frame", {
    name: "ProgressBackground",
    parentId: details.id,
    pos: { x: 0.06, y: 0.48 },
    size: { x: 0.88, y: 0.08 },
    color: "#303a49",
    cornerRadius: 999,
  });
  const progressFill = mk("Frame", {
    name: "ProgressFill",
    parentId: progressBackground.id,
    pos: { x: 0, y: 0 },
    size: { x: 0.66, y: 1 },
    color: "#34d399",
    cornerRadius: 999,
  });
  const progress = mk("TextLabel", {
    name: "ProgressValue",
    parentId: details.id,
    pos: { x: 0.06, y: 0.6 },
    size: { x: 0.4, y: 0.14 },
    color: "#000000",
    transparency: 1,
    text: "8 / 12",
    font: "GothamBold",
    textSize: 12,
    textColor: "#6ee7b7",
  });
  const reward = mk("TextLabel", {
    name: "QuestReward",
    parentId: details.id,
    pos: { x: 0.46, y: 0.6 },
    size: { x: 0.48, y: 0.14 },
    color: "#000000",
    transparency: 1,
    text: "Reward: 350 Coins",
    font: "GothamMedium",
    textSize: 11,
    textColor: "#fbbf24",
  });
  return [
    root,
    panel,
    header,
    title,
    toggle,
    details,
    questName,
    objective,
    progressBackground,
    progressFill,
    progress,
    reward,
  ];
})();

export const TEMPLATES: Template[] = [
  {
    slug: "main-menu",
    title: "Roblox Main Menu GUI",
    category: "Menus",
    tagline: "Title screen with Play / Settings / Quit",
    description:
      "A clean centered main menu: game title, primary Play button in Electric Blue, and secondary action buttons — stacked with a UIListLayout so it stays tidy on any screen size.",
    scene: mainMenu,
  },
  {
    slug: "shop",
    title: "Roblox Shop GUI",
    category: "Shop",
    tagline: "Item grid with a scrollable UIGridLayout",
    description:
      "A game shop panel with a header and a ScrollingFrame whose children auto-arrange into a grid via UIGridLayout — drop in as many items as you want and they tile automatically.",
    scene: shop,
  },
  {
    slug: "settings",
    title: "Roblox Settings GUI",
    category: "Settings",
    tagline: "Toggle rows stacked with UIListLayout",
    description:
      "A settings panel: each option is a row with a label and a toggle pill, stacked vertically with UIListLayout and inner padding from UIPadding.",
    scene: settingsTpl,
  },
  {
    slug: "inventory",
    title: "Roblox Inventory GUI",
    category: "Menus",
    tagline: "Slot grid for items / cosmetics",
    description:
      "An inventory with a fixed UIGridLayout of slots — perfect for items, cosmetics, or a hotbar. Add or remove slots and the grid reflows.",
    scene: inventory,
  },
  {
    slug: "loading-screen",
    title: "Roblox Loading Screen GUI",
    category: "Menus",
    tagline: "Title, progress bar and rotating tip",
    description:
      "A full-screen loading screen with a gradient background, big title, a progress bar (background + animated fill), and a tip line. A great first impression while the game loads.",
    scene: loadingScreen,
  },
  {
    slug: "leaderboard",
    title: "Roblox Leaderboard GUI",
    category: "HUD",
    tagline: "Ranked rows with score highlights",
    description:
      "A live-style leaderboard with rank, name, and score columns, the top row highlighted. Rows stack with UIListLayout so it scales with player count.",
    scene: leaderboard,
  },
  {
    slug: "game-pass-shop",
    title: "Roblox Game Pass Shop GUI",
    category: "Shop",
    tagline: "Premium pass cards with purchase requests",
    description:
      "A polished game pass storefront with three editable offers and RemoteEvent purchase requests. Connect each trusted server handler to your Roblox Marketplace purchase flow before release.",
    scene: gamePassShop,
  },
  {
    slug: "code-redeem",
    title: "Roblox Code Redeem GUI",
    category: "Menus",
    tagline: "Code input, reward examples, and status states",
    description:
      "A focused code redemption panel with editable input, feedback, and reward examples. Connect TextBox reading, validation, rate limits, and reward granting in Roblox Studio.",
    scene: codeRedeem,
  },
  {
    slug: "daily-rewards",
    title: "Roblox Daily Rewards GUI",
    category: "Menus",
    tagline: "Seven-day streak with a server request",
    description:
      "A seven-day reward calendar with claimed, current, and upcoming states plus a claim RemoteEvent. Validate time, streak, and duplicate claims on the server.",
    scene: dailyRewards,
  },
  {
    slug: "quest-tracker",
    title: "Roblox Quest Tracker GUI",
    category: "HUD",
    tagline: "Expandable objective and progress HUD",
    description:
      "A compact quest HUD with editable objective, progress, reward, and a previewable details toggle. Connect live quest data and completion rewards in your game code.",
    scene: questTracker,
  },
];

export function getTemplate(slug: string): Template | undefined {
  return TEMPLATES.find((t) => t.slug === slug);
}

export const CATEGORIES: TemplateCategory[] = ["Menus", "HUD", "Shop", "Settings"];
