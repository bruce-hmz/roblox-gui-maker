// Read-only renderer for a scene — used on template/landing pages to show
// what a GUI looks like in-game, with no editor chrome or interactions.
// Server component (SSR-friendly) so preview content lands in the HTML for SEO.

import type { DeviceKind, SceneNode } from "./catalog";

const ASPECT: Record<DeviceKind, string> = {
  desktop: "aspect-video",
  tablet: "aspect-[4/3]",
  mobile: "aspect-[9/19.5]",
};

// Text sizes were tuned for the editor's 860px-wide desktop canvas. In smaller
// previews (thumbnail cards) that absolute px would overflow the scaled-down
// frames, so text scales with the container via cqw (capped at the design size).
const DESIGNED_WIDTH = 860;

export function ScenePreview({
  scene,
  device = "desktop",
}: {
  scene: SceneNode[];
  device?: DeviceKind;
}) {
  const childrenOf = (id: string | null) =>
    scene.filter((n) => (n.parentId ?? null) === id);

  return (
    <div
      className={`relative w-full ${ASPECT[device]} rounded-xl overflow-hidden bg-page ring-1 ring-line-soft`}
      style={{ containerType: "inline-size" }}
    >
      {childrenOf(null).map((n) => (
        <PreviewNode key={n.id} node={n} getChild={childrenOf} containerLayout="none" />
      ))}
    </div>
  );
}

function PreviewNode({
  node,
  getChild,
  containerLayout,
}: {
  node: SceneNode;
  getChild: (id: string | null) => SceneNode[];
  containerLayout: "none" | "list" | "grid";
}) {
  // A node hidden at start (initialVisible: false) isn't shown in a static
  // preview — rendering it would overlap the initially-visible layer.
  if (node.initialVisible === false) return null;
  const isFlow = containerLayout !== "none";
  const kids = getChild(node.id);
  const background = node.gradient
    ? `linear-gradient(${(node.gradient.rotation ?? 0) + 90}deg, ${node.gradient.stops
        .map((s) => `${s.color} ${Math.round(s.at * 100)}%`)
        .join(", ")})`
    : node.transparency >= 1
      ? "transparent"
      : hexToRgba(node.color, 1 - node.transparency);

  const wrapperClass =
    node.layout === "list"
      ? "absolute inset-0 flex flex-col gap-2 overflow-hidden"
      : node.layout === "grid"
        ? "absolute inset-0 grid grid-cols-3 gap-2 overflow-hidden"
        : "absolute inset-0";
  const wrapperStyle = node.padding ? { padding: `${node.padding}px` } : undefined;

  return (
    <div
      className={isFlow ? "relative" : "absolute"}
      style={{
        ...(isFlow ? {} : { left: `${node.pos.x * 100}%`, top: `${node.pos.y * 100}%` }),
        width: `${node.size.x * 100}%`,
        height: `${node.size.y * 100}%`,
        background,
        borderRadius: node.cornerRadius,
        boxShadow: node.stroke
          ? `inset 0 0 0 ${node.stroke.thickness}px ${hexToRgba(node.stroke.color, 1 - node.stroke.transparency)}`
          : undefined,
        zIndex: node.zindex,
      }}
    >
      {node.text != null && (
        <span
          className="absolute inset-0 grid place-items-center px-2 text-center leading-none overflow-hidden"
          style={{
            color: node.textColor,
            fontSize:
              node.textSize != null
                ? `min(${((node.textSize * 100) / DESIGNED_WIDTH).toFixed(2)}cqw, ${node.textSize}px)`
                : undefined,
            fontWeight: node.font?.includes("Black")
              ? 800
              : node.font?.includes("Bold")
                ? 700
                : 500,
            textShadow: node.stroke ? textStrokeShadow(node.stroke) : undefined,
          }}
        >
          {node.text}
        </span>
      )}
      {kids.length > 0 && (
        <div className={wrapperClass} style={wrapperStyle}>
          {kids.map((c) => (
            <PreviewNode
              key={c.id}
              node={c}
              getChild={getChild}
              containerLayout={node.layout ?? "none"}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function hexToRgba(hex: string, alpha: number): string {
  const m = /^#?([0-9a-f]{6})$/i.exec((hex ?? "").trim());
  if (!m) return `rgba(40, 41, 51, ${alpha})`;
  const n = parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

function textStrokeShadow(stroke: NonNullable<SceneNode["stroke"]>): string {
  const width = Math.max(0, stroke.thickness);
  const color = hexToRgba(stroke.color, 1 - stroke.transparency);
  return [
    `${width}px 0 ${color}`,
    `-${width}px 0 ${color}`,
    `0 ${width}px ${color}`,
    `0 -${width}px ${color}`,
  ].join(", ");
}
