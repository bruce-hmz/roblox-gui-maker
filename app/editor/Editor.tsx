"use client";

import Link from "next/link";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { Toolbar } from "./Toolbar";
import { Palette } from "./Palette";
import { Canvas } from "./Canvas";
import { PropertiesPanel } from "./PropertiesPanel";
import { CodePanel, type CodeOutput } from "./CodePanel";
import { SAMPLE_SCENE, type DeviceKind, type RobloxClass, type SceneNode } from "./catalog";
import {
  parseSceneDocument,
  sanitizeScene,
  sceneDocumentFilename,
  serializeSceneDocument,
} from "./persistence";
import {
  applyPreviewAction,
  createNode,
  createPreviewVisibility,
  duplicateSubtree,
  generateLuau,
  reparentNode,
  reorderSibling,
  removeSubtree,
  previewActionNotice,
  shade,
  type PreviewVisibility,
} from "./scene";
import { generateServerLuau } from "./server-luau";
import { createProjectPackage } from "./project-package";
import { AI_HANDOFF_KEY, type AiHandoff } from "../lib/ai-handoff";
import { trackEvent } from "../lib/track";

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const cloneScene = (s: SceneNode[]): SceneNode[] =>
  s.map((n) => ({
    ...n,
    pos: { ...n.pos },
    size: { ...n.size },
    ...(n.posOffset ? { posOffset: { ...n.posOffset } } : {}),
    ...(n.sizeOffset ? { sizeOffset: { ...n.sizeOffset } } : {}),
    ...(n.anchor ? { anchor: { ...n.anchor } } : {}),
    ...(n.minSize ? { minSize: { ...n.minSize } } : {}),
    ...(n.maxSize ? { maxSize: { ...n.maxSize } } : {}),
    ...(n.gradient ? { gradient: { ...n.gradient } } : {}),
    ...(n.action ? { action: { ...n.action } } : {}),
  }));
const scenesEqual = (left: SceneNode[], right: SceneNode[]) =>
  JSON.stringify(left) === JSON.stringify(right);

// ---- persistence (localStorage) -------------------------------------------
const STORAGE_KEY = "rgm:scene:v1";
type Saved = { scene: SceneNode[]; selectedId: string | null };

function loadSaved(): Saved | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, unknown> | null;
    if (!parsed || typeof parsed !== "object") return null;
    const scene = sanitizeScene(parsed.scene);
    if (!scene) return null;
    const ids = new Set(scene.map((n) => n.id));
    const selectedId =
      typeof parsed.selectedId === "string" && ids.has(parsed.selectedId)
        ? parsed.selectedId
        : null;
    return { scene, selectedId };
  } catch {
    return null;
  }
}

// Strip funnel params (?template / ?example / ?generated) after the scene is
// in hand so a refresh restores the autosaved scene instead of reloading the
// entry scene.
function stripFunnelParams() {
  const currentUrl = new URL(window.location.href);
  let changed = false;
  for (const param of ["template", "example", "generated"]) {
    if (currentUrl.searchParams.has(param)) {
      currentUrl.searchParams.delete(param);
      changed = true;
    }
  }
  if (!changed) return;
  window.history.replaceState(
    window.history.state,
    "",
    `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`
  );
}

type AiInfo = { prompt: string; screenType: string };

export function Editor({
  initialScene,
  templateSlug,
  exampleSlug,
}: {
  initialScene?: SceneNode[];
  templateSlug?: string;
  exampleSlug?: string;
}) {
  const start = initialScene ?? SAMPLE_SCENE;
  const [device, setDevice] = useState<DeviceKind>("desktop");
  const [scene, setScene] = useState<SceneNode[]>(start);
  const [selectedId, setSelectedId] = useState<string | null>("play");
  const [copied, setCopied] = useState<CodeOutput | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [previewVisibility, setPreviewVisibility] = useState<PreviewVisibility | null>(null);
  const [previewNotice, setPreviewNotice] = useState<string | null>(null);
  // AI funnel: the bar shown when the scene arrived from /api/generate-gui.
  const [aiInfo, setAiInfo] = useState<AiInfo | null>(null);
  const [aiRegenerating, setAiRegenerating] = useState(false);
  const [aiRegenerateError, setAiRegenerateError] = useState<string | null>(null);
  const aiInfoRef = useRef<AiInfo | null>(null);
  const aiFirstEditFired = useRef(false);
  const sceneRef = useRef(scene);
  const importRequest = useRef(0);
  const copyRequest = useRef(0);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Undo/redo: snapshot stack + pointer. Discrete ops commit immediately;
  // continuous edits (drag/typing/nudge) commit on a debounced timer so a
  // whole gesture becomes a single undo step.
  const history = useRef<{ stack: SceneNode[][]; index: number }>({
    stack: [cloneScene(start)],
    index: 0,
  });
  const commitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [, force] = useReducer((x) => x + 1, 0);

  const selected = scene.find((n) => n.id === selectedId) ?? null;
  const clientCode = generateLuau(scene);
  const serverCode = generateServerLuau(scene);
  const canUndo = history.current.index > 0;
  const canRedo = history.current.index < history.current.stack.length - 1;

  const commit = useCallback((scene: SceneNode[], ...scenes: SceneNode[][]) => {
    const h = history.current;
    const stack = h.stack.slice(0, h.index + 1);
    stack.push(...[scene, ...scenes].map(cloneScene));
    while (stack.length > 100) stack.shift();
    history.current = { stack, index: stack.length - 1 };
    force();
  }, []);

  const scheduleCommit = useCallback(
    (next: SceneNode[]) => {
      if (commitTimer.current) clearTimeout(commitTimer.current);
      commitTimer.current = setTimeout(() => {
        commitTimer.current = null;
        commit(next);
      }, 350);
    },
    [commit]
  );

  // immediate=true commits now (discrete); otherwise debounced (continuous).
  const mutate = useCallback(
    (updater: (prev: SceneNode[]) => SceneNode[], immediate = false) => {
      const currentScene = sceneRef.current;
      const next = updater(currentScene);
      if (scenesEqual(currentScene, next)) return;
      // any new edit invalidates the redo branch — drop it now (not after the
      // 350ms debounce) so a redo before the timer fires can't restore stale state.
      const h = history.current;
      if (h.index < h.stack.length - 1) h.stack = h.stack.slice(0, h.index + 1);
      stripFunnelParams();
      if (aiInfoRef.current && !aiFirstEditFired.current) {
        aiFirstEditFired.current = true;
        trackEvent("ai_scene_first_edit", {
          screenType: aiInfoRef.current.screenType,
        });
      }
      sceneRef.current = next;
      setScene(next);
      if (immediate) {
        if (commitTimer.current) {
          // Record the pending edit and immediate change atomically so one undo
          // restores the exact pre-mutation scene.
          clearTimeout(commitTimer.current);
          commitTimer.current = null;
          commit(currentScene, next);
        } else {
          commit(next);
        }
      } else {
        scheduleCommit(next);
      }
    },
    [commit, scheduleCommit]
  );

  function undo() {
    if (commitTimer.current) {
      clearTimeout(commitTimer.current);
      commitTimer.current = null;
      commit(sceneRef.current);
    }
    const h = history.current;
    if (h.index > 0) {
      h.index--;
      const previous = cloneScene(h.stack[h.index]);
      sceneRef.current = previous;
      setScene(previous);
      force();
    }
  }

  function redo() {
    const h = history.current;
    if (h.index < h.stack.length - 1) {
      h.index++;
      const next = cloneScene(h.stack[h.index]);
      sceneRef.current = next;
      setScene(next);
      force();
    }
  }

  function addNode(cls: RobloxClass) {
    if (cls === "ScreenGui" && scene.some((n) => n.cls === "ScreenGui")) return;
    const parentId =
      selected && (selected.cls === "Frame" || selected.cls === "ScrollingFrame")
        ? selected.id
        : null;
    const node = createNode(cls, scene, parentId);
    mutate((s) => [...s, node], true);
    setSelectedId(node.id);
  }

  function applyDecorator(cls: RobloxClass) {
    if (!selectedId) return;
    mutate((s) => {
      const map = (fn: (n: SceneNode) => SceneNode) => s.map((n) => (n.id === selectedId ? fn(n) : n));
      if (cls === "UICorner") return map((n) => ({ ...n, cornerRadius: n.cornerRadius > 0 ? 0 : 12 }));
      if (cls === "UIGradient")
        return map((n) =>
          n.gradient
            ? { ...n, gradient: undefined }
            : { ...n, gradient: { stops: [{ at: 0, color: shade(n.color, 22) }, { at: 1, color: shade(n.color, -22) }] } }
        );
      if (cls === "UIListLayout") return map((n) => ({ ...n, layout: n.layout === "list" ? undefined : "list" }));
      if (cls === "UIGridLayout") return map((n) => ({ ...n, layout: n.layout === "grid" ? undefined : "grid" }));
      if (cls === "UIPadding") return map((n) => ({ ...n, padding: n.padding ? undefined : 12 }));
      return s;
    }, true);
  }

  function updateNode(id: string, patch: Partial<SceneNode>) {
    mutate((s) => s.map((n) => (n.id === id ? { ...n, ...patch } : n)));
  }

  function deleteNode(id: string) {
    const next = removeSubtree(scene, id);
    mutate(() => next, true);
    setSelectedId((cur) => (cur && next.some((node) => node.id === cur) ? cur : null));
  }

  function duplicateSelected() {
    if (!selectedId) return;
    const result = duplicateSubtree(scene, selectedId);
    if (!result) return;
    mutate((s) => [...s, ...result.nodes], true);
    setSelectedId(result.newId);
  }

  function moveInside(id: string, parentId: string) {
    const next = reparentNode(scene, id, parentId);
    if (next === scene) return;
    mutate(() => next, true);
    setSelectedId(id);
  }

  function moveRelative(
    id: string,
    targetId: string,
    position: "before" | "after"
  ) {
    const moving = scene.find((node) => node.id === id);
    const target = scene.find((node) => node.id === targetId);
    if (!moving || !target || target.cls === "ScreenGui") return;

    let next = scene;
    if ((moving.parentId ?? null) !== (target.parentId ?? null)) {
      if (!target.parentId) return;
      next = reparentNode(next, id, target.parentId);
      if (next === scene) return;
    }
    const reordered = reorderSibling(next, id, targetId, position);
    if (reordered === next && next === scene) return;
    mutate(() => reordered, true);
    setSelectedId(id);
  }

  // Restore the saved workspace on mount — only when no template was requested
  // via ?template=. Runs after mount (client-only) so SSR HTML isn't mismatched.
  useEffect(() => {
    if (initialScene) return;
    const saved = loadSaved();
    if (!saved) return;
    sceneRef.current = saved.scene;
    setScene(saved.scene);
    setSelectedId(saved.selectedId);
    history.current = { stack: [cloneScene(saved.scene)], index: 0 };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // AI funnel: consume the homepage handoff (sessionStorage) when arriving
  // via /editor?generated=1. Runs after the localStorage-restore effect so an
  // AI scene always wins over a stale autosave.
  useEffect(() => {
    if (initialScene) return;
    if (new URLSearchParams(window.location.search).get("generated") !== "1") return;
    stripFunnelParams();
    try {
      const raw = window.sessionStorage.getItem(AI_HANDOFF_KEY);
      if (!raw) return;
      const handoff = JSON.parse(raw) as AiHandoff;
      const scene = sanitizeScene(handoff.scene);
      window.sessionStorage.removeItem(AI_HANDOFF_KEY);
      if (!scene) return;
      sceneRef.current = scene;
      setScene(scene);
      setSelectedId(null);
      history.current = { stack: [cloneScene(scene)], index: 0 };
      const info: AiInfo = { prompt: handoff.prompt, screenType: handoff.meta.screenType };
      aiInfoRef.current = info;
      setAiInfo(info);
      trackEvent("ai_scene_loaded", {
        screenType: handoff.meta.screenType,
        fallbackUsed: handoff.meta.fallbackUsed === "template",
      });
    } catch {
      // malformed handoff — fall through to the normal blank/restored state
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Template funnel: fire once when the editor opens with a loaded template
  // (page.tsx passes templateSlug only when ?template=<slug> resolved to a real
  // scene, so this never fires for blank or restored sessions).
  useEffect(() => {
    if (templateSlug) trackEvent("open_template", { template: templateSlug });
  }, [templateSlug]);

  // Example funnel: fixed AI examples loaded without an LLM call.
  useEffect(() => {
    if (exampleSlug) trackEvent("open_example", { example: exampleSlug });
  }, [exampleSlug]);

  // Autosave (debounced) so refresh doesn't lose work.
  useEffect(() => {
    const id = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ scene, selectedId }));
      } catch {
        // storage full / blocked — ignore, the tool still works in-session
      }
    }, 400);
    return () => clearTimeout(id);
  }, [scene, selectedId]);

  function newWorkspace() {
    if (typeof window !== "undefined" && !window.confirm("Start a new GUI? Your current one will be cleared.")) return;
    if (commitTimer.current) {
      clearTimeout(commitTimer.current);
      commitTimer.current = null;
    }
    sceneRef.current = SAMPLE_SCENE;
    setScene(SAMPLE_SCENE);
    setSelectedId("play");
    setPreviewNotice(null);
    history.current = { stack: [cloneScene(SAMPLE_SCENE)], index: 0 };
    aiInfoRef.current = null;
    setAiInfo(null);
    aiFirstEditFired.current = false;
    stripFunnelParams();
    force();
  }

  // AI funnel helpers -----------------------------------------------------------

  // Track exports that came from an AI session with an ai_export event on top
  // of the existing export_code / download_project events.
  function trackAiExport(method: string) {
    if (!aiInfoRef.current) return;
    trackEvent("ai_export", {
      method,
      screenType: aiInfoRef.current.screenType,
    });
  }

  async function regenerateAiScene() {
    const info = aiInfoRef.current;
    if (!info || aiRegenerating) return;
    setAiRegenerating(true);
    setAiRegenerateError(null);
    try {
      const response = await fetch("/api/generate-gui", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: info.prompt, locale: "en" }),
      });
      const data = (await response.json().catch(() => null)) as {
        scene?: unknown;
        meta?: AiHandoff["meta"];
        error?: string;
      } | null;
      const scene = data?.scene ? sanitizeScene(data.scene) : null;
      if (!response.ok || !scene || !data?.meta) throw new Error("regenerate failed");
      trackEvent("ai_generate_success", {
        screenType: data.meta.screenType,
        fallbackUsed: data.meta.fallbackUsed === "template",
        latencyMs: data.meta.latencyMs,
        regenerate: true,
      });
      sceneRef.current = scene;
      setScene(scene);
      setSelectedId(null);
      setPreviewVisibility(null);
      setPreviewNotice(null);
      history.current = { stack: [cloneScene(scene)], index: 0 };
      const next: AiInfo = { prompt: info.prompt, screenType: data.meta.screenType };
      aiInfoRef.current = next;
      setAiInfo(next);
      force();
    } catch {
      trackEvent("ai_generate_failure", { reason: "regenerate" });
      setAiRegenerateError("Regeneration failed — your current GUI is unchanged.");
    } finally {
      setAiRegenerating(false);
    }
  }

  // keyboard shortcuts (⌘/Ctrl + Z/Y/D, Delete, Esc, arrows)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      if (t?.closest('[data-editor-shortcuts="ignore"]')) return;
      const typing =
        !!t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.tagName === "SELECT" ||
          t.isContentEditable);
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "z") {
        e.preventDefault();
        e.shiftKey ? redo() : undo();
        return;
      }
      if (mod && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
        return;
      }
      if (mod && e.key.toLowerCase() === "d") {
        e.preventDefault();
        duplicateSelected();
        return;
      }
      if (typing) return;
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        if (selectedId) deleteNode(selectedId);
        return;
      }
      if (e.key === "Escape") {
        setSelectedId(null);
        return;
      }
      if (selectedId && e.key.startsWith("Arrow")) {
        e.preventDefault();
        const node = scene.find((n) => n.id === selectedId);
        if (!node) return;
        const step = e.shiftKey ? 0.05 : 0.01;
        const dx = e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
        const dy = e.key === "ArrowUp" ? -step : e.key === "ArrowDown" ? step : 0;
        updateNode(selectedId, {
          pos: { x: clamp01(node.pos.x + dx), y: clamp01(node.pos.y + dy) },
        });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    return () => {
      copyRequest.current++;
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  useEffect(() => {
    copyRequest.current++;
    if (copyTimer.current) {
      clearTimeout(copyTimer.current);
      copyTimer.current = null;
    }
    setCopied(null);
  }, [clientCode, serverCode]);

  async function copyCode(output: CodeOutput) {
    const code = output === "client" ? clientCode : serverCode;
    if (code === null) return;

    const request = ++copyRequest.current;
    try {
      await navigator.clipboard.writeText(code);
      if (request !== copyRequest.current) return;
      trackEvent("export_code", { method: "copy", output });
      trackAiExport(output === "client" ? "copy_client" : "copy_server");
      if (copyTimer.current) clearTimeout(copyTimer.current);
      setCopied(output);
      copyTimer.current = setTimeout(() => {
        copyTimer.current = null;
        setCopied((current) => (current === output ? null : current));
      }, 1600);
    } catch {
      if (request !== copyRequest.current) return;
      if (copyTimer.current) {
        clearTimeout(copyTimer.current);
        copyTimer.current = null;
      }
      setCopied(null);
    }
  }

  function downloadCode(output: CodeOutput) {
    const code = output === "client" ? clientCode : serverCode;
    if (code === null) return;

    const url = URL.createObjectURL(new Blob([code], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = output === "client" ? "roblox-gui.lua" : "roblox-gui.server.lua";
    trackEvent("export_code", { method: output === "client" ? "lua" : "server_lua", output });
    trackAiExport(output === "client" ? "download_lua" : "download_server_lua");
    link.click();
    URL.revokeObjectURL(url);
  }

  function exportProject() {
    const url = URL.createObjectURL(
      new Blob([serializeSceneDocument(scene)], {
        type: "application/json;charset=utf-8",
      })
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = sceneDocumentFilename(scene);
    trackEvent("download_project", { format: "json" });
    trackAiExport("download_json");
    link.click();
    URL.revokeObjectURL(url);
  }

  function downloadProjectPackage() {
    const projectPackage = createProjectPackage(scene, clientCode, serverCode);
    const url = URL.createObjectURL(
      new Blob([new Uint8Array(projectPackage.bytes)], {
        type: "application/zip",
      })
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = projectPackage.filename;
    trackEvent("download_project", { format: "zip" });
    trackAiExport("download_zip");
    link.click();
    URL.revokeObjectURL(url);
  }

  async function importProject(file: File) {
    const request = ++importRequest.current;
    setImportError(null);
    try {
      const text = await file.text();
      if (request !== importRequest.current) return;
      const imported = parseSceneDocument(text);
      mutate(() => imported, true);
      setSelectedId(
        imported.find((node) => node.cls === "ScreenGui" && !node.parentId)?.id ??
          imported[0].id
      );
      setPreviewVisibility(null);
      setPreviewNotice(null);
    } catch (error) {
      if (request !== importRequest.current) return;
      setImportError(
        error instanceof Error && error.message
          ? error.message
          : "Could not import this project."
      );
    }
  }

  function togglePreview() {
    setPreviewNotice(null);
    setPreviewVisibility((current) =>
      current ? null : createPreviewVisibility(scene)
    );
    setSelectedId(null);
  }

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center gap-5 px-6 text-center md:hidden">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-xl font-bold text-on-primary">
          R
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Open the editor on a larger screen</h1>
          <p className="mx-auto max-w-sm text-sm leading-6 text-ink-dim">
            The editor needs room for the component palette, canvas, and properties. Use a tablet or desktop to build and export your GUI.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/templates"
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-on-primary"
          >
            Browse templates
          </Link>
          <Link
            href="/"
            className="rounded-md border border-line px-4 py-2 text-sm font-medium text-ink-dim"
          >
            Roblox GUI Maker home
          </Link>
        </div>
      </main>
      <div className="hidden h-screen w-screen flex-col overflow-hidden md:flex">
      <Toolbar
        device={device}
        onDevice={setDevice}
        onExport={() => copyCode("client")}
        copied={copied === "client"}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        onNew={newWorkspace}
        previewing={previewVisibility !== null}
        onPreview={togglePreview}
        onImportProject={importProject}
        onExportProject={exportProject}
        importError={importError}
      />
      {aiInfo && (
        <div className="flex h-9 shrink-0 items-center gap-3 border-b border-line bg-panel px-4 text-xs select-none">
          <span className="rounded-full bg-primary/15 px-2.5 py-0.5 font-semibold text-focus">
            AI-generated · {aiInfo.screenType}
          </span>
          <span className="min-w-0 flex-1 truncate text-ink-mute" title={aiInfo.prompt}>
            &ldquo;{aiInfo.prompt}&rdquo;
          </span>
          {aiRegenerateError && (
            <span role="alert" className="text-danger">
              {aiRegenerateError}
            </span>
          )}
          <button
            onClick={() => void regenerateAiScene()}
            disabled={aiRegenerating}
            className="rounded-md border border-line px-2.5 py-1 font-medium text-ink-dim transition hover:border-focus hover:text-ink disabled:opacity-50"
          >
            {aiRegenerating ? "Regenerating…" : "Regenerate"}
          </button>
          <button
            onClick={() => {
              aiInfoRef.current = null;
              aiFirstEditFired.current = false;
              setAiInfo(null);
              setAiRegenerateError(null);
            }}
            aria-label="Dismiss AI bar"
            className="grid h-6 w-6 place-items-center rounded-md text-ink-mute transition hover:bg-raised hover:text-ink"
          >
            ×
          </button>
        </div>
      )}
      <div className="flex-1 min-h-0 flex">
        <Palette
          onAdd={addNode}
          onApply={applyDecorator}
          scene={scene}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onRename={(id, name) => updateNode(id, { name })}
          onMoveInside={moveInside}
          onMoveRelative={moveRelative}
        />
        <Canvas
          scene={scene}
          selectedId={selectedId}
          device={device}
          onSelect={setSelectedId}
          onChange={updateNode}
          previewVisibility={previewVisibility}
          previewNotice={previewNotice}
          onPreviewAction={(id) => {
            const notice = previewActionNotice(scene, id);
            if (notice) {
              setPreviewNotice(notice);
              return;
            }
            setPreviewNotice(null);
            setPreviewVisibility((current) =>
              current ? applyPreviewAction(scene, current, id) : current
            );
          }}
        />
        <PropertiesPanel
          node={selected}
          scene={scene}
          onChange={updateNode}
          onDelete={deleteNode}
          onDuplicate={duplicateSelected}
        />
      </div>
      <CodePanel
        clientCode={clientCode}
        serverCode={serverCode}
        copied={copied}
        onCopy={copyCode}
        onDownload={downloadCode}
        onDownloadPackage={downloadProjectPackage}
      />
      </div>
    </>
  );
}
