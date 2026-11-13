import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const ORIGINAL_STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
const ORIGINAL_FETCH = globalThis.fetch;

afterEach(() => {
  if (ORIGINAL_STRIPE_KEY === undefined) {
    delete process.env.STRIPE_SECRET_KEY;
  } else {
    process.env.STRIPE_SECRET_KEY = ORIGINAL_STRIPE_KEY;
  }
  globalThis.fetch = ORIGINAL_FETCH;
  vi.restoreAllMocks();
});

describe("POST /api/checkout", () => {
  it("fails fast with 503 when STRIPE_SECRET_KEY is missing", async () => {
    delete process.env.STRIPE_SECRET_KEY;
    const response = await POST(
      new Request("https://robloxguimaker.app/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "pro_all_access" }),
      })
    );
    expect(response.status).toBe(503);
    const body = (await response.json()) as { error: string; message: string };
    expect(body.error).toBe("checkout_not_configured");
    expect(body.message).toContain("STRIPE_SECRET_KEY");
  });

  it("rejects invalid plan ids and unknown kit slugs", async () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_0123456789abcdef0123456789abcdef";
    const badPlanResponse = await POST(
      new Request("https://robloxguimaker.app/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "monthly_subscription" }),
      })
    );
    expect(badPlanResponse.status).toBe(400);

    const badKitResponse = await POST(
      new Request("https://robloxguimaker.app/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: "starter_rbxmx",
          kitSlug: "nonexistent-kit",
        }),
      })
    );
    expect(badKitResponse.status).toBe(422);
  });

  it("creates a one-time Stripe checkout session with exact cent pricing", async () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_0123456789abcdef0123456789abcdef";
    let capturedForm = "";
    globalThis.fetch = vi.fn(async (_input, init) => {
      capturedForm = String(init?.body ?? "");
      return new Response(
        JSON.stringify({
          id: "cs_test_1234567890abcdef",
          url: "https://checkout.stripe.com/c/pay/cs_test_1234567890abcdef",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }) as typeof fetch;

    const response = await POST(
      new Request("https://robloxguimaker.app/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: "pro_all_access",
          returnPath: "/kits/simulator-kit",
        }),
      })
    );
    expect(response.status).toBe(200);
    const body = (await response.json()) as { checkoutUrl: string };
    expect(body.checkoutUrl).toContain("checkout.stripe.com");

    const parsedParams = new URLSearchParams(capturedForm);
    expect(parsedParams.get("mode")).toBe("payment");
    expect(parsedParams.get("line_items[0][price_data][unit_amount]")).toBe(
      "1990"
    );
    expect(parsedParams.get("metadata[plan]")).toBe("pro_all_access");
  });
});
