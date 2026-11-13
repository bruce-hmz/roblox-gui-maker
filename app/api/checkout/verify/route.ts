// GET /api/checkout/verify?session_id=cs_... — statelessly verifies a paid
// Stripe Checkout Session and issues a signed HMAC Pro Pass cookie + token.

import {
  buildProPassCookie,
  resolveProPassSecret,
  signProPassToken,
  type ProPlanId,
} from "../../../lib/pro-access";

const SESSION_ID_PATTERN = /^cs_(test_|live_)?[A-Za-z0-9]{10,120}$/;

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

export async function GET(request: Request): Promise<Response> {
  const requestUrl = new URL(request.url);
  const sessionId = (requestUrl.searchParams.get("session_id") ?? "").trim();
  if (!SESSION_ID_PATTERN.test(sessionId)) {
    return jsonResponse(
      {
        error: "invalid_session_id",
        message: `Invalid Stripe session_id "${sessionId}".`,
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
          "Stripe verification is not configured on this server (missing STRIPE_SECRET_KEY).",
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
        message: `Session "${sessionId}" has payment_status "${String(stripeSession.payment_status)}", expected "paid".`,
      },
      402
    );
  }

  const rawPlan = stripeSession.metadata?.plan;
  const plan: ProPlanId =
    rawPlan === "starter_rbxmx" ? "starter_rbxmx" : "pro_all_access";
  const kitSlug = stripeSession.metadata?.kitSlug?.trim() || undefined;

  const signingSecret = resolveProPassSecret(process.env);
  const token = await signProPassToken(
    {
      version: 1,
      plan,
      ...(kitSlug ? { kitSlug } : {}),
      sessionId: stripeSession.id,
      issuedAt: Date.now(),
    },
    signingSecret
  );

  const isHttps = requestUrl.protocol === "https:";
  return jsonResponse(
    {
      unlocked: true,
      plan,
      ...(kitSlug ? { kitSlug } : {}),
      token,
    },
    200,
    { "Set-Cookie": buildProPassCookie(token, isHttps) }
  );
}
