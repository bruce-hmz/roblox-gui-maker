import type { Metadata } from "next";
import { GUIDES } from "../../../guides/guides-data";
import { getGuideZh } from "../../../guides/guides-data.zh";
import { ZhShell } from "../../_components/ZhShell";
import { GuideDetailView } from "../../_views/GuideDetailView";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuideZh(slug);
  if (!g) return { title: "未找到教程 — Roblox GUI Maker" };
  // 有自己词族的指南覆盖品牌后缀,避免跟首页抢「roblox gui maker」。
  const fullTitle = g.metaTitle ?? `${g.title} | Roblox GUI Maker`;
  return {
    title: fullTitle,
    description: g.description,
    openGraph: {
      title: fullTitle,
      description: g.description,
      url: `https://robloxguimaker.app/zh/guides/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: g.title,
      description: g.description,
    },
    alternates: {
      canonical: `/zh/guides/${slug}`,
      languages: {
        en: `https://robloxguimaker.app/guides/${slug}`,
        zh: `https://robloxguimaker.app/zh/guides/${slug}`,
      },
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <ZhShell>
      <GuideDetailView slug={slug} />
    </ZhShell>
  );
}
