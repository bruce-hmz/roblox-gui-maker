// Theme system (Phase 1, approach B): a theme is a palette of slot colors that
// recolors a scene via applyTheme. It does NOT change SceneNode's shape — nodes
// keep literal hex values; applyTheme maps the known base palette onto a theme.
//
// Decorative colors (gold, per-item accent purples/skies) are intentionally NOT
// in the map: a kit stays cohesive through its structural palette shifting, while
// decorative pops keep their variety.

import type { SceneNode } from "./catalog";

export type Palette = {
  surface: string; // darkest — full-screen backgrounds
  panel: string; // mid — main panels / cards
  panelRaised: string; // lighter — inputs, raised sub-panels, rows
  primary: string; // vivid — primary action buttons
  onPrimary: string; // text/icon color on primary buttons
  accent: string; // secondary highlight — titles, focus
  success: string; // confirm / reward green
  ink: string; // primary text
  inkDim: string; // secondary text
  inkMute: string; // tertiary text / hints
};

export type Theme = { name: string } & Palette;

// Base-palette hexes used across templates, bucketed by the slot they represent.
// The layering (surface < panel < panelRaised) is what makes a theme read.
const SLOT_BY_HEX: Record<string, keyof Palette> = {
  // surface
  "#0b0d14": "surface",
  "#0c0e17": "surface",
  "#0e0f16": "surface",
  // panel
  "#15171f": "panel",
  "#151923": "panel",
  "#191b24": "panel",
  // panel-raised / input / mid
  "#1d1f29": "panelRaised",
  "#202735": "panelRaised",
  "#242836": "panelRaised",
  "#243042": "panelRaised",
  "#263346": "panelRaised",
  "#282933": "panelRaised",
  "#303a49": "panelRaised",
  "#32343e": "panelRaised",
  "#3a3d48": "panelRaised",
  // primary
  "#00a2ff": "primary",
  // on-primary (dark text on primary buttons)
  "#001d34": "onPrimary",
  "#07111c": "onPrimary",
  // accent (focus / light blue used in titles)
  "#99cbff": "accent",
  // success
  "#4cddb1": "success",
  "#34d399": "success",
  "#6ee7b7": "success",
  // ink
  "#e1e1ef": "ink",
  "#e6f4ff": "ink",
  "#f1f5f9": "ink",
  // ink-dim
  "#bec7d4": "inkDim",
  "#c8d3df": "inkDim",
  "#d8dee9": "inkDim",
  "#aab6c5": "inkDim",
  "#a7b2c1": "inkDim",
  "#9aa7b7": "inkDim",
  "#8da2b8": "inkDim",
  // ink-mute
  "#89919d": "inkMute",
  "#758295": "inkMute",
};

function normalizeHex(hex: string): string {
  const h = hex.trim().toLowerCase();
  return h.startsWith("#") ? h : `#${h}`;
}

function recolor(hex: string | undefined, palette: Palette): string | undefined {
  if (!hex) return hex;
  const slot = SLOT_BY_HEX[normalizeHex(hex)];
  return slot ? palette[slot] : hex;
}

// Returns a NEW scene with structural colors mapped onto the palette.
// Input is never mutated. Unmapped (decorative) colors pass through unchanged.
export function applyTheme(scene: SceneNode[], palette: Palette): SceneNode[] {
  return scene.map((n) => {
    const next: SceneNode = {
      ...n,
      color: recolor(n.color, palette) ?? n.color,
    };
    if (n.textColor) next.textColor = recolor(n.textColor, palette);
    if (n.imageColor) next.imageColor = recolor(n.imageColor, palette);
    if (n.stroke) {
      next.stroke = { ...n.stroke, color: recolor(n.stroke.color, palette) ?? n.stroke.color };
    }
    if (n.gradient) {
      next.gradient = {
        stops: n.gradient.stops.map((s) => ({
          ...s,
          color: recolor(s.color, palette) ?? s.color,
        })),
        rotation: n.gradient.rotation,
      };
    }
    return next;
  });
}

export const THEMES: Theme[] = [
  {
    name: "nexus",
    surface: "#0c0e17",
    panel: "#191b24",
    panelRaised: "#1d1f29",
    primary: "#00a2ff",
    onPrimary: "#001d34",
    accent: "#99cbff",
    success: "#4cddb1",
    ink: "#e1e1ef",
    inkDim: "#bec7d4",
    inkMute: "#89919d",
  },
  {
    name: "sunset",
    surface: "#170e10",
    panel: "#241519",
    panelRaised: "#311c22",
    primary: "#ff7a45",
    onPrimary: "#2a0d03",
    accent: "#ffd166",
    success: "#7bd389",
    ink: "#fbe9e7",
    inkDim: "#d6b3ab",
    inkMute: "#99736c",
  },
  {
    name: "arctic",
    surface: "#080f13",
    panel: "#0e1c22",
    panelRaised: "#132a33",
    primary: "#38bdf8",
    onPrimary: "#03161f",
    accent: "#a5f3fc",
    success: "#34d399",
    ink: "#e6f4f7",
    inkDim: "#a8c4cb",
    inkMute: "#6b868f",
  },
  {
    name: "emerald",
    surface: "#08120e",
    panel: "#0f2019",
    panelRaised: "#163025",
    primary: "#10b981",
    onPrimary: "#022c1e",
    accent: "#6ee7b7",
    success: "#34d399",
    ink: "#ecfdf5",
    inkDim: "#a7f3d0",
    inkMute: "#6b9e89",
  },
  {
    name: "royal",
    surface: "#0e0a1a",
    panel: "#18122b",
    panelRaised: "#241b3d",
    primary: "#a855f7",
    onPrimary: "#1f0538",
    accent: "#e9d5ff",
    success: "#4cddb1",
    ink: "#f5f3ff",
    inkDim: "#c4b5fd",
    inkMute: "#8b7aa8",
  },
  {
    name: "crimson",
    surface: "#14090b",
    panel: "#221014",
    panelRaised: "#31171d",
    primary: "#f43f5e",
    onPrimary: "#2d040d",
    accent: "#fda4af",
    success: "#4ade80",
    ink: "#fff1f2",
    inkDim: "#fecdd3",
    inkMute: "#9f7078",
  },
];

export function getTheme(name: string): Theme | undefined {
  return THEMES.find((t) => t.name === name);
}
