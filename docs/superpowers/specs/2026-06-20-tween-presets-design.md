# Tween Presets Design

**Status:** Approved for implementation planning  
**Date:** 2026-06-21  
**Depends on:** Complete Layout P0  
**Target project document version:** 2

## Goal

Add a small, node-owned animation model that gives generated Roblox interfaces
paired Open and Close transitions plus optional button Hover feedback. The
editor must preview the same lifecycle, generated client Luau must use
`TweenService`, and players who enable reduced motion must receive immediate
state changes instead of motion.

The feature must remain a preset system, not become a timeline editor.

## Confirmed Product Decisions

- Motion belongs to the target `SceneNode`, not to button action payloads.
- One transition preset drives both Open and Close; Close automatically reverses
  the Open effect.
- Fade, Slide, and Scale are the P0 transition presets.
- Hover is an independent TextButton option with a fixed Scale effect.
- Users can edit duration and Slide direction. Easing, scale amounts, and Slide
  distance are fixed.
- Animated nodes whose own flag and full ancestor chain are initially visible
  play Open once after the generated GUI is created. Direct Show and
  Toggle-to-visible requests for that node play Open again.
- Hide and Toggle-to-hidden play Close and set `Visible = false` only after the
  latest Close finishes.
- Resolver precedence is fixed: layout-managed Slide first becomes preliminary
  Fade; any preliminary Fade under an effective Fade ancestor then becomes
  Scale. Stored values remain unchanged and the panel explains either or both
  fallbacks.
- Reduced motion snaps directly to the requested state and disables Hover
  motion.
- Public `ScenePreview` remains a static SSR rendering of the resting state.

## Alternatives Considered

### Node-owned presets — selected

Each animatable node owns one optional motion object. Existing Show, Hide, and
Toggle actions request a visibility state from that target. This avoids
duplicating animation settings on every button and keeps RemoteEvent and
Teleport action payloads unchanged.

### Action-owned animation payloads — rejected

This permits a different transition for every button, but duplicates settings,
makes Toggle behavior harder to reason about, and expands every action editor
and action sanitizer. It also does not naturally model initial Open or Hover.

### Animation timeline — rejected

A timeline could sequence several nodes, delays, and tracks. It would require a
new editor, playback cursor, ordering rules, and a much larger persistence
model. That scope is not justified for preset-level UI motion.

## Scene Contract

Add these types beside the existing scene value types:

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

Add `motion?: NodeMotion` to `SceneNode`.

An absent `motion` object means no transition and no Hover effect. A motion
object may contain only inactive duration or direction values so switching the
transition to None and back does not destroy the user's draft configuration.
`hover: true` can exist without a transition preset. If every supplied member
is invalid or absent, the sanitizer omits `motion` instead of persisting `{}`.

### Resolved defaults

The shared resolver exposes immutable values:

```ts
export const MOTION_DEFAULTS = {
  durationMs: 240,
  slideDirection: "left",
  easingStyle: "quad",
  easingDirection: "out",
  closedScale: 0.92,
  hoverScale: 1.03,
  slideOffsetPx: 24,
} as const;
```

Duration accepts whole milliseconds from `100` through `2000`. The sanitizer
rounds finite values and clamps them to that range. Invalid optional fields are
omitted without rejecting an otherwise valid node.

`hover: true` survives only on `TextButton`. A false or malformed Hover value
is omitted. Preset and direction values must match their exact lower-case
unions. `sanitizeMotion(raw, cls)` returns no motion for ScreenGui or helper
classes, and the resolver independently fails closed for those classes.

Hover enter and leave share `durationMs`. A Hover-only button uses a stored
valid duration or the 240ms default. The Duration field therefore appears when
either a transition or Hover is active.

### Eligibility and effective preset

Motion controls appear for Frame, ScrollingFrame, TextLabel, TextButton,
TextBox, and ImageLabel. ScreenGui and non-rendered helper classes do not expose
motion controls.

The resolver runs top-down and receives the full scene. It uses one fixed
precedence for every node:

1. Start with the stored preset.
2. Stored Slide under a List/Grid parent becomes preliminary Fade and sets
   `slideBlocked: true`.
3. Any preliminary Fade under an ancestor whose final effective preset is Fade
   becomes final Scale and sets `fadeBlocked: true`.

A layout-managed Slide with no effective Fade ancestor therefore resolves to:

```ts
{
  preset: "slide",
  effectivePreset: "fade",
  slideBlocked: true,
}
```

The property panel disables choosing Slide for a layout-managed child. An
imported or reparented node that already stores Slide continues to display that
selection with a warning: `Slide uses Fade while the parent controls layout.`
Moving the node back to a manually positioned parent restores Slide without a
data rewrite.

Fade has a second ownership rule. Any preliminary Fade under an effective Fade
ancestor resolves to Scale, including a stored Fade and a Slide that first fell
back to Fade. A stored Fade shows: `Fade uses Scale while an ancestor fades this
subtree.` A layout-managed Slide in the same condition shows: `Slide uses Scale:
layout fallback Fade is owned by an ancestor.` Its resolved object may contain
both `slideBlocked: true` and `fadeBlocked: true`. The closest effective Fade
controller exclusively owns all allowlisted transparency properties below it.
Removing or changing that ancestor restores the node's preliminary effect
without rewriting data.

## Editor Controls

Add a Motion group to eligible nodes:

- `Transition`: None, Fade, Slide, Scale.
- `Duration`: bounded local numeric draft, shown when a transition or Hover is
  active.
- `Slide direction`: Left, Right, Up, Down, shown for stored Slide.
- `Hover scale`: checkbox shown only for TextButton.
- The layout and Fade-ownership warnings described above.

The numeric draft follows the established bounded-field behavior: empty,
non-numeric, and out-of-range text stays visible and does not commit; a valid
value commits immediately. Controls use accessible labels and inline errors.

Changing Transition changes only `motion.preset`. It does not delete duration,
direction, or Hover configuration. Nested motion updates always create a fresh
object so duplication, undo, and persistence do not share mutable state.

## Editor Preview Behavior

Motion runs only while the toolbar is in Preview mode. Edit mode keeps canonical
geometry and visual values so selection, dragging, resizing, and layout editing
remain stable.

Preview mode freezes all scene mutations. Palette insertion, hierarchy
selection/reparenting/reordering, Properties edits, drag/resize, delete,
duplicate, New, Import, Undo, and Redo are disabled until Preview stops. Device
switching and exports may remain available because they do not mutate the
scene. Preview controllers are created from one immutable scene snapshot and do
not need to migrate across edits.

Entering Preview:

1. Creates preview visibility and motion state without mutating the scene.
2. Computes effective initial visibility from the node and every ancestor.
3. Keeps nodes whose own `initialVisible` is false closed and invisible.
4. Places animated nodes whose full ancestor chain is visible in their closed
   visual state and starts Open after the preview frame mounts.
5. Leaves locally visible descendants under a hidden ancestor in their canonical
   resting state without playing Open.

While Preview is active:

- Show requests Open.
- Hide requests Close.
- Toggle requests the opposite of the target's desired state, not merely the
  current `Visible` value during an in-flight transition.
- RemoteEvent and Teleport preview behavior remains notice-only and does not
  trigger target motion.
- Hover runs only for TextButton and only while its desired state is open.
- A new visibility request cancels the target's active animations and continues
  from the currently rendered values.
- Only the newest Close completion may mark a node invisible.

Visibility requests affect only their direct target controller. Showing or
hiding a plain ancestor does not reset, cancel, or replay descendant
controllers. Descendants hidden by an ancestor continue their local lifecycle;
when the ancestor becomes visible again, they render at their current local
state. This keeps Preview and generated Luau aligned without adding coordinators
to containers that have no motion.

Stopping Preview cancels animations, removes transient styles, and returns the
Canvas to the scene's canonical edit state. Preview changes never create history
entries or persistence writes.

Preview subscribes to
`window.matchMedia("(prefers-reduced-motion: reduce)")`. While it matches,
Preview applies Open and Close terminal states immediately and does not run
Hover. If the preference changes to reduce during Opening, Closing, or Hover,
Preview cancels active animations, increments their tokens, snaps every
controller to its current desired terminal state, and resets Hover scale to 1.
Turning reduction off affects future requests and does not replay Open. The
media-query listener is removed when Preview stops or Canvas unmounts.

Public `ScenePreview` stays a server component and renders initial visibility
and the canonical resting state. P0 does not add hydration solely for marketing
page animation.

## Effect Semantics

### Fade

Fade applies to the target and generated descendants so a panel does not leave
fully visible child text or images behind. The fixed property allowlist is:

- `BackgroundTransparency` on GuiObjects;
- `TextTransparency` on TextLabel, TextButton, and TextBox;
- `ImageTransparency` on ImageLabel;
- `ScrollBarImageTransparency` on ScrollingFrame;
- `Transparency` on UIStroke.

Open starts each property at `1` and tweens to the value captured after GUI
construction. Close tweens from its current value to `1`. Reopening restores
the captured canonical values. Runtime code that independently rewrites these
properties after initialization is outside the P0 contract; the next Open may
restore the generated canonical value.

### Scale

The generator creates or reuses one generated `UIScale` child for the animated
node. Open tweens `Scale` from `0.92` to `1`; Close reverses to `0.92`. The
effect does not rewrite `Size`, responsive geometry, or layout values.

### Slide

Slide offsets `Position` by 24 pixels in the selected direction and tweens back
to the canonical `UDim2` for Open. Close reverses to the offset position. Closed
offsets are exact: left `(-24, 0)`, right `(24, 0)`, up `(0, -24)`, and down
`(0, 24)`. The resolver first substitutes preliminary Fade whenever a parent
List or Grid owns positioning, then applies the Fade-ownership precedence.

### Hover

TextButton Hover uses the same generated `UIScale` child and tweens from `1` to
`1.03`, then back to `1`. Generated code listens to MouseEnter/MouseLeave and
SelectionGained/SelectionLost so mouse and gamepad focus receive the same
feedback. Touch input does not synthesize Hover.

The controller stores `pointerInside` and `focused` independently. Mouse and
selection events update those flags even during Opening or Closing. If Scale
transition and Hover share the UIScale, visibility transition has priority.
After a token-valid Open completes, the controller deterministically applies
`1.03` when either flag is true. Initialization also compares the button with
`GuiService.SelectedObject`, so a button already selected when it opens receives
Hover. Closing cancels Hover and resets its transient target.

## Deterministic Playback State

Each animated target has a small client-only controller containing:

- desired state: open or closed;
- phase: closed, opening, open, or closing;
- monotonically increasing playback token;
- active Tween objects;
- canonical visual values captured after construction.
- pointer-inside and focused flags for TextButton Hover.

Every Open or Close request increments the token and cancels active Tweens.
Completion callbacks compare their captured token with the latest token before
changing phase or visibility. This prevents a stale Close callback from hiding
a node that was reopened by a newer action.

Toggle consults desired state. Repeated Show or Hide requests are idempotent at
the desired-state level, though an interrupted request may finish the current
transition to its terminal state.

Fade ownership is computed before controllers are emitted. One allowlisted
transparency property belongs to at most one controller, so cancellation tokens
do not compete across parent and descendant Fade controllers.

## Generated Luau

Client output imports services only when at least one emitted node has an
effective transition or Hover:

```luau
local GuiService = game:GetService("GuiService")
local TweenService = game:GetService("TweenService")
local reducedMotion = GuiService.ReducedMotionEnabled
local configuredDurationForNode = 0.24
local function currentDurationForNode()
	return if reducedMotion then 0 else configuredDurationForNode
end
```

The exact duration is generated per configured node and is shared by that
node's transition and Hover. TweenInfo uses
`Enum.EasingStyle.Quad` and `Enum.EasingDirection.Out`, with repeat count 0,
`Reverses = false`, and delay 0.

Nodes on an effectively visible ancestor chain schedule Open after all
instances, hierarchy, constraints, layouts, and canonical properties are
created. An animated node hidden only by an ancestor starts at its canonical
resting state and does not schedule a deferred Open. Initially hidden target
nodes remain `Visible = false` until a direct Show request calls Open.

Existing visibility action statements change as follows only when their target
has an effective transition:

- Show calls the target controller's Open function.
- Hide calls Close.
- Toggle calls the controller's Toggle function.

Targets without motion keep the current immediate `Visible` assignments. The
Hide Entire GUI action remains an immediate ScreenGui `Enabled = false` change.
RemoteEvent and Teleport generation, server Luau, namespaces, allowlists, and
validation remain unchanged.

Visibility action targets remain limited to Frame and ScrollingFrame. Motion on
TextLabel, TextButton, TextBox, or ImageLabel can run initial Open; TextButton
can additionally run Hover, but this phase does not broaden Show/Hide/Toggle
target eligibility. A Hover-only motion object does not create a visibility
transition controller, so visibility actions retain their existing immediate
behavior.

The generator emits only fixed property names and mapped enums. JSON strings
never become Luau property names, expressions, service names, or event paths.

### Reduced motion

Roblox output keeps mutable `reducedMotion` state initialized from
`GuiService.ReducedMotionEnabled`. Every new Open, Close, or Hover request reads
that state; duration is never a startup-only snapshot. When true, Open and Close
apply terminal values immediately, Close hides without waiting, and Hover stays
at Scale 1 while input only updates pointer/focus flags. It subscribes with
`GuiService:GetPropertyChangedSignal("ReducedMotionEnabled")`. Switching to
reduced motion cancels active Tweens, invalidates their tokens, snaps each
controller to its desired terminal state, hides desired-closed nodes, and resets
Hover scale to 1. Switching the preference off affects future requests only.
This follows Roblox's documented recommendation to set TweenInfo time to zero
for reduced motion.

The generated signal connection is stored and disconnected from
`gui.Destroying` before controller tables are released. No service connection
may retain destroyed GUI instances or controller closures.

## Persistence and Scene Operations

- `sanitizeScene` sanitizes motion fields without rejecting valid nodes for
  malformed optional motion data.
- Project documents advance to version 2. The parser accepts version 1 and
  migrates it by treating motion as absent; serialization always writes version
  2. Version-2 documents are rejected by older version-1 readers instead of
  being opened and silently resaved without motion. No downgrade export is
  provided.
- JSON serialization and import preserve the canonical optional object in
  project document version 2.
- Duplicate performs a fresh shallow copy of `motion`; all members are scalar.
- Editor history, localStorage, JSON, project ZIP, and generated client Luau use
  the same scene object.
- Reparenting does not rewrite stored Slide. Effective fallback is derived from
  the current parent at preview and export time.
- Node deletion requires no action cleanup because motion contains no node IDs.

## Error and Interruption Handling

- Invalid editor drafts show inline errors and retain the last valid scene
  value.
- Malformed imported motion fields are omitted individually.
- Motion on ScreenGui or helper classes is omitted as a whole and never causes
  motion services or controllers to be emitted.
- Unsupported Slide placement produces a visible warning and preliminary Fade
  fallback, followed by the documented ownership precedence, rather than
  invalid Luau or silent no-op behavior.
- Nested Fade ownership produces a visible warning and deterministic Scale
  fallback for the descendant rather than competing transparency Tweens.
- Starting a new transition cancels prior Tweens before creating replacements.
- Stale completion callbacks cannot alter visibility.
- A missing or removed generated target causes no dynamic lookup or arbitrary
  code execution; bindings are emitted only for scene nodes that were emitted.

## Security Boundaries

Tween Presets are client-side visual behavior. They do not authorize game
actions, invoke remotes, teleport players, or modify server output.

Generated motion code has a fixed allowlist of visual properties and enums.
Duration and direction are bounded or enum-mapped before code generation.
Motion data cannot provide Luau source, property keys, instance paths, service
names, or callback bodies.

Existing RemoteEvent and Teleport server validation remains the authority for
side effects. Adding motion to a button does not change its action payload or
trust boundary.

## Test Strategy

### Pure unit tests

- Defaults and immutable resolver output.
- Duration rounding/clamping and malformed field omission.
- Hover class gating.
- Slide eligibility and Fade fallback under List/Grid parents.
- Nested parent/child Fade ownership and descendant Scale fallback.
- Layout-managed Slide under a Fade ancestor sets both blocked flags and resolves
  to Scale using the documented precedence.
- Effect start/goal values for all four directions and fixed scales.
- Desired-state, cancellation-token, and stale-completion behavior.
- Hover-only stored/default duration and empty-object normalization.
- Unsupported-class fail-closed behavior.

### Persistence and scene tests

- Version-1-to-version-2 migration and version-2 round-trip for every motion
  field.
- Version-2 rejection by the legacy version boundary; no silent downgrade.
- Bad optional motion fields do not reject a valid node.
- Duplicate motion mutation does not affect the source.
- Reparenting preserves stored Slide while changing effective preset.
- Existing action cleanup and layout persistence remain unchanged.

### Luau tests

- Exact TweenService and GuiService imports only when needed.
- Exact TweenInfo duration and fixed easing.
- Fade transparency targets, Scale UIScale, Slide UDim2 offset, and Hover input
  bindings.
- ScrollingFrame scrollbar Fade.
- Initial Open only on an effectively visible chain, canonical descendants under
  hidden ancestors, and initially hidden direct-target behavior.
- Show, Hide, and Toggle controller calls plus stale-Close token guards.
- Runtime reduced-motion switching during Opening, Closing, and Hover.
- Initial reduced=true then false uses configured duration for later requests;
  false then true snaps and keeps later requests immediate.
- Slide-to-Fade fallback for layout-managed children.
- Nested Fade-to-Scale fallback and one-owner transparency output.
- Layout Slide-to-Fade-to-Scale precedence under a Fade ancestor.
- Hover-only scenes import TweenService but retain immediate visibility actions.
- Pointer/focus changes during Opening and reopening while already selected.
- Plain ancestor Show/Hide emits no descendant coordinator or replay calls.
- Reduced-motion service connection cleanup on GUI destruction.
- Scenes without motion retain legacy output and no motion services.
- RemoteEvent, Teleport, and server output regressions.

### Browser tests

- Accessible Motion controls, conditional direction and Hover, bounded duration
  draft, and preserved inactive values.
- Preview initial Open, action Open/Close/Toggle, rapid interruption, and Hover.
- Preview freezes scene mutation controls and restores them on stop.
- Browser reduced-motion emulation and live media-query changes snap and
  suppress Hover.
- Hidden-parent animated children remain canonical; plain ancestor Show/Hide
  does not replay or cancel them; nested Fade fallback matches Luau.
- Edit mode geometry, selection, drag, and resize remain stable.
- Undo/redo, autosave refresh, JSON export/import, and ZIP preserve motion and
  regenerate the same Luau.
- Console errors remain empty and public template pages remain static SSR.

### Release gates

- Focused Vitest files, full Vitest suite, TypeScript, and production build.
- Smoke and full Playwright suites in Chromium.
- React review for hook cleanup, animation cancellation, reduced-motion listener
  cleanup, accessible controls, and stable keys.
- `git diff --check` and clean feature-worktree verification.

## Out of Scope

- Per-action animation payloads.
- Timelines, multi-node sequences, delays, looping, keyframes, or playback
  scrubbing.
- Custom easing, repeat count, reverse flags, scale amount, Hover amount, or
  Slide distance.
- Slide for children positioned by UIListLayout or UIGridLayout.
- Independent nested Fade controllers that write the same descendant
  transparency properties.
- Ancestor-driven replay or cancellation of descendant controllers when only the
  ancestor receives a visibility request.
- ScreenGui transitions and animated Hide Entire GUI.
- Touch-generated Hover.
- Server-side animation or action authorization changes.
- Hydrating public template previews solely to run motion.

## Success Criteria

Tween Presets is complete when a creator can configure an eligible node,
preview deterministic Open/Close/Hover behavior, export matching reduced-motion
aware TweenService Luau, and round-trip the configuration through every project
workflow without changing existing action security or legacy scenes.

## Official Roblox References

- [TweenService API](https://create.roblox.com/docs/reference/engine/classes/TweenService/Create)
- [TweenInfo API](https://create.roblox.com/docs/reference/engine/datatypes/TweenInfo)
- [UI animation and tweens](https://create.roblox.com/docs/building-and-visuals/ui/ui-animations)
- [Accessibility guidelines: reduced motion](https://create.roblox.com/docs/production/publishing/accessibility)
