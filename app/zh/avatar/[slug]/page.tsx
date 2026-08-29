import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ZhShell } from "../../_components/ZhShell";
import { AvatarGallery } from "../../../avatar/AvatarGallery";
import { SPOKES, getSpoke } from "../../../avatar/spokes";
import { looksForSpoke, lookTotalRs } from "../../../avatar/data";

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
  if (!spoke) return { title: "未找到搭配 — Roblox GUI Maker" };
  return {
    title: spoke.title.zh,
    description: spoke.description.zh,
    alternates: {
      canonical: `/zh/avatar/${spoke.slug}`,
      languages: {
        en: `https://robloxguimaker.app/avatar/${spoke.slug}`,
        zh: `https://robloxguimaker.app/zh/avatar/${spoke.slug}`,
      },
    },
    openGraph: {
      title: spoke.title.zh,
      description: spoke.description.zh,
      url: `https://robloxguimaker.app/zh/avatar/${spoke.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: spoke.title.zh,
      description: spoke.description.zh,
    },
  };
}

export default async function ZhAvatarSpokePage({
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
    name: spoke.title.zh,
    numberOfItems: looks.length,
    itemListElement: looks.map((look, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: look.nameZh,
      url: `https://robloxguimaker.app/zh/avatar/${spoke.slug}#${look.slug}`,
    })),
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: spoke.faq.map((f) => ({
      "@type": "Question",
      name: f.qZh,
      acceptedAnswer: { "@type": "Answer", text: f.aZh },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }}
      />
      <ZhShell>
        <div className="max-w-5xl mx-auto px-6 py-12">
          <Link href="/zh/avatar" className="text-sm text-ink-mute hover:text-ink mb-4 inline-block">
            ← 全部形象搭配
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{spoke.h1.zh}</h1>
          <p className="text-lg text-ink-dim mb-10 leading-relaxed max-w-3xl">{spoke.intro.zh}</p>

          <AvatarGallery zh looks={looks} trackLookSet={spoke.slug} />

          <section className="mt-14 max-w-3xl">
            <h2 className="text-xl font-semibold text-ink mb-4">常见问题</h2>
            <div className="flex flex-col gap-4">
              {spoke.faq.map((f) => (
                <div key={f.qZh}>
                  <h3 className="font-semibold text-ink">{f.qZh}</h3>
                  <p className="text-ink-dim text-sm mt-1">{f.aZh}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-xl font-semibold text-ink mb-4">更多形象搭配</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {siblings.map((s) => {
                const sibLooks = looksForSpoke(s.slug);
                const min = Math.min(...sibLooks.map(lookTotalRs));
                return (
                  <Link
                    key={s.slug}
                    href={`/zh/avatar/${s.slug}`}
                    className="rounded-xl border border-line bg-panel p-4 transition hover:border-focus"
                  >
                    <p className="text-sm font-semibold text-ink">{s.h1.zh}</p>
                    <p className="text-xs text-ink-mute mt-1">
                      {sibLooks.length} 套 · {min === 0 ? "含免费" : `低至 R$ ${min}`}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </ZhShell>
    </>
  );
}
