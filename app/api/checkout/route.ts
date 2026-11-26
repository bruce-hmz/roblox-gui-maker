// POST /api/checkout — creates a one-time Waffo Pancake Checkout Session via Web fetch.
// Zero Node-only SDK dependencies so it runs natively on Cloudflare Workers.

import { getKit } from "../../editor/kits";
import { type ProPlanId } from "../../lib/pro-access";
import {
  createWaffoCheckoutSession,
  createWaffoOrderRef,
  resolveWaffoConfig,
  WaffoConfigError,
  WaffoUpstreamError,
} from "../../lib/waffo";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

function sanitizeReturnPath(rawPath: unknown): string {
  if (typeof rawPath !== "string") return "/pricing";
  const trimmed = rawPath.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return "/pricing";
  return trimmed.slice(0, 200);
}

export async function POST(request: Request): Promise<Response> {
  let requestBody: {
    plan?: unknown;
    kitSlug?: unknown;
    returnPath?: unknown;
    locale?: unknown;
  };
  try {
    requestBody = (await request.json()) as typeof requestBody;
  } catch {
    return jsonResponse(
      { error: "invalid_json", message: "Expected a valid JSON request body." },
      400
    );
  }

  const planId = requestBody.plan;
  if (planId !== "starter_rbxmx" && planId !== "pro_all_access") {
    return jsonResponse(
      {
        error: "invalid_plan",
        message: `Unsupported plan "${String(planId)}". Expected "starter_rbxmx" or "pro_all_access".`,
      },
      400
    );
  }

  let validatedKitSlug: string | undefined;
  if (
    requestBody.kitSlug !== undefined &&
    requestBody.kitSlug !== null &&
    requestBody.kitSlug !== ""
  ) {
    if (typeof requestBody.kitSlug !== "string" || !getKit(requestBody.kitSlug)) {
      return jsonResponse(
        {
          error: "invalid_kit",
          message: `Unknown UI Kit slug "${String(requestBody.kitSlug)}".`,
        },
        422
      );
    }
    validatedKitSlug = requestBody.kitSlug;
  }

  let waffoConfig;
  try {
    waffoConfig = resolveWaffoConfig(process.env);
  } catch (error) {
    return jsonResponse(
      {
        error: "checkout_not_configured",
        message:
          error instanceof Error
            ? error.message
            : "Waffo checkout is not configured on this server yet.",
      },
      503
    );
  }

  const safeReturnPath = sanitizeReturnPath(requestBody.returnPath);
  const requestOrigin = new URL(request.url).origin;
  const locale = requestBody.locale === "zh" ? "zh" : "en";
  const orderRef = createWaffoOrderRef(
    planId as ProPlanId,
    planId === "starter_rbxmx" ? validatedKitSlug : undefined
  );

  try {
    const session = await createWaffoCheckoutSession(waffoConfig, {
      plan: planId as ProPlanId,
      ...(validatedKitSlug ? { kitSlug: validatedKitSlug } : {}),
      orderRef,
      requestOrigin,
      returnPath: safeReturnPath,
      locale,
    });
    return jsonResponse({
      checkoutUrl: session.checkoutUrl,
      orderRef,
    });
  } catch (error) {
    if (error instanceof WaffoConfigError) {
      return jsonResponse(
        { error: "checkout_not_configured", message: error.message },
        503
      );
    }
    if (error instanceof WaffoUpstreamError) {
      return jsonResponse(
        { error: "waffo_upstream_error", message: error.message },
        502
      );
    }
    return jsonResponse(
      {
        error: "waffo_upstream_error",
        message:
          error instanceof Error && error.message
            ? error.message
            : "Could not reach Waffo checkout API.",
      },
      502
    );
  }
}
