"use client";

import { useState } from "react";
import { Check, Download, Layers } from "lucide-react";
import type { Locale } from "../i18n";
import { triggerKitBundleDownload } from "../lib/pro-client";
import { trackEvent } from "../lib/track";
import { ProUpgradeModal } from "./ProUpgradeModal";

export type KitBadgePreview = {
  id: string;
  titleTop: string;
  titleBottom?: string;
  svgMarkup: string;
};

type KitProDownloadCardProps = {
  kitSlug: string;
  kitName: string;
  screenCount: number;
  icons: KitBadgePreview[];
  locale?: Locale;
};

export function KitProDownloadCard({
  kitSlug,
  kitName,
  screenCount,
  icons,
  locale = "en",
}: KitProDownloadCardProps) {
  const zh = locale === "zh";
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const returnPath = zh ? `/zh/kits/${kitSlug}` : `/kits/${kitSlug}`;

  async function downloadKitZip() {
    if (downloading) return;
    setDownloading(true);
    setDownloadError(null);
    trackEvent("kit_pro_download_click", { kitSlug, locale });

    try {
      const outcome = await triggerKitBundleDownload(kitSlug);
      if (!outcome.ok) {
        if (outcome.unauthorized) {
          setUpgradeOpen(true);
        } else {
          setDownloadError(outcome.message);
        }
      } else {
        trackEvent("kit_pro_download_complete", { kitSlug, locale });
      }
    } catch (error) {
      setDownloadError(
        error instanceof Error && error.message
          ? error.message
          : zh
            ? "下载失败，请重试。"
            : "Bundle download failed. Please try again."
      );
    } finally {
      setDownloading(false);
    }
  }

  return (
    <>
      <section className="mb-10 rounded-2xl border border-line bg-panel p-6 shadow-xl shadow-black/30">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-focus">
              <Layers className="h-3.5 w-3.5" />
              {zh
                ? "Studio 成品交付包 (.rbxmx + 图标)"
                : "Ready-to-Import Studio Bundle (.rbxmx + Icons)"}
            </div>
            <h2 className="text-xl font-bold text-ink">
              {zh
                ? `一键把整套《${kitName}》拖进 Roblox Studio`
                : `Drop the Complete ${kitName} Straight into Roblox Studio`}
            </h2>
            <p className="text-sm text-ink-dim leading-relaxed">
              {zh
                ? `逐个界面打开并复制 .lua 永久免费。需要直接交付上线？下载完整 ZIP，内含合并好的多界面 .rbxmx 模型（带顶栏屏幕切换脚本）、服务端 RemoteEvent 模板，以及 6 枚同主题 512×512 Gamepass 徽章。`
                : `Opening individual screens and copying .lua stays 100% free. Want the finished Studio deliverable? Download the complete ZIP with a combined multi-screen .rbxmx hierarchy (including a live screen switcher), ServerScriptService handlers, and 6 matched 512×512 Gamepass icons.`}
            </p>
            <ul className="grid gap-1.5 pt-1 text-xs text-ink-dim sm:grid-cols-2">
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 shrink-0 text-success" />
                <span>
                  {zh
                    ? `${kitSlug}-complete.rbxmx（${screenCount} 界面 + 切换器）`
                    : `${kitSlug}-complete.rbxmx (${screenCount} screens + switcher)`}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 shrink-0 text-success" />
                <span>
                  {zh
                    ? `${screenCount} 个独立界面 .rbxmx + .client.lua`
                    : `${screenCount} standalone .rbxmx + .client.lua files`}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 shrink-0 text-success" />
                <span>
                  {zh
                    ? "ServerScriptService + MarketplaceService 购买模板"
                    : "ServerScriptService + MarketplaceService pass template"}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 shrink-0 text-success" />
                <span>
                  {zh
                    ? "6 枚配套 512×512 Gamepass 商店图标"
                    : "6 genre-matched 512×512 Gamepass & Shop icons"}
                </span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-stretch sm:items-end gap-2 shrink-0">
            <button
              type="button"
              onClick={() => void downloadKitZip()}
              disabled={downloading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition hover:brightness-110 disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              {downloading
                ? zh
                  ? "正在打包 ZIP…"
                  : "Preparing Studio ZIP…"
                : zh
                  ? "下载完整 .rbxmx + 图标包"
                  : "Download Complete .rbxmx + Icons ZIP"}
            </button>
            <span className="text-[11px] text-ink-mute text-center sm:text-right">
              {zh
                ? "单套 USD 9.90 或全站 6 套 USD 19.90 · 一次性买断"
                : "USD 9.90 for this kit or USD 19.90 All-Access · One-time"}
            </span>
          </div>
        </div>

        {downloadError && (
          <p role="alert" className="mt-3 text-xs text-danger">
            {downloadError}
          </p>
        )}

        <div className="mt-5 pt-5 border-t border-line">
          <p className="text-xs font-medium text-ink-mute mb-3">
            {zh
              ? "随包附赠的 6 枚 512×512 Gamepass 变现徽章预览："
              : "6 matched 512×512 Gamepass monetization badges included in this kit:"}
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {icons.map((icon) => (
              <div
                key={icon.id}
                className="flex flex-col items-center gap-1.5 rounded-xl border border-line bg-surface p-2.5"
              >
                <img
                  src={`data:image/svg+xml;utf8,${encodeURIComponent(icon.svgMarkup)}`}
                  alt={`${icon.titleTop}${icon.titleBottom ? ` ${icon.titleBottom}` : ""} Roblox Gamepass icon`}
                  width={72}
                  height={72}
                  loading="lazy"
                  className="h-16 w-16 select-none"
                />
                <span className="text-[11px] font-semibold text-ink-dim text-center leading-tight">
                  {icon.titleTop}
                  {icon.titleBottom ? ` ${icon.titleBottom}` : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProUpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        contextTitle={
          zh
            ? `解锁《${kitName}》完整 Studio .rbxmx 包`
            : `Unlock ${kitName} — Complete Studio .rbxmx Bundle`
        }
        kitSlug={kitSlug}
        kitName={kitName}
        defaultPlan="pro_all_access"
        returnPath={returnPath}
        locale={locale}
      />
    </>
  );
}
