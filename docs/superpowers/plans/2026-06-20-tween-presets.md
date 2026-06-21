# Tween Presets Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add node-owned Fade, Slide, Scale, and TextButton Hover presets with deterministic editor Preview behavior, reduced-motion support, version-2 persistence, and generated Roblox TweenService client code.

**Architecture:** Put validation, resolver precedence, and fixed effect constants in a pure `motion.ts` module. Keep transient Preview state in a separate pure reducer plus a React hook, and isolate generated Luau runtime text in `motion-luau.ts` so `scene.ts` remains the instance/action orchestrator. Existing visibility actions request target controller state; RemoteEvent, Teleport, server Luau, and static public previews remain unchanged.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Roblox Luau/TweenService/GuiService, Vitest 4, Playwright 1.61, Tailwind CSS v4.

---

## File Responsibility Map

- Create `app/editor/motion.ts`: motion defaults, class gating, sanitizer, top-down resolver precedence, effective-initial-visibility helper, and fixed CSS effect goals.
- Create `app/editor/motion.test.ts`: pure contract, precedence, visibility-chain, and goal tests.
- Modify `app/editor/catalog.ts`: persisted motion types and optional SceneNode field.
- Modify `app/editor/persistence.ts`: version-1 migration, version-2 serialization, and motion sanitization.
- Modify `app/editor/persistence.test.ts`: migration, version-2 round-trip, malformed field, and unsupported-class coverage.
- Modify `app/editor/scene.ts`: motion deep copy and integration with the focused Luau generator.
- Modify `app/editor/scene.test.ts`: duplicate isolation, legacy output, action integration, and exact motion fragments.
- Create `app/editor/BoundedNumberField.tsx`: shared arbitrary-draft bounded numeric field extracted from layout controls.
- Modify `app/editor/LayoutProperties.tsx`: consume the shared numeric field without behavior changes.
- Create `app/editor/MotionProperties.tsx`: conditional transition, duration, direction, Hover, and fallback warnings.
- Modify `app/editor/PropertiesPanel.tsx`: render Motion controls for eligible classes.
- Create `app/editor/motion-preview.ts`: pure desired-state/phase/token/hover reducer.
- Create `app/editor/motion-preview.test.ts`: interruption, stale completion, reduced motion, and direct-target tests.
- Create `app/editor/useMotionPreview.ts`: Preview lifecycle, media-query subscription, and transition callbacks.
- Modify `app/editor/Editor.tsx`: hook integration, action routing, scene freeze, cloning, and Preview start/stop.
- Modify `app/editor/Canvas.tsx`: motion styles, phase markers, transition completion, and Hover input.
- Modify `app/editor/Toolbar.tsx`: disable scene-mutating controls during Preview.
- Modify `app/editor/Palette.tsx`: inert/disabled component and hierarchy surfaces during Preview.
- Create `app/editor/motion-luau.ts`: service/runtime/controller generation and action-call lookup.
- Create `app/editor/motion-luau.test.ts`: exact Luau runtime, effects, reduced-motion, ownership, and cleanup contracts.
- Create `e2e/editor-motion.spec.ts`: properties, Preview, fallback, persistence, package, reduced-motion, and freeze journey.
- Modify `docs/superpowers/plans/2026-06-20-tween-presets.md`: record release evidence only after every gate passes.

## Task 1: Motion Contract, Sanitizer, And Resolver Precedence

**Files:**
- Create: `app/editor/motion.ts`
- Create: `app/editor/motion.test.ts`
- Modify: `app/editor/catalog.ts`

- [ ] **Step 1: Write failing class, sanitizer, and resolver tests**

Create a complete SceneNode fixture in `motion.test.ts` and add these contracts:

```ts
import { describe, expect, it } from "vitest";
import type { SceneNode } from "./catalog";
import {
  MOTION_DEFAULTS,
  isEffectivelyInitiallyVisible,
  motionClosedOffset,
  resolveSceneMotion,
  sanitizeMotion,
} from "./motion";

const node = (overrides: Partial<SceneNode> = {}): SceneNode => ({
  id: "node",
  cls: "Frame",
  name: "Node",
  pos: { x: 0, y: 0 },
  size: { x: 0.5, y: 0.5 },
  color: "#112233",
  transparency: 0,
  cornerRadius: 0,
  zindex: 1,
  ...overrides,
});

it("sanitizes bounded motion values without accepting unsupported classes", () => {
  expect(sanitizeMotion({
    preset: "slide",
    durationMs: 248.6,
    slideDirection: "right",
    hover: true,
  }, "TextButton")).toEqual({
    preset: "slide",
    durationMs: 249,
    slideDirection: "right",
    hover: true,
  });
  expect(sanitizeMotion({ preset: "fade" }, "ScreenGui")).toBeUndefined();
  expect(sanitizeMotion({ preset: "spin", durationMs: "fast" }, "Frame"))
    .toBeUndefined();
});

it("applies layout fallback before ancestor Fade ownership", () => {
  const scene = [
    node({ id: "root", cls: "ScreenGui" }),
    node({ id: "fade-parent", parentId: "root", motion: { preset: "fade" } }),
    node({
      id: "layout-parent",
      parentId: "fade-parent",
      layout: "list",
    }),
    node({
      id: "slide-child",
      parentId: "layout-parent",
      motion: { preset: "slide", slideDirection: "right" },
    }),
  ];
  const resolved = resolveSceneMotion(scene).get("slide-child");
  expect(resolved).toMatchObject({
    preset: "slide",
    effectivePreset: "scale",
    slideBlocked: true,
    fadeBlocked: true,
  });
});

it("does not defer initial Open under a hidden ancestor", () => {
  const scene = [
    node({ id: "parent", initialVisible: false }),
    node({ id: "child", parentId: "parent", motion: { preset: "scale" } }),
  ];
  expect(isEffectivelyInitiallyVisible(scene, scene[1])).toBe(false);
  expect(resolveSceneMotion(scene).get("child")?.initialOpen).toBe(false);
});

it("defines exact Slide closed offsets", () => {
  expect(motionClosedOffset("left")).toEqual({ x: -24, y: 0 });
  expect(motionClosedOffset("right")).toEqual({ x: 24, y: 0 });
  expect(motionClosedOffset("up")).toEqual({ x: 0, y: -24 });
  expect(motionClosedOffset("down")).toEqual({ x: 0, y: 24 });
});
```

Also assert deep immutability of `MOTION_DEFAULTS`, duration clamps at 100/2000, false Hover omission, Hover omission outside TextButton, Hover-only default duration, empty-object normalization, direct Fade-under-Fade to Scale, and a layout Slide with no Fade ancestor to preliminary Fade only.

- [ ] **Step 2: Run the new unit file for RED**

Run: `npm test -- app/editor/motion.test.ts`

Expected: FAIL because the motion types and module do not exist.

- [ ] **Step 3: Add persisted motion types**

Add exactly these exported types to `catalog.ts` and `motion?: NodeMotion` beside visibility/action fields:

```ts
export type MotionPreset = "fade" | "slide" | "scale";
export type SlideDirection = "left" | "right" | "up" | "down";
export type NodeMotion = {
  preset?: MotionPreset;
  durationMs?: number;
  slideDirection?: SlideDirection;
  hover?: boolean;
};
```

- [ ] **Step 4: Implement the pure motion boundary**

In `motion.ts`, export:

```ts
export type ResolvedMotionDefaults = Readonly<{
  durationMs: number;
  slideDirection: SlideDirection;
  easingStyle: "quad";
  easingDirection: "out";
  closedScale: number;
  hoverScale: number;
  slideOffsetPx: number;
}>;
export type ResolvedMotion = Readonly<{
  eligible: boolean;
  preset?: MotionPreset;
  effectivePreset?: MotionPreset;
  durationMs: number;
  slideDirection: SlideDirection;
  hover: boolean;
  slideBlocked: boolean;
  fadeBlocked: boolean;
  initialOpen: boolean;
}>;
export const MOTION_DEFAULTS: ResolvedMotionDefaults;
export function isMotionClass(cls: RobloxClass): boolean;
export function sanitizeMotion(raw: unknown, cls: RobloxClass): NodeMotion | undefined;
export function resolveSceneMotion(scene: readonly SceneNode[]): ReadonlyMap<string, ResolvedMotion>;
export function isEffectivelyInitiallyVisible(
  scene: readonly SceneNode[],
  node: SceneNode
): boolean;
export function motionClosedOffset(direction: SlideDirection): Readonly<{ x: number; y: number }>;
```

Freeze every `ResolvedMotion` value before placing it in the returned Map.
Resolve top-down: Slide under parent layout becomes preliminary Fade; any
preliminary Fade under an ancestor whose final effect is Fade becomes Scale.
Unsupported classes resolve to `eligible: false`, no effective preset, and no
Hover. The resolver calls `sanitizeMotion(node.motion, node.cls)` internally so
direct runtime callers cannot bypass duration bounds, enum mapping, or class
gating with a TypeScript cast.

Assert `closedScale === 0.92` and `hoverScale === 1.03` in the pure tests. Freeze
defaults at runtime. Do not import React or mutate scene nodes.

- [ ] **Step 5: Run focused tests and TypeScript for GREEN**

Run:

```bash
npm test -- app/editor/motion.test.ts
npx tsc --noEmit
```

Expected: every motion contract passes and TypeScript exits 0.

- [ ] **Step 6: Commit the motion contract**

Stage only `catalog.ts`, `motion.ts`, and `motion.test.ts`. Commit with the lore format; record that timelines, custom easing, and action-owned payloads are rejected.

## Task 2: Version-2 Persistence And Copy Isolation

**Files:**
- Modify: `app/editor/persistence.ts`
- Modify: `app/editor/persistence.test.ts`
- Modify: `app/editor/scene.ts`
- Modify: `app/editor/scene.test.ts`
- Modify: `app/editor/Editor.tsx`

- [ ] **Step 1: Write failing migration and round-trip tests**

Add tests proving:

```ts
const version1 = JSON.stringify({
  format: "roblox-gui-maker",
  version: 1,
  scene: [node()],
});
expect(parseSceneDocument(version1)).toEqual([node()]);

const forgedVersion1 = JSON.stringify({
  format: "roblox-gui-maker",
  version: 1,
  scene: [node({ motion: { preset: "fade" } })],
});
expect(parseSceneDocument(forgedVersion1)[0].motion).toBeUndefined();

const version2Scene = [node({
  cls: "TextButton",
  motion: {
    preset: "slide",
    durationMs: 320,
    slideDirection: "down",
    hover: true,
  },
})];
const serialized = serializeSceneDocument(version2Scene);
expect(JSON.parse(serialized).version).toBe(2);
expect(parseSceneDocument(serialized)).toEqual(version2Scene);
```

Add malformed optional fields, ScreenGui motion omission, Hover class gating,
and version 3 rejection. Assert a valid node survives malformed motion. Add a
test-only `parseWithVersion1Gate` fixture that accepts only `version === 1` and
assert it rejects serialized version 2, proving the new number prevents silent
downgrade in a legacy reader.

- [ ] **Step 2: Write the failing duplicate/history copy test**

Duplicate a subtree whose node has motion, mutate the clone's `durationMs` and
`slideDirection`, and assert the source object remains unchanged. Do not modify
implementation in this RED step; Editor history isolation is covered in the
Task 7 browser journey.

- [ ] **Step 3: Run persistence and scene tests for RED**

Run:

```bash
npm test -- app/editor/persistence.test.ts app/editor/scene.test.ts
```

Expected: FAIL because version 1 is still the only accepted version and motion is not sanitized or copied.

- [ ] **Step 4: Implement version-2 migration and serialization**

Set `PROJECT_VERSION = 2`, accept document versions 1 and 2, and reject every
other version. Add `sanitizeScene(raw, { allowMotion = true } = {})`; document
version 1 calls it with `allowMotion: false`, so even a forged v1 `motion` member
is ignored. Version 2 and localStorage call it with motion enabled. Only the
enabled path spreads `sanitizeMotion(source.motion, source.cls as RobloxClass)`
when it returns a value.

Do not add downgrade export. Serialization always writes version 2 so a version-1-only reader fails at its version gate instead of silently stripping motion.

- [ ] **Step 5: Copy motion in scene snapshots**

In `duplicateSubtree` and `Editor.cloneScene`, add:

```ts
...(node.motion ? { motion: { ...node.motion } } : {})
```

Do not alter existing action, layout, geometry, gradient, or stroke copy behavior.

- [ ] **Step 6: Run focused and full compatibility checks**

Run:

```bash
npm test -- app/editor/persistence.test.ts app/editor/scene.test.ts app/editor/project-package.test.ts
npx tsc --noEmit
npm test
```

Expected: migrations, version-2 documents, packages, and all legacy tests pass.

- [ ] **Step 7: Commit persistence compatibility**

Stage only the five task files. Commit with the lore format; record that version 2 prevents old readers from silently resaving motion-less documents.

## Task 3: Shared Numeric Field And Motion Properties

**Files:**
- Create: `app/editor/BoundedNumberField.tsx`
- Create: `app/editor/MotionProperties.tsx`
- Modify: `app/editor/LayoutProperties.tsx`
- Modify: `app/editor/PropertiesPanel.tsx`
- Create: `e2e/editor-motion.spec.ts`

- [ ] **Step 1: Extract the existing bounded numeric field without behavior changes**

Move `BoundedNumberField`, `draftError`, and decimal-step helpers from `LayoutProperties.tsx` into `BoundedNumberField.tsx`. Keep the exported prop contract:

```ts
export type BoundedNumberFieldProps = {
  ariaLabel: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onCommit: (value: number) => void;
};
```

Keep arbitrary drafts, invalid ARIA, focused draft stability, exact Arrow stepping, scientific-notation overflow guards, and inline errors unchanged. Update LayoutProperties to import the shared component.

- [ ] **Step 2: Verify the extraction before adding behavior**

Run:

```bash
npx tsc --noEmit
npx playwright test e2e/editor-layout.spec.ts
```

Expected: TypeScript and all existing layout browser tests pass unchanged.

- [ ] **Step 3: Write the failing Motion property browser slice**

Create `e2e/editor-motion.spec.ts` with an `@full` test that opens `/editor?template=main-menu`, selects `MenuPanel`, and expects:

```ts
await expect(page.getByRole("combobox", { name: "Transition" })).toHaveValue("none");
await page.getByRole("combobox", { name: "Transition" }).selectOption("slide");
await page.getByRole("spinbutton", { name: "Motion duration" }).fill("320");
await page.getByRole("combobox", { name: "Slide direction" }).selectOption("right");
```

Select a TextButton and assert `Hover scale` appears. Select ScreenGui and assert
the Motion group is absent. Build a deterministic version-2 JSON fixture with a
List parent, stored Slide child, and effective Fade ancestor; import it through
the existing `Import JSON` file input, then assert both fallback flags, exact
combined warning, and stored control values. The Canvas
`data-effective-motion="scale"` marker is added and asserted in Task 5. This
avoids fragile drag/drop in the property-control test. Verify invalid duration
drafts remain visible, do not change persisted scene/localStorage after the
normal autosave wait, and export the last valid JSON value. Exact Luau stability
is asserted after generator integration in Task 7.

- [ ] **Step 4: Run the new browser slice for RED**

Run:

```bash
npm run build
npx playwright test e2e/editor-motion.spec.ts
```

Expected: FAIL because Motion controls do not exist.

- [ ] **Step 5: Implement MotionProperties**

`MotionProperties` receives `node`, `scene`, and `onChange`. Use `resolveSceneMotion(scene).get(node.id)` and render:

```tsx
<select
  aria-label="Transition"
  value={node.motion?.preset ?? "none"}
  onChange={(event) =>
    commit({
      preset:
        event.target.value === "none"
          ? undefined
          : (event.target.value as MotionPreset),
    })
  }
>
  <option value="none">None</option>
  <option value="fade">Fade</option>
  <option value="slide" disabled={resolved.slideBlocked}>Slide</option>
  <option value="scale">Scale</option>
</select>
<BoundedNumberField
  ariaLabel="Motion duration"
  value={resolved.durationMs}
  min={100}
  max={2000}
  step={10}
  onCommit={(durationMs) => commit({ durationMs: Math.round(durationMs) })}
/>
<select
  aria-label="Slide direction"
  value={resolved.slideDirection}
  onChange={(event) =>
    commit({ slideDirection: event.target.value as SlideDirection })
  }
>
  <option value="left">Left</option>
  <option value="right">Right</option>
  <option value="up">Up</option>
  <option value="down">Down</option>
</select>
<input
  type="checkbox"
  aria-label="Hover scale"
  checked={node.motion?.hover === true}
  onChange={(event) => commit({ hover: event.target.checked || undefined })}
/>
```

Show Duration when transition or Hover is active, direction for stored Slide, Hover only for TextButton, and exact resolver warnings. Transition None sets only `preset: undefined`; it preserves other motion members. Every commit creates a fresh motion object, and removes `motion` only when no valid member remains.

- [ ] **Step 6: Gate the group by eligible class**

Render MotionProperties from PropertiesPanel only when `isMotionClass(node.cls)`. Keep all existing groups and action target rules unchanged.

- [ ] **Step 7: Run properties GREEN verification**

Run:

```bash
npx tsc --noEmit
npm run build
npx playwright test e2e/editor-layout.spec.ts e2e/editor-motion.spec.ts
npm test
git diff --check
```

Expected: layout controls retain behavior, Motion controls pass, and all units remain green.

- [ ] **Step 8: Commit Motion controls**

Stage only the five task files. Commit with the lore format; record inactive-value preservation and fixed preset constants.

## Task 4: Pure Preview Motion State Machine

**Files:**
- Create: `app/editor/motion-preview.ts`
- Create: `app/editor/motion-preview.test.ts`
- Modify: `app/editor/scene.ts`
- Modify: `app/editor/scene.test.ts`

- [ ] **Step 1: Write failing desired-state and token tests**

Define tests around this public contract:

```ts
export type MotionPhase = "closed" | "opening" | "open" | "closing";
export type PreviewMotionController = {
  desiredOpen: boolean;
  phase: MotionPhase;
  token: number;
  pointerInside: boolean;
  focused: boolean;
};
export type PreviewMotionState = Readonly<Record<string, PreviewMotionController>>;
export type PreviewMotionSession = Readonly<{
  controllers: PreviewMotionState;
  visibility: PreviewVisibility;
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

export function createPreviewMotionSession(
  scene: readonly SceneNode[]
): PreviewMotionSession;
export function beginPreviewInitialOpen(
  session: PreviewMotionSession,
  nodeId: string,
  reducedMotion: boolean
): PreviewMotionSession;
export function requestPreviewVisibility(
  session: PreviewMotionSession,
  nodeId: string,
  desiredOpen: boolean,
  reducedMotion: boolean
): PreviewMotionSession;
export function completePreviewTransition(
  session: PreviewMotionSession,
  nodeId: string,
  token: number
): PreviewMotionSession;
export function setPreviewHoverInput(
  session: PreviewMotionSession,
  nodeId: string,
  input: "pointer" | "focus",
  active: boolean
): PreviewMotionSession;
export function applyPreviewReducedMotion(
  session: PreviewMotionSession,
  reducedMotion: boolean
): PreviewMotionSession;
export function previewHoverScale(
  controller: PreviewMotionController,
  reducedMotion: boolean
): number;
export function previewTransitionDurationMs(
  controller: PreviewMotionController,
  configuredDurationMs: number,
  reducedMotion: boolean
): number;
export function resolvePreviewAction(
  scene: readonly SceneNode[],
  buttonId: string
): PreviewActionRequest;
```

`createPreviewMotionSession` initializes an effectively visible transition node as
`desiredOpen: true, phase: "closed"`. `beginPreviewInitialOpen` is the only
operation that changes that initial state to Opening; it increments token and
is not subject to repeated-Show idempotence. It is a no-op unless the controller
still has the untouched sentinel `desiredOpen: true`, `phase: "closed"`, and
`token: 0`; Hide or a reduced-motion snap before the second animation frame
invalidates the sentinel. Show preserves that one scheduled initial Open and
must not create a second token. Assert hidden-ancestor child
canonical/Open phase with no deferred transition, direct Show/Hide/Toggle,
rapid Close→Open token invalidation, stale Close completion returning
the unchanged session, token-valid Close atomically setting phase Closed and
visibility false, repeated Show not restarting Open, Hover flags during Opening,
`previewHoverScale`, Hover-only state, and reduced-motion snapping.

Assert `previewTransitionDurationMs` returns 0 for the untouched initial closed
sentinel and for reduced motion. It returns the configured duration in Opening,
Open, and Closing so Hover uses the same duration while an open button moves to
or from 1.03. This guarantees the first closed render lands directly at opacity
0, scale 0.92, or the exact 24px offset before Open animates. Add pure assertions
for initial Closed=0, Opening=configured, Open=configured, Closing=configured,
and reduced=0.

Add explicit terminal tests: reduced-motion Close immediately returns Closed
with visibility false; Hide before initial RAF hides a still-Closed node; and
switching no-preference→reduce during Closing snaps Closed and hides in the same
returned session.

- [ ] **Step 2: Write failing action-routing parity tests**

Test `resolvePreviewAction` exactly: malformed/missing actions return `none`;
RemoteEvent and Teleport return their existing notices; Hide Entire GUI returns
`hideGui`; valid Show/Hide/Toggle returns only the direct target ID and request.
Plain ancestor Hide/Show must not include descendants or schedule replay.

- [ ] **Step 3: Run the pure preview tests for RED**

Run:

```bash
npm test -- app/editor/motion-preview.test.ts app/editor/scene.test.ts
```

Expected: FAIL because controller state and direct target intent do not exist.

- [ ] **Step 4: Implement immutable transition state**

Use one immutable `PreviewMotionSession` so controller phase/token and visibility
change in the same pure update. New requests increment
token and set phase to Opening/Closing unless reduced motion makes the terminal
phase immediate. A request whose desired state already matches is idempotent;
initial mounting uses `beginPreviewInitialOpen` instead. Completion returns
visibility false only for a token-valid Closing→Closed transition. Reduced
motion snaps desired-closed controllers and visibility together. Hover flags
update in every phase, while `previewHoverScale` returns 1.03 only in Open with
pointer/focus active and reduced motion false.

Do not import React, create timers, or mutate SceneNode. Keep plain ancestor actions direct-target only.

- [ ] **Step 5: Run focused tests and TypeScript**

Run:

```bash
npm test -- app/editor/motion-preview.test.ts app/editor/scene.test.ts
npx tsc --noEmit
```

Expected: all pure lifecycle and legacy visibility tests pass.

- [ ] **Step 6: Commit the pure Preview engine**

Stage only motion-preview and scene files/tests. Commit with the lore format; record direct-target lifecycle and stale-token protection.

## Task 5: React Preview Integration And Edit Freeze

**Files:**
- Create: `app/editor/useMotionPreview.ts`
- Modify: `app/editor/Editor.tsx`
- Modify: `app/editor/Canvas.tsx`
- Modify: `app/editor/Toolbar.tsx`
- Modify: `app/editor/Palette.tsx`
- Modify: `e2e/editor-motion.spec.ts`

- [ ] **Step 1: Add failing Preview and freeze browser assertions**

Extend the motion E2E journey to assert:

- entering Preview sets `data-motion-phase` from Opening to Open;
- untouched initial closed frame has zero transition duration; initial Slide is
  exactly 24px right before it reaches canonical transform;
- direct Hide/Show/Toggle produces Closing/Open and rapid interruption does not hide a reopened node;
- nested Fade fallback exposes `data-effective-motion="scale"`;
- Hover responds to pointer and keyboard focus only while Open;
- Hover computed transition duration equals the configured Motion duration;
- `page.emulateMedia({ reducedMotion: "reduce" })` snaps and suppresses Hover;
- changing media from no-preference to reduce during transition snaps terminal;
- Palette, hierarchy, Properties, Undo/Redo, New, Import, drag, resize, delete, and duplicate cannot mutate the scene during Preview;
- stopping Preview restores edit geometry and controls.

For the asynchronous import race, replace `File.prototype.text` in the page with
a test-controlled deferred promise, choose a valid version-2 file, enter
Preview, resolve the promise, and assert scene and localStorage remain unchanged.
Restore the prototype in test cleanup.

Use phase/data markers and `expect.poll`; do not use fixed sleeps.

- [ ] **Step 2: Run the browser slice for RED**

Run:

```bash
npm run build
npx playwright test e2e/editor-motion.spec.ts
```

Expected: FAIL because Preview has only a visibility map and does not render motion or freeze all edit surfaces.

- [ ] **Step 3: Implement the Preview hook**

`useMotionPreview(scene)` owns active state, controller reducer state, visibility, and reduced-motion preference. Return:

```ts
export type UseMotionPreviewResult = {
  active: boolean;
  start: () => void;
  stop: () => void;
  visibility: PreviewVisibility | null;
  controllers: PreviewMotionState;
  requestButtonAction: (buttonId: string) => string | null;
  completeTransition: (nodeId: string, token: number) => void;
  setHoverInput: (
    nodeId: string,
    input: "pointer" | "focus",
    active: boolean
  ) => void;
  reducedMotion: boolean;
};
```

On start, create one immutable scene snapshot, initialize controller state, and
use two `requestAnimationFrame` callbacks to call
`beginPreviewInitialOpen` for each `initialOpen` node after its closed render.
Subscribe to `matchMedia`; a change to reduce snaps desired states and
invalidates tokens, while a change off affects future requests only. Cancel
frames and remove listeners on stop/unmount.

Internally use one React reducer value containing `PreviewMotionSession | null`;
do not keep controllers and visibility in separate `useState` calls. Every
initial-open, request, completion, Hover, and reduced-motion action is one
functional reducer update from the same previous session.

`requestButtonAction` consumes `resolvePreviewAction`. For an effective
transition target, Open sets visibility true before requesting Opening; Close
leaves visibility true while Closing, while reduced/immediate Close returns
Closed plus visibility false in the same reducer result;
Toggle reads controller `desiredOpen`, never DOM visibility. Plain or inactive
motion targets update visibility immediately. Hide Entire GUI updates root
visibility immediately. `completeTransition` dispatches one session update;
stale completions return the previous session and can never hide a node.

- [ ] **Step 4: Route Editor Preview through the hook**

Replace the standalone preview visibility state with the hook. Keep preview
notices in Editor by displaying the nullable notice returned from
`requestButtonAction`. Entering Preview clears selection.

Make `mutate` itself fail closed while an `activeRef` is true, then retain
explicit guards in undo, redo, New, import, add/apply, delete, duplicate,
reparent/reorder, Property updates, Canvas changes, and keyboard shortcuts.
When Preview starts, flush the current debounced scene into history, clear its
timer, increment `importRequest.current` to invalidate in-flight file reads, and
store the immutable snapshot. `importProject` checks the active ref again after
`await file.text()` before calling mutate. Device selection and exports stay
available. Undo/redo availability passed to Toolbar also includes `!active`.

Move the autosave timeout into an `autosaveTimer` ref and a focused
`persistWorkspace(scene, selectedId)` helper. Immediately before Preview starts,
persist the latest pre-Preview workspace only when an autosave timer is pending,
then clear that timer.
While active, the autosave effect schedules no writes; clearing selection for
Preview therefore never overwrites saved `selectedId`. Stopping Preview does not
write because the scene snapshot did not change; the next real edit resumes the
normal 400ms save. In E2E, wait for or record any pre-Preview flush, then reset
the `setItem` spy baseline immediately after Preview activates. Assert zero
additional writes during active Preview and compare the saved scene value.

- [ ] **Step 5: Render deterministic Canvas motion**

Pass resolved motion/controllers into NodeView. Add stable markers:

```tsx
data-motion-phase={controller?.phase}
data-effective-motion={resolved.effectivePreset ?? "none"}
data-motion-token={controller?.token}
```

Compose existing rotation with fixed translate/scale transforms; Fade uses root
CSS opacity so the subtree previews together. Use
`previewTransitionDurationMs`: the untouched closed/token-0 initial frame and
reduced motion use duration 0, while Opening, Open, and Closing use configured
duration.
Expose `data-motion-initial-closed` for the sentinel so E2E can assert exact
opacity/scale/offset before Opening. A `transitionend` is accepted only when
`event.currentTarget === event.target`, its property is `opacity` for Fade or
`transform` for Slide/Scale, and the callback uses the token captured by that
render. Hover-only transform completion never completes visibility. Pointer
enter/leave and focus/blur update Hover flags for TextButton. Do not change
public ScenePreview.

- [ ] **Step 6: Make mutating surfaces visibly inert**

Add `disabled` to Toolbar and Palette. Toolbar disables Undo, Redo, New, and Import but leaves Preview Stop, device, copy/export, JSON export, and ZIP available. Palette uses `inert`, `aria-disabled`, and a disabled visual state around both tabs; Editor handler guards remain the authority. Properties remains empty because Preview clears selection. Canvas selection/move/resize callbacks no-op while active.

- [ ] **Step 7: Run React Preview GREEN verification**

Run:

```bash
npm test -- app/editor/motion-preview.test.ts app/editor/scene.test.ts
npx tsc --noEmit
npm run build
npx playwright test e2e/editor-motion.spec.ts
npm test
git diff --check
```

Expected: lifecycle, reduced motion, edit freeze, cleanup, and legacy units pass with no console errors.

- [ ] **Step 8: Commit Preview integration**

Stage only the six task files. Commit with the lore format; record that public ScenePreview stays static SSR and Preview freezes scene mutations.

## Task 6: Generated TweenService Runtime And Action Integration

**Files:**
- Create: `app/editor/motion-luau.ts`
- Create: `app/editor/motion-luau.test.ts`
- Modify: `app/editor/scene.ts`
- Modify: `app/editor/scene.test.ts`
- Modify: `app/editor/server-luau.test.ts`

- [ ] **Step 1: Write failing exact Luau runtime tests**

Use a deterministic node-variable map and assert:

```ts
const runtime = generateMotionLuau(scene, new Map([
  ["panel", "el0"],
  ["button", "el1"],
]), new Set(["panel", "button"]));
expect(runtime.lines.join("\n")).toContain(
  'local TweenService = game:GetService("TweenService")'
);
expect(runtime.lines.join("\n")).toContain(
  'local GuiService = game:GetService("GuiService")'
);
expect(runtime.lines.join("\n")).toContain(
  'GuiService:GetPropertyChangedSignal("ReducedMotionEnabled")'
);
expect(runtime.lines.join("\n")).toContain(
  'TweenInfo.new(currentDurationForEl0(), Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0)'
);
```

Add exact cases for Fade transparency allowlist including ScrollingFrame
scrollbar and UIStroke, Scale UIScale, all Slide offsets, TextButton
pointer/selection Hover, initial Open, initially hidden target, hidden plain
ancestor with no descendant replay, stale token checks, dynamic reduced
true→false/false→true, `gui.Destroying` cleanup, layout Slide→Fade,
Slide→Fade→Scale under ancestor Fade, nested Fade one-owner output, and
Hover-only immediate visibility actions.

Add adversarial runtime inputs cast through `SceneNode`: NaN/Infinity/string
duration, preset/direction strings containing quotes and Luau fragments, motion
on ScreenGui, and a valid motion node missing from `emittedNodeIds`. Assert no
payload text, arbitrary property name, controller, or service import is emitted.

- [ ] **Step 2: Add failing scene action integration tests**

Assert Show/Hide/Toggle call generated controller functions only for targets with effective transitions. Targets without transitions keep exact legacy `Visible` statements. Hide Entire GUI, RemoteEvent, Teleport, and server Luau remain byte-for-byte free of motion control paths except client visual services where configured.

- [ ] **Step 3: Run Luau tests for RED**

Run:

```bash
npm test -- app/editor/motion-luau.test.ts app/editor/scene.test.ts app/editor/server-luau.test.ts
```

Expected: FAIL because no generated motion runtime exists.

- [ ] **Step 4: Implement the focused generator API**

Export:

```ts
export type MotionLuauRuntime = {
  lines: readonly string[];
  controllerByNodeId: ReadonlyMap<string, string>;
};

export function generateMotionLuau(
  scene: readonly SceneNode[],
  variableByNodeId: ReadonlyMap<string, string>,
  emittedNodeIds: ReadonlySet<string>
): MotionLuauRuntime;

export function motionVisibilityStatement(
  controllerVariable: string,
  action: "show" | "hide" | "toggle"
): string;
```

Generate fixed allowlisted properties and enum strings only. Capture canonical Fade values after every instance is parented. Create at most one UIScale per node. Resolve Fade ownership before emitting targets. Keep configured duration per controller and consult mutable reduced state on every request.

Store the reduced-motion and every MouseEnter/MouseLeave/SelectionGained/
SelectionLost connection. On `gui.Destroying`, disconnect all stored
connections, cancel every active Tween, clear Tween/controller arrays, and
release button/controller references. Tests must assert the emitted cleanup
loop, not only the reduced-motion disconnect.

- [ ] **Step 5: Integrate after instance creation and before actions**

In `scene.ts`, call `generateMotionLuau` after the full emitted hierarchy exists and before action connections. Append runtime lines once. When generating each visibility action, look up its direct target controller and use `motionVisibilityStatement`; otherwise preserve the existing statement exactly.

Do not move RemoteEvent/Teleport service namespaces or change `generateServerLuau`.

- [ ] **Step 6: Run focused and regression GREEN verification**

Run:

```bash
npm test -- app/editor/motion-luau.test.ts app/editor/scene.test.ts app/editor/server-luau.test.ts app/editor/remote-events.test.ts app/editor/teleports.test.ts
npx tsc --noEmit
npm test
```

Expected: exact motion fragments and all security/action regressions pass.

- [ ] **Step 7: Commit generated motion code**

Stage only the five task files. Commit with the lore format; record fixed property allowlists, dynamic reduced motion, direct-target action behavior, and Roblox Studio runtime as not tested.

## Task 7: Full Motion Round-Trip Browser Journey

**Files:**
- Modify: `e2e/editor-motion.spec.ts`
- Modify: `app/editor/project-package.test.ts`

- [ ] **Step 1: Complete the browser persistence journey**

Extend the `@full` test to configure Fade/Slide/Scale and Hover, then verify:

- live client Luau contains exact controller, TweenInfo, reduced-motion signal, effect, and action fragments;
- Undo/Redo restores duration and preset;
- refresh restores Transition, Duration, direction, Hover, and warnings;
- exported JSON is version 2 with canonical motion data;
- version-1 fixture import migrates successfully with absent motion;
- importing version-2 JSON restores controls, Preview behavior, and Luau;
- ZIP `project.json` matches JSON and client Luau contains the same motion values;
- unsupported ScreenGui motion and malformed fields do not survive import;
- no public ScenePreview motion runtime or hydration marker is introduced;
- console errors remain empty.

Use `testInfo.outputPath`, Playwright download/file input APIs, `fflate`, structured JSON parsing, and stable accessible/data locators. Never use fixed sleeps.

- [ ] **Step 2: Strengthen package unit coverage**

Add a version-2 package test whose scene contains motion. Parse project JSON from the ZIP, assert motion equality, and assert the client file contains exact duration/effect fragments while server output remains unchanged.

- [ ] **Step 3: Run the complete focused journey**

Run:

```bash
npm test -- app/editor/motion.test.ts app/editor/motion-preview.test.ts app/editor/motion-luau.test.ts app/editor/persistence.test.ts app/editor/scene.test.ts app/editor/project-package.test.ts
npx tsc --noEmit
npm run build
npx playwright test e2e/editor-motion.spec.ts e2e/editor-layout.spec.ts
```

Expected: all motion layers and layout regressions pass with zero console errors.

- [ ] **Step 4: Commit release journey coverage**

Stage only the E2E and package test. Commit with the lore format; record Chromium coverage and real Roblox runtime as not tested.

## Task 8: Release Gates, Review, And Evidence

**Files:**
- Modify: `docs/superpowers/plans/2026-06-20-tween-presets.md`

- [ ] **Step 1: Run focused motion and dependency suites**

Run:

```bash
npm test -- app/editor/motion.test.ts app/editor/motion-preview.test.ts app/editor/motion-luau.test.ts app/editor/persistence.test.ts app/editor/scene.test.ts app/editor/server-luau.test.ts app/editor/project-package.test.ts
```

Expected: every focused file passes with zero failures.

- [ ] **Step 2: Run the full unit suite**

Run: `npm test`

Expected: all Vitest files pass with zero failures.

- [ ] **Step 3: Run TypeScript and production build sequentially**

Run:

```bash
npx tsc --noEmit
npm run build
```

Expected: TypeScript exits 0 and all static routes generate.

- [ ] **Step 4: Run smoke and full browser gates**

Run:

```bash
npm run test:e2e:smoke
npm run test:e2e:full
```

Expected: all Chromium tests pass with zero captured console errors.

- [ ] **Step 5: Run React and security reviews**

Review MotionProperties, useMotionPreview, Editor, Canvas, and generated Luau for hook cleanup, stale closures, controller token safety, accessible disabled states, stable keys, fixed property allowlists, and unchanged RemoteEvent/Teleport trust boundaries. Fix every Critical, Important, and Minor finding and rerun affected gates.

- [ ] **Step 6: Inspect final diff and workspace hygiene**

Run:

```bash
git diff --check
git status --short
git diff --stat 93c9aef...HEAD
```

Expected: no whitespace errors, only planned files, and no generated browser/download artifacts.

- [ ] **Step 7: Record exact release evidence**

Mark completed checkboxes only after their commands pass. Append exact
focused/full unit counts, the actual Next build summary and exit status,
smoke/full browser counts, review findings and resolutions, residual risks, and
Not-tested items. Keep Roblox Studio runtime, non-Chromium engines, assistive
technology, and real touch behavior explicit unless separately verified.

- [ ] **Step 8: Commit the evidence-only plan update**

Stage only this plan document and commit with the lore format. Do not mix evidence documentation with product code.
