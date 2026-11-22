"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Download, Eye, Image as ImageIcon, Layers, Sparkles, Upload } from "lucide-react";
import { ProUpgradeModal } from "../../components/ProUpgradeModal";
import type { Locale } from "../../i18n";
import { trackEvent } from "../../lib/track";
import {
  GAME_ICON_SIZE,
  ROBLOX_SAFE_ZONES,
  THUMBNAIL_HEIGHT,
  THUMBNAIL_PRESETS,
  THUMBNAIL_WIDTH,
  buildThumbnailFilename,
  computeIconCropRect,
} from "./thumbnail-spec";

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Could not read file."));
    };
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load image."));
    img.src = src;
  });
}

export function ThumbnailMaker({ locale = "en" }: { locale?: Locale }) {
  const zh = locale === "zh";
  const initial = THUMBNAIL_PRESETS[0]!;

  const [presetId, setPresetId] = useState(initial.id);
  const [bgStart, setBgStart] = useState(initial.bgStart);
  const [bgEnd, setBgEnd] = useState(initial.bgEnd);
  const [accentColor, setAccentColor] = useState(initial.accentColor);
  const [headlineTop, setHeadlineTop] = useState(initial.headlineTop);
  const [headlineBottom, setHeadlineBottom] = useState(initial.headlineBottom);
  const [subtitle, setSubtitle] = useState(initial.subtitle);
  const [badgeText, setBadgeText] = useState(initial.badgeText);
  const [sunburst, setSunburst] = useState(initial.sunburst);
  const [darkenBg, setDarkenBg] = useState(0.32);
  const [bgZoom, setBgZoom] = useState(1);
  const [showSafeZones, setShowSafeZones] = useState(true);

  const [bgImageDataUrl, setBgImageDataUrl] = useState<string | null>(null);
  const [assetIdInput, setAssetIdInput] = useState("");
  const [loadingAsset, setLoadingAsset] = useState(false);
  const [assetError, setAssetError] = useState<string | null>(null);

  const [preview16x9Url, setPreview16x9Url] = useState<string | null>(null);
  const [previewIconUrl, setPreviewIconUrl] = useState<string | null>(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  function applyPreset(p: (typeof THUMBNAIL_PRESETS)[number]) {
    setPresetId(p.id);
    setBgStart(p.bgStart);
    setBgEnd(p.bgEnd);
    setAccentColor(p.accentColor);
    setHeadlineTop(p.headlineTop);
    setHeadlineBottom(p.headlineBottom);
    setSubtitle(p.subtitle);
    setBadgeText(p.badgeText);
    setSunburst(p.sunburst);
  }

  async function handleUploadBackground(file: File) {
    setAssetError(null);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setBgImageDataUrl(dataUrl);
    } catch {
      setAssetError(
        zh ? "无法读取上传图片，请检查格式。" : "Could not read background image."
      );
    }
  }

  async function handleFetchAssetBackground() {
    const cleanId = assetIdInput.replace(/[^0-9]/g, "");
    if (!cleanId) {
      setAssetError(
        zh ? "请输入有效的数字 Asset ID。" : "Enter a valid numeric Roblox Asset ID."
      );
      return;
    }
    setLoadingAsset(true);
    setAssetError(null);
    try {
      const res = await fetch(`/api/roblox-thumbnail?assetId=${encodeURIComponent(cleanId)}`);
      const payload = (await res.json().catch(() => null)) as {
        imageUrl?: string | null;
        error?: string;
      } | null;
      if (!res.ok || !payload?.imageUrl) {
        setAssetError(
          payload?.error ??
            (zh ? "未找到该 Asset ID 缩略图。" : "No thumbnail returned for that Asset ID.")
        );
        return;
      }
      setBgImageDataUrl(payload.imageUrl);
    } catch {
      setAssetError(zh ? "加载 Roblox 素材失败。" : "Failed to fetch Roblox asset preview.");
    } finally {
      setLoadingAsset(false);
    }
  }

  // Render clean 1920x1080 composition + centered 512x512 icon crop
  useEffect(() => {
    let cancelled = false;
    async function renderScene() {
      const canvas = document.createElement("canvas");
      canvas.width = THUMBNAIL_WIDTH;
      canvas.height = THUMBNAIL_HEIGHT;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Base studio gradient
      const grad = ctx.createLinearGradient(0, 0, THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT);
      grad.addColorStop(0, bgStart);
      grad.addColorStop(1, bgEnd);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT);

      // Optional uploaded / asset background
      if (bgImageDataUrl) {
        try {
          const img = await loadImage(bgImageDataUrl);
          if (cancelled) return;
          const coverScale =
            Math.max(THUMBNAIL_WIDTH / img.width, THUMBNAIL_HEIGHT / img.height) * bgZoom;
          const drawW = img.width * coverScale;
          const drawH = img.height * coverScale;
          const dx = (THUMBNAIL_WIDTH - drawW) / 2;
          const dy = (THUMBNAIL_HEIGHT - drawH) / 2;
          ctx.drawImage(img, dx, dy, drawW, drawH);
        } catch {
          // keep gradient backdrop if external image blocks canvas
        }
      }

      // Optional sunburst rays
      if (sunburst) {
        ctx.save();
        ctx.translate(THUMBNAIL_WIDTH / 2, THUMBNAIL_HEIGHT / 2);
        const rays = 18;
        ctx.fillStyle = accentColor;
        ctx.globalAlpha = 0.09;
        for (let i = 0; i < rays; i++) {
          const a0 = (i * 2 * Math.PI) / rays;
          const a1 = a0 + Math.PI / rays;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(a0) * 1400, Math.sin(a0) * 1400);
          ctx.lineTo(Math.cos(a1) * 1400, Math.sin(a1) * 1400);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      // Dark contrast vignette so text always pops at Discover card size
      if (darkenBg > 0) {
        const rad = ctx.createRadialGradient(
          THUMBNAIL_WIDTH / 2,
          THUMBNAIL_HEIGHT / 2,
          240,
          THUMBNAIL_WIDTH / 2,
          THUMBNAIL_HEIGHT / 2,
          1200
        );
        rad.addColorStop(0, `rgba(7, 10, 18, ${Math.max(0.08, darkenBg * 0.45)})`);
        rad.addColorStop(1, `rgba(7, 10, 18, ${Math.min(0.85, darkenBg + 0.25)})`);
        ctx.fillStyle = rad;
        ctx.fillRect(0, 0, THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT);
      }

      // Accent border glow inside canvas
      ctx.strokeStyle = accentColor;
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 10;
      ctx.strokeRect(20, 20, THUMBNAIL_WIDTH - 40, THUMBNAIL_HEIGHT - 40);
      ctx.globalAlpha = 1;

      // Top-left update badge pill
      const badge = badgeText.trim().slice(0, 12);
      if (badge) {
        ctx.save();
        ctx.font = "900 46px Inter, Arial, sans-serif";
        const bw = ctx.measureText(badge).width + 64;
        ctx.fillStyle = accentColor;
        ctx.beginPath();
        ctx.roundRect(108, 76, bw, 76, 20);
        ctx.fill();
        ctx.fillStyle = "#090c14";
        ctx.textBaseline = "middle";
        ctx.fillText(badge, 140, 116);
        ctx.restore();
      }

      // Bold two-line headline centered inside 1:1 crop safe zone
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineJoin = "round";

      const topLine = headlineTop.trim().slice(0, 22);
      const bottomLine = headlineBottom.trim().slice(0, 22);
      const centerY = bottomLine ? 450 : 515;

      if (topLine) {
        ctx.font = "900 132px Inter, Arial, sans-serif";
        ctx.lineWidth = 24;
        ctx.strokeStyle = "#090c14";
        ctx.strokeText(topLine, THUMBNAIL_WIDTH / 2, centerY);
        ctx.fillStyle = "#ffffff";
        ctx.fillText(topLine, THUMBNAIL_WIDTH / 2, centerY);
      }

      if (bottomLine) {
        ctx.font = "900 138px Inter, Arial, sans-serif";
        ctx.lineWidth = 26;
        ctx.strokeStyle = "#090c14";
        ctx.strokeText(bottomLine, THUMBNAIL_WIDTH / 2, centerY + 148);
        ctx.fillStyle = accentColor;
        ctx.fillText(bottomLine, THUMBNAIL_WIDTH / 2, centerY + 148);
      }

      const sub = subtitle.trim().slice(0, 40);
      if (sub) {
        ctx.font = "800 44px Inter, Arial, sans-serif";
        const sw = Math.min(1260, ctx.measureText(sub).width + 80);
        const sy = bottomLine ? 738 : 668;
        ctx.fillStyle = "rgba(12, 14, 23, 0.86)";
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(THUMBNAIL_WIDTH / 2 - sw / 2, sy - 42, sw, 84, 22);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#f8fafc";
        ctx.fillText(sub, THUMBNAIL_WIDTH / 2, sy + 2);
      }
      ctx.restore();

      const fullUrl = canvas.toDataURL("image/png");
      if (cancelled) return;
      setPreview16x9Url(fullUrl);

      // Extract centered 512x512 Game Icon
      const iconCanvas = document.createElement("canvas");
      iconCanvas.width = GAME_ICON_SIZE;
      iconCanvas.height = GAME_ICON_SIZE;
      const ictx = iconCanvas.getContext("2d");
      if (ictx) {
        const crop = computeIconCropRect();
        ictx.drawImage(
          canvas,
          crop.x,
          crop.y,
          crop.size,
          crop.size,
          0,
          0,
          GAME_ICON_SIZE,
          GAME_ICON_SIZE
        );
        if (!cancelled) setPreviewIconUrl(iconCanvas.toDataURL("image/png"));
      }
    }
    void renderScene();
    return () => {
      cancelled = true;
    };
  }, [
    bgStart,
    bgEnd,
    accentColor,
    headlineTop,
    headlineBottom,
    subtitle,
    badgeText,
    sunburst,
    darkenBg,
    bgZoom,
    bgImageDataUrl,
  ]);

  function exportPng(variant: "1920x1080" | "512x512") {
    const dataUrl = variant === "1920x1080" ? preview16x9Url : previewIconUrl;
    if (!dataUrl) return;
    trackEvent("export_thumbnail", { variant, presetId });
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = buildThumbnailFilename(`${headlineTop} ${headlineBottom}`, variant);
    a.click();
  }

  const iconCrop = computeIconCropRect();

  return (
    <>
      <div className="space-y-8">
        {/* Preset Selector */}
        <section className="rounded-2xl border border-line bg-panel p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-dim">
              {zh ? "1. 选择热门 Roblox 游戏封面预设" : "1. Pick a Genre Thumbnail Preset"}
            </h2>
            <span className="text-xs text-ink-mute">
              1920×1080 px (16:9) + 512×512 px Game Icon
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {THUMBNAIL_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`rounded-xl border p-3 text-left transition ${
                  presetId === preset.id
                    ? "border-focus bg-raised ring-1 ring-focus"
                    : "border-line bg-surface hover:border-ink-mute"
                }`}
              >
                <div
                  className="mb-2 h-8 w-full rounded-md border border-white/10"
                  style={{
                    background: `linear-gradient(135deg, ${preset.bgStart}, ${preset.bgEnd})`,
                  }}
                />
                <p className="text-xs font-semibold text-ink truncate">
                  {zh ? preset.nameZh : preset.nameEn}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Main Workspace */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Controls */}
          <section className="lg:col-span-5 rounded-2xl border border-line bg-panel p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-dim">
              {zh ? "2. 自定义文案、底图与安全区" : "2. Customize Headlines, Backdrop & Safe Zones"}
            </h2>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-xs">
                <span className="text-ink-dim font-medium block mb-1">
                  {zh ? "主标题第一行" : "Headline Top"}
                </span>
                <input
                  type="text"
                  maxLength={22}
                  value={headlineTop}
                  onChange={(e) => setHeadlineTop(e.target.value.toUpperCase())}
                  className="w-full rounded-lg border border-line bg-input px-3 py-2 text-xs font-semibold text-ink focus:border-focus focus:outline-none"
                />
              </label>
              <label className="block text-xs">
                <span className="text-ink-dim font-medium block mb-1">
                  {zh ? "主标题第二行" : "Headline Bottom"}
                </span>
                <input
                  type="text"
                  maxLength={22}
                  value={headlineBottom}
                  onChange={(e) => setHeadlineBottom(e.target.value.toUpperCase())}
                  className="w-full rounded-lg border border-line bg-input px-3 py-2 text-xs font-semibold text-ink focus:border-focus focus:outline-none"
                />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <label className="block text-xs sm:col-span-2">
                <span className="text-ink-dim font-medium block mb-1">
                  {zh ? "卖点副标题条" : "Subtitle Pill"}
                </span>
                <input
                  type="text"
                  maxLength={40}
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value.toUpperCase())}
                  className="w-full rounded-lg border border-line bg-input px-3 py-2 text-xs font-semibold text-ink focus:border-focus focus:outline-none"
                />
              </label>
              <label className="block text-xs">
                <span className="text-ink-dim font-medium block mb-1">
                  {zh ? "左上角标" : "Corner Badge"}
                </span>
                <input
                  type="text"
                  maxLength={12}
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value.toUpperCase())}
                  placeholder="UPD"
                  className="w-full rounded-lg border border-line bg-input px-3 py-2 text-xs font-semibold text-ink focus:border-focus focus:outline-none"
                />
              </label>
            </div>

            <div className="grid gap-3 grid-cols-3">
              <label className="block text-xs">
                <span className="text-ink-dim font-medium block mb-1">
                  {zh ? "背景渐变起" : "BG Start"}
                </span>
                <input
                  type="color"
                  value={bgStart}
                  onChange={(e) => setBgStart(e.target.value)}
                  className="h-9 w-full cursor-pointer rounded-lg border border-line bg-input p-1"
                />
              </label>
              <label className="block text-xs">
                <span className="text-ink-dim font-medium block mb-1">
                  {zh ? "背景渐变止" : "BG End"}
                </span>
                <input
                  type="color"
                  value={bgEnd}
                  onChange={(e) => setBgEnd(e.target.value)}
                  className="h-9 w-full cursor-pointer rounded-lg border border-line bg-input p-1"
                />
              </label>
              <label className="block text-xs">
                <span className="text-ink-dim font-medium block mb-1">
                  {zh ? "高亮色" : "Accent"}
                </span>
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="h-9 w-full cursor-pointer rounded-lg border border-line bg-input p-1"
                />
              </label>
            </div>

            {/* Backdrop Upload or Asset ID */}
            <div className="rounded-xl border border-line bg-surface p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-ink flex items-center gap-1.5">
                  <ImageIcon className="h-3.5 w-3.5 text-focus" />
                  {zh ? "游戏截图 / GFX 底图（可选）" : "Custom Screenshot / GFX Backdrop"}
                </span>
                {bgImageDataUrl && (
                  <button
                    type="button"
                    onClick={() => setBgImageDataUrl(null)}
                    className="text-[11px] text-ink-mute hover:text-ink underline"
                  >
                    {zh ? "移除底图" : "Remove"}
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-line bg-raised px-3 py-1.5 text-xs font-semibold text-ink hover:border-focus transition">
                  <Upload className="h-3.5 w-3.5 text-focus" />
                  {zh ? "上传截图 PNG/JPG" : "Upload Screenshot"}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleUploadBackground(file);
                    }}
                  />
                </label>

                <div className="flex flex-1 min-w-[180px] gap-1.5">
                  <input
                    type="text"
                    value={assetIdInput}
                    onChange={(e) => setAssetIdInput(e.target.value)}
                    placeholder={zh ? "或输入 Roblox Asset ID" : "Or Roblox Asset ID"}
                    className="w-full rounded-lg border border-line bg-input px-2.5 py-1.5 text-xs text-ink focus:border-focus focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => void handleFetchAssetBackground()}
                    disabled={loadingAsset}
                    className="shrink-0 rounded-lg border border-line bg-raised px-2.5 py-1.5 text-xs font-medium text-ink hover:border-focus disabled:opacity-50"
                  >
                    {loadingAsset ? "…" : zh ? "载入" : "Load"}
                  </button>
                </div>
              </div>
              {assetError && <p className="text-[11px] text-danger">{assetError}</p>}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <label className="flex items-center justify-between gap-2">
                <span className="text-ink-dim">{zh ? "暗角压暗:" : "Vignette:"}</span>
                <input
                  type="range"
                  min={0}
                  max={0.75}
                  step={0.05}
                  value={darkenBg}
                  onChange={(e) => setDarkenBg(Number(e.target.value))}
                  className="w-28 accent-[#00a2ff]"
                />
              </label>
              <label className="flex items-center justify-between gap-2">
                <span className="text-ink-dim">{zh ? "底图缩放:" : "Backdrop Zoom:"}</span>
                <input
                  type="range"
                  min={1}
                  max={1.8}
                  step={0.05}
                  value={bgZoom}
                  onChange={(e) => setBgZoom(Number(e.target.value))}
                  className="w-28 accent-[#00a2ff]"
                />
              </label>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <label className="flex items-center gap-2 text-xs text-ink-dim cursor-pointer">
                <input
                  type="checkbox"
                  checked={showSafeZones}
                  onChange={(e) => setShowSafeZones(e.target.checked)}
                  className="accent-[#00a2ff]"
                />
                {zh ? "显示 Discover 遮挡与 1:1 裁切线" : "Show Discover & 1:1 Icon Safe Zones"}
              </label>
              <label className="flex items-center gap-2 text-xs text-ink-dim cursor-pointer">
                <input
                  type="checkbox"
                  checked={sunburst}
                  onChange={(e) => setSunburst(e.target.checked)}
                  className="accent-[#00a2ff]"
                />
                {zh ? "放射射线" : "Sunburst Rays"}
              </label>
            </div>

            <div className="flex flex-wrap gap-2.5 pt-2 border-t border-line">
              <button
                type="button"
                onClick={() => exportPng("1920x1080")}
                disabled={!preview16x9Url}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary hover:brightness-110 transition disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                {zh ? "导出 1920×1080 封面 PNG" : "Export 1920×1080 PNG"}
              </button>
              <button
                type="button"
                onClick={() => exportPng("512x512")}
                disabled={!previewIconUrl}
                className="inline-flex items-center gap-2 rounded-xl border border-focus/60 bg-raised px-4 py-2.5 text-xs font-semibold text-ink hover:border-focus transition disabled:opacity-50"
              >
                <Download className="h-3.5 w-3.5 text-focus" />
                {zh ? "导出居中 512×512 游戏图标" : "Export 512×512 Game Icon"}
              </button>
            </div>
          </section>

          {/* Live Canvas + Discover Small Card + 1:1 Game Icon Previews */}
          <section className="lg:col-span-7 space-y-5">
            <div className="rounded-2xl border border-line bg-panel p-5">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-dim">
                  <Eye className="h-4 w-4 text-focus" />
                  {zh ? "1920×1080 实时预览" : "1920×1080 Live Canvas"}
                </span>
                <span className="text-[11px] text-ink-mute">
                  {zh ? "黄线 = 5% 安全区 · 蓝框 = 1:1 图标裁切区" : "Yellow = 5% Safe · Blue = 1:1 Crop"}
                </span>
              </div>
              <div className="relative w-full overflow-hidden rounded-xl border border-line bg-surface">
                {preview16x9Url && (
                  <img
                    src={preview16x9Url}
                    alt="1920x1080 Roblox Thumbnail preview"
                    className="block w-full h-auto"
                  />
                )}
                {showSafeZones && (
                  <svg
                    viewBox={`0 0 ${THUMBNAIL_WIDTH} ${THUMBNAIL_HEIGHT}`}
                    className="pointer-events-none absolute inset-0 h-full w-full"
                  >
                    {/* 5% Title Safe */}
                    <rect
                      x={ROBLOX_SAFE_ZONES.titleSafe.x}
                      y={ROBLOX_SAFE_ZONES.titleSafe.y}
                      width={ROBLOX_SAFE_ZONES.titleSafe.width}
                      height={ROBLOX_SAFE_ZONES.titleSafe.height}
                      fill="none"
                      stroke="#facc15"
                      strokeWidth="3"
                      strokeDasharray="12 10"
                      opacity="0.7"
                    />
                    {/* 1:1 Center Square Icon Crop */}
                    <rect
                      x={iconCrop.x}
                      y={iconCrop.y}
                      width={iconCrop.size}
                      height={iconCrop.size}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="4"
                      strokeDasharray="14 8"
                      opacity="0.85"
                    />
                    {/* Bottom-Left Discover Pill Overlay */}
                    <rect
                      x={ROBLOX_SAFE_ZONES.bottomLeftOverlay.x}
                      y={ROBLOX_SAFE_ZONES.bottomLeftOverlay.y}
                      width={ROBLOX_SAFE_ZONES.bottomLeftOverlay.width}
                      height={ROBLOX_SAFE_ZONES.bottomLeftOverlay.height}
                      rx="24"
                      fill="rgba(239, 68, 68, 0.24)"
                      stroke="#f87171"
                      strokeWidth="3"
                    />
                    {/* Top-Right Badge Area */}
                    <rect
                      x={ROBLOX_SAFE_ZONES.topRightOverlay.x}
                      y={ROBLOX_SAFE_ZONES.topRightOverlay.y}
                      width={ROBLOX_SAFE_ZONES.topRightOverlay.width}
                      height={ROBLOX_SAFE_ZONES.topRightOverlay.height}
                      rx="20"
                      fill="rgba(239, 68, 68, 0.2)"
                      stroke="#f87171"
                      strokeWidth="3"
                    />
                  </svg>
                )}
              </div>
            </div>

            {/* Small Card + 1:1 Icon Readability Check */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-panel p-4">
                <p className="text-xs font-semibold text-ink-dim mb-2.5">
                  {zh ? "Roblox 发现页小卡缩略图（220px 宽）" : "Roblox Discover Card Size (220px)"}
                </p>
                <div className="w-[220px] rounded-lg overflow-hidden border border-line bg-surface">
                  {preview16x9Url && (
                    <img
                      src={preview16x9Url}
                      alt="Discover card thumbnail preview"
                      className="block w-full h-auto"
                    />
                  )}
                  <div className="p-2 text-[11px] flex items-center justify-between text-ink-mute">
                    <span className="font-semibold text-ink truncate">
                      {headlineTop || "Experience"}
                    </span>
                    <span>94% · 1.2K</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-panel p-4 flex items-center gap-4">
                {previewIconUrl && (
                  <img
                    src={previewIconUrl}
                    alt="1:1 Game Icon preview"
                    className="h-24 w-24 shrink-0 rounded-xl border border-line object-cover"
                  />
                )}
                <div className="space-y-1 text-xs">
                  <p className="font-semibold text-ink">
                    {zh ? "1:1 游戏图标（512×512）" : "1:1 Game Icon Crop (512×512)"}
                  </p>
                  <p className="text-ink-mute leading-relaxed">
                    {zh
                      ? "自动截取 1920×1080 居中正方形区域，确保主标题在缩略方图下也能看清。"
                      : "Auto-crops the centered square from your 16:9 canvas so one design ships both assets."}
                  </p>
                </div>
              </div>
            </div>

            {/* Pro UI Kits Upsell */}
            <div className="rounded-2xl border border-focus/40 bg-panel p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-focus">
                  <Layers className="h-3.5 w-3.5" />
                  {zh ? "配套游戏 UI 界面 + .rbxmx 套装" : "Match Your Thumbnail with Pro UI Kits"}
                </p>
                <p className="text-xs text-ink-dim leading-relaxed">
                  {zh
                    ? "一次性解锁 6 大品类 5 屏完整 Studio .rbxmx 界面与 48 枚通行证图标。"
                    : "Unlock native .rbxmx exports, 6 themed 5-screen Game UI Kits, and 48 Gamepass badges."}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setUpgradeOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-on-primary hover:brightness-110 transition"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {zh ? "解锁 Studio Pro" : "Unlock Studio Pro"}
                </button>
                <Link
                  href="/editor"
                  className="rounded-xl border border-line bg-surface px-3.5 py-2 text-xs font-semibold text-ink hover:border-focus transition"
                >
                  {zh ? "打开 GUI 编辑器" : "GUI Editor"}
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>

      <ProUpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        contextTitle={
          zh
            ? "解锁 Studio .rbxmx、6 套游戏 UI Kit 与 10× AI 额度"
            : "Unlock Studio .rbxmx, 6 Game UI Kits & 10× AI Quota"
        }
        returnPath={zh ? "/zh/roblox-thumbnail-maker" : "/roblox-thumbnail-maker"}
        locale={locale}
      />
    </>
  );
}
