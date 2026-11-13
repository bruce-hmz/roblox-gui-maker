// Stateless HMAC-SHA256 Pro Pass signing & verification using Web Crypto.
// Compatible with both Cloudflare Workers and Node 20+ without a database.

export type ProPlanId = "starter_rbxmx" | "pro_all_access";

export type ProPassClaims = {
  version: 1;
  plan: ProPlanId;
  kitSlug?: string;
  sessionId: string;
  issuedAt: number;
};

export type PricingPlanSpec = {
  id: ProPlanId;
  priceCents: number;
  priceDisplay: string;
  productName: string;
  productDescription: string;
};

export const PRICING_PLANS: Record<ProPlanId, PricingPlanSpec> = {
  starter_rbxmx: {
    id: "starter_rbxmx",
    priceCents: 990,
    priceDisplay: "USD 9.90",
    productName: "Roblox GUI Maker — Studio .rbxmx + Single UI Kit Pass",
    productDescription:
      "One-time buyout: native Roblox Studio .rbxmx model exports in the editor plus 1 cohesive 5-screen Pro UI Kit and 6 matched 512x512 Gamepass icons.",
  },
  pro_all_access: {
    id: "pro_all_access",
    priceCents: 1990,
    priceDisplay: "USD 19.90",
    productName: "Roblox GUI Maker — All-Access Studio Pro Pass",
    productDescription:
      "One-time buyout: unlimited native .rbxmx exports, all 6 genre 5-screen Pro UI Kits, and all 48 512x512 Gamepass & Shop badge icons.",
  },
};

export const PRO_PASS_COOKIE_NAME = "rgm_pro_token";
const TOKEN_PREFIX = "v1";
const MIN_SECRET_LENGTH = 16;

export function resolveProPassSecret(
  env: Record<string, string | undefined> = process.env
): string {
  const trimmedProPassSecret = (env.PRO_PASS_SECRET ?? "").trim();
  const configuredSecret =
    trimmedProPassSecret.length > 0
      ? trimmedProPassSecret
      : (env.STRIPE_SECRET_KEY ?? "").trim();
  if (configuredSecret.length < MIN_SECRET_LENGTH) {
    throw new Error(
      `Pro Pass signing requires PRO_PASS_SECRET or STRIPE_SECRET_KEY of at least ${MIN_SECRET_LENGTH} characters (got length ${configuredSecret.length}).`
    );
  }
  return configuredSecret;
}

function encodeBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index]!);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeBase64Url(encoded: string): Uint8Array<ArrayBuffer> | null {
  if (!/^[A-Za-z0-9_-]+$/.test(encoded)) return null;
  const padded = encoded
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(Math.ceil(encoded.length / 4) * 4, "=");
  try {
    const binary = atob(padded);
    const decoded = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      decoded[index] = binary.charCodeAt(index);
    }
    return decoded;
  } catch {
    return null;
  }
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  if (secret.trim().length < MIN_SECRET_LENGTH) {
    throw new Error(
      `Pro Pass signing secret must be at least ${MIN_SECRET_LENGTH} characters.`
    );
  }
  const secretBytes = new TextEncoder().encode(secret.trim());
  return crypto.subtle.importKey(
    "raw",
    secretBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function isValidClaimsShape(candidate: unknown): candidate is ProPassClaims {
  if (!candidate || typeof candidate !== "object") return false;
  const record = candidate as Record<string, unknown>;
  if (record.version !== 1) return false;
  if (record.plan !== "starter_rbxmx" && record.plan !== "pro_all_access") {
    return false;
  }
  if (typeof record.sessionId !== "string" || record.sessionId.trim().length === 0) {
    return false;
  }
  if (typeof record.issuedAt !== "number" || !Number.isFinite(record.issuedAt)) {
    return false;
  }
  if (
    record.kitSlug !== undefined &&
    (typeof record.kitSlug !== "string" || record.kitSlug.trim().length === 0)
  ) {
    return false;
  }
  return true;
}

export async function signProPassToken(
  claims: ProPassClaims,
  secret: string
): Promise<string> {
  const claimsCandidate: unknown = claims;
  if (!isValidClaimsShape(claimsCandidate)) {
    throw new Error(
      `signProPassToken received invalid claims for session "${String(
        (claimsCandidate as ProPassClaims)?.sessionId
      )}".`
    );
  }
  const key = await importHmacKey(secret);
  const payloadSegment = encodeBase64Url(
    new TextEncoder().encode(JSON.stringify(claims))
  );
  const signingInput = new TextEncoder().encode(`${TOKEN_PREFIX}.${payloadSegment}`);
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, signingInput);
  const signatureSegment = encodeBase64Url(new Uint8Array(signatureBuffer));
  return `${TOKEN_PREFIX}.${payloadSegment}.${signatureSegment}`;
}

export async function verifyProPassToken(
  token: string,
  secret: string
): Promise<ProPassClaims | null> {
  const parts = token.trim().split(".");
  if (parts.length !== 3 || parts[0] !== TOKEN_PREFIX) return null;
  const payloadSegment = parts[1]!;
  const signatureBytes = decodeBase64Url(parts[2]!);
  if (!signatureBytes) return null;

  const key = await importHmacKey(secret);
  const signingInput = new TextEncoder().encode(`${TOKEN_PREFIX}.${payloadSegment}`);
  const signatureValid = await crypto.subtle.verify(
    "HMAC",
    key,
    signatureBytes,
    signingInput
  );
  if (!signatureValid) return null;

  const payloadBytes = decodeBase64Url(payloadSegment);
  if (!payloadBytes) return null;
  try {
    const parsedJson: unknown = JSON.parse(new TextDecoder().decode(payloadBytes));
    return isValidClaimsShape(parsedJson) ? parsedJson : null;
  } catch {
    return null;
  }
}

export function readProTokenFromRequest(request: Request): string | null {
  const headerToken = request.headers.get("x-pro-token")?.trim();
  if (headerToken) return headerToken;

  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;
  for (const segment of cookieHeader.split(";")) {
    const separatorIndex = segment.indexOf("=");
    if (separatorIndex <= 0) continue;
    const cookieKey = segment.slice(0, separatorIndex).trim();
    if (cookieKey === PRO_PASS_COOKIE_NAME) {
      const cookieValue = decodeURIComponent(segment.slice(separatorIndex + 1).trim());
      return cookieValue.length > 0 ? cookieValue : null;
    }
  }
  return null;
}

export function buildProPassCookie(token: string, secure: boolean): string {
  const attributes = [
    `${PRO_PASS_COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=31536000",
  ];
  if (secure) attributes.push("Secure");
  return attributes.join("; ");
}

export function canAccessKitBundle(
  claims: ProPassClaims,
  target: string
): boolean {
  if (claims.plan === "pro_all_access") return true;
  if (target === "all-icons") return false;
  return claims.kitSlug === target;
}
