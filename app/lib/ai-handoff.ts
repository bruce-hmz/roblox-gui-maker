// Shared AI handoff contract between the homepage PromptBox (writer) and the
// editor (reader). Kept dependency-free so both client bundles stay small.

export const AI_HANDOFF_KEY = "rgm:ai-handoff:v1";

export type AiHandoff = {
  prompt: string;
  scene: unknown;
  meta: {
    screenType: string;
    fallbackUsed: boolean | "template";
    warnings?: string[];
    latencyMs: number;
  };
  // UI locale of the page that started the generation, so the editor's
  // onboarding copy matches the user's language. Optional for older payloads.
  locale?: "en" | "zh";
};
