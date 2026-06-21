"use client";

import Link from "next/link";
import {
  Monitor,
  Tablet,
  Smartphone,
  LayoutTemplate,
  Download,
  Check,
  Undo2,
  Redo2,
  FilePlus2,
  FileJson,
  Play,
  Square,
  Upload,
} from "lucide-react";
import type { DeviceKind } from "./catalog";

const DEVICES: { id: DeviceKind; label: string; icon: typeof Monitor }[] = [
  { id: "desktop", label: "Desktop", icon: Monitor },
  { id: "tablet", label: "Tablet", icon: Tablet },
  { id: "mobile", label: "Mobile", icon: Smartphone },
];

type Props = {
  device: DeviceKind;
  onDevice: (d: DeviceKind) => void;
  onExport: () => void;
  copied: boolean;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onNew: () => void;
  previewing: boolean;
  previewActive: boolean;
  onPreview: () => void;
  onImportProject: (file: File) => void;
  onExportProject: () => void;
  importError: string | null;
};

export function Toolbar({
  device,
  onDevice,
  onExport,
  copied,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onNew,
  previewing,
  previewActive,
  onPreview,
  onImportProject,
  onExportProject,
  importError,
}: Props) {
  return (
    <header className="relative h-12 shrink-0 flex items-center justify-between px-4 bg-panel border-b border-line select-none">
      <div className="flex shrink-0 items-center gap-2 xl:gap-3">
        <div className="flex items-center gap-2">
          <span className="grid place-items-center w-9 h-9 rounded-lg bg-white shrink-0 overflow-hidden">
            <img
              src="/logo.png"
              alt="Roblox GUI Maker"
              className="w-full h-full object-contain"
            />
          </span>
          <span className="hidden font-semibold tracking-tight xl:inline">
            Roblox<span className="text-ink-dim"> GUI Maker</span>
          </span>
        </div>
        <div className="flex items-center gap-0.5 ml-1">
          <button
            onClick={onUndo}
            disabled={previewActive || !canUndo}
            aria-label="Undo"
            title="Undo (⌘Z / Ctrl+Z)"
            className="grid place-items-center w-8 h-8 rounded-md text-ink-dim hover:text-ink hover:bg-raised disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink-dim transition-colors"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={previewActive || !canRedo}
            aria-label="Redo"
            title="Redo (⌘⇧Z / Ctrl+Y)"
            className="grid place-items-center w-8 h-8 rounded-md text-ink-dim hover:text-ink hover:bg-raised disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink-dim transition-colors"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 p-1 rounded-md bg-input">
        {DEVICES.map((d) => {
          const Icon = d.icon;
          const active = device === d.id;
          return (
            <button
              key={d.id}
              onClick={() => onDevice(d.id)}
              aria-label={d.label}
              aria-pressed={active}
              title={d.label}
              className={`flex h-7 w-7 shrink-0 items-center justify-center gap-1.5 rounded text-xs font-medium transition-colors xl:w-auto xl:px-3 ${
                active ? "bg-raised text-ink" : "text-ink-dim hover:text-ink"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">{d.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex shrink-0 items-center gap-1 xl:gap-2">
        <button
          onClick={onPreview}
          aria-label={previewing ? "Stop preview" : "Preview"}
          aria-pressed={previewing}
          title={previewing ? "Stop preview" : "Preview"}
          className={`flex h-8 w-8 shrink-0 items-center justify-center gap-1.5 rounded-md text-sm font-medium transition-colors xl:w-auto xl:px-3 ${
            previewing ? "bg-success text-base" : "text-ink-dim hover:text-ink hover:bg-raised"
          }`}
        >
          {previewing ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span className="hidden xl:inline">
            {previewing ? "Stop preview" : "Preview"}
          </span>
        </button>
        <button
          onClick={onNew}
          disabled={previewActive}
          aria-label="New"
          title="Start a new GUI (clears the current one)"
          className="flex h-8 w-8 shrink-0 items-center justify-center gap-1.5 rounded-md text-sm text-ink-dim transition-colors hover:bg-raised hover:text-ink disabled:cursor-not-allowed disabled:opacity-30 xl:w-auto xl:px-3"
        >
          <FilePlus2 className="w-4 h-4" />
          <span className="hidden xl:inline">New</span>
        </button>
        <Link
          href="/templates"
          aria-label="Templates"
          title="Templates"
          className="flex h-8 w-8 shrink-0 items-center justify-center gap-1.5 rounded-md text-sm text-ink-dim transition-colors hover:bg-raised hover:text-ink xl:w-auto xl:px-3"
        >
          <LayoutTemplate className="w-4 h-4" />
          <span className="hidden xl:inline">Templates</span>
        </Link>
        <label
          title="Import JSON"
          className={`flex h-8 w-8 shrink-0 items-center justify-center gap-1.5 rounded-md text-sm text-ink-dim transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary xl:w-auto xl:px-3 ${previewActive ? "cursor-not-allowed opacity-30" : "cursor-pointer hover:bg-raised hover:text-ink"}`}
        >
          <Upload className="w-4 h-4" />
          <span className="hidden xl:inline">Import JSON</span>
          <input
            type="file"
            accept="application/json,.json"
            aria-label="Import JSON"
            disabled={previewActive}
            className="sr-only"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];
              event.currentTarget.value = "";
              if (file && !previewActive) onImportProject(file);
            }}
          />
        </label>
        <button
          onClick={onExportProject}
          aria-label="Export JSON"
          title="Export JSON"
          className="flex h-8 w-8 shrink-0 items-center justify-center gap-1.5 rounded-md text-sm text-ink-dim transition-colors hover:bg-raised hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary xl:w-auto xl:px-3"
        >
          <FileJson className="w-4 h-4" />
          <span className="hidden xl:inline">Export JSON</span>
        </button>
        <button
          onClick={onExport}
          aria-label={copied ? "Copied" : "Export Luau"}
          title={copied ? "Copied" : "Export Luau"}
          className="flex h-8 w-8 shrink-0 items-center justify-center gap-1.5 rounded-md bg-primary text-sm font-semibold text-on-primary transition hover:brightness-110 xl:w-auto xl:px-4"
        >
          {copied ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
          <span className="hidden xl:inline">
            {copied ? "Copied" : "Export Luau"}
          </span>
        </button>
      </div>
      {importError && (
        <div
          role="alert"
          className="absolute right-4 top-full z-20 mt-2 max-w-md rounded-md border border-line bg-panel px-3 py-2 text-sm text-danger shadow-lg"
        >
          {importError}
        </div>
      )}
    </header>
  );
}
