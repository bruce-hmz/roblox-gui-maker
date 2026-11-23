import type { Metadata } from "next";
import { TEMPLATES } from "../../../editor/templates";
import { getTemplateZh } from "../../../editor/templates.zh";
import { ZhShell } from "../../_components/ZhShell";
import { TemplateDetailView } from "../../_views/TemplateDetailView";

export function generateStaticParams() {
  return TEMPLATES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = getTemplateZh(slug);
  if (!t) return { title: "未找到模板 — Roblox GUI Maker" };
  return {
    title: `${t.title} — 免费模板 | Roblox GUI Maker`,
    description: t.metaDescription ?? t.description,
    openGraph: {
      title: `${t.title} — 免费 Roblox GUI 模板`,
      description: t.description,
      url: `https://robloxguimaker.app/zh/templates/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${t.title} — 免费 Roblox GUI 模板`,
      description: t.description,
    },
    alternates: {
      canonical: `/zh/templates/${slug}`,
      languages: {
        en: `https://robloxguimaker.app/templates/${slug}`,
        zh: `https://robloxguimaker.app/zh/templates/${slug}`,
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
      <TemplateDetailView slug={slug} />
    </ZhShell>
  );
}
