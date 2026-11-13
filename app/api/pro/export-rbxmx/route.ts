// POST /api/pro/export-rbxmx — verifies HMAC Pro Pass and exports a validated
// SceneNode[] tree as a native Roblox Studio .rbxmx model or Studio .zip bundle.

import { createStudioRbxmxZip } from "../../../editor/kit-package";
import { sanitizeScene } from "../../../editor/persistence";
import { rbxmxFilename, sceneToRbxmx } from "../../../editor/rbxmx";
import { generateLuau } from "../../../editor/scene";
import { generateServerLuau } from "../../../editor/server-luau";
import {
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

export async function POST(request: Request): Promise<Response> {
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
      "Unlock the Studio .rbxmx Pass or All-Access Pro Pass to export native .rbxmx models.",
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

  let requestBody: { scene?: unknown; format?: unknown };
  try {
    requestBody = (await request.json()) as typeof requestBody;
  } catch {
    return jsonError("invalid_json", "Expected a valid JSON body.", 400);
  }

  const sanitizedScene = sanitizeScene(requestBody.scene);
  if (!sanitizedScene || sanitizedScene.length === 0) {
    return jsonError(
      "invalid_scene",
      "Scene payload contained no valid Roblox GUI nodes.",
      422
    );
  }

  if (requestBody.format === "zip") {
    const clientCode = generateLuau(sanitizedScene);
    const serverCode = generateServerLuau(sanitizedScene);
    const studioBundle = createStudioRbxmxZip(
      sanitizedScene,
      clientCode,
      serverCode
    );
    return new Response(new Uint8Array(studioBundle.bytes), {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${studioBundle.filename}"`,
        "Cache-Control": "no-store",
      },
    });
  }

  const xmlDocument = sceneToRbxmx(sanitizedScene);
  const outputFilename = rbxmxFilename(sanitizedScene);
  return new Response(xmlDocument, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Content-Disposition": `attachment; filename="${outputFilename}"`,
      "Cache-Control": "no-store",
    },
  });
}
