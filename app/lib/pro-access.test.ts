import { describe, expect, it } from "vitest";
import {
  buildProPassCookie,
  canAccessKitBundle,
  readProTokenFromRequest,
  resolveProPassSecret,
  signProPassToken,
  verifyProPassToken,
  type ProPassClaims,
} from "./pro-access";

const TEST_SECRET = "sk_test_0123456789abcdef0123456789abcdef";

describe("pro-access HMAC token lifecycle", () => {
  it("signs and verifies round-trip claims", async () => {
    const claims: ProPassClaims = {
      version: 1,
      plan: "pro_all_access",
      sessionId: "cs_test_a1b2c3d4e5f6",
      issuedAt: 1762900000000,
    };
    const token = await signProPassToken(claims, TEST_SECRET);
    const verified = await verifyProPassToken(token, TEST_SECRET);
    expect(verified).toEqual(claims);
  });

  it("rejects tampered payloads and wrong secrets", async () => {
    const claims: ProPassClaims = {
      version: 1,
      plan: "starter_rbxmx",
      kitSlug: "simulator-kit",
      sessionId: "cs_test_singlekit12345",
      issuedAt: 1762900000000,
    };
    const token = await signProPassToken(claims, TEST_SECRET);
    const segments = token.split(".");
    const forgedPayload = Buffer.from(
      JSON.stringify({ ...claims, plan: "pro_all_access" })
    ).toString("base64url");
    const forgedToken = `${segments[0]}.${forgedPayload}.${segments[2]}`;

    expect(await verifyProPassToken(forgedToken, TEST_SECRET)).toBeNull();
    expect(
      await verifyProPassToken(token, "sk_test_different_secret_value_9999")
    ).toBeNull();
  });

  it("fails fast when signing secret is missing or too short", () => {
    expect(() => resolveProPassSecret({})).toThrow(/PRO_PASS_SECRET/);
    expect(() => resolveProPassSecret({ PRO_PASS_SECRET: "short" })).toThrow(
      /at least 16/
    );
    expect(() =>
      resolveProPassSecret({ PRO_PASS_SECRET: "   ", STRIPE_SECRET_KEY: "short" })
    ).toThrow(/at least 16/);
  });

  it("falls back to STRIPE_SECRET_KEY when PRO_PASS_SECRET is empty or whitespace", () => {
    expect(
      resolveProPassSecret({ PRO_PASS_SECRET: "", STRIPE_SECRET_KEY: TEST_SECRET })
    ).toBe(TEST_SECRET);
    expect(
      resolveProPassSecret({ PRO_PASS_SECRET: "   ", STRIPE_SECRET_KEY: TEST_SECRET })
    ).toBe(TEST_SECRET);
  });

  it("reads token from header or cookie and enforces kit authorization", async () => {
    const claims: ProPassClaims = {
      version: 1,
      plan: "starter_rbxmx",
      kitSlug: "tycoon-kit",
      sessionId: "cs_test_tycoon987654",
      issuedAt: 1762900000000,
    };
    const token = await signProPassToken(claims, TEST_SECRET);
    const cookieString = buildProPassCookie(token, true);
    expect(cookieString).toContain("HttpOnly");
    expect(cookieString).toContain("Secure");

    const cookieRequest = new Request("https://robloxguimaker.app/api/pro/kit-bundle", {
      headers: { cookie: `other=1; rgm_pro_token=${encodeURIComponent(token)}` },
    });
    expect(readProTokenFromRequest(cookieRequest)).toBe(token);

    expect(canAccessKitBundle(claims, "tycoon-kit")).toBe(true);
    expect(canAccessKitBundle(claims, "simulator-kit")).toBe(false);
    expect(canAccessKitBundle(claims, "all-icons")).toBe(false);

    const allAccessClaims: ProPassClaims = {
      ...claims,
      plan: "pro_all_access",
    };
    expect(canAccessKitBundle(allAccessClaims, "simulator-kit")).toBe(true);
    expect(canAccessKitBundle(allAccessClaims, "all-icons")).toBe(true);
  });
});
