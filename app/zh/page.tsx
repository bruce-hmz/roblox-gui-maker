import type { Metadata } from "next";
import Link from "next/link";
import { ScenePreview } from "../editor/ScenePreview";
import { KITS } from "../editor/kits";
import { getKitZh } from "../editor/kits.zh";
import { getTemplate } from "../editor/templates";
import { TEMPLATES_ZH } from "../editor/templates.zh";
import { USE_CASES } from "../for/usecases";
import { getUseCaseZh } from "../for/usecases.zh";
import { GUIDES } from "../guides/guides-data";
import { getGuideZh } from "../guides/guides-data.zh";
import { KitCard } from "../components/KitCard";
import { PromptBox } from "../components/PromptBox";
import { AiExamples } from "../components/AiExamples";
import { ZhShell } from "./_components/ZhShell";

export const metadata: Metadata = {
  title: "免费在线 Roblox GUI 制作器 | AI 生成、可视化编辑与 Luau/.rbxmx 导出",
  description:
    "免费 AI Roblox GUI 制作器：一句话描述界面，生成真实可编辑的 ScreenGui（不是图片），支持桌面/平板/手机预览、512×512 Gamepass 图标制作，导出干净 Luau 或原生 .rbxmx Studio 模型。",
  openGraph: {
    title: "免费在线 Roblox GUI 制作器 | AI 生成、可视化编辑与 Luau/.rbxmx 导出",
    description:
      "描述你的 Roblox 界面，得到真实可编辑的 ScreenGui、可用交互与干净 Luau，还支持原生 .rbxmx 拖入 Studio。免费、免登录。",
    url: "https://robloxguimaker.app/zh",
  },
  twitter: {
    card: "summary_large_image",
    title: "免费在线 Roblox GUI 制作器 | AI 生成、可视化编辑与 Luau/.rbxmx 导出",
    description:
      "描述你的 Roblox 界面，得到真实可编辑的 ScreenGui、可用交互与干净 Luau，还支持原生 .rbxmx 拖入 Studio。",
  },
  alternates: {
    canonical: "/zh",
    languages: {
      "x-default": "https://robloxguimaker.app",
      en: "https://robloxguimaker.app",
      zh: "https://robloxguimaker.app/zh",
    },
  },
};

const STEPS = [
  {
    n: "1",
    title: "AI 生成或拖拽搭建",
    body: "输入一句话 Prompt、套用现成模板，或从空白画布把 ScreenGui、Frame、TextButton 与布局容器拖进真实层级。",
  },
  {
    n: "2",
    title: "调 Roblox 原生属性并测多端",
    body: "修改 BackgroundColor3、UDim2 scale/offset、圆角、渐变与按钮动作，再切换桌面、平板和手机视口预览自适应效果。",
  },
  {
    n: "3",
    title: "导出 Luau 或原生 .rbxmx",
    body: "免费复制干净的客户端与服务端 Luau 放进 StarterGui 和 ServerScriptService，或用 Pro 导出原生 .rbxmx 直接拖进 Studio。",
  },
];

const PRODUCT_PROOFS = [
  { title: "响应式布局", body: "组合 scale 和 offset、锚点、宽高比和尺寸约束，适配桌面、平板和手机屏幕。" },
  { title: "交互预览", body: "导出前预览显示、隐藏、切换、RemoteEvent 和 Teleport 按钮动作。" },
  { title: "服务端安全动作", body: "为 RemoteEvent 和白名单内的 Teleport 动作生成独立的服务端处理器，带清晰的校验边界。" },
  { title: "Luau、ZIP 与 .rbxmx", body: "免费导出双端 Luau 与可二次编辑 JSON/ZIP；Pro 支持直接拖入 Studio 的原生 .rbxmx 模型。" },
];

const FAQS = [
  {
    question: "Roblox GUI Maker 免费吗？",
    answer:
      "核心功能完全免费。可视化编辑器、AI 界面生成、13 套单屏模板、512×512 Gamepass 图标制作器，以及客户端/服务端 Luau、JSON、ZIP 导出都免费且免登录。可选一次性购买 Pro 解锁原生 .rbxmx 模型导出和 6 套多屏 UI 套件。",
  },
  {
    question: "这和 AI 生图工具有什么区别？",
    answer:
      "AI 生图只会给一张扁平效果图。在这里输入描述，你拿到的是真实的 Roblox 实例树（ScreenGui、Frame、TextLabel、TextButton），能拖拽微调、在手机与电脑尺寸下实时预览，并直接导出生产级 Luau 或 .rbxmx。",
  },
  {
    question: "免费 Luau 导出和 Pro .rbxmx 导出有什么区别？",
    answer:
      "免费 Luau 导出会生成完整的 Instance.new 脚本，复制进 StarterGui 的 LocalScript 即可生成界面；Pro 原生 .rbxmx 导出则把整棵 ScreenGui 实例树（含 UDim2、圆角、渐变、描边、UIListLayout 与内嵌脚本）打包为 Roblox XML 模型文件，无需插件就能直接拖进 Studio。",
  },
  {
    question: "导出的文件怎么放进 Roblox Studio？",
    answer:
      "使用免费 Luau 时，在 StarterGui 下新建 LocalScript 粘贴客户端脚本，如有 RemoteEvent/Teleport 则把服务端脚本放进 ServerScriptService 的 Script。使用 .rbxmx 时，在 Studio 点 File → Import Roblox Model 或直接把文件拖到 Explorer 的 StarterGui 上。",
  },
  {
    question: "能导出哪些文件？",
    answer:
      "可复制或下载客户端 Luau、可选服务端 Luau、可重新导入继续修改的 JSON 场景、包含项目说明的 ZIP 包、512×512 PNG 通行证图标，以及 Pro 专属原生 .rbxmx 模型。",
  },
  {
    question: "能针对手机和平板设计自适应界面吗？",
    answer:
      "可以。内置桌面/平板/手机预览画布，并支持 UDim2 Scale/Offset、AnchorPoint、UIAspectRatioConstraint、UISizeConstraint、UIListLayout 与 UIGridLayout。",
  },
  {
    question: "编辑器会生成游戏逻辑与服务端校验吗？",
    answer:
      "会生成 UI 实例和交互接线，包括独立的 RemoteEvent 与 Teleport 服务端处理器及校验占位。经济数值、MarketplaceService 通行证校验、奖励与 DataStore 持久化仍需你按游戏规则完善。",
  },
  {
    question: "怎么做不会被裁切的 512×512 Gamepass 图标？",
    answer:
      "Roblox Store 会把正方形图标自动裁成圆形。用本站免费的 Gamepass 图标制作器，开启实时圆形安全区辅助线，确保角标和文字都在内圈以内，导出 512×512 PNG 后直接上传 Creator Hub。",
  },
  {
    question: "这是 Roblox 官方产品吗？",
    answer:
      "不是。Roblox GUI Maker 是独立的非官方创作工具，与 Roblox Corporation 无关，也未获其认可。",
  },
];

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Roblox GUI Maker",
  url: "https://robloxguimaker.app/zh",
  description:
    "免费在线的 Roblox GUI 可视化制作器与 AI 生成器。拖拽或一句话生成响应式 Roblox 界面，制作 512×512 Gamepass 图标，并导出干净 Luau 或原生 .rbxmx 给 Roblox Studio。",
  applicationCategory: "DesignApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  inLanguage: "zh-CN",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  featureList: [
    "一句话 AI 生成可编辑的 Roblox GUI 起点（非扁平图片）",
    "可视化拖拽的 Roblox GUI 编辑器",
    "带 scale、offset、锚点、宽高比和尺寸约束的响应式几何",
    "显示、隐藏、切换、RemoteEvent、Teleport 动作的交互预览",
    "RemoteEvent 与 Teleport 动作的服务端处理器",
    "版本化 JSON 与浏览器本地 ZIP 项目导出",
    "原生 Roblox Studio .rbxmx 模型导出（直接拖入 StarterGui）",
    "512×512 Roblox Gamepass 图标制作器（带圆形安全区实时预览）",
    "6 套 5 屏主题 Game UI Kits、13 套起步模板与 22 篇图文教程",
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function ZhHome() {
  return (
    <ZhShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }}
      />

      {/* hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-12 text-center">
        <p className="text-focus text-sm font-semibold uppercase tracking-wider mb-4">
          免费 · 免登录 · 可编辑 · 双端 Luau + .rbxmx
        </p>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-5">
          免费在线 Roblox GUI 制作器
        </h1>
        <p className="text-lg md:text-xl text-ink-dim max-w-2xl mx-auto mb-8">
          一句话描述你的 Roblox 界面，AI 生成真实可编辑的 ScreenGui
          —— 带可用的交互和干净的 Luau，不是一张效果图。
        </p>
        <PromptBox locale="zh" />
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <Link
            href="/editor"
            className="px-6 py-3 rounded-lg font-semibold border border-line hover:bg-raised transition"
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
        <p className="mt-4 text-xs sm:text-sm text-ink-dim">
          还提供：{" "}
          <Link
            href="/zh/gamepass-icon-maker"
            className="text-focus hover:underline font-medium"
          >
            免费 512×512 Gamepass 图标制作器
          </Link>{" "}
          ·{" "}
          <Link
            href="/zh/kits"
            className="text-focus hover:underline font-medium"
          >
            5 屏整套 UI 套件
          </Link>{" "}
          ·{" "}
          <Link
            href="/zh/pricing"
            className="text-focus hover:underline font-medium"
          >
            Studio 原生 .rbxmx 定价
          </Link>
        </p>
      </section>

      {/* hero preview + proofs */}
      <section className="max-w-4xl mx-auto px-6 pb-4">
        <div className="rounded-2xl ring-1 ring-line overflow-hidden shadow-2xl shadow-black/40">
          {(() => {
            const first = getTemplate(TEMPLATES_ZH[0].slug);
            return first ? <ScenePreview scene={first.scene} /> : null;
          })()}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
          {PRODUCT_PROOFS.map((proof) => (
            <article key={proof.title} className="rounded-xl border border-line bg-panel p-4">
              <h3 className="mb-1.5 text-sm font-semibold text-ink">{proof.title}</h3>
              <p className="text-xs leading-relaxed text-ink-dim">{proof.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* AI examples */}
      <AiExamples
        heading="AI 生成示例，打开即可编辑"
        subheading="下面每个示例都由对应 Prompt 生成，是真实的 Roblox 场景 —— 打开、任意修改、导出 Luau 或 .rbxmx。免费，无需账号。"
        openLabel="在编辑器中打开"
      />

      {/* how it works */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10">
          如何用三步做出可用的 Roblox GUI
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((s) => (
            <div key={s.n} className="rounded-xl bg-panel border border-line p-5">
              <div className="grid place-items-center w-8 h-8 rounded-lg bg-input text-focus font-bold mb-3">
                {s.n}
              </div>
              <h3 className="font-semibold mb-1.5">{s.title}</h3>
              <p className="text-sm text-ink-dim leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* use cases */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-3">
          覆盖每类 Roblox 游戏界面场景
        </h2>
        <p className="text-ink-dim text-center max-w-2xl mx-auto mb-10">
          商店、HUD、背包、主菜单、管理面板、加载界面 —— 每个场景都对应可直接编辑与导出的真实 Studio 实例结构。
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {USE_CASES.map((u) => {
            const localized = getUseCaseZh(u.slug) ?? u;
            const tpl = localized.template ? getTemplate(localized.template) : undefined;
            return (
              <Link
                key={u.slug}
                href={`/zh/for/${u.slug}`}
                className="group rounded-xl overflow-hidden ring-1 ring-line hover:ring-focus transition"
              >
                {tpl && <ScenePreview scene={tpl.scene} />}
                <div className="p-3 bg-panel">
                  <p className="text-sm font-medium text-ink">
                    {localized.noun}
                  </p>
                  <p className="text-xs text-ink-mute line-clamp-2">
                    {localized.blurb}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="text-center mt-6">
          <Link
            href="/zh/for"
            className="text-sm text-focus hover:underline font-medium"
          >
            浏览全部界面场景 →
          </Link>
        </div>
      </section>

      {/* game ui kits */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">
              整套游戏 UI 套件（Game UI Kits）
            </h2>
            <p className="text-sm text-ink-dim mt-1 max-w-md">
              统一主题的 5 屏界面组合 —— 主菜单、商店、HUD、背包与每日奖励。免费试用单屏 Luau 导出，或用 Pro 一键下载整套 Studio .rbxmx 包。
            </p>
          </div>
          <Link href="/zh/kits" className="text-sm text-focus hover:underline font-medium">
            全部套件 →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {KITS.map((kit) => {
            const localized = getKitZh(kit.slug) ?? kit;
            return <KitCard key={kit.slug} kit={localized} locale="zh" />;
          })}
        </div>
      </section>

      {/* gamepass icon maker callout */}
      <section className="max-w-6xl mx-auto px-6 py-6">
        <div className="rounded-2xl border border-focus/40 bg-panel p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-focus mb-2">
              免费工具 · 512×512 PNG · 圆形安全区校验
            </p>
            <h2 className="text-xl md:text-2xl font-semibold text-ink mb-2">
              Roblox Gamepass 图标制作器 —— 告别商店圆框裁切边角
            </h2>
            <p className="text-sm text-ink-dim leading-relaxed">
              Roblox 商店页会自动把正方形 Gamepass 缩略图裁成圆形。先在浏览器里叠加圆形安全区参考线排版角标、射线光效和配色，一键导出高清 512×512 PNG。
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/zh/gamepass-icon-maker"
              className="px-5 py-3 rounded-lg font-semibold bg-primary text-on-primary hover:brightness-110 transition text-sm"
            >
              免费制作图标 →
            </Link>
            <Link
              href="/zh/guides/how-to-make-roblox-gamepass-icons"
              className="px-4 py-3 rounded-lg font-medium border border-line hover:bg-raised transition text-sm"
            >
              查看 512×512 尺寸指南
            </Link>
          </div>
        </div>
      </section>

      {/* templates strip */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold">从模板开始</h2>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/zh/for" className="text-ink-dim hover:text-ink">
              按场景筛选
            </Link>
            <Link href="/zh/templates" className="text-focus hover:underline">
              全部模板 →
            </Link>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEMPLATES_ZH.map((t) => {
            const en = getTemplate(t.slug);
            return (
              <Link
                key={t.slug}
                href={`/zh/templates/${t.slug}`}
                className="group rounded-xl overflow-hidden ring-1 ring-line hover:ring-focus transition"
              >
                {en && <ScenePreview scene={en.scene} />}
                <div className="p-3 bg-panel">
                  <p className="text-sm font-medium text-ink">
                    {t.title.replace("Roblox ", "").replace(" GUI", "")}
                  </p>
                  <p className="text-xs text-ink-mute">{t.tagline}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* guides strip */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">
              Roblox GUI 图文教程与指南
            </h2>
            <p className="text-sm text-ink-dim mt-1 max-w-md">
              从主菜单、商店、背包、通行证图标制作到 Studio .rbxmx 导入的实战分步教程，每篇都附带可直接在编辑器打开的模板。
            </p>
          </div>
          <Link href="/zh/guides" className="text-sm text-focus hover:underline font-medium">
            全部教程 →
          </Link>
        </div>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {GUIDES.map((g) => {
            const localized = getGuideZh(g.slug) ?? g;
            return (
              <li key={g.slug}>
                <Link
                  href={`/zh/guides/${g.slug}`}
                  className="block rounded-xl border border-line bg-panel hover:border-focus p-4 transition h-full"
                >
                  <p className="text-xs text-focus font-semibold uppercase tracking-wider mb-1">
                    {localized.category}
                  </p>
                  <p className="text-sm font-medium text-ink leading-snug">
                    {localized.title}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* SEO body */}
      <section className="max-w-3xl mx-auto px-6 py-16 space-y-5 text-ink-dim leading-relaxed">
        <h2 className="text-2xl font-semibold text-ink">Roblox GUI 是什么？</h2>
        <p>
          Roblox 里的 GUI（图形界面）是叠在游戏画面上的 2D 层 —— 主菜单、血条、商店、背包、设置、加载界面、HUD
          都算。底层由 <code className="text-focus">ScreenGui</code>、<code className="text-focus">Frame</code>、
          <code className="text-focus">TextButton</code> 和 <code className="text-focus">TextLabel</code> 等实例构成，用 UDim2 的比例定位，所以能适配各种屏幕。一个{" "}
          <strong>Roblox GUI 制作器</strong>或<strong>Roblox GUI 生成器</strong>让你可视化地搭建这些界面，不必在 Studio 里手改每一个属性。
        </p>

        <h2 className="text-2xl font-semibold text-ink pt-4">为什么在 Studio 里做 GUI 很慢</h2>
        <p>
          Studio 自带的 UI 编辑器是开发者吐槽最多的部分。手动放每一个 Frame、反复调 UDim2
          偏移、每个游戏都重建一样的菜单结构，尤其对 Solo 开发者和刚学脚本的新人来说特别磨人。这种摩擦正是一个专业的{" "}
          <strong>Roblox GUI 构建器</strong>要消除的。像这样的<strong>在线 Roblox GUI 编辑器</strong>让你无需打开 Studio，在浏览器里就能完成设计、多端预览与导出。
        </p>

        <h2 className="text-2xl font-semibold text-ink pt-4">这个工具和别的有什么不同</h2>
        <p>
          很多“AI 做 GUI”的工具吐出来的只是静态图片或占位矩形，你还得自己重画一遍。我们正好相反：一个精确的可视化画布，所有属性名和
          Roblox 完全一致（BackgroundColor3、BackgroundTransparency、ZIndex），可以嵌套容器、用{" "}
          <Link
            href="/zh/guides/how-to-use-uilistlayout-in-roblox"
            className="text-focus hover:underline"
          >
            UIListLayout
          </Link>{" "}
          / UIGridLayout 自动排列、加圆角渐变，并直接预览桌面和手机效果。
        </p>

        <h2 className="text-2xl font-semibold text-ink pt-4">如何把导出的 GUI 导入 Roblox Studio（Luau 与 .rbxmx）</h2>
        <p>
          免费导出干净的客户端与服务端 Luau：客户端脚本粘进 <code className="text-focus">StarterGui</code> 下的{" "}
          <code className="text-focus">LocalScript</code>，若包含 RemoteEvent 或 Teleport 动作，再把独立生成的服务端脚本放进{" "}
          <code className="text-focus">ServerScriptService</code>。如果你想跳过脚本创建流程，一次性升级{" "}
          <Link href="/zh/pricing" className="text-focus hover:underline">
            Pro 通行证
          </Link>{" "}
          即可导出原生 <code className="text-focus">.rbxmx</code> 模型，按{" "}
          <Link
            href="/zh/guides/how-to-import-rbxmx-into-roblox-studio"
            className="text-focus hover:underline"
          >
            Studio .rbxmx 导入教程
          </Link>{" "}
          直接拖进 StarterGui。
        </p>

        <h2 className="text-2xl font-semibold text-ink pt-4">适合谁</h2>
        <p>
          想做好看的菜单又不想和 Studio 属性栏较劲的新手；想几分钟而不是一小时就搭好商店或 HUD
          的老手；以及需要顺便配色与对齐 512×512 Gamepass 通行证图标的独立作者。它免费、免登录、在浏览器里即开即用，帮你更快交付精致界面。
        </p>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <h2 className="mb-8 text-2xl font-semibold text-ink md:text-3xl">关于 Roblox GUI Maker 的常见问题</h2>
        <div className="space-y-3">
          {FAQS.map((item) => (
            <details key={item.question} className="rounded-xl border border-line bg-panel">
              <summary className="cursor-pointer px-5 py-4 font-semibold text-ink marker:text-focus">
                {item.question}
              </summary>
              <p className="px-5 pb-5 text-sm leading-relaxed text-ink-dim">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </ZhShell>
  );
}
