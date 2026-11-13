#!/usr/bin/env node
// Regenerates app/sitemap-lastmod.ts from git commit timestamps before deploy
// so Cloudflare Workers serve accurate <lastmod> values without runtime git calls.

import { execFileSync } from "node:child_process";
import { statSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const TRACKED_FILES = [
  "app/page.tsx",
  "app/editor/page.tsx",
  "app/editor/templates.ts",
  "app/templates/page.tsx",
  "app/editor/kits.ts",
  "app/kits/page.tsx",
  "app/gamepass-icon-maker/page.tsx",
  "app/editor/gamepass-icons.ts",
  "app/pricing/page.tsx",
  "app/showcase/page.tsx",
  "app/guides/guides-data.ts",
  "app/guides/page.tsx",
  "app/for/usecases.ts",
  "app/for/page.tsx",
  "app/about/page.tsx",
  "app/privacy/page.tsx",
  "app/terms/page.tsx",
  "app/trust/page.tsx",
];

function readGitCommitIso(relativePath) {
  try {
    const stdout = execFileSync(
      "git",
      ["log", "-1", "--format=%cI", "--", relativePath],
      { cwd: repoRoot, stdio: ["ignore", "pipe", "ignore"] }
    )
      .toString()
      .trim();
    if (stdout) {
      const parsed = new Date(stdout);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed.toISOString();
      }
    }
  } catch {
    // Fall through to local file mtime when git is unavailable.
  }
  const fileStat = statSync(resolve(repoRoot, relativePath));
  const clampedMs = Math.min(fileStat.mtimeMs, Date.now());
  return new Date(clampedMs).toISOString();
}

const entries = TRACKED_FILES.map(
  (filePath) => `  ${JSON.stringify(filePath)}: ${JSON.stringify(readGitCommitIso(filePath))},`
);

const outputSource = [
  "// Static build-time sitemap last-modified manifest (ISO 8601 UTC).",
  "// Generated via `node scripts/generate-sitemap-lastmod.mjs` so Cloudflare",
  "// Workers never rely on runtime `child_process.execSync(\"git log ...\")`.",
  "",
  'export const DEFAULT_LASTMOD_ISO = "2026-10-20T00:00:00.000Z";',
  "",
  "export const SITEMAP_LASTMOD_ISO: Record<string, string> = {",
  ...entries,
  "};",
  "",
].join("\n");

const targetFile = resolve(repoRoot, "app/sitemap-lastmod.ts");
writeFileSync(targetFile, outputSource, "utf8");
console.log(`Updated ${targetFile} (${TRACKED_FILES.length} tracked files).`);
