// GET /api/checkout/verify?order_ref=rgm_w1_... (Waffo Pancake)
// or ?session_id=cs_... (legacy Stripe restore links) — statelessly verifies
// a paid one-time order and issues a signed HMAC Pro Pass cookie + token.

import {
  buildProPassCookie,
  PRICING_PLANS,
  resolveProPassSecret,
  signProPassToken,
  type ProPlanId,
} from "../../../lib/pro-access";
import {
  lookupWaffoOrderByRef,
  parseWaffoAmountCents,
  parseWaffoOrderRef,
  resolveWaffoConfig,
  resolveWaffoProductForPlan,
  WaffoConfigError,
  WaffoUpstreamError,
} from "../../../lib/waffo";

const STRIPE_SESSION_ID_PATTERN = /^cs_(test_|live_)?[A-Za-z0-9]{10,120}$/;

function jsonResponse(
  body: unknown,
  status = 200,
  extraHeaders?: Record<string, string>
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
  });
}

async function issueProPassResponse(params: {
  requestUrl: URL;
  plan: ProPlanId;
  kitSlug?: string;
  sessionId: string;
}): Promise<Response> {
  let signingSecret: string;
  try {
    signingSecret = resolveProPassSecret(process.env);
  } catch (error) {
    return jsonResponse(
      {
        error: "pro_not_configured",
        message:
          error instanceof Error
            ? error.message
            : "Pro Pass signing secret is not configured on this server.",
      },
      503
    );
  }

  const token = await signProPassToken(
    {
      version: 1,
      plan: params.plan,
      ...(params.kitSlug ? { kitSlug: params.kitSlug } : {}),
      sessionId: params.sessionId,
      issuedAt: Date.now(),
    },
    signingSecret
  );

  const isHttps = params.requestUrl.protocol === "https:";
  return jsonResponse(
    {
      unlocked: true,
      plan: params.plan,
      ...(params.kitSlug ? { kitSlug: params.kitSlug } : {}),
      token,
    },
    200,
    { "Set-Cookie": buildProPassCookie(token, isHttps) }
  );
}

async function verifyWaffoOrder(
  requestUrl: URL,
  orderRef: string
): Promise<Response> {
  const parsedRef = parseWaffoOrderRef(orderRef);
  if (!parsedRef) {
    return jsonResponse(
      {
        error: "invalid_order_ref",
        message: `Invalid Waffo order_ref "${orderRef}".`,
      },
      400
    );
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
            : "Waffo verification is not configured on this server.",
      },
      503
    );
  }

  let order;
  try {
    order = await lookupWaffoOrderByRef(waffoConfig, orderRef);
  } catch (error) {
    if (error instanceof WaffoConfigError) {
      return jsonResponse(
        { error: "checkout_not_configured", message: error.message },
        503
      );
    }
    return jsonResponse(
      {
        error: "waffo_lookup_failed",
        message:
          error instanceof WaffoUpstreamError || error instanceof Error
            ? error.message
            : `Could not verify Waffo order "${orderRef}".`,
      },
      502
    );
  }

  if (!order || order.status === "pending" || order.status === "processing") {
    return jsonResponse(
      {
        error: "payment_pending",
        retryable: true,
        message:
          "Your Waffo payment is still being finalized. Wait a few seconds and retry.",
      },
      402
    );
  }

  if (order.status !== "completed") {
    return jsonResponse(
      {
        error: "payment_unpaid",
        retryable: false,
        message: `Order "${orderRef}" has status "${order.status}", expected "completed".`,
      },
      402
    );
  }

  if (Array.isArray(order.payments) && order.payments.length > 0) {
    const succeededPayments = order.payments.filter(
      (payment) => payment.status === "succeeded"
    );
    if (succeededPayments.length === 0) {
      return jsonResponse(
        {
          error: "payment_pending",
          retryable: true,
          message: `Order "${orderRef}" has no succeeded payment yet.`,
        },
        402
      );
    }
    const activeSucceeded = succeededPayments.some(
      (payment) =>
        payment.isFullyRefunded !== true && payment.refundStatus !== "full"
    );
    if (!activeSucceeded) {
      return jsonResponse(
        {
          error: "payment_refunded",
          retryable: false,
          message: `Order "${orderRef}" has been refunded and cannot unlock Pro Pass.`,
        },
        402
      );
    }
  }

  if (String(order.currency ?? "").toUpperCase() !== "USD") {
    return jsonResponse(
      {
        error: "invalid_order_currency",
        retryable: false,
        message: `Order "${orderRef}" currency "${String(order.currency)}" does not match expected USD.`,
      },
      402
    );
  }

  const metadataPlan = order.metadata?.plan;
  if (
    metadataPlan !== undefined &&
    metadataPlan !== null &&
    metadataPlan !== parsedRef.plan
  ) {
    return jsonResponse(
      {
        error: "plan_mismatch",
        retryable: false,
        message: `Order "${orderRef}" plan metadata does not match order reference.`,
      },
      402
    );
  }

  const expectedProduct = resolveWaffoProductForPlan(
    waffoConfig,
    parsedRef.plan
  );
  if (
    order.onetimeProduct?.id &&
    order.onetimeProduct.id !== expectedProduct.productId
  ) {
    return jsonResponse(
      {
        error: "product_mismatch",
        retryable: false,
        message: `Order "${orderRef}" product "${order.onetimeProduct.id}" does not match configured product.`,
      },
      402
    );
  }

  if (expectedProduct.usePriceSnapshot && order.priceSnapshot) {
    const snapshotCents =
      parseWaffoAmountCents(order.priceSnapshot.subtotal) ??
      parseWaffoAmountCents(order.priceSnapshot.total);
    const expectedCents = PRICING_PLANS[parsedRef.plan].priceCents;
    if (snapshotCents !== null && snapshotCents < expectedCents) {
      return jsonResponse(
        {
          error: "amount_mismatch",
          retryable: false,
          message: `Order "${orderRef}" amount (${snapshotCents} cents) is below required plan price (${expectedCents} cents).`,
        },
        402
      );
    }
  }

  return issueProPassResponse({
    requestUrl,
    plan: parsedRef.plan,
    ...(parsedRef.kitSlug ? { kitSlug: parsedRef.kitSlug } : {}),
    sessionId: order.id,
  });
}

async function verifyLegacyStripeSession(
  requestUrl: URL,
  sessionId: string
): Promise<Response> {
  if (!STRIPE_SESSION_ID_PATTERN.test(sessionId)) {
    return jsonResponse(
      {
        error: "invalid_session_id",
        message: `Invalid legacy Stripe session_id "${sessionId}".`,
      },
      400
    );
  }

  const stripeSecretKey = (process.env.STRIPE_SECRET_KEY ?? "").trim();
  if (!stripeSecretKey) {
    return jsonResponse(
      {
        error: "checkout_not_configured",
        message:
          "Legacy Stripe session restore is unavailable on this server (missing STRIPE_SECRET_KEY).",
      },
      503
    );
  }

  const stripeResponse = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
    {
      headers: { Authorization: `Bearer ${stripeSecretKey}` },
      signal: AbortSignal.timeout(10_000),
    }
  );

  const stripeSession = (await stripeResponse.json().catch(() => null)) as {
    id?: string;
    payment_status?: string;
    metadata?: { plan?: string; kitSlug?: string };
    error?: { message?: string };
  } | null;

  if (!stripeResponse.ok || !stripeSession?.id) {
    return jsonResponse(
      {
        error: "stripe_lookup_failed",
        message:
          stripeSession?.error?.message ??
          `Could not verify Stripe session "${sessionId}".`,
      },
      502
    );
  }

  if (stripeSession.payment_status !== "paid") {
    return jsonResponse(
      {
        error: "payment_unpaid",
        retryable: false,
        message: `Session "${sessionId}" has payment_status "${String(stripeSession.payment_status)}", expected "paid".`,
      },
      402
    );
  }

  const rawPlan = stripeSession.metadata?.plan;
  const plan: ProPlanId =
    rawPlan === "starter_rbxmx" ? "starter_rbxmx" : "pro_all_access";
  const kitSlug = stripeSession.metadata?.kitSlug?.trim() || undefined;

  return issueProPassResponse({
    requestUrl,
    plan,
    ...(kitSlug ? { kitSlug } : {}),
    sessionId: stripeSession.id,
  });
}

export async function GET(request: Request): Promise<Response> {
  const requestUrl = new URL(request.url);
  const orderRef = (requestUrl.searchParams.get("order_ref") ?? "").trim();
  if (orderRef) {
    return verifyWaffoOrder(requestUrl, orderRef);
  }

  const sessionId = (requestUrl.searchParams.get("session_id") ?? "").trim();
  if (sessionId) {
    return verifyLegacyStripeSession(requestUrl, sessionId);
  }

  return jsonResponse(
    {
      error: "missing_order_ref",
      message: 'Query parameter "order_ref" is required.',
    },
    400
  );
}
