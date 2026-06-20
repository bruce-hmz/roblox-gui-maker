// Read-only renderer for a scene — used on template/landing pages to show
// what a GUI looks like in-game, with no editor chrome or interactions.
// Server component (SSR-friendly) so preview content lands in the HTML for SEO.

import type { DeviceKind, SceneNode } from "./catalog";
import { layoutChildrenStyle } from "./layout-config";
import { orderedChildren } from "./scene";

const ASPECT: Record<DeviceKind, string> = {
  desktop: "aspect-video",
  tablet: "aspect-[4/3]",
  mobile: "aspect-[9/19.5]",
};

export function ScenePreview({
  scene,
  device = "desktop",
}: {
  scene: SceneNode[];
  device?: DeviceKind;
}) {
  const childrenOf = (id: string | null) =>
    orderedChildren(scene, id);

  return (
    <div
      className={`relative w-full ${ASPECT[device]} rounded-xl overflow-hidden bg-base ring-1 ring-line-soft`}
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
    ? `linear-gradient(135deg, ${node.gradient.from}, ${node.gradient.to})`
    : node.transparency >= 1
      ? "transparent"
      : hexToRgba(node.color, 1 - node.transparency);

  const flowStyle =
    containerLayout === "grid"
      ? { width: "100%", height: "100%" }
      : containerLayout === "list"
        ? { flexShrink: 0 }
        : {};

  return (
    <div
      className={isFlow ? "relative" : "absolute"}
      style={{
        ...(isFlow ? {} : { left: `${node.pos.x * 100}%`, top: `${node.pos.y * 100}%` }),
        width: containerLayout === "grid" ? "100%" : `${node.size.x * 100}%`,
        height: containerLayout === "grid" ? "100%" : `${node.size.y * 100}%`,
        ...flowStyle,
        background,
        borderRadius: node.cornerRadius,
        zIndex: node.zindex,
      }}
    >
      {node.text != null && (
        <span
          className="absolute inset-0 grid place-items-center px-2 text-center leading-none"
          style={{
            color: node.textColor,
            fontSize: node.textSize,
            fontWeight: node.font?.includes("Black")
              ? 800
              : node.font?.includes("Bold")
                ? 700
                : 500,
          }}
        >
          {node.text}
        </span>
      )}
      {kids.length > 0 && (
        <div
          data-layout={node.layout ?? "none"}
          data-automatic-canvas-size={
            node.cls === "ScrollingFrame" ? node.automaticCanvasSize ?? "none" : "none"
          }
          style={layoutChildrenStyle(node)}
        >
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
