import Link from "next/link";
import { notFound } from "next/navigation";
import { ScenePreview } from "../../editor/ScenePreview";
import { TEMPLATES, getTemplate } from "../../editor/templates";
import { getTemplateZh } from "../../editor/templates.zh";
import { USE_CASES } from "../../for/usecases";
import { getUseCaseZh } from "../../for/usecases.zh";
import { guidesForTemplate } from "../../guides/guides-data";
import { getGuideZh } from "../../guides/guides-data.zh";

// Shared zh render for a template detail page. Scene comes from the English
// module (shared visual); all prose, how-to tutorial sections, and links use zh data.
export function TemplateDetailView({ slug }: { slug: string }) {
  const zh = getTemplateZh(slug);
  const en = getTemplate(slug);
  if (!zh || !en) notFound();

  const related = TEMPLATES.filter((x) => x.slug !== slug).slice(0, 3);
  const guides = (() => {
    const bySlug = new Map<string, NonNullable<ReturnType<typeof getGuideZh>>>();
    for (const g of guidesForTemplate(slug)) {
      const z = getGuideZh(g.slug);
      if (z) bySlug.set(z.slug, z);
    }
    for (const guideSlug of en.relatedGuideSlugs ?? []) {
      if (!bySlug.has(guideSlug)) {
        const z = getGuideZh(guideSlug);
        if (z) bySlug.set(guideSlug, z);
      }
    }
    return [...bySlug.values()];
  })();
  const useCases = USE_CASES.filter((u) => u.template === slug);

  const templateFaqs = [
    {
      q: `如何把这套「${zh.title}」放到 Roblox Studio 里使用？`,
      a: `点击上方「在编辑器中打开」修改文案、颜色与交互后，既可以免费复制或下载 .lua 脚本放进 StarterGui 下的 ScreenGui LocalScript 运行，也可以导出原生 .rbxmx 模型通过 StarterGui -> Insert from File... 直接导入。`,
    },
    {
      q: `这套「${zh.title}」能自适应手机、平板和桌面显示器吗？`,
      a: `可以。模板主体采用 Scale 百分比定位与 UIListLayout / UIGridLayout、UICorner 等 Roblox 原生约束；导出前还可在编辑器顶栏切换 Desktop / Tablet / Mobile 三端画布检查效果。`,
    },
    {
      q: `导入或使用「${zh.title}」需要账号或安装 Studio 插件吗？`,
      a: `不需要任何账号，也不需要安装第三方 Roblox Studio 插件。所有设计与 Luau 代码均在浏览器本地完成。`,
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: templateFaqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: "https://robloxguimaker.app/zh" },
      { "@type": "ListItem", position: 2, name: "模板", item: "https://robloxguimaker.app/zh/templates" },
      { "@type": "ListItem", position: 3, name: zh.title, item: `https://robloxguimaker.app/zh/templates/${slug}` },
    ],
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
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link
          href="/zh/templates"
          className="text-sm text-ink-mute hover:text-ink mb-4 inline-block"
        >
          ← 全部模板
        </Link>
        <p className="text-focus text-xs font-semibold uppercase tracking-wider mb-2">
          {zh.category}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          {zh.title}
        </h1>
        <p className="text-ink-dim mb-6">{zh.tagline}</p>

        <div className="rounded-2xl ring-1 ring-line overflow-hidden shadow-2xl shadow-black/40 mb-6">
          <ScenePreview scene={en.scene} />
        </div>

        <div className="flex flex-wrap gap-3 mb-10">
          <Link
            href={`/editor?template=${slug}`}
            className="px-5 py-2.5 rounded-lg font-semibold bg-primary text-on-primary hover:brightness-110 transition"
          >
            在编辑器中打开 →
          </Link>
          <Link
            href="/editor"
            className="px-5 py-2.5 rounded-lg font-medium border border-line hover:bg-raised transition"
          >
            从空白开始
          </Link>
        </div>

        <div className="space-y-4 text-ink-dim leading-relaxed max-w-2xl">
          <p>{zh.description}</p>
          <p>
            这个模板完全由 Roblox 原生实例构成,可完整编辑。在编辑器里打开它,修改颜色、文字、尺寸和布局,然后导出干净的 Luau——粘进{" "}
            <code className="text-focus">ScreenGui</code> 里的{" "}
            <code className="text-focus">LocalScript</code> 即可直接运行,也可导出原生{" "}
            <code className="text-focus">.rbxmx</code> 文件放入 Studio。
          </p>
        </div>

        {guides.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-3">如何从零搭建这套界面</h2>
            {(() => {
              const g = guides[0];
              return (
                <article className="max-w-2xl">
                  <p className="text-ink-dim leading-relaxed mb-4">{g.intro}</p>
                  {g.sections.slice(0, 2).map((s, i) => (
                    <div key={i} className="mb-4">
                      <h3 className="font-semibold text-ink mb-1.5">{s.heading}</h3>
                      {s.paragraphs?.map((p, j) => (
                        <p key={j} className="text-ink-dim leading-relaxed mb-2 text-[15px]">
                          {p}
                        </p>
                      ))}
                      {s.tip && (
                        <p className="text-sm text-ink-mute">
                          <span className="font-semibold text-focus">提示:</span>
                          {s.tip}
                        </p>
                      )}
                    </div>
                  ))}
                  <Link
                    href={`/zh/guides/${g.slug}`}
                    className="inline-block text-sm text-focus hover:underline font-medium"
                  >
                    阅读完整《{g.title}》教程 →
                  </Link>
                </article>
              );
            })()}

            {guides.length > 1 && (
              <div className="flex flex-col gap-2 mt-6">
                {guides.slice(1).map((g) => (
                  <Link
                    key={g.slug}
                    href={`/zh/guides/${g.slug}`}
                    className="rounded-xl border border-line bg-panel p-4 hover:border-focus transition"
                  >
                    <p className="text-sm font-semibold text-ink">{g.title}</p>
                    <p className="text-xs text-ink-mute mt-1 line-clamp-2">{g.description}</p>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

        {useCases.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-3">按游戏界面场景继续深入了解</h2>
            <div className="flex flex-col gap-2">
              {useCases.map((u) => {
                const uz = getUseCaseZh(u.slug);
                return (
                  <Link
                    key={u.slug}
                    href={`/zh/for/${u.slug}`}
                    className="rounded-xl border border-line bg-panel p-4 hover:border-focus transition"
                  >
                    <p className="text-sm font-semibold text-ink">{uz?.title ?? u.title}</p>
                    <p className="text-xs text-ink-mute mt-1 line-clamp-2">{uz?.blurb ?? u.blurb}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <section className="mt-10 max-w-2xl space-y-4">
          <h2 className="text-xl font-semibold text-ink">{zh.title} 常见问题</h2>
          {templateFaqs.map((item) => (
            <div key={item.q} className="rounded-xl border border-line bg-panel p-4 text-sm">
              <h3 className="font-semibold text-ink">{item.q}</h3>
              <p className="mt-1 text-ink-dim leading-relaxed">{item.a}</p>
            </div>
          ))}
        </section>

        <h2 className="text-xl font-semibold mt-12 mb-4">更多模板</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {related.map((r) => {
            const rz = getTemplateZh(r.slug);
            return (
              <Link
                key={r.slug}
                href={`/zh/templates/${r.slug}`}
                className="rounded-xl overflow-hidden ring-1 ring-line hover:ring-focus transition"
              >
                <ScenePreview scene={r.scene} />
                <div className="p-3 bg-panel">
                  <p className="text-sm font-medium text-ink">
                    {(rz?.title ?? r.title).replace("Roblox ", "").replace(" GUI", "")}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
