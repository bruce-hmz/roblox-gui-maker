import type { Metadata } from "next";
import Link from "next/link";
import { SceneThumb } from "../../components/SceneThumb";
import { templatePreviewSrc } from "../../editor/preview-images";
import { TEMPLATES, getTemplate } from "../../editor/templates";
import { getTemplateZh } from "../../editor/templates.zh";
import { ZhShell } from "../_components/ZhShell";

export const metadata: Metadata = {
  title: "Roblox GUI 示例与作品集 —— 真实 UI 设计 | Roblox GUI Maker",
  description:
    "浏览真实的 Roblox GUI 示例 —— 主菜单、商店、HUD、Game Pass 商店、每日奖励、排行榜等。可视化设计、导出为干净 Luau,免费。",
  openGraph: {
    title: "Roblox GUI 示例与作品集 —— 真实 UI 设计",
    description:
      "浏览真实的 Roblox GUI 示例 —— 主菜单、商店、HUD、Game Pass 商店、每日奖励、排行榜等。免费、可导出 Luau。",
    url: "https://robloxguimaker.app/zh/showcase",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roblox GUI 示例与作品集 —— 真实 UI 设计",
    description:
      "浏览真实的 Roblox GUI 示例 —— 主菜单、商店、HUD、Game Pass 商店、每日奖励等。免费、可导出 Luau。",
  },
  alternates: {
    canonical: "/zh/showcase",
    languages: {
      en: "https://robloxguimaker.app/showcase",
      zh: "https://robloxguimaker.app/zh/showcase",
    },
  },
};

// The most polished, game-ready screen — shown large as the anchor piece.
const FEATURED = getTemplate("game-pass-shop") ?? TEMPLATES[0];
const FEATURED_ZH = getTemplateZh("game-pass-shop");

export default function ShowcasePage() {
  return (
    <ZhShell>
      {/* hero */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-8 text-center">
        <p className="text-focus text-sm font-semibold uppercase tracking-wider mb-4">
          用 Roblox GUI Maker 制作 · 免费 · 可导出
        </p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
          Roblox GUI 示例与灵感
        </h1>
        <p className="text-lg text-ink-dim max-w-2xl mx-auto mb-8">
          真实的、游戏内风格的 Roblox 界面 —— 主菜单、商店、HUD、奖励界面 ——
          可视化设计、导出为干净 Luau。在编辑器里打开任意一个、改成你的、免费发布。
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/editor"
            className="px-6 py-3 rounded-lg font-semibold bg-primary text-on-primary hover:brightness-110 transition"
          >
            打开编辑器 →
          </Link>
          <Link
            href="/zh/templates"
            className="px-6 py-3 rounded-lg font-medium border border-line hover:bg-raised transition"
          >
            浏览模板
          </Link>
        </div>
      </section>

      {/* featured anchor piece */}
      <section className="max-w-5xl mx-auto px-6 pb-14">
        <div className="rounded-2xl ring-1 ring-line overflow-hidden shadow-2xl shadow-black/40">
          <SceneThumb
            src={templatePreviewSrc(FEATURED.slug)}
            alt={`${getTemplateZh(FEATURED.slug)?.title ?? FEATURED.title} 模板预览`}
            priority
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
          <div>
            <p className="text-sm font-semibold text-ink">
              {(FEATURED_ZH?.title ?? FEATURED.title).replace("Roblox ", "").replace(" GUI", "")}
            </p>
            <p className="text-xs text-ink-mute">{FEATURED_ZH?.tagline ?? FEATURED.tagline}</p>
          </div>
          <Link
            href={`/zh/templates/${FEATURED.slug}`}
            className="text-sm text-focus hover:underline font-medium"
          >
            打开这个模板 →
          </Link>
        </div>
      </section>

      {/* full gallery */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl md:text-3xl font-semibold mb-2">
          每个界面,一步即可编辑
        </h2>
        <p className="text-ink-dim max-w-2xl mb-8">
          每个示例都是由原生实例构建的真实 Roblox 场景。点一个在编辑器里打开,换成你自己的文字和颜色,导出 Luau、JSON 或 ZIP。
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEMPLATES.filter((t) => t.slug !== FEATURED.slug).map((t) => {
            const tz = getTemplateZh(t.slug);
            return (
              <Link
                key={t.slug}
                href={`/zh/templates/${t.slug}`}
                className="group rounded-xl overflow-hidden ring-1 ring-line hover:ring-focus transition"
              >
                <SceneThumb
                  src={templatePreviewSrc(t.slug)}
                  alt={`${tz?.title ?? t.title} 模板预览`}
                />
                <div className="p-3 bg-panel">
                  <p className="text-sm font-medium text-ink">
                    {(tz?.title ?? t.title).replace("Roblox ", "").replace(" GUI", "")}
                  </p>
                  <p className="text-xs text-ink-mute">{tz?.tagline ?? t.tagline}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* SEO body */}
      <section className="max-w-3xl mx-auto px-6 pb-20 space-y-5 text-ink-dim leading-relaxed">
        <h2 className="text-2xl font-semibold text-ink">你能编辑的真实 Roblox GUI 示例</h2>
        <p>
          这个作品集是一个用可视化编辑器搭出的<strong>Roblox GUI 示例</strong>实战集 —— 没有图片样机、没有手绘框。上面的每个界面都由真实的 Roblox 实例构成,如{" "}
          <code className="text-focus">ScreenGui</code>、{" "}
          <code className="text-focus">ScrollingFrame</code>、{" "}
          <code className="text-focus">UIListLayout</code>,所以所见即所导。
        </p>
        <p>
          浏览 <strong>Roblox UI 示例</strong>是决定你的游戏需要什么的最快方式。模拟器想要一个紧凑的角落 HUD 和每日奖励弹窗;大亨想要一个商店网格和 Game Pass 商店。挑最接近的,在编辑器里打开,把占位文字换成你自己的 —— 然后在桌面、平板、手机上预览,再导出。
        </p>
        <p>
          不同于静态的 <strong>Roblox GUI 设计作品集</strong>,这里的每个示例都导出可直接使用的客户端 Luau(以及购买、传送、奖励动作可选的服务端 Luau)。你拿到观感和能跑的代码,免费、无需账号。
        </p>
      </section>
    </ZhShell>
  );
}
