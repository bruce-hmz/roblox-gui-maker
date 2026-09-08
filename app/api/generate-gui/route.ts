// POST /api/generate-gui — prompt → validated, editable SceneNode[] scene.
//
// Pipeline: validate request → guards (per-IP rate limit, daily budget) →
// provider (LLM → raw JSON) → parseGuiDesignSpec (strict, one repair retry)
// → deterministic composer → sanitizeScene → invariant checks → response.
// Any failure drops to the fallback ladder (see docs/ai-gui-p0.md): closest
// hand-built template, or a friendly 422. The client never receives provider
// names, keys, raw model text, or system prompts — only the scene and a
// sanitized meta object.

import { classifyScreenType } from "../../editor/ai/classify";
import { composeScene, COMPOSED_NODE_LIMIT } from "../../editor/ai/composer";
import { getProvider, ProviderError } from "../../editor/ai/provider";
import {
  checkAndRecord,
  createGuardState,
  guardConfigFromEnv,
  type GuardConfig,
  type GuardState,
} from "../../editor/ai/rate-limit";
import { LIMITS, parseGuiDesignSpec } from "../../editor/ai/spec";
import { getTemplate } from "../../editor/templates";
import { sanitizeScene } from "../../editor/persistence";
import type { SceneNode } from "../../editor/catalog";

// Closest hand-built template per screen type — fallback ladder level 3.
const TEMPLATE_BY_SCREEN: Record<string, string> = {
  "main-menu": "main-menu",
  shop: "game-pass-shop",
  inventory: "inventory",
  hud: "health-bar",
  "daily-rewards": "daily-rewards",
  settings: "settings",
};

const UNAVAILABLE_MESSAGE =
  "AI generation is temporarily unavailable. You can still use every template and the visual editor for free.";

// Per-instance guard state (see rate-limit.ts for the MVP tradeoff).
let guardState: GuardState | null = null;
let guardConfig: GuardConfig | null = null;

/** @internal test hook — reset cached guard state after stubbing env */
export function __resetGuardsForTests(): void {
  guardState = null;
  guardConfig = null;
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function json(body: unknown, status: number, headers?: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

export async function POST(request: Request): Promise<Response> {
  guardState = guardState ?? createGuardState();
  guardConfig = guardConfig ?? guardConfigFromEnv(process.env);

  const verdict = checkAndRecord(
    guardState,
    clientIp(request),
    guardConfig
  );
  if (!verdict.ok) {
    if (verdict.reason === "rate_limited") {
      return json(
        {
          error: "rate_limited",
          message: "You've hit the free generation limit for now. Try again soon — the editor and templates stay free.",
        },
        429,
        { "Retry-After": String(verdict.retryAfterSeconds) }
      );
    }
    return json({ error: "budget_exhausted", message: UNAVAILABLE_MESSAGE }, 503);
  }

  let body: { prompt?: unknown; locale?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ error: "invalid_request", message: "Expected a JSON body." }, 400);
  }

  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  if (prompt.length === 0 || prompt.length > LIMITS.promptChars) {
    return json(
      {
        error: "invalid_prompt",
        message: `Describe your GUI in 1–${LIMITS.promptChars} characters.`,
      },
      422
    );
  }
  const locale = body.locale === "zh" ? "zh" : "en";

  const provider = getProvider();
  if (!provider) {
    return json({ error: "ai_unavailable", message: UNAVAILABLE_MESSAGE }, 503);
  }

  const startedAt = Date.now();

  // Fallback ladder level 3: the closest hand-built template, classified from
  // the prompt itself. Returned as a normal 200 so the user still lands in a
  // working editor scene.
  const templateFallback = (): Response => {
    const screenType = classifyScreenType(prompt);
    const template = getTemplate(TEMPLATE_BY_SCREEN[screenType] ?? "main-menu");
    if (template) {
      return json({
        scene: template.scene,
        meta: {
          screenType,
          fallbackUsed: "template" as const,
          warnings: [],
          latencyMs: Date.now() - startedAt,
        },
      });
    }
    return json(
      {
        error: "generation_failed",
        message: "Generation could not be completed. Start from a template instead.",
      },
      422
    );
  };

  try {
    let generated = await provider.generateSpec({ prompt, locale });
    let parsed = parseGuiDesignSpec(generated.raw);

    if (!parsed.ok) {
      // Fallback level 1: one repair retry with the validation errors.
      try {
        generated = await provider.generateSpec({
          prompt,
          locale,
          repairErrors: parsed.errors,
        });
        parsed = parseGuiDesignSpec(generated.raw);
      } catch {
        // fall through to template
      }
    }

    if (!parsed.ok) return templateFallback();

    const composed = composeScene(parsed.spec);
    const scene = sanitizeScene(JSON.parse(JSON.stringify(composed)));
    if (
      !scene ||
      scene.length === 0 ||
      scene.length > COMPOSED_NODE_LIMIT ||
      !scene.some((n: SceneNode) => n.cls === "ScreenGui" && !n.parentId)
    ) {
      return templateFallback();
    }

    return json({
      scene,
      meta: {
        screenType: parsed.spec.screenType,
        fallbackUsed: false as const,
        warnings: parsed.warnings.slice(0, 5),
        latencyMs: generated.latencyMs,
      },
    });
  } catch (error) {
    if (error instanceof ProviderError && error.code === "not_configured") {
      return json({ error: "ai_unavailable", message: UNAVAILABLE_MESSAGE }, 503);
    }
    return templateFallback();
  }
}
