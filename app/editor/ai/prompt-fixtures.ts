// Prompt fixtures: 30 classified prompts (5 per supported screen type) used
// by unit tests, the mock provider, and the 50-prompt real-model evaluation
// (scripts/eval-ai-gui.mjs adds 20 more). Data lives in prompt-fixtures.json
// so the Node-based eval script reads the exact same set without a TS build.
// Never send these prompts to analytics — they exist for pipelines only.

import type { ScreenType } from "./spec";
import fixtures from "./prompt-fixtures.json";

export type PromptFixture = {
  prompt: string;
  screenType: ScreenType;
};

export const PROMPT_FIXTURES: PromptFixture[] =
  fixtures.fixtures as PromptFixture[];

export const EVAL_EXTRA_PROMPTS: string[] = fixtures.evalExtra;
