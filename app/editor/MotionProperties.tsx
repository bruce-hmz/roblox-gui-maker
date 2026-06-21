"use client";

import type { MotionPreset, SceneNode, SlideDirection } from "./catalog";
import { BoundedNumberField } from "./BoundedNumberField";
import { resolveSceneMotion, sanitizeMotion } from "./motion";

type MotionPropertiesProps = {
  node: SceneNode;
  scene: SceneNode[];
  onChange: (patch: Partial<SceneNode>) => void;
};

const selectClass =
  "w-full rounded bg-input px-2 py-1 text-xs text-ink outline-none focus:ring-1 focus:ring-focus";

export function MotionProperties({ node, scene, onChange }: MotionPropertiesProps) {
  const resolved = resolveSceneMotion(scene).get(node.id);
  if (!resolved?.eligible) return null;

  const commitMotion = (patch: Partial<NonNullable<SceneNode["motion"]>>) => {
    onChange({ motion: sanitizeMotion({ ...node.motion, ...patch }, node.cls) });
  };
  const preset = node.motion?.preset;
  const warning =
    preset === "slide" && resolved.slideBlocked && resolved.fadeBlocked
      ? "Slide uses Scale: layout fallback Fade is owned by an ancestor."
      : preset === "slide" && resolved.slideBlocked
        ? "Slide uses Fade while the parent controls layout."
        : preset === "fade" && resolved.fadeBlocked
          ? "Fade uses Scale while an ancestor fades this subtree."
          : null;

  return (
    <section role="group" aria-label="Motion">
      <h3 className="mb-1.5 px-1 text-[11px] font-bold uppercase tracking-wider text-ink-mute">
        Motion
      </h3>
      <div className="flex flex-col gap-1">
        <div className="px-1 py-1">
          <label className="mb-1 block text-[11px] text-ink-mute" htmlFor={`transition-${node.id}`}>
            Transition
          </label>
          <select
            id={`transition-${node.id}`}
            aria-label="Transition"
            value={preset ?? "none"}
            onChange={(event) =>
              commitMotion({
                preset:
                  event.target.value === "none"
                    ? undefined
                    : (event.target.value as MotionPreset),
              })
            }
            className={selectClass}
          >
            <option value="none">None</option>
            <option value="fade">Fade</option>
            <option value="slide" disabled={resolved.slideBlocked}>Slide</option>
            <option value="scale">Scale</option>
          </select>
        </div>

        {(preset !== undefined || resolved.hover) && (
          <div className="px-1 py-1">
            <span className="mb-1 block text-[11px] text-ink-mute">Duration</span>
            <BoundedNumberField
              ariaLabel="Motion duration"
              value={resolved.durationMs}
              min={100}
              max={2000}
              step={10}
              onCommit={(durationMs) => commitMotion({ durationMs: Math.round(durationMs) })}
            />
          </div>
        )}

        {preset === "slide" && (
          <div className="px-1 py-1">
            <label className="mb-1 block text-[11px] text-ink-mute" htmlFor={`slide-direction-${node.id}`}>
              Slide direction
            </label>
            <select
              id={`slide-direction-${node.id}`}
              aria-label="Slide direction"
              value={resolved.slideDirection}
              onChange={(event) =>
                commitMotion({ slideDirection: event.target.value as SlideDirection })
              }
              className={selectClass}
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
              <option value="up">Up</option>
              <option value="down">Down</option>
            </select>
          </div>
        )}

        {node.cls === "TextButton" && (
          <label className="flex items-center justify-between gap-2 px-1 py-1 text-[11px] text-ink-mute">
            Hover scale
            <input
              type="checkbox"
              aria-label="Hover scale"
              checked={resolved.hover}
              onChange={(event) =>
                commitMotion({ hover: event.target.checked ? true : undefined })
              }
              className="h-4 w-4 accent-focus"
            />
          </label>
        )}

        {warning && (
          <p role="status" className="px-1 py-1 text-[10px] leading-tight text-warning">
            {warning}
          </p>
        )}
      </div>
    </section>
  );
}
