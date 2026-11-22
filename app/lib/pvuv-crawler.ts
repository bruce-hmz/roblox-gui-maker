export const CRAWLER_UA_PATTERN =
  /chatgpt-user|oai-searchbot|gptbot|perplexity-user|perplexitybot|claude-user|claude-searchbot|claudebot|bingbot|googlebot|applebot|duckduckbot|duckassistbot|yandexbot|meta-externalagent|bytespider/i;

const EXTENSION_PATTERN = /\.[^/.]+$/;
const PAGE_EXTENSION_PATTERN = /\.(?:html?|txt|xml|md)$/i;

export interface PvuvCrawlerEnv {
  PVUV_SITE?: string;
  PVUV_INGEST_TOKEN?: string;
}

export interface ExecutionContextLike {
  waitUntil(promise: Promise<unknown>): void;
}

/**
 * Match automated AI/search crawler GET/HEAD page requests while excluding API,
 * internal framework routes, and binary/static asset extensions.
 */
export function isCrawlerPageRequest(request: Request): boolean {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return false;
  }
  const ua = request.headers.get("user-agent") ?? "";
  if (!CRAWLER_UA_PATTERN.test(ua)) {
    return false;
  }
  const { pathname } = new URL(request.url);
  if (
    pathname === "/api" ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_")
  ) {
    return false;
  }
  return !EXTENSION_PATTERN.test(pathname) || PAGE_EXTENSION_PATTERN.test(pathname);
}

/**
 * Report eligible crawler page hits to PVUV in the background via ctx.waitUntil.
 * Never delays the response or logs sensitive headers, paths, IPs, or tokens.
 */
export function reportCrawlerHit(
  request: Request,
  response: Response,
  env: PvuvCrawlerEnv | undefined,
  ctx: ExecutionContextLike | undefined,
  fetchImpl: typeof fetch = fetch
): boolean {
  const site = env?.PVUV_SITE?.trim();
  const token = env?.PVUV_INGEST_TOKEN?.trim();
  if (!site || !token || typeof ctx?.waitUntil !== "function") {
    return false;
  }
  if (!isCrawlerPageRequest(request)) {
    return false;
  }
  const hit = {
    ua: request.headers.get("user-agent") ?? "",
    path: new URL(request.url).pathname,
    ip: request.headers.get("cf-connecting-ip")?.trim() || undefined,
    status: response.status,
    ts: Date.now(),
  };
  const ingestPromise = Promise.resolve()
    .then(() =>
      fetchImpl(
        `https://api.pvuv.ai/v1/sites/${encodeURIComponent(site)}/crawler_hits`,
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({ hits: [hit] }),
          signal: AbortSignal.timeout(3000),
        }
      )
    )
    .then(async (result) => {
      const ack = (await result.json().catch(() => ({}))) as Record<
        string,
        unknown
      >;
      console.info(
        "pvuv_crawler_sync",
        JSON.stringify({
          site,
          status: result.status,
          accepted: ack.accepted,
          verified: ack.verified,
          unverified: ack.unverified,
        })
      );
    })
    .catch(() => {
      console.warn("pvuv_crawler_sync: request failed");
    });
  ctx.waitUntil(ingestPromise);
  return true;
}
