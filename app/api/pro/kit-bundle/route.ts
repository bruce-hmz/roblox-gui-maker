// GET /api/pro/kit-bundle?target=<kitSlug|all-icons> — verifies Pro Pass and
// streams a complete multi-screen .rbxmx + 512x512 Gamepass icons ZIP bundle.

import {
  createAllIconsPackZip,
  createKitProPackage,
} from "../../../editor/kit-package";
import { getKit } from "../../../editor/kits";
import {
  canAccessKitBundle,
  readProTokenFromRequest,
  resolveProPassSecret,
  verifyProPassToken,
} from "../../../lib/pro-access";

function jsonError(error: string, message: string, status: number): Response {
  return new Response(JSON.stringify({ error, message }), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

export async function GET(request: Request): Promise<Response> {
  const target = (new URL(request.url).searchParams.get("target") ?? "").trim();
  if (!target) {
    return jsonError(
      "missing_target",
      'Query parameter "target" is required (kit slug or "all-icons").',
      400
    );
  }

  if (target !== "all-icons" && !getKit(target)) {
    return jsonError("unknown_target", `Unknown bundle target "${target}".`, 404);
  }

  let signingSecret: string;
  try {
    signingSecret = resolveProPassSecret(process.env);
  } catch {
    return jsonError(
      "pro_not_configured",
      "Studio Pro Pass verification is not configured on this server yet.",
      503
    );
  }

  const token = readProTokenFromRequest(request);
  if (!token) {
    return jsonError(
      "pro_required",
      "A valid Studio Pro Pass is required to download this bundle.",
      401
    );
  }

  const claims = await verifyProPassToken(token, signingSecret);
  if (!claims) {
    return jsonError(
      "invalid_pro_token",
      "Your Studio Pro Pass token could not be verified.",
      401
    );
  }

  if (!canAccessKitBundle(claims, target)) {
    return jsonError(
      "bundle_not_entitled",
      `Your Single Kit Pass (${claims.kitSlug ?? "editor-only"}) does not include "${target}". Upgrade to the All-Access Pro Pass to unlock all 6 kits and 48 icons.`,
      403
    );
  }

  const bundle =
    target === "all-icons"
      ? createAllIconsPackZip()
      : createKitProPackage(getKit(target)!);

  return new Response(new Uint8Array(bundle.bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${bundle.filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
