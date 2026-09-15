// Activation onboarding (v1): when an AI-generated scene first lands in the
// editor, pre-select a safe node and show a one-time "this is editable" hint.
// Pure helpers only — UI wiring lives in Editor.tsx. Nothing here may touch
// the scene: ai_scene_first_edit must keep meaning a real user mutation.

import type { SceneNode } from "./catalog";

// One hint per browser session (sessionStorage): a refresh or a later
// generation in the same tab must not re-interrupt the user.
export const ONBOARDING_SEEN_KEY = "rgm:ai-onboarding:v1";

export function onboardingSeen(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.sessionStorage.getItem(ONBOARDING_SEEN_KEY) === "1";
  } catch {
    return true; // storage blocked — never risk nagging
  }
}

export function markOnboardingSeen(): void {
  try {
    window.sessionStorage.setItem(ONBOARDING_SEEN_KEY, "1");
  } catch {
    // storage blocked — worst case the hint shows once more this session
  }
}

// Structural / decorator classes a first-time user gains nothing from
// selecting. (Decorators normally live as fields on nodes, not scene entries,
// but sanitizeScene could still hand us one.)
const SKIP_CLASSES = new Set([
  "ScreenGui",
  "UIListLayout",
  "UIGridLayout",
  "UICorner",
  "UIGradient",
  "UIPadding",
]);

// A "safe" first node is visible, has real extent, and belongs to a class a
// beginner immediately understands — text first, because the suggested first
// edit is a text or color change.
const TEXT_CLASSES = new Set(["TextLabel", "TextButton", "TextBox"]);

export function pickOnboardingNode(scene: SceneNode[]): SceneNode | null {
  const candidates = scene.filter((n) => {
    if (SKIP_CLASSES.has(n.cls)) return false;
    if (n.initialVisible === false) return false;
    if (n.size.x <= 0 || n.size.y <= 0) return false;
    // A transparent background is normal for text elements (the text itself,
    // drawn with textColor, is the visible surface) — HUD-style scenes set it
    // on every label. For shapes it means the node is genuinely invisible.
    if (!TEXT_CLASSES.has(n.cls) && n.transparency >= 1) return false;
    return true;
  });
  for (const cls of ["TextLabel", "TextButton", "TextBox"] as const) {
    const withText = candidates.find(
      (n) => n.cls === cls && (n.text ?? "").trim().length > 0
    );
    if (withText) return withText;
  }
  for (const cls of [
    "TextLabel",
    "TextButton",
    "TextBox",
    "Frame",
    "ImageLabel",
    "ScrollingFrame",
  ] as const) {
    const hit = candidates.find((n) => n.cls === cls);
    if (hit) return hit;
  }
  return candidates[0] ?? null;
}

export type OnboardingCopy = {
  title: string;
  body: string;
  hint: string;
  dismissLabel: string;
};

export const ONBOARDING_COPY: Record<"en" | "zh", OnboardingCopy> = {
  en: {
    title: "Your GUI is ready — click any element to edit it.",
    body: "Change text, colors, size, layout, and interactions. Everything here is a real editable Roblox UI.",
    hint: "Try it: change the text or color.",
    dismissLabel: "Dismiss onboarding",
  },
  zh: {
    title: "GUI 已生成——点击任意元素即可开始编辑。",
    body: "文字、颜色、尺寸、布局和交互都可以修改。",
    hint: "试一试：修改文字或颜色。",
    dismissLabel: "关闭引导",
  },
};
