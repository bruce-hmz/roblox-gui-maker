import { createHash, createVerify, generateKeyPairSync } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const WAFFO_ENV_KEYS = [
  "WAFFO_MERCHANT_ID",
  "WAFFO_PRIVATE_KEY",
  "WAFFO_STORE_ID",
  "WAFFO_PRODUCT_ID",
  "WAFFO_PRODUCT_ID_STARTER",
  "WAFFO_PRODUCT_ID_ALL_ACCESS",
  "WAFFO_ENVIRONMENT",
] as const;

const ORIGINAL_ENV: Record<string, string | undefined> = Object.fromEntries(
  WAFFO_ENV_KEYS.map((key) => [key, process.env[key]])
);
const ORIGINAL_FETCH = globalThis.fetch;

const TEST_RSA = generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: { type: "spki", format: "pem" },
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
});

const TEST_RSA_PKCS1 = generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: { type: "spki", format: "pem" },
  privateKeyEncoding: { type: "pkcs1", format: "pem" },
});

function setWaffoEnv(overrides: Partial<Record<(typeof WAFFO_ENV_KEYS)[number], string>> = {}) {
  for (const key of WAFFO_ENV_KEYS) {
    delete process.env[key];
  }
  process.env.WAFFO_MERCHANT_ID = "MER_1234567890abcdefghijkl";
  process.env.WAFFO_PRIVATE_KEY = TEST_RSA.privateKey;
  process.env.WAFFO_STORE_ID = "STO_1234567890abcdefghijkl";
  process.env.WAFFO_PRODUCT_ID = "PROD_1234567890abcdefghijkl";
  process.env.WAFFO_ENVIRONMENT = "prod";
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

afterEach(() => {
  for (const key of WAFFO_ENV_KEYS) {
    if (ORIGINAL_ENV[key] === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = ORIGINAL_ENV[key];
    }
  }
  globalThis.fetch = ORIGINAL_FETCH;
  vi.restoreAllMocks();
});

describe("POST /api/checkout (Waffo Pancake)", () => {
  it("fails fast with 503 when Waffo env vars are missing", async () => {
    for (const key of WAFFO_ENV_KEYS) {
      delete process.env[key];
    }
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
    expect(body.message).toContain("WAFFO_MERCHANT_ID");
    expect(body.message).toContain("WAFFO_PRIVATE_KEY");
    expect(body.message).toContain("WAFFO_STORE_ID");
  });

  it("rejects invalid plan ids and unknown kit slugs", async () => {
    setWaffoEnv();
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

  it("creates a signed Waffo checkout session with dynamic priceSnapshot and verifiable RSA signature", async () => {
    setWaffoEnv();
    let capturedUrl = "";
    let capturedHeaders: Record<string, string> = {};
    let capturedBody = "";

    globalThis.fetch = vi.fn(async (input, init) => {
      capturedUrl = String(input);
      capturedHeaders = Object.fromEntries(
        new Headers(init?.headers).entries()
      );
      capturedBody = String(init?.body ?? "");
      return new Response(
        JSON.stringify({
          data: {
            sessionId: "SESS_abc123",
            checkoutUrl: "https://pancake.waffo.ai/store/rgm/checkout/SESS_abc123",
          },
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
          locale: "zh",
        }),
      })
    );
    expect(response.status).toBe(200);
    const body = (await response.json()) as {
      checkoutUrl: string;
      orderRef: string;
    };
    expect(body.checkoutUrl).toBe(
      "https://pancake.waffo.ai/store/rgm/checkout/SESS_abc123"
    );
    expect(body.orderRef).toMatch(/^rgm_w1_a_[0-9a-f]{24}$/);

    expect(capturedUrl).toBe(
      "https://api.waffo.ai/v1/actions/checkout/create-session"
    );
    expect(capturedHeaders["x-merchant-id"]).toBe("MER_1234567890abcdefghijkl");
    expect(capturedHeaders["x-idempotency-key"]).toBe(body.orderRef);

    // Independently verify RSA-SHA256 request signature using the matching public key.
    const bodyHash = createHash("sha256").update(capturedBody).digest("base64");
    const canonical = `POST\n/v1/actions/checkout/create-session\n${capturedHeaders["x-timestamp"]}\n${bodyHash}`;
    const verifier = createVerify("RSA-SHA256");
    verifier.update(canonical);
    expect(
      verifier.verify(
        TEST_RSA.publicKey,
        capturedHeaders["x-signature"]!,
        "base64"
      )
    ).toBe(true);

    const parsedPayload = JSON.parse(capturedBody) as {
      productId: string;
      currency: string;
      priceSnapshot?: { amount: string; taxCategory: string };
      successUrl?: string;
      language?: string;
      orderMerchantExternalId: string;
      metadata: { plan: string };
    };
    expect(parsedPayload.productId).toBe("PROD_1234567890abcdefghijkl");
    expect(parsedPayload.currency).toBe("USD");
    expect(parsedPayload.priceSnapshot).toEqual({
      amount: "19.90",
      taxCategory: "saas",
    });
    expect(parsedPayload.language).toBe("zh-Hans");
    expect(parsedPayload.orderMerchantExternalId).toBe(body.orderRef);
    expect(parsedPayload.metadata.plan).toBe("pro_all_access");
    expect(parsedPayload.successUrl).toBe(
      `https://robloxguimaker.app/pro/success?order_ref=${encodeURIComponent(
        body.orderRef
      )}&next=%2Fkits%2Fsimulator-kit`
    );
  });

  it("supports PKCS#1 RSA private keys and dedicated per-plan product IDs without priceSnapshot", async () => {
    setWaffoEnv({
      WAFFO_PRIVATE_KEY: TEST_RSA_PKCS1.privateKey,
      WAFFO_PRODUCT_ID: undefined,
      WAFFO_PRODUCT_ID_STARTER: "PROD_starter1234567890abcd",
      WAFFO_PRODUCT_ID_ALL_ACCESS: "PROD_allacc1234567890abcde",
    });
    let capturedHeaders: Record<string, string> = {};
    let capturedBody = "";

    globalThis.fetch = vi.fn(async (_input, init) => {
      capturedHeaders = Object.fromEntries(
        new Headers(init?.headers).entries()
      );
      capturedBody = String(init?.body ?? "");
      return new Response(
        JSON.stringify({
          data: {
            sessionId: "SESS_starter",
            checkoutUrl: "https://pancake.waffo.ai/store/rgm/checkout/SESS_starter",
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }) as typeof fetch;

    const response = await POST(
      new Request("https://robloxguimaker.app/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: "starter_rbxmx",
          kitSlug: "simulator-kit",
        }),
      })
    );
    expect(response.status).toBe(200);
    const body = (await response.json()) as { orderRef: string };
    expect(body.orderRef).toMatch(/^rgm_w1_s_simulator-kit_[0-9a-f]{24}$/);

    const bodyHash = createHash("sha256").update(capturedBody).digest("base64");
    const canonical = `POST\n/v1/actions/checkout/create-session\n${capturedHeaders["x-timestamp"]}\n${bodyHash}`;
    const verifier = createVerify("RSA-SHA256");
    verifier.update(canonical);
    expect(
      verifier.verify(
        TEST_RSA_PKCS1.publicKey,
        capturedHeaders["x-signature"]!,
        "base64"
      )
    ).toBe(true);

    const parsedPayload = JSON.parse(capturedBody) as Record<string, unknown>;
    expect(parsedPayload.productId).toBe("PROD_starter1234567890abcd");
    expect(parsedPayload.priceSnapshot).toBeUndefined();
  });
});
