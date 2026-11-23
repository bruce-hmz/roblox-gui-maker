#!/usr/bin/env node
// Idempotent Cloudflare Zone Worker Route manager for the hybrid GFS cutover.
// Installs the exact legacy routes from gfs/worker-routes.json pointing to the
// `roblox-gui-maker` Worker so interactive routes (/editor*, /api/*, /pro/*,
// /_next/*, 5 creator tools, /pricing*, /avatar*, /kits/*, and static assets)
// bypass GFS and stay on the original OpenNext Worker after cutover.
//
// Usage:
//   CLOUDFLARE_API_TOKEN=... node scripts/setup-gfs-routes.mjs           # dry-run
//   CLOUDFLARE_API_TOKEN=... node scripts/setup-gfs-routes.mjs --apply   # create missing routes

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const apply = process.argv.includes("--apply");
assert(
  process.argv.slice(2).every((arg) => arg === "--apply"),
  "Usage: node scripts/setup-gfs-routes.mjs [--apply]"
);

const tokenFile = (process.env.CLOUDFLARE_API_TOKEN_FILE || "").trim();
const token = tokenFile
  ? (await readFile(tokenFile, "utf8")).trim()
  : (process.env.CLOUDFLARE_API_TOKEN || "").trim();
assert(token, "Set CLOUDFLARE_API_TOKEN or CLOUDFLARE_API_TOKEN_FILE");

const spec = JSON.parse(
  await readFile(join(ROOT, "gfs", "worker-routes.json"), "utf8")
);
const { zone_id: zoneId, legacy_worker: legacyWorker, routes } = spec;

async function cf(method, path, body) {
  const res = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    method,
    headers: {
      authorization: `Bearer ${token}`,
      ...(body ? { "content-type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(15_000),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(
      `Cloudflare ${method} ${path} failed (${res.status}): ${JSON.stringify(data.errors)}`
    );
  }
  return data.result;
}

const existing = await cf("GET", `/zones/${zoneId}/workers/routes`);
const byPattern = new Map(existing.map((r) => [r.pattern, r]));

const toCreate = [];
const alreadyPresent = [];
const conflicts = [];

for (const route of routes) {
  const hit = byPattern.get(route.pattern);
  if (!hit) {
    toCreate.push(route);
  } else if (hit.script === legacyWorker) {
    alreadyPresent.push({ pattern: route.pattern, id: hit.id });
  } else {
    conflicts.push({
      pattern: route.pattern,
      existing_script: hit.script,
      expected_script: legacyWorker,
      id: hit.id,
    });
  }
}

assert.equal(
  conflicts.length,
  0,
  `Conflicting existing routes found: ${JSON.stringify(conflicts)}`
);

const created = [];
if (apply) {
  for (const route of toCreate) {
    const res = await cf("POST", `/zones/${zoneId}/workers/routes`, {
      pattern: route.pattern,
      script: legacyWorker,
    });
    created.push({ pattern: route.pattern, id: res.id });
  }
}

console.log(
  JSON.stringify(
    {
      mode: apply ? "apply" : "dry-run",
      zone_id: zoneId,
      legacy_worker: legacyWorker,
      total_spec_routes: routes.length,
      already_present: alreadyPresent.length,
      pending_create: apply ? 0 : toCreate.length,
      created: created.length,
    },
    null,
    2
  )
);
