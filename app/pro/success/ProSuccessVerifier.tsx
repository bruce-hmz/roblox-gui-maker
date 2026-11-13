"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Download, AlertCircle, ArrowRight } from "lucide-react";
import { KITS } from "../../editor/kits";
import type { ProPlanId } from "../../lib/pro-access";
import {
  saveClientProStatus,
  triggerKitBundleDownload,
} from "../../lib/pro-client";
import { trackEvent } from "../../lib/track";

type VerificationState =
  | { stage: "verifying" }
  | { stage: "verified"; plan: ProPlanId; kitSlug?: string }
  | { stage: "failed"; message: string };

export function ProSuccessVerifier() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") ?? "";
  const rawNext = searchParams.get("next") ?? "/editor";
  const safeNext =
    rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/editor";

  const [verification, setVerification] = useState<VerificationState>({
    stage: "verifying",
  });
  const [downloadingTarget, setDownloadingTarget] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setVerification({
        stage: "failed",
        message: "Missing Stripe session_id in URL.",
      });
      return;
    }

    let cancelled = false;
    async function verifyPaidSession() {
      try {
        const response = await fetch(
          `/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}`
        );
        const payload = (await response.json().catch(() => null)) as {
          unlocked?: boolean;
          plan?: ProPlanId;
          kitSlug?: string;
          token?: string;
          message?: string;
        } | null;

        if (cancelled) return;
        if (!response.ok || !payload?.unlocked || !payload.plan || !payload.token) {
          setVerification({
            stage: "failed",
            message:
              payload?.message ??
              `Could not verify payment session (HTTP ${response.status}).`,
          });
          return;
        }

        saveClientProStatus({
          plan: payload.plan,
          ...(payload.kitSlug ? { kitSlug: payload.kitSlug } : {}),
          token: payload.token,
        });
        trackEvent("purchase_verified", {
          plan: payload.plan,
          kitSlug: payload.kitSlug,
        });
        setVerification({
          stage: "verified",
          plan: payload.plan,
          ...(payload.kitSlug ? { kitSlug: payload.kitSlug } : {}),
        });
      } catch (error) {
        if (cancelled) return;
        setVerification({
          stage: "failed",
          message:
            error instanceof Error && error.message
              ? error.message
              : "Network error while verifying checkout session.",
        });
      }
    }

    void verifyPaidSession();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  async function downloadUnlockedTarget(target: string) {
    if (downloadingTarget) return;
    setDownloadingTarget(target);
    setDownloadError(null);
    try {
      const outcome = await triggerKitBundleDownload(target);
      if (!outcome.ok) {
        setDownloadError(outcome.message);
      }
    } catch (error) {
      setDownloadError(
        error instanceof Error && error.message
          ? error.message
          : "Download failed. Please retry."
      );
    } finally {
      setDownloadingTarget(null);
    }
  }

  if (verification.stage === "verifying") {
    return (
      <div className="rounded-2xl border border-line bg-panel p-8 text-center">
        <p className="text-base font-semibold text-ink">
          Verifying your Stripe payment…
        </p>
        <p className="mt-1 text-sm text-ink-mute">
          Activating your Studio .rbxmx export pass and preparing your ZIP downloads.
        </p>
      </div>
    );
  }

  if (verification.stage === "failed") {
    return (
      <div className="rounded-2xl border border-danger/40 bg-panel p-8">
        <div className="flex items-center gap-2.5 text-danger">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <h2 className="text-lg font-bold">Could not verify checkout session</h2>
        </div>
        <p className="mt-2 text-sm text-ink-dim">{verification.message}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/pricing"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary"
          >
            Back to Pricing
          </Link>
          <Link
            href="/editor"
            className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink-dim hover:text-ink"
          >
            Open Editor
          </Link>
        </div>
      </div>
    );
  }

  const unlockedKits =
    verification.plan === "pro_all_access"
      ? KITS
      : KITS.filter((kit) => kit.slug === verification.kitSlug);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-success/40 bg-panel p-6 sm:p-8">
        <div className="flex items-center gap-2.5 text-success">
          <CheckCircle2 className="h-6 w-6 shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Studio Pro Pass Activated
          </span>
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-ink">
          {verification.plan === "pro_all_access"
            ? "All-Access Studio Pro Unlocked"
            : "Studio .rbxmx + Single UI Kit Unlocked"}
        </h1>
        <p className="mt-2 text-sm text-ink-dim leading-relaxed">
          Your browser now holds a signed Studio Pass token. You can export native{" "}
          <code className="rounded bg-raised px-1.5 py-0.5 text-xs text-ink">
            .rbxmx
          </code>{" "}
          models directly from the editor at any time and download your unlocked
          ZIP bundles below.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={safeNext}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition hover:brightness-110"
          >
            Continue where you left off
            <ArrowRight className="h-4 w-4" />
          </Link>
          {safeNext !== "/editor" && (
            <Link
              href="/editor"
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-focus"
            >
              Open Editor (.rbxmx Ready)
            </Link>
          )}
        </div>
      </div>

      {downloadError && (
        <div
          role="alert"
          className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          {downloadError}
        </div>
      )}

      {unlockedKits.length > 0 && (
        <section className="rounded-2xl border border-line bg-panel p-6">
          <h2 className="text-lg font-bold text-ink mb-1">
            Your Unlocked Multi-Screen UI Kit Bundles (.rbxmx + Icons)
          </h2>
          <p className="text-xs text-ink-mute mb-4">
            Each ZIP includes the combined multi-screen .rbxmx with KitScreenSwitcher,
            5 standalone screen .rbxmx files, Luau scripts, and 6 matched 512×512 badges.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {unlockedKits.map((kit) => (
              <div
                key={kit.slug}
                className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface p-3.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">
                    {kit.name}
                  </p>
                  <p className="text-xs text-ink-mute">
                    {kit.screens.length} screens · {kit.theme} theme
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void downloadUnlockedTarget(kit.slug)}
                  disabled={downloadingTarget !== null}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-on-primary transition hover:brightness-110 disabled:opacity-50"
                >
                  <Download className="h-3.5 w-3.5" />
                  {downloadingTarget === kit.slug ? "Downloading…" : "ZIP"}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {verification.plan === "pro_all_access" && (
        <section className="rounded-2xl border border-line bg-panel p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-ink">
              Complete 48 Gamepass &amp; Shop Icons Pack
            </h2>
            <p className="text-xs text-ink-mute mt-1">
              12 universal presets + 36 genre-matched 512×512 badges + Game Pass Shop .rbxmx model.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void downloadUnlockedTarget("all-icons")}
            disabled={downloadingTarget !== null}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-focus bg-raised px-4 py-2.5 text-xs font-semibold text-ink transition hover:bg-raised-hi disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            {downloadingTarget === "all-icons"
              ? "Preparing 48-Icon ZIP…"
              : "Download All 48 Icons + Shop .rbxmx"}
          </button>
        </section>
      )}
    </div>
  );
}
