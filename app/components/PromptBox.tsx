"use client";

// Homepage AI prompt box — the P0 funnel entry. POSTs the prompt to
// /api/generate-gui, hands the resulting scene to the editor via
// sessionStorage (never a giant URL), and redirects to /editor?generated=1.
// All copy is passed in so EN/ZH pages share one implementation.

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { trackEvent } from "../lib/track";
import { AI_HANDOFF_KEY, type AiHandoff } from "../lib/ai-handoff";
import { LIMITS } from "../editor/ai/spec";

type Copy = {
  placeholder: string;
  submit: string;
  submitting: string;
  chipsTitle: string;
  errors: Record<string, string>;
  fallbackLink: { label: string; href: string };
};

const EN_COPY: Copy = {
  placeholder:
    "Describe your Roblox GUI… e.g. an anime battleground HUD with health, four skills and an ultimate meter",
  submit: "Generate GUI",
  submitting: "Building your GUI…",
  chipsTitle: "Try one",
  errors: {
    invalid_prompt: "Describe your GUI in a sentence or two (max 600 characters).",
    rate_limited: "You've hit the free generation limit for now — try again soon.",
    budget_exhausted:
      "AI generation is paused for today. Templates and the editor stay free.",
    ai_unavailable:
      "AI generation is temporarily unavailable. Try again in a moment — or start from a template.",
    generation_failed:
      "That one didn't work. Try rewording it — or start from a template.",
    network: "Network error. Check your connection and try again.",
  },
  fallbackLink: { label: "Start from a template", href: "/templates" },
};

const ZH_COPY: Copy = {
  placeholder: "用一句话描述你的 Roblox 界面…比如:带血条、四个技能和必杀条的动漫对战 HUD",
  submit: "生成 GUI",
  submitting: "正在生成你的 GUI…",
  chipsTitle: "试一个",
  errors: {
    invalid_prompt: "请用一两句话描述你想要的界面(最多 600 字符)。",
    rate_limited: "已达当前免费生成次数上限,稍后再试。",
    budget_exhausted: "今日 AI 生成已暂停,模板和编辑器仍然免费可用。",
    ai_unavailable: "AI 生成暂时不可用,稍后再试 —— 或从模板开始。",
    generation_failed: "这次生成没成功,换个说法试试 —— 或从模板开始。",
    network: "网络出错了,请检查连接后重试。",
  },
  fallbackLink: { label: "从模板开始", href: "/templates" },
};

const EN_CHIPS = [
  "Simulator shop with 6 game passes",
  "Anime battleground HUD",
  "Horror main menu",
  "RPG inventory with 20 slots",
  "7-day daily rewards",
];

const ZH_CHIPS = [
  "Simulator shop with 6 game passes",
  "Anime battleground HUD",
  "Horror main menu",
  "RPG inventory with 20 slots",
  "7-day daily rewards",
];

export function PromptBox({ locale = "en" }: { locale?: "en" | "zh" }) {
  const router = useRouter();
  const copy = locale === "zh" ? ZH_COPY : EN_COPY;
  const chips = locale === "zh" ? ZH_CHIPS : EN_CHIPS;
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Recover gracefully if the user returns from the editor mid-handoff.
  useEffect(() => {
    try {
      window.sessionStorage.removeItem(AI_HANDOFF_KEY);
    } catch {
      // storage blocked — the editor will simply start blank
    }
  }, []);

  async function submit(prompt: string) {
    const trimmed = prompt.trim();
    if (!trimmed || loading) return;
    setError(null);
    setLoading(true);
    trackEvent("ai_prompt_submit", { promptLength: trimmed.length, locale });

    try {
      const response = await fetch("/api/generate-gui", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmed, locale }),
      });
      const data = (await response.json().catch(() => null)) as
        | { scene: unknown; meta?: AiHandoff["meta"]; error?: string }
        | null;

      if (!response.ok || !data?.scene || !data.meta) {
        const reason = data?.error ?? "network";
        setError(copy.errors[reason] ?? copy.errors.generation_failed);
        trackEvent("ai_generate_failure", { reason });
        setLoading(false);
        return;
      }

      trackEvent("ai_generate_success", {
        screenType: data.meta.screenType,
        fallbackUsed: data.meta.fallbackUsed === "template",
        latencyMs: data.meta.latencyMs,
      });
      if (data.meta.fallbackUsed === "template") {
        trackEvent("ai_generate_fallback", { screenType: data.meta.screenType });
      }

      const handoff: AiHandoff = { prompt: trimmed, scene: data.scene, meta: data.meta };
      window.sessionStorage.setItem(AI_HANDOFF_KEY, JSON.stringify(handoff));
      router.push("/editor?generated=1");
    } catch {
      setError(copy.errors.network);
      trackEvent("ai_generate_failure", { reason: "network" });
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void submit(value);
        }}
        className="rounded-2xl border border-line bg-panel p-2 shadow-2xl shadow-black/40 focus-within:ring-2 focus-within:ring-focus transition"
      >
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void submit(value);
            }
          }}
          rows={2}
          maxLength={LIMITS.promptChars}
          aria-label={locale === "zh" ? "描述你的 Roblox GUI" : "Describe your Roblox GUI"}
          placeholder={copy.placeholder}
          disabled={loading}
          className="w-full resize-none bg-transparent px-3 py-2.5 text-[15px] text-ink placeholder:text-ink-mute focus:outline-none disabled:opacity-60"
          data-editor-shortcuts="ignore"
        />
        <div className="flex items-center justify-between gap-3 px-2 pb-1">
          <span className="text-[11px] text-ink-mute hidden sm:inline">
            {locale === "zh" ? "支持中英文 · Enter 生成" : "Enter to generate · Shift+Enter for a new line"}
          </span>
          <button
            type="submit"
            disabled={loading || value.trim().length === 0}
            className="ml-auto inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-on-primary transition hover:brightness-110 disabled:opacity-50 disabled:hover:brightness-100"
          >
            {loading && (
              <span
                aria-hidden
                className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-on-primary/40 border-t-on-primary"
              />
            )}
            {loading ? copy.submitting : copy.submit}
          </button>
        </div>
      </form>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2" aria-label={copy.chipsTitle}>
        <span className="text-xs text-ink-mute">{copy.chipsTitle}:</span>
        {chips.map((chip) => (
          <button
            key={chip}
            type="button"
            disabled={loading}
            onClick={() => {
              setValue(chip);
              setError(null);
            }}
            className="rounded-full border border-line bg-panel px-3 py-1 text-xs text-ink-dim transition hover:border-focus hover:text-ink disabled:opacity-50"
          >
            {chip}
          </button>
        ))}
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-danger">
          {error}{" "}
          <a href={copy.fallbackLink.href} className="underline underline-offset-2">
            {copy.fallbackLink.label}
          </a>
        </p>
      )}
    </div>
  );
}
