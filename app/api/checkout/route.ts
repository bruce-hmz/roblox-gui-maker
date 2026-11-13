// POST /api/checkout — creates a one-time Stripe Checkout Session via Web fetch.
// Zero Node-only SDK dependencies so it runs natively on Cloudflare Workers.

import { getKit } from "../../editor/kits";
import { PRICING_PLANS, type ProPlanId } from "../../lib/pro-access";

const STRIPE_SESSIONS_ENDPOINT = "https://api.stripe.com/v1/checkout/sessions";

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
  if (requestBody.kitSlug !== undefined && requestBody.kitSlug !== null && requestBody.kitSlug !== "") {
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

  const stripeSecretKey = (process.env.STRIPE_SECRET_KEY ?? "").trim();
  if (!stripeSecretKey) {
    return jsonResponse(
      {
        error: "checkout_not_configured",
        message:
          "Stripe checkout is not configured on this server yet (missing STRIPE_SECRET_KEY).",
      },
      503
    );
  }

  const planSpec = PRICING_PLANS[planId as ProPlanId];
  const safeReturnPath = sanitizeReturnPath(requestBody.returnPath);
  const requestOrigin = new URL(request.url).origin;

  const formParams = new URLSearchParams();
  formParams.set("mode", "payment");
  formParams.set("payment_method_types[0]", "card");
  formParams.set("line_items[0][quantity]", "1");
  formParams.set("line_items[0][price_data][currency]", "usd");
  formParams.set(
    "line_items[0][price_data][unit_amount]",
    String(planSpec.priceCents)
  );
  formParams.set(
    "line_items[0][price_data][product_data][name]",
    validatedKitSlug && planId === "starter_rbxmx"
      ? `${planSpec.productName} (${validatedKitSlug})`
      : planSpec.productName
  );
  formParams.set(
    "line_items[0][price_data][product_data][description]",
    planSpec.productDescription
  );
  formParams.set("metadata[plan]", planId);
  if (validatedKitSlug) {
    formParams.set("metadata[kitSlug]", validatedKitSlug);
  }
  formParams.set(
    "success_url",
    `${requestOrigin}/pro/success?session_id={CHECKOUT_SESSION_ID}&next=${encodeURIComponent(safeReturnPath)}`
  );
  formParams.set("cancel_url", `${requestOrigin}${safeReturnPath}`);

  const stripeResponse = await fetch(STRIPE_SESSIONS_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeSecretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formParams.toString(),
    signal: AbortSignal.timeout(10_000),
  });

  const stripeSession = (await stripeResponse.json().catch(() => null)) as {
    url?: string;
    error?: { message?: string };
  } | null;

  if (!stripeResponse.ok || !stripeSession?.url) {
    return jsonResponse(
      {
        error: "stripe_upstream_error",
        message:
          stripeSession?.error?.message ??
          `Stripe session creation failed with status ${stripeResponse.status}.`,
      },
      502
    );
  }

  return jsonResponse({ checkoutUrl: stripeSession.url });
}
