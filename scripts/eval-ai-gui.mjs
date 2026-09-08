#!/usr/bin/env node
// 50-prompt real-model evaluation for /api/generate-gui (quality gate).
//
//   1. Start/target a deployment with a REAL provider key (never mock):
//        BASE_URL=https://robloxguimaker.app
//   2. Run:
//        BASE_URL=https://robloxguimaker.app node scripts/eval-ai-gui.mjs
//
// Measures the FULL funnel the gate cares about: HTTP status distribution,
// valid-scene rate, fallback (with reason split), latency percentiles, token
// usage when the provider reports it, per-screen-type breakdown, and
// screen-type classification accuracy vs the labeled fixture expectations.
// Every generated scene is saved to $SCENES_DIR (default /tmp/rgm-eval-scenes)
// for the export-validation test and the visual review pass.
// Output: docs/eval-results.json

import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const BASE_URL = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const SCENES_DIR = process.env.SCENES_DIR ?? "/tmp/rgm-eval-scenes";
const HERE = dirname(fileURLToPath(import.meta.url));
const fixtures = JSON.parse(
  readFileSync(join(HERE, "../app/editor/ai/prompt-fixtures.json"), "utf8")
);
const prompts = [...fixtures.fixtures, ...fixtures.evalExtra];

const percentile = (values, p) => {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length))];
};
const round = (n, digits = 1) =>
  n === null || n === undefined || Number.isNaN(n) ? null : +n.toFixed(digits);

console.log(`Evaluating ${prompts.length} prompts against ${BASE_URL} …\n`);
rmSync(SCENES_DIR, { recursive: true, force: true });
mkdirSync(SCENES_DIR, { recursive: true });

const results = [];
for (const [index, fixture] of prompts.entries()) {
  const started = Date.now();
  let entry;
  try {
    const response = await fetch(`${BASE_URL}/api/generate-gui`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: fixture.prompt, locale: "en" }),
    });
    const body = await response.json();
    const scene = Array.isArray(body.scene) ? body.scene : null;
    const valid =
      response.status === 200 &&
      !!scene &&
      scene.length > 0 &&
      scene.some((n) => n.cls === "ScreenGui" && !n.parentId) &&
      scene.length <= 150;
    entry = {
      index: index + 1,
      prompt: fixture.prompt,
      expectedScreenType: fixture.screenType,
      status: response.status,
      valid,
      screenType: body.meta?.screenType ?? null,
      fallbackUsed: body.meta?.fallbackUsed ?? null,
      fallbackReason: body.meta?.fallbackReason ?? null,
      warnings: body.meta?.warnings ?? [],
      nodes: scene ? scene.length : 0,
      latencyMs: Date.now() - started,
      providerLatencyMs: body.meta?.latencyMs ?? null,
      tokenUsage: body.meta?.tokenUsage ?? null,
    };
    if (valid) {
      writeFileSync(
        join(SCENES_DIR, `scene-${String(index + 1).padStart(2, "0")}.json`),
        JSON.stringify(
          { prompt: fixture.prompt, expected: fixture.screenType, meta: body.meta, scene },
          null,
          2
        )
      );
    }
    const flag = valid ? "✓" : `✗(${response.status})`;
    process.stdout.write(
      `${String(index + 1).padStart(2)}/${prompts.length} ${flag} ` +
        `${String(entry.latencyMs).padStart(5)}ms ${entry.screenType ?? "?"}` +
        `${entry.expectedScreenType && entry.screenType !== entry.expectedScreenType ? ` ≠${entry.expectedScreenType}` : ""}` +
        `${entry.fallbackUsed === "template" ? ` [fallback:${entry.fallbackReason}]` : ""}\n`
    );
  } catch (error) {
    entry = {
      index: index + 1,
      prompt: fixture.prompt,
      expectedScreenType: fixture.screenType,
      status: 0,
      valid: false,
      error: String(error),
      latencyMs: Date.now() - started,
    };
    process.stdout.write(`${index + 1}/${prompts.length} ✗ network error\n`);
  }
  results.push(entry);
}

// ---- aggregation -----------------------------------------------------------

const valid = results.filter((r) => r.valid);
const latencies = results.map((r) => r.latencyMs);
const statuses = results.map((r) => r.status);
const tokenUsages = valid.map((r) => r.tokenUsage).filter(Boolean);

const byScreenType = {};
for (const type of ["main-menu", "shop", "inventory", "hud", "daily-rewards", "settings", "other"]) {
  const rows = results.filter(
    (r) => (r.screenType ?? "other") === type || (type === "other" && !r.screenType)
  );
  if (rows.length === 0) continue;
  byScreenType[type] = {
    count: rows.length,
    valid: rows.filter((r) => r.valid).length,
    fallback: rows.filter((r) => r.fallbackUsed === "template").length,
    misclassified: rows.filter(
      (r) => r.expectedScreenType && r.screenType !== r.expectedScreenType
    ).length,
    p95LatencyMs: percentile(rows.map((r) => r.latencyMs), 95),
  };
}

const classificationErrors = results
  .filter((r) => r.valid && r.screenType !== r.expectedScreenType)
  .map((r) => ({ prompt: r.prompt, expected: r.expectedScreenType, actual: r.screenType }));

const summary = {
  baseUrl: BASE_URL,
  ranAt: new Date().toISOString(),
  total: results.length,
  httpSuccessRate: round(statuses.filter((s) => s === 200).length / results.length, 3),
  validScene: valid.length,
  validSceneRate: round(valid.length / results.length, 3),
  fallbackCount: results.filter((r) => r.fallbackUsed === "template").length,
  fallbackRate: round(
    results.filter((r) => r.fallbackUsed === "template").length / results.length,
    3
  ),
  fallbackReasons: {
    provider_error: results.filter((r) => r.fallbackReason === "provider_error").length,
    invalid_spec: results.filter((r) => r.fallbackReason === "invalid_spec").length,
  },
  avgLatencyMs: round(latencies.reduce((a, b) => a + b, 0) / latencies.length),
  p50LatencyMs: percentile(latencies, 50),
  p95LatencyMs: percentile(latencies, 95),
  maxLatencyMs: Math.max(...latencies),
  avgWarnings: round(
    results.reduce((sum, r) => sum + (r.warnings?.length ?? 0), 0) / results.length,
    2
  ),
  http4xx: statuses.filter((s) => s >= 400 && s < 500).length,
  http5xx: statuses.filter((s) => s >= 500).length,
  classificationAccuracy: round(
    1 - classificationErrors.length / results.filter((r) => r.valid).length,
    3
  ),
  tokenUsage: tokenUsages.length
    ? {
        samples: tokenUsages.length,
        avgInputTokens: round(
          tokenUsages.reduce((s, u) => s + u.inputTokens, 0) / tokenUsages.length
        ),
        avgOutputTokens: round(
          tokenUsages.reduce((s, u) => s + u.outputTokens, 0) / tokenUsages.length
        ),
      }
    : "COST_NOT_MEASURED",
  byScreenType,
};

console.log("\n===== Summary =====");
console.log(JSON.stringify(summary, null, 2));
writeFileSync(
  join(HERE, "../docs/eval-results.json"),
  JSON.stringify({ summary, results }, null, 2)
);
console.log("\nPer-prompt details: docs/eval-results.json");
console.log(`Scenes for visual review + export tests: ${SCENES_DIR}`);
