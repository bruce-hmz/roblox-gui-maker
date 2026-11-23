import type { Metadata } from "next";
import { USE_CASES } from "../../../for/usecases";
import { getUseCaseZh } from "../../../for/usecases.zh";
import { ZhShell } from "../../_components/ZhShell";
import { UseCaseDetailView } from "../../_views/UseCaseDetailView";

export function generateStaticParams() {
  return USE_CASES.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const u = getUseCaseZh(slug);
  if (!u) return { title: "未找到用例 — Roblox GUI Maker" };
  return {
    title: `${u.title} | Roblox GUI Maker`,
    description: u.metaDescription ?? u.blurb,
    openGraph: {
      title: `${u.title} | Roblox GUI Maker`,
      description: u.blurb,
      url: `https://robloxguimaker.app/zh/for/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: u.title,
      description: u.blurb,
    },
    alternates: {
      canonical: `/zh/for/${slug}`,
      languages: {
        en: `https://robloxguimaker.app/for/${slug}`,
        zh: `https://robloxguimaker.app/zh/for/${slug}`,
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
      <UseCaseDetailView slug={slug} />
    </ZhShell>
  );
}
