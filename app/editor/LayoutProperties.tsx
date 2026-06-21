"use client";

import { Rows3 } from "lucide-react";
import type {
  AutomaticCanvasSize,
  LayoutHorizontalAlignment,
  LayoutVerticalAlignment,
  ListDirection,
  SceneNode,
  UDim2Value,
} from "./catalog";
import { BoundedNumberField } from "./BoundedNumberField";
import { resolveGridLayout, resolveListLayout } from "./layout-config";

type LayoutPropertiesProps = {
  node: SceneNode;
  onChange: (id: string, patch: Partial<SceneNode>) => void;
};

const selectClass =
  "w-full rounded bg-input px-2 py-1 text-xs text-ink outline-none focus:ring-1 focus:ring-focus";

function PropertyRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-1 py-1">
      <span className="mb-1 block text-[11px] text-ink-mute">{label}</span>
      {children}
    </div>
  );
}

function DimensionFields({
  label,
  value,
  onScale,
  onOffset,
}: {
  label: string;
  value: UDim2Value;
  onScale: (axis: "x" | "y", value: number) => void;
  onOffset: (axis: "x" | "y", value: number) => void;
}) {
  return (
    <PropertyRow label={label}>
      <div className="grid grid-cols-[auto_1fr_1fr] items-start gap-1.5">
        <span />
        <span className="text-center text-[10px] text-ink-mute">Scale</span>
        <span className="text-center text-[10px] text-ink-mute">Offset</span>
        {(["x", "y"] as const).map((axis) => (
          <div key={axis} className="contents">
            <span className="pt-1 text-[10px] uppercase text-ink-mute font-mono">
              {axis}
            </span>
            <BoundedNumberField
              ariaLabel={`${label} ${axis.toUpperCase()} scale`}
              value={value.scale[axis]}
              min={0}
              max={1}
              step={0.01}
              onCommit={(next) => onScale(axis, next)}
            />
            <BoundedNumberField
              ariaLabel={`${label} ${axis.toUpperCase()} offset`}
              value={value.offset[axis]}
              min={0}
              max={4096}
              step={1}
              onCommit={(next) => onOffset(axis, Math.round(next))}
            />
          </div>
        ))}
      </div>
    </PropertyRow>
  );
}

function AlignmentFields({
  horizontal,
  vertical,
  onChange,
}: {
  horizontal: LayoutHorizontalAlignment;
  vertical: LayoutVerticalAlignment;
  onChange: (patch: Partial<SceneNode>) => void;
}) {
  return (
    <>
      <PropertyRow label="Horizontal alignment">
        <select
          aria-label="Horizontal alignment"
          value={horizontal}
          onChange={(event) =>
            onChange({
              layoutHorizontalAlignment: event.target
                .value as LayoutHorizontalAlignment,
            })
          }
          className={selectClass}
        >
          <option value="left">left</option>
          <option value="center">center</option>
          <option value="right">right</option>
        </select>
      </PropertyRow>
      <PropertyRow label="Vertical alignment">
        <select
          aria-label="Vertical alignment"
          value={vertical}
          onChange={(event) =>
            onChange({
              layoutVerticalAlignment: event.target.value as LayoutVerticalAlignment,
            })
          }
          className={selectClass}
        >
          <option value="top">top</option>
          <option value="center">center</option>
          <option value="bottom">bottom</option>
        </select>
      </PropertyRow>
    </>
  );
}

export function LayoutProperties({ node, onChange }: LayoutPropertiesProps) {
  const list = resolveListLayout(node);
  const grid = resolveGridLayout(node);
  const change = (patch: Partial<SceneNode>) => onChange(node.id, patch);
  const updateGrid = (
    field: "gridCellSize" | "gridCellPadding",
    kind: "scale" | "offset",
    axis: "x" | "y",
    value: number
  ) => {
    const current = field === "gridCellSize" ? grid.cellSize : grid.cellPadding;
    change({
      [field]: {
        scale: { ...current.scale, ...(kind === "scale" ? { [axis]: value } : {}) },
        offset: {
          ...current.offset,
          ...(kind === "offset" ? { [axis]: value } : {}),
        },
      },
    });
  };

  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1.5 px-1">
        <Rows3 className="h-3.5 w-3.5 text-ink-mute" />
        <span className="text-[11px] font-bold uppercase tracking-wider text-ink-mute">
          Container
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <PropertyRow label="Layout">
          <select
            aria-label="Layout"
            value={node.layout ?? "none"}
            onChange={(event) =>
              change({
                layout:
                  event.target.value === "none"
                    ? undefined
                    : (event.target.value as "list" | "grid"),
              })
            }
            className={selectClass}
          >
            <option value="none">none</option>
            <option value="list">list</option>
            <option value="grid">grid</option>
          </select>
        </PropertyRow>

        <PropertyRow label="Content padding">
          <BoundedNumberField
            ariaLabel="Content padding"
            value={node.padding ?? 0}
            min={0}
            max={4096}
            step={1}
            onCommit={(padding) => change({ padding: Math.round(padding) })}
          />
        </PropertyRow>

        {node.layout === "list" && (
          <>
            <PropertyRow label="Direction">
              <select
                aria-label="Direction"
                value={list.direction}
                onChange={(event) =>
                  change({ listDirection: event.target.value as ListDirection })
                }
                className={selectClass}
              >
                <option value="vertical">vertical</option>
                <option value="horizontal">horizontal</option>
              </select>
            </PropertyRow>
            <PropertyRow label="Gap">
              <div className="grid grid-cols-2 gap-1.5">
                <BoundedNumberField
                  ariaLabel="Gap scale"
                  value={list.gap.scale}
                  min={0}
                  max={1}
                  step={0.01}
                  onCommit={(scale) =>
                    change({ listGap: { scale, offset: list.gap.offset } })
                  }
                />
                <BoundedNumberField
                  ariaLabel="Gap offset"
                  value={list.gap.offset}
                  min={0}
                  max={4096}
                  step={1}
                  onCommit={(offset) =>
                    change({ listGap: { scale: list.gap.scale, offset: Math.round(offset) } })
                  }
                />
              </div>
            </PropertyRow>
            <AlignmentFields
              horizontal={list.horizontalAlignment}
              vertical={list.verticalAlignment}
              onChange={change}
            />
          </>
        )}

        {node.layout === "grid" && (
          <>
            <DimensionFields
              label="Cell size"
              value={{
                scale: { ...grid.cellSize.scale },
                offset: { ...grid.cellSize.offset },
              }}
              onScale={(axis, value) => updateGrid("gridCellSize", "scale", axis, value)}
              onOffset={(axis, value) => updateGrid("gridCellSize", "offset", axis, value)}
            />
            <DimensionFields
              label="Cell padding"
              value={{
                scale: { ...grid.cellPadding.scale },
                offset: { ...grid.cellPadding.offset },
              }}
              onScale={(axis, value) => updateGrid("gridCellPadding", "scale", axis, value)}
              onOffset={(axis, value) => updateGrid("gridCellPadding", "offset", axis, value)}
            />
            <AlignmentFields
              horizontal={grid.horizontalAlignment}
              vertical={grid.verticalAlignment}
              onChange={change}
            />
          </>
        )}

        {node.cls === "ScrollingFrame" && (
          <PropertyRow label="Automatic canvas size">
            <select
              aria-label="Automatic canvas size"
              value={node.automaticCanvasSize ?? "none"}
              onChange={(event) =>
                change({
                  automaticCanvasSize: event.target.value as AutomaticCanvasSize,
                })
              }
              className={selectClass}
            >
              <option value="none">none</option>
              <option value="x">x</option>
              <option value="y">y</option>
              <option value="xy">xy</option>
            </select>
          </PropertyRow>
        )}
      </div>
    </div>
  );
}
