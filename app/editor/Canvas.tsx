"use client";

import { useEffect, useMemo, useState } from "react";
import type { DeviceKind, SceneNode } from "./catalog";
import { canvasGeometryStyle } from "./geometry";
import { assetIdNumber, resolveThumbnail } from "./image-assets";
import { layoutChildrenStyle } from "./layout-config";
import { orderedChildren, type PreviewVisibility } from "./scene";
import { useInteraction, type Corner } from "./useInteraction";
import { motionClosedOffset, resolveSceneMotion, type ResolvedMotion } from "./motion";
import {
  previewHoverScale,
  previewTransitionDurationMs,
  type PreviewMotionController,
  type PreviewMotionState,
} from "./motion-preview";

const FRAME_CLASS: Record<DeviceKind, string> = {
  desktop: "w-full max-w-[860px] aspect-video",
  tablet: "w-full max-w-[600px] aspect-[4/3]",
  mobile: "h-full max-h-[540px] aspect-[9/19.5]",
};

const DEVICE_LABEL: Record<DeviceKind, string> = {
  desktop: "Desktop · 1920×1080",
  tablet: "Tablet · 1024×768",
  mobile: "Mobile · 375×812",
};

const HANDLES: { corner: Corner; pos: string; cursor: string }[] = [
  { corner: "nw", pos: "-top-1 -left-1", cursor: "cursor-nwse-resize" },
  { corner: "ne", pos: "-top-1 -right-1", cursor: "cursor-nesw-resize" },
  { corner: "sw", pos: "-bottom-1 -left-1", cursor: "cursor-nesw-resize" },
  { corner: "se", pos: "-bottom-1 -right-1", cursor: "cursor-nwse-resize" },
];

type Props = {
  scene: SceneNode[];
  selectedId: string | null;
  device: DeviceKind;
  onSelect: (id: string | null) => void;
  onChange: (id: string, patch: Partial<SceneNode>) => void;
  previewVisibility: PreviewVisibility | null;
  previewNotice: string | null;
  onPreviewAction: (id: string) => void;
  controllers: PreviewMotionState;
  reducedMotion: boolean;
  onTransitionComplete: (id: string, token: number) => void;
  onHoverInput: (id: string, input: "pointer" | "focus", active: boolean) => void;
};

export function Canvas({
  scene,
  selectedId,
  device,
  onSelect,
  onChange,
  previewVisibility,
  previewNotice,
  onPreviewAction,
  controllers,
  reducedMotion,
  onTransitionComplete,
  onHoverInput,
}: Props) {
  const { startMove, startResize } = useInteraction(onChange);
  const resolvedMotion = useMemo(() => resolveSceneMotion(scene), [scene]);

  const getChild = (parentId: string | null) => orderedChildren(scene, parentId);

  return (
    <div className="flex-1 min-w-0 flex flex-col bg-surface">
      <div className="h-9 shrink-0 flex items-center justify-between px-4 border-b border-line">
        <span className="text-[11px] font-bold uppercase tracking-wider text-ink-dim">
          Canvas
        </span>
        <span className="text-[11px] text-ink-mute font-mono">
          {DEVICE_LABEL[device]}
        </span>
      </div>

      <div
        className="flex-1 canvas-grid grid place-items-center p-8 overflow-hidden"
        onPointerDown={() => onSelect(null)}
      >
        <div
          className={`relative rounded-xl overflow-hidden bg-base ring-1 ring-line-soft shadow-2xl shadow-black/50 ${FRAME_CLASS[device]}`}
        >
          {previewNotice && (
            <div
              role="status"
              className="pointer-events-none absolute left-1/2 top-3 z-[100] -translate-x-1/2 rounded-md border border-line bg-panel/95 px-3 py-2 text-xs text-ink shadow-lg"
            >
              {previewNotice}
            </div>
          )}
          {getChild(null).map((node) => (
            <NodeView
              key={node.id}
              node={node}
              containerLayout="none"
              getChild={getChild}
              selectedId={selectedId}
              onSelect={onSelect}
              startMove={startMove}
              startResize={startResize}
              previewVisibility={previewVisibility}
              onPreviewAction={onPreviewAction}
              resolvedMotion={resolvedMotion}
              controllers={controllers}
              reducedMotion={reducedMotion}
              onTransitionComplete={onTransitionComplete}
              onHoverInput={onHoverInput}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function NodeView({
  node,
  containerLayout,
  getChild,
  selectedId,
  onSelect,
  startMove,
  startResize,
  previewVisibility,
  onPreviewAction,
  resolvedMotion,
  controllers,
  reducedMotion,
  onTransitionComplete,
  onHoverInput,
}: {
  node: SceneNode;
  containerLayout: "none" | "list" | "grid";
  getChild: (parentId: string | null) => SceneNode[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  startMove: (e: React.PointerEvent, node: SceneNode) => void;
  startResize: (e: React.PointerEvent, node: SceneNode, corner: Corner) => void;
  previewVisibility: PreviewVisibility | null;
  onPreviewAction: (id: string) => void;
  resolvedMotion: ReadonlyMap<string, ResolvedMotion>;
  controllers: PreviewMotionState;
  reducedMotion: boolean;
  onTransitionComplete: (id: string, token: number) => void;
  onHoverInput: (id: string, input: "pointer" | "focus", active: boolean) => void;
}) {
  const thumbnail = useRobloxThumbnail(
    node.cls === "ImageLabel" ? node.image : undefined
  );
  // a flowed child (its parent has a layout) is arranged by the layout,
  // so we don't absolute-position or allow dragging it.
  const isFlow = containerLayout !== "none";
  const kids = getChild(node.id);
  const visible =
    node.transparency < 1 || node.text != null || !!node.gradient || kids.length > 0;
  if (!visible) return null;
  const controller = controllers[node.id];
  if (previewVisibility && previewVisibility[node.id] === false && controller?.phase !== "closing") return null;

  const selected = node.id === selectedId;
  const startsHidden = !previewVisibility && node.initialVisible === false;
  const selectedInside =
    selectedId !== null && containsNode(node.id, selectedId, getChild);
  if (startsHidden && !selectedInside) return null;
  const background = node.gradient
    ? `linear-gradient(135deg, ${node.gradient.from}, ${node.gradient.to})`
    : node.transparency >= 1
      ? "transparent"
      : hexToRgba(node.color, 1 - node.transparency);
  const geometryStyle = canvasGeometryStyle(node);
  const resolved = previewVisibility ? resolvedMotion.get(node.id) : undefined;
  const motionStyle = previewMotionStyle(geometryStyle.transform, resolved, controller, reducedMotion);
  const flowStyle =
    containerLayout === "grid"
      ? { width: "100%", height: "100%" }
      : containerLayout === "list"
        ? { flexShrink: 0 }
        : {};

  return (
    <div
      data-node-id={node.id}
      data-image-state={node.cls === "ImageLabel" ? thumbnail.state : undefined}
      data-motion-phase={controller?.phase}
      data-effective-motion={previewVisibility ? resolved?.effectivePreset ?? "none" : undefined}
      data-motion-token={controller?.token}
      data-motion-initial-closed={controller?.phase === "closed" && controller.token === 0 ? "true" : undefined}
      tabIndex={previewVisibility && node.cls === "TextButton" ? 0 : undefined}
      onPointerEnter={() => controller && onHoverInput(node.id, "pointer", true)}
      onPointerLeave={() => controller && onHoverInput(node.id, "pointer", false)}
      onFocus={() => controller && onHoverInput(node.id, "focus", true)}
      onBlur={() => controller && onHoverInput(node.id, "focus", false)}
      onTransitionEnd={(event) => {
        if (!controller || event.currentTarget !== event.target || !resolved?.effectivePreset) return;
        const property = resolved.effectivePreset === "fade" ? "opacity" : "transform";
        if (event.propertyName === property) onTransitionComplete(node.id, controller.token);
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        if (previewVisibility) {
          if (node.cls === "TextButton") onPreviewAction(node.id);
          return;
        }
        onSelect(node.id);
        if (!isFlow) startMove(e, node);
      }}
      className={
        isFlow
          ? "relative select-none touch-none"
          : "absolute select-none touch-none cursor-move"
      }
      style={{
        ...geometryStyle,
        ...(isFlow
          ? {
              left: undefined,
              top: undefined,
              transform: node.rotation
                ? `rotate(${node.rotation}deg)`
                : undefined,
              ...flowStyle,
            }
          : {}),
        ...motionStyle,
        background,
        borderRadius: node.cornerRadius,
        boxShadow: node.stroke
          ? `inset 0 0 0 ${node.stroke.thickness}px ${hexToRgba(
              node.stroke.color,
              1 - node.stroke.transparency
            )}`
          : undefined,
        containerType: "inline-size",
        zIndex: node.zindex,
        opacity: !previewVisibility && node.initialVisible === false ? 0.45 : 1,
        cursor: previewVisibility && node.cls === "TextButton" ? "pointer" : undefined,
        pointerEvents: startsHidden && !selected ? "none" : undefined,
      }}
    >
      {node.cls === "ImageLabel" && node.image && (
        thumbnail.state === "loaded" && thumbnail.url ? (
          <>
            {/* Roblox thumbnails resolve at runtime and already have a bounded editor box. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbnail.url}
              alt=""
              onError={thumbnail.markUnavailable}
              className="pointer-events-none absolute inset-0 h-full w-full object-contain"
            />
            {node.imageColor && node.imageColor !== "#ffffff" && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 mix-blend-multiply"
                style={{ backgroundColor: node.imageColor }}
              />
            )}
          </>
        ) : (
          <span className="pointer-events-none absolute inset-0 grid place-items-center px-2 text-center font-mono text-[10px] text-ink-mute">
            Asset {assetIdNumber(node.image)}
          </span>
        )
      )}
      {node.text != null && (
        <span
          className="absolute inset-0 grid place-items-center px-2 text-center leading-none pointer-events-none"
          style={{
            color: node.textColor,
            fontSize: node.textScaled
              ? `clamp(10px, 8cqw, ${node.textSize ?? 14}px)`
              : node.textSize,
            whiteSpace: node.textWrapped ? "normal" : "nowrap",
            overflowWrap: node.textWrapped ? "anywhere" : undefined,
            overflow: "hidden",
            textShadow: node.stroke
              ? textStrokeShadow(node.stroke)
              : undefined,
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

      {selected && !isFlow && (
        <>
          <span className="absolute -inset-px rounded-[inherit] ring-2 ring-focus pointer-events-none" />
          {HANDLES.map((h) => (
            <span
              key={h.corner}
              onPointerDown={(e) => startResize(e, node, h.corner)}
              className={`absolute ${h.pos} w-2.5 h-2.5 rounded-sm bg-focus border-2 border-base ${h.cursor}`}
            />
          ))}
        </>
      )}

      {startsHidden && (
        <button
          type="button"
          onPointerDown={(event) => {
            event.stopPropagation();
            onSelect(node.id);
          }}
          className="absolute right-1 top-1 z-50 rounded bg-base/90 px-1.5 py-0.5 text-[9px] font-semibold text-warning pointer-events-auto cursor-pointer"
        >
          Starts hidden
        </button>
      )}

      {kids.length > 0 && (
        <ChildrenWrapper node={node}>
          {kids.map((c) => (
            <NodeView
              key={c.id}
              node={c}
              containerLayout={node.layout ?? "none"}
              getChild={getChild}
              selectedId={selectedId}
              onSelect={onSelect}
              startMove={startMove}
              startResize={startResize}
              previewVisibility={previewVisibility}
              onPreviewAction={onPreviewAction}
              resolvedMotion={resolvedMotion}
              controllers={controllers}
              reducedMotion={reducedMotion}
              onTransitionComplete={onTransitionComplete}
              onHoverInput={onHoverInput}
            />
          ))}
        </ChildrenWrapper>
      )}
    </div>
  );
}

function previewMotionStyle(
  canonicalTransform: string | undefined,
  resolved: ResolvedMotion | undefined,
  controller: PreviewMotionController | undefined,
  reducedMotion: boolean,
): React.CSSProperties {
  if (!resolved || !controller) return {};
  const closed = controller.phase === "closed" || controller.phase === "closing";
  const transforms = canonicalTransform ? [canonicalTransform] : [];
  if (resolved.effectivePreset === "slide" && closed) {
    const offset = motionClosedOffset(resolved.slideDirection);
    transforms.push(`translate(${offset.x}px, ${offset.y}px)`);
  }
  const visibilityScale = resolved.effectivePreset === "scale" && closed ? 0.92 : 1;
  const hoverScale = previewHoverScale(controller, reducedMotion);
  if (visibilityScale * hoverScale !== 1) transforms.push(`scale(${visibilityScale * hoverScale})`);
  const duration = previewTransitionDurationMs(controller, resolved.durationMs, reducedMotion);
  const property = resolved.effectivePreset === "fade" ? "opacity" : "transform";
  return {
    transform: transforms.length ? transforms.join(" ") : "none",
    opacity: resolved.effectivePreset === "fade" && closed ? 0 : 1,
    transitionProperty: property,
    transitionDuration: `${duration}ms`,
    transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  };
}

type ThumbnailPreview = {
  state: "idle" | "loading" | "loaded" | "unavailable";
  url: string | null;
  markUnavailable: () => void;
};

function useRobloxThumbnail(image?: string): ThumbnailPreview {
  const [preview, setPreview] = useState<
    Pick<ThumbnailPreview, "state" | "url">
  >({ state: "idle", url: null });

  useEffect(() => {
    let active = true;
    if (!image) {
      setPreview({ state: "idle", url: null });
      return () => {
        active = false;
      };
    }

    setPreview({ state: "loading", url: null });
    void resolveThumbnail(image).then((url) => {
      if (!active) return;
      setPreview({
        state: url ? "loaded" : "unavailable",
        url,
      });
    });

    return () => {
      active = false;
    };
  }, [image]);

  return {
    ...preview,
    markUnavailable: () =>
      setPreview({ state: "unavailable", url: null }),
  };
}

function containsNode(
  rootId: string,
  targetId: string,
  getChild: (parentId: string | null) => SceneNode[]
): boolean {
  if (rootId === targetId) return true;
  return getChild(rootId).some((child) =>
    containsNode(child.id, targetId, getChild)
  );
}

function ChildrenWrapper({
  node,
  children,
}: {
  node: SceneNode;
  children: React.ReactNode;
}) {
  return (
    <div
      data-layout={node.layout ?? "none"}
      data-automatic-canvas-size={
        node.cls === "ScrollingFrame" ? node.automaticCanvasSize ?? "none" : "none"
      }
      style={layoutChildrenStyle(node)}
    >
      {children}
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
