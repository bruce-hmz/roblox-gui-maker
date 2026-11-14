import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "../../guides/guides-data";
import { getGuideZh } from "../../guides/guides-data.zh";
import { ZhShell } from "../_components/ZhShell";

export const metadata: Metadata = {
  title: "Roblox GUI 教程 — 如何制作菜单、商店、通行证图标与 Studio 界面",
  description:
    "分步图文讲解 Roblox Studio 界面开发：主菜单、金币与 Game Pass 商店、加载界面、UIListLayout/Scale 全端适配、TweenService 动效、512×512 通行证图标规范及 .rbxmx 导入流程。",
  openGraph: {
    title: "Roblox GUI 教程 — 如何制作菜单、商店、通行证图标与 Studio 界面",
    description:
      "分步图文讲解 Roblox Studio 界面开发：菜单、商店、通行证、TweenService 动效、512×512 图标与 .rbxmx 导入流程。",
    url: "https://robloxguimaker.app/zh/guides",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roblox GUI 教程 — 如何制作菜单、商店、通行证图标与 Studio 界面",
    description: "搭建 Roblox GUI 的实用图文教程：菜单、商店、通行证、响应式适配与 .rbxmx 导入。",
  },
  alternates: {
    canonical: "/zh/guides",
    languages: {
      en: "https://robloxguimaker.app/guides",
      zh: "https://robloxguimaker.app/zh/guides",
    },
  },
};

export default function GuidesPage() {
  return (
    <ZhShell>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Roblox GUI 图文教程与实操指南
        </h1>
        <p className="text-ink-dim mb-6 leading-relaxed">
          围绕 Roblox 开发者最常遇到的问题撰写 —— 涵盖响应式 Scale 布局、TweenService
          补间动画、Game Pass 通行证商店、512&times;512 图标规范，以及把{" "}
          <code className="text-ink">.rbxmx</code> 直接导入{" "}
          <code className="text-ink">StarterGui</code> 的完整工作流。
        </p>
        <div className="flex flex-wrap gap-2 mb-10 text-xs">
          <Link
            href="/zh/templates"
            className="rounded-lg border border-line bg-panel px-3 py-1.5 font-medium text-ink-dim hover:border-focus hover:text-ink transition"
          >
            浏览 13 套 GUI 模板 →
          </Link>
          <Link
            href="/zh/gamepass-icon-maker"
            className="rounded-lg border border-line bg-panel px-3 py-1.5 font-medium text-ink-dim hover:border-focus hover:text-ink transition"
          >
            512&times;512 通行证图标生成器 →
          </Link>
          <Link
            href="/zh/kits"
            className="rounded-lg border border-line bg-panel px-3 py-1.5 font-medium text-ink-dim hover:border-focus hover:text-ink transition"
          >
            6 套 Pro UI 套件 →
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          {GUIDES.map((g) => {
            const z = getGuideZh(g.slug);
            if (!z) return null;
            return (
              <Link
                key={z.slug}
                href={`/zh/guides/${z.slug}`}
                className="block rounded-xl bg-panel border border-line hover:border-focus p-5 transition"
              >
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-focus bg-input px-1.5 py-0.5 rounded mb-2">
                  {z.category}
                </span>
                <h2 className="text-lg font-semibold text-ink">{z.title}</h2>
                <p className="text-sm text-ink-dim mt-1">{z.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </ZhShell>
  );
}
