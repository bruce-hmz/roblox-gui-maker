"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy, Image as ImageIcon, MonitorSmartphone, Search } from "lucide-react";
import type { Locale } from "../../i18n";
import { normalizeRobloxAssetId, assetIdNumber } from "../../editor/image-assets";
import {
  VIEWPORT_PRESETS,
  generateResponsiveConstraintLuau,
  pixelsToScale,
  roundScale,
  scaleToPixels,
} from "./udim2-math";

export function UiSizerTool({ locale = "en" }: { locale?: Locale }) {
  const zh = locale === "zh";

  // Parent & element sizing
  const [parentPresetId, setParentPresetId] = useState(VIEWPORT_PRESETS[0]!.id);
  const activePreset =
    VIEWPORT_PRESETS.find((v) => v.id === parentPresetId) ?? VIEWPORT_PRESETS[0]!;

  const [posX, setPosX] = useState(480);
  const [posY, setPosY] = useState(216);
  const [sizeW, setSizeW] = useState(960);
  const [sizeH, setSizeH] = useState(648);
  const [centerAnchor, setCenterAnchor] = useState(true);
  const [includeAspect, setIncludeAspect] = useState(true);
  const [includeMinMax, setIncludeMinMax] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);

  // Decal / Asset ID previewer state
  const [assetInput, setAssetInput] = useState("10681845694");
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);
  const [resolvedCanonical, setResolvedCanonical] = useState<string | null>(null);
  const [loadingAsset, setLoadingAsset] = useState(false);
  const [assetError, setAssetError] = useState<string | null>(null);
  const [copiedAsset, setCopiedAsset] = useState(false);

  const scalePos = pixelsToScale(
    centerAnchor ? posX + sizeW / 2 : posX,
    centerAnchor ? posY + sizeH / 2 : posY,
    activePreset.width,
    activePreset.height
  );
  const scaleSize = pixelsToScale(sizeW, sizeH, activePreset.width, activePreset.height);
  const aspectRatio = sizeH > 0 ? Number((sizeW / sizeH).toFixed(4)) : 1;

  const luauSnippet = generateResponsiveConstraintLuau({
    instanceName: "ShopPanel",
    scalePos,
    scaleSize,
    anchorPoint: centerAnchor ? { x: 0.5, y: 0.5 } : { x: 0, y: 0 },
    aspectRatio: includeAspect ? aspectRatio : null,
    minSize: includeMinMax ? { x: 260, y: 180 } : null,
    maxSize: includeMinMax ? { x: Math.max(sizeW, 640), y: Math.max(sizeH, 460) } : null,
  });

  async function copyLuau() {
    await navigator.clipboard.writeText(luauSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1500);
  }

  async function lookupAsset() {
    const canonical = normalizeRobloxAssetId(assetInput);
    const id = canonical ? assetIdNumber(canonical) : null;
    if (!id || !canonical) {
      setAssetError(
        zh ? "请输入数字 ID 或 rbxassetid:// 格式。" : "Enter a numeric ID or rbxassetid://<id>."
      );
      return;
    }
    setLoadingAsset(true);
    setAssetError(null);
    try {
      const res = await fetch(`/api/roblox-thumbnail?assetId=${encodeURIComponent(id)}`);
      const payload = (await res.json().catch(() => null)) as {
        imageUrl?: string | null;
        error?: string;
      } | null;
      if (!res.ok || !payload?.imageUrl) {
        setAssetError(
          payload?.error ??
            (zh ? "未能加载该 Asset ID 缩略图。" : "Could not resolve thumbnail for this Asset ID.")
        );
        setResolvedUrl(null);
        return;
      }
      setResolvedUrl(payload.imageUrl);
      setResolvedCanonical(canonical);
    } catch {
      setAssetError(zh ? "请求 Roblox 接口失败。" : "Failed to query Roblox thumbnail API.");
    } finally {
      setLoadingAsset(false);
    }
  }

  async function copyAssetId() {
    if (!resolvedCanonical) return;
    await navigator.clipboard.writeText(resolvedCanonical);
    setCopiedAsset(true);
    setTimeout(() => setCopiedAsset(false), 1500);
  }

  const previewScreens = [
    VIEWPORT_PRESETS[0]!, // Desktop 1920x1080
    VIEWPORT_PRESETS[2]!, // Tablet 1024x768
    VIEWPORT_PRESETS[4]!, // Phone Portrait 390x844
  ];

  return (
    <div className="space-y-10">
      {/* UDim2 Converter + Multi-Device Comparison */}
      <div className="grid gap-6 lg:grid-cols-12">
        <section className="lg:col-span-5 rounded-2xl border border-line bg-panel p-6 space-y-5">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-dim">
              {zh ? "1. 输入画布像素（Offset）自动转比例（Scale）" : "1. Reference Canvas & Pixel Rect"}
            </h2>
            <p className="mt-1 text-xs text-ink-mute">
              {zh
                ? "直接输入设计稿中的像素坐标，生成跨手机/平板/4K 不变形的 UDim2.fromScale 与约束脚本。"
                : "Convert pixel Offset coordinates into responsive UDim2.fromScale + UIAspectRatioConstraint Luau."}
            </p>
          </div>

          <label className="block text-xs">
            <span className="text-ink-dim font-medium block mb-1">
              {zh ? "设计基准屏幕尺寸" : "Reference Parent Viewport"}
            </span>
            <select
              value={parentPresetId}
              onChange={(e) => setParentPresetId(e.target.value)}
              className="w-full rounded-lg border border-line bg-input px-3 py-2 text-xs text-ink"
            >
              {VIEWPORT_PRESETS.map((v) => (
                <option key={v.id} value={v.id}>
                  {zh ? v.labelZh : v.labelEn}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <label>
              <span className="text-ink-dim font-medium block mb-1">X Offset (px)</span>
              <input
                type="number"
                value={posX}
                onChange={(e) => setPosX(Number(e.target.value) || 0)}
                className="w-full rounded-lg border border-line bg-input px-3 py-2 text-xs font-mono text-ink"
              />
            </label>
            <label>
              <span className="text-ink-dim font-medium block mb-1">Y Offset (px)</span>
              <input
                type="number"
                value={posY}
                onChange={(e) => setPosY(Number(e.target.value) || 0)}
                className="w-full rounded-lg border border-line bg-input px-3 py-2 text-xs font-mono text-ink"
              />
            </label>
            <label>
              <span className="text-ink-dim font-medium block mb-1">Width (px)</span>
              <input
                type="number"
                min={1}
                value={sizeW}
                onChange={(e) => setSizeW(Math.max(1, Number(e.target.value) || 1))}
                className="w-full rounded-lg border border-line bg-input px-3 py-2 text-xs font-mono text-ink"
              />
            </label>
            <label>
              <span className="text-ink-dim font-medium block mb-1">Height (px)</span>
              <input
                type="number"
                min={1}
                value={sizeH}
                onChange={(e) => setSizeH(Math.max(1, Number(e.target.value) || 1))}
                className="w-full rounded-lg border border-line bg-input px-3 py-2 text-xs font-mono text-ink"
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-ink-dim">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={centerAnchor}
                onChange={(e) => setCenterAnchor(e.target.checked)}
                className="accent-[#00a2ff]"
              />
              AnchorPoint (0.5, 0.5)
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeAspect}
                onChange={(e) => setIncludeAspect(e.target.checked)}
                className="accent-[#00a2ff]"
              />
              UIAspectRatioConstraint ({aspectRatio})
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeMinMax}
                onChange={(e) => setIncludeMinMax(e.target.checked)}
                className="accent-[#00a2ff]"
              />
              UISizeConstraint
            </label>
          </div>

          <div className="rounded-xl border border-line bg-surface p-3.5 text-xs font-mono space-y-1">
            <div className="flex justify-between text-ink-dim">
              <span>Position:</span>
              <span className="text-focus">
                UDim2.fromScale({roundScale(scalePos.x)}, {roundScale(scalePos.y)})
              </span>
            </div>
            <div className="flex justify-between text-ink-dim">
              <span>Size:</span>
              <span className="text-success">
                UDim2.fromScale({roundScale(scaleSize.x)}, {roundScale(scaleSize.y)})
              </span>
            </div>
          </div>
        </section>

        {/* Right: Multi-Device Preview + Copyable Luau */}
        <section className="lg:col-span-7 space-y-5">
          <div className="rounded-2xl border border-line bg-panel p-5">
            <div className="flex items-center justify-between gap-2 mb-4">
              <h2 className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-dim">
                <MonitorSmartphone className="h-4 w-4 text-focus" />
                {zh ? "2. 多端对比：硬编码 Offset vs 响应式 Scale" : "2. Live Viewport Comparison (Offset Clipping vs Scale)"}
              </h2>
              <span className="text-[11px] text-ink-mute">
                {zh ? "红框 = 仅用 Offset · 蓝框 = 推荐 Scale" : "Red = Raw Offset · Blue = Scale"}
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {previewScreens.map((screen) => {
                const boxH = 120;
                const boxW = Math.round((screen.width / screen.height) * boxH);
                const scaledW = scaleToPixels(scaleSize.x, scaleSize.y, screen.width, screen.height);
                const rawOverflow = sizeW > screen.width || posX + sizeW > screen.width;
                return (
                  <div
                    key={screen.id}
                    className="rounded-xl border border-line bg-surface p-3 flex flex-col items-center gap-2"
                  >
                    <p className="text-[11px] font-semibold text-ink">
                      {zh ? screen.labelZh : screen.labelEn}
                    </p>
                    <div
                      style={{ width: Math.min(200, boxW), height: boxH }}
                      className="relative overflow-hidden rounded-md border border-line-soft bg-base"
                    >
                      {/* Raw Offset rectangle */}
                      <div
                        style={{
                          left: `${(posX / screen.width) * 100}%`,
                          top: `${(posY / screen.height) * 100}%`,
                          width: `${(sizeW / screen.width) * 100}%`,
                          height: `${(sizeH / screen.height) * 100}%`,
                        }}
                        className="absolute border border-dashed border-danger/80 bg-danger/15"
                      />
                      {/* Responsive Scale rectangle */}
                      <div
                        style={{
                          left: `${scalePos.x * 100}%`,
                          top: `${scalePos.y * 100}%`,
                          width: `${scaleSize.x * 100}%`,
                          height: `${scaleSize.y * 100}%`,
                          transform: centerAnchor ? "translate(-50%, -50%)" : undefined,
                        }}
                        className="absolute rounded-xs border-2 border-focus bg-primary/25"
                      />
                    </div>
                    <p className="text-[10px] text-ink-mute text-center">
                      {rawOverflow
                        ? zh
                          ? `Offset 溢出 · Scale=${scaledW.x}×${scaledW.y}px`
                          : `Offset clips · Scale=${scaledW.x}×${scaledW.y}px`
                        : zh
                          ? `Scale=${scaledW.x}×${scaledW.y}px`
                          : `Scale=${scaledW.x}×${scaledW.y}px`}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Copyable Luau Block */}
          <div className="rounded-2xl border border-line bg-panel p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-ink-dim">
                {zh ? "3. 生成可直接粘贴的响应式 Luau 代码" : "3. Ready-to-Paste Responsive Luau"}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => void copyLuau()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-on-primary hover:brightness-110 transition"
                >
                  {copiedCode ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedCode ? (zh ? "已复制" : "Copied") : zh ? "复制 Luau" : "Copy Luau"}
                </button>
                <Link
                  href="/editor"
                  className="rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink hover:border-focus transition"
                >
                  {zh ? "打开可视化编辑器" : "Open Visual Editor"}
                </Link>
              </div>
            </div>
            <pre className="overflow-x-auto rounded-xl border border-line bg-surface p-4 text-xs font-mono leading-relaxed text-ink-dim">
              <code>{luauSnippet}</code>
            </pre>
          </div>
        </section>
      </div>

      {/* Integrated Roblox Decal / Image Asset ID Previewer */}
      <section className="rounded-2xl border border-line bg-panel p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-focus mb-1">
              <ImageIcon className="h-3.5 w-3.5" />
              {zh ? "免费附带工具 · Roblox Decal / Image ID 实时预览" : "Bonus Tool · Roblox Decal & Image Asset ID Checker"}
            </p>
            <h2 className="text-xl font-bold text-ink">
              {zh ? "Roblox Decal / rbxassetid 图片验证器" : "Roblox Asset ID Thumbnail Previewer"}
            </h2>
            <p className="text-xs text-ink-dim mt-1">
              {zh
                ? "输入数字 ID 或 rbxassetid:// 链接，立即拉取 Roblox 官方缩略图并生成 ImageLabel 代码。"
                : "Paste any numeric Asset ID or rbxassetid:// URL to verify how it renders and grab ready ImageLabel code."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={assetInput}
              onChange={(e) => setAssetInput(e.target.value)}
              placeholder="rbxassetid://10681845694"
              className="w-56 rounded-lg border border-line bg-input px-3 py-2 text-xs font-mono text-ink focus:border-focus focus:outline-none"
            />
            <button
              type="button"
              onClick={() => void lookupAsset()}
              disabled={loadingAsset}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-on-primary hover:brightness-110 transition disabled:opacity-50"
            >
              <Search className="h-3.5 w-3.5" />
              {loadingAsset ? (zh ? "查询中…" : "Checking…") : zh ? "预览素材" : "Preview Asset"}
            </button>
          </div>
        </div>

        {assetError && <p className="text-xs text-danger mb-3">{assetError}</p>}

        {resolvedUrl && resolvedCanonical && (
          <div className="grid gap-4 md:grid-cols-12 items-center rounded-xl border border-line bg-surface p-4">
            <div className="md:col-span-3 flex justify-center">
              <img
                src={resolvedUrl}
                alt={resolvedCanonical}
                className="h-32 w-32 rounded-lg border border-line object-contain canvas-grid"
              />
            </div>
            <div className="md:col-span-9 space-y-2 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <code className="rounded bg-raised px-2 py-1 font-mono text-focus">
                  {resolvedCanonical}
                </code>
                <button
                  type="button"
                  onClick={() => void copyAssetId()}
                  className="inline-flex items-center gap-1 rounded-md border border-line bg-panel px-2.5 py-1 font-medium text-ink hover:border-focus"
                >
                  {copiedAsset ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                  {copiedAsset ? (zh ? "已复制" : "Copied") : zh ? "复制 ID" : "Copy rbxassetid"}
                </button>
              </div>
              <pre className="overflow-x-auto rounded-lg border border-line bg-panel p-3 font-mono text-[11px] text-ink-dim">
                <code>{`local icon = Instance.new("ImageLabel")\nicon.Size = UDim2.fromScale(0.2, 0.2)\nicon.ScaleType = Enum.ScaleType.Fit\nicon.BackgroundTransparency = 1\nicon.Image = "${resolvedCanonical}"`}</code>
              </pre>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
