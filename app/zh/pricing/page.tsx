import type { Metadata } from "next";
import Link from "next/link";
import { ZhShell } from "../_components/ZhShell";
import { PricingCards } from "../../pricing/PricingCards";

export const metadata: Metadata = {
  title: "价格与买断方案 —— 原生 Roblox Studio .rbxmx 与完整 UI Kit | Roblox GUI Maker",
  description:
    "客户端与服务端 Luau 代码导出、单张 512x512 Gamepass 徽章永久免费。一次性买断（无订阅）即可解锁原生 Roblox Studio .rbxmx 模型树、全部 6 套多界面 UI Kit 与 48 枚变现图标。",
  alternates: {
    canonical: "/zh/pricing",
    languages: {
      "x-default": "https://robloxguimaker.app/pricing",
      en: "https://robloxguimaker.app/pricing",
      zh: "https://robloxguimaker.app/zh/pricing",
    },
  },
  openGraph: {
    title: "价格与买断方案 —— 原生 Roblox Studio .rbxmx 与完整 UI Kit",
    description:
      "一次性买断原生 .rbxmx Studio 实例树、6 大品类多界面 UI Kit 与 48 枚 512x512 Gamepass 图标。Luau 代码永久免费。",
    url: "https://robloxguimaker.app/zh/pricing",
  },
};

export default function ZhPricingPage() {
  return (
    <ZhShell>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="max-w-3xl mb-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-focus mb-2">
            一次性买断 · 无月费订阅 · 免装 Studio 插件
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Luau 代码永久免费，按需买断 Studio 成品交付包
          </h1>
          <p className="text-ink-dim leading-relaxed">
            可视化拖拽排版、客户端与服务端 Luau 脚本复制下载、以及单张 512×512
            Gamepass 图标导出无需注册、永久免费。当你希望直接把原生{" "}
            <code className="rounded bg-raised px-1.5 py-0.5 text-xs text-ink">
              .rbxmx
            </code>{" "}
            实例树拖进{" "}
            <code className="rounded bg-raised px-1.5 py-0.5 text-xs text-ink">
              StarterGui
            </code>
            ，或者一次性拿齐 6 大品类的 5 界面同色系 UI Kit 与配套通行证图标时，只需买断一次。
          </p>
        </div>

        <PricingCards locale="zh" />

        <section className="mx-auto mt-16 max-w-3xl space-y-6 text-sm text-ink-dim leading-relaxed">
          <h2 className="text-2xl font-semibold text-ink">常见问题</h2>
          <div>
            <h3 className="font-semibold text-ink">
              免费的 .lua 导出和 Pro 的 .rbxmx 导出有什么区别？
            </h3>
            <p className="mt-1">
              免费 <code className="text-ink">.lua</code> 导出生成一段在运行时创建界面的{" "}
              <code className="text-ink">LocalScript</code>；原生{" "}
              <code className="text-ink">.rbxmx</code> 导出则生成标准 Roblox XML 模型文件，拖入
              Studio 后在 Explorer 中直接展开真实的{" "}
              <code className="text-ink">ScreenGui</code>、
              <code className="text-ink">Frame</code>、
              <code className="text-ink">UICorner</code>、
              <code className="text-ink">UIGradient</code> 与交互控制器脚本，方便美术和程序直接在
              Studio 内微调与加动画，无需安装任何第三方插件。
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-ink">是按月扣费的订阅制吗？</h3>
            <p className="mt-1">
              不是。两档方案均为 Stripe 一次性付款（USD 9.90 或 USD 19.90），没有任何自动续费。
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-ink">
              导出的 UI Kit 和 Gamepass 图标可以用于商业 Roblox 游戏吗？
            </h3>
            <p className="mt-1">
              可以。所有{" "}
              <Link href="/zh/kits" className="text-focus hover:underline">
                游戏 UI Kit
              </Link>{" "}
              和{" "}
              <Link
                href="/zh/gamepass-icon-maker"
                className="text-focus hover:underline"
              >
                512×512 Gamepass 徽章图标
              </Link>{" "}
              均可用于不限数量的个人、团队或外包商业 Roblox 项目，无需署名。
            </p>
          </div>
        </section>
      </div>
    </ZhShell>
  );
}
