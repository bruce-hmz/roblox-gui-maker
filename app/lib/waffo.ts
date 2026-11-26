// Web Crypto client for Waffo Pancake (https://api.waffo.ai).
// Zero Node-only dependencies so it runs natively on Cloudflare Workers and Node 20+.

import { getKit } from "../editor/kits";
import { PRICING_PLANS, type ProPlanId } from "./pro-access";

const WAFFO_API_BASE = "https://api.waffo.ai";
const WAFFO_CREATE_SESSION_PATH = "/v1/actions/checkout/create-session";
const WAFFO_GRAPHQL_PATH = "/v1/graphql";
const WAFFO_REQUEST_TIMEOUT_MS = 10_000;

export type WaffoEnvironment = "prod" | "test";

export type WaffoConfig = {
  merchantId: string;
  privateKey: string;
  storeId: string;
  defaultProductId?: string;
  starterProductId?: string;
  allAccessProductId?: string;
  environment: WaffoEnvironment;
};

export type WaffoOnetimeOrder = {
  id: string;
  status: string;
  currency: string;
  testMode: boolean;
  orderMerchantExternalId?: string | null;
  metadata?: Record<string, unknown> | null;
  priceSnapshot?: {
    currency?: string | null;
    subtotal?: number | string | null;
    total?: number | string | null;
  } | null;
  onetimeProduct?: {
    id?: string | null;
  } | null;
  payments?: Array<{
    id?: string | null;
    status?: string | null;
    isFullyRefunded?: boolean | null;
    refundStatus?: string | null;
  }> | null;
};

export type ParsedWaffoOrderRef = {
  plan: ProPlanId;
  kitSlug?: string;
};

export class WaffoConfigError extends Error {
  readonly missingKeys: string[];
  constructor(message: string, missingKeys: string[] = []) {
    super(message);
    this.name = "WaffoConfigError";
    this.missingKeys = missingKeys;
  }
}

export class WaffoUpstreamError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "WaffoUpstreamError";
    this.status = status;
  }
}

const ORDER_REF_ALL_ACCESS_PATTERN = /^rgm_w1_a_([0-9a-f]{24})$/;
const ORDER_REF_STARTER_WITH_KIT_PATTERN = /^rgm_w1_s_([a-z0-9-]+)_([0-9a-f]{24})$/;
const ORDER_REF_STARTER_PLAIN_PATTERN = /^rgm_w1_s_([0-9a-f]{24})$/;

const textEncoder = new TextEncoder();

function encodeBase64(bytes: ArrayBuffer | Uint8Array): string {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (let index = 0; index < view.length; index += 1) {
    binary += String.fromCharCode(view[index]!);
  }
  return btoa(binary);
}

function decodeBase64(base64: string): Uint8Array<ArrayBuffer> {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function encodeDerLength(length: number): number[] {
  if (length < 0x80) return [length];
  const octets: number[] = [];
  let remaining = length;
  while (remaining > 0) {
    octets.unshift(remaining & 0xff);
    remaining >>= 8;
  }
  return [0x80 | octets.length, ...octets];
}

// Accepts PKCS#8 PEM, PKCS#1 ("BEGIN RSA PRIVATE KEY") PEM, escaped "\n", or raw base64.
export function privateKeyPemToPkcs8(rawKey: string): Uint8Array<ArrayBuffer> {
  const normalized = rawKey.replace(/\\n/g, "\n").trim();
  if (!normalized) {
    throw new WaffoConfigError("WAFFO_PRIVATE_KEY is empty.");
  }
  const isPkcs1 = /BEGIN RSA PRIVATE KEY/.test(normalized);
  const strippedBase64 = normalized
    .replace(/-----(BEGIN|END) (RSA )?PRIVATE KEY-----/g, "")
    .replace(/\s+/g, "");
  if (!strippedBase64) {
    throw new WaffoConfigError("WAFFO_PRIVATE_KEY contains no key payload.");
  }
  let derBytes: Uint8Array<ArrayBuffer>;
  try {
    derBytes = decodeBase64(strippedBase64);
  } catch {
    throw new WaffoConfigError("WAFFO_PRIVATE_KEY is not valid PEM or base64.");
  }
  if (!isPkcs1) return derBytes;

  // Wrap PKCS#1 RSAPrivateKey inside PKCS#8 PrivateKeyInfo for Web Crypto importKey("pkcs8").
  const rsaAlgId = [
    0x30, 0x0d, 0x06, 0x09, 0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01,
    0x01, 0x05, 0x00,
  ];
  const octetHeader = [0x04, ...encodeDerLength(derBytes.length)];
  const innerHeader = [0x02, 0x01, 0x00, ...rsaAlgId, ...octetHeader];
  const totalLength = innerHeader.length + derBytes.length;
  const wrapped = new Uint8Array([
    0x30,
    ...encodeDerLength(totalLength),
    ...innerHeader,
    ...derBytes,
  ]);
  return wrapped;
}

export function resolveWaffoConfig(
  env: Record<string, string | undefined> = process.env
): WaffoConfig {
  const merchantId = (env.WAFFO_MERCHANT_ID ?? "").trim();
  const privateKey = (env.WAFFO_PRIVATE_KEY ?? "").trim();
  const storeId = (env.WAFFO_STORE_ID ?? "").trim();
  const defaultProductId = (env.WAFFO_PRODUCT_ID ?? "").trim() || undefined;
  const starterProductId =
    (env.WAFFO_PRODUCT_ID_STARTER ?? "").trim() || undefined;
  const allAccessProductId =
    (env.WAFFO_PRODUCT_ID_ALL_ACCESS ?? "").trim() || undefined;

  const missing: string[] = [];
  if (!merchantId) missing.push("WAFFO_MERCHANT_ID");
  if (!privateKey) missing.push("WAFFO_PRIVATE_KEY");
  if (!storeId) missing.push("WAFFO_STORE_ID");
  if (!defaultProductId && !(starterProductId && allAccessProductId)) {
    missing.push("WAFFO_PRODUCT_ID");
  }
  if (missing.length > 0) {
    throw new WaffoConfigError(
      `Waffo checkout is not configured on this server yet (missing ${missing.join(", ")}).`,
      missing
    );
  }

  if (!merchantId.startsWith("MER_")) {
    throw new WaffoConfigError(
      `Invalid WAFFO_MERCHANT_ID "${merchantId}": expected a Waffo Merchant ID starting with "MER_".`
    );
  }
  if (!storeId.startsWith("STO_")) {
    throw new WaffoConfigError(
      `Invalid WAFFO_STORE_ID "${storeId}": expected a Waffo Store ID starting with "STO_".`
    );
  }

  const rawEnv = (env.WAFFO_ENVIRONMENT ?? "prod").trim().toLowerCase();
  if (rawEnv !== "prod" && rawEnv !== "test") {
    throw new WaffoConfigError(
      `Invalid WAFFO_ENVIRONMENT "${rawEnv}": expected "prod" or "test".`
    );
  }

  return {
    merchantId,
    privateKey,
    storeId,
    defaultProductId,
    starterProductId,
    allAccessProductId,
    environment: rawEnv,
  };
}

export function resolveWaffoProductForPlan(
  config: WaffoConfig,
  plan: ProPlanId
): { productId: string; usePriceSnapshot: boolean } {
  const dedicatedId =
    plan === "starter_rbxmx"
      ? config.starterProductId
      : config.allAccessProductId;
  if (dedicatedId) {
    return { productId: dedicatedId, usePriceSnapshot: false };
  }
  if (config.defaultProductId) {
    return { productId: config.defaultProductId, usePriceSnapshot: true };
  }
  throw new WaffoConfigError(
    `Missing Waffo product ID for plan "${plan}" (set WAFFO_PRODUCT_ID or per-plan product IDs).`,
    ["WAFFO_PRODUCT_ID"]
  );
}

export function createWaffoOrderRef(plan: ProPlanId, kitSlug?: string): string {
  const randomBytes = new Uint8Array(12);
  crypto.getRandomValues(randomBytes);
  let randomHex = "";
  for (let index = 0; index < randomBytes.length; index += 1) {
    randomHex += randomBytes[index]!.toString(16).padStart(2, "0");
  }
  if (plan === "pro_all_access") {
    return `rgm_w1_a_${randomHex}`;
  }
  return kitSlug ? `rgm_w1_s_${kitSlug}_${randomHex}` : `rgm_w1_s_${randomHex}`;
}

export function parseWaffoOrderRef(orderRef: string): ParsedWaffoOrderRef | null {
  const trimmed = orderRef.trim();
  if (ORDER_REF_ALL_ACCESS_PATTERN.test(trimmed)) {
    return { plan: "pro_all_access" };
  }
  const starterWithKit = ORDER_REF_STARTER_WITH_KIT_PATTERN.exec(trimmed);
  if (starterWithKit) {
    const kitSlug = starterWithKit[1]!;
    if (!getKit(kitSlug)) return null;
    return { plan: "starter_rbxmx", kitSlug };
  }
  if (ORDER_REF_STARTER_PLAIN_PATTERN.test(trimmed)) {
    return { plan: "starter_rbxmx" };
  }
  return null;
}

export function parseWaffoAmountCents(value: unknown): number | null {
  if (typeof value === "number") {
    if (!Number.isFinite(value) || value < 0) return null;
    return Math.round(value * 100);
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!/^\d+(?:\.\d{1,2})?$/.test(trimmed)) return null;
    const [whole, fraction = ""] = trimmed.split(".");
    const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
    return Number.isSafeInteger(cents) ? cents : null;
  }
  return null;
}

async function signWaffoRequest(
  privateKeyRaw: string,
  path: string,
  timestamp: string,
  bodyString: string
): Promise<string> {
  let signingKey: CryptoKey;
  try {
    signingKey = await crypto.subtle.importKey(
      "pkcs8",
      privateKeyPemToPkcs8(privateKeyRaw),
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["sign"]
    );
  } catch (error) {
    if (error instanceof WaffoConfigError) throw error;
    throw new WaffoConfigError(
      "WAFFO_PRIVATE_KEY could not be imported as an RSA private key."
    );
  }

  const bodyDigest = await crypto.subtle.digest(
    "SHA-256",
    textEncoder.encode(bodyString)
  );
  const canonical = `POST\n${path}\n${timestamp}\n${encodeBase64(bodyDigest)}`;
  const signatureBuffer = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    signingKey,
    textEncoder.encode(canonical)
  );
  return encodeBase64(signatureBuffer);
}

async function callWaffoApi<TData>(
  config: WaffoConfig,
  path: string,
  body: Record<string, unknown>,
  idempotencyKey?: string
): Promise<TData> {
  const bodyString = JSON.stringify(body);
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = await signWaffoRequest(
    config.privateKey,
    path,
    timestamp,
    bodyString
  );

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Merchant-Id": config.merchantId,
    "X-Timestamp": timestamp,
    "X-Signature": signature,
  };
  if (idempotencyKey) {
    headers["X-Idempotency-Key"] = idempotencyKey;
  }

  const response = await fetch(`${WAFFO_API_BASE}${path}`, {
    method: "POST",
    headers,
    body: bodyString,
    signal: AbortSignal.timeout(WAFFO_REQUEST_TIMEOUT_MS),
  });

  const envelope = (await response.json().catch(() => null)) as {
    data?: TData;
    errors?: Array<{ message?: string }>;
  } | null;

  if (!response.ok || (envelope?.errors && envelope.errors.length > 0) || !envelope?.data) {
    const upstreamMessage =
      envelope?.errors?.[0]?.message ??
      `Waffo API request to ${path} failed with HTTP ${response.status}.`;
    throw new WaffoUpstreamError(upstreamMessage, response.status || 502);
  }

  return envelope.data;
}

export async function createWaffoCheckoutSession(
  config: WaffoConfig,
  options: {
    plan: ProPlanId;
    kitSlug?: string;
    orderRef: string;
    requestOrigin: string;
    returnPath: string;
    locale?: "en" | "zh";
  }
): Promise<{ sessionId: string; checkoutUrl: string }> {
  const planSpec = PRICING_PLANS[options.plan];
  const { productId, usePriceSnapshot } = resolveWaffoProductForPlan(
    config,
    options.plan
  );

  // Waffo rejects non-HTTPS successUrl at payment confirmation time.
  const successUrl = options.requestOrigin.startsWith("https://")
    ? `${options.requestOrigin}/pro/success?order_ref=${encodeURIComponent(
        options.orderRef
      )}&next=${encodeURIComponent(options.returnPath)}`
    : undefined;

  const payload: Record<string, unknown> = {
    productId,
    currency: "USD",
    darkMode: true,
    language: options.locale === "zh" ? "zh-Hans" : "en",
    metadata: {
      plan: options.plan,
      ...(options.kitSlug ? { kitSlug: options.kitSlug } : {}),
    },
    orderMerchantExternalId: options.orderRef,
  };

  if (usePriceSnapshot) {
    payload.priceSnapshot = {
      amount: (planSpec.priceCents / 100).toFixed(2),
      taxCategory: "saas",
    };
  }
  if (successUrl) {
    payload.successUrl = successUrl;
  }

  const data = await callWaffoApi<{
    sessionId?: string;
    checkoutUrl?: string;
  }>(config, WAFFO_CREATE_SESSION_PATH, payload, options.orderRef);

  if (
    typeof data.checkoutUrl !== "string" ||
    !data.checkoutUrl.startsWith("https://")
  ) {
    throw new WaffoUpstreamError(
      "Waffo checkout did not return a valid HTTPS checkoutUrl.",
      502
    );
  }

  return {
    sessionId: String(data.sessionId ?? options.orderRef),
    checkoutUrl: data.checkoutUrl,
  };
}

const VERIFY_ONETIME_ORDER_QUERY = `query VerifyOnetimeOrder($storeId: String!, $ref: String!) {
  onetimeOrders(
    storeId: $storeId
    filter: { orderMerchantExternalId: { eq: $ref } }
    limit: 5
  ) {
    id
    status
    currency
    testMode
    orderMerchantExternalId
    metadata
    priceSnapshot {
      currency
      subtotal
      total
    }
    onetimeProduct {
      id
    }
    payments {
      id
      status
      isFullyRefunded
      refundStatus
    }
  }
}`;

export async function lookupWaffoOrderByRef(
  config: WaffoConfig,
  orderRef: string
): Promise<WaffoOnetimeOrder | null> {
  const data = await callWaffoApi<{
    onetimeOrders?: WaffoOnetimeOrder[] | null;
  }>(config, WAFFO_GRAPHQL_PATH, {
    query: VERIFY_ONETIME_ORDER_QUERY,
    variables: {
      storeId: config.storeId,
      ref: orderRef,
    },
  });

  const expectedTestMode = config.environment === "test";
  const matchingOrders = (data.onetimeOrders ?? []).filter(
    (order) =>
      order &&
      order.orderMerchantExternalId === orderRef &&
      order.testMode === expectedTestMode
  );
  if (matchingOrders.length === 0) return null;

  return (
    matchingOrders.find((order) => order.status === "completed") ??
    matchingOrders[0]!
  );
}
