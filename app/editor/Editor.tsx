"use client";

import Link from "next/link";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { Toolbar } from "./Toolbar";
import { Palette } from "./Palette";
import { Canvas } from "./Canvas";
import { PropertiesPanel } from "./PropertiesPanel";
import { CodePanel, type CodeOutput } from "./CodePanel";
import { ScenePreview } from "./ScenePreview";
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
import { ProUpgradeModal } from "../components/ProUpgradeModal";
import { AI_HANDOFF_KEY, type AiHandoff } from "../lib/ai-handoff";
import { loadClientProStatus, requestEditorRbxmxExport } from "../lib/pro-client";
import { trackEvent } from "../lib/track";
import {
  ONBOARDING_COPY,
  markOnboardingSeen,
  onboardingSeen,
  pickOnboardingNode,
} from "./onboarding";

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

type AiInfo = { prompt: string; screenType: string; locale: "en" | "zh" };

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
  const [pluginJsonCopied, setPluginJsonCopied] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [proModalOpen, setProModalOpen] = useState(false);
  const [exportingRbxmx, setExportingRbxmx] = useState(false);
  const [rbxmxExportError, setRbxmxExportError] = useState<string | null>(null);
  const [aiPromptOpen, setAiPromptOpen] = useState(false);
  const [aiPromptInput, setAiPromptInput] = useState("");
  const [mobileCodeOpen, setMobileCodeOpen] = useState(false);
  const [previewVisibility, setPreviewVisibility] = useState<PreviewVisibility | null>(null);
  const [previewNotice, setPreviewNotice] = useState<string | null>(null);
  // AI funnel: the bar shown when the scene arrived from /api/generate-gui.
  const [aiInfo, setAiInfo] = useState<AiInfo | null>(null);
  // Activation onboarding: one-time "this is editable" strip + properties
  // micro-hint, retired by the user's first real edit (see mutate).
  const [aiOnboarding, setAiOnboarding] = useState(false);
  const [aiRegenerating, setAiRegenerating] = useState(false);
  const [aiRegenerateError, setAiRegenerateError] = useState<string | null>(null);
  const [aiUpgradeSuggested, setAiUpgradeSuggested] = useState(false);
  const aiInfoRef = useRef<AiInfo | null>(null);
  const aiFirstEditFired = useRef(false);
  const sceneRef = useRef(scene);
  const importRequest = useRef(0);
  const copyRequest = useRef(0);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pluginJsonTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        // The user has started editing — retire the onboarding hint.
        setAiOnboarding(false);
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
      // Pre-select a safe, easy-to-understand node so the properties panel is
      // immediately live (selection alone never counts as an edit).
      setSelectedId(pickOnboardingNode(scene)?.id ?? null);
      history.current = { stack: [cloneScene(scene)], index: 0 };
      const info: AiInfo = {
        prompt: handoff.prompt,
        screenType: handoff.meta.screenType,
        locale: handoff.locale === "zh" ? "zh" : "en",
      };
      aiInfoRef.current = info;
      setAiInfo(info);
      // One-time activation hint per browser session.
      const showOnboarding = !onboardingSeen();
      if (showOnboarding) markOnboardingSeen();
      setAiOnboarding(showOnboarding);
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
    setAiOnboarding(false);
    stripFunnelParams();
    force();
  }

  // AI funnel helpers -----------------------------------------------------------

  // User-initiated selection (canvas click / component tree). Distinct from
  // the programmatic auto-select in the handoff effect, which must stay
  // silent so ai_editor_node_selected means a real user action.
  const handleUserSelect = useCallback(
    (id: string | null) => {
      const info = aiInfoRef.current;
      if (id && info) {
        const node = sceneRef.current.find((n) => n.id === id);
        if (node && node.id !== selectedId) {
          trackEvent("ai_editor_node_selected", {
            nodeClass: node.cls,
            screenType: info.screenType,
          });
        }
      }
      setSelectedId(id);
    },
    [selectedId]
  );

  // Track exports that came from an AI session with an ai_export event on top
  // of the existing export_code / download_project events.
  function trackAiExport(method: string) {
    if (!aiInfoRef.current) return;
    trackEvent("ai_export", {
      method,
      screenType: aiInfoRef.current.screenType,
    });
  }

  async function generateAiScene(
    promptText: string,
    locale: "en" | "zh" = "en",
    isRegenerate = false
  ) {
    const trimmed = promptText.trim();
    if (!trimmed || aiRegenerating) return;
    setAiRegenerating(true);
    setAiRegenerateError(null);
    setAiUpgradeSuggested(false);
    try {
      const proToken = loadClientProStatus()?.token;
      const response = await fetch("/api/generate-gui", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(proToken ? { "x-pro-token": proToken } : {}),
        },
        body: JSON.stringify({ prompt: trimmed, locale }),
      });
      const data = (await response.json().catch(() => null)) as {
        scene?: unknown;
        meta?: AiHandoff["meta"];
        error?: string;
        upgradeSuggested?: boolean;
      } | null;
      if (response.status === 429 || data?.upgradeSuggested) {
        trackEvent("ai_generate_failure", { reason: "rate_limited" });
        setAiUpgradeSuggested(true);
        setAiRegenerateError("Free AI quota reached (3/hr, 5/day).");
        return;
      }
      const generated = data?.scene ? sanitizeScene(data.scene) : null;
      if (!response.ok || !generated || !data?.meta) throw new Error("generate failed");
      trackEvent("ai_generate_success", {
        screenType: data.meta.screenType,
        fallbackUsed: data.meta.fallbackUsed === "template",
        latencyMs: data.meta.latencyMs,
        regenerate: isRegenerate,
      });
      sceneRef.current = generated;
      setScene(generated);
      setSelectedId(pickOnboardingNode(generated)?.id ?? null);
      setPreviewVisibility(null);
      setPreviewNotice(null);
      history.current = { stack: [cloneScene(generated)], index: 0 };
      const next: AiInfo = {
        prompt: trimmed,
        screenType: data.meta.screenType,
        locale,
      };
      aiInfoRef.current = next;
      setAiInfo(next);
      setAiPromptOpen(false);
      force();
    } catch {
      trackEvent("ai_generate_failure", { reason: isRegenerate ? "regenerate" : "inline_prompt" });
      setAiRegenerateError("AI generation failed — your current GUI is unchanged.");
    } finally {
      setAiRegenerating(false);
    }
  }

  function regenerateAiScene() {
    const info = aiInfoRef.current;
    if (!info) return;
    return generateAiScene(info.prompt, info.locale, true);
  }

  async function copyPluginJson() {
    try {
      const payload = serializeSceneDocument(scene);
      await navigator.clipboard.writeText(payload);
      setPluginJsonCopied(true);
      if (pluginJsonTimer.current) clearTimeout(pluginJsonTimer.current);
      pluginJsonTimer.current = setTimeout(() => setPluginJsonCopied(false), 2200);
      trackEvent("copy_plugin_json", { nodeCount: scene.length });
    } catch {
      setRbxmxExportError("Clipboard permission denied — unable to copy Plugin JSON.");
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

  async function exportRbxmxModel() {
    if (exportingRbxmx) return;
    setExportingRbxmx(true);
    setRbxmxExportError(null);
    trackEvent("export_rbxmx_click");
    try {
      const outcome = await requestEditorRbxmxExport(scene, "rbxmx");
      if (!outcome.ok) {
        if (outcome.unauthorized) {
          setProModalOpen(true);
        } else {
          setRbxmxExportError(outcome.message);
        }
        return;
      }
      const downloadUrl = URL.createObjectURL(outcome.blob);
      const anchor = document.createElement("a");
      anchor.href = downloadUrl;
      anchor.download = outcome.filename;
      trackEvent("download_project", { format: "rbxmx" });
      trackAiExport("download_rbxmx");
      anchor.click();
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      setRbxmxExportError(
        error instanceof Error && error.message
          ? error.message
          : "Could not export .rbxmx model."
      );
    } finally {
      setExportingRbxmx(false);
    }
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
      <div className="flex min-h-[75vh] flex-col gap-4 px-4 py-5 md:hidden">
        <div className="flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-lg bg-white">
              <img
                src="/logo.png"
                alt="Roblox GUI Maker"
                width={32}
                height={32}
                decoding="async"
                className="h-full w-full object-contain"
              />
            </span>
            <span className="text-sm font-semibold text-ink">Roblox GUI Editor</span>
          </Link>
          <div className="flex items-center gap-1 rounded-md bg-input p-1 text-xs">
            <button
              type="button"
              onClick={() => setDevice("desktop")}
              className={`rounded px-2 py-1 font-medium ${device === "desktop" ? "bg-raised text-ink" : "text-ink-dim"}`}
            >
              16:9
            </button>
            <button
              type="button"
              onClick={() => setDevice("mobile")}
              className={`rounded px-2 py-1 font-medium ${device === "mobile" ? "bg-raised text-ink" : "text-ink-dim"}`}
            >
              Mobile
            </button>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void generateAiScene(aiPromptInput, aiInfo?.locale ?? "en");
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={aiPromptInput}
            onChange={(e) => setAiPromptInput(e.target.value)}
            placeholder="Describe a GUI (e.g. simulator shop, RPG inventory)..."
            className="min-w-0 flex-1 rounded-lg border border-line bg-input px-3 py-2 text-xs text-ink placeholder:text-ink-mute focus:border-focus focus:outline-none"
          />
          <button
            type="submit"
            disabled={aiRegenerating || !aiPromptInput.trim()}
            className="shrink-0 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-on-primary disabled:opacity-50"
          >
            {aiRegenerating ? "Generating…" : "AI Build"}
          </button>
        </form>

        {aiInfo && (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line bg-panel px-3 py-2 text-xs">
            <span className="font-semibold text-focus">AI · {aiInfo.screenType}</span>
            <span className="min-w-0 flex-1 truncate text-ink-mute">&ldquo;{aiInfo.prompt}&rdquo;</span>
            <button
              type="button"
              onClick={() => void regenerateAiScene()}
              disabled={aiRegenerating}
              className="rounded border border-line px-2 py-0.5 text-[11px] font-medium text-ink"
            >
              Regenerate
            </button>
          </div>
        )}

        {aiRegenerateError && (
          <p role="alert" className="text-xs text-danger">
            {aiRegenerateError}
          </p>
        )}

        <div className="mx-auto w-full max-w-md">
          <ScenePreview scene={scene} device={device} />
        </div>

        {rbxmxExportError && (
          <p role="alert" className="text-xs text-danger">
            {rbxmxExportError}
          </p>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => void exportRbxmxModel()}
            disabled={exportingRbxmx}
            className="rounded-lg bg-primary px-3 py-2.5 text-xs font-semibold text-on-primary"
          >
            {exportingRbxmx ? "Exporting…" : "Export .rbxmx (Pro)"}
          </button>
          <button
            type="button"
            onClick={() => copyCode("client")}
            className="rounded-lg border border-line bg-panel px-3 py-2.5 text-xs font-semibold text-ink"
          >
            {copied === "client" ? "Copied Client Luau" : "Copy Client Luau"}
          </button>
          <button
            type="button"
            onClick={exportProject}
            className="rounded-lg border border-line bg-panel px-3 py-2 text-xs font-medium text-ink-dim"
          >
            Save JSON
          </button>
          <Link
            href="/templates"
            className="rounded-lg border border-line bg-panel px-3 py-2 text-center text-xs font-medium text-ink-dim"
          >
            Browse Templates
          </Link>
        </div>

        <div className="rounded-xl border border-line bg-panel">
          <button
            type="button"
            onClick={() => setMobileCodeOpen((o) => !o)}
            className="flex w-full items-center justify-between px-4 py-2.5 text-xs font-semibold text-ink"
          >
            <span>Generated Luau Code ({scene.length} nodes)</span>
            <span className="text-focus">{mobileCodeOpen ? "Hide" : "View"}</span>
          </button>
          {mobileCodeOpen && (
            <pre className="max-h-64 overflow-auto border-t border-line p-3 font-mono text-[11px] text-ink-dim">
              {clientCode}
            </pre>
          )}
        </div>

        <p className="text-center text-[11px] text-ink-mute">
          Drag-and-drop canvas &amp; properties inspector automatically unlock on tablet or desktop
          screens (≥768px).
        </p>
      </div>
      <div className="hidden h-screen w-full flex-col overflow-hidden md:flex">
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
        onToggleAiPrompt={() => setAiPromptOpen((open) => !open)}
        aiPromptOpen={aiPromptOpen}
        onExportRbxmx={() => void exportRbxmxModel()}
        exportingRbxmx={exportingRbxmx}
      />
      {aiPromptOpen && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void generateAiScene(aiPromptInput, aiInfo?.locale ?? "en");
          }}
          className="flex h-11 shrink-0 items-center gap-2 border-b border-line bg-panel-raised px-4 text-xs"
        >
          <span className="shrink-0 font-semibold text-focus">AI Prompt</span>
          <input
            type="text"
            value={aiPromptInput}
            onChange={(e) => setAiPromptInput(e.target.value)}
            placeholder="Describe a Roblox GUI to generate (e.g. simulator shop with 6 game passes, RPG inventory, horror menu)..."
            className="min-w-0 flex-1 rounded-md border border-line bg-input px-3 py-1.5 text-xs text-ink placeholder:text-ink-mute focus:border-focus focus:outline-none"
          />
          <button
            type="submit"
            disabled={aiRegenerating || !aiPromptInput.trim()}
            className="shrink-0 rounded-md bg-primary px-3 py-1.5 font-semibold text-on-primary transition hover:brightness-110 disabled:opacity-50"
          >
            {aiRegenerating ? "Generating…" : "Generate GUI"}
          </button>
          <button
            type="button"
            onClick={() => setAiPromptOpen(false)}
            className="rounded-md border border-line px-2.5 py-1.5 text-ink-dim hover:text-ink"
          >
            Cancel
          </button>
        </form>
      )}
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
          {aiUpgradeSuggested && (
            <button
              type="button"
              onClick={() => setProModalOpen(true)}
              className="rounded-md border border-focus/60 bg-raised px-2.5 py-1 font-semibold text-ink transition hover:border-focus hover:bg-raised-hi"
            >
              Unlock 10× AI Quota →
            </button>
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
              setAiOnboarding(false);
            }}
            aria-label="Dismiss AI bar"
            className="grid h-6 w-6 place-items-center rounded-md text-ink-mute transition hover:bg-raised hover:text-ink"
          >
            ×
          </button>
        </div>
      )}
      {aiInfo && aiOnboarding && (
        <div className="flex h-9 shrink-0 items-center gap-3 border-b border-line bg-primary/10 px-4 text-xs select-none">
          <span className="shrink-0 font-semibold text-focus">
            {ONBOARDING_COPY[aiInfo.locale].title}
          </span>
          <span className="min-w-0 flex-1 truncate text-ink-dim">
            {ONBOARDING_COPY[aiInfo.locale].body}
          </span>
          <button
            onClick={() => setAiOnboarding(false)}
            aria-label={ONBOARDING_COPY[aiInfo.locale].dismissLabel}
            className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-ink-mute transition hover:bg-raised hover:text-ink"
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
          onSelect={handleUserSelect}
          onRename={(id, name) => updateNode(id, { name })}
          onMoveInside={moveInside}
          onMoveRelative={moveRelative}
        />
        <Canvas
          scene={scene}
          selectedId={selectedId}
          device={device}
          onSelect={handleUserSelect}
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
          hint={
            aiInfo && aiOnboarding ? ONBOARDING_COPY[aiInfo.locale].hint : null
          }
        />
      </div>
      <CodePanel
        clientCode={clientCode}
        serverCode={serverCode}
        copied={copied}
        onCopy={copyCode}
        onDownload={downloadCode}
        onDownloadPackage={downloadProjectPackage}
        onExportRbxmx={() => void exportRbxmxModel()}
        exportingRbxmx={exportingRbxmx}
        exportError={rbxmxExportError}
        onCopyPluginJson={() => void copyPluginJson()}
        pluginJsonCopied={pluginJsonCopied}
      />
      </div>
      <ProUpgradeModal
        open={proModalOpen}
        onClose={() => setProModalOpen(false)}
        contextTitle={
          aiUpgradeSuggested
            ? "Unlock 10× AI GUI Quota + Studio .rbxmx Export"
            : "Export Native .rbxmx Model for Roblox Studio"
        }
        defaultPlan="starter_rbxmx"
        returnPath="/editor"
      />
    </>
  );
}
