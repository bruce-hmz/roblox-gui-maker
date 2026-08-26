"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy, Download } from "lucide-react";

export type CodeOutput = "client" | "server";

type Props = {
  clientCode: string;
  serverCode: string | null;
  copied: CodeOutput | null;
  onCopy: (output: CodeOutput) => void;
  onDownload: (output: CodeOutput) => void;
  onDownloadPackage: () => void;
};

export function CodePanel({
  clientCode,
  serverCode,
  copied,
  onCopy,
  onDownload,
  onDownloadPackage,
}: Props) {
  const [activeOutput, setActiveOutput] = useState<CodeOutput>("client");
  const activeCode = activeOutput === "client" ? clientCode : serverCode;
  const isAvailable = activeCode !== null;

  return (
    <footer
      data-editor-shortcuts="ignore"
      className="h-52 shrink-0 flex flex-col bg-panel border-t border-line"
    >
      <div className="h-9 shrink-0 flex items-center justify-between px-4 border-b border-line">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-dim">
            Export · Luau
          </span>
          <div role="tablist" aria-label="Luau output" className="flex items-center gap-1">
            {(["client", "server"] as const).map((output) => {
              const active = activeOutput === output;
              return (
                <button
                  key={output}
                  id={`${output}-code-tab`}
                  type="button"
                  role="tab"
                  aria-controls={`${output}-code-panel`}
                  aria-selected={active}
                  tabIndex={active ? 0 : -1}
                  onClick={() => setActiveOutput(output)}
                  onKeyDown={(event) => {
                    let nextOutput: CodeOutput | null = null;
                    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                      nextOutput = output === "client" ? "server" : "client";
                    } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                      nextOutput = output === "client" ? "server" : "client";
                    } else if (event.key === "Home") {
                      nextOutput = "client";
                    } else if (event.key === "End") {
                      nextOutput = "server";
                    }
                    if (!nextOutput) return;
                    event.preventDefault();
                    event.stopPropagation();
                    setActiveOutput(nextOutput);
                    event.currentTarget.parentElement
                      ?.querySelector<HTMLButtonElement>(`#${nextOutput}-code-tab`)
                      ?.focus();
                  }}
                  className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                    active
                      ? "bg-raised text-ink"
                      : "text-ink-mute hover:text-ink"
                  }`}
                >
                  {output === "client" ? "Client" : "Server"}
                </button>
              );
            })}
          </div>
          <span className="text-[11px] text-ink-mute">
            {activeOutput === "client"
              ? "ScreenGui — paste into a LocalScript"
              : "Remote handlers — place in ServerScriptService"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onDownloadPackage}
            className="flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-on-primary transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Download className="w-3.5 h-3.5" />
            Download ZIP
          </button>
          <button
            type="button"
            onClick={() => onDownload(activeOutput)}
            disabled={!isAvailable}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-ink-dim hover:text-ink hover:bg-raised disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink-dim transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Download className="w-3.5 h-3.5" />
            Download {activeOutput === "client" ? ".lua" : ".server.lua"}
          </button>
          <button
            type="button"
            onClick={() => onCopy(activeOutput)}
            disabled={!isAvailable}
            aria-live="polite"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-ink-dim hover:text-ink hover:bg-raised disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink-dim transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {copied === activeOutput ? (
              <Check className="w-3.5 h-3.5 text-success" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {copied === activeOutput ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
      {/* Post-copy next steps: turns the export moment into a content
          touchpoint instead of a dead end (also the editor's only
          keyword-anchored link to the homepage). */}
      {copied !== null && (
        <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1 border-b border-line bg-panel-raised px-4 py-1.5 text-[11px] text-ink-mute">
          <span className="font-semibold text-success">
            {copied === "client" ? "Client" : "Server"} code copied —
          </span>
          <span>
            {copied === "client"
              ? "paste into a LocalScript under StarterGui"
              : "paste into a Script under ServerScriptService"}
          </span>
          <Link
            href="/guides/how-to-script-a-roblox-gui"
            className="font-medium text-focus hover:underline"
          >
            New to GUI scripting? Read the guide →
          </Link>
          <Link
            href="/"
            className="ml-auto font-medium text-ink-dim hover:text-ink hover:underline"
          >
            Roblox GUI maker
          </Link>
        </div>
      )}
      {(["client", "server"] as const).map((output) => {
        const code = output === "client" ? clientCode : serverCode;
        const active = activeOutput === output;
        return (
          <div
            key={output}
            id={`${output}-code-panel`}
            role="tabpanel"
            aria-labelledby={`${output}-code-tab`}
            hidden={!active}
            className={active ? "flex min-h-0 flex-1" : "hidden"}
          >
            {code === null ? (
              <p className="m-auto px-4 text-center text-sm text-ink-mute">
                Add a Fire RemoteEvent button action to generate a server handler.
              </p>
            ) : (
              <pre
                tabIndex={0}
                aria-label={`${output === "client" ? "Client" : "Server"} Luau code`}
                className="flex-1 overflow-auto scroll-thin p-4 text-[12.5px] leading-relaxed font-mono text-ink-dim focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary"
              >
                <code>{code}</code>
              </pre>
            )}
          </div>
        );
      })}
    </footer>
  );
}
