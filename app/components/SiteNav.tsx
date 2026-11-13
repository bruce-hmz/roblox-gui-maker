import Link from "next/link";
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
  { en: "Showcase", zh: "作品集", href: "/showcase", zhHref: "/zh/showcase" },
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
              (it.mobile ? "" : "hidden lg:inline-flex ") +
              "px-2.5 py-1.5 rounded-md text-ink-dim hover:text-ink hover:bg-raised transition-colors whitespace-nowrap"
            }
          >
            {zh ? it.zh : it.en}
          </Link>
        ))}
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
