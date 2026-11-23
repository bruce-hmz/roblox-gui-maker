import { describe, expect, it } from "vitest";
import { TEMPLATES } from "../editor/templates";
import { TEMPLATES_ZH } from "../editor/templates.zh";
import { getUseCaseZh } from "../for/usecases.zh";
import { USE_CASES } from "../for/usecases";
import { GUIDES } from "./guides-data";
import { getGuideZh } from "./guides-data.zh";

// Search-snippet overrides (metaTitle / metaDescription) live beside page copy
// that must not change, so guard their limits and their locale.

// GeFeiSites' check measures the HTML-escaped text: & and ' cost 5 characters.
const escapedLength = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").length;

type Override = { kind: "title" | "description"; label: string; text: string };
const overrides: Override[] = [];
const add = (kind: Override["kind"], label: string, text?: string) => {
  if (text) overrides.push({ kind, label, text });
};
for (const g of GUIDES) {
  add("title", `guide ${g.slug}`, g.metaTitle);
  add("description", `guide ${g.slug}`, g.metaDescription);
}
for (const u of USE_CASES) add("description", `use case ${u.slug}`, u.metaDescription);
for (const t of TEMPLATES) add("description", `template ${t.slug}`, t.metaDescription);
for (const t of TEMPLATES_ZH) add("description", `zh template ${t.slug}`, t.metaDescription);

// Ranked pages whose owner chose to keep a longer title (2026-11-23).
const KEEP_AS_IS = new Set(["title guide how-to-use-uilistlayout-in-roblox"]);

describe("search metadata overrides", () => {
  it("has overrides to check", () => {
    expect(overrides.length).toBeGreaterThan(20);
  });

  it.each(overrides.filter((o) => !KEEP_AS_IS.has(`${o.kind} ${o.label}`)))(
    "$kind of $label fits the search snippet",
    ({ kind, text }) => {
      expect(escapedLength(text)).toBeLessThanOrEqual(kind === "title" ? 60 : 160);
    }
  );

  it("never gives a zh guide the English title/description override", () => {
    for (const en of GUIDES) {
      const zh = getGuideZh(en.slug);
      if (!zh) continue;
      if (zh.metaTitle) expect(zh.metaTitle).not.toBe(en.metaTitle);
      if (zh.metaDescription) expect(zh.metaDescription).not.toBe(en.metaDescription);
    }
  });

  it("never gives a zh use case the English description override", () => {
    for (const en of USE_CASES) {
      const zh = getUseCaseZh(en.slug);
      if (zh?.metaDescription) expect(zh.metaDescription).not.toBe(en.metaDescription);
    }
    // admin-panels has an English override and no Chinese one.
    expect(USE_CASES.find((u) => u.slug === "admin-panels")?.metaDescription).toBeTruthy();
    expect(getUseCaseZh("admin-panels")?.metaDescription).toBeUndefined();
  });
});
