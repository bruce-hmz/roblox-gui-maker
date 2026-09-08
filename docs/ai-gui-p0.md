# AI GUI P0 — Prompt → Working Editable Roblox GUI

Technical decision record for the P0 feature: a homepage prompt box that turns
natural language into a **real, editable SceneNode[] scene** inside the existing
visual editor — never an image, never LLM-written Luau.

## Current architecture (as built)

- Scene model: flat `SceneNode[]` with `parentId` pointers (`app/editor/catalog.ts`).
  Coordinates are UDim-like scale (0..1). The only "source of truth" for a GUI.
- Validation: `sanitizeScene()` / `sanitizeNode()` in `app/editor/persistence.ts`
  — whitelist classes, clamp numbers, validate hex/fonts/actions, repair parent
  cycles. Already used by JSON import and localStorage restore.
- Deterministic compilers: `generateLuau()` (`app/editor/scene.ts`) and
  `generateServerLuau()` (`app/editor/server-luau.ts`). RemoteEvent names pass
  `remoteEventNameError` (identifier charset, ≤50 chars); server script
  allow-lists the exact argument strings seen in the scene; teleports use an
  `allowedPlaceIds` table. **These are never touched by AI output.**
- Templates: `app/editor/templates.ts` — hand-authored `SceneNode[]` builders
  via a local `mk()` helper; `enrichScene()` adds gradients/strokes for polish.
- Themes: `app/editor/themes.ts` — 10-slot `Palette` + `applyTheme()` recolors
  known base hexes. Kits reuse it (`kits.ts`).
- Editor: client component `app/editor/Editor.tsx`; loads `?template=` via
  server-rendered `initialScene`; persists to localStorage `rgm:scene:v1`.
- Backend: none (one thumbnail proxy). No DB, no auth.

## Chosen architecture

```
Prompt (untrusted text)
  → Provider (LLM, JSON mode)            app/editor/ai/provider.ts
  → GuiDesignSpec (strict parse/repair)  app/editor/ai/spec.ts
  → Deterministic Composer               app/editor/ai/composer.ts
  → SceneNode[] (base palette + enrichScene + applyTheme)
  → sanitizeScene()                      (existing)
  → invariant checks (≤150 nodes, single ScreenGui root, ids unique)
  → editor handoff (sessionStorage) → existing editor → existing exporters
```

**AI decides *what* the player needs (screen type, blocks, labels, mood).
Our code decides *how* a correct Roblox GUI is built (hierarchy, scale sizes,
anchors, layouts, actions).**

## Rejected alternative: LLM → raw SceneNode[]

Rejected for P0. `sanitizeScene()` guarantees *legal* scenes, not *good* ones:
nothing stops overlapping buttons, offset-only layout, broken spacing, or
inconsistent structure between runs. Raw generation also makes quality
untestable (no fixed input → fixed output contract). Cost of the Spec layer is
small (one discriminated-union type + a parser), and the Composer doubles as
the engine for official examples (`/editor?example=…`) and future parameterized
templates. Revisit only if the Spec proves too rigid for real prompts — the
Spec can then gain a `free-layout` block that still passes through the same
validators.

Also rejected: LLM → Luau directly (unverifiable, untestable, unsafe — see
security boundary), and image generation (not this product).

## GuiDesignSpec (summary)

Six screen types for P0: `main-menu | shop | inventory | hud | daily-rewards |
settings`. Blocks are a per-screen discriminated union (`menu-buttons`,
`game-pass-grid`, `item-grid`, `item-details`, `stat-bar`, `skill-bar`,
`ultimate-meter`, `currency-display`, `reward-calendar`, `setting-toggles`)
plus `genre` and `mood` style hints and optional `title` / `primaryColor` /
`accentColor`. Full schema in `app/editor/ai/spec.ts` — the parser is the
single authority: enums checked, numbers clamped, labels trimmed/capped,
unknown fields dropped (with warnings), unsupported blocks dropped per-block,
and an empty result auto-fills that screen type's default blocks. Nothing the
model returns reaches the scene unvalidated.

## Composer design

`composeScene(spec) → SceneNode[]` is pure and deterministic: sequential `ai-N`
ids, fixed geometry tables, no dates/randomness. Each screen type mirrors the
hand-tuned structure of its template counterpart (e.g. hud mirrors
`health-bar`, shop mirrors `game-pass-shop`). Finishing pass reuses
`enrichScene()` (exported from templates.ts) and `applyTheme()` with a
mood→palette map (`ai/moods.ts`); explicit `primaryColor`/`accentColor`
override palette slots. Node caps enforced at spec level keep every composed
scene ≤ ~150 nodes.

## Interaction mapping

Only existing `NodeAction` variants are emitted: `show`/`hide`/`toggle`
(panel wiring for menu buttons + close buttons), `hideGui` (Play),
`remoteEvent` (`PurchaseGamePass:<key>`, `ClaimDailyReward:day-N`,
`PurchaseItem:item-N`) with names passing the existing identifier validation.
There is deliberately **no** AI-chosen free-form action: intents are a fixed
enum the parser whitelists.

## AI boundary & security boundary

- The LLM never sees or emits Luau; its entire output is one JSON object that
  must survive `parseGuiDesignSpec`.
- Prompt-injection: user text is passed as *content*, never as system
  instructions; output is schema-parsed so "ignore instructions and return
  Lua" fails validation and falls back. No system prompt, provider key, or raw
  model text is returned to the client (only `scene` + sanitized `meta`).
- API hardening: prompt ≤600 chars, per-IP hourly/daily rate limits, global
  daily generation budget with a friendly 503 ("templates and editor stay
  free"), 20s provider timeout, one repair retry, then deterministic
  fallback ladder (below). Limits are in-memory per server instance —
  acceptable for MVP; a shared store arrives with the P1 gallery work.

## Fallback ladder

1. Repair: invalid spec → one retry with the validation errors appended.
2. Drop unsupported/invalid blocks; empty block list → screen-type defaults.
3. Provider/parse failure → heuristic screen-type classification from the
   prompt + the closest existing template scene (`fallbackUsed: "template"`).
4. Nothing worked → 422 with "start from a template" guidance. The editor is
   never fed a bad scene.

## Provider

`GuiGenerationProvider` interface with a GLM (OpenAI-compatible chat
completions, JSON mode) implementation and a deterministic keyword-classifier
mock for e2e/dev (`AI_PROVIDER=mock`; playwright's webServer sets it).
Selection via env (`AI_PROVIDER`, `GLM_API_KEY`, `GLM_MODEL`, `GLM_BASE_URL`)
— no provider names leak above the factory. Without a key in production the
route returns the friendly 503; the rest of the site is unaffected.

## Metrics

Funnel events (GA4, prompt text never sent — only `promptLength`):
`ai_prompt_submit`, `ai_generate_success`, `ai_generate_failure`,
`ai_generate_fallback`, `ai_scene_loaded`, `ai_scene_first_edit`, `ai_export`.
Quality gates for release: ≥95% valid scenes across the 50-prompt eval, 100%
export success, <15% fallback, P95 <8s, human spot-check bad rate <20%
(`scripts/eval-ai-gui.mjs` against a running server).
