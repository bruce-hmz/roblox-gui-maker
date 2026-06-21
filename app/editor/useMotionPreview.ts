"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import type { SceneNode } from "./catalog";
import {
  applyPreviewReducedMotion,
  beginPreviewInitialOpen,
  completePreviewTransition,
  createPreviewMotionSession,
  requestPreviewVisibility,
  resolvePreviewAction,
  setPreviewHoverInput,
  type PreviewMotionSession,
  type PreviewMotionState,
} from "./motion-preview";
import type { PreviewVisibility } from "./scene";
import { resolveSceneMotion } from "./motion";

export type UseMotionPreviewResult = {
  active: boolean;
  start: () => void;
  stop: () => void;
  visibility: PreviewVisibility | null;
  controllers: PreviewMotionState;
  requestButtonAction: (buttonId: string) => string | null;
  completeTransition: (nodeId: string, token: number) => void;
  setHoverInput: (nodeId: string, input: "pointer" | "focus", active: boolean) => void;
  reducedMotion: boolean;
};

const EMPTY_CONTROLLERS: PreviewMotionState = Object.freeze({});
const cloneScene = (scene: readonly SceneNode[]) =>
  scene.map((node) => structuredClone(node));

export function useMotionPreview(scene: SceneNode[]): UseMotionPreviewResult {
  const [session, updateSession] = useReducer(
    (_: PreviewMotionSession | null, next: PreviewMotionSession | null) => next,
    null,
  );
  const [reducedMotion, setReducedMotion] = useState(false);
  const reducedMotionRef = useRef(false);
  const mediaQueryRef = useRef<MediaQueryList | null>(null);
  const mediaListenerRef = useRef<(() => void) | null>(null);
  const snapshot = useRef<SceneNode[]>([]);
  const frames = useRef<number[]>([]);
  const sessionRef = useRef<PreviewMotionSession | null>(null);

  const setSession = useCallback((next: PreviewMotionSession | null) => {
    sessionRef.current = next;
    updateSession(next);
  }, []);
  const transform = useCallback((fn: (value: PreviewMotionSession) => PreviewMotionSession) => {
    const current = sessionRef.current;
    if (!current) return;
    setSession(fn(current));
  }, [setSession]);
  const cancelFrames = useCallback(() => {
    for (const frame of frames.current) cancelAnimationFrame(frame);
    frames.current = [];
  }, []);
  const unsubscribeReducedMotion = useCallback(() => {
    const query = mediaQueryRef.current;
    const listener = mediaListenerRef.current;
    if (query && listener) query.removeEventListener("change", listener);
    mediaQueryRef.current = null;
    mediaListenerRef.current = null;
  }, []);

  const stop = useCallback(() => {
    cancelFrames();
    unsubscribeReducedMotion();
    snapshot.current = [];
    setSession(null);
  }, [cancelFrames, setSession, unsubscribeReducedMotion]);

  const start = useCallback(() => {
    cancelFrames();
    unsubscribeReducedMotion();
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const changed = () => {
      reducedMotionRef.current = query.matches;
      setReducedMotion(query.matches);
      if (query.matches) transform((value) => applyPreviewReducedMotion(value, true));
    };
    reducedMotionRef.current = query.matches;
    setReducedMotion(query.matches);
    query.addEventListener("change", changed);
    mediaQueryRef.current = query;
    mediaListenerRef.current = changed;
    snapshot.current = cloneScene(scene);
    const initial = createPreviewMotionSession(snapshot.current);
    const resolved = resolveSceneMotion(snapshot.current);
    setSession(initial);
    const first = requestAnimationFrame(() => {
      const second = requestAnimationFrame(() => {
        transform((current) => Object.keys(current.controllers).reduce((next, nodeId) => {
          const begun = beginPreviewInitialOpen(next, nodeId, reducedMotionRef.current);
          const controller = begun.controllers[nodeId];
          return controller?.phase === "opening" && !resolved.get(nodeId)?.effectivePreset
            ? completePreviewTransition(begun, nodeId, controller.token)
            : begun;
        }, current));
      });
      frames.current.push(second);
    });
    frames.current.push(first);
  }, [cancelFrames, scene, setSession, transform, unsubscribeReducedMotion]);
  useEffect(() => () => {
    cancelFrames();
    unsubscribeReducedMotion();
    sessionRef.current = null;
  }, [cancelFrames, unsubscribeReducedMotion]);

  const requestButtonAction = useCallback((buttonId: string) => {
    if (!sessionRef.current) return null;
    const action = resolvePreviewAction(snapshot.current, buttonId);
    if (action.kind === "notice") return action.message;
    if (action.kind === "none") return null;
    transform((current) => {
      if (action.kind === "hideGui") {
        return snapshot.current
          .filter((node) => node.cls === "ScreenGui" && node.parentId === null)
          .reduce((next, node) => requestPreviewVisibility(next, node.id, false, reducedMotionRef.current), current);
      }
      const controller = current.controllers[action.targetId];
      const visible = controller?.desiredOpen ?? current.visibility[action.targetId] === true;
      const desired = action.request === "show" ? true : action.request === "hide" ? false : !visible;
      return requestPreviewVisibility(current, action.targetId, desired, reducedMotionRef.current);
    });
    return null;
  }, [transform]);

  return {
    active: session !== null,
    start,
    stop,
    visibility: session?.visibility ?? null,
    controllers: session?.controllers ?? EMPTY_CONTROLLERS,
    requestButtonAction,
    completeTransition: (nodeId, token) => transform((value) => completePreviewTransition(value, nodeId, token)),
    setHoverInput: (nodeId, input, active) => transform((value) => setPreviewHoverInput(value, nodeId, input, active)),
    reducedMotion,
  };
}
