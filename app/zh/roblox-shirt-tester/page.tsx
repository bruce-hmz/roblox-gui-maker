import type { Metadata } from "next";
import Link from "next/link";
import { ZhShell } from "../_components/ZhShell";
import { ShirtStudio } from "../../tools/shirt/ShirtStudio";

const PAGE_URL = "https://robloxguimaker.app/zh/roblox-shirt-tester";
const EN_URL = "https://robloxguimaker.app/roblox-shirt-tester";

export const metadata: Metadata = {
  title: "Roblox 服装 3D 预览测试器 — 585×559 上衣与裤子试穿检查（免花 10 Robux）",
  description:
    "免费在线 Roblox 服装 3D 测试器。拖入 585×559 PNG 服装模板，在支付 10 Robux 上传费之前实时检查 R6 角色正面、背面、衣袖接缝与领口透空效果。",
  alternates: {
    canonical: "/zh/roblox-shirt-tester",
    languages: {
      en: EN_URL,
      zh: PAGE_URL,
      "x-default": EN_URL,
    },
  },
  openGraph: {
    title: "Roblox 服装 3D 预览测试器 — 上传前检查 585×559 接缝",
    description:
      "浏览器本地切片预览 585×559 Roblox 上衣/裤子模板，支持 R6 360° 拖拽旋转、多肤色与多光照切换。",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    q: "为什么上传 Roblox 服装前需要先做 3D 测试？",
    a: "每次上传 Roblox 经典上衣或裤子都需要花费 10 Robux。先在浏览器里用 3D R6 角色试穿预览，可以提前发现袖口反向、侧缝错位或领口裁剪异常，避免返工浪费 Robux。",
  },
  {
    q: "Roblox 经典服装模板的固定尺寸是多少？",
    a: "无论是上衣（Shirt）还是裤子（Pants），官方要求 PNG 画布严格为 585×559 像素。尺寸不符会被 Creator Hub 拒绝上传。",
  },
  {
    q: "上传试穿的 PNG 会发送到服务器吗？",
    a: "不会。图像读取、UV 切片与 3D 贴图映射全部在浏览器本地完成，你的设计稿不会离开当前设备。",
  },
  {
    q: "如果还没有做好的 PNG 模板怎么办？",
    a: "直接切换到上方的「模板制作器」标签页，或打开专门的 Roblox 服装模板生成器导出标准 585×559 PNG。",
  },
];

const SCHEMA_GRAPH = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Roblox 服装 3D 预览测试器",
      applicationCategory: "DesignApplication",
      operatingSystem: "Any (Web Browser)",
      url: PAGE_URL,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description:
        "在线 3D R6 Roblox 服装试穿与 585×559 UV 接缝校验工具，上传付费前零成本预览。",
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

export default function ZhRobloxShirtTesterPage() {
  return (
    <ZhShell>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA_GRAPH) }}
        />

        <div className="mb-8">
          <p className="text-xs font-mono uppercase tracking-wider text-focus mb-2">
            免费 Roblox 创作者工具
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink mb-3">
            Roblox 服装 3D 预览测试器
          </h1>
          <p className="text-base text-ink-dim max-w-3xl leading-relaxed">
            拖入 <span className="font-mono text-ink">585×559</span> 经典上衣或裤子 PNG，在花 10
            Robux 提交审核前，直接用 3D R6 素体检查正面、背面、衣袖和领口贴合效果。
          </p>
        </div>

        <ShirtStudio defaultMode="tester" locale="zh" />

        <section className="mt-14 pt-10 border-t border-line">
          <h2 className="text-2xl font-semibold text-ink mb-6">四步完成服装接缝自检</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: "01",
                title: "拖入 585×559 PNG",
                body: "导入你绘制好的经典衬衫或裤子图片，工具会自动核验是否为官方标准的 585×559 分辨率。",
              },
              {
                step: "02",
                title: "360° 旋转检查接缝",
                body: "鼠标拖拽或使用正面/背面/侧面快捷视角按钮，仔细核对躯干与左右手臂衔接处是否对齐。",
              },
              {
                step: "03",
                title: "切换肤色与环境光",
                body: "在浅色、暖黄、小麦色与深色肤色以及影棚/日光/夜场光照下确认透空领口与袖口表现。",
              },
              {
                step: "04",
                title: "核对 18 块 UV 切片",
                body: "下方 UV 面板实时展示 Front/Back/L/R/Up/Down 18 个切块，确认无误再上传 Creator Hub。",
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
            <h2 className="text-base font-semibold text-ink">需要快速生成一份标准 585×559 底板？</h2>
            <p className="text-sm text-ink-dim">
              一键配置领口、袖边、徽章与 UV 参考线，直接导出标准 PNG 与 SVG。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/zh/roblox-shirt-template-maker"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:opacity-90"
            >
              打开模板生成器 →
            </Link>
            <Link
              href="/zh/roblox-thumbnail-maker"
              className="rounded-lg border border-line bg-panel px-4 py-2 text-sm font-medium text-ink hover:bg-raised"
            >
              1920×1080 封面生成器
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
