import type { SceneNode } from "./catalog";
import { MOTION_DEFAULTS, resolveSceneMotion } from "./motion";
import { sanitizeRemoteEventAction } from "./remote-events";
import {
  createPreviewVisibility,
  findUniqueSceneNode,
  previewActionNotice,
  resolvePreviewActionTarget,
  type PreviewVisibility,
} from "./scene";
import { sanitizeTeleportAction } from "./teleports";

export type MotionPhase = "closed" | "opening" | "open" | "closing";

export type PreviewMotionController = Readonly<{
  desiredOpen: boolean;
  phase: MotionPhase;
  token: number;
  pointerInside: boolean;
  focused: boolean;
}>;

export type PreviewMotionState = Readonly<
  Record<string, PreviewMotionController>
>;

export type PreviewMotionSession = Readonly<{
  controllers: PreviewMotionState;
  visibility: Readonly<PreviewVisibility>;
}>;

export type PreviewActionRequest =
  | { kind: "none" }
  | { kind: "notice"; message: string }
  | { kind: "hideGui" }
  | {
      kind: "visibility";
      targetId: string;
      request: "show" | "hide" | "toggle";
    };

const NONE: PreviewActionRequest = Object.freeze({ kind: "none" });

function freezeController(
  controller: PreviewMotionController,
): PreviewMotionController {
  return Object.freeze(controller);
}

function updateSession(
  session: PreviewMotionSession,
  nodeId: string,
  controller: PreviewMotionController,
  visible: boolean,
): PreviewMotionSession {
  const controllers = Object.freeze({
    ...session.controllers,
    [nodeId]: freezeController(controller),
  });
  const visibility =
    session.visibility[nodeId] === visible
      ? session.visibility
      : Object.freeze({ ...session.visibility, [nodeId]: visible });
  return Object.freeze({ controllers, visibility });
}

export function createPreviewMotionSession(
  scene: readonly SceneNode[],
): PreviewMotionSession {
  const motion = resolveSceneMotion(scene);
  const visibility = Object.freeze(createPreviewVisibility(scene));
  const controllers: Record<string, PreviewMotionController> = {};

  for (const node of scene) {
    if (controllers[node.id]) continue;
    const resolved = motion.get(node.id);
    if (!resolved || (!resolved.effectivePreset && !resolved.hover)) continue;

    const desiredOpen = visibility[node.id] === true;
    const phase: MotionPhase = resolved.initialOpen
      ? "closed"
      : desiredOpen
        ? "open"
        : "closed";
    controllers[node.id] = freezeController({
      desiredOpen,
      phase,
      token: 0,
      pointerInside: false,
      focused: false,
    });
  }

  return Object.freeze({ controllers: Object.freeze(controllers), visibility });
}

export function beginPreviewInitialOpen(
  session: PreviewMotionSession,
  nodeId: string,
  reducedMotion: boolean,
): PreviewMotionSession {
  const controller = session.controllers[nodeId];
  if (
    !controller ||
    !controller.desiredOpen ||
    controller.phase !== "closed" ||
    controller.token !== 0
  ) {
    return session;
  }
  return updateSession(
    session,
    nodeId,
    {
      ...controller,
      phase: reducedMotion ? "open" : "opening",
      token: controller.token + 1,
    },
    true,
  );
}

export function requestPreviewVisibility(
  session: PreviewMotionSession,
  nodeId: string,
  desiredOpen: boolean,
  reducedMotion: boolean,
): PreviewMotionSession {
  if (!(nodeId in session.visibility)) return session;
  const controller = session.controllers[nodeId];
  if (!controller) {
    if (session.visibility[nodeId] === desiredOpen) return session;
    return Object.freeze({
      controllers: session.controllers,
      visibility: Object.freeze({
        ...session.visibility,
        [nodeId]: desiredOpen,
      }),
    });
  }
  if (controller.desiredOpen === desiredOpen) return session;
  const hidingUntouchedInitialOpen =
    !desiredOpen &&
    controller.desiredOpen &&
    controller.phase === "closed" &&
    controller.token === 0;

  return updateSession(
    session,
    nodeId,
    {
      ...controller,
      desiredOpen,
      phase: reducedMotion || hidingUntouchedInitialOpen
        ? desiredOpen
          ? "open"
          : "closed"
        : desiredOpen
          ? "opening"
          : "closing",
      token: controller.token + 1,
    },
    desiredOpen
      ? true
      : reducedMotion || hidingUntouchedInitialOpen
        ? false
        : session.visibility[nodeId],
  );
}

export function completePreviewTransition(
  session: PreviewMotionSession,
  nodeId: string,
  token: number,
): PreviewMotionSession {
  const controller = session.controllers[nodeId];
  if (
    !controller ||
    controller.token !== token ||
    (controller.phase !== "opening" && controller.phase !== "closing")
  ) {
    return session;
  }

  const open = controller.phase === "opening";
  return updateSession(
    session,
    nodeId,
    { ...controller, phase: open ? "open" : "closed" },
    open,
  );
}

export function setPreviewHoverInput(
  session: PreviewMotionSession,
  nodeId: string,
  input: "pointer" | "focus",
  active: boolean,
): PreviewMotionSession {
  const controller = session.controllers[nodeId];
  if (!controller) return session;
  const key = input === "pointer" ? "pointerInside" : "focused";
  if (controller[key] === active) return session;
  return updateSession(
    session,
    nodeId,
    { ...controller, [key]: active },
    session.visibility[nodeId],
  );
}

export function applyPreviewReducedMotion(
  session: PreviewMotionSession,
  reducedMotion: boolean,
): PreviewMotionSession {
  if (!reducedMotion) return session;

  let changed = false;
  const controllers: Record<string, PreviewMotionController> = {};
  const visibility: PreviewVisibility = { ...session.visibility };
  for (const [nodeId, controller] of Object.entries(session.controllers)) {
    const terminalPhase = controller.desiredOpen ? "open" : "closed";
    if (controller.phase === terminalPhase) {
      controllers[nodeId] = controller;
    } else {
      changed = true;
      controllers[nodeId] = freezeController({
        ...controller,
        phase: terminalPhase,
        token: controller.token + 1,
      });
      visibility[nodeId] = controller.desiredOpen;
    }
  }
  if (!changed) return session;
  return Object.freeze({
    controllers: Object.freeze(controllers),
    visibility: Object.freeze(visibility),
  });
}

export function previewHoverScale(
  controller: PreviewMotionController,
  reducedMotion: boolean,
): number {
  return !reducedMotion &&
    controller.phase === "open" &&
    (controller.pointerInside || controller.focused)
    ? MOTION_DEFAULTS.hoverScale
    : 1;
}

export function previewTransitionDurationMs(
  controller: PreviewMotionController,
  configuredDurationMs: number,
  reducedMotion: boolean,
): number {
  if (
    reducedMotion ||
    (controller.phase === "closed" &&
      (controller.token === 0 || !controller.desiredOpen))
  ) {
    return 0;
  }
  return configuredDurationMs;
}

export function resolvePreviewAction(
  scene: readonly SceneNode[],
  buttonId: string,
): PreviewActionRequest {
  const button = findUniqueSceneNode(scene, buttonId);
  if (button?.cls !== "TextButton" || !button.action) return NONE;

  const target = resolvePreviewActionTarget(scene, buttonId);
  if (target) return { kind: "visibility", ...target };
  if (button.action.type === "hideGui") return { kind: "hideGui" };
  if (
    button.action.type === "remoteEvent" &&
    sanitizeRemoteEventAction(button.action)
  ) {
    return { kind: "notice", message: previewActionNotice(scene, buttonId)! };
  }
  if (
    button.action.type === "teleport" &&
    sanitizeTeleportAction(button.action)
  ) {
    return { kind: "notice", message: previewActionNotice(scene, buttonId)! };
  }
  return NONE;
}
