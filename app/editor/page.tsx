import type { Metadata } from "next";
import Link from "next/link";
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

const EDITOR_STEPS = [
  {
    n: "1",
    title: "Start from a prompt, template, or blank canvas",
    body: "Open a starter layout from our 13 free templates, arrive from the homepage AI prompt box, or drag ScreenGui, Frame, TextLabel, TextButton, ImageLabel, TextBox, and ScrollingFrame directly onto the canvas.",
  },
  {
    n: "2",
    title: "Configure real Roblox properties and decorators",
    body: "Adjust UDim2 Scale and Offset, AnchorPoint, BackgroundColor3, BackgroundTransparency, ZIndex, UICorner, UIStroke, UIGradient, UIListLayout, UIGridLayout, UIPadding, and size constraints without guessing property names.",
  },
  {
    n: "3",
    title: "Preview responsive viewports and button actions",
    body: "Switch between Desktop (1920×1080), Tablet, and Mobile frames, then toggle Preview mode to test Show, Hide, Toggle, RemoteEvent, and allow-listed Teleport actions before writing any Studio script.",
  },
  {
    n: "4",
    title: "Export clean Luau, JSON, ZIP, plugin sync, or .rbxmx",
    body: "Copy or download clean Instance.new client and server Luau scripts, save editable project JSON or ZIP archives, paste JSON straight into our offline Roblox Studio companion plugin, or export native Studio Pro .rbxmx models.",
  },
];

const EDITOR_FAQS = [
  {
    question: "Is Roblox GUI Editor free to use?",
    answer:
      "Yes. Visual editing, all 13 templates, interactive preview, clean client and server Luau exports, editable JSON and ZIP downloads, and the offline Roblox Studio paste-sync plugin are free with no account required. Optional Studio Pro unlocks native .rbxmx export and 10× AI generation quota.",
  },
  {
    question: "Do I need to download anything to use this Roblox GUI designer?",
    answer:
      "No download or installer is required. Roblox GUI Editor runs 100% in your web browser as a free online Roblox GUI designer, so you can build and preview interfaces from any desktop or tablet before moving files into Roblox Studio. If you want one-paste Studio import later, you can optionally download our open-source offline .lua plugin or export .lua, .json, .zip, and .rbxmx files.",
  },
  {
    question: "What export formats does the editor support for Roblox Studio?",
    answer:
      "You can copy or download a client LocalScript (.lua) for StarterGui, download an optional server Script (.lua) for RemoteEvent or Teleport handlers in ServerScriptService, save a versioned .json project you can re-import anytime, download a .zip bundle with setup notes, copy Plugin JSON for RobloxGuiMakerSync.lua, or export a drag-and-drop native .rbxmx model with Studio Pro.",
  },
  {
    question: "How is an online Roblox GUI designer different from Studio's built-in UI editor?",
    answer:
      "Instead of digging through nested Explorer properties to align frames and write boilerplate Instance.new code by hand, this online Roblox GUI designer keeps hierarchy, canvas snapping, real Roblox property names, responsive device previews, and live Luau code generation side by side in one workspace.",
  },
  {
    question: "Are my Roblox GUI projects uploaded or tied to my Roblox account?",
    answer:
      "No. Your GUI scene is autosaved locally in your browser's localStorage and never requires a Roblox login or .ROBLOSECURITY cookie.",
  },
];

const editorFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: EDITOR_FAQS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
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
    <>
      <Editor
        initialScene={initialScene}
        templateSlug={templateSlug}
        exampleSlug={exampleSlug}
      />
      <main
        aria-labelledby="editor-guide-heading"
        className="border-t border-line bg-base text-ink"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(editorFaqSchema).replace(/</g, "\\u003c"),
          }}
        />
        <div className="max-w-5xl mx-auto px-6 py-16 space-y-12">
          <header className="space-y-4 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-focus">
              Free Online Tool · No Download · Browser-Based Roblox GUI Designer
            </p>
            <h1
              id="editor-guide-heading"
              className="text-3xl md:text-4xl font-bold tracking-tight text-ink"
            >
              Roblox GUI Editor — Drag, Drop &amp; Export Clean Luau
            </h1>
            <p className="text-base text-ink-dim leading-relaxed">
              Build production-ready Roblox interfaces visually without fighting
              nested Explorer panels. This free online{" "}
              <strong className="text-ink">Roblox GUI designer</strong> runs
              directly in your browser with{" "}
              <strong className="text-ink">no download</strong> and no account
              required: place real{" "}
              <code className="text-focus">ScreenGui</code>,{" "}
              <code className="text-focus">Frame</code>,{" "}
              <code className="text-focus">TextButton</code>,{" "}
              <code className="text-focus">TextLabel</code>, and layout
              instances, test responsive screen sizes, and export clean Luau or
              Studio models in seconds.
            </p>
          </header>

          <section aria-labelledby="editor-steps-heading" className="space-y-5">
            <h2
              id="editor-steps-heading"
              className="text-2xl font-semibold text-ink"
            >
              How to use the Roblox GUI Editor
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {EDITOR_STEPS.map((step) => (
                <div
                  key={step.n}
                  className="rounded-xl border border-line bg-panel p-5"
                >
                  <div className="grid place-items-center w-7 h-7 rounded-lg bg-input text-focus font-bold text-sm mb-3">
                    {step.n}
                  </div>
                  <h3 className="text-base font-semibold text-ink mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-sm text-ink-dim leading-relaxed">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="editor-exports-heading" className="space-y-4">
            <h2
              id="editor-exports-heading"
              className="text-2xl font-semibold text-ink"
            >
              Export options for Roblox Studio
            </h2>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="rounded-xl border border-line bg-panel p-5 space-y-1.5">
                <h3 className="font-semibold text-ink">
                  Free Client &amp; Server Luau
                </h3>
                <p className="text-ink-dim leading-relaxed">
                  Clean <code className="text-focus">Instance.new</code> scripts
                  with exact <code className="text-focus">UDim2</code> scaling,
                  decorators, and separate server handlers for RemoteEvent or
                  Teleport actions.
                </p>
              </div>
              <div className="rounded-xl border border-line bg-panel p-5 space-y-1.5">
                <h3 className="font-semibold text-ink">
                  JSON, ZIP &amp; Offline Studio Plugin
                </h3>
                <p className="text-ink-dim leading-relaxed">
                  Save versioned JSON or ZIP project packages, or paste Plugin
                  JSON into our zero-permission{" "}
                  <Link
                    href="/studio-plugin"
                    className="text-focus hover:underline"
                  >
                    offline Studio plugin
                  </Link>{" "}
                  for instant ScreenGui materialization with Undo.
                </p>
              </div>
              <div className="rounded-xl border border-line bg-panel p-5 space-y-1.5">
                <h3 className="font-semibold text-ink">
                  Native Studio .rbxmx (Pro)
                </h3>
                <p className="text-ink-dim leading-relaxed">
                  Export a native XML model file ready to drag straight into
                  StarterGui. See{" "}
                  <Link href="/pricing" className="text-focus hover:underline">
                    Studio Pro pricing
                  </Link>{" "}
                  or browse{" "}
                  <Link href="/kits" className="text-focus hover:underline">
                    multi-screen Game UI Kits
                  </Link>
                  .
                </p>
              </div>
            </div>
          </section>

          <section aria-labelledby="editor-faq-heading" className="space-y-4">
            <h2
              id="editor-faq-heading"
              className="text-2xl font-semibold text-ink"
            >
              Frequently asked questions
            </h2>
            <div className="space-y-3">
              {EDITOR_FAQS.map((item) => (
                <details
                  key={item.question}
                  className="rounded-xl border border-line bg-panel"
                >
                  <summary className="cursor-pointer px-5 py-4 font-semibold text-ink marker:text-focus">
                    {item.question}
                  </summary>
                  <p className="px-5 pb-5 text-sm leading-relaxed text-ink-dim">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>

          <nav
            aria-label="Related GUI resources"
            className="flex flex-wrap gap-4 pt-6 border-t border-line text-sm"
          >
            <Link href="/" className="text-focus hover:underline">
              Roblox GUI Maker Home
            </Link>
            <Link href="/templates" className="text-focus hover:underline">
              13 Free GUI Templates
            </Link>
            <Link href="/guides" className="text-focus hover:underline">
              Roblox UI Guides
            </Link>
            <Link href="/roblox-ui-sizer" className="text-focus hover:underline">
              UDim2 UI Sizer
            </Link>
            <Link href="/studio-plugin" className="text-focus hover:underline">
              Offline Studio Plugin
            </Link>
          </nav>
        </div>
      </main>
    </>
  );
}
