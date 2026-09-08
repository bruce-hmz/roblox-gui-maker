#!/usr/bin/env node
// 50-prompt real-model evaluation for /api/generate-gui.
//
//   1. Start the app with a REAL provider key (never AI_PROVIDER=mock):
//        GLM_API_KEY=... npm run build && npm run start -- --port 3199
//   2. Run against it:
//        BASE_URL=http://127.0.0.1:3199 node scripts/eval-ai-gui.mjs
//
// Reports: valid-scene rate, fallback rate, node-count stats, P50/P95
// latency, and a per-prompt table. Client+server export success is already
// guaranteed for any valid scene by the composer unit tests, so this eval
// measures the model→spec→scene path. Output: docs/eval-results.json.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const BASE_URL = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const HERE = dirname(fileURLToPath(import.meta.url));
const fixtures = JSON.parse(
  readFileSync(join(HERE, "../app/editor/ai/prompt-fixtures.json"), "utf8")
);
const prompts = [
  ...fixtures.fixtures.map((f) => f.prompt),
  ...fixtures.evalExtra,
];

const percentile = (values, p) => {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length))];
};

console.log(`Evaluating ${prompts.length} prompts against ${BASE_URL} …\n`);
const results = [];
for (const [index, prompt] of prompts.entries()) {
  const started = Date.now();
  try {
    const response = await fetch(`${BASE_URL}/api/generate-gui`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, locale: "en" }),
    });
    const body = await response.json();
    const valid =
      response.status === 200 &&
      Array.isArray(body.scene) &&
      body.scene.length > 0 &&
      body.scene.some((n) => n.cls === "ScreenGui" && !n.parentId) &&
      body.scene.length <= 150;
    results.push({
      index: index + 1,
      prompt,
      status: response.status,
      valid,
      screenType: body.meta?.screenType ?? null,
      fallbackUsed: body.meta?.fallbackUsed ?? null,
      nodes: Array.isArray(body.scene) ? body.scene.length : 0,
      latencyMs: Date.now() - started,
      providerLatencyMs: body.meta?.latencyMs ?? null,
    });
    process.stdout.write(
      `${String(index + 1).padStart(2)}/${prompts.length} ${valid ? "✓" : "✗"} ` +
        `${String(results.at(-1).latencyMs).padStart(5)}ms ${body.meta?.screenType ?? "?"}` +
        `${body.meta?.fallbackUsed === "template" ? " (fallback)" : ""}\n`
    );
  } catch (error) {
    results.push({
      index: index + 1,
      prompt,
      status: 0,
      valid: false,
      error: String(error),
      latencyMs: Date.now() - started,
    });
    process.stdout.write(`${index + 1}/${prompts.length} ✗ network error\n`);
  }
}

const valid = results.filter((r) => r.valid);
const fallbacks = results.filter((r) => r.fallbackUsed === "template");
const latencies = results.map((r) => r.latencyMs).sort((a, b) => a - b);
const summary = {
  baseUrl: BASE_URL,
  ranAt: new Date().toISOString(),
  total: results.length,
  validScene: valid.length,
  validSceneRate: +(valid.length / results.length).toFixed(3),
  fallbackCount: fallbacks.length,
  fallbackRate: +(fallbacks.length / results.length).toFixed(3),
  p50LatencyMs: percentile(latencies, 50),
  p95LatencyMs: percentile(latencies, 95),
  avgNodes: valid.length
    ? +(valid.reduce((sum, r) => sum + r.nodes, 0) / valid.length).toFixed(1)
    : null,
};

console.log("\n===== Summary =====");
console.log(JSON.stringify(summary, null, 2));
console.log(
  "\nTargets: validSceneRate >= 0.95, fallbackRate < 0.15, p95 < 8000ms."
);
writeFileSync(join(HERE, "../docs/eval-results.json"), JSON.stringify({ summary, results }, null, 2));
console.log("\nPer-prompt details: docs/eval-results.json");
