import { describe, expect, it } from "vitest";
import { GUIDES, getGuide } from "./guides-data";
import { getGuideZh } from "./guides-data.zh";

const topicSlugs = [
  "roblox-gui-script-generator",
  "how-to-make-a-gui-in-roblox",
  "how-to-use-uilistlayout-in-roblox",
];

const workflowGuideSlugs = [
  "how-to-import-rbxmx-into-roblox-studio",
  "how-to-make-roblox-gamepass-icons",
  "how-to-make-a-roblox-gamepass-shop-gui",
];

// Visible prose words on a guide page (headings, paragraphs, tips, FAQ —
// code blocks excluded). Guards doc-intent guides against thinning back
// into bridge pages.
function proseWordCount(guide: NonNullable<ReturnType<typeof getGuide>>) {
  const parts: string[] = [guide.intro];
  for (const s of guide.sections) {
    parts.push(s.heading, ...(s.paragraphs ?? []));
    if (s.tip) parts.push(s.tip);
  }
  for (const f of guide.faq) parts.push(f.q, f.a);
  return parts.join(" ").split(/\s+/).filter(Boolean).length;
}

describe("core SEO guide topics", () => {
  it("defines every guide slug once", () => {
    expect(new Set(GUIDES.map((guide) => guide.slug)).size).toBe(GUIDES.length);
  });

  it.each(topicSlugs)("provides substantial authored content for %s", (slug) => {
    const guide = getGuide(slug);
    expect(guide).toBeDefined();
    expect(guide?.sections.length).toBeGreaterThanOrEqual(6);
    expect(guide?.faq.length).toBeGreaterThanOrEqual(3);
    expect(guide?.intro.length).toBeGreaterThan(140);
  });

  it("keeps the UIListLayout doc guide at 1200+ prose words", () => {
    // SEO audit 2026-09: this page targets the "roblox uilistlayout" doc
    // keyword family; the content depth is what ranks it, so lock it in.
    const guide = getGuide("how-to-use-uilistlayout-in-roblox");
    expect(proseWordCount(guide!)).toBeGreaterThanOrEqual(1200);
  });

  it("keeps template intent out of duplicate guide routes", () => {
    expect(getGuide("roblox-gui-templates")).toBeUndefined();
  });

  it("links only to existing related guides", () => {
    for (const guide of GUIDES) {
      for (const link of guide.relatedGuides ?? []) {
        expect(
          getGuide(link.slug),
          `${guide.slug} -> ${link.slug}`
        ).toBeDefined();
      }
    }
  });

  it("ensures every guide has substantial sections, FAQs, and ZH parity", () => {
    for (const guide of GUIDES) {
      expect(guide.sections.length, guide.slug).toBeGreaterThanOrEqual(4);
      expect(guide.faq.length, guide.slug).toBeGreaterThanOrEqual(3);
      expect(guide.intro.length, guide.slug).toBeGreaterThan(140);

      const zh = getGuideZh(guide.slug);
      expect(zh, `zh missing for ${guide.slug}`).toBeDefined();
      expect(zh!.sections.length, `zh section count ${guide.slug}`).toBe(
        guide.sections.length
      );
      expect(zh!.faq.length, `zh faq count ${guide.slug}`).toBeGreaterThanOrEqual(
        3
      );
    }
  });

  it.each(workflowGuideSlugs)("includes workflow guide %s", (slug) => {
    const guide = getGuide(slug);
    expect(guide).toBeDefined();
    expect(guide?.faq.length).toBeGreaterThanOrEqual(4);
  });
});
