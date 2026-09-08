import { describe, expect, it } from "vitest";
import {
  createGlmProvider,
  extractJsonObject,
  getProviderFromEnv,
  ProviderError,
  type GuiGenerationProvider,
} from "./provider";

describe("extractJsonObject", () => {
  it("parses a bare object", () => {
    expect(extractJsonObject('{"a":1}')).toEqual({ a: 1 });
  });

  it("parses objects wrapped in markdown fences and prose", () => {
    expect(extractJsonObject('```json\n{"a":{"b":2}}\n```')).toEqual({
      a: { b: 2 },
    });
    expect(
      extractJsonObject('Here is your spec:\n{"screenType":"hud"} hope that helps')
    ).toEqual({ screenType: "hud" });
  });

  it("throws invalid_json when there is no object", () => {
    expect(() => extractJsonObject("no braces here")).toThrowError(ProviderError);
    expect(() => extractJsonObject("{broken")).toThrowError(ProviderError);
  });
});

describe("getProviderFromEnv selection", () => {
  it("respects explicit AI_PROVIDER choices", () => {
    expect(
      getProviderFromEnv({ AI_PROVIDER: "mock", NODE_ENV: "production" })?.name
    ).toBe("mock");
    expect(getProviderFromEnv({ AI_PROVIDER: "disabled", GLM_API_KEY: "k" })).toBeNull();
    // glm requested without a key → null (honest 503), never silent mock.
    expect(getProviderFromEnv({ AI_PROVIDER: "glm", NODE_ENV: "production" })).toBeNull();
  });

  it("uses GLM when a key exists", () => {
    const provider = getProviderFromEnv({ GLM_API_KEY: "k", NODE_ENV: "production" });
    expect(provider?.name).toBe("glm");
  });

  it("allows the mock in non-production without explicit config", () => {
    expect(getProviderFromEnv({ NODE_ENV: "development" })?.name).toBe("mock");
    expect(getProviderFromEnv({ NODE_ENV: "production" })).toBeNull();
  });
});

// A tiny injected-fetch harness for the GLM transport. Honors AbortSignal
// like the real fetch (abort rejects the pending call).
function glmWithFetch(
  handler: (url: string, init?: RequestInit) => Promise<Response>
): GuiGenerationProvider {
  return createGlmProvider({
    baseUrl: "https://glm.test/api/paas/v4",
    apiKey: "test-key",
    model: "glm-test",
    timeoutMs: 50,
    fetchImpl: (async (url: string | URL, init?: RequestInit) => {
      const signal = init?.signal;
      if (!signal) return handler(String(url), init);
      return new Promise<Response>((resolve, reject) => {
        const settle = handler(String(url), init);
        settle.then(resolve, reject);
        signal.addEventListener("abort", () => {
          const error = new Error("The operation was aborted");
          error.name = "AbortError";
          reject(error);
        });
      });
    }) as typeof fetch,
  });
}

describe("glm provider transport", () => {
  const okBody = JSON.stringify({
    choices: [{ message: { content: '{"screenType":"hud","blocks":[]}' } }],
  });

  it("posts an authorized JSON-mode request and parses the content", async () => {
    let seen: { url?: string; init?: RequestInit } = {};
    const provider = glmWithFetch(async (url, init) => {
      seen = { url, init };
      return new Response(okBody, { status: 200 });
    });
    const result = await provider.generateSpec({ prompt: "a hud", locale: "en" });
    expect(result.raw).toEqual({ screenType: "hud", blocks: [] });
    expect(seen.url).toContain("/chat/completions");
    const init = seen.init!;
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer test-key");
    const body = JSON.parse(String(init.body));
    expect(body.response_format).toEqual({ type: "json_object" });
    expect(body.messages[0].role).toBe("system");
    expect(body.messages[1].content).toContain("a hud");
  });

  it("retries once without response_format on HTTP 400", async () => {
    let calls = 0;
    const provider = glmWithFetch(async (_url, init) => {
      calls++;
      if (calls === 1) return new Response("bad request", { status: 400 });
      const body = JSON.parse(String(init?.body));
      expect(body.response_format).toBeUndefined();
      return new Response(okBody, { status: 200 });
    });
    const result = await provider.generateSpec({ prompt: "x", locale: "en" });
    expect(calls).toBe(2);
    expect(result.raw).toEqual({ screenType: "hud", blocks: [] });
  });

  it("surfaces http errors", async () => {
    const provider = glmWithFetch(async () => new Response("boom", { status: 500 }));
    await expect(
      provider.generateSpec({ prompt: "x", locale: "en" })
    ).rejects.toThrowError(ProviderError);
  });

  it("times out via AbortController", async () => {
    const provider = glmWithFetch(
      () => new Promise<Response>(() => undefined) // never resolves
    );
    await expect(
      provider.generateSpec({ prompt: "x", locale: "en" })
    ).rejects.toMatchObject({ code: "timeout" });
  });

  it("throws invalid_json when the model returns prose without JSON", async () => {
    const provider = glmWithFetch(
      async () =>
        new Response(
          JSON.stringify({ choices: [{ message: { content: "I cannot do that." } }] }),
          { status: 200 }
        )
    );
    await expect(
      provider.generateSpec({ prompt: "x", locale: "en" })
    ).rejects.toMatchObject({ code: "invalid_json" });
  });

  it("passes repair errors into the retry content", async () => {
    let seenContent = "";
    const provider = glmWithFetch(async (_url, init) => {
      seenContent = JSON.parse(String(init?.body)).messages[1].content;
      return new Response(okBody, { status: 200 });
    });
    await provider.generateSpec({
      prompt: "x",
      locale: "en",
      repairErrors: ["blocks must be an array."],
    });
    expect(seenContent).toContain("blocks must be an array.");
    expect(seenContent).toContain("corrected JSON");
  });
});
