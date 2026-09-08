import type { Metadata } from "next";
import Link from "next/link";
import { ScenePreview } from "../editor/ScenePreview";
import { getTemplate } from "../editor/templates";
import { TEMPLATES_ZH } from "../editor/templates.zh";
import { PromptBox } from "../components/PromptBox";
import { AiExamples } from "../components/AiExamples";
import { ZhShell } from "./_components/ZhShell";

export const metadata: Metadata = {
  title: "免费在线 Roblox GUI 制作器 | AI 生成 + 可视化编辑",
  description:
    "免费 AI Roblox GUI 制作器:一句话描述界面,生成真实可编辑的 GUI(不是图片),可视化调整后导出干净的客户端 + 服务端 Luau、JSON 或 ZIP。免登录。",
  openGraph: {
    title: "免费在线 Roblox GUI 制作器 | AI 生成 + 可视化编辑",
    description:
      "描述你的 Roblox 界面,得到真实可编辑的 GUI 和干净的 Luau —— 再可视化修改每个细节。免费、免登录。",
    url: "https://robloxguimaker.app/zh",
  },
  twitter: {
    card: "summary_large_image",
    title: "免费在线 Roblox GUI 制作器 | AI 生成 + 可视化编辑",
    description:
      "描述你的 Roblox 界面,得到真实可编辑的 GUI 和干净的 Luau —— 再可视化修改每个细节。免费、免登录。",
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
  { n: "1", title: "拖拽搭建", body: "把 ScreenGui、Frame、TextButton、TextLabel 等拖到画布上,嵌套容器、四角缩放、任意位置摆放。" },
  { n: "2", title: "调属性", body: "直接编辑 Roblox 原生属性 —— BackgroundColor3、透明度、字体、字号、圆角。全是你在 Studio 里熟悉的名字。" },
  { n: "3", title: "导出干净 Luau", body: "复制生产可用的 Luau,用 Instance.new 和 UDim2 重建你的 GUI,连按钮点击事件都生成好。粘进 LocalScript 就能跑。" },
];

const PRODUCT_PROOFS = [
  { title: "响应式布局", body: "组合 scale 和 offset、锚点、宽高比和尺寸约束,适配桌面、平板和手机屏幕。" },
  { title: "交互预览", body: "导出前预览显示、隐藏、切换、RemoteEvent 和 Teleport 按钮动作。" },
  { title: "服务端安全动作", body: "为 RemoteEvent 和白名单内的 Teleport 动作生成独立的服务端处理器,带清晰的校验边界。" },
  { title: "ZIP + JSON 导出", body: "下载完整的项目包,或保存可重新导入编辑器的版本化场景文档。" },
];

const FAQS = [
  {
    question: "Roblox GUI Maker 免费吗?",
    answer:
      "免费。编辑器免费、无需账号,项目数据只存在你的浏览器里,除非你主动下载。",
  },
  {
    question: "能导出哪些文件?",
    answer:
      "可以复制或下载客户端 Luau、下载可选的服务端 Luau、导出可编辑的 JSON 场景,或下载包含项目文件和说明的 ZIP 压缩包。",
  },
  {
    question: "能针对手机和平板设计吗?",
    answer:
      "可以。设备预览和响应式几何控制覆盖 scale、offset、锚点、宽高比和尺寸约束。",
  },
  {
    question: "编辑器会生成游戏逻辑吗?",
    answer:
      "它生成 UI 实例和选中的交互接线,包括独立的 RemoteEvent 和 Teleport 服务端处理器。安全的经济、购买、奖励、权限与 datastore 校验仍由你负责。",
  },
  {
    question: "生成的脚本在 Roblox Studio 里放哪?",
    answer:
      "客户端 Luau 放在 StarterGui 下的 LocalScript 里。生成的服务端 Luau 放在 ServerScriptService 下的 Script 里。",
  },
  {
    question: "这是 Roblox 官方产品吗?",
    answer:
      "不是。Roblox GUI Maker 是独立的非官方创作工具,与 Roblox Corporation 无关,也未获其认可。",
  },
];

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Roblox GUI Maker",
  url: "https://robloxguimaker.app/zh",
  description:
    "免费在线的 Roblox GUI 可视化制作器与生成器。拖拽搭建响应式 Roblox 界面,预览交互,导出干净的 Luau 给 Roblox Studio。",
  applicationCategory: "DesignApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  inLanguage: "zh-CN",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  featureList: [
    "可视化拖拽的 Roblox GUI 编辑器",
    "带 scale、offset、锚点、宽高比和尺寸约束的响应式几何",
    "显示、隐藏、切换、RemoteEvent、Teleport 动作的交互预览",
    "RemoteEvent 与 Teleport 动作的服务端处理器",
    "版本化 JSON 项目的导入与导出",
    "浏览器本地的 ZIP 项目导出",
    "Roblox GUI 模板与教程",
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
          免费 · 免登录 · 可编辑 · 双端 Luau
        </p>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-5">
          免费在线 Roblox GUI 制作器
        </h1>
        <p className="text-lg md:text-xl text-ink-dim max-w-2xl mx-auto mb-8">
          一句话描述你的 Roblox 界面,AI 生成真实可编辑的 GUI
          —— 带可用的交互和干净的 Luau,不是一张效果图。
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
        heading="AI 生成示例,打开即可编辑"
        subheading="下面每个示例都由对应 Prompt 生成,是真实的 Roblox 场景 —— 打开、任意修改、导出 Luau。免费,无需账号。"
        openLabel="在编辑器中打开"
      />

      {/* how it works */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10">
          三步从空白到可用 GUI
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

      {/* templates strip */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold">从模板开始</h2>
          <Link href="/zh/templates" className="text-sm text-focus hover:underline">
            全部模板 →
          </Link>
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

      {/* SEO body */}
      <section className="max-w-3xl mx-auto px-6 py-16 space-y-5 text-ink-dim leading-relaxed">
        <h2 className="text-2xl font-semibold text-ink">Roblox GUI 是什么?</h2>
        <p>
          Roblox 里的 GUI(图形界面)是叠在游戏画面上的 2D 层 —— 主菜单、血条、商店、背包、设置、加载界面、HUD
          都算。底层由 ScreenGui、Frame、TextButton、TextLabel 等实例构成,用 UDim2 的比例定位,所以能适配各种屏幕。一个{" "}
          <strong>Roblox GUI 制作器</strong>或<strong>Roblox GUI 生成器</strong>让你可视化地搭建这些界面,不必在 Studio 里手改每一个属性。
        </p>

        <h2 className="text-2xl font-semibold text-ink pt-4">为什么在 Studio 里做 GUI 很慢</h2>
        <p>
          Studio 自带的 UI 编辑器是开发者吐槽最多的部分。手动放每一个 Frame、反复调 UDim2
          偏移、每个游戏都重建一样的菜单结构,尤其对 Solo 开发者和刚学脚本的新人来说特别磨人。这种摩擦正是一个专业的{" "}
          <strong>Roblox GUI 构建器</strong>要消除的。像这样的<strong>在线 Roblox GUI 编辑器</strong>让你无需安装 Studio,在任何设备上都能设计和导出。
        </p>

        <h2 className="text-2xl font-semibold text-ink pt-4">这个工具和别的有什么不同</h2>
        <p>
          很多“AI 做 GUI”的工具吐出来的是占位布局,你还得自己收拾。我们正好相反:一个精确的可视化画布,你完全掌控。属性名和
          Roblox 完全一致(BackgroundColor3、BackgroundTransparency、ZIndex),可以嵌套容器、用{" "}
          <Link
            href="/zh/guides/how-to-use-uilistlayout-in-roblox"
            className="text-focus hover:underline"
          >
            UIListLayout
          </Link>
          /UIGridLayout
          自动排列、加圆角和渐变,导出的 Luau 干净到能直接发版 —— 真实的 Instance.new、UDim2.new
          定位,还带按钮的点击事件。
        </p>

        <h2 className="text-2xl font-semibold text-ink pt-4">适合谁</h2>
        <p>
          想做好看的菜单又不想和 Studio 检查器较劲的新手;想几分钟而不是一小时就搭好商店或 HUD
          的老手;以及任何更愿意可视化设计 GUI、再交出干净 Luau
          的人。它免费、在浏览器里跑、从不要求你注册。无论你叫它 <strong>Roblox GUI 制作器</strong>、
          <strong>Roblox UI 构建器</strong>,还是<strong>在线 Roblox GUI 编辑器</strong> —— 目标都一样:更快地做出精致的界面。
        </p>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <h2 className="mb-8 text-2xl font-semibold text-ink md:text-3xl">常见问题</h2>
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
