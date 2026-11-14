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

const PRICING_FAQS_ZH = [
  {
    q: "免费的 .lua 导出和 Pro 的 .rbxmx 导出有什么区别？",
    a: "免费 .lua 导出会生成在玩家进服时用 Instance.new 构建界面的 LocalScript；原生 .rbxmx 导出则生成 Roblox 官方 XML 模型文件，拖进 Studio StarterGui 后直接在 Explorer 展开真实的 ScreenGui、Frame、UICorner、UIGradient、UIStroke 与控制器脚本，无需安装任何第三方插件即可可视化编辑。",
  },
  {
    q: "购买后的 .rbxmx 模型或 UI Kit 压缩包怎么导入 Roblox Studio？",
    a: "在 Roblox Studio 的 Explorer 面板中右键点击 StarterGui -> 选择 Insert from File... -> 选中单屏 .rbxmx 或套件中的 -complete.rbxmx。如果压缩包附带 server/*.server.lua 服务端示例脚本，将其粘进 ServerScriptService 后按 F5 Play 即可运行体验。",
  },
  {
    q: "这是按月扣费的订阅制还是一次性买断？",
    a: "两档方案均为通过 Stripe 结账的一次性买断付款（USD 9.90 解锁编辑器 .rbxmx + 任选 1 套 UI Kit 与 6 枚配套图标；USD 19.90 全站通行包解锁无限 .rbxmx、全部 6 套 UI Kit 与全套 48 枚图标），没有任何自动续费。",
  },
  {
    q: "没有账号系统的话，清空浏览器 Cookie 或换电脑后怎么恢复 Pro 权限？",
    a: "为了免去注册和记密码的麻烦，本站采用无账号 HMAC 授权 Cookie。完成付款跳回 /pro/success?session_id=... 后，请及时下载所需 UI Kit 压缩包并收藏该确认页网址；之后在其他设备或清过缓存时重新打开同一链接，即可免登录重新校验 Stripe 订单并恢复授权。",
  },
  {
    q: "导出的 UI Kit、.rbxmx 和 Gamepass 图标可以用于商业 Roblox 游戏或接单吗？",
    a: "可以。所有导出的 GUI、多界面 Game UI Kit 与 512x512 Gamepass 徽章图标均可用于不限数量的个人、群组或商业接单 Roblox 游戏且无需署名，但不可把原始素材包直接打包转卖。",
  },
  {
    q: "买断前可以先免费试用编辑器和图标工具吗？",
    a: "完全可以。可视化编辑器、AI 生成 GUI、全套 13 个模板、6 套 UI Kit 在线预览、完整客户端/服务端 Luau 代码导出，以及单张 512x512 通行证图标制作均免费开放，无需登录即可先试到满意。",
  },
];

const pricingFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PRICING_FAQS_ZH.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.a,
    },
  })),
};

export default function ZhPricingPage() {
  return (
    <ZhShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pricingFaqSchema).replace(/</g, "\\u003c"),
        }}
      />
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

        <section className="mx-auto mt-14 max-w-3xl rounded-xl border border-line bg-panel p-5 text-sm text-ink-dim leading-relaxed">
          <h2 className="text-base font-semibold text-ink mb-2">
            3 步把 <code className="text-ink">.rbxmx</code> 模型导入 Roblox Studio（无需装任何插件）
          </h2>
          <ol className="list-decimal pl-5 space-y-1.5">
            <li>
              在
              <Link href="/editor" className="text-focus hover:underline">
                编辑器
              </Link>
              导出单屏 <code className="text-ink">.rbxmx</code>，或从{" "}
              <Link href="/zh/kits" className="text-focus hover:underline">
                UI Kit 页面
              </Link>
              下载 5 屏完整套件 ZIP。
            </li>
            <li>
              打开 Roblox Studio 的 Explorer，右键{" "}
              <strong className="text-ink">StarterGui</strong> →{" "}
              <strong className="text-ink">Insert from File...</strong>，选中{" "}
              <code className="text-ink">.rbxmx</code>（或整包中的{" "}
              <code className="text-ink">*-complete.rbxmx</code>）。
            </li>
            <li>
              将附带的 <code className="text-ink">server/*.server.lua</code>{" "}
              示例脚本放到 <strong className="text-ink">ServerScriptService</strong>{" "}
              即可按 Play 试玩；完整排查步骤见{" "}
              <Link
                href="/zh/guides/how-to-import-rbxmx-into-roblox-studio"
                className="text-focus hover:underline"
              >
                Studio .rbxmx 导入图文指南
              </Link>
              。
            </li>
          </ol>
        </section>

        <section className="mx-auto mt-14 max-w-3xl space-y-6 text-sm text-ink-dim leading-relaxed">
          <h2 className="text-2xl font-semibold text-ink">常见问题</h2>
          {PRICING_FAQS_ZH.map((item) => (
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
    </ZhShell>
  );
}
