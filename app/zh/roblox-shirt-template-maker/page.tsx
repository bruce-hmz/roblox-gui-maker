import type { Metadata } from "next";
import Link from "next/link";
import { ZhShell } from "../_components/ZhShell";
import { ShirtStudio } from "../../tools/shirt/ShirtStudio";

const PAGE_URL = "https://robloxguimaker.app/zh/roblox-shirt-template-maker";
const EN_URL = "https://robloxguimaker.app/roblox-shirt-template-maker";

export const metadata: Metadata = {
  title: "Roblox 服装模板生成器 — 在线制作标准 585×559 上衣与裤子 PNG",
  description:
    "免费制作并导出标准 585×559 Roblox 经典上衣与裤子 PNG 模板。支持透明领口裁剪、袖边条纹、胸前徽章、UV 参考线叠加及实时 3D 预览。",
  alternates: {
    canonical: "/zh/roblox-shirt-template-maker",
    languages: {
      en: EN_URL,
      zh: PAGE_URL,
      "x-default": EN_URL,
    },
  },
  openGraph: {
    title: "Roblox 服装模板生成器 — 585×559 PNG & SVG 一键导出",
    description:
      "内置多套服装配色与实时 3D R6 试穿，无水印导出符合 Roblox 官方 UV 规格的透明底模板。",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    q: "导出的 PNG 模板会自动保留官方透明边缘吗？",
    a: "是的。关闭「UV 参考线」开关后导出 PNG，18 个身体区域之外的像素均为完全透明，分辨率精准锁定在 585×559。",
  },
  {
    q: "可以把生成的模板继续放进 PS 或 Figma 细化吗？",
    a: "可以。点击导出 SVG 即可获得严格对齐 585×559 坐标的矢量图层，方便你在外部软件里继续加阴影和细节纹理。",
  },
  {
    q: "上衣（Shirt）和裤子（Pants）都可以制作吗？",
    a: "可以。在面板顶部切换上衣或裤子模式，两者的 585×559 UV 布局与导出规范完全兼容 Roblox 官方标准。",
  },
  {
    q: "画完图之后怎么检查背面和胳膊内侧有没有对错？",
    a: "切换到同一页面顶部的「3D 试穿测试」或打开服装测试器页，把修改后的 PNG 拖入即可实时旋转查看所有面。",
  },
];

const SCHEMA_GRAPH = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Roblox 服装模板生成器",
      applicationCategory: "DesignApplication",
      operatingSystem: "Any (Web Browser)",
      url: PAGE_URL,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description:
        "在线生成 585×559 Roblox 经典上衣与裤子 PNG/SVG 模板，带实时 3D R6 预览与 UV 参考线开关。",
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

export default function ZhRobloxShirtTemplateMakerPage() {
  return (
    <ZhShell>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA_GRAPH) }}
        />

        <div className="mb-8">
          <p className="text-xs font-mono uppercase tracking-wider text-focus mb-2">
            585×559 服装底板生成器
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink mb-3">
            Roblox 服装模板生成器
          </h1>
          <p className="text-base text-ink-dim max-w-3xl leading-relaxed">
            零门槛生成 <span className="font-mono text-ink">585×559</span> 标准 Roblox
            上衣/裤子模板，支持领口抠空、配色预设、UV 区域标注和右侧 3D R6 实时联动预览，无水印导出。
          </p>
        </div>

        <ShirtStudio defaultMode="maker" locale="zh" />

        <section className="mt-14 pt-10 border-t border-line">
          <h2 className="text-2xl font-semibold text-ink mb-6">四步制作并导出 Roblox 服装模板</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: "01",
                title: "选择品类与预设风格",
                body: "先选上衣或裤子，再一键套用卫衣、潮牌夹克、战术服或学院外套配色。",
              },
              {
                step: "02",
                title: "定制领口、滚边与徽章",
                body: "自由调整圆领/V领/连帽领口，配置主色、副色、袖边条纹及胸前徽章图案。",
              },
              {
                step: "03",
                title: "3D 素体实时同步",
                body: "任何参数改动都会同步渲染到 585×559 平面图与右侧可拖拽 3D R6 模型上。",
              },
              {
                step: "04",
                title: "导出纯净透明 PNG",
                body: "正式导出前取消勾选「UV 参考线」，即可得到可直接上传或二次加工的标准 585×559 PNG。",
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
            <h2 className="text-base font-semibold text-ink">已经画好成品图？直接 3D 试穿</h2>
            <p className="text-sm text-ink-dim">
              也可以顺便检查你的游戏封面安全区，或把 UI 尺寸换算成全屏幕适配 UDim2。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/zh/roblox-shirt-tester"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:opacity-90"
            >
              3D 服装试穿器 →
            </Link>
            <Link
              href="/zh/roblox-ui-sizer"
              className="rounded-lg border border-line bg-panel px-4 py-2 text-sm font-medium text-ink hover:bg-raised"
            >
              UDim2 尺寸换算器
            </Link>
            <Link
              href="/zh/gamepass-icon-maker"
              className="rounded-lg border border-line bg-panel px-4 py-2 text-sm font-medium text-ink hover:bg-raised"
            >
              通行证图标制作器
            </Link>
          </div>
        </section>
      </div>
    </ZhShell>
  );
}
