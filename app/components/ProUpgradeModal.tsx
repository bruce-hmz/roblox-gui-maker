"use client";

import { useState } from "react";
import { Check, ShieldCheck, Sparkles, X } from "lucide-react";
import { KITS } from "../editor/kits";
import type { Locale } from "../i18n";
import { PRICING_PLANS, type ProPlanId } from "../lib/pro-access";
import { startStripeCheckout } from "../lib/pro-client";
import { trackEvent } from "../lib/track";

export type ProUpgradeModalProps = {
  open: boolean;
  onClose: () => void;
  contextTitle?: string;
  kitSlug?: string;
  kitName?: string;
  defaultPlan?: ProPlanId;
  returnPath: string;
  locale?: Locale;
};

export function ProUpgradeModal({
  open,
  onClose,
  contextTitle,
  kitSlug,
  kitName,
  defaultPlan = "pro_all_access",
  returnPath,
  locale = "en",
}: ProUpgradeModalProps) {
  const zh = locale === "zh";
  const [selectedPlan, setSelectedPlan] = useState<ProPlanId>(defaultPlan);
  const [chosenKitSlug, setChosenKitSlug] = useState<string>(
    kitSlug ?? KITS[0]!.slug
  );
  const [submitting, setSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  if (!open) return null;

  const activeStarterKitSlug = kitSlug ?? chosenKitSlug;
  const activeStarterKitName =
    kitName ??
    KITS.find((kit) => kit.slug === activeStarterKitSlug)?.name ??
    activeStarterKitSlug;

  async function launchStripeCheckout() {
    if (submitting) return;
    setSubmitting(true);
    setCheckoutError(null);

    const targetKit =
      selectedPlan === "starter_rbxmx" ? activeStarterKitSlug : kitSlug;

    trackEvent("begin_checkout", {
      plan: selectedPlan,
      kitSlug: targetKit,
      returnPath,
    });

    try {
      const outcome = await startStripeCheckout({
        plan: selectedPlan,
        ...(targetKit ? { kitSlug: targetKit } : {}),
        returnPath,
      });
      if (!outcome.ok) {
        setCheckoutError(outcome.message);
        setSubmitting(false);
        return;
      }
      window.location.assign(outcome.checkoutUrl);
    } catch (error) {
      setCheckoutError(
        error instanceof Error && error.message
          ? error.message
          : zh
            ? "无法连接结账服务，请稍后重试。"
            : "Could not reach checkout service. Please try again."
      );
      setSubmitting(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pro-upgrade-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs"
      onClick={(event) => {
        if (event.target === event.currentTarget && !submitting) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl rounded-2xl border border-line bg-panel p-6 shadow-2xl shadow-black/60 max-h-[92vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          aria-label={zh ? "关闭弹窗" : "Close modal"}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg text-ink-mute transition hover:bg-raised hover:text-ink disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-5 pr-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-focus">
            <Sparkles className="h-3.5 w-3.5" />
            {zh ? "一次性买断 · 无订阅 · 免装插件" : "One-Time Buyout · No Subscription · No Plugin"}
          </span>
          <h2
            id="pro-upgrade-modal-title"
            className="mt-2.5 text-2xl font-bold tracking-tight text-ink"
          >
            {contextTitle ??
              (zh
                ? "解锁原生 Roblox Studio .rbxmx 与完整套装导出"
                : "Unlock Native Studio .rbxmx & Pro UI Kits")}
          </h2>
          <p className="mt-1.5 text-sm text-ink-dim">
            {zh
              ? "客户端与服务端 .lua 代码复制下载、单张 512×512 Gamepass 徽章 PNG 永久免费。升级 Pro 即可直接拖入 Roblox Studio 生成完整实例树与整套图标。"
              : "Client & Server .lua exports and single 512×512 Gamepass PNGs stay 100% free forever. Upgrade once to drag native .rbxmx hierarchies and complete icon packs straight into Roblox Studio."}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Starter Pass */}
          <div
            onClick={() => setSelectedPlan("starter_rbxmx")}
            role="radio"
            aria-checked={selectedPlan === "starter_rbxmx"}
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setSelectedPlan("starter_rbxmx");
              }
            }}
            className={`cursor-pointer rounded-xl border p-4 transition ${
              selectedPlan === "starter_rbxmx"
                ? "border-focus bg-raised/60 ring-1 ring-focus"
                : "border-line bg-surface hover:border-ink-mute"
            }`}
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-sm font-semibold text-ink">
                {zh ? "Studio .rbxmx + 单套 Kit" : "Studio .rbxmx + 1 UI Kit"}
              </span>
              <span className="text-lg font-bold text-ink">
                {PRICING_PLANS.starter_rbxmx.priceDisplay}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-ink-mute">
              {zh ? "一次性付款 · 永久解锁当前浏览器令牌" : "Pay once · no recurring charges"}
            </p>
            <ul className="mt-3 space-y-1.5 text-xs text-ink-dim">
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                <span>
                  {zh
                    ? "编辑器无限导出原生 .rbxmx 模型文件"
                    : "Unlimited native .rbxmx exports in /editor"}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                <span>
                  {zh
                    ? `含 1 套 5 界面完整包 (${activeStarterKitName})`
                    : `1 full 5-screen UI Kit ZIP (${activeStarterKitName})`}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                <span>
                  {zh
                    ? "配套 6 枚 512×512 Gamepass 矢量图标"
                    : "6 matched 512×512 Gamepass badge icons"}
                </span>
              </li>
            </ul>
            {!kitSlug && selectedPlan === "starter_rbxmx" && (
              <div
                className="mt-3 pt-3 border-t border-line"
                onClick={(event) => event.stopPropagation()}
              >
                <label className="block text-[11px] font-medium text-ink-mute mb-1">
                  {zh ? "选择包含的 UI Kit：" : "Included UI Kit:"}
                </label>
                <select
                  value={chosenKitSlug}
                  onChange={(event) => setChosenKitSlug(event.target.value)}
                  className="w-full rounded-md border border-line bg-input px-2.5 py-1.5 text-xs text-ink"
                >
                  {KITS.map((kit) => (
                    <option key={kit.slug} value={kit.slug}>
                      {kit.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* All-Access Pass */}
          <div
            onClick={() => setSelectedPlan("pro_all_access")}
            role="radio"
            aria-checked={selectedPlan === "pro_all_access"}
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setSelectedPlan("pro_all_access");
              }
            }}
            className={`relative cursor-pointer rounded-xl border p-4 transition ${
              selectedPlan === "pro_all_access"
                ? "border-focus bg-raised/60 ring-1 ring-focus"
                : "border-line bg-surface hover:border-ink-mute"
            }`}
          >
            <span className="absolute -top-2.5 right-3 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-on-primary">
              {zh ? "最受欢迎" : "Best Value"}
            </span>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-sm font-semibold text-ink">
                {zh ? "All-Access 全通包" : "All-Access Studio Pro"}
              </span>
              <span className="text-lg font-bold text-ink">
                {PRICING_PLANS.pro_all_access.priceDisplay}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-ink-mute">
              {zh ? "一次性买断全站成品资产" : "Pay once · unlock every kit & icon"}
            </p>
            <ul className="mt-3 space-y-1.5 text-xs text-ink-dim">
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                <span>
                  {zh
                    ? "编辑器无限导出原生 .rbxmx 模型 + Studio ZIP"
                    : "Unlimited native .rbxmx model & Studio ZIP exports"}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                <span>
                  {zh
                    ? "全部 6 大热门品类 Kit（共 30 个同色系界面 + 屏幕切换器）"
                    : "All 6 genre UI Kits (30 themed screens + KitScreenSwitcher)"}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                <span>
                  {zh
                    ? "全部 48 枚 512×512 Gamepass 与商店图标包"
                    : "All 48 512×512 Gamepass & Shop badge icons + Shop .rbxmx"}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {checkoutError && (
          <div
            role="alert"
            className="mt-4 rounded-lg border border-danger/40 bg-danger/10 px-3.5 py-2.5 text-xs text-danger"
          >
            {checkoutError}
          </div>
        )}

        <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-line">
          <div className="flex items-center gap-2 text-xs text-ink-mute">
            <ShieldCheck className="h-4 w-4 shrink-0 text-success" />
            <span>
              {zh
                ? "Stripe 安全结账 · 付款后立即下载 ZIP 与 .rbxmx"
                : "Secured by Stripe · Instant .rbxmx & ZIP download right after payment"}
            </span>
          </div>
          <button
            type="button"
            onClick={() => void launchStripeCheckout()}
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition hover:brightness-110 disabled:opacity-50"
          >
            {submitting
              ? zh
                ? "正在跳转 Stripe…"
                : "Redirecting to Stripe…"
              : selectedPlan === "pro_all_access"
                ? zh
                  ? `以 ${PRICING_PLANS.pro_all_access.priceDisplay} 解锁全部`
                  : `Unlock All-Access (${PRICING_PLANS.pro_all_access.priceDisplay})`
                : zh
                  ? `以 ${PRICING_PLANS.starter_rbxmx.priceDisplay} 解锁`
                  : `Unlock Starter (${PRICING_PLANS.starter_rbxmx.priceDisplay})`}
          </button>
        </div>
      </div>
    </div>
  );
}
