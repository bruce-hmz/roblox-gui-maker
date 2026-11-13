import type { Metadata } from "next";
import Link from "next/link";
import { ZhShell } from "../_components/ZhShell";
import { GamepassIconMaker } from "../../gamepass-icon-maker/GamepassIconMaker";

export const metadata: Metadata = {
  title: "Roblox Gamepass 图标制作器 —— 免费导出 512x512 通行证与商店徽章",
  description:
    "在线免费制作 512x512 透明底 Roblox Gamepass 通行证图标与开发者商品徽章。内置 VIP、双倍金币、自动孵蛋、三倍幸运等高转化预设，自带圆形裁切安全区预览，一键导出无水印 PNG 与 SVG。",
  alternates: {
    canonical: "/zh/gamepass-icon-maker",
    languages: {
      "x-default": "https://robloxguimaker.app/gamepass-icon-maker",
      en: "https://robloxguimaker.app/gamepass-icon-maker",
      zh: "https://robloxguimaker.app/zh/gamepass-icon-maker",
    },
  },
  openGraph: {
    title: "Roblox Gamepass 图标制作器 —— 免费导出 512x512 通行证与商店徽章",
    description:
      "在线定制并免费导出 512x512 透明底 Roblox Gamepass 图标与内购徽章，无水印、免登录。",
    url: "https://robloxguimaker.app/zh/gamepass-icon-maker",
  },
};

export default function ZhGamepassIconMakerPage() {
  return (
    <ZhShell>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="max-w-3xl mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-focus mb-2">
            512 × 512 透明底 PNG · 适配 Roblox 官方圆形裁切安全区
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Roblox Gamepass 通行证与商店图标制作器
          </h1>
          <p className="text-ink-dim leading-relaxed">
            几秒钟生成清晰耐看的 512×512 Roblox Gamepass 徽章与开发者商品（Developer
            Products）图标。选择 VIP、2X CASH、AUTO HATCH、3X LUCK、STARTER PACK
            等热门变现预设，调整配色与金属质感外圈，实时预览 44px 商店小图可读性，免费导出可直接上传
            Creator Dashboard 的透明 PNG。
          </p>
        </div>

        <GamepassIconMaker locale="zh" />

        <section className="mx-auto mt-16 max-w-3xl space-y-5 text-sm text-ink-dim leading-relaxed">
          <h2 className="text-2xl font-semibold text-ink">
            Roblox Gamepass 图标尺寸规范与游戏内商店接入提示
          </h2>
          <p>
            在 <strong className="text-ink">Roblox Creator Dashboard → Passes</strong>{" "}
            上传通行证图标时，官方标准尺寸为正方形{" "}
            <strong className="text-ink">512×512 像素</strong>
            （推荐透明背景 PNG），且游戏详情页 Store 标签会自动将四角裁切成圆形。上方的「圆形
            Pass」模式严格将金属外圈、主体徽记和描边粗体字控制在安全直径内，确保在手机端小屏也不会裁掉文字。
          </p>
          <p>
            如果你正在制作游戏内的{" "}
            <Link
              href="/zh/templates/game-pass-shop"
              className="text-focus hover:underline"
            >
              Game Pass 商店 GUI
            </Link>{" "}
            或金币礼包网格，可切换为「圆角商店卡」导出填充感更饱满的方形图标，并搭配{" "}
            <Link href="/zh/kits" className="text-focus hover:underline">
              同主题多界面游戏 UI Kit
            </Link>{" "}
            使用。
          </p>
        </section>
      </div>
    </ZhShell>
  );
}
