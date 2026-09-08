import type { Metadata } from "next";
import { Editor } from "./Editor";
import { exampleScene, getAiExample } from "./ai/examples";
import { getTemplate } from "./templates";
import { applyTheme, getTheme } from "./themes";

export const metadata: Metadata = {
  title: "Roblox GUI Editor — Drag, Drop & Export Luau | Roblox GUI Maker",
  description:
    "Free online Roblox GUI editor. Drag and drop ScreenGui, Frame, TextButton, preview interactions, and export clean Luau for Roblox Studio. No login required.",
  alternates: { canonical: "/editor" },
};

// /editor — the tool. Reads ?template=<slug> to load a starting scene,
// ?theme=<name> to recolor it with a theme (used by kit "open in editor"
// links), and ?example=<slug> to load a fixed AI example scene (composed
// deterministically — no LLM involved).
export default async function EditorPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string; theme?: string; example?: string }>;
}) {
  const { template, theme, example } = await searchParams;
  let initialScene = template ? getTemplate(template)?.scene : undefined;
  if (!initialScene && example) {
    const aiExample = getAiExample(example);
    if (aiExample) initialScene = exampleScene(aiExample);
  }
  if (initialScene && theme) {
    const palette = getTheme(theme);
    if (palette) initialScene = applyTheme(initialScene, palette);
  }
  // templateSlug is set only when ?template=<slug> resolved to a real scene
  // (with or without a theme applied), so the editor's open_template event
  // fires for genuine template sessions — never for blank or restored ones.
  const templateSlug = initialScene && template ? template : undefined;
  const exampleSlug = initialScene && example ? example : undefined;
  return (
    <Editor
      initialScene={initialScene}
      templateSlug={templateSlug}
      exampleSlug={exampleSlug}
    />
  );
}
