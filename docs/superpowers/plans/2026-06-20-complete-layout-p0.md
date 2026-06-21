# Complete Layout P0 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add explicit responsive List and Grid controls plus ScrollingFrame automatic canvas behavior across editing, previews, persistence, templates, and generated Luau.

**Architecture:** Keep `SceneNode.layout` as the active `"list" | "grid"` discriminator and add optional version-1-compatible fields. Centralize defaults, validation, CSS mapping, and Roblox enum mapping in a pure `layout.ts` module; render focused controls from `LayoutProperties.tsx`; make Canvas and ScenePreview consume the same style resolver.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Roblox Luau, Vitest, Playwright.

---

## File Map

- Create `app/editor/layout.ts`: defaults, sanitization, CSS layout style, and Roblox enum mapping.
- Create `app/editor/layout.test.ts`: pure default, validation, CSS, and enum tests.
- Create `app/editor/LayoutProperties.tsx`: conditional List, Grid, and AutomaticCanvasSize controls with local numeric drafts.
- Modify `app/editor/catalog.ts`: shared UDim layout types and optional scene fields.
- Modify `app/editor/persistence.ts`: version 1 layout-field sanitization and class applicability.
- Modify `app/editor/persistence.test.ts`: round-trip and invalid layout-field coverage.
- Modify `app/editor/scene.ts`: nested layout deep cloning and exact Luau assignments.
- Modify `app/editor/scene.test.ts`: legacy defaults, explicit List/Grid, scrolling, and cloning coverage.
- Modify `app/editor/PropertiesPanel.tsx`: replace the inline Container block with LayoutProperties.
- Modify `app/editor/Canvas.tsx`: shared List/Grid/scroll styles and grid child sizing.
- Modify `app/editor/ScenePreview.tsx`: shared ordered layout rendering for public template pages.
- Modify `app/editor/templates.ts`: explicit Shop and Inventory layout settings.
- Modify `app/editor/templates.test.ts`: Shop and Inventory layout contracts.
- Create `e2e/editor-layout.spec.ts`: focused editor, persistence, export, and template preview journey.
- Modify `docs/superpowers/plans/2026-06-20-complete-layout-p0.md`: execution evidence and closeout.

### Task 1: Shared Layout Contract And Pure Mapping

**Files:**
- Create: `app/editor/layout.ts`
- Create: `app/editor/layout.test.ts`
- Modify: `app/editor/catalog.ts:37-110`

- [x] **Step 1: Write failing default and CSS mapping tests**

Create `layout.test.ts` with a local SceneNode fixture and these behaviors:

```ts
import { describe, expect, it } from "vitest";
import type { SceneNode } from "./catalog";
import {
  DEFAULT_GRID_CELL_PADDING,
  DEFAULT_GRID_CELL_SIZE,
  DEFAULT_LIST_GAP,
  layoutChildrenStyle,
  resolveGridLayout,
  resolveListLayout,
  sanitizeLayoutFields,
  udimCss,
} from "./layout";

const node = (overrides: Partial<SceneNode> = {}): SceneNode => ({
  id: "container",
  cls: "Frame",
  name: "Container",
  parentId: null,
  pos: { x: 0, y: 0 },
  size: { x: 1, y: 1 },
  color: "#000000",
  transparency: 0,
  cornerRadius: 0,
  zindex: 1,
  ...overrides,
});

describe("layout defaults", () => {
  it("preserves legacy list and grid defaults", () => {
    expect(resolveListLayout(node({ layout: "list" }))).toMatchObject({
      direction: "vertical",
      gap: DEFAULT_LIST_GAP,
      horizontalAlignment: "left",
      verticalAlignment: "top",
    });
    expect(resolveGridLayout(node({ layout: "grid" }))).toMatchObject({
      cellSize: DEFAULT_GRID_CELL_SIZE,
      cellPadding: DEFAULT_GRID_CELL_PADDING,
      horizontalAlignment: "left",
      verticalAlignment: "top",
    });
  });

  it("converts Scale and Offset to deterministic CSS", () => {
    expect(udimCss({ scale: 0, offset: 8 })).toBe("8px");
    expect(udimCss({ scale: 0.25, offset: 0 })).toBe("25%");
    expect(udimCss({ scale: 0.25, offset: 8 })).toBe("calc(25% + 8px)");
  });

  it("maps horizontal list alignment to physical axes", () => {
    expect(layoutChildrenStyle(node({
      layout: "list",
      listDirection: "horizontal",
      listGap: { scale: 0, offset: 12 },
      layoutHorizontalAlignment: "center",
      layoutVerticalAlignment: "bottom",
    }))).toMatchObject({
      display: "flex",
      flexDirection: "row",
      gap: "12px",
      justifyContent: "center",
      alignItems: "flex-end",
    });
  });

  it("maps responsive grid tracks and gaps", () => {
    expect(layoutChildrenStyle(node({
      layout: "grid",
      gridCellSize: {
        scale: { x: 0.3, y: 0 },
        offset: { x: 0, y: 120 },
      },
      gridCellPadding: {
        scale: { x: 0.02, y: 0 },
        offset: { x: 4, y: 8 },
      },
      layoutHorizontalAlignment: "center",
      layoutVerticalAlignment: "bottom",
    }))).toMatchObject({
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, 30%)",
      gridAutoRows: "120px",
      columnGap: "calc(2% + 4px)",
      rowGap: "8px",
      justifyContent: "center",
      alignContent: "end",
    });
  });

  it.each([
    ["none", "hidden", "hidden"],
    ["x", "auto", "hidden"],
    ["y", "hidden", "auto"],
    ["xy", "auto", "auto"],
  ] as const)("maps %s automatic canvas overflow", (mode, x, y) => {
    expect(layoutChildrenStyle(node({ cls: "ScrollingFrame", automaticCanvasSize: mode }))).toMatchObject({
      overflowX: x,
      overflowY: y,
    });
  });

  it("sanitizes layout bounds and class-specific automatic canvas", () => {
    expect(sanitizeLayoutFields({
      listDirection: "diagonal",
      listGap: { scale: 2, offset: 5000 },
      automaticCanvasSize: "y",
    }, "Frame")).toEqual({
      listGap: { scale: 1, offset: 4096 },
    });
    expect(sanitizeLayoutFields({ automaticCanvasSize: "xy" }, "ScrollingFrame"))
      .toEqual({ automaticCanvasSize: "xy" });
  });
});
```

- [x] **Step 2: Run the new unit file and verify RED**

Run: `npm test -- app/editor/layout.test.ts`

Expected: FAIL because `./layout` and the new SceneNode fields do not exist.

- [x] **Step 3: Add shared types and optional scene fields**

In `catalog.ts`, add exactly:

```ts
export type UDimValue = { scale: number; offset: number };
export type UDim2Value = {
  scale: { x: number; y: number };
  offset: { x: number; y: number };
};
export type ListDirection = "vertical" | "horizontal";
export type LayoutHorizontalAlignment = "left" | "center" | "right";
export type LayoutVerticalAlignment = "top" | "center" | "bottom";
export type AutomaticCanvasSize = "none" | "x" | "y" | "xy";
```

Add the approved optional fields beside `layout` and `padding` in SceneNode.

- [x] **Step 4: Implement pure defaults, sanitization, enum mapping, and CSS mapping**

`layout.ts` exports immutable defaults, `resolveListLayout`,
`resolveGridLayout`, `sanitizeLayoutFields(raw, cls)`, `udimCss`,
`layoutChildrenStyle`, `robloxHorizontalAlignment`,
`robloxVerticalAlignment`, `robloxListDirection`, and
`robloxAutomaticCanvasSize`.

Use these exact validation rules:

```ts
const clampScale = (value: number) => Math.max(0, Math.min(1, value));
const clampOffset = (value: number) => Math.max(0, Math.min(4096, Math.round(value)));
const CONTAINERS = new Set(["ScreenGui", "Frame", "ScrollingFrame"]);
```

`layoutChildrenStyle` returns `position: "absolute"`, `inset: 0`, content
padding, axis-specific overflow, and the active layout styles. Physical
alignment mapping must remain correct when List direction changes.

- [x] **Step 5: Run focused tests and TypeScript for GREEN**

Run:

```bash
npm test -- app/editor/layout.test.ts
npx tsc --noEmit
```

Expected: all layout tests pass and TypeScript exits 0.

- [x] **Step 6: Commit the shared layout contract**

Stage only `catalog.ts`, `layout.ts`, and `layout.test.ts`. Commit with the lore
format; record that UIPageLayout and Grid traversal controls are excluded.

### Task 2: Persistence And Deep-Copy Compatibility

**Files:**
- Modify: `app/editor/persistence.test.ts`
- Modify: `app/editor/persistence.ts`
- Modify: `app/editor/scene.test.ts`
- Modify: `app/editor/scene.ts`

- [x] **Step 1: Write failing persistence tests**

Add a version 1 round-trip case containing every approved field. Add a boundary
case proving scales clamp to `0..1`, offsets round and clamp to `0..4096`, bad
enums disappear, and AutomaticCanvasSize disappears from Frame but survives on
ScrollingFrame.

```ts
expect(sanitizeScene([node({
  cls: "ScrollingFrame",
  layout: "grid",
  gridCellSize: {
    scale: { x: 2, y: -1 },
    offset: { x: 12.7, y: 9000 },
  },
  automaticCanvasSize: "y",
})])?.[0]).toMatchObject({
  gridCellSize: {
    scale: { x: 1, y: 0 },
    offset: { x: 13, y: 4096 },
  },
  automaticCanvasSize: "y",
});
```

- [x] **Step 2: Write a failing nested-copy test**

Duplicate a Grid container, mutate clone `gridCellSize.scale.x`,
`gridCellSize.offset.x`, `gridCellPadding.scale.x`, and `listGap.offset`, then
assert the source retains its original values.

- [x] **Step 3: Run persistence and scene tests for RED**

Run:

```bash
npm test -- app/editor/persistence.test.ts app/editor/scene.test.ts
```

Expected: FAIL because import sanitization and duplicateSubtree do not carry the
new fields.

- [x] **Step 4: Connect the shared sanitizer at the JSON boundary**

Spread `sanitizeLayoutFields(source, source.cls as RobloxClass)` into the
sanitized node after base geometry. Keep `PROJECT_VERSION = 1`; do not reject an
otherwise valid node when an optional layout field is malformed.

- [x] **Step 5: Deep-clone every nested layout value**

In `duplicateSubtree`, clone `listGap`, `gridCellSize`, and `gridCellPadding`
including both nested Scale and Offset vectors. Scalar enums copy through the
existing object spread.

- [x] **Step 6: Run focused tests for GREEN**

Run:

```bash
npm test -- app/editor/persistence.test.ts app/editor/scene.test.ts
npx tsc --noEmit
```

Expected: both files and TypeScript pass with all legacy tests unchanged.

- [x] **Step 7: Commit persistence compatibility**

Stage only persistence and scene cloning files/tests. Commit with the lore
format and state that version 1 remains valid because all fields are optional.

### Task 3: Exact Roblox Luau Generation

**Files:**
- Modify: `app/editor/scene.test.ts`
- Modify: `app/editor/scene.ts`

- [x] **Step 1: Write failing explicit and legacy Luau tests**

For a horizontal List, assert:

```ts
expect(code).toContain("el0_list.FillDirection = Enum.FillDirection.Horizontal");
expect(code).toContain("el0_list.Padding = UDim.new(0.1, 12)");
expect(code).toContain("el0_list.HorizontalAlignment = Enum.HorizontalAlignment.Center");
expect(code).toContain("el0_list.VerticalAlignment = Enum.VerticalAlignment.Bottom");
```

For a Grid, assert exact responsive `UDim2.new` CellSize and CellPadding plus
alignment. For a ScrollingFrame with `automaticCanvasSize: "y"`, assert:

```ts
expect(code).toContain("el0.AutomaticCanvasSize = Enum.AutomaticSize.Y");
expect(code).toContain("el0.CanvasSize = UDim2.fromScale(0, 0)");
```

Keep a legacy scene assertion for Vertical, 8px List and 100px/8px Grid
defaults. Assert Frame automaticCanvasSize is not emitted.

- [x] **Step 2: Run scene tests for RED**

Run: `npm test -- app/editor/scene.test.ts`

Expected: FAIL on hard-coded layout assignments and absent AutomaticCanvasSize.

- [x] **Step 3: Generate from resolved layout configuration**

Replace hard-coded List/Grid values with `resolveListLayout` and
`resolveGridLayout`. Use the shared enum mapping helpers. Emit
AutomaticCanvasSize and zero CanvasSize only when node class is ScrollingFrame
and mode is not None.

- [x] **Step 4: Run scene tests and TypeScript for GREEN**

Run:

```bash
npm test -- app/editor/scene.test.ts
npx tsc --noEmit
```

Expected: scene tests and TypeScript pass.

- [x] **Step 5: Commit generated layout code**

Stage `scene.ts` and `scene.test.ts`; commit with exact generated fragments in
`Tested:` and Roblox Studio runtime in `Not-tested:`.

### Task 4: Conditional Layout Property Controls

**Files:**
- Create: `app/editor/LayoutProperties.tsx`
- Modify: `app/editor/PropertiesPanel.tsx`
- Create: `e2e/editor-layout.spec.ts`

- [x] **Step 1: Write the failing property-control browser slice**

Create an `@full` Playwright test that opens `/editor?template=shop`, selects
ItemGrid from Hierarchy, and expects these accessible controls:

```ts
await expect(page.getByRole("combobox", { name: "Layout" })).toHaveValue("grid");
await page.getByRole("spinbutton", { name: "Cell size X scale" }).fill("0.3");
await page.getByRole("spinbutton", { name: "Cell size Y offset" }).fill("120");
await page.getByRole("spinbutton", { name: "Cell padding X scale" }).fill("0.02");
await page.getByRole("combobox", { name: "Horizontal alignment" }).selectOption("center");
await page.getByRole("combobox", { name: "Vertical alignment" }).selectOption("bottom");
await page.getByRole("combobox", { name: "Automatic canvas size" }).selectOption("y");
```

Switch Layout to List and assert Direction plus Gap controls appear while Grid
controls disappear. Switch back and assert the Grid draft values are restored.

- [x] **Step 2: Build and run the browser test for RED**

Run:

```bash
npm run build
npx playwright test e2e/editor-layout.spec.ts
```

Expected: FAIL because the approved layout controls are absent.

- [x] **Step 3: Implement bounded local numeric drafts**

In `LayoutProperties.tsx`, define `BoundedNumberField` with `draft` and inline
error state. It accepts `ariaLabel`, `value`, `min`, `max`, `step`, and
`onCommit`. Empty/invalid/out-of-range drafts stay visible and do not call
`onCommit`; valid values commit immediately.

- [x] **Step 4: Implement conditional List, Grid, alignment, and scrolling controls**

`LayoutProperties` receives `node` and `onChange`. It renders Layout and
existing content Padding for containers, layout-specific controls for the
active type, and AutomaticCanvasSize only for ScrollingFrame. All enum selects
use the exact lower-case scene values. Each nested update creates fresh Scale
and Offset objects.

- [x] **Step 5: Replace the inline Container group**

Remove the current unconditional Container block from PropertiesPanel. Render
LayoutProperties only when selected node class is ScreenGui, Frame, or
ScrollingFrame. Keep all unrelated property groups unchanged.

- [x] **Step 6: Rebuild and rerun the browser test for GREEN**

Run:

```bash
npx tsc --noEmit
npm run build
npx playwright test e2e/editor-layout.spec.ts
```

Expected: the conditional control slice passes with no console errors.

- [x] **Step 7: Commit layout controls**

Stage LayoutProperties, PropertiesPanel, and the browser test. Commit with the
lore format; record numeric draft validation and inactive configuration
preservation.

### Task 5: Shared Canvas And ScenePreview Rendering

**Files:**
- Modify: `app/editor/layout.test.ts`
- Modify: `app/editor/Canvas.tsx`
- Modify: `app/editor/ScenePreview.tsx`
- Modify: `e2e/editor-layout.spec.ts`

- [x] **Step 1: Add failing rendered-layout assertions**

Extend the browser test to assert ItemGrid's child wrapper exposes
`data-layout="grid"` and the exact computed track/gap styles from the values
entered in Task 4. Add Inventory public preview and editor checks that assert
both paths use the same legacy default layout data before explicit template
adoption in Task 6.

- [x] **Step 2: Run the browser test for RED**

Run: `npx playwright test e2e/editor-layout.spec.ts`

Expected: FAIL because Canvas and ScenePreview still use hard-coded Tailwind
List/Grid classes and expose no stable layout state.

- [x] **Step 3: Use one style resolver in Canvas**

Replace ChildrenWrapper's separate hard-coded branches with one wrapper using
`layoutChildrenStyle(node)`. Add `data-layout` and
`data-automatic-canvas-size`. For Grid children, override width and height to
100%; for List children set `flexShrink: 0`; manual children retain geometry.

- [x] **Step 4: Use ordered children and the same resolver in ScenePreview**

Replace local scene filtering with `orderedChildren`, use the shared style
resolver, and apply the same Grid/List child sizing rules. Preserve static SSR,
initial visibility, typography, and existing template markup.

- [x] **Step 5: Run unit, browser, and build verification for GREEN**

Run:

```bash
npm test -- app/editor/layout.test.ts
npx tsc --noEmit
npm run build
npx playwright test e2e/editor-layout.spec.ts
```

Expected: shared mapping, editor, and public preview checks pass.

- [x] **Step 6: Commit shared preview rendering**

Stage layout tests, Canvas, ScenePreview, and browser assertions. Commit with
the lore format; state that CSS rounding is an approximation and Luau values are
authoritative.

### Task 6: Shop And Inventory Template Adoption

**Files:**
- Modify: `app/editor/templates.test.ts`
- Modify: `app/editor/templates.ts`
- Modify: `e2e/editor-layout.spec.ts`

- [x] **Step 1: Write failing template contracts**

Assert Shop ItemGrid equals:

```ts
expect(itemGrid).toMatchObject({
  cls: "ScrollingFrame",
  layout: "grid",
  automaticCanvasSize: "y",
  gridCellSize: {
    scale: { x: 0.3, y: 0 },
    offset: { x: 0, y: 120 },
  },
  gridCellPadding: {
    scale: { x: 0.02, y: 0 },
    offset: { x: 4, y: 8 },
  },
});
```

Assert Inventory Slots equals:

```ts
expect(slots).toMatchObject({
  layout: "grid",
  gridCellSize: {
    scale: { x: 0.22, y: 0 },
    offset: { x: 0, y: 92 },
  },
  gridCellPadding: {
    scale: { x: 0, y: 0 },
    offset: { x: 8, y: 8 },
  },
});
```

- [x] **Step 2: Run template tests for RED**

Run: `npm test -- app/editor/templates.test.ts`

Expected: FAIL because Shop and Inventory use only the legacy layout string.

- [x] **Step 3: Add explicit fields without redesigning templates**

Extend the local `mk` helper to copy every approved optional layout field when
present. Add the exact Shop and Inventory settings asserted above. Do not change
text, colors, node IDs, actions, or hierarchy.

- [x] **Step 4: Run template and browser tests for GREEN**

Run:

```bash
npm test -- app/editor/templates.test.ts
npm run build
npx playwright test e2e/editor-layout.spec.ts
```

Expected: template contracts and public/editor preview paths pass.

- [x] **Step 5: Commit template adoption**

Stage templates, template tests, and focused browser assertions. Commit with
the lore format and note that visual composition remains intentionally stable.

### Task 7: Full Editor Round-Trip And Release Proof

**Files:**
- Modify: `e2e/editor-layout.spec.ts`
- Modify: `docs/superpowers/plans/2026-06-20-complete-layout-p0.md`

- [x] **Step 1: Complete the layout browser journey**

Extend the focused test to verify:

- Grid values and AutomaticCanvasSize appear in live Luau;
- changing one value, waiting for history, and Undo/Redo restores it;
- refresh preserves every control;
- exported JSON contains canonical nested values;
- importing the JSON restores controls and Luau;
- ZIP project JSON and client Luau contain the same layout settings;
- mobile and desktop template pages have no horizontal page overflow;
- console errors remain empty.

- [x] **Step 2: Run focused editor suites**

Run:

```bash
npm test -- app/editor/layout.test.ts app/editor/persistence.test.ts app/editor/scene.test.ts app/editor/templates.test.ts
```

Expected: all focused files pass with zero failures.

- [x] **Step 3: Run the full unit suite**

Run: `npm test`

Expected: all Vitest files pass with zero failures.

- [x] **Step 4: Run TypeScript and production build sequentially**

Run:

```bash
npx tsc --noEmit
npm run build
```

Expected: both exit 0 and all static routes generate.

- [x] **Step 5: Run smoke and full browser gates**

Run:

```bash
npm run test:e2e:smoke
npm run test:e2e:full
```

Expected: every Playwright test passes with zero console errors.

- [x] **Step 6: Run React best-practices review and inspect the diff**

Review LayoutProperties, Canvas, and ScenePreview for hook correctness,
accessibility, stable keys, unnecessary state, and TypeScript escapes. Run:

```bash
git diff --check
git status --short
git diff --stat main...HEAD
```

Do not stage or modify the user's existing `.gitignore`, `.superpowers/`, or
`docs/youtube-60s-script.md` changes.

- [x] **Step 7: Record evidence and commit release proof**

Mark completed checkboxes and append exact test counts, build route count,
browser counts, residual risks, and Not-tested items. Commit only the plan
update using the lore format.

#### Task 7 Release Evidence (2026-06-21)

- Focused unit gate: 4 files passed, 115 tests passed.
- Full unit gate: 13 files passed, 215 tests passed.
- TypeScript gate: `npx tsc --noEmit` exited 0 with zero errors.
- Production build gate: Next.js 16.2.9 compiled successfully and generated
  42/42 static pages; the dynamic `/editor` route remained server-rendered on
  demand.
- Browser smoke gate: 3 Chromium tests passed.
- Browser full gate: 5 Chromium tests passed, including the 3 focused layout
  journeys and console-error assertions.
- Diff hygiene: `git diff --check` passed; only the Task 7 E2E spec and this
  plan evidence were changed by Task 7.
- React review: no blocking hook, key, state, or TypeScript escape findings in
  `LayoutProperties`, `Canvas`, or `ScenePreview`.
- Residual risk: the four Canvas resize handles remain pointer-only `<span>`
  elements without keyboard resize semantics or accessible names. This is a
  pre-existing accessibility issue outside Task 7's two-file edit boundary.
- Not-tested: Roblox Studio execution of the generated Luau, non-Chromium
  browser engines, assistive-technology interaction, and real touch-device
  behavior.

### Task 8: Start The Tween Presets Planning Cycle

**Files:**
- Create after user approval: `docs/superpowers/specs/2026-06-20-tween-presets-design.md`
- Create after spec review: `docs/superpowers/plans/2026-06-20-tween-presets.md`

- [x] **Step 1: Verify Complete Layout P0 is integrated or preserved on a clean feature branch**

Do not declare the phase closed until Task 7 evidence is committed and the
integration choice has been executed or the verified branch is explicitly kept.

- [x] **Step 2: Invoke the brainstorming workflow for Tween Presets**

Explore the current action and preview architecture, then ask one scope question
at a time. Compare at least these approaches: per-node animation properties,
button-action animation payloads, and an animation timeline. Recommend the
smallest honest model for Open, Close, Fade, Slide, Scale, and Hover.

- [x] **Step 3: Write, self-review, and commit the approved Tween specification**

The spec must define preview behavior, Luau TweenService output, reduced-motion
handling, action interaction, persistence, security boundaries, and tests. Scan
for placeholders, contradictions, ambiguous defaults, and scope expansion.

- [x] **Step 4: Obtain written-spec approval and create the Tween implementation plan**

After user review, invoke `superpowers:writing-plans`, save the plan under
`docs/superpowers/plans/`, self-review it for coverage and type consistency, and
commit it separately. Only then is Complete Layout P0's phase closeout complete.

#### Task 8 Planning Evidence (2026-06-21)

- Integration choice: the verified implementation remains preserved on the
  clean `codex/complete-layout-p0` feature branch. Task 7 evidence was committed
  before Tween planning began.
- Brainstorming compared node-owned presets, action-owned payloads, and a
  timeline. The approved P0 model is node-owned, pairs Open and Close, offers
  Fade/Slide/Scale plus TextButton Hover, exposes duration and Slide direction,
  and snaps under reduced motion.
- The approved design is committed at `93c9aef` in
  `docs/superpowers/specs/2026-06-20-tween-presets-design.md`. Four review rounds
  closed nested Fade ownership, Preview freeze, version migration, dynamic
  reduced-motion, direct-target visibility, and interruption ambiguities.
- The implementation plan is committed separately at `85667e0` in
  `docs/superpowers/plans/2026-06-20-tween-presets.md`. Three execution-review
  rounds closed initial-frame, visibility atomicity, autosave/import race,
  generator cleanup, and test-order gaps.
- Complete Layout P0 phase closeout condition is satisfied. The next executable
  phase is Tween Presets Task 1: motion contract, sanitizer, and resolver
  precedence.
