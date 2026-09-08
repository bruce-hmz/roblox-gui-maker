// AI provider abstraction. Everything above this layer speaks
// GuiGenerationProvider; everything below is one vendor's HTTP shape. The GLM
// provider uses the OpenAI-compatible chat-completions endpoint with JSON
// mode; the mock provider is a deterministic keyword classifier used by e2e
// tests and local development (never silently in production).

import { mockSpecFromPrompt } from "./classify";
import { repairPromptContent, systemPrompt, userPromptContent } from "./prompt";

export type GenerateInput = {
  prompt: string;
  locale: string;
  repairErrors?: string[];
};

// Raw parsed JSON of the model's answer (still unvalidated — parseGuiDesignSpec
// is the authority).
export type GenerateOutput = { raw: unknown; latencyMs: number };

export class ProviderError extends Error {
  code: "timeout" | "http" | "invalid_json" | "not_configured";
  constructor(code: ProviderError["code"], message: string) {
    super(message);
    this.code = code;
  }
}

export interface GuiGenerationProvider {
  readonly name: string;
  generateSpec(input: GenerateInput): Promise<GenerateOutput>;
}

// ---- JSON extraction ---------------------------------------------------------

// Models occasionally wrap JSON in prose or code fences despite instructions.
// Pull the outermost {...} block and parse it.
export function extractJsonObject(text: string): unknown {
  const withoutFences = text.replace(/```(?:json)?/gi, "").trim();
  const start = withoutFences.indexOf("{");
  const end = withoutFences.lastIndexOf("}");
  if (start < 0 || end <= start) {
    throw new ProviderError("invalid_json", "Model returned no JSON object.");
  }
  try {
    return JSON.parse(withoutFences.slice(start, end + 1));
  } catch {
    throw new ProviderError("invalid_json", "Model returned malformed JSON.");
  }
}

// ---- GLM (OpenAI-compatible) -------------------------------------------------

type GlmDeps = {
  fetchImpl?: typeof fetch;
  baseUrl: string;
  apiKey: string;
  model: string;
  timeoutMs: number;
};

// Exported for tests (fetch injection); production code goes through
// getProvider()/getProviderFromEnv().
export function createGlmProvider(deps: GlmDeps): GuiGenerationProvider {
  const doFetch = deps.fetchImpl ?? fetch;
  return {
    name: "glm",
    async generateSpec(input: GenerateInput): Promise<GenerateOutput> {
      const started = Date.now();
      const content =
        input.repairErrors && input.repairErrors.length > 0
          ? repairPromptContent(input.prompt, input.locale, input.repairErrors)
          : userPromptContent(input.prompt, input.locale);

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), deps.timeoutMs);
      let response: Response;
      try {
        response = await doFetch(`${deps.baseUrl}/chat/completions`, {
          method: "POST",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${deps.apiKey}`,
          },
          body: JSON.stringify({
            model: deps.model,
            messages: [
              { role: "system", content: systemPrompt() },
              { role: "user", content },
            ],
            temperature: 0.3,
            max_tokens: 1400,
            response_format: { type: "json_object" },
          }),
        });
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          throw new ProviderError("timeout", "Provider call timed out.");
        }
        throw new ProviderError("http", "Provider request failed.");
      } finally {
        clearTimeout(timer);
      }

      if (!response.ok) {
        // Some models reject response_format — retry once without it.
        if (response.status === 400) {
          const retry = await doFetch(`${deps.baseUrl}/chat/completions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${deps.apiKey}`,
            },
            body: JSON.stringify({
              model: deps.model,
              messages: [
                { role: "system", content: systemPrompt() },
                { role: "user", content: `${content}\n\nRespond with a single JSON object and nothing else.` },
              ],
              temperature: 0.3,
              max_tokens: 1400,
            }),
          });
          if (retry.ok) {
            const payload = (await retry.json()) as {
              choices?: { message?: { content?: string } }[];
            };
            const text = payload.choices?.[0]?.message?.content ?? "";
            return { raw: extractJsonObject(text), latencyMs: Date.now() - started };
          }
        }
        throw new ProviderError(
          "http",
          `Provider responded ${response.status}.`
        );
      }

      const payload = (await response.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const text = payload.choices?.[0]?.message?.content ?? "";
      return { raw: extractJsonObject(text), latencyMs: Date.now() - started };
    },
  };
}

// ---- Mock (deterministic, dev/e2e only) --------------------------------------

function createMockProvider(): GuiGenerationProvider {
  return {
    name: "mock",
    async generateSpec(input: GenerateInput) {
      const started = Date.now();
      return { raw: mockSpecFromPrompt(input.prompt), latencyMs: Date.now() - started };
    },
  };
}

// ---- Selection ----------------------------------------------------------------

export function getProviderFromEnv(env: {
  AI_PROVIDER?: string;
  GLM_API_KEY?: string;
  GLM_MODEL?: string;
  GLM_BASE_URL?: string;
  AI_TIMEOUT_MS?: string;
  NODE_ENV?: string;
}): GuiGenerationProvider | null {
  const explicit = env.AI_PROVIDER?.trim().toLowerCase();
  if (explicit === "mock") return createMockProvider();
  if (explicit === "disabled") return null;
  if (env.GLM_API_KEY) {
    return createGlmProvider({
      baseUrl: env.GLM_BASE_URL?.trim() || "https://open.bigmodel.cn/api/paas/v4",
      apiKey: env.GLM_API_KEY,
      model: env.GLM_MODEL?.trim() || "glm-4-flash",
      timeoutMs: Number(env.AI_TIMEOUT_MS) > 0 ? Number(env.AI_TIMEOUT_MS) : 20000,
    });
  }
  if (explicit === "glm") return null; // glm requested but no key
  // No key and no explicit choice: allow the mock in non-production so `next
  // dev` and e2e work out of the box; production stays honest (503).
  if (env.NODE_ENV !== "production" && !explicit) return createMockProvider();
  return null;
}

// Route-facing helper (reads live process.env at call time so tests can stub).
export function getProvider(): GuiGenerationProvider | null {
  return getProviderFromEnv(process.env);
}
