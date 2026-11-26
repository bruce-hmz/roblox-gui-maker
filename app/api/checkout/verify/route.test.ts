import { generateKeyPairSync } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { verifyProPassToken } from "../../../lib/pro-access";
import { GET } from "./route";

const ENV_KEYS = [
  "PRO_PASS_SECRET",
  "STRIPE_SECRET_KEY",
  "WAFFO_MERCHANT_ID",
  "WAFFO_PRIVATE_KEY",
  "WAFFO_STORE_ID",
  "WAFFO_PRODUCT_ID",
  "WAFFO_PRODUCT_ID_STARTER",
  "WAFFO_PRODUCT_ID_ALL_ACCESS",
  "WAFFO_ENVIRONMENT",
] as const;

const ORIGINAL_ENV: Record<string, string | undefined> = Object.fromEntries(
  ENV_KEYS.map((key) => [key, process.env[key]])
);
const ORIGINAL_FETCH = globalThis.fetch;

const TEST_RSA = generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: { type: "spki", format: "pem" },
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
});

const PRO_SECRET = "pro_pass_test_secret_at_least_32_chars";

function setupEnv(
  overrides: Partial<Record<(typeof ENV_KEYS)[number], string>> = {}
) {
  for (const key of ENV_KEYS) {
    delete process.env[key];
  }
  process.env.PRO_PASS_SECRET = PRO_SECRET;
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
  for (const key of ENV_KEYS) {
    if (ORIGINAL_ENV[key] === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = ORIGINAL_ENV[key];
    }
  }
  globalThis.fetch = ORIGINAL_FETCH;
  vi.restoreAllMocks();
});

describe("GET /api/checkout/verify", () => {
  it("rejects missing or invalid order_ref", async () => {
    setupEnv();
    const missing = await GET(
      new Request("https://robloxguimaker.app/api/checkout/verify")
    );
    expect(missing.status).toBe(400);

    const malformed = await GET(
      new Request(
        "https://robloxguimaker.app/api/checkout/verify?order_ref=not-valid"
      )
    );
    expect(malformed.status).toBe(400);
  });

  it("verifies a completed Waffo order via GraphQL and issues a signed HMAC Pro Pass cookie", async () => {
    setupEnv();
    const orderRef = "rgm_w1_s_simulator-kit_0123456789abcdef01234567";

    globalThis.fetch = vi.fn(async (input, init) => {
      expect(String(input)).toBe("https://api.waffo.ai/v1/graphql");
      const reqBody = JSON.parse(String(init?.body)) as {
        variables: { storeId: string; ref: string };
      };
      expect(reqBody.variables).toEqual({
        storeId: "STO_1234567890abcdefghijkl",
        ref: orderRef,
      });
      return new Response(
        JSON.stringify({
          data: {
            onetimeOrders: [
              {
                id: "ORD_abcdef1234567890abcdef",
                status: "completed",
                currency: "USD",
                testMode: false,
                orderMerchantExternalId: orderRef,
                metadata: { plan: "starter_rbxmx", kitSlug: "simulator-kit" },
                priceSnapshot: {
                  currency: "USD",
                  subtotal: "9.90",
                  total: "9.90",
                },
                onetimeProduct: { id: "PROD_1234567890abcdefghijkl" },
                payments: [
                  {
                    id: "PAY_123",
                    status: "succeeded",
                    isFullyRefunded: false,
                    refundStatus: "none",
                  },
                ],
              },
            ],
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }) as typeof fetch;

    const response = await GET(
      new Request(
        `https://robloxguimaker.app/api/checkout/verify?order_ref=${orderRef}`
      )
    );
    expect(response.status).toBe(200);
    const body = (await response.json()) as {
      unlocked: boolean;
      plan: string;
      kitSlug?: string;
      token: string;
    };
    expect(body.unlocked).toBe(true);
    expect(body.plan).toBe("starter_rbxmx");
    expect(body.kitSlug).toBe("simulator-kit");
    expect(response.headers.get("set-cookie")).toContain("rgm_pro_token=");

    const claims = await verifyProPassToken(body.token, PRO_SECRET);
    expect(claims?.plan).toBe("starter_rbxmx");
    expect(claims?.kitSlug).toBe("simulator-kit");
    expect(claims?.sessionId).toBe("ORD_abcdef1234567890abcdef");
  });

  it("returns retryable 402 when Waffo order is pending or not indexed yet", async () => {
    setupEnv();
    const orderRef = "rgm_w1_a_0123456789abcdef01234567";
    globalThis.fetch = vi.fn(
      async () =>
        new Response(JSON.stringify({ data: { onetimeOrders: [] } }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
    ) as typeof fetch;

    const response = await GET(
      new Request(
        `https://robloxguimaker.app/api/checkout/verify?order_ref=${orderRef}`
      )
    );
    expect(response.status).toBe(402);
    const body = (await response.json()) as {
      error: string;
      retryable: boolean;
    };
    expect(body.error).toBe("payment_pending");
    expect(body.retryable).toBe(true);
  });

  it("rejects test-mode orders in prod environment, refunded orders, and underpaid snapshots", async () => {
    setupEnv({ WAFFO_ENVIRONMENT: "prod" });
    const orderRef = "rgm_w1_a_0123456789abcdef01234567";

    // Test-mode order in prod should not match.
    globalThis.fetch = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            data: {
              onetimeOrders: [
                {
                  id: "ORD_testonly",
                  status: "completed",
                  currency: "USD",
                  testMode: true,
                  orderMerchantExternalId: orderRef,
                  priceSnapshot: { currency: "USD", subtotal: "19.90", total: "19.90" },
                  onetimeProduct: { id: "PROD_1234567890abcdefghijkl" },
                },
              ],
            },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        )
    ) as typeof fetch;

    const testModeResp = await GET(
      new Request(
        `https://robloxguimaker.app/api/checkout/verify?order_ref=${orderRef}`
      )
    );
    expect(testModeResp.status).toBe(402);

    // Fully refunded order must be rejected.
    globalThis.fetch = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            data: {
              onetimeOrders: [
                {
                  id: "ORD_refunded",
                  status: "completed",
                  currency: "USD",
                  testMode: false,
                  orderMerchantExternalId: orderRef,
                  priceSnapshot: { currency: "USD", subtotal: "19.90", total: "19.90" },
                  onetimeProduct: { id: "PROD_1234567890abcdefghijkl" },
                  payments: [
                    {
                      id: "PAY_ref",
                      status: "succeeded",
                      isFullyRefunded: true,
                      refundStatus: "full",
                    },
                  ],
                },
              ],
            },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        )
    ) as typeof fetch;

    const refundedResp = await GET(
      new Request(
        `https://robloxguimaker.app/api/checkout/verify?order_ref=${orderRef}`
      )
    );
    expect(refundedResp.status).toBe(402);
    expect(((await refundedResp.json()) as { error: string }).error).toBe(
      "payment_refunded"
    );

    // Underpaid snapshot for All-Access must be rejected.
    globalThis.fetch = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            data: {
              onetimeOrders: [
                {
                  id: "ORD_cheap",
                  status: "completed",
                  currency: "USD",
                  testMode: false,
                  orderMerchantExternalId: orderRef,
                  priceSnapshot: { currency: "USD", subtotal: "9.90", total: "9.90" },
                  onetimeProduct: { id: "PROD_1234567890abcdefghijkl" },
                  payments: [
                    {
                      id: "PAY_ok",
                      status: "succeeded",
                      isFullyRefunded: false,
                      refundStatus: "none",
                    },
                  ],
                },
              ],
            },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        )
    ) as typeof fetch;

    const underpaidResp = await GET(
      new Request(
        `https://robloxguimaker.app/api/checkout/verify?order_ref=${orderRef}`
      )
    );
    expect(underpaidResp.status).toBe(402);
    expect(((await underpaidResp.json()) as { error: string }).error).toBe(
      "amount_mismatch"
    );
  });

  it("keeps legacy Stripe session_id restore working when STRIPE_SECRET_KEY is configured", async () => {
    setupEnv({ STRIPE_SECRET_KEY: "stripe_legacy_fixture_key_for_unit_test" });

    globalThis.fetch = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            id: "cs_live_1234567890abcdef",
            payment_status: "paid",
            metadata: { plan: "pro_all_access" },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        )
    ) as typeof fetch;

    const response = await GET(
      new Request(
        "https://robloxguimaker.app/api/checkout/verify?session_id=cs_live_1234567890abcdef"
      )
    );
    expect(response.status).toBe(200);
    const body = (await response.json()) as { unlocked: boolean; plan: string };
    expect(body.unlocked).toBe(true);
    expect(body.plan).toBe("pro_all_access");
  });
});
