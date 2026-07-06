"use client";

import { useEffect, useRef, useState } from "react";
import { ScenePreview } from "../editor/ScenePreview";
import { generateLuau } from "../editor/scene";
import type { SceneNode } from "../editor/catalog";

const STEP_MS = 900;

// Auto-playing hero demo: a scene builds up on the canvas one node at a time
// while the exported Luau grows alongside it, then loops. The visual→code link
// is the product's core differentiator, so it sits at the top of the landing
// page. Pauses on hover (so the code can be read) and shows the finished scene
// with no animation when the visitor prefers reduced motion.
export function HeroDemo({ buildOrder }: { buildOrder: SceneNode[] }) {
  // Cumulative prefixes = each build step is a valid, renderable scene.
  const stages = buildOrder.map((_, i) => buildOrder.slice(0, i + 1));
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);
  const reduceRef = useRef(false);

  // prefers-reduced-motion: jump to the finished scene and don't animate.
  useEffect(() => {
    reduceRef.current = !!window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceRef.current) setStep(stages.length - 1);
  }, [stages.length]);

  // Advance one build step at a time, looping.
  useEffect(() => {
    if (paused || reduceRef.current) return;
    const id = setTimeout(() => setStep((s) => (s + 1) % stages.length), STEP_MS);
    return () => clearTimeout(id);
  }, [step, paused, stages.length]);

  // Keep the newest generated lines in view as the code grows.
  useEffect(() => {
    if (codeRef.current) codeRef.current.scrollTop = codeRef.current.scrollHeight;
  }, [step]);

  const scene = stages[step] ?? buildOrder;
  const code = generateLuau(scene);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="rounded-2xl ring-1 ring-line overflow-hidden shadow-2xl shadow-black/40 bg-base"
    >
      <div className="grid md:grid-cols-2">
        <div className="p-3 sm:p-4 border-b md:border-b-0 md:border-r border-line flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-dim">
              Canvas
            </span>
            <span className="text-[11px] text-ink-mute tabular-nums">
              {scene.length} element{scene.length === 1 ? "" : "s"}
            </span>
          </div>
          <ScenePreview scene={scene} />
        </div>
        <div className="p-3 sm:p-4 bg-panel flex flex-col gap-2.5 min-w-0">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-dim">
              Export · Luau
            </span>
            <span className="text-[11px] text-ink-mute">LocalScript</span>
          </div>
          <pre
            ref={codeRef}
            className="scroll-thin overflow-auto h-48 md:h-64 rounded-lg bg-[#0d0f16] ring-1 ring-line-soft p-3 font-mono text-[11px] leading-relaxed text-ink-dim"
          >
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
