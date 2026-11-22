import type { Metadata } from "next";
import Link from "next/link";
import { ZhShell } from "../_components/ZhShell";
import { ThumbnailMaker } from "../../tools/thumbnail/ThumbnailMaker";

const PAGE_URL = "https://robloxguimaker.app/zh/roblox-thumbnail-maker";
const EN_URL = "https://robloxguimaker.app/roblox-thumbnail-maker";

export const metadata: Metadata = {
  title: "Roblox 游戏封面生成器 — 1920×1080 缩略图安全区预览与 512×512 图标裁剪",
  description:
    "免费制作高点击率 1920×1080 Roblox 游戏封面图。内置发现页 220px 小卡效果、角落安全区参考线、Asset ID 底图拉取，以及配套 512×512 方形游戏图标一键导出。",
  alternates: {
    canonical: "/zh/roblox-thumbnail-maker",
    languages: {
      en: EN_URL,
      zh: PAGE_URL,
      "x-default": EN_URL,
    },
  },
  openGraph: {
    title: "Roblox 游戏封面生成器 — 1920×1080 + 512×512 安全区工作台",
    description:
      "在浏览器内实时校验 Roblox Discover 小卡缩略图与安全区避让，一键导出高清 1920×1080 封面与 512×512 图标。",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    q: "Roblox 官方推荐的游戏封面和游戏图标尺寸是多少？",
    a: "横版游戏宣传图/封面建议使用 1920×1080（16:9），方形游戏主图标建议使用 512×512（1:1）。本工具支持在同一构图下同时导出这两种分辨率。",
  },
  {
    q: "为什么要开启 Discover 安全区参考线检查？",
    a: "在 Roblox 首页和推荐流里，封面往往会被缩放到约 220px 宽，并且四角可能叠加徽章或标签。把核心标题放在中心安全区内能避免文字被裁切或缩小时糊成一团。",
  },
  {
    q: "可以把 Studio 截图或 Roblox Asset ID 直接拿来当背景吗？",
    a: "可以。拖入本地 PNG/JPG/WebP 截图，或输入数字 Asset ID / rbxassetid:// 链接通过站内代理拉取预览图即可。",
  },
  {
    q: "导出 1920×1080 图片有水印或次数限制吗？",
    a: "没有。纯浏览器 Canvas 合成，无水印免费导出标准 1920×1080 PNG 和 512×512 方形图标。",
  },
];

const SCHEMA_GRAPH = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Roblox 游戏封面生成器",
      applicationCategory: "DesignApplication",
      operatingSystem: "Any (Web Browser)",
      url: PAGE_URL,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description:
        "免费在线 Roblox 1920×1080 游戏封面制作工具，提供 Discover 220px 小卡预览、安全区检测与 512×512 图标联动裁剪。",
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ],
};

export default function ZhRobloxThumbnailMakerPage() {
  return (
    <ZhShell>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA_GRAPH) }}
        />

        <div className="mb-8">
          <p className="text-xs font-mono uppercase tracking-wider text-focus mb-2">
            1920×1080 封面与 512×512 图标工作台
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink mb-3">
            Roblox 游戏封面生成器与安全区检查器
          </h1>
          <p className="text-base text-ink-dim max-w-3xl leading-relaxed">
            一站式制作 <span className="font-mono text-ink">1920×1080</span> 游戏封面，实时模拟
            Discover <span className="font-mono text-ink">220px</span> 推荐卡片缩略效果与{" "}
            <span className="font-mono text-ink">512×512</span> 方形图标裁切，浏览器无水印直接导出。
          </p>
        </div>

        <ThumbnailMaker locale="zh" />

        <section className="mt-14 pt-10 border-t border-line">
          <h2 className="text-2xl font-semibold text-ink mb-6">打造高点击 Roblox 封面的 4 个步骤</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: "01",
                title: "导入实机截图或 Asset ID",
                body: "拖入 Roblox Studio 实机渲染截图，或通过 Asset ID 拉取贴图作为主视觉背景。",
              },
              {
                step: "02",
                title: "套用高对比题材预设",
                body: "一键切换 Simulator、Horror、Anime RNG 或 Obby 配色方案，并调整径向光效与暗角压暗。",
              },
              {
                step: "03",
                title: "核对 220px 小卡与避让区",
                body: "开启安全区参考线，在 220px 缩小卡片中确认大标题清晰醒目且不被角落角标遮挡。",
              },
              {
                step: "04",
                title: "同时导出 16:9 与 1:1 PNG",
                body: "分别导出 1920×1080 主封面图和居中裁切的 512×512 方形游戏图标。",
              },
            ].map((card) => (
              <div key={card.step} className="rounded-xl border border-line bg-panel p-5">
                <span className="text-xs font-mono text-focus">{card.step}</span>
                <h3 className="text-base font-semibold text-ink mt-1 mb-2">{card.title}</h3>
                <p className="text-sm text-ink-dim leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 pt-10 border-t border-line">
          <h2 className="text-2xl font-semibold text-ink mb-6">常见问题</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {FAQ_ITEMS.map((item) => (
              <div key={item.q} className="rounded-xl border border-line bg-panel p-5">
                <h3 className="text-sm font-semibold text-ink mb-2">{item.q}</h3>
                <p className="text-sm text-ink-dim leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 pt-8 border-t border-line flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-ink">继续完善你的 Roblox 商业化套件</h2>
            <p className="text-sm text-ink-dim">
              配合 Gamepass 徽章制作器、UDim2 屏幕适配器和可视化 GUI 编辑器，快速上线完整项目。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/zh/gamepass-icon-maker"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:opacity-90"
            >
              Gamepass 图标制作器 →
            </Link>
            <Link
              href="/zh/roblox-shirt-tester"
              className="rounded-lg border border-line bg-panel px-4 py-2 text-sm font-medium text-ink hover:bg-raised"
            >
              3D 服装测试器
            </Link>
            <Link
              href="/editor"
              className="rounded-lg border border-line bg-panel px-4 py-2 text-sm font-medium text-ink hover:bg-raised"
            >
              GUI 编辑器
            </Link>
          </div>
        </section>
      </div>
    </ZhShell>
  );
}
