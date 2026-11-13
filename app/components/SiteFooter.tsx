import Link from "next/link";
import type { Locale } from "../i18n";

// Directory badges for the footer marquee — kept only for sites that list us
// on a public page with a visible link back (verified 2026-10): Launchit,
// neeed.directory, NewTool.site. Dropped: Launchsoar & Indie.Deals (listing
// pages behind a login wall, no public backlink), Shipstry & BuildWay
// (listing pages 404; BuildWay's square icon also looked broken next to the
// horizontal badge strips).

// Directory badges scrolled by the footer marquee.
const BADGES = [
  {
    key: "neeed",
    node: (
      <a
        href="https://neeed.directory/products/roblox-gui-maker?utm_source=roblox-gui-maker"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="https://neeed.directory/badges/neeed-badge-light.svg"
          alt="Featured on neeed.directory"
          className="h-10 w-auto"
        />
      </a>
    ),
  },
  {
    key: "newtool",
    node: (
      <a
        href="https://newtool.site/item/roblox-gui-maker"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="https://newtool.site/badges/newtool-light.svg"
          alt="Featured on NewTool.site"
          className="h-[54px] w-auto"
        />
      </a>
    ),
  },
  {
    key: "launchit",
    node: (
      <a
        href="https://www.launchit.site/launches/roblox-gui-maker"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="https://www.launchit.site/badges/launchit-light.svg"
          alt="Featured on Launchit"
          className="h-[54px] w-auto"
        />
      </a>
    ),
  },
];

export function SiteFooter({ locale = "en" }: { locale?: Locale }) {
  const zh = locale === "zh";
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-panel mt-20">
      <div className="max-w-6xl mx-auto px-6 py-10 grid gap-8 md:grid-cols-3 text-sm">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="grid place-items-center w-6 h-6 rounded bg-primary text-on-primary font-bold text-xs">
              R
            </span>
            <span className="font-semibold">Roblox GUI Maker</span>
          </div>
          <p className="text-ink-mute">
            {zh
              ? "一个免费的 Roblox 游戏界面可视化构建器。拖拽、导出干净的 Luau,粘进 Studio 就能跑。"
              : "A free visual builder for Roblox game interfaces. Drag, drop, and export clean Luau you can paste straight into Studio."}
          </p>
        </div>
        <div>
          <p className="text-ink-dim font-medium mb-2">{zh ? "工具" : "Tool"}</p>
          <ul className="space-y-1.5 text-ink-mute">
            <li>
              <Link className="hover:text-ink" href="/editor">
                {zh ? "打开编辑器" : "Open the editor"}
              </Link>
            </li>
            <li>
              <Link className="hover:text-ink" href={zh ? "/zh/templates" : "/templates"}>
                {zh ? "GUI 模板" : "GUI templates"}
              </Link>
            </li>
            <li>
              <Link className="hover:text-ink" href={zh ? "/zh/kits" : "/kits"}>
                {zh ? "游戏 UI Kit" : "Game UI Kits"}
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-ink"
                href={zh ? "/zh/gamepass-icon-maker" : "/gamepass-icon-maker"}
              >
                {zh ? "Gamepass 图标制作器" : "Gamepass Icon Maker"}
              </Link>
            </li>
            <li>
              <Link className="hover:text-ink" href={zh ? "/zh/pricing" : "/pricing"}>
                {zh ? "Studio .rbxmx 与价格" : "Studio .rbxmx & Pricing"}
              </Link>
            </li>
            <li>
              <Link className="hover:text-ink" href={zh ? "/zh/for" : "/for"}>
                {zh ? "用例" : "Use cases"}
              </Link>
            </li>
            <li>
              <Link className="hover:text-ink" href={zh ? "/zh/about" : "/about"}>
                {zh ? "关于" : "About"}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-ink-dim font-medium mb-2">{zh ? "关于" : "About"}</p>
          <p className="text-ink-mute mb-3">
            {zh
              ? "一个独立的非官方工具,与 Roblox Corporation 无关、也未获其认可。“Roblox”是 Roblox Corporation 的商标。"
              : "An independent, unofficial tool. Not affiliated with or endorsed by Roblox Corporation. “Roblox” is a trademark of Roblox Corporation."}
          </p>
          <p className="text-ink-dim font-medium mb-2">
            {zh ? "反馈" : "Feedback"}
          </p>
          <ul className="space-y-1.5 text-ink-mute">
            <li>
              <a
                className="hover:text-ink"
                href="https://github.com/bruce-hmz/roblox-gui-maker/issues/new"
                target="_blank"
                rel="noopener noreferrer"
              >
                {zh ? "报告 Bug / 提建议" : "Report a bug / Request a feature"}
              </a>
            </li>
          </ul>
          <p className="text-ink-dim font-medium mb-2 mt-4">
            {zh ? "法律与信任" : "Legal & trust"}
          </p>
          <ul className="space-y-1.5 text-ink-mute">
            <li>
              <Link className="hover:text-ink" href="/privacy">
                {zh ? "隐私政策" : "Privacy Policy"}
              </Link>
            </li>
            <li>
              <Link className="hover:text-ink" href="/terms">
                {zh ? "服务条款" : "Terms of Service"}
              </Link>
            </li>
            <li>
              <Link className="hover:text-ink" href="/trust">
                {zh ? "安全 / 信任" : "Is it safe?"}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 pb-6">
        <div className="badge-marquee">
          <div className="badge-marquee-track">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="badge-marquee-group"
                aria-hidden={copy === 1 || undefined}
                inert={copy === 1 || undefined}
              >
                {BADGES.map((badge) => (
                  <div key={badge.key} className="shrink-0">
                    {badge.node}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-ink-mute">
        © {year} robloxguimaker.app
      </div>
    </footer>
  );
}
