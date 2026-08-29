import type { Metadata } from "next";
import Link from "next/link";
import { ZhShell } from "../_components/ZhShell";
import { AvatarGallery } from "../../avatar/AvatarGallery";
import { SPOKES } from "../../avatar/spokes";
import { looksForSpoke, lookTotalRs } from "../../avatar/data";

export const metadata: Metadata = {
  title: "Roblox 形象搭配灵感 —— 免费与平价穿搭(真实物品 ID)",
  description:
    "精选 Roblox 形象穿搭方案,每件单品都是真实商店 ID:零成本开局装、街头风、奶油甜妹、姬发式、正装,复制 ID 几分钟穿到身上。",
  alternates: {
    canonical: "/zh/avatar",
    languages: {
      en: "https://robloxguimaker.app/avatar",
      zh: "https://robloxguimaker.app/zh/avatar",
    },
  },
  openGraph: {
    title: "Roblox 形象搭配灵感 —— 免费与平价穿搭(真实物品 ID)",
    description:
      "精选 Roblox 形象穿搭方案:零成本开局装、街头风、奶油甜妹、姬发式、正装,每件单品都是真实商店 ID。",
    url: "https://robloxguimaker.app/zh/avatar",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roblox 形象搭配灵感 —— 免费与平价穿搭(真实物品 ID)",
    description:
      "精选 Roblox 形象穿搭方案:零成本开局装、街头风、奶油甜妹、姬发式、正装。",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "这里有免费的 Roblox 形象穿搭吗?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "有。本页的“经典开局”和“清爽学院”两套全部由 Roblox 官方免费单品组成(发型、表情、外套、长裤、鞋子),0 Robux 就能穿上。",
      },
    },
    {
      "@type": "Question",
      name: "怎么用物品 ID 穿上这套搭配?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "复制本页的物品 ID,点链接按钮打开商品的 Roblox 商店页,免费物品直接领取、付费物品按当前价格购买,然后在 roblox.com/my/avatar 的形象编辑器里从背包穿戴。",
      },
    },
    {
      "@type": "Question",
      name: "页面上的 Robux 价格一直准确吗?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "价格是我们抓取时(2026 年 8 月)的商店最低价。社区服饰的定价会浮动,一切以 Roblox 商店页面为准。",
      },
    },
    {
      "@type": "Question",
      name: "这些形象物品能用在自己的游戏里吗?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "形象物品属于玩家的角色,不属于游戏。你自己能做的是游戏的界面 —— 主菜单、商店、背包,这正是 Roblox GUI Maker 导出 Luau 代码所做的事。",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "首页", item: "https://robloxguimaker.app/zh" },
    { "@type": "ListItem", position: 2, name: "形象搭配灵感", item: "https://robloxguimaker.app/zh/avatar" },
  ],
};

export default function ZhAvatarPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c"),
        }}
      />
      <ZhShell>
        <div className="max-w-5xl mx-auto px-6 py-12">
        <p className="text-focus text-xs font-semibold uppercase tracking-wider mb-2">
          给 Roblox 玩家
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Roblox 形象搭配灵感 —— 免费与平价穿搭
        </h1>
        <p className="text-lg text-ink-dim mb-8 leading-relaxed max-w-3xl">
          二十套精选搭配,全部由真实商店单品组成 —— 两套完全免费,最贵的一套也不过
          205 Robux。每件单品都带 ID:复制、打开商店、几分钟穿到你的形象上。
        </p>

        {/* 风格长尾页入口:放在画廊上方,让爬虫和快速浏览的人都能早点看到内链。 */}
        <section className="mb-12" aria-label="按风格浏览搭配">
          <div className="grid gap-3 sm:grid-cols-2">
            {SPOKES.map((s) => {
              const spokeLooks = looksForSpoke(s.slug);
              const min = Math.min(...spokeLooks.map(lookTotalRs));
              return (
                <Link
                  key={s.slug}
                  href={`/zh/avatar/${s.slug}`}
                  className="rounded-xl border border-line bg-panel p-4 transition hover:border-focus"
                >
                  <p className="text-sm font-semibold text-ink">{s.h1.zh}</p>
                  <p className="text-xs text-ink-mute mt-1">
                    {spokeLooks.length} 套 ·{" "}
                    {min === 0 ? "含免费" : `低至 R$ ${min}`}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        <AvatarGallery zh />

        <section className="mt-14 max-w-3xl">
          <h2 className="text-xl font-semibold text-ink mb-4">怎么把单品穿到形象上</h2>
          <ol className="flex flex-col gap-3 text-ink-dim leading-relaxed list-decimal list-inside">
            <li>复制喜欢的单品 ID(或直接点链接按钮)。</li>
            <li>打开商品的商店页领取或购买 —— 免费品即领即得,付费品显示当前 Robux 价格。</li>
            <li>
              前往{" "}
              <a
                href="https://www.roblox.com/my/avatar"
                target="_blank"
                rel="noopener noreferrer"
                className="text-focus hover:underline"
              >
                roblox.com/my/avatar
              </a>{" "}
              的形象编辑器,从背包里逐件穿上。
            </li>
          </ol>
        </section>

        <section className="mt-12 max-w-3xl">
          <h2 className="text-xl font-semibold text-ink mb-4">常见问题</h2>
          <div className="flex flex-col gap-4">
            {[
              {
                q: "这里有免费的 Roblox 形象穿搭吗?",
                a: "有 —— “经典开局”和“清爽学院”两套全部由官方免费单品组成,0 Robux 就能穿。",
              },
              {
                q: "怎么用物品 ID 穿上搭配?",
                a: "复制 ID,点单品旁的链接按钮打开商店页,领取或购买后,在 roblox.com/my/avatar 的形象编辑器里穿戴。",
              },
              {
                q: "Robux 价格会一直准确吗?",
                a: "是 2026 年 8 月抓取时的最低价。社区服饰定价会浮动,以商店页面为准。",
              },
              {
                q: "这些形象物品能用在自己的游戏里吗?",
                a: "形象物品属于玩家角色,不属于游戏。你能自己动手做的是游戏界面 —— 下面的 GUI 制作器就是干这个的。",
              },
            ].map((f) => (
              <div key={f.q}>
                <h3 className="font-semibold text-ink">{f.q}</h3>
                <p className="text-ink-dim text-sm mt-1">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-12 text-sm text-ink-mute max-w-3xl leading-relaxed">
          Roblox GUI Maker 是独立的非官方工具,与 Roblox Corporation
          无关、也未获其认可。物品名称、ID 与价格均引用公开的 Roblox
          商店。想让你的形象出现在自己做的游戏里?
          <a href="/editor" className="text-focus hover:underline">
            来做它的界面
          </a>
          。
        </p>
        </div>
      </ZhShell>
    </>
  );
}
