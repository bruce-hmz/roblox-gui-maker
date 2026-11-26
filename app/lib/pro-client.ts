// Browser-side helpers for triggering Waffo Checkout and verified Pro downloads.
// All actual file fulfillment is verified server-side via HMAC signature.

import type { SceneNode } from "../editor/catalog";
import type { ProPlanId } from "./pro-access";

export const PRO_TOKEN_STORAGE_KEY = "rgm:pro-pass:v1";

export type ClientProStatus = {
  plan: ProPlanId;
  kitSlug?: string;
  token: string;
};

export function saveClientProStatus(status: ClientProStatus): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PRO_TOKEN_STORAGE_KEY, JSON.stringify(status));
  } catch {
    // Private-mode storage block — HttpOnly cookie still carries the token.
  }
}

export function loadClientProStatus(): ClientProStatus | null {
  if (typeof window === "undefined") return null;
  try {
    const storedJson = window.localStorage.getItem(PRO_TOKEN_STORAGE_KEY);
    if (!storedJson) return null;
    const parsed = JSON.parse(storedJson) as Record<string, unknown> | null;
    if (!parsed || typeof parsed !== "object") return null;
    if (
      (parsed.plan !== "starter_rbxmx" && parsed.plan !== "pro_all_access") ||
      typeof parsed.token !== "string" ||
      parsed.token.length === 0
    ) {
      return null;
    }
    return {
      plan: parsed.plan,
      ...(typeof parsed.kitSlug === "string" ? { kitSlug: parsed.kitSlug } : {}),
      token: parsed.token,
    };
  } catch {
    return null;
  }
}

export function clearClientProStatus(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PRO_TOKEN_STORAGE_KEY);
  } catch {
    // Ignore storage block.
  }
}

export async function startProCheckout(options: {
  plan: ProPlanId;
  kitSlug?: string;
  returnPath: string;
  locale?: "en" | "zh";
}): Promise<{ ok: true; checkoutUrl: string } | { ok: false; message: string }> {
  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options),
  });
  const payload = (await response.json().catch(() => null)) as {
    checkoutUrl?: string;
    message?: string;
  } | null;
  if (!response.ok || !payload?.checkoutUrl) {
    return {
      ok: false,
      message:
        payload?.message ??
        `Checkout request failed with HTTP ${response.status}.`,
    };
  }
  return { ok: true, checkoutUrl: payload.checkoutUrl };
}

export async function requestEditorRbxmxExport(
  scene: SceneNode[],
  format: "rbxmx" | "zip" = "rbxmx"
): Promise<
  | { ok: true; filename: string; blob: Blob }
  | { ok: false; unauthorized: boolean; message: string }
> {
  const clientStatus = loadClientProStatus();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (clientStatus?.token) {
    headers["x-pro-token"] = clientStatus.token;
  }
  const response = await fetch("/api/pro/export-rbxmx", {
    method: "POST",
    headers,
    body: JSON.stringify({ scene, format }),
  });
  if (!response.ok) {
    const errorPayload = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;
    if (response.status === 401 || response.status === 403) {
      clearClientProStatus();
      return {
        ok: false,
        unauthorized: true,
        message: errorPayload?.message ?? "Studio Pro Pass required.",
      };
    }
    return {
      ok: false,
      unauthorized: false,
      message:
        errorPayload?.message ?? `Export failed with HTTP ${response.status}.`,
    };
  }

  const disposition = response.headers.get("content-disposition") ?? "";
  const filenameMatch = /filename="([^"]+)"/.exec(disposition);
  const filename =
    filenameMatch?.[1] ??
    (format === "zip" ? "roblox-gui-studio.zip" : "roblox-gui.rbxmx");
  const blob = await response.blob();
  return { ok: true, filename, blob };
}

export async function triggerKitBundleDownload(
  target: string
): Promise<{ ok: true } | { ok: false; unauthorized: boolean; message: string }> {
  const clientStatus = loadClientProStatus();
  const headers: Record<string, string> = {};
  if (clientStatus?.token) {
    headers["x-pro-token"] = clientStatus.token;
  }
  const response = await fetch(
    `/api/pro/kit-bundle?target=${encodeURIComponent(target)}`,
    { headers }
  );
  if (!response.ok) {
    const errorPayload = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;
    return {
      ok: false,
      unauthorized: response.status === 401 || response.status === 403,
      message:
        errorPayload?.message ?? `Download failed with HTTP ${response.status}.`,
    };
  }
  const disposition = response.headers.get("content-disposition") ?? "";
  const filenameMatch = /filename="([^"]+)"/.exec(disposition);
  const filename = filenameMatch?.[1] ?? `${target}-pro.zip`;
  const blob = await response.blob();
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = downloadUrl;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(downloadUrl);
  return { ok: true };
}
