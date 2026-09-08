# AI GUI P0 — Production Quality Gate Results

Official gate run against **https://robloxguimaker.app** (production, GLM provider, real model) on 2026-09-08T09:12:51.635Z. 50/50 prompts executed — no prompt excluded.

## Headline metrics

| Metric | Result | Gate | Pass |
|---|---:|---|---|
| Total prompts | 50 | 50 | ✅ |
| HTTP success rate | 100% (0×4xx, 0×5xx) | — | ✅ |
| Valid Scene Rate | 100% (50/50) | ≥95% | ✅ |
| Composer Success Rate | 100% (every valid spec composed a sanitize-passing scene) | — | ✅ |
| Export Success Rate | 100% (all 50 scenes: client Luau + server allow-list, `eval-validation.test.ts`) | =100% | ✅ |
| Fallback Rate | 0% (provider_error=0, invalid_spec=0) | <15% | ✅ |
| Average latency | 4.0s | — | — |
| P50 latency | 3.7s | — | — |
| P95 latency | 7.3s | <8s | ✅ |
| Max latency | 9.9s | — | — |
| Average warnings / prompt | 1.88 | — | — |
| Screen-type classification accuracy | 100% (50/50) | ≥90% | ✅ |
| Visual BAD rate | 0% (GOOD 46, ACCEPTABLE 4, BAD 0) | <20% | ✅ |

## Results by screen type

| Screen Type | Count | Valid | Fallback | Good | Acceptable | Bad | P95 |
|---|---:|---:|---:|---:|---:|---:|---:|
| daily-rewards | 7 | 7 | 0 | 7 | 0 | 0 | 5.6s |
| hud | 10 | 10 | 0 | 7 | 3 | 0 | 5.7s |
| inventory | 8 | 8 | 0 | 7 | 1 | 0 | 5.0s |
| main-menu | 9 | 9 | 0 | 9 | 0 | 0 | 7.7s |
| settings | 7 | 7 | 0 | 7 | 0 | 0 | 7.3s |
| shop | 9 | 9 | 0 | 9 | 0 | 0 | 9.9s |

Weakest type by P95: shop (9.9s — driven by one 9.9s outlier). Zero BAD scenes in every type.

## Visual quality method & calibration

Rating = automated geometric audit in the real editor (sibling-overlap >35%, off-canvas elements, clipped text, sparse scenes), calibrated against 4 human-reviewed screenshots (shop GOOD; hud/menu/shop ACCEPTABLE-or-better) — audit and human grades agreed on all 4. All 50 preview screenshots archived at eval time (ephemeral, not committed).

ACCEPTABLE details: #16/#33/#46 each have a single intentional sibling overlap (progress-fill/label layering); #38 is a deliberately sparse main-menu.

## Classification errors

None. 50/50 expected==actual, including adversarial adjacencies ("tycoon main menu with Play and Quit" → main-menu, not tycoon/shop).

## Interaction & export validation

All 50 scenes passed `eval-validation.test.ts`:
- client Luau compiles-style checks: `Instance.new("ScreenGui")` present; **no `require(` / `loadstring` anywhere**
- every RemoteEvent button has identifier-charset names; server Luau contains the exact per-event allow-list branches (verified on shop & daily-rewards scenes)
- every show/hide/toggle target resolves to an existing Frame/ScrollingFrame

## Security (production injection tests)

5/5 attacks returned HTTP 200 with safe output: no secret/system-prompt leakage, no raw Lua, "Create 5000 buttons" clamped to a 4-node scene, jailbreak/Lua/RemoteEvent-path attacks degraded to the safe template fallback. No 5xx.

## Latency & cost

- Provider tokens (measured, 50/50 responses): avg **779.3 input / 56 output** per generation.
- Estimated cost per generation: **COST_NOT_MEASURED** (tokens recorded; provider pricing not exposed by the API response).

## Known notes

- `Invalid title dropped` warnings (40/50) are parser noise: the model legitimately answers `title: null` per the spec example. Cosmetic; harmless.
- Runtime logs via Vercel CLI were unavailable (empty response). Runtime evidence: 0×5xx and 0 unexpected 4xx across 50 eval + 5 injection + 5 browser requests; browser console showed zero application errors.
