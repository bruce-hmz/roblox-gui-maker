import type { Metadata } from "next";
import Link from "next/link";
import { ZhShell } from "../_components/ZhShell";
import { UiSizerTool } from "../../tools/ui-sizer/UiSizerTool";

const PAGE_URL = "https://robloxguimaker.app/zh/roblox-ui-sizer";
const EN_URL = "https://robloxguimaker.app/roblox-ui-sizer";

export const metadata: Metadata = {
  title: "Roblox UDim2 尺寸换算器 — Offset 转 Scale 响应式代码与贴图 ID 预览",
  description:
    "将设计稿像素 Offset 快速换算为适配多分辨率的 Roblox UDim2.fromScale 坐标，实时对比电脑、手机与平板尺寸，生成 UIAspectRatioConstraint Luau 代码并在线预览 rbxassetid:// 贴图。",
  alternates: {
    canonical: "/zh/roblox-ui-sizer",
    languages: {
      en: EN_URL,
      zh: PAGE_URL,
      "x-default": EN_URL,
    },
  },
  openGraph: {
    title: "Roblox UDim2 尺寸换算器与 Asset ID 贴图预览",
    description:
      "告别手机端 UI 溢出变形：像素秒转 UDim2 Scale，一键复制约束脚本，并即时反查 rbxassetid:// 贴图。",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    q: "为什么纯像素 Offset 做的 UI 到手机和平板上会变形或跑出屏幕？",
    a: "Offset 是固定像素值。1080p 电脑上占一半宽度的 960px 弹窗，在 844×390 横屏手机上就会直接撑爆屏幕。将坐标与尺寸换成 Scale 比例才能跨设备自适应。",
  },
  {
    q: "什么时候需要在 Scale 之外加 UIAspectRatioConstraint？",
    a: "凡是正方形背包格、图标按钮或需要保持固定长宽比的商店弹窗，在 16:9 电脑与 4:3 平板间切换时都应配合中心 AnchorPoint(0.5, 0.5) 与 UIAspectRatioConstraint 防拉伸。",
  },
  {
    q: "贴图 / Asset ID 预览器支持哪些输入格式？",
    a: "支持纯数字 ID（如 10681845694）以及完整 rbxassetid:// 路径，输入后会调用 Roblox 官方缩略图接口返回实时图片预览。",
  },
  {
    q: "想可视化拖拽整套界面而不是一个个手动算数字怎么办？",
    a: "可以直接进入本网站的 GUI 可视化编辑器，用 AI 生成或模板搭好界面后，一键导出 Luau 脚本、Studio .rbxmx 或通过离线插件同步进 Studio。",
  },
];

const SCHEMA_GRAPH = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Roblox UDim2 尺寸换算器与 Asset ID 预览器",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any (Web Browser)",
      url: PAGE_URL,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description:
        "免费在线 Roblox UDim2 Offset 转 Scale 工具，生成 UIAspectRatioConstraint Luau 代码并预览 rbxassetid 贴图。",
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

export default function ZhRobloxUiSizerPage() {
  return (
    <ZhShell>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA_GRAPH) }}
        />

        <div className="mb-8">
          <p className="text-xs font-mono uppercase tracking-wider text-focus mb-2">
            响应式 UI 与贴图辅助工具
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink mb-3">
            Roblox UDim2 尺寸换算器与 Asset ID 预览
          </h1>
          <p className="text-base text-ink-dim max-w-3xl leading-relaxed">
            把 Figma 或 PS 像素坐标一键换算为跨端适配的{" "}
            <span className="font-mono text-ink">UDim2.fromScale</span>，对比 1080p、手机与平板效果，复制带{" "}
            <span className="font-mono text-ink">UIAspectRatioConstraint</span> 的 Luau
            脚本并实时验证 <span className="font-mono text-ink">rbxassetid://</span> 图像。
          </p>
        </div>

        <UiSizerTool locale="zh" />

        <section className="mt-14 pt-10 border-t border-line">
          <h2 className="text-2xl font-semibold text-ink mb-6">4 步搞定 Roblox 全屏幕适配</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: "01",
                title: "选定设计稿基准分辨率",
                body: "选择与你的 UI 设计稿一致的参考画布（如 1920×1080 桌面端或 1280×720）。",
              },
              {
                step: "02",
                title: "填入像素 X / Y / 宽 / 高",
                body: "输入控件左上角位置和宽高，并按需开启中心锚点 AnchorPoint(0.5, 0.5)。",
              },
              {
                step: "03",
                title: "同步对比三端像素表现",
                body: "直接查看同一 Scale 参数在 1080p 桌面、横屏手机与 4:3 iPad 上的实际尺寸。",
              },
              {
                step: "04",
                title: "复制约束代码与查图",
                body: "复制包含比例约束和最小最大尺寸限制的 Luau，顺手在下方验证你的贴图 Asset ID。",
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
            <h2 className="text-base font-semibold text-ink">需要整套界面的可视化搭建与导出？</h2>
            <p className="text-sm text-ink-dim">
              打开 GUI 可视化编辑器生成完整面板，或配合离线 Studio 插件一键导入场景树。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/editor"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:opacity-90"
            >
              打开 GUI 编辑器 →
            </Link>
            <Link
              href="/zh/studio-plugin"
              className="rounded-lg border border-line bg-panel px-4 py-2 text-sm font-medium text-ink hover:bg-raised"
            >
              离线 Studio 插件
            </Link>
            <Link
              href="/zh/guides/how-to-script-a-roblox-gui"
              className="rounded-lg border border-line bg-panel px-4 py-2 text-sm font-medium text-ink hover:bg-raised"
            >
              UI 脚本教程
            </Link>
          </div>
        </section>
      </div>
    </ZhShell>
  );
}
