// Mood → palette resolution for AI-composed scenes. Composers always emit the
// template base palette hexes, then applyTheme() maps them through the palette
// chosen here — the exact mechanism kits use, so mood styling costs nothing
// new. Decorative hexes (gold prices, stat colors) intentionally pass through.

import type { Palette } from "../themes";
import { THEMES } from "../themes";
import type { Genre, GuiDesignSpec, Mood } from "./spec";

const DARK: Palette = {
  surface: "#07080d",
  panel: "#101219",
  panelRaised: "#1a1d28",
  primary: "#3b82f6",
  onPrimary: "#061224",
  accent: "#bfdbfe",
  success: "#34d399",
  ink: "#e2e8f0",
  inkDim: "#94a3b8",
  inkMute: "#64748b",
};

const NEON: Palette = {
  surface: "#0a0f14",
  panel: "#0f172a",
  panelRaised: "#16233a",
  primary: "#22d3ee",
  onPrimary: "#052e35",
  accent: "#a5f3fc",
  success: "#4ade80",
  ink: "#e0f2fe",
  inkDim: "#94b8c8",
  inkMute: "#5f7f8f",
};

const FANTASY: Palette = {
  surface: "#120d1a",
  panel: "#1d1530",
  panelRaised: "#292045",
  primary: "#a78bfa",
  onPrimary: "#150a2e",
  accent: "#c4b5fd",
  success: "#34d399",
  ink: "#ede9fe",
  inkDim: "#b7aecb",
  inkMute: "#7e7391",
};

// The one light mood — every mapped slot (including inks) flips, so text
// stays readable on the light surfaces.
const CUTE: Palette = {
  surface: "#fff1f5",
  panel: "#fff8fb",
  panelRaised: "#ffe0ec",
  primary: "#ff5c8a",
  onPrimary: "#3d0014",
  accent: "#d6336c",
  success: "#2fbf8f",
  ink: "#4a2b36",
  inkDim: "#7a5560",
  inkMute: "#a98f98",
};

const MOOD_PALETTES: Record<Mood, Palette> = {
  clean: THEMES[0], // nexus
  dark: DARK,
  neon: NEON,
  fantasy: FANTASY,
  cute: CUTE,
};

// Genre flavor when the caller didn't name a mood.
const GENRE_MOOD: Record<Genre, Mood> = {
  simulator: "clean",
  rpg: "fantasy",
  anime: "neon",
  horror: "dark",
  tycoon: "clean",
  generic: "clean",
};

export function resolvePalette(spec: GuiDesignSpec): Palette {
  const mood = spec.mood ?? (spec.genre ? GENRE_MOOD[spec.genre] : "clean");
  const palette = { ...MOOD_PALETTES[mood] };
  if (spec.primaryColor) palette.primary = spec.primaryColor;
  if (spec.accentColor) palette.accent = spec.accentColor;
  return palette;
}
