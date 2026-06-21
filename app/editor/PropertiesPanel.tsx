"use client";

import {
  Box,
  Circle,
  Copy,
  Eye,
  Image as ImageIcon,
  Layers,
  Move,
  Palette as PaletteIcon,
  Trash2,
  Type,
  Zap,
} from "lucide-react";
import type { NodeAction, SceneNode } from "./catalog";
import {
  alignNode,
  setAnchorPreservingPosition,
  validAspectRatio,
  validSizeConstraints,
} from "./geometry";
import { FONTS } from "./scene";
import { RemoteEventActionFields } from "./RemoteEventActionFields";
import { TeleportActionFields } from "./TeleportActionFields";
import { ImageAssetField } from "./ImageAssetField";
import { LayoutProperties } from "./LayoutProperties";
import { MotionProperties } from "./MotionProperties";
import { isMotionClass } from "./motion";

type Props = {
  node: SceneNode | null;
  scene: SceneNode[];
  onChange: (id: string, patch: Partial<SceneNode>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
};

const round2 = (v: number) => Math.round(v * 100) / 100;
const ZERO_VECTOR = { x: 0, y: 0 };
const ALIGNMENTS = [
  { x: 0, y: 0, label: "Top left" },
  { x: 0.5, y: 0, label: "Top center" },
  { x: 1, y: 0, label: "Top right" },
  { x: 0, y: 0.5, label: "Middle left" },
  { x: 0.5, y: 0.5, label: "Center" },
  { x: 1, y: 0.5, label: "Middle right" },
  { x: 0, y: 1, label: "Bottom left" },
  { x: 0.5, y: 1, label: "Bottom center" },
  { x: 1, y: 1, label: "Bottom right" },
] as const;

function createAction(type: string): NodeAction | undefined {
  if (type === "show") return { type: "show" };
  if (type === "hide") return { type: "hide" };
  if (type === "toggle") return { type: "toggle" };
  if (type === "hideGui") return { type: "hideGui" };
  if (type === "remoteEvent") {
    return { type: "remoteEvent", eventName: "RemoteAction", argument: "" };
  }
  if (type === "teleport") return { type: "teleport", placeId: "1" };
  return undefined;
}

export function PropertiesPanel({ node, scene, onChange, onDelete, onDuplicate }: Props) {
  const actionTargets = scene.filter(
    (item) => item.cls === "Frame" || item.cls === "ScrollingFrame"
  );
  return (
    <aside className="w-72 shrink-0 bg-panel border-l border-line flex flex-col">
      <div className="h-9 shrink-0 flex items-center px-3 border-b border-line">
        <span className="text-[11px] font-bold uppercase tracking-wider text-ink-dim">
          Properties
        </span>
      </div>

      {node ? (
        <div className="flex-1 overflow-y-auto scroll-thin p-3 flex flex-col gap-4">
          <div className="flex items-center gap-2 px-1">
            <span className="grid place-items-center w-6 h-6 rounded bg-input text-focus">
              <Box className="w-3.5 h-3.5" />
            </span>
            <div className="flex-1 min-w-0">
              <input
                value={node.name}
                onChange={(e) => onChange(node.id, { name: e.target.value })}
                className="w-full bg-transparent text-sm font-medium text-ink outline-none focus:ring-1 focus:ring-focus rounded px-1 -mx-1"
              />
              <p className="text-[11px] text-ink-mute font-mono px-1">{node.cls}</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onDuplicate(node.id)}
                title="Duplicate (⌘D / Ctrl+D)"
                className="grid place-items-center w-7 h-7 rounded text-ink-mute hover:text-ink hover:bg-raised transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(node.id)}
                title="Delete (Delete)"
                className="grid place-items-center w-7 h-7 rounded text-ink-mute hover:text-danger hover:bg-raised transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <Group icon={Move} label="Layout">
            <Row label="Position" stacked>
              <UDim2Input
                scale={node.pos}
                offset={node.posOffset ?? ZERO_VECTOR}
                onScale={(axis, value) =>
                  onChange(node.id, {
                    pos: { ...node.pos, [axis]: round2(value) },
                  })
                }
                onOffset={(axis, value) => {
                  const next = {
                    ...(node.posOffset ?? ZERO_VECTOR),
                    [axis]: Math.round(value),
                  };
                  onChange(node.id, {
                    posOffset: next.x === 0 && next.y === 0 ? undefined : next,
                  });
                }}
              />
            </Row>
            <Row label="Size" stacked>
              <UDim2Input
                scale={node.size}
                offset={node.sizeOffset ?? ZERO_VECTOR}
                onScale={(axis, value) =>
                  onChange(node.id, {
                    size: { ...node.size, [axis]: round2(value) },
                  })
                }
                onOffset={(axis, value) => {
                  const next = {
                    ...(node.sizeOffset ?? ZERO_VECTOR),
                    [axis]: Math.round(value),
                  };
                  onChange(node.id, {
                    sizeOffset: next.x === 0 && next.y === 0 ? undefined : next,
                  });
                }}
              />
            </Row>
            {node.cls !== "ScreenGui" && (
              <Row label="Rotation">
                <NumberInput
                  ariaLabel="Rotation"
                  value={node.rotation ?? 0}
                  step={1}
                  min={-360}
                  max={360}
                  onValue={(value) =>
                    onChange(node.id, {
                      rotation: Math.max(-360, Math.min(360, value)),
                    })
                  }
                />
              </Row>
            )}
            <Row label="AnchorPoint" stacked>
              <PairInput
                x={node.anchor?.x ?? 0}
                y={node.anchor?.y ?? 0}
                onX={(value) =>
                  onChange(
                    node.id,
                    setAnchorPreservingPosition(node, {
                      x: round2(value),
                      y: node.anchor?.y ?? 0,
                    })
                  )
                }
                onY={(value) =>
                  onChange(
                    node.id,
                    setAnchorPreservingPosition(node, {
                      x: node.anchor?.x ?? 0,
                      y: round2(value),
                    })
                  )
                }
              />
              <div
                className="mt-2 grid grid-cols-3 gap-1"
                role="group"
                aria-label="Alignment presets"
              >
                {ALIGNMENTS.map((alignment) => {
                  const active =
                    (node.anchor?.x ?? 0) === alignment.x &&
                    (node.anchor?.y ?? 0) === alignment.y;
                  return (
                    <button
                      key={alignment.label}
                      type="button"
                      aria-label={`Align ${alignment.label.toLowerCase()}`}
                      aria-pressed={active}
                      onClick={() => onChange(node.id, alignNode(alignment))}
                      className={`h-6 rounded border transition-colors ${
                        active
                          ? "border-focus bg-focus/20 text-focus"
                          : "border-line bg-input text-ink-mute hover:text-ink"
                      }`}
                    >
                      <span className="mx-auto block h-1.5 w-1.5 rounded-full bg-current" />
                    </button>
                  );
                })}
              </div>
            </Row>
            <Row label="Aspect ratio">
              <input
                type="checkbox"
                aria-label="Enable aspect ratio constraint"
                checked={node.aspectRatio !== undefined}
                onChange={(event) =>
                  onChange(node.id, {
                    aspectRatio: event.target.checked ? 16 / 9 : undefined,
                  })
                }
                className="h-4 w-4 accent-focus"
              />
            </Row>
            {node.aspectRatio !== undefined && (
              <div className="px-1 pb-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-ink-mute">Ratio</span>
                  <NumberInput
                    value={node.aspectRatio}
                    step={0.001}
                    min={0.001}
                    onValue={(value) => {
                      if (validAspectRatio(value)) {
                        onChange(node.id, { aspectRatio: value });
                      }
                    }}
                  />
                </div>
                <p className="mt-1 text-[10px] text-ink-mute">Width controls height</p>
              </div>
            )}
            <Row label="Size constraints">
              <input
                type="checkbox"
                aria-label="Enable size constraints"
                checked={node.minSize !== undefined || node.maxSize !== undefined}
                onChange={(event) =>
                  onChange(
                    node.id,
                    event.target.checked
                      ? {
                          minSize: { x: 0, y: 0 },
                          maxSize: { x: 1920, y: 1080 },
                        }
                      : { minSize: undefined, maxSize: undefined }
                  )
                }
                className="h-4 w-4 accent-focus"
              />
            </Row>
            {(node.minSize || node.maxSize) && (
              <SizeConstraintInputs node={node} onChange={onChange} />
            )}
          </Group>

          {node.cls === "ImageLabel" && (
            <Group icon={ImageIcon} label="Image">
              <Row label="Asset ID" stacked>
                <ImageAssetField
                  nodeId={node.id}
                  value={node.image}
                  onCommit={(image) => onChange(node.id, { image })}
                />
              </Row>
              <Row label="ImageColor3">
                <ColorInput
                  value={node.imageColor ?? "#ffffff"}
                  onValue={(imageColor) => onChange(node.id, { imageColor })}
                  ariaLabel="Image tint"
                />
              </Row>
            </Group>
          )}

          <Group icon={PaletteIcon} label="Appearance">
            <Row label="BackgroundColor3">
              <ColorInput
                value={node.color}
                onValue={(v) => onChange(node.id, { color: v })}
              />
            </Row>
            <Row label="Transparency" stacked>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={node.transparency}
                onChange={(e) =>
                  onChange(node.id, { transparency: parseFloat(e.target.value) })
                }
                className="w-full accent-focus"
              />
            </Row>
            <Row label="CornerRadius">
              <NumberInput
                value={node.cornerRadius}
                step={1}
                min={0}
                onValue={(v) => onChange(node.id, { cornerRadius: Math.round(v) })}
              />
            </Row>
          </Group>

          {(node.cls === "ScreenGui" ||
            node.cls === "Frame" ||
            node.cls === "ScrollingFrame") && (
            <LayoutProperties key={node.id} node={node} onChange={onChange} />
          )}

          {node.text != null && (
            <Group icon={Type} label="Text">
              <Row label="Text" stacked>
                <input
                  value={node.text}
                  onChange={(e) => onChange(node.id, { text: e.target.value })}
                  className="w-full px-2 py-1 rounded bg-input text-ink text-xs outline-none focus:ring-1 focus:ring-focus"
                />
              </Row>
              <Row label="Font" stacked>
                <select
                  value={node.font ?? "GothamMedium"}
                  onChange={(e) => onChange(node.id, { font: e.target.value })}
                  className="w-full px-2 py-1 rounded bg-input text-ink text-xs outline-none focus:ring-1 focus:ring-focus"
                >
                  {FONTS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </Row>
              <Row label="TextSize">
                <NumberInput
                  value={node.textSize ?? 14}
                  step={1}
                  min={6}
                  onValue={(v) => onChange(node.id, { textSize: Math.round(v) })}
                />
              </Row>
              <Row label="TextColor3">
                <ColorInput
                  value={node.textColor ?? "#e1e1ef"}
                  onValue={(v) => onChange(node.id, { textColor: v })}
                />
              </Row>
              <Row label="TextScaled">
                <input
                  type="checkbox"
                  aria-label="Scale text to fit"
                  checked={node.textScaled === true}
                  onChange={(event) =>
                    onChange(node.id, { textScaled: event.target.checked })
                  }
                  className="h-4 w-4 accent-focus"
                />
              </Row>
              <Row label="TextWrapped">
                <input
                  type="checkbox"
                  aria-label="Wrap text"
                  checked={node.textWrapped === true}
                  onChange={(event) =>
                    onChange(node.id, { textWrapped: event.target.checked })
                  }
                  className="h-4 w-4 accent-focus"
                />
              </Row>
            </Group>
          )}

          {node.cls !== "ScreenGui" && (
            <Group icon={Circle} label="Stroke">
              <Row label="Enabled">
                <input
                  type="checkbox"
                  aria-label="Enable stroke"
                  checked={node.stroke !== undefined}
                  onChange={(event) =>
                    onChange(node.id, {
                      stroke: event.target.checked
                        ? {
                            color: "#000000",
                            transparency: 0,
                            thickness: 1,
                          }
                        : undefined,
                    })
                  }
                  className="h-4 w-4 accent-focus"
                />
              </Row>
              {node.stroke && (
                <>
                  <Row label="Color">
                    <ColorInput
                      value={node.stroke.color}
                      ariaLabel="Stroke color"
                      onValue={(color) =>
                        onChange(node.id, {
                          stroke: { ...node.stroke!, color },
                        })
                      }
                    />
                  </Row>
                  <Row label="Transparency">
                    <NumberInput
                      ariaLabel="Stroke transparency"
                      value={node.stroke.transparency}
                      step={0.05}
                      min={0}
                      max={1}
                      onValue={(transparency) =>
                        onChange(node.id, {
                          stroke: {
                            ...node.stroke!,
                            transparency: Math.max(0, Math.min(1, transparency)),
                          },
                        })
                      }
                    />
                  </Row>
                  <Row label="Thickness">
                    <NumberInput
                      ariaLabel="Stroke thickness"
                      value={node.stroke.thickness}
                      step={1}
                      min={0}
                      max={100}
                      onValue={(thickness) =>
                        onChange(node.id, {
                          stroke: {
                            ...node.stroke!,
                            thickness: Math.max(0, Math.min(100, thickness)),
                          },
                        })
                      }
                    />
                  </Row>
                </>
              )}
            </Group>
          )}

          {(node.cls === "Frame" || node.cls === "ScrollingFrame") && (
            <Group icon={Eye} label="Visibility">
              <Row label="Initially visible">
                <input
                  type="checkbox"
                  checked={node.initialVisible !== false}
                  onChange={(event) =>
                    onChange(node.id, { initialVisible: event.target.checked })
                  }
                  className="h-4 w-4 accent-focus"
                />
              </Row>
            </Group>
          )}

          {isMotionClass(node.cls) && (
            <MotionProperties
              node={node}
              scene={scene}
              onChange={(patch) => onChange(node.id, patch)}
            />
          )}

          {node.cls === "TextButton" && (
            <Group icon={Zap} label="Action">
              <Row label="On click" stacked>
                <select
                  value={node.action?.type ?? "none"}
                  onChange={(event) =>
                    onChange(node.id, { action: createAction(event.target.value) })
                  }
                  className="w-full px-2 py-1 rounded bg-input text-ink text-xs outline-none focus:ring-1 focus:ring-focus"
                >
                  <option value="none">None</option>
                  <option value="show">Show panel</option>
                  <option value="hide">Hide panel</option>
                  <option value="toggle">Toggle panel</option>
                  <option value="hideGui">Hide entire GUI</option>
                  <option value="remoteEvent">Fire RemoteEvent</option>
                  <option value="teleport">Teleport to place</option>
                </select>
              </Row>
              {node.action &&
                (node.action.type === "show" ||
                  node.action.type === "hide" ||
                  node.action.type === "toggle") && (
                <Row label="Target" stacked>
                  <select
                    value={node.action.targetId ?? ""}
                    onChange={(event) => {
                      if (
                        !node.action ||
                        node.action.type === "hideGui" ||
                        node.action.type === "remoteEvent" ||
                        node.action.type === "teleport"
                      ) {
                        return;
                      }
                      onChange(node.id, {
                        action: { ...node.action!, targetId: event.target.value || undefined },
                      });
                    }}
                    className={`w-full px-2 py-1 rounded bg-input text-xs outline-none focus:ring-1 focus:ring-focus ${
                      node.action.targetId ? "text-ink" : "text-warning"
                    }`}
                  >
                    <option value="">Choose a target</option>
                    {actionTargets.map((target) => (
                      <option key={target.id} value={target.id}>{target.name}</option>
                    ))}
                  </select>
                </Row>
              )}
              {node.action?.type === "remoteEvent" && (
                <RemoteEventActionFields
                  key={node.id}
                  action={node.action}
                  onCommit={(action) => onChange(node.id, { action })}
                />
              )}
              {node.action?.type === "teleport" && (
                <TeleportActionFields
                  key={node.id}
                  action={node.action}
                  onCommit={(action) => onChange(node.id, { action })}
                />
              )}
            </Group>
          )}

          <Group icon={Layers} label="Order">
            <Row label="ZIndex">
              <NumberInput
                value={node.zindex}
                step={1}
                min={0}
                onValue={(v) => onChange(node.id, { zindex: Math.round(v) })}
              />
            </Row>
          </Group>
        </div>
      ) : (
        <div className="flex-1 grid place-items-center p-6 text-center">
          <p className="text-sm text-ink-mute">
            Select an element on the canvas to edit its properties.
          </p>
        </div>
      )}
    </aside>
  );
}

function Group({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Move;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 px-1 mb-1.5">
        <Icon className="w-3.5 h-3.5 text-ink-mute" />
        <span className="text-[11px] font-bold uppercase tracking-wider text-ink-mute">
          {label}
        </span>
      </div>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

function Row({
  label,
  children,
  stacked,
}: {
  label: string;
  children: React.ReactNode;
  stacked?: boolean;
}) {
  if (stacked) {
    return (
      <div className="px-1 py-1">
        <label className="block text-[11px] text-ink-mute mb-1">{label}</label>
        {children}
      </div>
    );
  }
  return (
    <div className="flex items-center justify-between gap-2 px-1 py-1">
      <span className="text-[11px] text-ink-mute">{label}</span>
      <div className="flex-1 flex justify-end">{children}</div>
    </div>
  );
}

function NumberInput({
  value,
  onValue,
  step = 1,
  min,
  max,
  ariaLabel,
}: {
  value: number;
  onValue: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
  ariaLabel?: string;
}) {
  return (
    <input
      type="number"
      aria-label={ariaLabel}
      value={value}
      step={step}
      min={min}
      max={max}
      onChange={(e) => {
        const v = parseFloat(e.target.value);
        if (!Number.isNaN(v)) onValue(v);
      }}
      className="w-[68px] px-2 py-1 rounded bg-input text-ink text-xs font-mono outline-none focus:ring-1 focus:ring-focus"
    />
  );
}

function UDim2Input({
  scale,
  offset,
  onScale,
  onOffset,
}: {
  scale: { x: number; y: number };
  offset: { x: number; y: number };
  onScale: (axis: "x" | "y", value: number) => void;
  onOffset: (axis: "x" | "y", value: number) => void;
}) {
  return (
    <div className="grid grid-cols-[auto_1fr_1fr] items-center gap-1.5">
      <span />
      <span className="text-center text-[10px] text-ink-mute">Scale</span>
      <span className="text-center text-[10px] text-ink-mute">Offset</span>
      {(["x", "y"] as const).map((axis) => (
        <div key={axis} className="contents">
          <span className="text-[10px] uppercase text-ink-mute font-mono">{axis}</span>
          <NumberInput
            value={scale[axis]}
            step={0.01}
            onValue={(value) => onScale(axis, value)}
          />
          <NumberInput
            value={offset[axis]}
            step={1}
            onValue={(value) => onOffset(axis, value)}
          />
        </div>
      ))}
    </div>
  );
}

function SizeConstraintInputs({
  node,
  onChange,
}: {
  node: SceneNode;
  onChange: (id: string, patch: Partial<SceneNode>) => void;
}) {
  const minSize = node.minSize ?? ZERO_VECTOR;
  const maxSize = node.maxSize ?? { x: 1920, y: 1080 };
  const update = (
    bound: "minSize" | "maxSize",
    axis: "x" | "y",
    value: number
  ) => {
    const nextMin = bound === "minSize" ? { ...minSize, [axis]: value } : minSize;
    const nextMax = bound === "maxSize" ? { ...maxSize, [axis]: value } : maxSize;
    if (!validSizeConstraints(nextMin, nextMax)) return;
    onChange(node.id, { [bound]: bound === "minSize" ? nextMin : nextMax });
  };

  return (
    <div className="px-1 pb-1">
      <div className="grid grid-cols-[auto_1fr_1fr] items-center gap-1.5">
        <span />
        <span className="text-center text-[10px] text-ink-mute">Min</span>
        <span className="text-center text-[10px] text-ink-mute">Max</span>
        {(["x", "y"] as const).map((axis) => (
          <div key={axis} className="contents">
            <span className="text-[10px] uppercase text-ink-mute font-mono">{axis}</span>
            <NumberInput
              value={minSize[axis]}
              min={0}
              step={1}
              onValue={(value) => update("minSize", axis, Math.round(value))}
            />
            <NumberInput
              value={maxSize[axis]}
              min={0}
              step={1}
              onValue={(value) => update("maxSize", axis, Math.round(value))}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function PairInput({
  x,
  y,
  onX,
  onY,
}: {
  x: number;
  y: number;
  onX: (v: number) => void;
  onY: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] text-ink-mute font-mono">X</span>
      <NumberInput value={x} step={0.01} min={0} max={1} onValue={onX} />
      <span className="text-[10px] text-ink-mute font-mono">Y</span>
      <NumberInput value={y} step={0.01} min={0} max={1} onValue={onY} />
    </div>
  );
}

function ColorInput({
  value,
  onValue,
  ariaLabel,
}: {
  value: string;
  onValue: (v: string) => void;
  ariaLabel?: string;
}) {
  const safe = /^#[0-9a-f]{6}$/i.test(value) ? value : "#000000";
  return (
    <div className="flex items-center gap-1.5">
      <input
        type="color"
        aria-label={ariaLabel ? `${ariaLabel} picker` : undefined}
        value={safe}
        onChange={(e) => onValue(e.target.value)}
        className="w-7 h-7 rounded bg-input border border-line cursor-pointer p-0.5"
      />
      <input
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onValue(e.target.value)}
        className="w-[80px] px-2 py-1 rounded bg-input text-ink text-xs font-mono outline-none focus:ring-1 focus:ring-focus"
      />
    </div>
  );
}
