import { afterEach, describe, expect, it, vi } from "vitest";
import { isCrawlerPageRequest, reportCrawlerHit } from "./pvuv-crawler";

afterEach(() => {
  vi.restoreAllMocks();
});

const SITE_ID = "site_test_123";
const SECRET_TOKEN = "ingest_secret_value_do_not_log";

function makeContext() {
  const pending: Promise<unknown>[] = [];
  return {
    ctx: {
      waitUntil(promise: Promise<unknown>) {
        pending.push(promise);
      },
    },
    pending,
  };
}

describe("isCrawlerPageRequest", () => {
  it.each([
    "Mozilla/5.0 (compatible; ChatGPT-User/1.0; +https://openai.com/bot)",
    "Mozilla/5.0 AppleWebKit/537.36 (compatible; OAI-SearchBot/1.0)",
    "Mozilla/5.0 AppleWebKit/537.36 (compatible; GPTBot/1.0)",
    "Mozilla/5.0 (compatible; Perplexity-User/1.0)",
    "Mozilla/5.0 AppleWebKit/537.36 (compatible; PerplexityBot/1.0)",
    "Claude-User/1.0",
    "Claude-SearchBot/1.0",
    "ClaudeBot/1.0; +claudebot@anthropic.com",
    "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X) Applebot/0.1",
    "DuckDuckBot/1.1",
    "DuckAssistBot/1.0",
    "Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)",
    "meta-externalagent/1.1",
    "Mozilla/5.0 (Linux; Android 5.0) Bytespider",
  ])("matches crawler UA: %s", (ua) => {
    const req = new Request("https://robloxguimaker.app/editor", {
      method: "GET",
      headers: { "user-agent": ua },
    });
    expect(isCrawlerPageRequest(req)).toBe(true);
  });

  it("ignores normal browsers and non-GET/HEAD methods", () => {
    const browserReq = new Request("https://robloxguimaker.app/", {
      method: "GET",
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/128.0.0.0 Safari/537.36",
      },
    });
    expect(isCrawlerPageRequest(browserReq)).toBe(false);

    const postReq = new Request("https://robloxguimaker.app/", {
      method: "POST",
      headers: { "user-agent": "GPTBot/1.0" },
    });
    expect(isCrawlerPageRequest(postReq)).toBe(false);

    const headReq = new Request("https://robloxguimaker.app/templates", {
      method: "HEAD",
      headers: { "user-agent": "Googlebot/2.1" },
    });
    expect(isCrawlerPageRequest(headReq)).toBe(true);
  });

  it("accepts extensionless, html, xml, txt, md paths and excludes api/internal/assets", () => {
    const crawlerHeaders = { "user-agent": "ClaudeBot/1.0" };
    for (const url of [
      "https://robloxguimaker.app/",
      "https://robloxguimaker.app/templates",
      "https://robloxguimaker.app/index.html",
      "https://robloxguimaker.app/sitemap.xml",
      "https://robloxguimaker.app/robots.txt",
      "https://robloxguimaker.app/llms.md",
    ]) {
      expect(
        isCrawlerPageRequest(new Request(url, { headers: crawlerHeaders }))
      ).toBe(true);
    }

    for (const url of [
      "https://robloxguimaker.app/api",
      "https://robloxguimaker.app/api/generate-gui",
      "https://robloxguimaker.app/_next/static/chunk.js",
      "https://robloxguimaker.app/logo.png",
      "https://robloxguimaker.app/studio-plugin/RobloxGuiMakerSync.lua",
    ]) {
      expect(
        isCrawlerPageRequest(new Request(url, { headers: crawlerHeaders }))
      ).toBe(false);
    }
  });
});

describe("reportCrawlerHit", () => {
  it("strips query and hash, uses cf-connecting-ip over x-forwarded-for, and preserves status", async () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({ accepted: 1, verified: 0, unverified: 1 }),
        { status: 200 }
      )
    );
    const { ctx, pending } = makeContext();
    const req = new Request(
      "https://robloxguimaker.app/missing-page?token=secret&utm=1#frag",
      {
        method: "GET",
        headers: {
          "user-agent": "ChatGPT-User/1.0",
          "cf-connecting-ip": "203.0.113.42",
          "x-forwarded-for": "198.51.100.99",
        },
      }
    );
    const res = new Response("Not Found", { status: 404 });

    const queued = reportCrawlerHit(
      req,
      res,
      { PVUV_SITE: SITE_ID, PVUV_INGEST_TOKEN: SECRET_TOKEN },
      ctx,
      fetchMock as unknown as typeof fetch
    );

    expect(queued).toBe(true);
    expect(pending).toHaveLength(1);
    await Promise.all(pending);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(`https://api.pvuv.ai/v1/sites/${SITE_ID}/crawler_hits`);
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string>).authorization).toBe(
      `Bearer ${SECRET_TOKEN}`
    );
    const body = JSON.parse(String(init.body));
    expect(body.hits).toHaveLength(1);
    expect(body.hits[0]).toMatchObject({
      ua: "ChatGPT-User/1.0",
      path: "/missing-page",
      ip: "203.0.113.42",
      status: 404,
    });
    expect(typeof body.hits[0].ts).toBe("number");

    expect(infoSpy).toHaveBeenCalledTimes(1);
    const logged = String(infoSpy.mock.calls[0]?.join(" "));
    expect(logged).toContain(SITE_ID);
    expect(logged).not.toContain(SECRET_TOKEN);
    expect(logged).not.toContain("ChatGPT-User");
    expect(logged).not.toContain("/missing-page");
    expect(logged).not.toContain("203.0.113.42");
  });

  it("omits ip when cf-connecting-ip is missing and reports 308 redirects non-blocking", async () => {
    vi.spyOn(console, "info").mockImplementation(() => {});
    let resolveFetch!: (r: Response) => void;
    const deferred = new Promise<Response>((resolve) => {
      resolveFetch = resolve;
    });
    const fetchMock = vi.fn().mockReturnValue(deferred);
    const { ctx, pending } = makeContext();

    const req = new Request("https://www.robloxguimaker.app/pricing?foo=bar", {
      method: "GET",
      headers: {
        "user-agent": "PerplexityBot/1.0",
        "x-forwarded-for": "198.51.100.77",
      },
    });
    const redirectRes = new Response(null, {
      status: 308,
      headers: { Location: "https://robloxguimaker.app/pricing?foo=bar" },
    });

    const queued = reportCrawlerHit(
      req,
      redirectRes,
      { PVUV_SITE: SITE_ID, PVUV_INGEST_TOKEN: SECRET_TOKEN },
      ctx,
      fetchMock as unknown as typeof fetch
    );

    expect(queued).toBe(true);
    expect(pending).toHaveLength(1);

    resolveFetch(
      new Response(JSON.stringify({ accepted: 1, verified: 0, unverified: 1 }), {
        status: 200,
      })
    );
    await Promise.all(pending);

    const body = JSON.parse(
      String((fetchMock.mock.calls[0]?.[1] as RequestInit).body)
    );
    expect(body.hits[0].ip).toBeUndefined();
    expect(body.hits[0].path).toBe("/pricing");
    expect(body.hits[0].status).toBe(308);
  });

  it("skips cleanly when credentials or ctx.waitUntil are missing", () => {
    const fetchMock = vi.fn();
    const { ctx } = makeContext();
    const req = new Request("https://robloxguimaker.app/", {
      headers: { "user-agent": "GPTBot/1.0" },
    });
    const res = new Response("ok", { status: 200 });

    expect(
      reportCrawlerHit(
        req,
        res,
        { PVUV_SITE: "", PVUV_INGEST_TOKEN: SECRET_TOKEN },
        ctx,
        fetchMock as unknown as typeof fetch
      )
    ).toBe(false);
    expect(
      reportCrawlerHit(
        req,
        res,
        { PVUV_SITE: SITE_ID, PVUV_INGEST_TOKEN: "" },
        ctx,
        fetchMock as unknown as typeof fetch
      )
    ).toBe(false);
    expect(
      reportCrawlerHit(
        req,
        res,
        { PVUV_SITE: SITE_ID, PVUV_INGEST_TOKEN: SECRET_TOKEN },
        undefined,
        fetchMock as unknown as typeof fetch
      )
    ).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("swallows network failures cleanly without leaking sensitive fields", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const fetchMock = vi.fn().mockRejectedValue(new Error("network down"));
    const { ctx, pending } = makeContext();

    const req = new Request("https://robloxguimaker.app/secret-check", {
      headers: {
        "user-agent": "Googlebot/2.1",
        "cf-connecting-ip": "203.0.113.88",
      },
    });
    const res = new Response("ok", { status: 200 });

    const queued = reportCrawlerHit(
      req,
      res,
      { PVUV_SITE: SITE_ID, PVUV_INGEST_TOKEN: SECRET_TOKEN },
      ctx,
      fetchMock as unknown as typeof fetch
    );
    expect(queued).toBe(true);
    await expect(Promise.all(pending)).resolves.toBeDefined();

    expect(warnSpy).toHaveBeenCalledTimes(1);
    const logged = String(warnSpy.mock.calls[0]?.join(" "));
    expect(logged).not.toContain(SECRET_TOKEN);
    expect(logged).not.toContain("Googlebot");
    expect(logged).not.toContain("/secret-check");
    expect(logged).not.toContain("203.0.113.88");
  });
});
