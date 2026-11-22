// Deterministic Roblox UDim2 Offset <-> Scale math and responsive Luau
// constraint code generator. Pure TS, zero DOM or Node imports.

export type ViewportPreset = {
  id: string;
  labelEn: string;
  labelZh: string;
  width: number;
  height: number;
};

export const VIEWPORT_PRESETS: readonly ViewportPreset[] = [
  { id: "desktop-1080", labelEn: "Desktop (1920×1080)", labelZh: "桌面 1080p (1920×1080)", width: 1920, height: 1080 },
  { id: "laptop-768", labelEn: "Laptop (1366×768)", labelZh: "笔记本 (1366×768)", width: 1366, height: 768 },
  { id: "tablet", labelEn: "Tablet (1024×768)", labelZh: "平板 (1024×768)", width: 1024, height: 768 },
  { id: "mobile-landscape", labelEn: "Phone Landscape (844×390)", labelZh: "手机横屏 (844×390)", width: 844, height: 390 },
  { id: "mobile-portrait", labelEn: "Phone Portrait (390×844)", labelZh: "手机竖屏 (390×844)", width: 390, height: 844 },
  { id: "uhd-4k", labelEn: "4K Monitor (3840×2160)", labelZh: "4K 显示器 (3840×2160)", width: 3840, height: 2160 },
] as const;

export function roundScale(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Number(value.toFixed(4));
}

export function pixelsToScale(
  offsetX: number,
  offsetY: number,
  parentWidth: number,
  parentHeight: number
): { x: number; y: number } {
  const safeW = Math.max(1, parentWidth);
  const safeH = Math.max(1, parentHeight);
  return {
    x: roundScale(offsetX / safeW),
    y: roundScale(offsetY / safeH),
  };
}

export function scaleToPixels(
  scaleX: number,
  scaleY: number,
  parentWidth: number,
  parentHeight: number
): { x: number; y: number } {
  const safeW = Math.max(1, parentWidth);
  const safeH = Math.max(1, parentHeight);
  return {
    x: Math.round(scaleX * safeW),
    y: Math.round(scaleY * safeH),
  };
}

export function generateResponsiveConstraintLuau(options: {
  instanceName?: string;
  scalePos: { x: number; y: number };
  scaleSize: { x: number; y: number };
  anchorPoint: { x: number; y: number };
  aspectRatio?: number | null;
  minSize?: { x: number; y: number } | null;
  maxSize?: { x: number; y: number } | null;
}): string {
  const varName =
    (options.instanceName ?? "panel")
      .replace(/[^a-zA-Z0-9_]/g, "")
      .replace(/^[0-9]+/, "") || "panel";
  const lines = [
    `local ${varName} = Instance.new("Frame")`,
    `${varName}.AnchorPoint = Vector2.new(${roundScale(options.anchorPoint.x)}, ${roundScale(options.anchorPoint.y)})`,
    `${varName}.Position = UDim2.fromScale(${roundScale(options.scalePos.x)}, ${roundScale(options.scalePos.y)})`,
    `${varName}.Size = UDim2.fromScale(${roundScale(options.scaleSize.x)}, ${roundScale(options.scaleSize.y)})`,
  ];

  if (options.aspectRatio && Number.isFinite(options.aspectRatio) && options.aspectRatio > 0) {
    lines.push(
      `local aspect = Instance.new("UIAspectRatioConstraint")`,
      `aspect.AspectRatio = ${Number(options.aspectRatio.toFixed(4))}`,
      `aspect.Parent = ${varName}`
    );
  }

  if (options.minSize || options.maxSize) {
    lines.push(`local sizeLimit = Instance.new("UISizeConstraint")`);
    if (options.minSize) {
      lines.push(
        `sizeLimit.MinSize = Vector2.new(${Math.max(0, Math.round(options.minSize.x))}, ${Math.max(0, Math.round(options.minSize.y))})`
      );
    }
    if (options.maxSize) {
      lines.push(
        `sizeLimit.MaxSize = Vector2.new(${Math.max(1, Math.round(options.maxSize.x))}, ${Math.max(1, Math.round(options.maxSize.y))})`
      );
    }
    lines.push(`sizeLimit.Parent = ${varName}`);
  }

  return lines.join("\n");
}
