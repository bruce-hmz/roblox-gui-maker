#!/usr/bin/env node
// Deterministic exporter: converts the Next.js production build (.next/) into
// a ready-to-import GeFeiSites (GFS) hybrid bundle under gfs/.
//
// Hybrid architecture (same-origin zero-regression):
// - GFS serves 111+ SEO/marketing/guide/template/homepage URLs directly (full
//   GFS ops: Web.Cafe dashboard, A/B experiments, MCP editing, PVUV + crawler
//   reporting, publish gates, 1-click cutover/rollback).
// - Legacy `roblox-gui-maker` OpenNext Worker remains live behind more-specific
//   Cloudflare Zone Worker Routes for /api/*, /editor*, /pro/*, /_next/*,
//   the 5 interactive creator tools, /pricing*, /avatar*, /kits/*, and static
//   public assets.
// - Legacy indexable routes are also mirrored as lightweight SSR page records
//   in gfs/pages.json so GFS's dead_link check passes with 0 errors and GFS's
//   generated /sitemap.xml retains 100% of canonical URLs.

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Script } from "node:vm";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const NEXT_APP_DIR = join(ROOT, ".next", "server", "app");
const NEXT_CHUNKS_DIR = join(ROOT, ".next", "static", "chunks");
const OUT_DIR = join(ROOT, "gfs");
const ORIGIN = "https://robloxguimaker.app";

const checkOnly = process.argv.includes("--check");
assert(
  process.argv.slice(2).every((arg) => arg === "--check"),
  "Usage: node scripts/export-gfs.mjs [--check]"
);

// Interactive app / tool / checkout routes served by legacy `roblox-gui-maker`
// Worker via Cloudflare Zone Worker Routes (intercepted before GFS).
const LEGACY_PAGE_PREFIXES = [
  "/editor",
  "/roblox-shirt-tester",
  "/zh/roblox-shirt-tester",
  "/roblox-shirt-template-maker",
  "/zh/roblox-shirt-template-maker",
  "/roblox-thumbnail-maker",
  "/zh/roblox-thumbnail-maker",
  "/roblox-ui-sizer",
  "/zh/roblox-ui-sizer",
  "/gamepass-icon-maker",
  "/zh/gamepass-icon-maker",
  "/pricing",
  "/zh/pricing",
  "/avatar",
  "/zh/avatar",
];

function isLegacyServedPage(path) {
  if (path.startsWith("/kits/")) return true; // EN /kits/[slug] has KitProDownloadCard
  return LEGACY_PAGE_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  );
}

const LEGACY_WORKER_ROUTES = [
  { pattern: "robloxguimaker.app/api/*", purpose: "GLM AI generation, Stripe checkout/verify, Pro .rbxmx/kit bundles, Roblox thumbnail proxy" },
  { pattern: "robloxguimaker.app/_next/*", purpose: "Next.js client chunks, media fonts (.woff2/.woff), and legacy page styles" },
  { pattern: "robloxguimaker.app/editor*", purpose: "Interactive React visual Roblox GUI builder" },
  { pattern: "robloxguimaker.app/pro/*", purpose: "Stripe Checkout post-payment session verifier (/pro/success)" },
  { pattern: "robloxguimaker.app/roblox-shirt-tester*", purpose: "3D R6 interactive shirt tester (EN)" },
  { pattern: "robloxguimaker.app/zh/roblox-shirt-tester*", purpose: "3D R6 interactive shirt tester (ZH)" },
  { pattern: "robloxguimaker.app/roblox-shirt-template-maker*", purpose: "585x559 interactive shirt template maker (EN)" },
  { pattern: "robloxguimaker.app/zh/roblox-shirt-template-maker*", purpose: "585x559 interactive shirt template maker (ZH)" },
  { pattern: "robloxguimaker.app/roblox-thumbnail-maker*", purpose: "1920x1080 interactive thumbnail maker (EN)" },
  { pattern: "robloxguimaker.app/zh/roblox-thumbnail-maker*", purpose: "1920x1080 interactive thumbnail maker (ZH)" },
  { pattern: "robloxguimaker.app/roblox-ui-sizer*", purpose: "UDim2 UI sizer & Asset ID previewer (EN)" },
  { pattern: "robloxguimaker.app/zh/roblox-ui-sizer*", purpose: "UDim2 UI sizer & Asset ID previewer (ZH)" },
  { pattern: "robloxguimaker.app/gamepass-icon-maker*", purpose: "Gamepass icon maker (EN)" },
  { pattern: "robloxguimaker.app/zh/gamepass-icon-maker*", purpose: "Gamepass icon maker (ZH)" },
  { pattern: "robloxguimaker.app/pricing*", purpose: "Interactive Stripe Studio Pro pricing cards (EN)" },
  { pattern: "robloxguimaker.app/zh/pricing*", purpose: "Interactive Stripe Studio Pro pricing cards (ZH)" },
  { pattern: "robloxguimaker.app/avatar*", purpose: "Interactive Avatar gallery & Roblox thumbnail lookup (EN, noindex)" },
  { pattern: "robloxguimaker.app/zh/avatar*", purpose: "Interactive Avatar gallery & Roblox thumbnail lookup (ZH, noindex)" },
  { pattern: "robloxguimaker.app/kits/*", purpose: "EN Kit detail pages with interactive KitProDownloadCard" },
  { pattern: "robloxguimaker.app/studio-plugin/RobloxGuiMakerSync.lua*", purpose: "Offline Roblox Studio companion plugin download" },
  { pattern: "robloxguimaker.app/logo.png*", purpose: "Brand logo asset" },
  { pattern: "robloxguimaker.app/favicon.ico*", purpose: "Favicon asset" },
  { pattern: "robloxguimaker.app/icon.png*", purpose: "Icon asset" },
  { pattern: "robloxguimaker.app/apple-icon.png*", purpose: "Apple touch icon asset" },
  { pattern: "robloxguimaker.app/android-chrome-*", purpose: "PWA icon assets" },
  { pattern: "robloxguimaker.app/opengraph-image*", purpose: "Dynamic/static OpenGraph image" },
  { pattern: "robloxguimaker.app/manifest.webmanifest*", purpose: "Web app manifest" },
  { pattern: "robloxguimaker.app/screenshot.png*", purpose: "Product screenshot asset" },
  { pattern: "robloxguimaker.app/gallery/*", purpose: "Gallery static assets" },
];

const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const sha256 = (value) => createHash("sha256").update(value).digest("hex");

function decodeEntities(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16))
    )
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)));
}

async function listFiles(dir) {
  const out = [];
  for (const entry of (await readdir(dir, { withFileTypes: true })).sort((a, b) =>
    a.name.localeCompare(b.name)
  )) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await listFiles(full)));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

function htmlFileToPath(filePath) {
  const rel = relative(NEXT_APP_DIR, filePath).replaceAll("\\", "/");
  if (rel === "index.html") return "/";
  const stripped = rel.replace(/\/index\.html$/, "").replace(/\.html$/, "");
  return `/${stripped}`;
}

function extractHeadMeta(headHtml, pagePath) {
  const titleMatch = /<title>([\s\S]*?)<\/title>/i.exec(headHtml);
  assert(titleMatch && titleMatch[1].trim(), `${pagePath}: missing <title>`);
  const title = decodeEntities(titleMatch[1].trim());

  const descMatch =
    /<meta\b[^>]*\bname=["']description["'][^>]*\bcontent=(["'])([\s\S]*?)\1[^>]*>/i.exec(
      headHtml
    ) ||
    /<meta\b[^>]*\bcontent=(["'])([\s\S]*?)\1[^>]*\bname=["']description["'][^>]*>/i.exec(
      headHtml
    );
  assert(descMatch && descMatch[2].trim(), `${pagePath}: missing meta description`);
  const description = decodeEntities(descMatch[2].trim());

  const robotsMatch =
    /<meta\b[^>]*\bname=["']robots["'][^>]*\bcontent=(["'])([\s\S]*?)\1[^>]*>/i.exec(
      headHtml
    ) ||
    /<meta\b[^>]*\bcontent=(["'])([\s\S]*?)\1[^>]*\bname=["']robots["'][^>]*>/i.exec(
      headHtml
    );
  const noindex = robotsMatch ? /\bnoindex\b/i.test(robotsMatch[2]) : false;

  // Preserve hreflang alternates and site icon/manifest links for head_extra.
  const keptLinks = [];
  for (const m of headHtml.matchAll(/<link\b[^>]*>/gi)) {
    const tag = m[0];
    if (
      /\brel=["']alternate["']/i.test(tag) &&
      /\bhreflang=/i.test(tag)
    ) {
      keptLinks.push(tag.replace(/\bhrefLang=/g, "hreflang="));
    } else if (
      /\brel=["'](?:icon|shortcut icon|apple-touch-icon|manifest)["']/i.test(tag)
    ) {
      keptLinks.push(tag);
    }
  }
  return { title, description, noindex, headExtra: keptLinks.join("\n") };
}

function cleanBodyHtml(rawBody, pagePath) {
  // Remove all <script> tags EXCEPT application/ld+json structured data.
  let body = rawBody.replace(
    /<script\b([^>]*)>([\s\S]*?)<\/script>/gi,
    (full, attrs, inner) => {
      if (/\btype=["']application\/ld\+json["']/i.test(attrs)) {
        // Validate JSON-LD cleanly before keeping.
        JSON.parse(inner);
        return full;
      }
      return "";
    }
  );
  // Remove Next.js hidden streaming templates, route announcer, and inline link preloads.
  body = body
    .replace(/<template\b[^>]*>[\s\S]*?<\/template>/gi, "")
    .replace(/<next-route-announcer[\s\S]*?<\/next-route-announcer>/gi, "")
    .replace(/<link\b[^>]*\brel=["'](?:preload|stylesheet)["'][^>]*>/gi, "")
    .replace(/<!--\$-->|<!--\/\$-->|<!-- -->/g, "")
    .trim();

  // On /studio-plugin and /zh/studio-plugin, convert the .lua download anchor
  // into a progressive button handled by theme/script.js so GFS's dead_link
  // gate does not reject the non-page .lua file link.
  if (pagePath === "/studio-plugin" || pagePath === "/zh/studio-plugin") {
    body = body.replace(
      /<a\b([^>]*)\bhref="\/studio-plugin\/RobloxGuiMakerSync\.lua"([^>]*)>([\s\S]*?)<\/a>/gi,
      (_full, before, after, label) => {
        const attrs = `${before} ${after}`
          .replace(/\bdownload=(?:"[^"]*"|'[^']*')/gi, "")
          .replace(/\s+/g, " ")
          .trim();
        return `<button type="button" data-download-url="/studio-plugin/RobloxGuiMakerSync.lua" data-download-name="RobloxGuiMakerSync.lua" ${attrs}>${label}</button>`;
      }
    );
  }

  assert(
    !/<script\b(?![^>]*\btype=["']application\/ld\+json["'])/i.test(body),
    `${pagePath}: non-JSON-LD script remained in exported body`
  );
  assert(
    !/gefei\s*-?\s*sites/i.test(body),
    `${pagePath}: engine name leaked into page body`
  );
  const h1Count = (body.match(/<h1\b/gi) || []).length;
  assert.equal(h1Count, 1, `${pagePath}: expected exactly 1 <h1>, found ${h1Count}`);
  return body;
}

// 1. Export compiled CSS (single Tailwind + Fontsource bundle)
const chunkFiles = await listFiles(NEXT_CHUNKS_DIR);
const cssFiles = chunkFiles.filter((f) => f.endsWith(".css"));
assert.equal(
  cssFiles.length,
  1,
  `Expected 1 compiled CSS chunk in .next/static/chunks, found ${cssFiles.length}. Run \`npm run build\` first.`
);
const rawCss = await readFile(cssFiles[0], "utf8");
assert(!rawCss.includes("{{"), "Compiled CSS contains GFS template delimiter {{");
const styleCss = rawCss.replaceAll("url(../media/", "url(/_next/static/media/");
assert(
  Buffer.byteLength(styleCss, "utf8") < 300_000,
  "Compiled CSS exceeds GFS 300KB theme limit"
);

// 2. Build shared GFS HTML templates + interactive enhancement script
const pageTemplate = `<!DOCTYPE html>
<html lang="{{ content.lang | default 'en' }}" class="h-full antialiased">
<head>
{{@head}}
{{{ content.head_extra }}}
</head>
<body class="min-h-full">
{{{ content.body_html }}}
{{@body_end}}
</body>
</html>
`;

const notFoundSource = await readFile(join(NEXT_APP_DIR, "_not-found.html"), "utf8");
const notFoundBodyMatch = /<body[^>]*>([\s\S]*)<\/body>/i.exec(notFoundSource);
assert(notFoundBodyMatch, "_not-found.html: missing <body>");
const notFoundBody = notFoundBodyMatch[1]
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
  .replace(/<template\b[^>]*>[\s\S]*?<\/template>/gi, "")
  .replace(/<link\b[^>]*\brel=["'](?:preload|stylesheet)["'][^>]*>/gi, "")
  .replace(/<!--\$-->|<!--\/\$-->|<!-- -->/g, "")
  .trim();
assert(!notFoundBody.includes("{{"), "_not-found.html body contains {{");

const notFoundTemplate = `<!DOCTYPE html>
<html lang="en" class="h-full antialiased">
<head>
{{@head}}
</head>
<body class="min-h-full">
${notFoundBody}
{{@body_end}}
</body>
</html>
`;

const themeScript = `(function () {
  "use strict";

  var AI_HANDOFF_KEY = "rgm:ai-handoff:v1";
  var PRO_STORAGE_KEY = "rgm:pro-pass:v1";

  function track(name, params) {
    try {
      if (typeof window.gtag === "function") {
        window.gtag("event", name, params);
      }
    } catch (_) {}
    try {
      if (typeof window.pvuv === "function") {
        var clean = {};
        var has = false;
        if (params) {
          Object.keys(params).forEach(function (k) {
            if (params[k] !== undefined) {
              clean[k] = params[k];
              has = true;
            }
          });
        }
        window.pvuv("event", name, has ? clean : undefined);
      }
    } catch (_) {}
  }

  function readProToken() {
    try {
      var raw = window.localStorage.getItem(PRO_STORAGE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      return parsed && typeof parsed.token === "string" && parsed.token ? parsed.token : null;
    } catch (_) {
      return null;
    }
  }

  // 1. Progressive download buttons (e.g. /studio-plugin RobloxGuiMakerSync.lua)
  document.addEventListener("click", function (ev) {
    var btn = ev.target && ev.target.closest ? ev.target.closest("[data-download-url]") : null;
    if (!btn) return;
    var href = btn.getAttribute("data-download-url");
    if (!href) return;
    var name = btn.getAttribute("data-download-name") || "";
    var a = document.createElement("a");
    a.href = href;
    if (name) a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    track("studio_plugin_download", { file: name || href });
  });

  // 2. Homepage PromptBox (/ and /zh) -> POST /api/generate-gui -> /editor?generated=1
  function initPromptBox() {
    var textarea = document.querySelector('textarea[data-editor-shortcuts="ignore"]');
    if (!textarea) return;
    var form = textarea.closest("form");
    if (!form) return;
    var wrapper = form.parentElement;
    var submitBtn = form.querySelector('button[type="submit"]');
    if (!submitBtn) return;

    var zh = document.documentElement.lang === "zh" || window.location.pathname.indexOf("/zh") === 0;
    var copy = zh
      ? {
          submit: "生成 GUI",
          submitting: "正在生成你的 GUI…",
          fallbackLabel: "从模板开始",
          fallbackHref: "/zh/templates",
          upgradeLabel: "升级 Pro 解锁 10× AI 配额 + .rbxmx →",
          upgradeHref: "/zh/pricing",
          errors: {
            invalid_prompt: "请用一两句话描述你想要的界面（最多 600 字符）。",
            rate_limited: "已达当前免费生成次数上限，稍后再试。",
            budget_exhausted: "今日 AI 生成已暂停，模板和编辑器仍然免费可用。",
            ai_unavailable: "AI 生成暂时不可用，稍后再试 —— 或从模板开始。",
            generation_failed: "这次生成没成功，换个说法试试 —— 或从模板开始。",
            network: "网络出错了，请检查连接后重试。",
          },
        }
      : {
          submit: "Generate GUI",
          submitting: "Building your GUI…",
          fallbackLabel: "Start from a template",
          fallbackHref: "/templates",
          upgradeLabel: "Unlock 10× AI Quota + .rbxmx →",
          upgradeHref: "/pricing",
          errors: {
            invalid_prompt: "Describe your GUI in a sentence or two (max 600 characters).",
            rate_limited: "You've hit the free generation limit for now — try again soon.",
            budget_exhausted: "AI generation is paused for today. Templates and the editor stay free.",
            ai_unavailable: "AI generation is temporarily unavailable. Try again in a moment — or start from a template.",
            generation_failed: "That one didn't work. Try rewording it — or start from a template.",
            network: "Network error. Check your connection and try again.",
          },
        };

    try {
      window.sessionStorage.removeItem(AI_HANDOFF_KEY);
    } catch (_) {}

    var loading = false;
    var errorEl = null;

    function syncButton() {
      submitBtn.disabled = loading || textarea.value.trim().length === 0;
      submitBtn.textContent = loading ? copy.submitting : copy.submit;
      textarea.disabled = loading;
    }

    function clearError() {
      if (errorEl) {
        errorEl.remove();
        errorEl = null;
      }
    }

    function showError(reason, upgradeSuggested) {
      clearError();
      errorEl = document.createElement("div");
      errorEl.setAttribute("role", "alert");
      errorEl.className = "mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-danger";

      var span = document.createElement("span");
      span.textContent = (copy.errors[reason] || copy.errors.generation_failed) + " ";
      var fallback = document.createElement("a");
      fallback.href = copy.fallbackHref;
      fallback.className = "underline underline-offset-2";
      fallback.textContent = copy.fallbackLabel;
      span.appendChild(fallback);
      errorEl.appendChild(span);

      if (upgradeSuggested) {
        var upgrade = document.createElement("a");
        upgrade.href = copy.upgradeHref;
        upgrade.className = "rounded-md border border-focus/60 bg-raised px-3 py-1 text-xs font-semibold text-ink transition hover:border-focus hover:bg-raised-hi";
        upgrade.textContent = copy.upgradeLabel;
        errorEl.appendChild(upgrade);
      }

      if (wrapper) wrapper.appendChild(errorEl);
    }

    function runSubmit() {
      var trimmed = textarea.value.trim();
      if (!trimmed || loading) return;
      clearError();
      loading = true;
      syncButton();
      var locale = zh ? "zh" : "en";
      track("ai_prompt_submit", { promptLength: trimmed.length, locale: locale });

      var headers = { "Content-Type": "application/json" };
      var proToken = readProToken();
      if (proToken) headers["x-pro-token"] = proToken;

      fetch("/api/generate-gui", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ prompt: trimmed, locale: locale }),
      })
        .then(function (res) {
          return res
            .json()
            .catch(function () { return null; })
            .then(function (data) { return { res: res, data: data }; });
        })
        .then(function (out) {
          var res = out.res;
          var data = out.data;
          if (!res.ok || !data || !data.scene || !data.meta) {
            var reason = (data && data.error) || "network";
            track("ai_generate_failure", { reason: reason });
            showError(reason, res.status === 429 || Boolean(data && data.upgradeSuggested));
            loading = false;
            syncButton();
            return;
          }
          track("ai_generate_success", {
            screenType: data.meta.screenType,
            fallbackUsed: data.meta.fallbackUsed === "template",
            latencyMs: data.meta.latencyMs,
          });
          if (data.meta.fallbackUsed === "template") {
            track("ai_generate_fallback", { screenType: data.meta.screenType });
          }
          try {
            window.sessionStorage.setItem(
              AI_HANDOFF_KEY,
              JSON.stringify({ prompt: trimmed, scene: data.scene, meta: data.meta, locale: locale })
            );
          } catch (_) {}
          window.location.href = "/editor?generated=1";
        })
        .catch(function () {
          track("ai_generate_failure", { reason: "network" });
          showError("network", false);
          loading = false;
          syncButton();
        });
    }

    textarea.addEventListener("input", syncButton);
    textarea.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter" && !ev.shiftKey) {
        ev.preventDefault();
        runSubmit();
      }
    });
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      runSubmit();
    });

    if (wrapper) {
      var chips = wrapper.querySelectorAll('button[type="button"]');
      chips.forEach(function (chip) {
        chip.addEventListener("click", function () {
          if (loading) return;
          textarea.value = chip.textContent || "";
          clearError();
          syncButton();
          textarea.focus();
        });
      });
    }
    syncButton();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPromptBox, { once: true });
  } else {
    initPromptBox();
  }
})();
`;
new Script(themeScript, { filename: "gfs/theme/script.js" });
assert(!themeScript.includes("{{"), "theme/script.js contains GFS delimiter {{");

// 3. Export all prerendered HTML pages + /editor shell
const allHtmlFiles = (await listFiles(NEXT_APP_DIR)).filter((f) =>
  f.endsWith(".html")
);

const pages = [];
const gfsNativePaths = [];
const legacyMirroredPaths = [];

for (const file of allHtmlFiles) {
  const path = htmlFileToPath(file);
  if (
    path === "/_global-error" ||
    path === "/_not-found" ||
    path === "/pro/success"
  ) {
    continue;
  }

  const raw = await readFile(file, "utf8");
  const headMatch = /<head[^>]*>([\s\S]*?)<\/head>/i.exec(raw);
  const bodyMatch = /<body[^>]*>([\s\S]*?)<\/body>/i.exec(raw);
  assert(headMatch && bodyMatch, `${path}: missing <head> or <body>`);

  const { title, description, noindex, headExtra } = extractHeadMeta(
    headMatch[1],
    path
  );
  const lang = path === "/zh" || path.startsWith("/zh/") ? "zh" : "en";
  const bodyHtml = cleanBodyHtml(bodyMatch[1], path);
  const content = {
    lang,
    head_extra: headExtra,
    body_html: bodyHtml,
  };
  assert(
    Buffer.byteLength(JSON.stringify(content), "utf8") < 480_000,
    `${path}: content JSON approaches GFS 500KB limit`
  );

  const kind = ["/privacy", "/terms", "/trust"].includes(path)
    ? "legal"
    : "page";

  pages.push({
    path,
    kind,
    title,
    description,
    template: "page.html",
    content,
    noindex,
    status: "ready",
  });

  if (isLegacyServedPage(path)) legacyMirroredPaths.push(path);
  else gfsNativePaths.push(path);
}

// Mirror /editor (dynamic route in Next.js, served by legacy Worker in prod) so
// GFS internal links to /editor pass dead_link and /sitemap.xml includes /editor.
pages.push({
  path: "/editor",
  kind: "page",
  title: "Roblox GUI Editor — Visual Drag & Drop Builder | Roblox GUI Maker",
  description:
    "Build Roblox ScreenGui interfaces visually with Frame, TextLabel, TextButton, and real Roblox layout constraints, then export clean Luau or Studio JSON.",
  template: "page.html",
  content: {
    lang: "en",
    head_extra: "",
    body_html: `<main class="max-w-3xl mx-auto px-6 py-16">
  <h1 class="text-3xl font-bold mb-4">Roblox GUI Editor</h1>
  <p class="text-ink-dim mb-6">Launch the interactive visual Roblox GUI builder to drag, drop, preview, and export clean Luau for Roblox Studio.</p>
  <p><a href="/" class="text-focus underline">Back to Roblox GUI Maker</a> · <a href="/templates" class="text-focus underline">Browse Templates</a></p>
</main>`,
  },
  noindex: false,
  status: "ready",
});
legacyMirroredPaths.push("/editor");

pages.sort((a, b) => a.path.localeCompare(b.path));
gfsNativePaths.sort();
legacyMirroredPaths.sort();

// Verify zero internal dead links across all exported GFS pages (mirroring GFS checks.ts)
const pageSet = new Set(pages.map((p) => p.path));
const deadLinks = [];
for (const page of pages) {
  for (const m of page.content.body_html.matchAll(/(?<![A-Za-z0-9_-])href="([^"]+)"/gi)) {
    const rawHref = m[1];
    let target = null;
    if (rawHref.startsWith("/") && !rawHref.startsWith("//")) target = rawHref;
    else if (rawHref.startsWith(ORIGIN)) target = rawHref.slice(ORIGIN.length) || "/";
    if (target === null) continue;
    const cleanTarget = target.split("#")[0].split("?")[0];
    if (/^\/(_s|_a)\//.test(cleanTarget) || /\.(xml|txt)$/.test(cleanTarget)) {
      continue;
    }
    const norm = cleanTarget === "/" ? "/" : cleanTarget.replace(/\/+$/, "");
    if (!pageSet.has(norm)) {
      deadLinks.push({ from: page.path, href: rawHref, resolved: norm });
    }
  }
}
assert.equal(
  deadLinks.length,
  0,
  `Dead internal links would fail GFS publish gate: ${JSON.stringify(deadLinks.slice(0, 10))}`
);

const redirects = [
  { from: "/index.html", to: "/", status: 301 },
  { from: "/index", to: "/", status: 301 },
];

const gaHeadHtml = `<script async src="https://www.googletagmanager.com/gtag/js?id=G-BWJ7NSR55P"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-BWJ7NSR55P');</script>`;

const siteSettings = {
  domain: "robloxguimaker.app",
  name: "Roblox GUI Maker",
  type: "tool",
  locale: "en",
  settings: {
    pvuv_site: "3QGneU7d",
    og_image: `${ORIGIN}/opengraph-image`,
    favicon: `${ORIGIN}/favicon.ico`,
    head_html: gaHeadHtml,
    trailing_slash: false,
    www: false,
  },
};

const files = {
  "theme/page.html": pageTemplate,
  "theme/404.html": notFoundTemplate,
  "theme/style.css": `${styleCss}\n`,
  "theme/script.js": themeScript,
  "pages.json": json(pages),
  "redirects.json": json(redirects),
  "site-settings.json": json(siteSettings),
  "worker-routes.json": json({
    account_id: "81bd3096d693d39b65e49832c357c315",
    zone_id: "c73c81c027d7bf9cd5970bc7752b83cb",
    legacy_worker: "roblox-gui-maker",
    gfs_worker: "gefeisites",
    routes: LEGACY_WORKER_ROUTES,
  }),
};

const manifest = {
  version: 1,
  domain: "robloxguimaker.app",
  architecture: "hybrid-same-origin",
  export_command: "npm run build && node scripts/export-gfs.mjs",
  check_command: "node scripts/export-gfs.mjs --check",
  counts: {
    total_pages: pages.length,
    indexable_pages: pages.filter((p) => !p.noindex).length,
    noindex_pages: pages.filter((p) => p.noindex).length,
    gfs_native_pages: gfsNativePaths.length,
    legacy_mirrored_pages: legacyMirroredPaths.length,
    legacy_worker_routes: LEGACY_WORKER_ROUTES.length,
    dead_links: deadLinks.length,
  },
  css_source: relative(ROOT, cssFiles[0]).replaceAll("\\", "/"),
  gfs_native_paths: gfsNativePaths,
  legacy_mirrored_paths: legacyMirroredPaths,
  files: Object.entries(files).map(([file, content]) => ({
    file: `gfs/${file}`,
    bytes: Buffer.byteLength(content, "utf8"),
    sha256: sha256(content),
  })),
};
files["manifest.json"] = json(manifest);

if (checkOnly) {
  for (const [file, expected] of Object.entries(files)) {
    const actual = await readFile(join(OUT_DIR, file), "utf8");
    assert.equal(actual, expected, `Generated file differs: gfs/${file}`);
  }
} else {
  await mkdir(join(OUT_DIR, "theme"), { recursive: true });
  for (const [file, content] of Object.entries(files)) {
    await writeFile(join(OUT_DIR, file), content, "utf8");
  }
}

console.log(
  json({
    mode: checkOnly ? "check" : "export",
    status: "passed",
    ...manifest.counts,
    style_css_bytes: Buffer.byteLength(files["theme/style.css"], "utf8"),
    script_js_bytes: Buffer.byteLength(files["theme/script.js"], "utf8"),
  }).trim()
);
