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

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Roblox Gamepass 通行证图标制作器",
  applicationCategory: "DesignApplication",
  operatingSystem: "Any (Web Browser)",
  inLanguage: "zh-Hans",
  url: "https://robloxguimaker.app/zh/gamepass-icon-maker",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

const FAQS = [
  {
    q: "Roblox Gamepass 通行证图标应该做多大尺寸？",
    a: "官方推荐使用 512x512 像素 1:1 正方形 PNG（支持透明背景）。高分辨率正方形上传能避免在手机、PC 商店列表和游戏内商店卡片上模糊失真。",
  },
  {
    q: "为什么我的通行证图标在 Roblox 游戏主页边缘被切掉了？",
    a: "Roblox 在体验详情页的 Store 商店标签会自动给 Pass 图标套上圆形裁切遮罩。如果徽章或文字贴近四角就会被裁掉。建议在上方选择「圆形 Pass」并打开圆形安全区线预览后再导出。",
  },
  {
    q: "制作好图标后怎么上传到 Roblox Creator Dashboard？",
    a: "打开 create.roblox.com，进入 Creations -> 选择你的游戏 -> Monetization -> Passes -> Create a Pass（或编辑现有通行证），点击 Change Image 上传导出的 512x512 PNG。审核通过后复制 Pass ID 用于 PromptGamePassPurchase，并可复制图片 Asset ID 放到游戏内 ImageLabel。",
  },
  {
    q: "「圆形 Pass」和「圆角商店卡（Shop Tile）」导出有什么区别？",
    a: "「圆形 Pass」把金属外圈、核心符号与粗体短标语收在圆形裁切安全直径内，专供体验商店页缩略图；「圆角商店卡」则导出填满方形区域的圆角卡片徽章，更适合放进游戏内商店 GUI 或开发者商品格子里。",
  },
  {
    q: "游戏内商店 GUI 怎么显示图标并拉起 Robux 购买？",
    a: "在正方形 ImageLabel（搭配 AspectRatio = 1 的 UIAspectRatioConstraint 与 ScaleType = Fit）填好 rbxassetid:// Asset ID，在按钮 Activated 时调用 MarketplaceService:PromptGamePassPurchase(player, passId)，并在服务端通过 UserOwnsGamePassAsync 与 PromptGamePassPurchaseFinished 核验发放特权。",
  },
  {
    q: "用这个工具导出的 512x512 PNG 和 SVG 能直接用于商业 Roblox 游戏吗？",
    a: "可以。单张 512x512 PNG 和矢量 SVG 无需登录即可免费导出且没有任何水印，可直接用于个人、群组或商业外包的 Roblox 游戏项目。",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.a,
    },
  })),
};

export default function ZhGamepassIconMakerPage() {
  return (
    <ZhShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareSchema).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
        }}
      />
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
            4 步做好并上传 Roblox 通行证图标（尺寸与商店接入指南）
          </h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <strong className="text-ink">选定题材徽章与高对比配色：</strong>
              先从模拟器、动漫、跑酷、暗黑奇幻、科幻或治愈等预设起步，文字标签尽量精简到 1–2
              个强号召短词（如 <code className="text-ink">VIP</code>、
              <code className="text-ink">2X COINS</code>）。
            </li>
            <li>
              <strong className="text-ink">核对圆形安全区与 44px 缩略图：</strong>
              上传网页 Store 的通行证建议保持「圆形 Pass」并开启安全圈参考线，确保手机端缩略图下字迹和边框不裁切、不糊成一团。
            </li>
            <li>
              <strong className="text-ink">免费导出 512×512 透明 PNG 或 SVG：</strong>
              商店通行证用圆形安全布局；游戏内商店卡片与金币礼包则可切换「圆角商店卡」饱满填充{" "}
              <code className="text-ink">ImageLabel</code>。
            </li>
            <li>
              <strong className="text-ink">上传 Creator Dashboard 并接入商店 GUI：</strong>
              在 <strong className="text-ink">Creator Dashboard → Creations → Passes</strong>{" "}
              上传 PNG 后，可搭配{" "}
              <Link
                href="/zh/templates/game-pass-shop"
                className="text-focus hover:underline"
              >
                Game Pass 商店 GUI 模板
              </Link>{" "}
              与{" "}
              <Link
                href="/zh/guides/how-to-make-a-roblox-gamepass-shop-gui"
                className="text-focus hover:underline"
              >
                通行证商店脚本指南
              </Link>{" "}
              直接接入购买流程。
            </li>
          </ol>
          <p>
            想进一步了解安全区像素标准？可查看{" "}
            <Link
              href="/zh/guides/how-to-make-roblox-gamepass-icons"
              className="text-focus hover:underline"
            >
              512×512 通行证图标制作与上传规范
            </Link>
            ，或浏览打包了 5 套同主题 Studio <code className="text-ink">.rbxmx</code>{" "}
            界面与 6 枚配套图标的{" "}
            <Link href="/zh/kits" className="text-focus hover:underline">
              多界面游戏 UI Kit
            </Link>
            。
          </p>
        </section>

        <section className="mx-auto mt-14 max-w-3xl space-y-6 text-sm text-ink-dim leading-relaxed">
          <h2 className="text-2xl font-semibold text-ink">
            Roblox Gamepass 图标常见问题
          </h2>
          {FAQS.map((item) => (
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
