import Link from "next/link";
import { notFound } from "next/navigation";
import { KitProDownloadCard } from "../../components/KitProDownloadCard";
import { SceneThumb } from "../../components/SceneThumb";
import { templatePreviewSrc } from "../../editor/preview-images";
import {
  kitGamepassIcons,
  renderGamepassIconSvg,
} from "../../editor/gamepass-icons";
import { kitScene } from "../../editor/kits";
import { getTheme } from "../../editor/themes";
import { getKitZh, THEME_ZH } from "../../editor/kits.zh";

// Shared zh render for a kit detail page. Consumes a full Kit (zh prose
// overlaid on the en structure; theme + screen templates kept from en).
export function KitDetailView({ slug }: { slug: string }) {
  const kit = getKitZh(slug);
  if (!kit) notFound();
  const theme = getTheme(kit.theme);
  const themeName = THEME_ZH[kit.theme] ?? kit.theme;
  const badgePreviews = kitGamepassIcons(kit.slug).map((icon) => ({
    id: icon.id,
    titleTop: icon.titleTop,
    ...(icon.titleBottom ? { titleBottom: icon.titleBottom } : {}),
    svgMarkup: renderGamepassIconSvg(icon),
  }));

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: "https://robloxguimaker.app/zh" },
      { "@type": "ListItem", position: 2, name: "Kit", item: "https://robloxguimaker.app/zh/kits" },
      { "@type": "ListItem", position: 3, name: kit.name, item: `https://robloxguimaker.app/zh/kits/${slug}` },
    ],
  };

  const kitFaqs = [
    {
      q: `如何把「${kit.name}」导入 Roblox Studio？`,
      a: `在 Roblox Studio 的 Explorer 面板右键 StarterGui -> Insert from File...，选择下载包里的 ${kit.slug}-complete.rbxmx（或 screens/ 下的分屏 .rbxmx），再将 server/${kit.slug}.server.lua 放入 ServerScriptService 后按 Play 即可试玩。`,
    },
    {
      q: `可以先免费打开和修改「${kit.name}」里的各个界面吗？`,
      a: `可以。这套包含 ${kit.screens.length} 个界面的 UI Kit 均已套用${themeName}主题，点击任意界面的“在编辑器中打开”即可免费修改文案、色彩并复制完整 Luau 代码。`,
    },
    {
      q: `下载包里除了界面，还有配套图标和服务端脚本吗？`,
      a: `有的。Pro 下载包除包含一体化 .rbxmx（内含 KitScreenSwitcher 多屏切换器）外，还附带 6 枚契合${themeName}配色的 512x512 通行证图标以及 RemoteEvent / MarketplaceService 服务端示例脚本。`,
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: kitFaqs.map((f) => ({
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
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* hero */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <Link href="/zh/kits" className="text-sm text-focus hover:underline font-medium">
              ← 全部 Kit
            </Link>
            {theme && (
              <span className="inline-flex items-center gap-1.5 text-xs text-ink-mute px-2 py-1 rounded-full bg-panel border border-line">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: theme.primary }}
                  aria-hidden
                />
                {themeName} 主题
              </span>
            )}
            <span className="text-xs text-ink-mute">{kit.screens.length} 个配套界面</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">{kit.name}</h1>
          <p className="text-ink-dim max-w-2xl mb-6">{kit.description}</p>
          <Link
            href={`/editor?template=${kit.screens[0].template}&theme=${kit.theme}`}
            className="inline-flex px-6 py-3 rounded-lg font-semibold bg-primary text-on-primary hover:brightness-110 transition"
          >
            在编辑器中打开这个 Kit →
          </Link>
        </div>

        <KitProDownloadCard
          kitSlug={kit.slug}
          kitName={kit.name}
          screenCount={kit.screens.length}
          icons={badgePreviews}
          locale="zh"
        />

        {/* screens, recolored with the shared theme */}
        <div className="space-y-8">
          {kit.screens.map((screen) => {
            const scene = kitScene(kit, screen.template);
            if (!scene) return null;
            return (
              <section key={screen.template}>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <h2 className="text-lg font-semibold text-ink">{screen.role}</h2>
                  <Link
                    href={`/editor?template=${screen.template}&theme=${kit.theme}`}
                    className="text-sm text-focus hover:underline font-medium"
                  >
                    在编辑器中打开{screen.role} →
                  </Link>
                </div>
                <div className="rounded-2xl ring-1 ring-line overflow-hidden shadow-xl shadow-black/40">
                  <SceneThumb
                    src={templatePreviewSrc(screen.template, kit.theme)}
                    alt={`${kit.name}:${screen.role}界面预览`}
                  />
                </div>
              </section>
            );
          })}
        </div>

        <section className="mx-auto mt-16 max-w-3xl space-y-4 text-ink-dim leading-relaxed">
          <h2 className="text-2xl font-semibold text-ink">一个主题,贯穿每个界面</h2>
          <p>
            上面的每个界面都用同一套{themeName}配色 —— 同样的面板色调、同样的动作色、同样的文字明暗 —— 所以它们看起来像同一个游戏。这种一致性,正是成品游戏 UI 和一堆零散界面的区别。
          </p>
          <p>
            在编辑器里打开任意界面,它加载时就已经套好主题。改文字、加你自己的物品,然后直接把客户端 Luau(以及购买、奖励动作可选的服务端 Luau)导出到 Roblox Studio。
          </p>
        </section>

        <section className="mx-auto mt-12 max-w-3xl space-y-4 text-sm text-ink-dim leading-relaxed">
          <h2 className="text-2xl font-semibold text-ink">
            如何把「{kit.name}」导入 Roblox Studio
          </h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              在上方下载本 Kit 的 Pro ZIP 交付包（或点击各屏链接在编辑器中免费导出单屏 Luau）。
            </li>
            <li>
              在 Roblox Studio Explorer 里右键{" "}
              <strong className="text-ink">StarterGui</strong> →{" "}
              <strong className="text-ink">Insert from File...</strong>，选中{" "}
              <code className="text-ink">{kit.slug}-complete.rbxmx</code>。
            </li>
            <li>
              把 <code className="text-ink">server/{kit.slug}.server.lua</code>{" "}
              放入 <strong className="text-ink">ServerScriptService</strong> 并按{" "}
              <strong className="text-ink">Play</strong> 试玩；细节可参考{" "}
              <Link
                href="/zh/guides/how-to-import-rbxmx-into-roblox-studio"
                className="text-focus hover:underline"
              >
                .rbxmx 导入图文指南
              </Link>
              。
            </li>
          </ol>
        </section>

        <section className="mx-auto mt-12 max-w-3xl space-y-4 text-sm text-ink-dim leading-relaxed">
          <h2 className="text-2xl font-semibold text-ink">
            「{kit.name}」常见问题
          </h2>
          {kitFaqs.map((item) => (
            <div
              key={item.q}
              className="rounded-xl border border-line bg-panel p-5"
            >
              <h3 className="font-semibold text-ink">{item.q}</h3>
              <p className="mt-1.5">{item.a}</p>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
