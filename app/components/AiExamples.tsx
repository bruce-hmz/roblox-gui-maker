// AI example cards — every card shows the real composed scene for a fixed
// GuiDesignSpec (no LLM involved), as a screenshot of the editor canvas
// (scripts/capture-previews.mjs). "Open in Editor" loads the identical scene
// via /editor?example=<slug>, so the homepage examples double as the product
// demo and the visual benchmark.

import Link from "next/link";
import { SceneThumb } from "./SceneThumb";
import { examplePreviewSrc } from "../editor/preview-images";
import { AI_EXAMPLES } from "../editor/ai/examples";

export function AiExamples({
  heading,
  subheading,
  openLabel,
}: {
  heading: string;
  subheading: string;
  openLabel: string;
}) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <h2 className="text-2xl md:text-3xl font-semibold text-center mb-3">
        {heading}
      </h2>
      <p className="text-ink-dim text-center max-w-2xl mx-auto mb-8">
        {subheading}
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {AI_EXAMPLES.map((example) => (
          <article
            key={example.slug}
            className="rounded-xl overflow-hidden ring-1 ring-line bg-panel hover:ring-focus transition flex flex-col"
          >
            <SceneThumb
              src={examplePreviewSrc(example.slug)}
              alt={`${example.title}: AI-generated Roblox GUI example`}
            />
            <div className="p-4 flex flex-col gap-2 flex-1">
              <h3 className="text-sm font-semibold text-ink">{example.title}</h3>
              <p className="text-xs text-ink-mute leading-relaxed">
                <span className="text-focus font-medium">Prompt: </span>
                &ldquo;{example.prompt}&rdquo;
              </p>
              <Link
                href={`/editor?example=${example.slug}`}
                className="mt-auto text-sm text-focus hover:underline font-medium"
              >
                {openLabel} →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
