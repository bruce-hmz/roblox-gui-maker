import Link from "next/link";
import { notFound } from "next/navigation";
import { SceneThumb } from "../../components/SceneThumb";
import { templatePreviewSrc } from "../../editor/preview-images";
import { getTemplate } from "../../editor/templates";
import { getTemplateZh } from "../../editor/templates.zh";
import { getGuideZh } from "../../guides/guides-data.zh";
import { USE_CASES } from "../../for/usecases";
import { getUseCaseZh } from "../../for/usecases.zh";

// Shared zh render for a use-case landing page. Consumes a full UseCase (zh
// prose overlaid on the en structure; `properties`/`template`/`relatedGuide`
// kept from en).
export function UseCaseDetailView({ slug }: { slug: string }) {
  const u = getUseCaseZh(slug);
  if (!u) notFound();
  const tpl = u.template ? getTemplate(u.template) : undefined;
  const guide = u.relatedGuide ? getGuideZh(u.relatedGuide) : undefined;
  const others = USE_CASES.filter((x) => x.slug !== slug).slice(0, 3);

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: "https://robloxguimaker.app/zh" },
      { "@type": "ListItem", position: 2, name: "用例", item: "https://robloxguimaker.app/zh/for" },
      { "@type": "ListItem", position: 3, name: u.title, item: `https://robloxguimaker.app/zh/for/${slug}` },
    ],
  };

  const useCaseFaqs = [
    {
      q: `如何不用手写大段布局代码就做好一套 Roblox ${u.noun}？`,
      a: `在 Roblox GUI Maker 中${tpl ? `直接打开对应的起步模板` : "新建空白 ScreenGui 画布"}，搭配 ${u.properties.slice(0, 3).join("、")} 等原生组件可视化拖拽配色，即可免费导出完整 Luau 或选择导出原生 .rbxmx 拖入 Studio。`,
    },
    {
      q: `打造适配手机和电脑的 Roblox ${u.noun}，哪些核心属性最关键？`,
      a: `重点配置 ${u.properties.join("、")}，并优先采用 Scale 比例而非全像素 Offset；导出前建议在编辑器顶栏切到桌面、平板与手机视口逐一预览。`,
    },
    {
      q: `导出的 ${u.noun} 脚本应该放进 Roblox Studio 的哪个位置？`,
      a: `所有视觉展示与点击交互均写在 StarterGui > ScreenGui 下的 LocalScript；涉及金币扣费、奖励发放或管理指令的 RemoteEvent 校验逻辑，必须放进 ServerScriptService 的服务端 Script。`,
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: useCaseFaqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }}
      />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/zh/for" className="text-sm text-ink-mute hover:text-ink mb-4 inline-block">
          ← 全部用例
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{u.title}</h1>
        <p className="text-lg text-ink-dim leading-relaxed mb-8">{u.blurb}</p>

        <h2 className="text-xl font-semibold text-ink mb-3">一个{u.noun}通常需要什么</h2>
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
              <SceneThumb
                src={templatePreviewSrc(tpl.slug)}
                alt={`${tpl.title} 模板预览`}
              />
            </div>
            <div className="flex flex-wrap gap-3 mb-10">
              <Link
                href={`/editor?template=${tpl.slug}`}
                className="px-5 py-2.5 rounded-lg font-semibold bg-primary text-on-primary hover:brightness-110 transition"
              >
                打开{(getTemplateZh(tpl.slug)?.title ?? tpl.title).replace("Roblox ", "").replace(" GUI", "")}模板 →
              </Link>
              <Link
                href="/editor"
                className="px-5 py-2.5 rounded-lg font-medium border border-line hover:bg-raised transition"
              >
                从空白开始
              </Link>
            </div>
          </>
        ) : (
          <div className="flex flex-wrap gap-3 mb-10">
            <Link
              href="/editor"
              className="px-5 py-2.5 rounded-lg font-semibold bg-primary text-on-primary hover:brightness-110 transition"
            >
              打开编辑器 →
            </Link>
          </div>
        )}

        <h2 className="text-xl font-semibold text-ink mb-3">如何在 Roblox GUI Maker 里搭建{u.noun}</h2>
        <ol className="space-y-3 mb-10 list-decimal list-inside text-ink-dim leading-relaxed">
          {u.howTo.map((step, i) => (
            <li key={i} className="pl-1">
              {step}
            </li>
          ))}
        </ol>

        <h2 className="text-xl font-semibold text-ink mb-3">{u.noun}的关键 Roblox 属性</h2>
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

        <h2 className="text-xl font-semibold text-ink mb-3">把{u.noun}做得更好的技巧</h2>
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
            <p className="text-xs text-ink-mute uppercase tracking-wider mb-1">相关教程</p>
            <Link
              href={`/zh/guides/${guide.slug}`}
              className="text-base font-semibold text-focus hover:underline"
            >
              {guide.title} →
            </Link>
          </div>
        )}

        <p className="text-ink-dim leading-relaxed mb-12">
          在 Roblox GUI Maker 里可视化搭建 —— 拖拽、缩放、嵌套、用布局自动排列，把按钮接上显示或隐藏面板 —— 然后导出干净的 Luau，重建整个界面（含点击处理），可直接粘进 LocalScript，或用 Pro 导出原生 <code>.rbxmx</code> Studio 模型。免费、免登录。
        </p>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-ink mb-4">
            关于 {u.noun} 的常见问题
          </h2>
          <div className="space-y-3">
            {useCaseFaqs.map((item) => (
              <div
                key={item.q}
                className="border border-line rounded-xl bg-surface p-5"
              >
                <h3 className="text-sm font-semibold text-ink mb-1.5">
                  {item.q}
                </h3>
                <p className="text-sm text-ink-dim leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <h2 className="text-xl font-semibold text-ink mb-4">其它用例</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {others.map((o) => {
            const oz = getUseCaseZh(o.slug);
            return (
              <Link
                key={o.slug}
                href={`/zh/for/${o.slug}`}
                className="rounded-xl bg-panel border border-line hover:border-focus p-4 transition"
              >
                <p className="text-sm font-medium text-ink">
                  {(oz?.title ?? o.title).replace("Roblox GUI Maker:", "").replace("Roblox GUI Maker for ", "")}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
