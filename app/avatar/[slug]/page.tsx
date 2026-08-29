import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav } from "../../components/SiteNav";
import { SiteFooter } from "../../components/SiteFooter";
import { AvatarGallery } from "../AvatarGallery";
import { SPOKES, getSpoke } from "../spokes";
import { looksForSpoke, lookTotalRs } from "../data";

export function generateStaticParams() {
  return SPOKES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const spoke = getSpoke(slug);
  if (!spoke) return { title: "Avatar looks not found — Roblox GUI Maker" };
  return {
    title: spoke.title.en,
    description: spoke.description.en,
    alternates: {
      canonical: `/avatar/${spoke.slug}`,
      languages: {
        en: `https://robloxguimaker.app/avatar/${spoke.slug}`,
        zh: `https://robloxguimaker.app/zh/avatar/${spoke.slug}`,
      },
    },
    openGraph: {
      title: spoke.title.en,
      description: spoke.description.en,
      url: `https://robloxguimaker.app/avatar/${spoke.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: spoke.title.en,
      description: spoke.description.en,
    },
  };
}

export default async function AvatarSpokePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const spoke = getSpoke(slug);
  if (!spoke) notFound();
  const looks = looksForSpoke(spoke.slug);
  const siblings = SPOKES.filter((s) => s.slug !== spoke.slug).slice(0, 3);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: spoke.title.en,
    numberOfItems: looks.length,
    itemListElement: looks.map((look, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: look.name,
      url: `https://robloxguimaker.app/avatar/${spoke.slug}#${look.slug}`,
    })),
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: spoke.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://robloxguimaker.app" },
      { "@type": "ListItem", position: 2, name: "Avatar Ideas", item: "https://robloxguimaker.app/avatar" },
      {
        "@type": "ListItem",
        position: 3,
        name: spoke.h1.en,
        item: `https://robloxguimaker.app/avatar/${spoke.slug}`,
      },
    ],
  };

  return (
    <>
      <SiteNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }}
      />
      <main className="max-w-5xl mx-auto px-6 py-12">
        <Link href="/avatar" className="text-sm text-ink-mute hover:text-ink mb-4 inline-block">
          ← All avatar ideas
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{spoke.h1.en}</h1>
        <p className="text-lg text-ink-dim mb-10 leading-relaxed max-w-3xl">{spoke.intro.en}</p>

        <AvatarGallery looks={looks} trackLookSet={spoke.slug} />

        <section className="mt-14 max-w-3xl">
          <h2 className="text-xl font-semibold text-ink mb-4">FAQ</h2>
          <div className="flex flex-col gap-4">
            {spoke.faq.map((f) => (
              <div key={f.q}>
                <h3 className="font-semibold text-ink">{f.q}</h3>
                <p className="text-ink-dim text-sm mt-1">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-semibold text-ink mb-4">More avatar ideas</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {siblings.map((s) => {
              const count = looksForSpoke(s.slug).length;
              const min = Math.min(...looksForSpoke(s.slug).map(lookTotalRs));
              return (
                <Link
                  key={s.slug}
                  href={`/avatar/${s.slug}`}
                  className="rounded-xl border border-line bg-panel p-4 transition hover:border-focus"
                >
                  <p className="text-sm font-semibold text-ink">{s.h1.en}</p>
                  <p className="text-xs text-ink-mute mt-1">
                    {count} looks · from R$ {min}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
