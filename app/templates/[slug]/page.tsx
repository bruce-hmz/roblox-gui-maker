import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav } from "../../components/SiteNav";
import { SiteFooter } from "../../components/SiteFooter";
import { ScenePreview } from "../../editor/ScenePreview";
import { TEMPLATES, getTemplate } from "../../editor/templates";
import { guidesForTemplate } from "../../guides/guides-data";
import { USE_CASES } from "../../for/usecases";

export function generateStaticParams() {
  return TEMPLATES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = getTemplate(slug);
  if (!t) return { title: "Template not found — Roblox GUI Maker" };
  return {
    title: `${t.title} — Free Template | Roblox GUI Maker`,
    description: t.description,
    openGraph: {
      title: `${t.title} — Free Roblox GUI Template`,
      description: t.description,
      url: `https://robloxguimaker.app/templates/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${t.title} — Free Roblox GUI Template`,
      description: t.description,
    },
    alternates: { canonical: `/templates/${slug}` },
  };
}

export default async function TemplatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = getTemplate(slug);
  if (!t) notFound();
  const related = TEMPLATES.filter((x) => x.slug !== slug).slice(0, 3);
  const guides = guidesForTemplate(slug);
  // Use cases that map to this template (reverse lookup by USE_CASES.template).
  // Adds a detail↔detail cross-link so template and use-case pages reinforce
  // each other's relevance instead of each standing alone.
  const useCases = USE_CASES.filter((u) => u.template === slug);
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://robloxguimaker.app" },
      { "@type": "ListItem", position: 2, name: "Templates", item: "https://robloxguimaker.app/templates" },
      { "@type": "ListItem", position: 3, name: t.title, item: `https://robloxguimaker.app/templates/${slug}` },
    ],
  };

  return (
    <>
      <SiteNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c") }}
      />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <Link
          href="/templates"
          className="text-sm text-ink-mute hover:text-ink mb-4 inline-block"
        >
          ← All templates
        </Link>
        <p className="text-focus text-xs font-semibold uppercase tracking-wider mb-2">
          {t.category}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          {t.title}
        </h1>
        <p className="text-ink-dim mb-6">{t.tagline}</p>

        <div className="rounded-2xl ring-1 ring-line overflow-hidden shadow-2xl shadow-black/40 mb-6">
          <ScenePreview scene={t.scene} />
        </div>

        <div className="flex flex-wrap gap-3 mb-10">
          <Link
            href={`/editor?template=${t.slug}`}
            className="px-5 py-2.5 rounded-lg font-semibold bg-primary text-on-primary hover:brightness-110 transition"
          >
            Open in Editor →
          </Link>
          <Link
            href="/editor"
            className="px-5 py-2.5 rounded-lg font-medium border border-line hover:bg-raised transition"
          >
            Start blank
          </Link>
        </div>

        <div className="space-y-4 text-ink-dim leading-relaxed max-w-2xl">
          <p>{t.description}</p>
          <p>
            This template is built entirely from native Roblox instances and is
            fully editable. Open it in the editor to change colors, text, sizes
            and layout, then export the result as clean Luau — paste it into a{" "}
            <code className="text-focus">LocalScript</code> inside a{" "}
            <code className="text-focus">ScreenGui</code> and it works as-is.
          </p>
        </div>

        {guides.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-3">How to build this</h2>
            {/* Inline the first related guide's intro + first two sections so the
                template page carries self-contained tutorial prose (~600 words)
                instead of only links out. Raises content depth on a page type
                that was otherwise thin (tagline + boilerplate). */}
            {(() => {
              const g = guides[0];
              return (
                <article className="max-w-2xl">
                  <p className="text-ink-dim leading-relaxed mb-4">{g.intro}</p>
                  {g.sections.slice(0, 2).map((s, i) => (
                    <div key={i} className="mb-4">
                      <h3 className="font-semibold text-ink mb-1.5">{s.heading}</h3>
                      {s.paragraphs?.map((p, j) => (
                        <p key={j} className="text-ink-dim leading-relaxed mb-2 text-[15px]">
                          {p}
                        </p>
                      ))}
                      {s.tip && (
                        <p className="text-sm text-ink-mute">
                          <span className="font-semibold text-focus">Tip: </span>
                          {s.tip}
                        </p>
                      )}
                    </div>
                  ))}
                  <Link
                    href={`/guides/${g.slug}`}
                    className="inline-block text-sm text-focus hover:underline font-medium"
                  >
                    Read the full {g.title} guide →
                  </Link>
                </article>
              );
            })()}

            {/* Remaining related guides as links. */}
            {guides.length > 1 && (
              <div className="flex flex-col gap-2 mt-6">
                {guides.slice(1).map((g) => (
                  <Link
                    key={g.slug}
                    href={`/guides/${g.slug}`}
                    className="rounded-xl border border-line bg-panel p-4 hover:border-focus transition"
                  >
                    <p className="text-sm font-semibold text-ink">{g.title}</p>
                    <p className="text-xs text-ink-mute mt-1 line-clamp-2">{g.description}</p>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

        {useCases.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-3">
              Build it for your screen type
            </h2>
            <div className="flex flex-col gap-2">
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

        <h2 className="text-xl font-semibold mt-12 mb-4">More templates</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {related.map((r) => (
            <Link
              key={r.slug}
              href={`/templates/${r.slug}`}
              className="rounded-xl overflow-hidden ring-1 ring-line hover:ring-focus transition"
            >
              <ScenePreview scene={r.scene} />
              <div className="p-3 bg-panel">
                <p className="text-sm font-medium text-ink">
                  {r.title.replace("Roblox ", "").replace(" GUI", "")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
