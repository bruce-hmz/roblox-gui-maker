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

export default function KitsPage() {
  return (
    <ZhShell>
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
      </div>
    </ZhShell>
  );
}
