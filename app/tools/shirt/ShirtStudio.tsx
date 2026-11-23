"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Download,
  Eye,
  RotateCcw,
  Sparkles,
  Upload,
  AlertTriangle,
} from "lucide-react";
import type { Locale } from "../../i18n";
import { trackEvent } from "../../lib/track";
import {
  CLOTHING_UV_REGIONS,
  ROBLOX_CLOTHING_HEIGHT,
  ROBLOX_CLOTHING_WIDTH,
  SHIRT_STYLE_PRESETS,
  SKIN_TONE_PRESETS,
  buildClothingTemplateSvg,
  validateClothingDimensions,
  type ClothingDimensionValidation,
  type ClothingKind,
  type CollarStyle,
  type ShirtDesignSpec,
} from "./shirt-uv";

type ModeTab = "tester" | "maker";
type BgTheme = "studio" | "daylight" | "midnight";

type TextureMap = Partial<Record<string, string>>;

function loadImageFromDataUrl(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not decode image."));
    img.src = dataUrl;
  });
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Failed to read file."));
    };
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });
}

function sliceCanvasToTextures(sourceCanvas: HTMLCanvasElement): TextureMap {
  const out: TextureMap = {};
  const scratch = document.createElement("canvas");
  const ctx = scratch.getContext("2d");
  if (!ctx) return out;

  for (const region of CLOTHING_UV_REGIONS) {
    scratch.width = region.width;
    scratch.height = region.height;
    ctx.clearRect(0, 0, region.width, region.height);
    ctx.drawImage(
      sourceCanvas,
      region.x,
      region.y,
      region.width,
      region.height,
      0,
      0,
      region.width,
      region.height
    );
    out[region.id] = scratch.toDataURL("image/png");
  }
  return out;
}

type BoxFaceProps = {
  w: number;
  h: number;
  transform: string;
  bg: string;
  tex?: string;
  shadeOverlay?: string;
};

function BoxFace({ w, h, transform, bg, tex, shadeOverlay }: BoxFaceProps) {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: w,
        height: h,
        marginLeft: -w / 2,
        marginTop: -h / 2,
        transform,
        backgroundColor: bg,
        backfaceVisibility: "visible",
        overflow: "hidden",
      }}
    >
      {tex && (
        <img
          src={tex}
          alt=""
          draggable={false}
          className="block h-full w-full pointer-events-none select-none"
        />
      )}
      {shadeOverlay && (
        <div
          style={{ backgroundColor: shadeOverlay }}
          className="absolute inset-0 pointer-events-none"
        />
      )}
    </div>
  );
}

function R6Limb({
  w,
  h,
  d,
  x,
  y,
  z = 0,
  rotX = 0,
  skin,
  textures,
  isHead = false,
}: {
  w: number;
  h: number;
  d: number;
  x: number;
  y: number;
  z?: number;
  rotX?: number;
  skin: string;
  textures: {
    front?: string;
    back?: string;
    left?: string;
    right?: string;
    top?: string;
    bottom?: string;
  };
  isHead?: boolean;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: 0,
        height: 0,
        transformStyle: "preserve-3d",
        transform: `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rotX}deg)`,
      }}
    >
      {/* Front */}
      <BoxFace
        w={w}
        h={h}
        transform={`translateZ(${d / 2}px)`}
        bg={skin}
        tex={textures.front}
      />
      {/* Head minimalist Roblox smile on front face */}
      {isHead && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: w,
            height: h,
            marginLeft: -w / 2,
            marginTop: -h / 2,
            transform: `translateZ(${d / 2 + 0.4}px)`,
            pointerEvents: "none",
          }}
          className="flex flex-col items-center justify-center gap-1.5"
        >
          <div className="flex gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-neutral-900" />
            <span className="h-1.5 w-1.5 rounded-full bg-neutral-900" />
          </div>
          <div className="h-2 w-4 rounded-b-full border-b-2 border-neutral-900" />
        </div>
      )}
      {/* Back */}
      <BoxFace
        w={w}
        h={h}
        transform={`rotateY(180deg) translateZ(${d / 2}px)`}
        bg={skin}
        tex={textures.back}
        shadeOverlay="rgba(0,0,0,0.08)"
      />
      {/* Viewer's Right (+X = avatar's left side) */}
      <BoxFace
        w={d}
        h={h}
        transform={`rotateY(90deg) translateZ(${w / 2}px)`}
        bg={skin}
        tex={textures.left}
        shadeOverlay="rgba(0,0,0,0.06)"
      />
      {/* Viewer's Left (-X = avatar's right side) */}
      <BoxFace
        w={d}
        h={h}
        transform={`rotateY(-90deg) translateZ(${w / 2}px)`}
        bg={skin}
        tex={textures.right}
        shadeOverlay="rgba(0,0,0,0.1)"
      />
      {/* Top */}
      <BoxFace
        w={w}
        h={d}
        transform={`rotateX(90deg) translateZ(${h / 2}px)`}
        bg={skin}
        tex={textures.top}
        shadeOverlay="rgba(255,255,255,0.06)"
      />
      {/* Bottom */}
      <BoxFace
        w={w}
        h={d}
        transform={`rotateX(-90deg) translateZ(${h / 2}px)`}
        bg={skin}
        tex={textures.bottom}
        shadeOverlay="rgba(0,0,0,0.16)"
      />
    </div>
  );
}

export function ShirtStudio({
  defaultMode,
  locale = "en",
}: {
  defaultMode: ModeTab;
  locale?: Locale;
}) {
  const zh = locale === "zh";
  const [activeTab, setActiveTab] = useState<ModeTab>(defaultMode);

  // Maker design state
  const [presetId, setPresetId] = useState<string>(SHIRT_STYLE_PRESETS[0]!.id);
  const [clothingKind, setClothingKind] = useState<ClothingKind>("shirt");
  const [baseColor, setBaseColor] = useState<string>(SHIRT_STYLE_PRESETS[0]!.baseColor);
  const [sleeveColor, setSleeveColor] = useState<string>(SHIRT_STYLE_PRESETS[0]!.sleeveColor);
  const [accentColor, setAccentColor] = useState<string>(SHIRT_STYLE_PRESETS[0]!.accentColor);
  const [collarStyle, setCollarStyle] = useState<CollarStyle>(SHIRT_STYLE_PRESETS[0]!.collarStyle);
  const [chestStripe, setChestStripe] = useState<boolean>(SHIRT_STYLE_PRESETS[0]!.chestStripe);
  const [frontText, setFrontText] = useState<string>(SHIRT_STYLE_PRESETS[0]!.frontText);
  const [sleeveLengthRatio, setSleeveLengthRatio] = useState<number>(
    SHIRT_STYLE_PRESETS[0]!.sleeveLengthRatio
  );
  const [showUvGuides, setShowUvGuides] = useState<boolean>(true);
  const [chestGraphicDataUrl, setChestGraphicDataUrl] = useState<string | null>(null);

  // Tester uploaded textures
  const [uploadedShirtDataUrl, setUploadedShirtDataUrl] = useState<string | null>(null);
  const [uploadedShirtValidation, setUploadedShirtValidation] =
    useState<ClothingDimensionValidation | null>(null);
  const [uploadedShirtFileName, setUploadedShirtFileName] = useState<string | null>(null);

  const [uploadedPantsDataUrl, setUploadedPantsDataUrl] = useState<string | null>(null);
  const [uploadedPantsValidation, setUploadedPantsValidation] =
    useState<ClothingDimensionValidation | null>(null);
  const [uploadedPantsFileName, setUploadedPantsFileName] = useState<string | null>(null);

  // Rendered composite 2D sheet + sliced 3D textures
  const [shirtSheetDataUrl, setShirtSheetDataUrl] = useState<string | null>(null);
  const [shirtTextures, setShirtTextures] = useState<TextureMap>({});
  const [pantsTextures, setPantsTextures] = useState<TextureMap>({});
  const [uploadError, setUploadError] = useState<string | null>(null);

  // 3D Viewer controls
  const [yaw, setYaw] = useState<number>(-28);
  const [pitch, setPitch] = useState<number>(-10);
  const [zoom, setZoom] = useState<number>(1.05);
  const [skinColor, setSkinColor] = useState<string>(SKIN_TONE_PRESETS[0]!.color);
  const [walkAnimation, setWalkAnimation] = useState<boolean>(false);
  const [walkPhase, setWalkPhase] = useState<number>(0);
  const [bgTheme, setBgTheme] = useState<BgTheme>("studio");
  const dragOrigin = useRef<{ x: number; y: number; yaw: number; pitch: number } | null>(
    null
  );

  const designSpec: ShirtDesignSpec = useMemo(
    () => ({
      id: presetId,
      nameEn: presetId,
      nameZh: presetId,
      kind: clothingKind,
      baseColor,
      sleeveColor,
      accentColor,
      collarStyle,
      chestStripe,
      frontText,
      sleeveLengthRatio,
    }),
    [
      presetId,
      clothingKind,
      baseColor,
      sleeveColor,
      accentColor,
      collarStyle,
      chestStripe,
      frontText,
      sleeveLengthRatio,
    ]
  );

  // Animate simple R6 walk cycle when enabled
  useEffect(() => {
    if (!walkAnimation) {
      setWalkPhase(0);
      return;
    }
    let frame = 0;
    let start = performance.now();
    const step = (now: number) => {
      const elapsed = (now - start) / 1000;
      setWalkPhase(Math.sin(elapsed * 5.2) * 24);
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [walkAnimation]);

  // Render active shirt (either uploaded in tester mode, or maker SVG + chest graphic)
  useEffect(() => {
    let cancelled = false;
    async function rebuild() {
      const canvas = document.createElement("canvas");
      canvas.width = ROBLOX_CLOTHING_WIDTH;
      canvas.height = ROBLOX_CLOTHING_HEIGHT;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (activeTab === "tester" && uploadedShirtDataUrl) {
        const img = await loadImageFromDataUrl(uploadedShirtDataUrl);
        if (cancelled) return;
        ctx.clearRect(0, 0, ROBLOX_CLOTHING_WIDTH, ROBLOX_CLOTHING_HEIGHT);
        ctx.drawImage(img, 0, 0, ROBLOX_CLOTHING_WIDTH, ROBLOX_CLOTHING_HEIGHT);
        const textures = sliceCanvasToTextures(canvas);
        if (cancelled) return;
        setShirtTextures(textures);
        setShirtSheetDataUrl(canvas.toDataURL("image/png"));
        return;
      }

      // Maker SVG (or default sample in Tester before upload)
      const svg = buildClothingTemplateSvg(designSpec, {
        includeGuides: false,
        includeLabels: false,
      });
      const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
      const svgImg = await loadImageFromDataUrl(svgDataUrl);
      if (cancelled) return;
      ctx.clearRect(0, 0, ROBLOX_CLOTHING_WIDTH, ROBLOX_CLOTHING_HEIGHT);
      ctx.drawImage(svgImg, 0, 0, ROBLOX_CLOTHING_WIDTH, ROBLOX_CLOTHING_HEIGHT);

      if (chestGraphicDataUrl && designSpec.kind === "shirt") {
        try {
          const logoImg = await loadImageFromDataUrl(chestGraphicDataUrl);
          if (cancelled) return;
          ctx.drawImage(logoImg, 259, 102, 72, 72);
        } catch {
          // ignore malformed stamp
        }
      }

      const textures = sliceCanvasToTextures(canvas);
      if (cancelled) return;
      if (designSpec.kind === "pants" && activeTab === "maker") {
        setPantsTextures(textures);
        setShirtTextures({});
      } else {
        setShirtTextures(textures);
      }
      setShirtSheetDataUrl(canvas.toDataURL("image/png"));
    }
    void rebuild().catch(() => {
      // keep previous texture on decode error
    });
    return () => {
      cancelled = true;
    };
  }, [activeTab, uploadedShirtDataUrl, designSpec, chestGraphicDataUrl]);

  // Slice optional pants overlay in tester mode
  useEffect(() => {
    let cancelled = false;
    async function rebuildPants() {
      if (!uploadedPantsDataUrl) {
        if (designSpec.kind !== "pants" || activeTab === "tester") {
          setPantsTextures({});
        }
        return;
      }
      const img = await loadImageFromDataUrl(uploadedPantsDataUrl);
      if (cancelled) return;
      const canvas = document.createElement("canvas");
      canvas.width = ROBLOX_CLOTHING_WIDTH;
      canvas.height = ROBLOX_CLOTHING_HEIGHT;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, ROBLOX_CLOTHING_WIDTH, ROBLOX_CLOTHING_HEIGHT);
      const textures = sliceCanvasToTextures(canvas);
      if (!cancelled) setPantsTextures(textures);
    }
    void rebuildPants().catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [uploadedPantsDataUrl, activeTab, designSpec.kind]);

  const handleClothingUpload = useCallback(
    async (file: File, target: "shirt" | "pants") => {
      setUploadError(null);
      try {
        const dataUrl = await readFileAsDataUrl(file);
        const img = await loadImageFromDataUrl(dataUrl);
        const validation = validateClothingDimensions(img.naturalWidth, img.naturalHeight);
        if (target === "shirt") {
          setUploadedShirtDataUrl(dataUrl);
          setUploadedShirtValidation(validation);
          setUploadedShirtFileName(file.name);
        } else {
          setUploadedPantsDataUrl(dataUrl);
          setUploadedPantsValidation(validation);
          setUploadedPantsFileName(file.name);
        }
        setActiveTab("tester");
        trackEvent("shirt_tester_upload", { target, status: validation.status });
      } catch {
        setUploadError(
          zh ? "无法读取该图片文件，请上传 PNG 或 JPG 模板。" : "Could not read image file. Upload a PNG or JPG."
        );
      }
    },
    [zh]
  );

  async function handleChestGraphicUpload(file: File) {
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setChestGraphicDataUrl(dataUrl);
    } catch {
      setUploadError(zh ? "读取胸前印花失败。" : "Could not read chest graphic.");
    }
  }

  function applyPreset(preset: (typeof SHIRT_STYLE_PRESETS)[number]) {
    setPresetId(preset.id);
    setClothingKind(preset.kind);
    setBaseColor(preset.baseColor);
    setSleeveColor(preset.sleeveColor);
    setAccentColor(preset.accentColor);
    setCollarStyle(preset.collarStyle);
    setChestStripe(preset.chestStripe);
    setFrontText(preset.frontText);
    setSleeveLengthRatio(preset.sleeveLengthRatio);
  }

  function downloadDataUrl(dataUrl: string, filename: string) {
    const anchor = document.createElement("a");
    anchor.href = dataUrl;
    anchor.download = filename;
    anchor.click();
  }

  function downloadUploadReadyPng() {
    if (!shirtSheetDataUrl) return;
    trackEvent("shirt_template_export", { format: "png", kind: clothingKind });
    downloadDataUrl(
      shirtSheetDataUrl,
      `roblox-${clothingKind}-${presetId}-585x559.png`
    );
  }

  async function downloadBlankOfficialGuidePng() {
    const svg = buildClothingTemplateSvg(designSpec, {
      includeGuides: true,
      includeLabels: true,
      blankTemplateOnly: true,
    });
    const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    const img = await loadImageFromDataUrl(svgDataUrl);
    const canvas = document.createElement("canvas");
    canvas.width = ROBLOX_CLOTHING_WIDTH;
    canvas.height = ROBLOX_CLOTHING_HEIGHT;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);
    trackEvent("shirt_template_export", { format: "blank_guide_png", kind: clothingKind });
    downloadDataUrl(
      canvas.toDataURL("image/png"),
      "roblox-official-clothing-template-585x559.png"
    );
  }

  function downloadGuideSvg() {
    const svg = buildClothingTemplateSvg(designSpec, {
      includeGuides: true,
      includeLabels: true,
    });
    const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    trackEvent("shirt_template_export", { format: "svg", kind: clothingKind });
    downloadDataUrl(dataUrl, `roblox-${clothingKind}-${presetId}-585x559.svg`);
  }

  const viewerBgClass =
    bgTheme === "daylight"
      ? "bg-gradient-to-b from-sky-200 to-sky-100 text-slate-900"
      : bgTheme === "midnight"
        ? "bg-gradient-to-b from-[#070912] to-[#111526] text-ink"
        : "bg-gradient-to-b from-surface to-page text-ink canvas-grid";

  const activeTorsoTextures = {
    front: shirtTextures.torsoFront ?? pantsTextures.torsoFront,
    back: shirtTextures.torsoBack ?? pantsTextures.torsoBack,
    left: shirtTextures.torsoLeft ?? pantsTextures.torsoLeft,
    right: shirtTextures.torsoRight ?? pantsTextures.torsoRight,
    top: shirtTextures.torsoTop ?? pantsTextures.torsoTop,
    bottom: shirtTextures.torsoBottom ?? pantsTextures.torsoBottom,
  };

  return (
    <div className="space-y-8">
      {/* Mode Switch Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-panel p-3">
        <div role="tablist" className="flex items-center gap-2">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "tester"}
            onClick={() => setActiveTab("tester")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              activeTab === "tester"
                ? "bg-primary text-on-primary"
                : "text-ink-dim hover:bg-raised hover:text-ink"
            }`}
          >
            {zh ? "3D 试衣测试（上传 585×559 模板）" : "3D Shirt & Pants Tester"}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "maker"}
            onClick={() => setActiveTab("maker")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              activeTab === "maker"
                ? "bg-primary text-on-primary"
                : "text-ink-dim hover:bg-raised hover:text-ink"
            }`}
          >
            {zh ? "在线制作 585×559 模板" : "585×559 Template Maker"}
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => void downloadBlankOfficialGuidePng()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 font-medium text-ink-dim hover:border-focus hover:text-ink transition"
          >
            <Download className="h-3.5 w-3.5 text-focus" />
            {zh ? "下载官方空白网格模板 (585×559)" : "Blank Official 585×559 Grid PNG"}
          </button>
        </div>
      </div>

      {/* Main Split Workspace: Left 3D Avatar + Right Controls/2D UV */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* 3D R6 Avatar Viewport */}
        <section className="lg:col-span-6 rounded-2xl border border-line bg-panel p-5 flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-ink-dim">
                {zh ? "实时 3D R6 穿戴预览（可拖拽旋转）" : "Live 3D R6 Try-On Preview"}
              </h2>
              <p className="text-xs text-ink-mute">
                {zh
                  ? "拖动旋转检查腋下、袖口、前胸接缝，支持一键切换背面和走动姿态。"
                  : "Drag to orbit 360° and inspect seams under arms, cuffs, and back folds."}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              {(["studio", "daylight", "midnight"] as const).map((theme) => (
                <button
                  key={theme}
                  type="button"
                  onClick={() => setBgTheme(theme)}
                  className={`rounded-md border px-2 py-1 capitalize transition ${
                    bgTheme === theme
                      ? "border-focus bg-raised text-ink"
                      : "border-line bg-surface text-ink-mute hover:text-ink"
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          {/* 3D Canvas Stage */}
          <div
            onPointerDown={(e) => {
              dragOrigin.current = {
                x: e.clientX,
                y: e.clientY,
                yaw,
                pitch,
              };
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (!dragOrigin.current) return;
              const dx = e.clientX - dragOrigin.current.x;
              const dy = e.clientY - dragOrigin.current.y;
              setYaw(dragOrigin.current.yaw + dx * 0.65);
              setPitch(Math.max(-45, Math.min(45, dragOrigin.current.pitch - dy * 0.45)));
            }}
            onPointerUp={() => {
              dragOrigin.current = null;
            }}
            className={`relative h-[380px] sm:h-[420px] rounded-xl border border-line overflow-hidden select-none cursor-grab active:cursor-grabbing flex items-center justify-center ${viewerBgClass}`}
            style={{ perspective: "920px" }}
          >
            {/* R6 Rig */}
            <div
              style={{
                position: "relative",
                width: 0,
                height: 0,
                transformStyle: "preserve-3d",
                transform: `scale(${zoom}) rotateX(${pitch}deg) rotateY(${yaw}deg)`,
                transition: dragOrigin.current ? "none" : "transform 80ms ease-out",
              }}
            >
              {/* Head */}
              <R6Limb
                w={46}
                h={46}
                d={46}
                x={0}
                y={-72}
                skin={skinColor}
                textures={{}}
                isHead
              />
              {/* Torso */}
              <R6Limb
                w={80}
                h={80}
                d={40}
                x={0}
                y={-5}
                skin={skinColor}
                textures={activeTorsoTextures}
              />
              {/* Right Arm (viewer -X side) */}
              <R6Limb
                w={40}
                h={80}
                d={40}
                x={-62}
                y={-5}
                rotX={walkPhase}
                skin={skinColor}
                textures={{
                  front: shirtTextures.rightLimbFront,
                  back: shirtTextures.rightLimbBack,
                  left: shirtTextures.rightLimbInner,
                  right: shirtTextures.rightLimbOuter,
                  top: shirtTextures.rightLimbTop,
                  bottom: shirtTextures.rightLimbBottom,
                }}
              />
              {/* Left Arm (viewer +X side) */}
              <R6Limb
                w={40}
                h={80}
                d={40}
                x={62}
                y={-5}
                rotX={-walkPhase}
                skin={skinColor}
                textures={{
                  front: shirtTextures.leftLimbFront,
                  back: shirtTextures.leftLimbBack,
                  left: shirtTextures.leftLimbOuter,
                  right: shirtTextures.leftLimbInner,
                  top: shirtTextures.leftLimbTop,
                  bottom: shirtTextures.leftLimbBottom,
                }}
              />
              {/* Right Leg (viewer -X side) */}
              <R6Limb
                w={40}
                h={80}
                d={40}
                x={-21}
                y={78}
                rotX={-walkPhase * 0.85}
                skin={skinColor}
                textures={{
                  front: pantsTextures.rightLimbFront,
                  back: pantsTextures.rightLimbBack,
                  left: pantsTextures.rightLimbInner,
                  right: pantsTextures.rightLimbOuter,
                  top: pantsTextures.rightLimbTop,
                  bottom: pantsTextures.rightLimbBottom,
                }}
              />
              {/* Left Leg (viewer +X side) */}
              <R6Limb
                w={40}
                h={80}
                d={40}
                x={21}
                y={78}
                rotX={walkPhase * 0.85}
                skin={skinColor}
                textures={{
                  front: pantsTextures.leftLimbFront,
                  back: pantsTextures.leftLimbBack,
                  left: pantsTextures.leftLimbOuter,
                  right: pantsTextures.leftLimbInner,
                  top: pantsTextures.leftLimbTop,
                  bottom: pantsTextures.leftLimbBottom,
                }}
              />
            </div>

            <div className="pointer-events-none absolute bottom-3 left-3 rounded-md bg-page/75 px-2.5 py-1 text-[11px] text-ink-dim backdrop-blur-xs">
              {zh ? "拖动旋转 · 585×559 R6 UV 映射" : "Drag to orbit · R6 585×559 UV"}
            </div>
          </div>

          {/* Camera & Skin Tone Strip */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {[
                { label: zh ? "正面" : "Front", y: 0, p: -6 },
                { label: "3/4", y: -28, p: -10 },
                { label: zh ? "侧面" : "Side", y: -90, p: -6 },
                { label: zh ? "背面" : "Back", y: 180, p: -6 },
              ].map((cam) => (
                <button
                  key={cam.label}
                  type="button"
                  onClick={() => {
                    setYaw(cam.y);
                    setPitch(cam.p);
                  }}
                  className="rounded-lg border border-line bg-surface px-2.5 py-1.5 font-medium text-ink-dim hover:border-focus hover:text-ink transition"
                >
                  {cam.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setWalkAnimation((v) => !v)}
                className={`rounded-lg border px-2.5 py-1.5 font-medium transition ${
                  walkAnimation
                    ? "border-focus bg-raised text-focus"
                    : "border-line bg-surface text-ink-dim hover:text-ink"
                }`}
              >
                {walkAnimation
                  ? zh
                    ? "停止走动"
                    : "Pause Walk"
                  : zh
                    ? "走动测试"
                    : "Walk Pose"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setYaw(-28);
                  setPitch(-10);
                  setZoom(1.05);
                }}
                aria-label="Reset camera"
                className="rounded-lg border border-line bg-surface p-1.5 text-ink-mute hover:text-ink"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-ink-mute">{zh ? "肤色:" : "Skin:"}</span>
              {SKIN_TONE_PRESETS.map((tone) => (
                <button
                  key={tone.id}
                  type="button"
                  title={zh ? tone.nameZh : tone.nameEn}
                  onClick={() => setSkinColor(tone.color)}
                  style={{ backgroundColor: tone.color }}
                  className={`h-5 w-5 rounded-full border-2 transition ${
                    skinColor === tone.color ? "border-focus scale-110" : "border-line"
                  }`}
                />
              ))}
              <input
                type="range"
                min={0.75}
                max={1.45}
                step={0.05}
                value={zoom}
                aria-label="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-16 accent-[#00a2ff]"
              />
            </div>
          </div>
        </section>

        {/* Right Column: Tester Uploads OR Maker Controls */}
        <section className="lg:col-span-6 space-y-5">
          {activeTab === "tester" ? (
            <div className="rounded-2xl border border-line bg-panel p-6 space-y-5">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-ink-dim">
                  {zh ? "1. 上传衣服或裤子模板进行试穿校验" : "1. Upload Shirt or Pants PNG (585×559)"}
                </h2>
                <p className="mt-1 text-xs text-ink-mute">
                  {zh
                    ? "所有文件仅在本地浏览器处理，不上传服务器；自动检查官方 585×559 像素与透明裁切。"
                    : "Files stay 100% local in your browser. Auto-checks Roblox's 585×559 px dimensions."}
                </p>
              </div>

              {uploadError && (
                <div
                  role="alert"
                  className="rounded-lg border border-danger/40 bg-danger/10 px-3.5 py-2.5 text-xs text-danger"
                >
                  {uploadError}
                </div>
              )}

              {/* Shirt Upload Dropzone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) void handleClothingUpload(file, "shirt");
                }}
                className="rounded-xl border border-dashed border-line-soft bg-surface p-5 text-center transition hover:border-focus"
              >
                <Upload className="mx-auto h-6 w-6 text-focus mb-2" />
                <p className="text-sm font-semibold text-ink">
                  {uploadedShirtFileName
                    ? uploadedShirtFileName
                    : zh
                      ? "拖入或点击上传上衣模板（Shirt PNG）"
                      : "Drop or choose Roblox Shirt template (PNG)"}
                </p>
                <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-on-primary hover:brightness-110 transition">
                  {zh ? "选择上衣文件" : "Choose Shirt File"}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleClothingUpload(file, "shirt");
                    }}
                  />
                </label>

                {uploadedShirtValidation && (
                  <div
                    className={`mt-3 flex items-center justify-center gap-1.5 text-xs ${
                      uploadedShirtValidation.status === "exact"
                        ? "text-success"
                        : uploadedShirtValidation.status === "scaled"
                          ? "text-focus"
                          : "text-danger"
                    }`}
                  >
                    {uploadedShirtValidation.valid ? (
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    ) : (
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    )}
                    <span>
                      {zh
                        ? uploadedShirtValidation.messageZh
                        : uploadedShirtValidation.messageEn}
                    </span>
                  </div>
                )}
              </div>

              {/* Optional Pants Upload */}
              <div className="rounded-xl border border-line bg-surface p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-ink">
                    {zh ? "搭配下装 / 裤子模板（可选）" : "Pair with Pants PNG (optional)"}
                  </p>
                  <p className="text-[11px] text-ink-mute truncate">
                    {uploadedPantsValidation
                      ? zh
                        ? uploadedPantsValidation.messageZh
                        : uploadedPantsValidation.messageEn
                      : uploadedPantsFileName ??
                        (zh ? "支持同时预览整套上下装效果" : "Test full outfit chest-to-waist alignment")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {uploadedPantsDataUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedPantsDataUrl(null);
                        setUploadedPantsValidation(null);
                        setUploadedPantsFileName(null);
                      }}
                      className="rounded-lg border border-line px-2.5 py-1.5 text-xs text-ink-mute hover:text-ink"
                    >
                      {zh ? "清除" : "Clear"}
                    </button>
                  )}
                  <label className="cursor-pointer rounded-lg border border-focus/60 bg-raised px-3 py-1.5 text-xs font-semibold text-ink hover:border-focus">
                    {zh ? "上传裤子" : "Upload Pants"}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) void handleClothingUpload(file, "pants");
                      }}
                    />
                  </label>
                </div>
              </div>

              {uploadedShirtDataUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setUploadedShirtDataUrl(null);
                    setUploadedShirtValidation(null);
                    setUploadedShirtFileName(null);
                  }}
                  className="text-xs text-ink-mute hover:text-ink underline"
                >
                  {zh ? "恢复内置示例上衣" : "Reset to built-in sample outfit"}
                </button>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-line bg-panel p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-ink-dim">
                  {zh ? "1. 选择风格预设与服装类型" : "1. Pick Preset & Clothing Type"}
                </h2>
                <div className="flex rounded-lg border border-line bg-surface p-0.5 text-xs">
                  {(["shirt", "pants"] as const).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setClothingKind(k)}
                      className={`rounded-md px-3 py-1 font-semibold transition ${
                        clothingKind === k
                          ? "bg-primary text-on-primary"
                          : "text-ink-dim hover:text-ink"
                      }`}
                    >
                      {k === "shirt"
                        ? zh
                          ? "上衣 Shirt"
                          : "Shirt"
                        : zh
                          ? "裤子 Pants"
                          : "Pants"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SHIRT_STYLE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className={`rounded-xl border p-2.5 text-left transition ${
                      presetId === preset.id
                        ? "border-focus bg-raised ring-1 ring-focus"
                        : "border-line bg-surface hover:border-ink-mute"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span
                        className="h-3 w-3 rounded-full border border-white/20"
                        style={{ backgroundColor: preset.baseColor }}
                      />
                      <span
                        className="h-3 w-3 rounded-full border border-white/20"
                        style={{ backgroundColor: preset.accentColor }}
                      />
                    </div>
                    <p className="text-xs font-semibold text-ink truncate">
                      {zh ? preset.nameZh : preset.nameEn}
                    </p>
                  </button>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <label className="block text-xs">
                  <span className="text-ink-dim font-medium block mb-1">
                    {zh ? "主体底色" : "Base Color"}
                  </span>
                  <input
                    type="color"
                    value={baseColor}
                    onChange={(e) => setBaseColor(e.target.value)}
                    className="h-9 w-full cursor-pointer rounded-lg border border-line bg-input p-1"
                  />
                </label>
                <label className="block text-xs">
                  <span className="text-ink-dim font-medium block mb-1">
                    {zh ? "袖子颜色" : "Sleeve Color"}
                  </span>
                  <input
                    type="color"
                    value={sleeveColor}
                    onChange={(e) => setSleeveColor(e.target.value)}
                    className="h-9 w-full cursor-pointer rounded-lg border border-line bg-input p-1"
                  />
                </label>
                <label className="block text-xs">
                  <span className="text-ink-dim font-medium block mb-1">
                    {zh ? "领口/条纹点缀" : "Accent Color"}
                  </span>
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="h-9 w-full cursor-pointer rounded-lg border border-line bg-input p-1"
                  />
                </label>
              </div>

              {clothingKind === "shirt" && (
                <>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block text-xs">
                      <span className="text-ink-dim font-medium block mb-1">
                        {zh ? "胸前文字徽标" : "Front Chest Text"}
                      </span>
                      <input
                        type="text"
                        maxLength={10}
                        value={frontText}
                        onChange={(e) => setFrontText(e.target.value.toUpperCase())}
                        placeholder="BLOX"
                        className="w-full rounded-lg border border-line bg-input px-3 py-2 text-xs font-semibold text-ink focus:border-focus focus:outline-none"
                      />
                    </label>
                    <label className="block text-xs">
                      <span className="text-ink-dim font-medium block mb-1">
                        {zh ? "领口款式" : "Collar Style"}
                      </span>
                      <select
                        value={collarStyle}
                        onChange={(e) => setCollarStyle(e.target.value as CollarStyle)}
                        className="w-full rounded-lg border border-line bg-input px-3 py-2 text-xs text-ink"
                      >
                        <option value="hoodie">{zh ? "连帽抽绳 Hoodie" : "Hoodie"}</option>
                        <option value="crew">{zh ? "圆领 Crewneck" : "Crewneck"}</option>
                        <option value="vneck">{zh ? "V 领 V-Neck" : "V-Neck"}</option>
                        <option value="zip">{zh ? "拉链夹克 Zip" : "Zipper Jacket"}</option>
                      </select>
                    </label>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <label className="flex items-center gap-2 text-xs text-ink-dim">
                      <input
                        type="checkbox"
                        checked={chestStripe}
                        onChange={(e) => setChestStripe(e.target.checked)}
                        className="accent-[#00a2ff]"
                      />
                      {zh ? "环绕胸口条纹" : "Wrap-around chest stripe"}
                    </label>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-ink-dim">
                        {zh ? "袖长:" : "Sleeves:"} {Math.round(sleeveLengthRatio * 100)}%
                      </span>
                      <input
                        type="range"
                        min={0.35}
                        max={1}
                        step={0.05}
                        value={sleeveLengthRatio}
                        onChange={(e) => setSleeveLengthRatio(Number(e.target.value))}
                        className="w-24 accent-[#00a2ff]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-surface p-3 text-xs">
                    <span className="text-ink-dim">
                      {zh ? "上传胸前自定义 Logo（可选）" : "Optional front chest Logo PNG"}
                    </span>
                    <div className="flex items-center gap-2">
                      {chestGraphicDataUrl && (
                        <button
                          type="button"
                          onClick={() => setChestGraphicDataUrl(null)}
                          className="text-ink-mute hover:text-ink underline"
                        >
                          {zh ? "移除" : "Remove"}
                        </button>
                      )}
                      <label className="cursor-pointer rounded-md border border-line bg-raised px-3 py-1 font-medium text-ink hover:border-focus">
                        {zh ? "选择印花" : "Upload Logo"}
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          className="sr-only"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) void handleChestGraphicUpload(f);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </>
              )}

              <div className="flex flex-wrap gap-2.5 pt-2 border-t border-line">
                <button
                  type="button"
                  onClick={downloadUploadReadyPng}
                  disabled={!shirtSheetDataUrl}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary hover:brightness-110 transition disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  {zh ? "导出 585×559 上传就绪 PNG（无水印）" : "Download 585×559 PNG (Upload-Ready)"}
                </button>
                <button
                  type="button"
                  onClick={downloadGuideSvg}
                  className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-xs font-semibold text-ink hover:border-focus transition"
                >
                  <Download className="h-3.5 w-3.5" />
                  {zh ? "下载带网格参考线 SVG" : "Download Reference SVG"}
                </button>
              </div>
            </div>
          )}

          {/* 2D UV Seam Inspector Card */}
          <div className="rounded-2xl border border-line bg-panel p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-focus" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-ink-dim">
                  {zh ? "2D UV 展开图与接缝参考（585×559）" : "2D 585×559 UV Seam Inspector"}
                </h2>
              </div>
              <label className="flex items-center gap-1.5 text-xs text-ink-dim cursor-pointer">
                <input
                  type="checkbox"
                  checked={showUvGuides}
                  onChange={(e) => setShowUvGuides(e.target.checked)}
                  className="accent-[#00a2ff]"
                />
                {zh ? "显示官方 UV 边框" : "Show UV Guides"}
              </label>
            </div>
            <div className="relative mx-auto max-w-[440px] overflow-hidden rounded-xl border border-line bg-surface canvas-grid">
              {shirtSheetDataUrl && (
                <img
                  src={shirtSheetDataUrl}
                  alt="585x559 Roblox classic clothing UV sheet"
                  className="block w-full h-auto"
                />
              )}
              {showUvGuides && (
                <svg
                  viewBox={`0 0 ${ROBLOX_CLOTHING_WIDTH} ${ROBLOX_CLOTHING_HEIGHT}`}
                  className="pointer-events-none absolute inset-0 h-full w-full"
                >
                  {CLOTHING_UV_REGIONS.map((r) => (
                    <g key={r.id}>
                      <rect
                        x={r.x}
                        y={r.y}
                        width={r.width}
                        height={r.height}
                        fill="none"
                        stroke={
                          r.part === "torso"
                            ? "#38bdf8"
                            : r.part === "rightLimb"
                              ? "#2dd4bf"
                              : "#c084fc"
                        }
                        strokeWidth="1.5"
                        strokeDasharray="4 2"
                      />
                      <text
                        x={r.x + r.width / 2}
                        y={r.y + 14}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="700"
                        fill="#e2e8f0"
                      >
                        {zh ? r.labelZh : r.labelEn}
                      </text>
                    </g>
                  ))}
                </svg>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Cross-tool Ecosystem Banner */}
      <div className="rounded-2xl border border-focus/30 bg-panel p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-focus">
            <Sparkles className="h-3.5 w-3.5" />
            {zh ? "需要给游戏做商店 GUI 或推广封面？" : "Building the rest of your Roblox game?"}
          </p>
          <p className="text-sm text-ink-dim">
            {zh
              ? "把衣服做好后，继续用我们的 AI GUI 编辑器、512×512 通行证图标工具或 1920×1080 缩略图生成器完成全套上架素材。"
              : "Pair your classic outfits with a custom AI Shop GUI, 512×512 Gamepass icons, and 1920×1080 Discover thumbnails."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5 shrink-0">
          <Link
            href="/editor"
            className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-on-primary hover:brightness-110 transition"
          >
            {zh ? "打开 GUI 编辑器" : "AI GUI Editor"}
          </Link>
          <Link
            href={zh ? "/zh/roblox-thumbnail-maker" : "/roblox-thumbnail-maker"}
            className="rounded-xl border border-line bg-surface px-4 py-2 text-xs font-semibold text-ink hover:border-focus transition"
          >
            {zh ? "1920×1080 缩略图制作" : "Thumbnail Maker"}
          </Link>
          <Link
            href={zh ? "/zh/gamepass-icon-maker" : "/gamepass-icon-maker"}
            className="rounded-xl border border-line bg-surface px-4 py-2 text-xs font-semibold text-ink hover:border-focus transition"
          >
            {zh ? "512×512 通行证图标" : "Gamepass Icons"}
          </Link>
        </div>
      </div>
    </div>
  );
}
