import { describe, expect, it } from "vitest";
import type { SceneNode } from "./catalog";
import {
  applyPreviewReducedMotion,
  beginPreviewInitialOpen,
  completePreviewTransition,
  createPreviewMotionSession,
  previewHoverScale,
  previewTransitionDurationMs,
  requestPreviewVisibility,
  resolvePreviewAction,
  setPreviewHoverInput,
} from "./motion-preview";
import { MOTION_DEFAULTS } from "./motion";

const node = (overrides: Partial<SceneNode>): SceneNode => ({
  id: "node",
  cls: "Frame",
  name: "Node",
  parentId: null,
  pos: { x: 0, y: 0 },
  size: { x: 1, y: 1 },
  color: "#000000",
  transparency: 0,
  cornerRadius: 0,
  zindex: 1,
  ...overrides,
});

describe("preview motion session", () => {
  it("creates deferred, closed, canonical-open, and hover-only controllers", () => {
    const scene = [
      node({ id: "root", cls: "ScreenGui" }),
      node({ id: "animated", parentId: "root", motion: { preset: "fade" } }),
      node({ id: "hidden", parentId: "root", initialVisible: false, motion: { preset: "scale" } }),
      node({ id: "hidden-parent", parentId: "root", initialVisible: false }),
      node({ id: "hidden-child", parentId: "hidden-parent", motion: { preset: "slide" } }),
      node({ id: "hover", cls: "TextButton", parentId: "root", motion: { hover: true } }),
      node({ id: "plain", parentId: "root" }),
    ];

    const session = createPreviewMotionSession(scene);

    expect(session.controllers.animated).toEqual({ desiredOpen: true, phase: "closed", token: 0, pointerInside: false, focused: false });
    expect(session.controllers.hidden).toMatchObject({ desiredOpen: false, phase: "closed", token: 0 });
    expect(session.controllers["hidden-child"]).toMatchObject({ desiredOpen: true, phase: "open", token: 0 });
    expect(session.controllers.hover).toMatchObject({ desiredOpen: true, phase: "open", token: 0 });
    expect(session.controllers.plain).toBeUndefined();
    expect(session.controllers.root).toBeUndefined();
    expect(session.visibility).toMatchObject({ root: true, animated: true, hidden: false, "hidden-parent": false, "hidden-child": true, hover: true, plain: true });
  });

  it("begins an untouched initial open exactly once", () => {
    const initial = createPreviewMotionSession([node({ id: "panel", motion: { preset: "fade" } })]);
    const shownAgain = requestPreviewVisibility(initial, "panel", true, false);
    expect(shownAgain).toBe(initial);

    const opening = beginPreviewInitialOpen(shownAgain, "panel", false);
    expect(opening.controllers.panel).toMatchObject({ desiredOpen: true, phase: "opening", token: 1 });
    expect(beginPreviewInitialOpen(opening, "panel", false)).toBe(opening);

    const reducedInitial = createPreviewMotionSession([node({ id: "panel", motion: { preset: "fade" } })]);
    const open = beginPreviewInitialOpen(reducedInitial, "panel", true);
    expect(open.controllers.panel).toMatchObject({ desiredOpen: true, phase: "open", token: 1 });
    expect(beginPreviewInitialOpen(open, "panel", false)).toBe(open);
  });

  it("invalidates stale completions during rapid direct requests", () => {
    const initial = createPreviewMotionSession([node({ id: "panel", motion: { preset: "fade" } })]);
    const opening = beginPreviewInitialOpen(initial, "panel", false);
    const closing = requestPreviewVisibility(opening, "panel", false, false);
    expect(closing.controllers.panel).toMatchObject({ phase: "closing", desiredOpen: false, token: 2 });
    const reopened = requestPreviewVisibility(closing, "panel", true, false);
    expect(reopened.controllers.panel).toMatchObject({ phase: "opening", desiredOpen: true, token: 3 });
    expect(reopened.visibility.panel).toBe(true);
    expect(completePreviewTransition(reopened, "panel", 2)).toBe(reopened);
    const complete = completePreviewTransition(reopened, "panel", 3);
    expect(complete.controllers.panel.phase).toBe("open");
    expect(completePreviewTransition(complete, "panel", 3)).toBe(complete);
  });

  it("atomically hides only after a valid close completion", () => {
    const initial = createPreviewMotionSession([node({ id: "panel", initialVisible: false, motion: { preset: "fade" } })]);
    const opening = requestPreviewVisibility(initial, "panel", true, false);
    expect(opening.visibility.panel).toBe(true);
    const open = completePreviewTransition(opening, "panel", 1);
    const closing = requestPreviewVisibility(open, "panel", false, false);
    expect(closing.visibility.panel).toBe(true);
    const closed = completePreviewTransition(closing, "panel", 2);
    expect(closed.controllers.panel.phase).toBe("closed");
    expect(closed.visibility.panel).toBe(false);
    expect(requestPreviewVisibility(closed, "panel", false, false)).toBe(closed);
  });

  it("cancels the initial sentinel when hidden before its scheduled begin", () => {
    const initial = createPreviewMotionSession([node({ id: "panel", motion: { preset: "fade" } })]);
    const closing = requestPreviewVisibility(initial, "panel", false, false);
    expect(closing.controllers.panel).toMatchObject({ desiredOpen: false, phase: "closing", token: 1 });
    expect(beginPreviewInitialOpen(closing, "panel", false)).toBe(closing);
    expect(completePreviewTransition(closing, "panel", 1).visibility.panel).toBe(false);
  });

  it("snaps requests and active transitions under reduced motion", () => {
    const hidden = createPreviewMotionSession([node({ id: "panel", initialVisible: false, motion: { preset: "fade" } })]);
    const animatedOpen = requestPreviewVisibility(hidden, "panel", true, false);
    const snappedOpen = applyPreviewReducedMotion(animatedOpen, true);
    expect(snappedOpen.controllers.panel).toMatchObject({ desiredOpen: true, phase: "open", token: 2 });
    expect(snappedOpen.visibility.panel).toBe(true);
    expect(completePreviewTransition(snappedOpen, "panel", 1)).toBe(snappedOpen);

    const open = requestPreviewVisibility(hidden, "panel", true, true);
    expect(open.controllers.panel).toMatchObject({ desiredOpen: true, phase: "open", token: 1 });
    expect(open.visibility.panel).toBe(true);
    const closed = requestPreviewVisibility(open, "panel", false, true);
    expect(closed.controllers.panel).toMatchObject({ desiredOpen: false, phase: "closed", token: 2 });
    expect(closed.visibility.panel).toBe(false);
    expect(requestPreviewVisibility(closed, "panel", false, true)).toBe(closed);

    const closing = requestPreviewVisibility(open, "panel", false, false);
    const snapped = applyPreviewReducedMotion(closing, true);
    expect(snapped.controllers.panel).toMatchObject({ phase: "closed", desiredOpen: false, token: 3 });
    expect(snapped.visibility.panel).toBe(false);
    expect(completePreviewTransition(snapped, "panel", 2)).toBe(snapped);
    expect(applyPreviewReducedMotion(snapped, false)).toBe(snapped);
  });

  it("tracks pointer and focus independently and derives hover scale", () => {
    const initial = createPreviewMotionSession([node({ id: "button", cls: "TextButton", motion: { hover: true } })]);
    const pointer = setPreviewHoverInput(initial, "button", "pointer", true);
    expect(pointer.controllers.button).toMatchObject({ pointerInside: true, focused: false });
    expect(previewHoverScale(pointer.controllers.button, false)).toBe(MOTION_DEFAULTS.hoverScale);
    const focused = setPreviewHoverInput(pointer, "button", "focus", true);
    const noPointer = setPreviewHoverInput(focused, "button", "pointer", false);
    expect(previewHoverScale(noPointer.controllers.button, false)).toBe(MOTION_DEFAULTS.hoverScale);
    expect(previewHoverScale(noPointer.controllers.button, true)).toBe(1);
    const closing = requestPreviewVisibility(noPointer, "button", false, false);
    expect(previewHoverScale(closing.controllers.button, false)).toBe(1);
    expect(setPreviewHoverInput(closing, "button", "pointer", false)).toBe(closing);
  });

  it("derives transition durations from lifecycle state", () => {
    const initial = createPreviewMotionSession([node({ id: "panel", motion: { preset: "scale" } })]);
    const opening = beginPreviewInitialOpen(initial, "panel", false);
    const open = completePreviewTransition(opening, "panel", 1);
    const closing = requestPreviewVisibility(open, "panel", false, false);
    expect(previewTransitionDurationMs(initial.controllers.panel, 777, false)).toBe(0);
    expect(previewTransitionDurationMs(opening.controllers.panel, 777, false)).toBe(777);
    expect(previewTransitionDurationMs(open.controllers.panel, 777, false)).toBe(777);
    expect(previewTransitionDurationMs(closing.controllers.panel, 777, false)).toBe(777);
    expect(previewTransitionDurationMs(open.controllers.panel, 777, true)).toBe(0);
    expect(previewTransitionDurationMs(completePreviewTransition(closing, "panel", 2).controllers.panel, 777, false)).toBe(0);
  });

  it("keeps descendant motion untouched by direct plain-ancestor visibility", () => {
    const scene = [node({ id: "parent" }), node({ id: "child", parentId: "parent", motion: { preset: "fade" } })];
    const initial = createPreviewMotionSession(scene);
    const child = initial.controllers.child;
    const hidden = requestPreviewVisibility(initial, "parent", false, false);
    expect(hidden.controllers.child).toBe(child);
    expect(hidden.visibility.parent).toBe(false);
    expect(hidden.visibility.child).toBe(true);
    const shown = requestPreviewVisibility(hidden, "parent", true, false);
    expect(shown.controllers.child).toBe(child);
  });
});

describe("preview action routing", () => {
  const sceneFor = (action: SceneNode["action"]): SceneNode[] => [
    node({ id: "root", cls: "ScreenGui" }),
    node({ id: "panel", parentId: "root" }),
    node({ id: "button", cls: "TextButton", parentId: "root", action }),
  ];

  it.each(["show", "hide", "toggle"] as const)("routes %s to only its direct target", (request) => {
    expect(resolvePreviewAction(sceneFor({ type: request, targetId: "panel" }), "button")).toEqual({ kind: "visibility", targetId: "panel", request });
  });

  it("routes hide-GUI and valid server-backed notices", () => {
    expect(resolvePreviewAction(sceneFor({ type: "hideGui" }), "button")).toEqual({ kind: "hideGui" });
    expect(resolvePreviewAction(sceneFor({ type: "remoteEvent", eventName: "ShopAction", argument: "buy" }), "button")).toEqual({ kind: "notice", message: "RemoteEvent actions run in Roblox Studio." });
    expect(resolvePreviewAction(sceneFor({ type: "teleport", placeId: "123" }), "button")).toEqual({ kind: "notice", message: "Teleport to Place 123. Preview does not run live teleports." });
  });

  it("returns none for missing, malformed, non-button, and invalid targets", () => {
    expect(resolvePreviewAction(sceneFor(undefined), "missing")).toEqual({ kind: "none" });
    expect(resolvePreviewAction(sceneFor({ type: "show", targetId: "missing" }), "button")).toEqual({ kind: "none" });
    expect(resolvePreviewAction(sceneFor({ type: "remoteEvent", eventName: "bad-name", argument: "x" }), "button")).toEqual({ kind: "none" });
    expect(resolvePreviewAction(sceneFor({ type: "teleport", placeId: "01" }), "button")).toEqual({ kind: "none" });
    const malformed = sceneFor({ type: "show", targetId: "panel" });
    malformed[2].cls = "Frame";
    expect(resolvePreviewAction(malformed, "button")).toEqual({ kind: "none" });
  });
});
