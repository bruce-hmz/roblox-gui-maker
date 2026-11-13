// Outer wrapper around the OpenNext-generated worker (.open-next/worker.js).
// Handles the canonical www → apex 308 before any Next logic runs: the
// OpenNext runtime rewrites redirect URLs from proxy/next.config to the
// request's own host, which would loop www back to itself.
import worker from "./.open-next/worker.js";

const APEX = "robloxguimaker.app";

export default {
  async fetch(request, env, ctx) {
    const host = (
      request.headers.get("x-forwarded-host") ??
      request.headers.get("host") ??
      ""
    ).replace(/:\d+$/, "");
    if (host === `www.${APEX}`) {
      const url = new URL(request.url);
      return new Response(null, {
        status: 308,
        headers: { Location: `https://${APEX}${url.pathname}${url.search}` },
      });
    }
    return worker.fetch(request, env, ctx);
  },
};
