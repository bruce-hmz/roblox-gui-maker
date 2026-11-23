#!/usr/bin/env node
// Capture scene thumbnails from the real editor canvas into
// public/gallery/previews/*.webp (see app/editor/preview-images.ts).
//
//   npm run build
//   AI_PROVIDER=mock npm run start -- --hostname 127.0.0.1 --port 3199 &
//   npm run capture:previews -- [--base http://127.0.0.1:3199] [--only <file-stem>]
//
// The scenes to capture are discovered from the editor links the site itself
// renders (/, /templates/<slug>, /kits/<slug>), so a new template, AI example or
// kit screen is picked up automatically. The unit test in
// app/editor/preview-images.test.ts fails while any of them is missing.
//
// PLAYWRIGHT_CHROMIUM_EXECUTABLE=/path/to/chrome overrides the browser binary.

import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "public", "gallery", "previews");

const args = process.argv.slice(2);
const argValue = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const BASE = (argValue("--base") ?? "http://127.0.0.1:3199").replace(/\/$/, "");
const ONLY = argValue("--only");

// Must match PREVIEW_WIDTH / PREVIEW_HEIGHT: 860px desktop frame at 1.5x.
const SCALE = 1.5;
const WEBP_QUALITY = 0.86;

async function html(path) {
  const res = await fetch(BASE + path);
  assert(res.ok, `GET ${path} -> ${res.status}`);
  return res.text();
}

function hrefs(page, pattern) {
  return [...page.matchAll(/href="([^"]+)"/g)]
    .map((m) => m[1].replaceAll("&amp;", "&"))
    .filter((h) => pattern.test(h));
}

async function discoverScenes() {
  const pages = ["/"];
  for (const index of ["/templates", "/kits"]) {
    const slugPattern = new RegExp(`^${index}/[a-z0-9-]+$`);
    pages.push(...new Set(hrefs(await html(index), slugPattern)));
  }
  const scenes = new Map(); // file stem -> editor query
  for (const path of pages) {
    for (const href of hrefs(await html(path), /^\/editor\?(template|example)=/)) {
      const q = new URLSearchParams(href.split("?")[1]);
      const template = q.get("template");
      const theme = q.get("theme");
      const example = q.get("example");
      const stem = template
        ? `template-${template}${theme ? `--${theme}` : ""}`
        : `example-${example}`;
      scenes.set(stem, q.toString());
    }
  }
  return scenes;
}

const scenes = await discoverScenes();
assert(scenes.size > 0, "no editor links found — is the server running?");
const todo = [...scenes].filter(([stem]) => !ONLY || stem === ONLY);
assert(todo.length > 0, `--only ${ONLY} matched nothing`);

await mkdir(OUT_DIR, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined,
});
// Wide enough that the desktop frame reaches its 860px max width.
const context = await browser.newContext({
  viewport: { width: 1720, height: 1100 },
  deviceScaleFactor: SCALE,
});
const converter = await context.newPage();

for (const [stem, query] of todo) {
  const page = await context.newPage();
  await page.goto(`${BASE}/editor?${query}`, { waitUntil: "networkidle" });
  const frame = page.locator(".canvas-grid > div").first();
  await frame.waitFor({ state: "visible" });
  await page.waitForFunction(
    () => document.querySelector(".canvas-grid > div")?.childElementCount > 0
  );
  // Flat edges: the thumbnail <img> applies its own rounded corners and ring.
  await page.addStyleTag({
    content:
      ".canvas-grid > div { border-radius: 0 !important; box-shadow: none !important; }",
  });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  const box = await frame.boundingBox();
  assert(box && Math.round(box.width) === 860, `${stem}: frame is ${box?.width}px wide, expected 860`);
  const png = await frame.screenshot({ type: "png" });
  await page.close();

  const webp = await converter.evaluate(
    async ({ b64, quality }) => {
      const img = new Image();
      img.src = `data:image/png;base64,${b64}`;
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d").drawImage(img, 0, 0);
      return {
        url: canvas.toDataURL("image/webp", quality),
        w: canvas.width,
        h: canvas.height,
      };
    },
    { b64: png.toString("base64"), quality: WEBP_QUALITY }
  );
  assert(webp.url.startsWith("data:image/webp"), `${stem}: browser did not encode WebP`);
  const bytes = Buffer.from(webp.url.split(",")[1], "base64");
  await writeFile(join(OUT_DIR, `${stem}.webp`), bytes);
  console.log(`${stem}.webp  ${webp.w}x${webp.h}  ${(bytes.length / 1024).toFixed(0)} KB`);
}

await browser.close();
