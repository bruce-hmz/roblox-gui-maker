"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { KITS } from "../editor/kits";
import type { Locale } from "../i18n";
import { PRICING_PLANS, type ProPlanId } from "../lib/pro-access";
import { startStripeCheckout } from "../lib/pro-client";
import { trackEvent } from "../lib/track";

export function PricingCards({ locale = "en" }: { locale?: Locale }) {
  const zh = locale === "zh";
  const [starterKitSlug, setStarterKitSlug] = useState<string>(KITS[0]!.slug);
  const [loadingPlan, setLoadingPlan] = useState<ProPlanId | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const returnPath = zh ? "/zh/pricing" : "/pricing";

  async function beginPlanCheckout(plan: ProPlanId) {
    if (loadingPlan) return;
    setLoadingPlan(plan);
    setCheckoutError(null);

    const kitSlug = plan === "starter_rbxmx" ? starterKitSlug : undefined;
    trackEvent("begin_checkout", { plan, kitSlug, returnPath });

    try {
      const outcome = await startStripeCheckout({
        plan,
        ...(kitSlug ? { kitSlug } : {}),
        returnPath,
      });
      if (!outcome.ok) {
        setCheckoutError(outcome.message);
        setLoadingPlan(null);
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
      setLoadingPlan(null);
    }
  }

  return (
    <div>
      {checkoutError && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          {checkoutError}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Free Tier */}
        <div className="flex flex-col rounded-2xl border border-line bg-panel p-6">
          <h2 className="text-lg font-bold text-ink">
            {zh ? "免费构建器" : "Free Builder"}
          </h2>
          <p className="mt-1 text-xs text-ink-mute">
            {zh ? "永久免费 · 无需注册登录" : "Free forever · No account required"}
          </p>
          <div className="mt-4 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-ink">USD 0</span>
          </div>
          <ul className="mt-6 flex-1 space-y-2.5 text-sm text-ink-dim">
            <li className="flex items-start gap-2.5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              <span>
                {zh
                  ? "完整可视化拖拽编辑器与全部模板预览"
                  : "Full visual GUI builder & all template scenes"}
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              <span>
                {zh
                  ? "无限复制/下载客户端 .lua 与服务端 .server.lua"
                  : "Unlimited Client .lua & Server .server.lua copy/download"}
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              <span>
                {zh
                  ? "单张 512×512 Gamepass 徽章 PNG / SVG 免费导出"
                  : "Free single 512×512 Gamepass icon PNG & SVG exports"}
              </span>
            </li>
          </ul>
          <Link
            href="/editor"
            className="mt-6 inline-flex items-center justify-center rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-focus"
          >
            {zh ? "打开免费编辑器 →" : "Open Free Editor →"}
          </Link>
        </div>

        {/* Starter Tier */}
        <div className="flex flex-col rounded-2xl border border-line bg-panel p-6">
          <h2 className="text-lg font-bold text-ink">
            {zh ? "Studio .rbxmx + 单套 Kit" : "Studio .rbxmx + Single Kit"}
          </h2>
          <p className="mt-1 text-xs text-ink-mute">
            {zh ? "一次性买断 · 无月费订阅" : "One-time payment · No subscription"}
          </p>
          <div className="mt-4 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-ink">
              {PRICING_PLANS.starter_rbxmx.priceDisplay}
            </span>
            <span className="text-xs text-ink-mute">
              {zh ? "买断" : "once"}
            </span>
          </div>
          <ul className="mt-6 flex-1 space-y-2.5 text-sm text-ink-dim">
            <li className="flex items-start gap-2.5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              <span>
                {zh
                  ? "编辑器无限导出原生 Roblox Studio .rbxmx 模型"
                  : "Unlimited native .rbxmx Studio model exports in /editor"}
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              <span>
                {zh
                  ? "任选 1 套完整 5 界面同色系 UI Kit（含屏幕切换脚本）"
                  : "1 cohesive 5-screen Pro UI Kit ZIP with KitScreenSwitcher"}
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              <span>
                {zh
                  ? "配套 6 枚 512×512 Gamepass 徽章图标"
                  : "6 matched 512×512 Gamepass badge icons"}
              </span>
            </li>
          </ul>
          <div className="mt-5">
            <label className="block text-xs font-medium text-ink-mute mb-1.5">
              {zh ? "选择要包含的 UI Kit：" : "Choose your included UI Kit:"}
            </label>
            <select
              value={starterKitSlug}
              onChange={(event) => setStarterKitSlug(event.target.value)}
              className="w-full rounded-lg border border-line bg-input px-3 py-2 text-xs text-ink"
            >
              {KITS.map((kit) => (
                <option key={kit.slug} value={kit.slug}>
                  {kit.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => void beginPlanCheckout("starter_rbxmx")}
            disabled={loadingPlan !== null}
            className="mt-4 inline-flex items-center justify-center rounded-xl border border-focus bg-raised px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-raised-hi disabled:opacity-50"
          >
            {loadingPlan === "starter_rbxmx"
              ? zh
                ? "正在跳转 Stripe…"
                : "Redirecting…"
              : zh
                ? `购买单套版 (${PRICING_PLANS.starter_rbxmx.priceDisplay})`
                : `Buy Starter Pass (${PRICING_PLANS.starter_rbxmx.priceDisplay})`}
          </button>
        </div>

        {/* All-Access Tier */}
        <div className="relative flex flex-col rounded-2xl border-2 border-focus bg-panel p-6 shadow-xl shadow-black/40">
          <span className="absolute -top-3 right-5 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-0.5 text-xs font-bold text-on-primary">
            <Sparkles className="h-3 w-3" />
            {zh ? "最划算" : "Most Popular"}
          </span>
          <h2 className="text-lg font-bold text-ink">
            {zh ? "All-Access Studio 全通包" : "All-Access Studio Pro"}
          </h2>
          <p className="mt-1 text-xs text-ink-mute">
            {zh ? "一次性买断全站成品包" : "One-time buyout · Everything included"}
          </p>
          <div className="mt-4 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-ink">
              {PRICING_PLANS.pro_all_access.priceDisplay}
            </span>
            <span className="text-xs text-ink-mute">
              {zh ? "买断" : "once"}
            </span>
          </div>
          <ul className="mt-6 flex-1 space-y-2.5 text-sm text-ink-dim">
            <li className="flex items-start gap-2.5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              <span>
                {zh
                  ? "编辑器无限导出原生 .rbxmx 实例树与 Studio ZIP"
                  : "Unlimited native .rbxmx model & Studio ZIP exports"}
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              <span>
                {zh
                  ? "解锁全部 6 套热门品类 UI Kit（Simulator、RPG、Tycoon、RNG、Obby、塔防，共 30 个界面）"
                  : "All 6 genre UI Kits (Simulator, RPG, Tycoon, RNG Aura, Obby, Tower Defense — 30 screens total)"}
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              <span>
                {zh
                  ? "全部 48 枚 512×512 Gamepass 与商店矢量图标包 + 商店 .rbxmx"
                  : "Complete 48-icon 512×512 Gamepass & Shop badge pack + Game Pass Shop .rbxmx"}
              </span>
            </li>
          </ul>
          <button
            type="button"
            onClick={() => void beginPlanCheckout("pro_all_access")}
            disabled={loadingPlan !== null}
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-on-primary transition hover:brightness-110 disabled:opacity-50"
          >
            {loadingPlan === "pro_all_access"
              ? zh
                ? "正在跳转 Stripe…"
                : "Redirecting…"
              : zh
                ? `解锁全通包 (${PRICING_PLANS.pro_all_access.priceDisplay})`
                : `Unlock All-Access (${PRICING_PLANS.pro_all_access.priceDisplay})`}
          </button>
        </div>
      </div>
    </div>
  );
}
