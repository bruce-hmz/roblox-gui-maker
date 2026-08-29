import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "../components/SiteNav";
import { SiteFooter } from "../components/SiteFooter";
import { USE_CASES } from "./usecases";

export const metadata: Metadata = {
  title: "Roblox GUI Maker for Every Screen — Menus, Shops, HUDs & More",
  description:
    "Roblox GUI Maker for main menus, shop menus, inventory screens, simulator HUDs, settings, loading screens, leaderboards and admin panels. Open a use case and export clean Luau.",
  openGraph: {
    title: "Roblox GUI Maker for Every Screen — Menus, Shops, HUDs & More",
    description:
      "Roblox GUI Maker for main menus, shop menus, inventory screens, simulator HUDs, settings, loading screens, leaderboards and admin panels.",
    url: "https://robloxguimaker.app/for",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roblox GUI Maker for Every Screen — Menus, Shops, HUDs & More",
    description:
      "Roblox GUI Maker for main menus, shop menus, inventory screens, simulator HUDs, settings, loading screens, leaderboards and admin panels.",
  },
  alternates: {
    canonical: "/for",
    languages: {
      en: "https://robloxguimaker.app/for",
      zh: "https://robloxguimaker.app/zh/for",
    },
  },
};

export default function UseCasesPage() {
  return (
    <>
      <SiteNav />
      <main className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Roblox GUI Maker for every screen
        </h1>
        <p className="text-ink-dim max-w-2xl mb-10">
          Pick the interface you&rsquo;re building. Each page shows what that GUI
          needs and links straight to a template or the editor so you can ship
          clean Luau for it in minutes.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {USE_CASES.map((u) => (
            <Link
              key={u.slug}
              href={`/for/${u.slug}`}
              className="block rounded-xl bg-panel border border-line hover:border-focus p-5 transition"
            >
              <h2 className="text-base font-semibold text-ink leading-snug">
                {u.title.replace("Roblox GUI Maker for ", "")}
              </h2>
              <p className="text-sm text-ink-dim mt-2 line-clamp-3">{u.blurb}</p>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
