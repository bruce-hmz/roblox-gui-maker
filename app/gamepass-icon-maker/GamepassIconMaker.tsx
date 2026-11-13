"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Download, Layers, Sparkles } from "lucide-react";
import { ProUpgradeModal } from "../components/ProUpgradeModal";
import {
  GAMEPASS_ICON_PRESETS,
  renderGamepassIconSvg,
  type GamepassEmblem,
  type GamepassIconShape,
  type GamepassIconSpec,
  type GamepassRimStyle,
} from "../editor/gamepass-icons";
import type { Locale } from "../i18n";
import { triggerKitBundleDownload } from "../lib/pro-client";
import { trackEvent } from "../lib/track";

const EMBLEM_OPTIONS: Array<{ value: GamepassEmblem; labelEn: string; labelZh: string }> = [
  { value: "crown", labelEn: "Crown", labelZh: "皇冠" },
  { value: "coins", labelEn: "Coins", labelZh: "金币" },
  { value: "lightning", labelEn: "Lightning", labelZh: "闪电" },
  { value: "clover", labelEn: "Clover", labelZh: "幸运草" },
  { value: "gem", labelEn: "Gem", labelZh: "宝石" },
  { value: "egg", labelEn: "Egg", labelZh: "宠物蛋" },
  { value: "shield", labelEn: "Shield", labelZh: "盾牌" },
  { value: "sword", labelEn: "Sword", labelZh: "长剑" },
  { value: "gift", labelEn: "Gift", labelZh: "礼包" },
  { value: "star", labelEn: "Star", labelZh: "星标" },
  { value: "rocket", labelEn: "Rocket", labelZh: "火箭" },
  { value: "skull", labelEn: "Skull", labelZh: "骷髅" },
];

const RIM_OPTIONS: Array<{ value: GamepassRimStyle; labelEn: string; labelZh: string; swatch: string }> = [
  { value: "gold", labelEn: "Gold", labelZh: "皇家金", swatch: "#f2b53c" },
  { value: "cyber", labelEn: "Cyber", labelZh: "霓虹蓝", swatch: "#39dbeb" },
  { value: "emerald", labelEn: "Emerald", labelZh: "翡翠绿", swatch: "#2fd398" },
  { value: "royal", labelEn: "Royal", labelZh: "星耀紫", swatch: "#c084fc" },
  { value: "crimson", labelEn: "Crimson", labelZh: "绯红", swatch: "#fb7185" },
  { value: "obsidian", labelEn: "Obsidian", labelZh: "黑曜石", swatch: "#9aa7b8" },
];

function buildSafeBadgeSlug(titleTop: string, titleBottom: string): string {
  const combined = `${titleTop} ${titleBottom}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return combined || "roblox-gamepass-icon";
}

export function GamepassIconMaker({ locale = "en" }: { locale?: Locale }) {
  const zh = locale === "zh";
  const initialPreset = GAMEPASS_ICON_PRESETS[0]!;

  const [activePresetId, setActivePresetId] = useState<string>(initialPreset.id);
  const [titleTopInput, setTitleTopInput] = useState<string>(initialPreset.titleTop);
  const [titleBottomInput, setTitleBottomInput] = useState<string>(
    initialPreset.titleBottom ?? ""
  );
  const [emblem, setEmblem] = useState<GamepassEmblem>(initialPreset.emblem);
  const [rim, setRim] = useState<GamepassRimStyle>(initialPreset.rim);
  const [primaryColor, setPrimaryColor] = useState<string>(initialPreset.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState<string>(
    initialPreset.secondaryColor
  );
  const [shape, setShape] = useState<GamepassIconShape>(initialPreset.shape);
  const [sunburst, setSunburst] = useState<boolean>(initialPreset.sunburst);
  const [glow, setGlow] = useState<boolean>(initialPreset.glow);

  const [exportingPng, setExportingPng] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [downloadingPack, setDownloadingPack] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const normalizedTop = titleTopInput.trim() || "VIP";
  const normalizedBottom = titleBottomInput.trim();
  const safePrimary = /^#[0-9a-f]{6}$/i.test(primaryColor) ? primaryColor : "#f5a524";
  const safeSecondary = /^#[0-9a-f]{6}$/i.test(secondaryColor)
    ? secondaryColor
    : "#5c3a08";

  const activeSpec: GamepassIconSpec = useMemo(
    () => ({
      id: buildSafeBadgeSlug(normalizedTop, normalizedBottom),
      titleTop: normalizedTop,
      ...(normalizedBottom ? { titleBottom: normalizedBottom } : {}),
      emblem,
      rim,
      primaryColor: safePrimary,
      secondaryColor: safeSecondary,
      shape,
      sunburst,
      glow,
    }),
    [
      normalizedTop,
      normalizedBottom,
      emblem,
      rim,
      safePrimary,
      safeSecondary,
      shape,
      sunburst,
      glow,
    ]
  );

  const svgMarkup = useMemo(() => renderGamepassIconSvg(activeSpec), [activeSpec]);
  const svgPreviewUri = useMemo(
    () => `data:image/svg+xml;utf8,${encodeURIComponent(svgMarkup)}`,
    [svgMarkup]
  );

  function applyPreset(preset: GamepassIconSpec) {
    setActivePresetId(preset.id);
    setTitleTopInput(preset.titleTop);
    setTitleBottomInput(preset.titleBottom ?? "");
    setEmblem(preset.emblem);
    setRim(preset.rim);
    setPrimaryColor(preset.primaryColor);
    setSecondaryColor(preset.secondaryColor);
    setShape(preset.shape);
    setSunburst(preset.sunburst);
    setGlow(preset.glow);
    setExportError(null);
  }

  function downloadBadgeSvg() {
    const svgBlob = new Blob([svgMarkup], {
      type: "image/svg+xml;charset=utf-8",
    });
    const downloadUrl = URL.createObjectURL(svgBlob);
    const anchor = document.createElement("a");
    anchor.href = downloadUrl;
    anchor.download = `${activeSpec.id}-512x512.svg`;
    trackEvent("export_gamepass_icon", { format: "svg", emblem, rim });
    anchor.click();
    URL.revokeObjectURL(downloadUrl);
  }

  async function downloadBadgePng() {
    if (exportingPng) return;
    setExportingPng(true);
    setExportError(null);

    try {
      const svgBlob = new Blob([svgMarkup], {
        type: "image/svg+xml;charset=utf-8",
      });
      const svgObjectUrl = URL.createObjectURL(svgBlob);

      const pngBlob = await new Promise<Blob>((resolve, reject) => {
        const badgeImage = new Image();
        badgeImage.onload = () => {
          URL.revokeObjectURL(svgObjectUrl);
          const canvas = document.createElement("canvas");
          canvas.width = 512;
          canvas.height = 512;
          const context = canvas.getContext("2d");
          if (!context) {
            reject(new Error("Canvas 2D context is unavailable in this browser."));
            return;
          }
          context.clearRect(0, 0, 512, 512);
          context.drawImage(badgeImage, 0, 0, 512, 512);
          canvas.toBlob((renderedBlob) => {
            if (!renderedBlob) {
              reject(new Error("Could not encode 512x512 PNG blob."));
              return;
            }
            resolve(renderedBlob);
          }, "image/png");
        };
        badgeImage.onerror = () => {
          URL.revokeObjectURL(svgObjectUrl);
          reject(new Error("Failed to rasterize SVG badge into 512x512 PNG."));
        };
        badgeImage.src = svgObjectUrl;
      });

      const pngDownloadUrl = URL.createObjectURL(pngBlob);
      const anchor = document.createElement("a");
      anchor.href = pngDownloadUrl;
      anchor.download = `${activeSpec.id}-512x512.png`;
      trackEvent("export_gamepass_icon", { format: "png", emblem, rim });
      anchor.click();
      URL.revokeObjectURL(pngDownloadUrl);
    } catch (error) {
      setExportError(
        error instanceof Error && error.message
          ? error.message
          : zh
            ? "生成 512×512 PNG 失败，请重试。"
            : "Could not render 512×512 PNG. Please try again."
      );
    } finally {
      setExportingPng(false);
    }
  }

  async function downloadAllIconsPack() {
    if (downloadingPack) return;
    setDownloadingPack(true);
    setExportError(null);
    trackEvent("icon_pack_pro_click", { locale });

    try {
      const outcome = await triggerKitBundleDownload("all-icons");
      if (!outcome.ok) {
        if (outcome.unauthorized) {
          setUpgradeOpen(true);
        } else {
          setExportError(outcome.message);
        }
      }
    } catch (error) {
      setExportError(
        error instanceof Error && error.message
          ? error.message
          : zh
            ? "下载图标包失败，请重试。"
            : "Pack download failed. Please try again."
      );
    } finally {
      setDownloadingPack(false);
    }
  }

  const returnPath = zh ? "/zh/gamepass-icon-maker" : "/gamepass-icon-maker";

  return (
    <>
      <div className="space-y-8">
        {/* Preset Picker */}
        <section className="rounded-2xl border border-line bg-panel p-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-dim">
              {zh
                ? "1. 选择高转化 Gamepass 预设（一键改字改色）"
                : "1. Pick a High-Converting Gamepass Preset"}
            </h2>
            <span className="text-xs text-ink-mute">512 × 512 px · Transparent PNG</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-2">
            {GAMEPASS_ICON_PRESETS.map((preset) => {
              const presetSvg = renderGamepassIconSvg(preset);
              const selected = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className={`flex flex-col items-center gap-1 rounded-xl border p-2 transition ${
                    selected
                      ? "border-focus bg-raised ring-1 ring-focus"
                      : "border-line bg-surface hover:border-ink-mute"
                  }`}
                >
                  <img
                    src={`data:image/svg+xml;utf8,${encodeURIComponent(presetSvg)}`}
                    alt={preset.titleTop}
                    width={48}
                    height={48}
                    className="h-11 w-11 select-none"
                  />
                  <span className="w-full truncate text-center text-[10px] font-semibold text-ink-dim">
                    {preset.titleTop}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Controls + Live Preview */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Controls */}
          <div className="lg:col-span-7 rounded-2xl border border-line bg-panel p-6 space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-dim">
              {zh ? "2. 自定义徽章文案、徽记与金属边框" : "2. Customize Text, Emblem & Metallic Rim"}
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="badge-title-top"
                  className="block text-xs font-medium text-ink-dim mb-1.5"
                >
                  {zh ? "主标题（建议 3–10 字符）" : "Main Title (3–10 chars recommended)"}
                </label>
                <input
                  id="badge-title-top"
                  type="text"
                  maxLength={14}
                  value={titleTopInput}
                  onChange={(event) => setTitleTopInput(event.target.value.toUpperCase())}
                  placeholder="VIP"
                  className="w-full rounded-lg border border-line bg-input px-3 py-2 text-sm font-semibold text-ink focus:border-focus focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="badge-title-bottom"
                  className="block text-xs font-medium text-ink-dim mb-1.5"
                >
                  {zh ? "副标题（可选，如 PACK / BOOST）" : "Subtitle (optional, e.g. PACK / HATCH)"}
                </label>
                <input
                  id="badge-title-bottom"
                  type="text"
                  maxLength={14}
                  value={titleBottomInput}
                  onChange={(event) =>
                    setTitleBottomInput(event.target.value.toUpperCase())
                  }
                  placeholder={zh ? "留空仅显示单行" : "Optional second line"}
                  className="w-full rounded-lg border border-line bg-input px-3 py-2 text-sm font-semibold text-ink focus:border-focus focus:outline-none"
                />
              </div>
            </div>

            <div>
              <span className="block text-xs font-medium text-ink-dim mb-2">
                {zh ? "徽记图形（Emblem）" : "Center Emblem"}
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {EMBLEM_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setEmblem(option.value)}
                    className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
                      emblem === option.value
                        ? "border-focus bg-raised text-ink"
                        : "border-line bg-surface text-ink-dim hover:text-ink"
                    }`}
                  >
                    {zh ? option.labelZh : option.labelEn}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-xs font-medium text-ink-dim mb-2">
                {zh ? "金属外圈（Rim Style）" : "Metallic Rim"}
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {RIM_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRim(option.value)}
                    className={`flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
                      rim === option.value
                        ? "border-focus bg-raised text-ink"
                        : "border-line bg-surface text-ink-dim hover:text-ink"
                    }`}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: option.swatch }}
                    />
                    {zh ? option.labelZh : option.labelEn}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <span className="block text-xs font-medium text-ink-dim mb-1.5">
                  {zh ? "徽章形状" : "Badge Shape"}
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShape("circle")}
                    className={`rounded-lg border px-2 py-1.5 text-xs font-medium transition ${
                      shape === "circle"
                        ? "border-focus bg-raised text-ink"
                        : "border-line bg-surface text-ink-dim"
                    }`}
                  >
                    {zh ? "圆形 Pass" : "Circle Pass"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShape("rounded-square")}
                    className={`rounded-lg border px-2 py-1.5 text-xs font-medium transition ${
                      shape === "rounded-square"
                        ? "border-focus bg-raised text-ink"
                        : "border-line bg-surface text-ink-dim"
                    }`}
                  >
                    {zh ? "圆角商店卡" : "Shop Tile"}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="badge-primary-color"
                  className="block text-xs font-medium text-ink-dim mb-1.5"
                >
                  {zh ? "高光主色" : "Primary Glow Color"}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="badge-primary-color"
                    type="color"
                    value={safePrimary}
                    onChange={(event) => setPrimaryColor(event.target.value)}
                    className="h-9 w-12 cursor-pointer rounded border border-line bg-input p-0.5"
                  />
                  <span className="font-mono text-xs text-ink-dim uppercase">
                    {safePrimary}
                  </span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="badge-secondary-color"
                  className="block text-xs font-medium text-ink-dim mb-1.5"
                >
                  {zh ? "深色底调" : "Deep Base Color"}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="badge-secondary-color"
                    type="color"
                    value={safeSecondary}
                    onChange={(event) => setSecondaryColor(event.target.value)}
                    className="h-9 w-12 cursor-pointer rounded border border-line bg-input p-0.5"
                  />
                  <span className="font-mono text-xs text-ink-dim uppercase">
                    {safeSecondary}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-5 pt-1">
              <label className="inline-flex items-center gap-2 text-xs font-medium text-ink cursor-pointer">
                <input
                  type="checkbox"
                  checked={sunburst}
                  onChange={(event) => setSunburst(event.target.checked)}
                  className="h-4 w-4 rounded border-line accent-primary"
                />
                {zh ? "放射光芒（Sunburst Rays）" : "Sunburst Rays"}
              </label>
              <label className="inline-flex items-center gap-2 text-xs font-medium text-ink cursor-pointer">
                <input
                  type="checkbox"
                  checked={glow}
                  onChange={(event) => setGlow(event.target.checked)}
                  className="h-4 w-4 rounded border-line accent-primary"
                />
                {zh ? "外圈光晕（Outer Rim Halo）" : "Outer Rim Halo"}
              </label>
            </div>
          </div>

          {/* Live Preview & Export */}
          <div className="lg:col-span-5 rounded-2xl border border-line bg-panel p-6 flex flex-col justify-between gap-5">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-dim">
                  {zh ? "实时 512×512 透明底预览" : "Live 512×512 Transparent Preview"}
                </span>
                <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-[11px] font-semibold text-success">
                  {zh ? "无水印 · 免费导出" : "Zero Watermark · Free"}
                </span>
              </div>

              <div className="grid place-items-center rounded-2xl border border-line bg-[radial-gradient(#262b38_1px,transparent_1px)] [background-size:14px_14px] bg-surface p-6">
                <img
                  src={svgPreviewUri}
                  alt={`${normalizedTop} Roblox Gamepass icon preview`}
                  width={220}
                  height={220}
                  className="h-52 w-52 select-none drop-shadow-2xl"
                />
              </div>

              {/* Simulated Roblox Store Pass Card */}
              <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-line bg-surface p-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={svgPreviewUri}
                    alt=""
                    aria-hidden
                    width={44}
                    height={44}
                    className="h-11 w-11 shrink-0 rounded-full"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-ink">
                      {normalizedTop}
                      {normalizedBottom ? ` ${normalizedBottom}` : ""} Pass
                    </p>
                    <p className="text-[11px] text-ink-mute">
                      {zh ? "Roblox 商店列表缩放效果预览" : "Roblox Store 44px Pass Tile Check"}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-lg bg-success/20 px-3 py-1 text-xs font-bold text-success">
                  R$ 199
                </span>
              </div>
            </div>

            {exportError && (
              <p role="alert" className="text-xs text-danger">
                {exportError}
              </p>
            )}

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => void downloadBadgePng()}
                disabled={exportingPng}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-on-primary transition hover:brightness-110 disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                {exportingPng
                  ? zh
                    ? "正在渲染 512×512 PNG…"
                    : "Rendering 512×512 PNG…"
                  : zh
                    ? "免费下载 512×512 PNG（直接上传 Roblox）"
                    : "Download Free 512×512 PNG"}
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={downloadBadgeSvg}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-2 text-xs font-semibold text-ink transition hover:border-focus"
                >
                  <Download className="h-3.5 w-3.5" />
                  {zh ? "下载矢量 SVG" : "Download Vector SVG"}
                </button>
                <Link
                  href="/editor?template=game-pass-shop"
                  className="inline-flex items-center justify-center rounded-xl border border-line bg-surface px-3 py-2 text-xs font-semibold text-focus transition hover:border-focus"
                >
                  {zh ? "编辑商店 GUI →" : "Open Shop GUI →"}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Pro 48-Icon + Shop .rbxmx Upsell */}
        <section className="rounded-2xl border border-line bg-panel p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-0.5 text-xs font-semibold text-focus">
              <Sparkles className="h-3.5 w-3.5" />
              {zh ? "Studio 全通包交付物" : "All-Access Studio Deliverable"}
            </span>
            <h2 className="text-xl font-bold text-ink">
              {zh
                ? "一次性打包下载全部 48 枚 Gamepass 图标 + 原生 Game Pass 商店 .rbxmx"
                : "Need Every Pass & Shop Badge Ready at Once? Grab All 48 Icons + Shop .rbxmx"}
            </h2>
            <p className="text-sm text-ink-dim">
              {zh
                ? "包含 12 枚通用高转化预设 + 36 枚按 Simulator / RPG / Tycoon / RNG / Obby / 塔防配好色的套装徽章，外加可直接拖进 StarterGui 的 Game Pass 商店 .rbxmx 模型与全部 6 套多界面 UI Kit。"
                : "Includes all 12 universal pass presets + 36 genre-matched badges (Simulator, RPG, Tycoon, RNG Aura, Obby, Tower Defense), a ready-to-import Game Pass Shop .rbxmx model, and all 6 multi-screen UI Kits."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void downloadAllIconsPack()}
            disabled={downloadingPack}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-focus bg-raised px-5 py-3 text-sm font-semibold text-ink transition hover:bg-raised-hi disabled:opacity-50"
          >
            <Layers className="h-4 w-4 text-focus" />
            {downloadingPack
              ? zh
                ? "正在准备 48 枚图标包…"
                : "Preparing 48-Icon ZIP…"
              : zh
                ? "下载全部 48 枚图标 + 商店 .rbxmx"
                : "Download All 48 Icons + Shop .rbxmx"}
          </button>
        </section>
      </div>

      <ProUpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        contextTitle={
          zh
            ? "解锁全部 48 枚 Gamepass 图标包 + 全站 6 套 Studio .rbxmx Kit"
            : "Unlock All 48 Gamepass Icons + Game Pass Shop .rbxmx"
        }
        defaultPlan="pro_all_access"
        returnPath={returnPath}
        locale={locale}
      />
    </>
  );
}
