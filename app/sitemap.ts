import type { MetadataRoute } from "next";
import { TEMPLATES } from "./editor/templates";
import { GUIDES } from "./guides/guides-data";
import { USE_CASES } from "./for/usecases";
import { KITS } from "./editor/kits";
import { DEFAULT_LASTMOD_ISO, SITEMAP_LASTMOD_ISO } from "./sitemap-lastmod";

const BASE = "https://robloxguimaker.app";

function fileLastModified(filePath: string): Date {
  const isoString = SITEMAP_LASTMOD_ISO[filePath] ?? DEFAULT_LASTMOD_ISO;
  const parsedDate = new Date(isoString);
  return Number.isNaN(parsedDate.getTime())
    ? new Date(DEFAULT_LASTMOD_ISO)
    : parsedDate;
}

// Latest commit across one or more source files — use the max so a route that
// renders several data sources reflects the most recent of them.
function lastModified(...files: string[]): Date {
  return new Date(
    Math.max(...files.map((filePath) => fileLastModified(filePath).getTime()))
  );
}

// zh alternate is declared only where a translated route actually resolves —
// home, templates, guides, for, kits, gamepass-icon-maker, pricing, showcase,
// about and their detail pages (all under app/zh/*). /editor is English-only.
function entry(
  path: string,
  opts: { files: string[]; zh?: string }
): MetadataRoute.Sitemap {
  const url = `${BASE}${path}`;
  const modified = lastModified(...opts.files);
  if (!opts.zh) return [{ url, lastModified: modified }];
  const zhUrl = `${BASE}${opts.zh}`;
  return [
    {
      url,
      lastModified: modified,
      alternates: { languages: { "x-default": url, en: url, zh: zhUrl } },
    },
    {
      url: zhUrl,
      lastModified: modified,
      alternates: { languages: { "x-default": url, en: url, zh: zhUrl } },
    },
  ];
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
    entry("/gamepass-icon-maker", {
      files: ["app/gamepass-icon-maker/page.tsx", "app/editor/gamepass-icons.ts"],
      zh: "/zh/gamepass-icon-maker",
    }),
    entry("/pricing", {
      files: ["app/pricing/page.tsx"],
      zh: "/zh/pricing",
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
    // Note: /avatar/* consumer outfit pages are intentionally excluded from
    // sitemap and marked noindex so search topical authority stays focused on
    // Roblox creator GUI, Studio .rbxmx kits, and Gamepass icon tooling.
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
    entry(`/kits/${k.slug}`, {
      files: ["app/editor/kits.ts"],
      zh: `/zh/kits/${k.slug}`,
    })
  );
  return [...fixed, ...templates, ...guides, ...usecases, ...kits].flat();
}
