#!/usr/bin/env node
// Automated GFS MCP importer for robloxguimaker.app hybrid migration.
// Reads the locally generated bundle in gfs/ and pushes it to a GeFeiSites
// engine (direct sub-engine or via Main Hub engine with GFS_ENGINE=<name>).
//
// Required env:
//   GFS_MCP_URL         e.g. https://gefeisites.firstdraft-ai-app.workers.dev/mcp
//   GFS_MCP_TOKEN_FILE  path to a file containing the Bearer token (preferred)
//                       or GFS_MCP_TOKEN env var
// Optional env:
//   GFS_ENGINE          sub-engine name when connecting via a Main Hub engine
//   GFS_SKIP_MIGRATE_ASSESS=1  if the site already exists on the engine
//
// Never prints tokens. Never cuts over the live domain (cutover stays manual
// in the GFS admin UI or explicit separate step after preview + checks pass).

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const GFS_DIR = join(ROOT, "gfs");

const mcpUrl = (process.env.GFS_MCP_URL || "").trim();
const tokenFile = (process.env.GFS_MCP_TOKEN_FILE || "").trim();
const engine = (process.env.GFS_ENGINE || "").trim();
const rawToken = tokenFile
  ? (await readFile(tokenFile, "utf8")).trim()
  : (process.env.GFS_MCP_TOKEN || "").trim();

assert(mcpUrl, "Set GFS_MCP_URL (e.g. https://gefeisites.firstdraft-ai-app.workers.dev/mcp)");
assert(rawToken, "Set GFS_MCP_TOKEN_FILE or GFS_MCP_TOKEN");

const sha256 = (value) => createHash("sha256").update(value).digest("hex");
let rpcId = 1;

async function callMcp(name, args = {}) {
  const payload = {
    jsonrpc: "2.0",
    id: rpcId++,
    method: "tools/call",
    params: {
      name,
      arguments: engine ? { engine, ...args } : args,
    },
  };
  const res = await fetch(mcpUrl, {
    method: "POST",
    headers: {
      authorization: `Bearer ${rawToken}`,
      "content-type": "application/json",
      accept: "application/json, text/event-stream",
      "user-agent": "GeFeiSites-MCP-Client/1.0",
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(30_000),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`MCP ${name} HTTP ${res.status}: ${text.slice(0, 300)}`);
  }
  const rpc = JSON.parse(text);
  if (rpc.error) {
    throw new Error(`MCP ${name} RPC error: ${JSON.stringify(rpc.error)}`);
  }
  const result = rpc.result;
  if (result?.isError) {
    const msg = result.content?.map((c) => c.text).join("\n") || JSON.stringify(result);
    throw new Error(`MCP ${name} tool error: ${msg}`);
  }
  const firstText = result?.content?.find((c) => c.type === "text")?.text;
  if (firstText === undefined) return result;
  try {
    return JSON.parse(firstText);
  } catch {
    return firstText;
  }
}

const siteSettings = JSON.parse(await readFile(join(GFS_DIR, "site-settings.json"), "utf8"));
const pages = JSON.parse(await readFile(join(GFS_DIR, "pages.json"), "utf8"));
const redirects = JSON.parse(await readFile(join(GFS_DIR, "redirects.json"), "utf8"));
const themeFiles = ["page.html", "404.html", "style.css", "script.js"];

// 1. Find or create site in migrating mode (never touches live DNS/custom domain)
const listed = await callMcp("list_sites");
const existingList = Array.isArray(listed) ? listed : listed?.sites || [];
let site = existingList.find((s) => s.domain === siteSettings.domain);

if (!site) {
  console.log("Running migration_assess for", siteSettings.domain);
  const assessment = await callMcp("migration_assess", {
    domain: siteSettings.domain,
    answers: {
      code: "repo",
      data: "in_code",
      accounts: false,
      orders: false,
      user_content: false,
      backend: "",
      email: false,
    },
  });
  console.log("migration_assess verdict:", assessment.verdict, "warnings:", assessment.warnings?.length || 0);
  assert.equal(assessment.verdict, "ok", `Unexpected migration_assess verdict: ${JSON.stringify(assessment)}`);

  site = await callMcp("create_site", {
    domain: siteSettings.domain,
    name: siteSettings.name,
    type: siteSettings.type,
    locale: siteSettings.locale,
    brief:
      "Free browser-based Roblox GUI visual builder, templates, Studio Luau guides, and creator tools. Hybrid GFS SEO + legacy interactive Worker architecture.",
    migrate: true,
  });
  console.log("Created migrating GFS site:", site.id, site.domain);
} else {
  console.log("Reusing existing GFS site:", site.id, site.domain);
}

const siteId = site.id;

// 2. Update site settings (GA4 head_html, trailing_slash=false, www=false)
await callMcp("update_site", {
  site: siteId,
  name: siteSettings.name,
  locale: siteSettings.locale,
  type: siteSettings.type,
  settings: {
    head_html: siteSettings.settings.head_html,
    trailing_slash: siteSettings.settings.trailing_slash,
    www: siteSettings.settings.www,
  },
});
console.log("Updated site settings (GA4 head_html, URL normalization).");

// 3. Upload theme files in full and verify exact SHA-256 readback
for (const filename of themeFiles) {
  const localContent = await readFile(join(GFS_DIR, "theme", filename), "utf8");
  await callMcp("theme_put", {
    site: siteId,
    path: filename,
    content: localContent,
  });
  const remoteRaw = await callMcp("theme_get", { site: siteId, path: filename });
  const remoteContent = typeof remoteRaw === "string" ? remoteRaw : remoteRaw?.content ?? "";
  assert.equal(
    sha256(remoteContent),
    sha256(localContent),
    `Theme readback hash mismatch for ${filename}`
  );
  console.log(`Uploaded & verified theme/${filename} (${Buffer.byteLength(localContent, "utf8")} bytes)`);
}

// 4. Upsert all pages with bounded concurrency (4 in flight)
const CONCURRENCY = 4;
let done = 0;
let cursor = 0;

async function workerLoop() {
  while (cursor < pages.length) {
    const idx = cursor++;
    const p = pages[idx];
    await callMcp("page_upsert", {
      site: siteId,
      path: p.path,
      kind: p.kind,
      title: p.title,
      description: p.description,
      template: p.template,
      content: p.content,
      noindex: p.noindex,
      status: p.status,
    });
    done++;
    if (done % 25 === 0 || done === pages.length) {
      console.log(`Upserted pages: ${done}/${pages.length}`);
    }
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, () => workerLoop()));

// 5. Upsert redirects
await callMcp("redirect_put", {
  site: siteId,
  redirects: redirects.map(({ from, to }) => ({ from, to })),
});
console.log(`Upserted ${redirects.length} redirects.`);

// 6. Run GFS publish gate check
const checkResult = await callMcp("check", { site: siteId });
console.log("GFS check result summary:", JSON.stringify({
  site_id: siteId,
  errors: checkResult?.errors?.length ?? checkResult?.findings?.filter?.((f) => f.level === "error")?.length,
  warnings: checkResult?.warnings?.length ?? checkResult?.findings?.filter?.((f) => f.level === "warn")?.length,
  sample_errors: (checkResult?.errors || checkResult?.findings?.filter?.((f) => f.level === "error") || []).slice(0, 5),
}, null, 2));
