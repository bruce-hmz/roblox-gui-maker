import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav } from "../../components/SiteNav";
import { SiteFooter } from "../../components/SiteFooter";
import { GUIDES, getGuide } from "../guides-data";
import { getTemplate, TEMPLATES } from "../../editor/templates";
import { USE_CASES } from "../../for/usecases";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return { title: "Guide not found — Roblox GUI Maker" };
  return {
    title: `${g.title} | Roblox GUI Maker`,
    description: g.description,
    openGraph: {
      title: `${g.title} | Roblox GUI Maker`,
      description: g.description,
      url: `https://robloxguimaker.app/guides/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: g.title,
      description: g.description,
    },
    alternates: { canonical: `/guides/${slug}` },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();
  const tpl = g.relatedTemplate ? getTemplate(g.relatedTemplate) : undefined;
  // Cross-links to other detail pages so a guide isn't a leaf node. Template
  // detail pages reinforce the guide's relevance; use-case pages cover the
  // "which screen type is this for" intent. Both are detail↔detail links,
  // which spread PageRank between the page types Google isn't indexing yet.
  const otherTemplates = TEMPLATES.filter((t) => t.slug !== g.relatedTemplate).slice(0, 3);
  const useCases = g.relatedTemplate
    ? USE_CASES.filter((u) => u.template === g.relatedTemplate)
    : [];

  // FAQ JSON-LD — helps Google/AI surfaces pick up the Q&A.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: g.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://robloxguimaker.app" },
      { "@type": "ListItem", position: 2, name: "Guides", item: "https://robloxguimaker.app/guides" },
      { "@type": "ListItem", position: 3, name: g.title, item: `https://robloxguimaker.app/guides/${slug}` },
    ],
  };

  return (
    <>
      <SiteNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c"),
        }}
      />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <Link
          href="/guides"
          className="text-sm text-ink-mute hover:text-ink mb-4 inline-block"
        >
          ← All guides
        </Link>
        <p className="text-focus text-xs font-semibold uppercase tracking-wider mb-2">
          {g.category}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          {g.title}
        </h1>
        <p className="text-lg text-ink-dim mb-8 leading-relaxed">{g.intro}</p>

        {tpl && (
          <Link
            href={`/editor?template=${tpl.slug}`}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-lg font-semibold bg-primary text-on-primary hover:brightness-110 transition"
          >
            Open the {tpl.title.replace("Roblox ", "").replace(" GUI", "")}{" "}
            template →
          </Link>
        )}

        <div className="flex flex-col gap-8">
          {g.sections.map((s, i) => (
            <section key={i}>
              <h2 className="text-xl font-semibold text-ink mb-3">{s.heading}</h2>
              {s.paragraphs?.map((p, j) => (
                <p key={j} className="text-ink-dim leading-relaxed mb-3">
                  {p}
                </p>
              ))}
              {s.code && (
                <pre className="rounded-lg bg-input border border-line p-4 overflow-x-auto scroll-thin mb-3">
                  <code className="font-mono text-[12.5px] leading-relaxed text-ink-dim">
                    {s.code}
                  </code>
                </pre>
              )}
              {s.tip && (
                <div className="rounded-lg bg-panel border border-line border-l-4 border-l-focus p-3 text-sm text-ink-dim">
                  <span className="font-semibold text-focus">Tip: </span>
                  {s.tip}
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Cross-links to detail pages: keeps guides from being leaf nodes and
            lets PageRank flow to template + use-case detail pages. */}
        {tpl && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-ink mb-3">
              Use this in your game
            </h2>
            <div className="flex flex-col gap-2">
              <Link
                href={`/templates/${tpl.slug}`}
                className="rounded-xl border border-line bg-panel p-4 hover:border-focus transition"
              >
                <p className="text-sm font-semibold text-ink">
                  View the {tpl.title.replace("Roblox ", "").replace(" GUI", "")} template →
                </p>
                <p className="text-xs text-ink-mute mt-1">{tpl.description}</p>
              </Link>
              {useCases.map((u) => (
                <Link
                  key={u.slug}
                  href={`/for/${u.slug}`}
                  className="rounded-xl border border-line bg-panel p-4 hover:border-focus transition"
                >
                  <p className="text-sm font-semibold text-ink">{u.title}</p>
                  <p className="text-xs text-ink-mute mt-1 line-clamp-2">{u.blurb}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {!tpl && otherTemplates.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-ink mb-3">
              Templates to start from
            </h2>
            <div className="flex flex-col gap-2">
              {otherTemplates.map((t) => (
                <Link
                  key={t.slug}
                  href={`/templates/${t.slug}`}
                  className="rounded-xl border border-line bg-panel p-4 hover:border-focus transition"
                >
                  <p className="text-sm font-semibold text-ink">{t.title}</p>
                  <p className="text-xs text-ink-mute mt-1 line-clamp-2">{t.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {g.faq.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-ink mb-4">FAQ</h2>
            <div className="flex flex-col gap-4">
              {g.faq.map((f, i) => (
                <div key={i}>
                  <h3 className="font-semibold text-ink">{f.q}</h3>
                  <p className="text-ink-dim text-sm mt-1">{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {g.relatedGuides && g.relatedGuides.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 text-xl font-semibold text-ink">
              Related guides
            </h2>
            <div className="flex flex-col gap-3">
              {g.relatedGuides.map((link) => (
                <Link
                  key={link.slug}
                  href={`/guides/${link.slug}`}
                  className="rounded-xl border border-line bg-panel px-5 py-4 font-semibold text-ink transition hover:border-focus"
                >
                  {link.title} →
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
