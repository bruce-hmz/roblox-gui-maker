import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav } from "../../components/SiteNav";
import { SiteFooter } from "../../components/SiteFooter";
import { ScenePreview } from "../../editor/ScenePreview";
import { getTemplate } from "../../editor/templates";
import { getGuide } from "../../guides/guides-data";
import { USE_CASES, getUseCase } from "../usecases";

export function generateStaticParams() {
  return USE_CASES.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const u = getUseCase(slug);
  if (!u) return { title: "Use case not found — Roblox GUI Maker" };
  return {
    title: `${u.title} | Roblox GUI Maker`,
    description: u.blurb,
    openGraph: {
      title: `${u.title} | Roblox GUI Maker`,
      description: u.blurb,
      url: `https://robloxguimaker.app/for/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: u.title,
      description: u.blurb,
    },
    alternates: {
      canonical: `/for/${slug}`,
      languages: {
        en: `https://robloxguimaker.app/for/${slug}`,
        zh: `https://robloxguimaker.app/zh/for/${slug}`,
      },
    },
  };
}

export default async function UseCasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const u = getUseCase(slug);
  if (!u) notFound();
  const tpl = u.template ? getTemplate(u.template) : undefined;
  const guide = u.relatedGuide ? getGuide(u.relatedGuide) : undefined;
  const others = USE_CASES.filter((x) => x.slug !== slug).slice(0, 3);

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://robloxguimaker.app" },
      { "@type": "ListItem", position: 2, name: "Use cases", item: "https://robloxguimaker.app/for" },
      { "@type": "ListItem", position: 3, name: u.title, item: `https://robloxguimaker.app/for/${slug}` },
    ],
  };

  return (
    <>
      <SiteNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c") }}
      />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <Link
          href="/for"
          className="text-sm text-ink-mute hover:text-ink mb-4 inline-block"
        >
          ← All use cases
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          {u.title}
        </h1>
        <p className="text-lg text-ink-dim leading-relaxed mb-8">{u.blurb}</p>

        <h2 className="text-xl font-semibold text-ink mb-3">
          What a {u.noun} usually needs
        </h2>
        <ul className="space-y-2 mb-10">
          {u.needs.map((n) => (
            <li key={n} className="flex gap-2.5 text-ink-dim">
              <span className="text-focus mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-focus" />
              <span className="leading-relaxed">{n}</span>
            </li>
          ))}
        </ul>

        {tpl ? (
          <>
            <div className="rounded-2xl ring-1 ring-line overflow-hidden shadow-2xl shadow-black/40 mb-6">
              <ScenePreview scene={tpl.scene} />
            </div>
            <div className="flex flex-wrap gap-3 mb-10">
              <Link
                href={`/editor?template=${tpl.slug}`}
                className="px-5 py-2.5 rounded-lg font-semibold bg-primary text-on-primary hover:brightness-110 transition"
              >
                Open the {tpl.title.replace("Roblox ", "").replace(" GUI", "")} template →
              </Link>
              <Link
                href="/editor"
                className="px-5 py-2.5 rounded-lg font-medium border border-line hover:bg-raised transition"
              >
                Start blank
              </Link>
            </div>
          </>
        ) : (
          <div className="flex flex-wrap gap-3 mb-10">
            <Link
              href="/editor"
              className="px-5 py-2.5 rounded-lg font-semibold bg-primary text-on-primary hover:brightness-110 transition"
            >
              Open the editor →
            </Link>
          </div>
        )}

        <h2 className="text-xl font-semibold text-ink mb-3">
          How to build a {u.noun} in Roblox GUI Maker
        </h2>
        <ol className="space-y-3 mb-10 list-decimal list-inside text-ink-dim leading-relaxed">
          {u.howTo.map((step, i) => (
            <li key={i} className="pl-1">
              {step}
            </li>
          ))}
        </ol>

        <h2 className="text-xl font-semibold text-ink mb-3">
          Key Roblox properties for {u.noun}s
        </h2>
        <div className="flex flex-wrap gap-2 mb-10">
          {u.properties.map((p) => (
            <code
              key={p}
              className="text-xs px-2.5 py-1 rounded-md bg-raised border border-line text-focus font-mono"
            >
              {p}
            </code>
          ))}
        </div>

        <h2 className="text-xl font-semibold text-ink mb-3">
          Tips for a better {u.noun}
        </h2>
        <ul className="space-y-2 mb-10">
          {u.tips.map((t) => (
            <li key={t} className="flex gap-2.5 text-ink-dim">
              <span className="text-focus mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-focus" />
              <span className="leading-relaxed">{t}</span>
            </li>
          ))}
        </ul>

        {guide && (
          <div className="rounded-xl bg-panel border border-line p-5 mb-10">
            <p className="text-xs text-ink-mute uppercase tracking-wider mb-1">
              Related guide
            </p>
            <Link
              href={`/guides/${guide.slug}`}
              className="text-base font-semibold text-focus hover:underline"
            >
              {guide.title} →
            </Link>
          </div>
        )}

        <p className="text-ink-dim leading-relaxed mb-12">
          Build it visually in Roblox GUI Maker — drag, resize, nest, auto-arrange
          with layouts, and wire buttons to show or hide panels — then export clean
          Luau that recreates the whole interface, click handlers included, ready to
          paste into a LocalScript. Free, no login.
        </p>

        <h2 className="text-xl font-semibold text-ink mb-4">Other use cases</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {others.map((o) => (
            <Link
              key={o.slug}
              href={`/for/${o.slug}`}
              className="rounded-xl bg-panel border border-line hover:border-focus p-4 transition"
            >
              <p className="text-sm font-medium text-ink">
                {o.title.replace("Roblox GUI Maker for ", "")}
              </p>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
