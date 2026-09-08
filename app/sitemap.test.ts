import { describe, expect, it } from "vitest";
import { TEMPLATES } from "./editor/templates";
import { USE_CASES } from "./for/usecases";
import { GUIDES } from "./guides/guides-data";
import { KITS } from "./editor/kits";
import sitemap from "./sitemap";

const base = "https://robloxguimaker.app";

// Routes that have a live /zh counterpart (declared per entry in sitemap.ts).
const zhPaths = [
  "",
  "/templates",
  ...TEMPLATES.map((t) => `/templates/${t.slug}`),
  "/guides",
  ...GUIDES.map((g) => `/guides/${g.slug}`),
  "/for",
  ...USE_CASES.map((u) => `/for/${u.slug}`),
  "/kits",
  ...KITS.map((k) => `/kits/${k.slug}`),
  "/showcase",
  "/about",
  "/avatar",
  "/avatar/preppy",
  "/avatar/matching",
  "/avatar/cheap",
  "/avatar/y2k",
];

const enOnlyPaths = ["/editor", "/privacy", "/terms", "/trust"];

const sorted = (values: string[]) => [...values].sort();

describe("sitemap", () => {
  it("lists every canonical public page exactly once, en and zh", () => {
    const expectedUrls = sorted([
      ...zhPaths.map((path) => `${base}${path}`),
      ...zhPaths.map((path) => `${base}/zh${path}`),
      ...enOnlyPaths.map((path) => `${base}${path}`),
    ]);
    const urls = sitemap().map((entry) => entry.url);

    expect(sorted(urls)).toEqual(expectedUrls);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("includes a verifiable last-modified date for every page", () => {
    const entries = sitemap();
    expect(entries.length).toBeGreaterThan(0);
    for (const entry of entries) {
      // lastModified is derived from git history (ground truth for when content
      // changed) — never faked, never omitted.
      expect(entry.lastModified).toBeInstanceOf(Date);
      const ms = (entry.lastModified as Date).getTime();
      expect(isNaN(ms)).toBe(false);
      // lastmod must never sit in the future.
      expect(ms).toBeLessThanOrEqual(Date.now());
    }
  });

  it("pairs every zh URL with its en counterpart via hreflang clusters", () => {
    const entries = sitemap();
    const byUrl = new Map(entries.map((entry) => [entry.url, entry]));

    for (const path of zhPaths) {
      const enUrl = `${base}${path}`;
      const zhUrl = `${base}/zh${path}`;
      const en = byUrl.get(enUrl);
      const zh = byUrl.get(zhUrl);
      expect(en, enUrl).toBeDefined();
      expect(zh, zhUrl).toBeDefined();

      // Both entries carry the full cluster; x-default falls back to en.
      for (const entry of [en, zh]) {
        expect(entry?.alternates?.languages?.en).toBe(enUrl);
        expect(entry?.alternates?.languages?.zh).toBe(zhUrl);
        expect(entry?.alternates?.languages?.["x-default"]).toBe(enUrl);
      }
    }

    // English-only routes declare no alternates.
    for (const path of enOnlyPaths) {
      expect(byUrl.get(`${base}${path}`)?.alternates).toBeUndefined();
    }
  });
});
