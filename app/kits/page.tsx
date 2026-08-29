import type { Metadata } from "next";
import { SiteNav } from "../components/SiteNav";
import { SiteFooter } from "../components/SiteFooter";
import { KitCard } from "../components/KitCard";
import { KITS } from "../editor/kits";

export const metadata: Metadata = {
  title: "Roblox Game UI Kits — Cohesive Themed Interface Sets | Roblox GUI Maker",
  description:
    "Free Roblox game UI kits: cohesive, themed sets of menus, shops, HUDs and reward screens that look like one game. Open any kit, recolor it, and export clean Luau.",
  openGraph: {
    title: "Roblox Game UI Kits — Cohesive Themed Interface Sets",
    description:
      "Cohesive, themed Roblox UI sets — menus, shops, HUDs and reward screens in one look. Free, exportable Luau.",
    url: "https://robloxguimaker.app/kits",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roblox Game UI Kits — Cohesive Themed Interface Sets",
    description:
      "Cohesive, themed Roblox UI sets in one look. Free, exportable Luau.",
  },
  alternates: {
    canonical: "/kits",
    languages: {
      en: "https://robloxguimaker.app/kits",
      zh: "https://robloxguimaker.app/zh/kits",
    },
  },
};

export default function KitsPage() {
  return (
    <>
      <SiteNav />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Roblox Game UI Kits
        </h1>
        <p className="text-ink-dim max-w-2xl mb-10">
          A kit is several screens — main menu, shop, HUD, rewards, settings —
          sharing one theme, so they read as a single game&rsquo;s interface
          instead of loose pieces. Open a kit, swap the theme, and export each
          screen as clean Luau.
        </p>

        <div className="grid sm:grid-cols-2 gap-5">
          {KITS.map((kit) => (
            <KitCard key={kit.slug} kit={kit} />
          ))}
        </div>

        <section className="mx-auto mt-16 max-w-3xl space-y-4 text-ink-dim leading-relaxed">
          <h2 className="text-2xl font-semibold text-ink">
            What is a Roblox game UI kit?
          </h2>
          <p>
            A <strong>Roblox game UI kit</strong> is a matched set of interfaces
            for one game — the menu, shop, inventory, HUD and reward screens all
            built in the same colors, fonts and shapes. Freelance designers sell
            these as finished packages. Roblox GUI Maker lets you assemble the
            same thing yourself: pick a kit, recolor it with a theme, and export
            every screen&rsquo;s Luau free.
          </p>
          <p>
            Each kit here is built from real Roblox instances, so the previews
            are exactly what you export — no image mockups. Swap the theme and
            the whole set recolors together, which is the difference between a
            coordinated game UI and five screens that look like they came from
            five different places.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
