import Link from "next/link";
import { Menu } from "lucide-react";
import type { Locale } from "../i18n";

type NavItem = {
  en: string;
  zh: string;
  href: string;
  // zh route once translated; until then zh falls back to the English page.
  zhHref?: string;
  mobile?: boolean;
};

const ITEMS: NavItem[] = [
  { en: "Editor", zh: "编辑器", href: "/editor" },
  { en: "Templates", zh: "模板", href: "/templates", zhHref: "/zh/templates", mobile: true },
  { en: "Kits", zh: "Kit", href: "/kits", zhHref: "/zh/kits" },
  {
    en: "Icon Maker",
    zh: "通行证图标",
    href: "/gamepass-icon-maker",
    zhHref: "/zh/gamepass-icon-maker",
  },
  {
    en: "Studio Plugin",
    zh: "Studio 插件",
    href: "/studio-plugin",
    zhHref: "/zh/studio-plugin",
  },
  { en: "Guides", zh: "教程", href: "/guides", zhHref: "/zh/guides" },
  { en: "Pricing", zh: "价格", href: "/pricing", zhHref: "/zh/pricing" },
];

export function SiteNav({ locale = "en" }: { locale?: Locale }) {
  const zh = locale === "zh";
  return (
    <header className="sticky top-0 z-20 h-14 flex items-center justify-between px-3 sm:px-6 bg-panel/80 backdrop-blur border-b border-line">
      <Link href={zh ? "/zh" : "/"} className="flex items-center gap-2">
        <span className="grid place-items-center w-9 h-9 rounded-lg bg-white shrink-0 overflow-hidden">
          <img
            src="/logo.png"
            alt="Roblox GUI Maker"
            className="w-full h-full object-contain"
          />
        </span>
        <span className="hidden sm:inline font-semibold tracking-tight">
          Roblox<span className="text-ink-dim"> GUI Maker</span>
        </span>
      </Link>
      <nav className="flex items-center gap-1 text-sm">
        {ITEMS.map((it) => (
          <Link
            key={it.href}
            href={zh && it.zhHref ? it.zhHref : it.href}
            className={
              (it.mobile ? "hidden sm:inline-flex " : "hidden lg:inline-flex ") +
              "px-2.5 py-1.5 rounded-md text-ink-dim hover:text-ink hover:bg-raised transition-colors whitespace-nowrap"
            }
          >
            {zh ? it.zh : it.en}
          </Link>
        ))}
        {/* Below lg the inline links are hidden, so every item lives in this
            menu. Native <details> on purpose: GeFeiSites serves these pages
            as static HTML with no React hydration, so a JS toggle would never
            open there. The panel is positioned against the sticky header (no
            `relative` here) so it always opens flush with the right edge. */}
        <details className="lg:hidden">
          <summary className="list-none [&::-webkit-details-marker]:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-ink-dim hover:text-ink hover:bg-raised transition-colors cursor-pointer select-none whitespace-nowrap">
            <Menu className="w-4 h-4" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">{zh ? "菜单" : "Menu"}</span>
          </summary>
          <div className="absolute right-3 sm:right-6 top-full mt-2 w-56 flex flex-col rounded-xl border border-line bg-panel p-1.5 shadow-2xl shadow-black/50">
            {ITEMS.map((it) => (
              <Link
                key={it.href}
                href={zh && it.zhHref ? it.zhHref : it.href}
                className="px-3 py-2 rounded-md text-ink-dim hover:text-ink hover:bg-raised transition-colors"
              >
                {zh ? it.zh : it.en}
              </Link>
            ))}
          </div>
        </details>
        <Link
          href="/editor"
          className="ml-2 px-4 py-1.5 rounded-md font-semibold bg-primary text-on-primary hover:brightness-110 transition"
        >
          {zh ? "打开编辑器" : "Launch Editor"}
        </Link>
        <span className="ml-2 flex items-center gap-1 text-xs whitespace-nowrap">
          {zh ? (
            <span className="font-semibold text-ink">中文</span>
          ) : (
            <Link href="/zh" className="text-ink-mute hover:text-ink">
              中文
            </Link>
          )}
          <span className="text-ink-mute">·</span>
          {zh ? (
            <Link href="/" className="text-ink-mute hover:text-ink">
              EN
            </Link>
          ) : (
            <span className="font-semibold text-ink">EN</span>
          )}
        </span>
      </nav>
    </header>
  );
}
