import type { MetadataRoute } from "next";
import { execSync } from "node:child_process";
import { TEMPLATES } from "./editor/templates";
import { GUIDES } from "./guides/guides-data";
import { USE_CASES } from "./for/usecases";
import { KITS } from "./editor/kits";

const BASE = "https://robloxguimaker.app";

// Honest last-modified date, read from git history at build time. Git is the
// source of truth for "when did this content actually change" — unlike file
// mtime, which resets to the checkout time on every deploy and would fake
// freshness (a signal Google explicitly warns against). Falls back to a fixed
// date only if git is unavailable at build time (e.g. a deploy that strips .git).
const GIT_FALLBACK_DATE = new Date("2026-06-23T00:00:00Z");

const gitDateCache = new Map<string, Date>();

function gitLastModifiedFile(file: string): Date {
  const cached = gitDateCache.get(file);
  if (cached) return cached;
  try {
    const out = execSync(`git log -1 --format=%cI -- ${file}`, {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
    const date = out ? new Date(out) : GIT_FALLBACK_DATE;
    const resolved = isNaN(date.getTime()) ? GIT_FALLBACK_DATE : date;
    gitDateCache.set(file, resolved);
    return resolved;
  } catch {
    // git unavailable (e.g. stripped from a deploy image): keep the build
    // resilient rather than fail. The fallback is a deliberate, honest floor.
    return GIT_FALLBACK_DATE;
  }
}

// Latest commit across one or more source files — use the max so a route that
// renders several data sources reflects the most recent of them.
function lastModified(...files: string[]): Date {
  return new Date(Math.max(...files.map((f) => gitLastModifiedFile(f).getTime())));
}

// zh alternate is declared only where a translated route actually resolves —
// home, templates, guides, for, kits, showcase, about and their detail pages
// (all under app/zh/*). /editor is English-only, so it correctly has no zh.
// x-default falls back to the default-language (en) URL for visitors whose
// locale matches neither en nor zh.
function entry(
  path: string,
  opts: { files: string[]; zh?: string }
): MetadataRoute.Sitemap[number] {
  const url = `${BASE}${path}`;
  return {
    url,
    lastModified: lastModified(...opts.files),
    ...(opts.zh
      ? {
          alternates: {
            languages: { "x-default": url, en: url, zh: `${BASE}${opts.zh}` },
          },
        }
      : {}),
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const fixed = [
    entry("", {
      files: [
        "app/page.tsx",
        "app/editor/templates.ts",
        "app/editor/kits.ts",
        "app/for/usecases.ts",
      ],
      zh: "/zh",
    }),
    entry("/editor", { files: ["app/editor/page.tsx"] }),
    entry("/templates", {
      files: ["app/editor/templates.ts", "app/templates/page.tsx"],
      zh: "/zh/templates",
    }),
    entry("/kits", {
      files: ["app/editor/kits.ts", "app/kits/page.tsx"],
      zh: "/zh/kits",
    }),
    entry("/showcase", { files: ["app/showcase/page.tsx"], zh: "/zh/showcase" }),
    entry("/guides", {
      files: ["app/guides/guides-data.ts", "app/guides/page.tsx"],
      zh: "/zh/guides",
    }),
    entry("/for", {
      files: ["app/for/usecases.ts", "app/for/page.tsx"],
      zh: "/zh/for",
    }),
    entry("/about", { files: ["app/about/page.tsx"], zh: "/zh/about" }),
    entry("/avatar", {
      files: ["app/avatar/data.ts", "app/avatar/page.tsx"],
      zh: "/zh/avatar",
    }),
    // Legal / trust pages are English-only for now — no /zh routes exist, so
    // no zh alternate is declared (avoids the soft-404 hreflang leak).
    entry("/privacy", { files: ["app/privacy/page.tsx"] }),
    entry("/terms", { files: ["app/terms/page.tsx"] }),
    entry("/trust", { files: ["app/trust/page.tsx"] }),
  ];
  const templates = TEMPLATES.map((t) =>
    entry(`/templates/${t.slug}`, {
      files: ["app/editor/templates.ts"],
      zh: `/zh/templates/${t.slug}`,
    })
  );
  const guides = GUIDES.map((g) =>
    entry(`/guides/${g.slug}`, {
      files: ["app/guides/guides-data.ts"],
      zh: `/zh/guides/${g.slug}`,
    })
  );
  const usecases = USE_CASES.map((u) =>
    entry(`/for/${u.slug}`, {
      files: ["app/for/usecases.ts"],
      zh: `/zh/for/${u.slug}`,
    })
  );
  const kits = KITS.map((k) =>
    entry(`/kits/${k.slug}`, { files: ["app/editor/kits.ts"], zh: `/zh/kits/${k.slug}` })
  );
  return [...fixed, ...templates, ...guides, ...usecases, ...kits];
}
