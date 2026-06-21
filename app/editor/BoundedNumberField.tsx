"use client";

import { useEffect, useId, useRef, useState } from "react";

export type BoundedNumberFieldProps = {
  ariaLabel: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onCommit: (value: number) => void;
};

function draftError(draft: string, min: number, max: number): string | null {
  if (draft.trim() === "") return "A value is required.";
  const number = Number(draft);
  if (!Number.isFinite(number)) return "Enter a valid number.";
  if (number < min || number > max) {
    return `Enter a value from ${min} to ${max}.`;
  }
  return null;
}

function decimalPlaces(value: number): number {
  const [coefficient, exponentText] = value.toString().toLowerCase().split("e");
  const fractionLength = (coefficient.split(".")[1] ?? "").length;
  const exponent = exponentText === undefined ? 0 : Number(exponentText);
  return Math.max(0, fractionLength - exponent);
}

export function BoundedNumberField({
  ariaLabel,
  value,
  min,
  max,
  step,
  onCommit,
}: BoundedNumberFieldProps) {
  const [draft, setDraft] = useState(String(value));
  const focused = useRef(false);
  const errorId = useId();
  const error = draftError(draft, min, max);

  useEffect(() => {
    if (!focused.current) setDraft(String(value));
  }, [value]);

  return (
    <div className="min-w-0">
      <input
        type="text"
        role="spinbutton"
        inputMode="decimal"
        aria-label={ariaLabel}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={error ? value : Number(draft)}
        aria-valuetext={error ? `Invalid draft "${draft}": ${error}` : undefined}
        value={draft}
        data-step={step}
        onFocus={() => {
          focused.current = true;
        }}
        onBlur={() => {
          focused.current = false;
          if (!draftError(draft, min, max)) setDraft(String(value));
        }}
        onChange={(event) => {
          const nextDraft = event.target.value;
          setDraft(nextDraft);
          if (!draftError(nextDraft, min, max)) onCommit(Number(nextDraft));
        }}
        onKeyDown={(event) => {
          if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
          event.preventDefault();
          const current = error ? value : Number(draft);
          const direction = event.key === "ArrowUp" ? 1 : -1;
          const precision = Math.max(decimalPlaces(current), decimalPlaces(step));
          const scale = 10 ** precision;
          let next: number;
          if (Number.isFinite(scale)) {
            const scaledValues = [current, step, min, max].map((number) =>
              Math.round(number * scale)
            );
            if (scaledValues.every(Number.isSafeInteger)) {
              const [scaledCurrent, scaledStep, scaledMin, scaledMax] = scaledValues;
              const scaledNext = Math.max(
                scaledMin,
                Math.min(scaledMax, scaledCurrent + direction * scaledStep)
              );
              next = scaledNext / scale;
            } else {
              next = Math.max(min, Math.min(max, current + direction * step));
            }
          } else {
            next = Math.max(min, Math.min(max, current + direction * step));
          }
          if (!Number.isFinite(next) || next < min || next > max) return;
          setDraft(String(next));
          onCommit(next);
        }}
        className={`w-full min-w-0 rounded bg-input px-2 py-1 text-xs font-mono text-ink outline-none focus:ring-1 ${
          error ? "ring-1 ring-danger focus:ring-danger" : "focus:ring-focus"
        }`}
      />
      {error && (
        <p id={errorId} role="alert" className="mt-1 text-[10px] leading-tight text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
