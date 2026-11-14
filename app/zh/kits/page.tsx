import type { Metadata } from "next";
import Link from "next/link";
import { KITS } from "../../editor/kits";
import { getKitZh } from "../../editor/kits.zh";
import { KitCard } from "../../components/KitCard";
import { ZhShell } from "../_components/ZhShell";

export const metadata: Metadata = {
  title: "Roblox 游戏 UI Kit —— 主题统一的界面套装 | Roblox GUI Maker",
  description:
    "免费 Roblox 游戏 UI Kit:主题统一的菜单、商店、HUD 和奖励界面套装,看起来像一个游戏。打开任意 Kit、换主题、导出干净 Luau。",
  openGraph: {
    title: "Roblox 游戏 UI Kit —— 主题统一的界面套装",
    description:
      "主题统一的 Roblox UI 套装 —— 菜单、商店、HUD 和奖励界面,一个观感。免费、可导出 Luau。",
    url: "https://robloxguimaker.app/zh/kits",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roblox 游戏 UI Kit —— 主题统一的界面套装",
    description: "主题统一的 Roblox UI 套装,一个观感。免费、可导出 Luau。",
  },
  alternates: {
    canonical: "/zh/kits",
    languages: {
      en: "https://robloxguimaker.app/kits",
      zh: "https://robloxguimaker.app/zh/kits",
    },
  },
};

const KITS_FAQS_ZH = [
  {
    q: "这些 Roblox 游戏 UI Kit 可以免费打开修改和导出代码吗？",
    a: "可以。全站 6 套 Kit 里的所有界面都能免费在编辑器中打开、换主题色、改按钮文案并导出纯净的客户端/服务端 Luau 代码，无需注册账号。",
  },
  {
    q: "购买 Pro UI Kit 下载包（ZIP）里具体包含哪些文件？",
    a: "每个 Kit 压缩包包含可直接一步导入的一体包 <kit>-complete.rbxmx（自带 KitScreenSwitcher 多屏切换控制器）、5 个单独分屏 .rbxmx 模型、5 份 .client.lua 脚本、可重新导入编辑的 .json 工程文件、server/*.server.lua 服务端示例，以及 6 枚 512x512 配套 Gamepass 图标。",
  },
  {
    q: "怎么把下载好的 UI Kit 导入到 Roblox Studio？",
    a: "在 Roblox Studio 的 Explorer 里右键 StarterGui -> Insert from File... 选中 -complete.rbxmx，再将 server/*.server.lua 放进 ServerScriptService 后按 F5 Play 即可运行测试。",
  },
  {
    q: "整套 5 个界面一起导入后，HUD 和弹窗怎么配合切换？",
    a: "自带的 KitScreenSwitcher LocalScript 会保持核心 HUD 常驻显示，并让玩家通过顶部标签页或数字快捷键在不同功能弹窗之间丝滑切换。",
  },
];

const kitsFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: KITS_FAQS_ZH.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function KitsPage() {
  return (
    <ZhShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(kitsFaqSchema).replace(/</g, "\\u003c"),
        }}
      />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Roblox 游戏 UI Kit
        </h1>
        <p className="text-ink-dim max-w-2xl mb-10">
          一个 Kit 是几个界面 —— 主菜单、商店、HUD、奖励、设置 —— 共用一个主题,所以它们读起来像一个游戏的界面,而不是零散的碎片。打开一个 Kit、换主题,把每个界面导出为干净的 Luau。
        </p>

        <div className="grid sm:grid-cols-2 gap-5">
          {KITS.map((k) => {
            const z = getKitZh(k.slug);
            if (!z) return null;
            return <KitCard key={z.slug} kit={z} locale="zh" />;
          })}
        </div>

        <div className="mt-10 rounded-2xl border border-line bg-panel p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <p className="text-sm font-semibold text-ink">
              想直接把全部 6 套多界面 .rbxmx 拖入 Roblox Studio，并拿齐 48 枚 Gamepass 图标？
            </p>
            <p className="text-xs text-ink-dim">
              单界面可视化编辑与复制 Luau 永久免费。一次性买断 All-Access（USD 19.90，无订阅）即可打包下载全部 6 大品类的完整 .rbxmx 实例树（含屏幕切换器）与配套 512×512 商店徽章。
            </p>
          </div>
          <Link
            href="/zh/pricing"
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-on-primary transition hover:brightness-110"
          >
            查看 Studio 成品包方案 →
          </Link>
        </div>

        <section className="mx-auto mt-16 max-w-3xl space-y-4 text-ink-dim leading-relaxed">
          <h2 className="text-2xl font-semibold text-ink">什么是 Roblox 游戏 UI Kit?</h2>
          <p>
            一个 <strong>Roblox 游戏 UI Kit</strong> 是为一个游戏配套的一组界面 —— 菜单、商店、背包、HUD 和奖励界面都用同样的颜色、字体和形状构建。自由设计师把这些当成成品包来卖。Roblox GUI Maker 让你自己拼出同样的东西:选一个 Kit、用主题改色、免费导出每个界面的 Luau。
          </p>
          <p>
            这里的每个 Kit 都由真实的 Roblox 实例构成,所以预览就是你导出的东西 —— 没有图片样机。换个主题,整套一起改色,这正是配套的游戏 UI 和五个看起来来自五个不同地方的界面的区别。
          </p>
        </section>

        <section className="mx-auto mt-12 max-w-3xl space-y-4 text-sm text-ink-dim leading-relaxed">
          <h2 className="text-2xl font-semibold text-ink">
            3 步把 Roblox UI Kit 导入 Studio 运行
          </h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <strong className="text-ink">免费改色或下载 Pro 交付包：</strong>
              先在{" "}
              <Link href="/editor" className="text-focus hover:underline">
                可视化编辑器
              </Link>{" "}
              免费打开任意屏幕导出 Luau，或下载 Studio Pro 压缩包获取一键整包{" "}
              <code className="text-ink">-complete.rbxmx</code> 与分屏文件。
            </li>
            <li>
              <strong className="text-ink">插入 StarterGui：</strong>在 Roblox Studio
              的 Explorer 中右键 <strong className="text-ink">StarterGui</strong>{" "}
              → <strong className="text-ink">Insert from File...</strong>，选入{" "}
              <code className="text-ink">.rbxmx</code>。
            </li>
            <li>
              <strong className="text-ink">放入服务端示例并按 Play 测试：</strong>
              将 <code className="text-ink">server/*.server.lua</code> 粘入{" "}
              <strong className="text-ink">ServerScriptService</strong>，按{" "}
              <strong className="text-ink">Play</strong> 即可试用自带的{" "}
              <code className="text-ink">KitScreenSwitcher</code> 多屏联动与常驻 HUD。
            </li>
          </ol>
        </section>

        <section className="mx-auto mt-12 max-w-3xl space-y-4 text-sm text-ink-dim leading-relaxed">
          <h2 className="text-2xl font-semibold text-ink">
            Roblox UI Kit 常见问题
          </h2>
          {KITS_FAQS_ZH.map((item) => (
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
