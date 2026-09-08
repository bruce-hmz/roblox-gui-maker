// Deterministic GUI Composer: GuiDesignSpec → SceneNode[].
//
// The AI decides WHAT a screen needs; this file decides HOW a correct Roblox
// GUI is built — hierarchy, scale-based geometry, list/grid layouts, semantic
// names, and the only interaction wirings the existing action schema knows
// (show/hide/toggle panels, hideGui, whitelisted RemoteEvents). Pure and
// deterministic: same spec in → byte-identical scene out (sequential ai-N ids,
// no dates, no randomness), which is what makes composer tests and the visual
// fixtures meaningful. Scenes are emitted on the template base palette and
// recolored through applyTheme with the mood palette, exactly like kits.

import type { RobloxClass, SceneNode } from "../catalog";
import { enrichScene } from "../templates";
import { applyTheme } from "../themes";
import { LIMITS, type GuiDesignSpec } from "./spec";
import { resolvePalette } from "./moods";

const FLOW = { x: 0, y: 0 };

// Local node factory — mirrors templates.ts's mk() but with per-call ids so
// composeScene stays deterministic across calls.
function builder() {
  let n = 0;
  const mk = (
    cls: RobloxClass,
    overrides: Partial<SceneNode> = {}
  ): SceneNode => ({
    id: `ai-${n++}`,
    cls,
    name: overrides.name ?? cls,
    parentId: overrides.parentId ?? null,
    pos: overrides.pos ?? { x: 0.4, y: 0.4 },
    size: overrides.size ?? { x: 0.2, y: 0.1 },
    color: overrides.color ?? "#1d1f29",
    transparency: overrides.transparency ?? 0,
    cornerRadius: overrides.cornerRadius ?? 8,
    zindex: overrides.zindex ?? 1,
    layoutOrder: overrides.layoutOrder,
    ...(overrides.text !== undefined ? { text: overrides.text } : {}),
    ...(overrides.font ? { font: overrides.font } : {}),
    ...(overrides.textSize ? { textSize: overrides.textSize } : {}),
    ...(overrides.textColor ? { textColor: overrides.textColor } : {}),
    ...(overrides.gradient ? { gradient: overrides.gradient } : {}),
    ...(overrides.layout ? { layout: overrides.layout } : {}),
    ...(overrides.padding ? { padding: overrides.padding } : {}),
    ...(overrides.anchor ? { anchor: overrides.anchor } : {}),
    ...(overrides.minSize ? { minSize: overrides.minSize } : {}),
    ...(overrides.initialVisible !== undefined
      ? { initialVisible: overrides.initialVisible }
      : {}),
    ...(overrides.action ? { action: overrides.action } : {}),
    ...(overrides.stroke ? { stroke: overrides.stroke } : {}),
  });
  return mk;
}

// Token hexes from the template base palette — applyTheme maps these onto the
// mood palette. Anything else here is decorative and passes through recolor.
const T = {
  surface: "#0b0d14",
  panel: "#15171f",
  raised: "#282933",
  raisedAlt: "#1d1f29",
  input: "#202735",
  primary: "#00a2ff",
  onPrimary: "#001d34",
  accent: "#99cbff",
  success: "#4cddb1",
  ink: "#e1e1ef",
  inkDim: "#bec7d4",
  inkMute: "#89919d",
} as const;

// Decorative stat / accent colors (stay constant across moods, like the gold
// price text in the hand-built templates).
const STAT_FILL: Record<string, string> = {
  health: "#34d399",
  stamina: "#fbbf24",
  mana: "#38bdf8",
  xp: "#a78bfa",
};
const STAT_LABEL: Record<string, string> = {
  health: "HP",
  stamina: "ST",
  mana: "MP",
  xp: "XP",
};
const STAT_FILL_FRACTION: Record<string, number> = {
  health: 0.72,
  stamina: 0.45,
  mana: 0.6,
  xp: 0.3,
};
const PASS_ACCENTS = [
  "#38bdf8",
  "#a78bfa",
  "#34d399",
  "#fbbf24",
  "#f472b6",
  "#60a5fa",
];

const slugKey = (value: string, fallback: string) => {
  const slug = value
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || fallback;
};

function root(mk: ReturnType<typeof builder>, name: string): SceneNode {
  return mk("ScreenGui", {
    name,
    pos: FLOW,
    size: { x: 1, y: 1 },
    color: T.surface,
    transparency: 1,
    cornerRadius: 0,
  });
}

// ---- main menu -------------------------------------------------------------

function buildMainMenu(spec: GuiDesignSpec, mk: ReturnType<typeof builder>): SceneNode[] {
  const gui = root(mk, "MainMenu");
  const nodes: SceneNode[] = [gui];

  const menuButtons = spec.blocks.find((b) => b.type === "menu-buttons");
  const items =
    menuButtons && menuButtons.type === "menu-buttons"
      ? menuButtons.items
      : [{ label: "PLAY", intent: "play" as const }];

  const panel = mk("Frame", {
    name: "Panel",
    parentId: gui.id,
    pos: { x: 0.3, y: 0.16 },
    size: { x: 0.4, y: 0.68 },
    color: T.panel,
    cornerRadius: 18,
    layout: "list",
    padding: 20,
  });
  nodes.push(panel);

  nodes.push(
    mk("TextLabel", {
      name: "Title",
      parentId: panel.id,
      pos: FLOW,
      size: { x: 1, y: 0.16 },
      color: "#000000",
      transparency: 1,
      text: spec.title ?? "GAME TITLE",
      font: "GothamBlack",
      textSize: 30,
      textColor: T.accent,
    })
  );

  // Hidden overlay panels that menu buttons reveal (only created on demand).
  let settingsPanel: SceneNode | null = null;
  let shopPanel: SceneNode | null = null;
  const overlay = (name: string, title: string): SceneNode => {
    const frame = mk("Frame", {
      name,
      parentId: gui.id,
      pos: { x: 0.3, y: 0.24 },
      size: { x: 0.4, y: 0.52 },
      color: T.panel,
      cornerRadius: 18,
      initialVisible: false,
      layout: "list",
      padding: 20,
      zindex: 5,
    });
    nodes.push(
      frame,
      mk("TextLabel", {
        name: `${name}Title`,
        parentId: frame.id,
        pos: FLOW,
        size: { x: 1, y: 0.22 },
        color: "#000000",
        transparency: 1,
        text: title,
        font: "GothamBold",
        textSize: 24,
        textColor: T.ink,
        zindex: 6,
      }),
      mk("TextButton", {
        name: `Close${name}`,
        parentId: frame.id,
        pos: FLOW,
        size: { x: 1, y: 0.16 },
        color: T.raised,
        cornerRadius: 10,
        text: "CLOSE",
        font: "GothamMedium",
        textSize: 16,
        textColor: T.ink,
        action: { type: "hide", targetId: frame.id },
        zindex: 6,
      })
    );
    return frame;
  };

  // Buttons share the panel height under the title (list layout stacks them).
  const buttonHeight = Math.min(0.14, Math.max(0.08, 0.78 / items.length));
  items.forEach((item, index) => {
    const primary = index === 0;
    let action: SceneNode["action"];
    if (item.intent === "play") action = { type: "hideGui" };
    else if (item.intent === "settings") {
      settingsPanel = settingsPanel ?? overlay("SettingsPanel", "SETTINGS");
      action = { type: "show", targetId: settingsPanel.id };
    } else if (item.intent === "shop") {
      shopPanel = shopPanel ?? overlay("ShopPanel", "SHOP");
      action = { type: "show", targetId: shopPanel.id };
    }
    nodes.push(
      mk("TextButton", {
        name: `${slugKey(item.label, `button-${index + 1}`)}Btn`,
        parentId: panel.id,
        pos: FLOW,
        size: { x: 1, y: buttonHeight },
        color: primary ? T.primary : T.raised,
        cornerRadius: 10,
        text: item.label,
        font: primary ? "GothamBold" : "GothamMedium",
        textSize: primary ? 20 : 16,
        textColor: primary ? T.onPrimary : T.ink,
        ...(action ? { action } : {}),
      })
    );
  });

  return nodes;
}

// ---- shop ------------------------------------------------------------------

function buildShop(spec: GuiDesignSpec, mk: ReturnType<typeof builder>): SceneNode[] {
  const gui = root(mk, "Shop");
  const nodes: SceneNode[] = [gui];

  const panel = mk("Frame", {
    name: "ShopPanel",
    parentId: gui.id,
    pos: { x: 0.12, y: 0.14 },
    size: { x: 0.76, y: 0.72 },
    color: T.panel,
    cornerRadius: 18,
    layout: "list",
    padding: 16,
  });
  nodes.push(panel);
  nodes.push(
    mk("TextLabel", {
      name: "Title",
      parentId: panel.id,
      pos: FLOW,
      size: { x: 1, y: 0.1 },
      color: "#000000",
      transparency: 1,
      text: spec.title ?? "SHOP",
      font: "GothamBold",
      textSize: 25,
      textColor: T.ink,
    }),
    mk("TextLabel", {
      name: "Subtitle",
      parentId: panel.id,
      pos: FLOW,
      size: { x: 1, y: 0.08 },
      color: "#000000",
      transparency: 1,
      text: "Permanent upgrades for every adventure",
      font: "GothamMedium",
      textSize: 13,
      textColor: T.inkMute,
    })
  );

  const passGrid = spec.blocks.find((b) => b.type === "game-pass-grid");
  if (passGrid && passGrid.type === "game-pass-grid" && passGrid.passes.length > 0) {
    const grid = mk("Frame", {
      name: "PassGrid",
      parentId: panel.id,
      pos: FLOW,
      size: { x: 1, y: 0.7 },
      color: "#000000",
      transparency: 1,
      layout: "grid",
      padding: 10,
    });
    nodes.push(grid);
    passGrid.passes.forEach((pass, index) => {
      const accent = PASS_ACCENTS[index % PASS_ACCENTS.length];
      const card = mk("Frame", {
        name: `PassCard${index + 1}`,
        parentId: grid.id,
        pos: FLOW,
        size: { x: 1, y: 0.82 },
        color: T.input,
        cornerRadius: 12,
        layout: "list",
        padding: 10,
        stroke: { color: accent, transparency: 0.7, thickness: 1.5 },
      });
      const key = slugKey(pass.name, `pass-${index + 1}`);
      nodes.push(
        card,
        mk("TextLabel", {
          name: "PassName",
          parentId: card.id,
          pos: FLOW,
          size: { x: 1, y: 0.18 },
          color: accent,
          cornerRadius: 8,
          text: pass.name,
          font: "GothamBold",
          textSize: 14,
          textColor: "#07111c",
        }),
        mk("TextLabel", {
          name: "PassPrice",
          parentId: card.id,
          pos: FLOW,
          size: { x: 1, y: 0.2 },
          color: "#000000",
          transparency: 1,
          text: pass.price ?? "R$",
          font: "GothamBold",
          textSize: 18,
          textColor: "#fbbf24",
        }),
        mk("TextButton", {
          name: `Buy${key}`,
          parentId: card.id,
          pos: FLOW,
          size: { x: 1, y: 0.2 },
          color: accent,
          cornerRadius: 8,
          text: "BUY PASS",
          font: "GothamBold",
          textSize: 13,
          textColor: "#07111c",
          action: { type: "remoteEvent", eventName: "PurchaseGamePass", argument: key },
        })
      );
    });
    return nodes;
  }

  // Plain item grid (the shop template's structure).
  const itemGrid = spec.blocks.find((b) => b.type === "item-grid");
  const count = itemGrid && itemGrid.type === "item-grid" ? itemGrid.count : 6;
  const grid = mk("ScrollingFrame", {
    name: "ItemGrid",
    parentId: panel.id,
    pos: FLOW,
    size: { x: 1, y: 0.7 },
    color: T.surface,
    cornerRadius: 10,
    layout: "grid",
    padding: 8,
  });
  nodes.push(grid);
  for (let i = 0; i < count; i++) {
    nodes.push(
      mk("Frame", {
        name: `Item${i + 1}`,
        parentId: grid.id,
        pos: FLOW,
        size: { x: 0.3, y: 0.3 },
        color: PASS_ACCENTS[i % PASS_ACCENTS.length],
        cornerRadius: 8,
        transparency: 0.15,
      })
    );
  }
  return nodes;
}

// ---- inventory -------------------------------------------------------------

function buildInventory(
  spec: GuiDesignSpec,
  mk: ReturnType<typeof builder>
): SceneNode[] {
  const gui = root(mk, "Inventory");
  const nodes: SceneNode[] = [gui];

  const hasDetails = spec.blocks.some((b) => b.type === "item-details");
  const gridBlock = spec.blocks.find((b) => b.type === "item-grid");
  const slots = gridBlock && gridBlock.type === "item-grid" ? gridBlock.count : 12;

  const panel = mk("Frame", {
    name: "InvPanel",
    parentId: gui.id,
    pos: { x: 0.22, y: 0.14 },
    size: { x: 0.56, y: 0.72 },
    color: T.panel,
    cornerRadius: 16,
    layout: "list",
    padding: 16,
  });
  nodes.push(panel);
  nodes.push(
    mk("TextLabel", {
      name: "Title",
      parentId: panel.id,
      pos: FLOW,
      size: { x: 1, y: 0.12 },
      color: "#000000",
      transparency: 1,
      text: spec.title ?? "INVENTORY",
      font: "GothamBold",
      textSize: 22,
      textColor: T.accent,
    })
  );

  const grid = mk("Frame", {
    name: "Slots",
    parentId: panel.id,
    pos: FLOW,
    size: { x: 1, y: hasDetails ? 0.58 : 0.82 },
    color: "#000000",
    transparency: 1,
    layout: "grid",
    padding: 6,
  });
  nodes.push(grid);
  for (let i = 0; i < slots; i++) {
    nodes.push(
      mk("Frame", {
        name: `Slot${i + 1}`,
        parentId: grid.id,
        pos: FLOW,
        size: { x: 0.3, y: 0.22 },
        color: i % 3 === 0 ? "#243042" : T.raisedAlt,
        cornerRadius: 8,
      })
    );
  }

  if (hasDetails) {
    const details = mk("Frame", {
      name: "DetailsPanel",
      parentId: panel.id,
      pos: FLOW,
      size: { x: 1, y: 0.24 },
      color: T.raisedAlt,
      cornerRadius: 10,
      layout: "list",
      padding: 10,
    });
    nodes.push(
      details,
      mk("TextLabel", {
        name: "DetailsTitle",
        parentId: details.id,
        pos: FLOW,
        size: { x: 1, y: 0.3 },
        color: "#000000",
        transparency: 1,
        text: "SELECTED ITEM",
        font: "GothamBold",
        textSize: 14,
        textColor: T.inkDim,
      }),
      mk("TextLabel", {
        name: "ItemName",
        parentId: details.id,
        pos: FLOW,
        size: { x: 1, y: 0.3 },
        color: "#000000",
        transparency: 1,
        text: "Select a slot to inspect",
        font: "GothamMedium",
        textSize: 13,
        textColor: T.ink,
      })
    );
  }
  return nodes;
}

// ---- hud -------------------------------------------------------------------

function buildHud(spec: GuiDesignSpec, mk: ReturnType<typeof builder>): SceneNode[] {
  const gui = root(mk, "Hud");
  const nodes: SceneNode[] = [gui];

  const statBars = spec.blocks.filter((b) => b.type === "stat-bar");
  const skillBar = spec.blocks.find((b) => b.type === "skill-bar");
  const ultimate = spec.blocks.find((b) => b.type === "ultimate-meter");
  const currency = spec.blocks.find((b) => b.type === "currency-display");

  if (statBars.length > 0) {
    const panel = mk("Frame", {
      name: "StatsPanel",
      parentId: gui.id,
      pos: { x: 0.02, y: 0.04 },
      size: { x: 0.26, y: 0.1 + 0.15 * statBars.length },
      color: T.panel,
      cornerRadius: 12,
      layout: "list",
      padding: 8,
    });
    nodes.push(panel);
    statBars.forEach((block) => {
      if (block.type !== "stat-bar") return;
      const statName = block.stat[0].toUpperCase() + block.stat.slice(1);
      const row = mk("Frame", {
        name: `${statName}Row`,
        parentId: panel.id,
        pos: FLOW,
        size: { x: 1, y: 1 / statBars.length },
        color: "#000000",
        transparency: 1,
      });
      const barBg = mk("Frame", {
        name: `${statName}BarBg`,
        parentId: row.id,
        pos: { x: 0.2, y: 0.35 },
        size: { x: 0.78, y: 0.3 },
        color: "#232a36",
        cornerRadius: 999,
      });
      nodes.push(
        row,
        mk("TextLabel", {
          name: `${statName}Label`,
          parentId: row.id,
          pos: { x: 0.02, y: 0.2 },
          size: { x: 0.16, y: 0.6 },
          color: "#000000",
          transparency: 1,
          text: block.label ?? STAT_LABEL[block.stat],
          font: "GothamBold",
          textSize: 12,
          textColor: STAT_FILL[block.stat],
        }),
        barBg,
        mk("Frame", {
          name: `${statName}BarFill`,
          parentId: barBg.id,
          pos: FLOW,
          size: { x: STAT_FILL_FRACTION[block.stat], y: 1 },
          color: STAT_FILL[block.stat],
          cornerRadius: 999,
        })
      );
    });
  }

  if (ultimate) {
    const position = ultimate.type === "ultimate-meter" ? ultimate.position : undefined;
    const pos = position === "top-center"
      ? { x: 0.5, y: 0.12 }
      : position === "bottom-left"
        ? { x: 0.02, y: 0.84 }
        : { x: 0.5, y: 0.82 }; // default: above the skill bar
    const anchor =
      pos.x === 0.5 && pos.y > 0.5
        ? { x: 0.5, y: 1 }
        : pos.x === 0.5
          ? { x: 0.5, y: 0 }
          : undefined;
    const bg = mk("Frame", {
      name: "UltimateBg",
      parentId: gui.id,
      pos,
      size: { x: 0.28, y: 0.05 },
      color: "#232a36",
      cornerRadius: 999,
      ...(anchor ? { anchor } : {}),
    });
    nodes.push(
      bg,
      mk("Frame", {
        name: "UltimateFill",
        parentId: bg.id,
        pos: FLOW,
        size: { x: 0.55, y: 1 },
        color: "#a78bfa",
        cornerRadius: 999,
        gradient: {
          stops: [
            { at: 0, color: "#c4b5fd" },
            { at: 1, color: "#7c3aed" },
          ],
          rotation: 0,
        },
      }),
      mk("TextLabel", {
        name: "UltimateLabel",
        parentId: bg.id,
        pos: { x: 0.06, y: 0.1 },
        size: { x: 0.88, y: 0.8 },
        color: "#000000",
        transparency: 1,
        text: "ULTIMATE  55%",
        font: "GothamBold",
        textSize: 12,
        textColor: T.ink,
      })
    );
  }

  if (skillBar && skillBar.type === "skill-bar") {
    const slots = skillBar.slots;
    const position = skillBar.position ?? "bottom-center";
    const pos =
      position === "bottom-left"
        ? { x: 0.02, y: 0.92 }
        : position === "bottom-right"
          ? { x: 0.98, y: 0.92 }
          : position === "top-center"
            ? { x: 0.5, y: 0.08 }
            : { x: 0.5, y: 0.92 };
    const anchor =
      position === "bottom-center" || position === "top-center"
        ? { x: 0.5, y: position === "top-center" ? 0 : 1 }
        : position === "bottom-right"
          ? { x: 1, y: 1 }
          : undefined;
    const bar = mk("Frame", {
      name: "SkillBar",
      parentId: gui.id,
      pos,
      size: { x: Math.min(0.42, 0.09 * slots + 0.06), y: 0.1 },
      color: "#000000",
      transparency: 1,
      ...(anchor ? { anchor } : {}),
    });
    nodes.push(bar);
    for (let i = 0; i < slots; i++) {
      const slot = mk("Frame", {
        name: `Skill${i + 1}`,
        parentId: bar.id,
        pos: { x: i / slots, y: 0 },
        size: { x: 0.92 / slots, y: 1 },
        color: T.raisedAlt,
        cornerRadius: 10,
        stroke: { color: "#3a4a63", transparency: 0.5, thickness: 1.5 },
      });
      nodes.push(
        slot,
        mk("TextLabel", {
          name: "Key",
          parentId: slot.id,
          pos: { x: 0, y: 0.18 },
          size: { x: 1, y: 0.64 },
          color: "#000000",
          transparency: 1,
          text: String(i + 1),
          font: "GothamBold",
          textSize: 18,
          textColor: T.ink,
        })
      );
    }
  }

  if (currency && currency.type === "currency-display") {
    const count = currency.currencies.length;
    const container = mk("Frame", {
      name: "CurrencyPanel",
      parentId: gui.id,
      pos: { x: 0.74, y: 0.04 },
      size: { x: 0.24, y: 0.06 * count + 0.02 * (count - 1) },
      color: "#000000",
      transparency: 1,
      layout: "list",
      padding: 3,
    });
    nodes.push(container);
    currency.currencies.forEach((name, index) => {
      nodes.push(
        mk("TextLabel", {
          name: `${slugKey(name, `currency-${index + 1}`)}Display`,
          parentId: container.id,
          pos: FLOW,
          size: { x: 1, y: 1 / count },
          color: T.panel,
          cornerRadius: 999,
          text: index === 0 ? `${name}  12,450` : `${name}  0`,
          font: "GothamBold",
          textSize: 14,
          textColor: "#fbbf24",
        })
      );
    });
  }

  return nodes;
}

// ---- daily rewards ---------------------------------------------------------

function buildDailyRewards(
  spec: GuiDesignSpec,
  mk: ReturnType<typeof builder>
): SceneNode[] {
  const gui = root(mk, "DailyRewards");
  const nodes: SceneNode[] = [gui];

  const calendar = spec.blocks.find((b) => b.type === "reward-calendar");
  const days = calendar && calendar.type === "reward-calendar" ? calendar.days : 7;

  const panel = mk("Frame", {
    name: "RewardsPanel",
    parentId: gui.id,
    pos: { x: 0.1, y: 0.16 },
    size: { x: 0.8, y: 0.68 },
    color: T.panel,
    cornerRadius: 18,
    layout: "list",
    padding: 15,
  });
  nodes.push(panel);
  const claimedCount = Math.floor((days - 1) / 2);
  const currentDay = claimedCount + 1;
  nodes.push(
    mk("TextLabel", {
      name: "Title",
      parentId: panel.id,
      pos: FLOW,
      size: { x: 1, y: 0.1 },
      color: "#000000",
      transparency: 1,
      text: spec.title ?? "DAILY REWARDS",
      font: "GothamBold",
      textSize: 25,
      textColor: "#fbbf24",
    }),
    mk("TextLabel", {
      name: "StreakStatus",
      parentId: panel.id,
      pos: FLOW,
      size: { x: 1, y: 0.08 },
      color: "#000000",
      transparency: 1,
      text: `${claimedCount} DAY STREAK  |  Come back tomorrow to keep it going`,
      font: "GothamMedium",
      textSize: 13,
      textColor: T.inkDim,
    })
  );

  const dayGrid = mk("Frame", {
    name: "DayGrid",
    parentId: panel.id,
    pos: FLOW,
    size: { x: 1, y: 0.42 },
    color: "#000000",
    transparency: 1,
  });
  nodes.push(dayGrid);

  const BASE_REWARDS = ["100", "150", "200", "350", "500", "750", "CRATE"];
  for (let index = 0; index < days; index++) {
    const day = index + 1;
    const reward =
      index < BASE_REWARDS.length
        ? BASE_REWARDS[index]
        : `${1000 + 250 * (index - BASE_REWARDS.length + 1)}`;
    const isClaimed = day <= claimedCount;
    const isCurrent = day === currentDay;
    const card = mk("Frame", {
      name: `Day${day}`,
      parentId: dayGrid.id,
      pos: { x: index / days, y: 0.08 },
      size: { x: 0.92 / days, y: 0.8 },
      color: isCurrent ? "#9a6b12" : isClaimed ? "#243445" : T.input,
      cornerRadius: 9,
      layout: "list",
      padding: 6,
    });
    nodes.push(
      card,
      mk("TextLabel", {
        name: "DayLabel",
        parentId: card.id,
        pos: FLOW,
        size: { x: 1, y: 0.3 },
        color: "#000000",
        transparency: 1,
        text: isCurrent ? "TODAY" : `DAY ${day}`,
        font: "GothamBold",
        textSize: 11,
        textColor: isCurrent ? "#fff4cc" : T.inkDim,
      }),
      mk("TextLabel", {
        name: "RewardAmount",
        parentId: card.id,
        pos: FLOW,
        size: { x: 1, y: 0.35 },
        color: "#000000",
        transparency: 1,
        text: reward,
        font: "GothamBold",
        textSize: 14,
        textColor: isCurrent ? "#fbbf24" : T.ink,
      }),
      mk("TextLabel", {
        name: "RewardState",
        parentId: card.id,
        pos: FLOW,
        size: { x: 1, y: 0.22 },
        color: "#000000",
        transparency: 1,
        text: isClaimed ? "CLAIMED" : isCurrent ? "READY" : "LOCKED",
        font: "GothamMedium",
        textSize: 9,
        textColor: isClaimed ? "#7dd3fc" : isCurrent ? "#fde68a" : T.inkMute,
      })
    );
  }

  nodes.push(
    mk("TextLabel", {
      name: "CurrentReward",
      parentId: panel.id,
      pos: FLOW,
      size: { x: 1, y: 0.1 },
      color: T.input,
      cornerRadius: 8,
      text: `TODAY: DAY ${currentDay} REWARD`,
      font: "GothamBold",
      textSize: 15,
      textColor: "#fde68a",
    }),
    mk("TextButton", {
      name: "ClaimReward",
      parentId: panel.id,
      pos: FLOW,
      size: { x: 1, y: 0.11 },
      color: "#fbbf24",
      cornerRadius: 9,
      text: `CLAIM DAY ${currentDay}`,
      font: "GothamBold",
      textSize: 15,
      textColor: "#211600",
      action: {
        type: "remoteEvent",
        eventName: "ClaimDailyReward",
        argument: `day-${currentDay}`,
      },
    })
  );
  return nodes;
}

// ---- settings --------------------------------------------------------------

function buildSettings(
  spec: GuiDesignSpec,
  mk: ReturnType<typeof builder>
): SceneNode[] {
  const gui = root(mk, "Settings");
  const nodes: SceneNode[] = [gui];

  const toggles = spec.blocks.find((b) => b.type === "setting-toggles");
  const options =
    toggles && toggles.type === "setting-toggles"
      ? toggles.options
      : ["Music", "Sound Effects", "Graphics"];

  const panel = mk("Frame", {
    name: "SettingsPanel",
    parentId: gui.id,
    pos: { x: 0.28, y: 0.16 },
    size: { x: 0.44, y: 0.68 },
    color: T.panel,
    cornerRadius: 16,
    layout: "list",
    padding: 18,
  });
  nodes.push(panel);
  nodes.push(
    mk("TextLabel", {
      name: "Title",
      parentId: panel.id,
      pos: FLOW,
      size: { x: 1, y: 0.14 },
      color: "#000000",
      transparency: 1,
      text: spec.title ?? "SETTINGS",
      font: "GothamBold",
      textSize: 24,
      textColor: T.ink,
    })
  );

  const rowHeight = Math.min(0.16, Math.max(0.08, 0.68 / options.length));
  options.forEach((label, index) => {
    const row = mk("Frame", {
      name: `Row${index + 1}`,
      parentId: panel.id,
      pos: FLOW,
      size: { x: 1, y: rowHeight },
      color: T.raisedAlt,
      cornerRadius: 8,
    });
    nodes.push(
      row,
      mk("TextLabel", {
        name: "Label",
        parentId: row.id,
        pos: { x: 0.04, y: 0.3 },
        size: { x: 0.6, y: 0.4 },
        color: "#000000",
        transparency: 1,
        text: label,
        font: "GothamMedium",
        textSize: 16,
        textColor: T.ink,
      }),
      mk("Frame", {
        name: "Toggle",
        parentId: row.id,
        pos: { x: 0.82, y: 0.3 },
        size: { x: 0.12, y: 0.4 },
        color: index === options.length - 1 ? "#3a3d48" : T.success,
        cornerRadius: 999,
      })
    );
  });

  nodes.push(
    mk("TextButton", {
      name: "CloseSettings",
      parentId: panel.id,
      pos: FLOW,
      size: { x: 1, y: 0.12 },
      color: T.raised,
      cornerRadius: 10,
      text: "CLOSE",
      font: "GothamMedium",
      textSize: 16,
      textColor: T.ink,
      action: { type: "hideGui" },
    })
  );
  return nodes;
}

// ---- entry -----------------------------------------------------------------

const BUILDERS: Record<
  GuiDesignSpec["screenType"],
  (spec: GuiDesignSpec, mk: ReturnType<typeof builder>) => SceneNode[]
> = {
  "main-menu": buildMainMenu,
  shop: buildShop,
  inventory: buildInventory,
  hud: buildHud,
  "daily-rewards": buildDailyRewards,
  settings: buildSettings,
};

export function composeScene(spec: GuiDesignSpec): SceneNode[] {
  const nodes = BUILDERS[spec.screenType](spec, builder());
  const polished = enrichScene(nodes);
  return applyTheme(polished, resolvePalette(spec));
}

// Hard ceiling used by the API route before sanitizeScene — spec-level caps
// already keep composed scenes far below this, but the invariant is enforced
// where untrusted data enters the system.
export const COMPOSED_NODE_LIMIT = LIMITS.maxNodes;
