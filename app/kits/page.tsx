import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "../components/SiteNav";
import { SiteFooter } from "../components/SiteFooter";
import { KitCard } from "../components/KitCard";
import { KITS } from "../editor/kits";

export const metadata: Metadata = {
  title: "Roblox Game UI Kits — Cohesive 5-Screen Interface Sets",
  description:
    "6 genre-matched Roblox game UI kits: 5-screen menus, shops, inventories, HUDs and rewards with matching Gamepass icons. Free Luau preview or Studio .rbxmx.",
  openGraph: {
    title: "Roblox Game UI Kits — Cohesive 5-Screen Interface Sets",
    description:
      "6 themed Roblox UI sets — main menus, shops, HUDs, inventories, and reward screens in one look. Free Luau export + native Studio .rbxmx bundles.",
    url: "https://robloxguimaker.app/kits",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roblox Game UI Kits — Cohesive 5-Screen Interface Sets",
    description:
      "Cohesive, themed 5-screen Roblox UI sets in one look. Free Luau + optional .rbxmx Studio packages.",
  },
  alternates: {
    canonical: "/kits",
    languages: {
      en: "https://robloxguimaker.app/kits",
      zh: "https://robloxguimaker.app/zh/kits",
    },
  },
};

const KITS_FAQS = [
  {
    q: "Can I use and edit these Roblox UI Kits for free?",
    a: "Yes. Every screen across all 6 kits opens in the visual editor for free so you can swap themes, edit text or buttons, and copy client and server Luau code without signing up.",
  },
  {
    q: "What comes inside a Pro UI Kit .zip bundle?",
    a: "Each kit download includes the combined <kit>-complete.rbxmx file with KitScreenSwitcher pre-wired, 5 individual per-screen .rbxmx files, matching .client.lua scripts, editable .json scenes, server/*.server.lua RemoteEvent and MarketplaceService stubs, and 6 genre-matched 512x512 Gamepass icons.",
  },
  {
    q: "How do I install a kit into Roblox Studio?",
    a: "Right-click StarterGui in Roblox Studio Explorer, click Insert from File..., pick <kit>-complete.rbxmx, move server/*.server.lua into ServerScriptService, and press Play.",
  },
  {
    q: "How does KitScreenSwitcher work when all 5 screens load together?",
    a: "KitScreenSwitcher keeps your persistent HUD elements visible on every page while letting players switch cleanly between menus, shops, inventories, and rewards via top tabs or number keys.",
  },
];

const kitsFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: KITS_FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function KitsPage() {
  return (
    <>
      <SiteNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(kitsFaqSchema).replace(/</g, "\\u003c"),
        }}
      />
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

        <div className="mt-10 rounded-2xl border border-line bg-panel p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <p className="text-sm font-semibold text-ink">
              Want all 6 kits as native Roblox Studio .rbxmx bundles + 48 Gamepass icons?
            </p>
            <p className="text-xs text-ink-dim">
              Opening any screen in the editor and copying Luau stays 100% free. Unlock All-Access once (USD 19.90, no subscription) to download every multi-screen .rbxmx hierarchy with a wired screen switcher and matched 512×512 shop badges.
            </p>
          </div>
          <Link
            href="/pricing"
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-on-primary transition hover:brightness-110"
          >
            See Studio Pro Bundles →
          </Link>
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

        <section className="mx-auto mt-12 max-w-3xl space-y-4 text-sm text-ink-dim leading-relaxed">
          <h2 className="text-2xl font-semibold text-ink">
            How to import a Roblox UI Kit into Studio in 3 steps
          </h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <strong className="text-ink">Customize free or download the ZIP:</strong>{" "}
              Open any screen in the{" "}
              <Link href="/editor" className="text-focus hover:underline">
                visual editor
              </Link>{" "}
              to copy free Luau, or download the Studio Pro bundle to get{" "}
              <code className="text-ink">-complete.rbxmx</code> and individual{" "}
              <code className="text-ink">screens/*.rbxmx</code> files.
            </li>
            <li>
              <strong className="text-ink">Insert into StarterGui:</strong> In
              Roblox Studio Explorer, right-click{" "}
              <strong className="text-ink">StarterGui</strong> →{" "}
              <strong className="text-ink">Insert from File...</strong> and pick
              your <code className="text-ink">.rbxmx</code> bundle.
            </li>
            <li>
              <strong className="text-ink">Wire server logic &amp; test:</strong>{" "}
              Copy any <code className="text-ink">server/*.server.lua</code>{" "}
              RemoteEvent and MarketplaceService stubs into{" "}
              <strong className="text-ink">ServerScriptService</strong>, then
              press <strong className="text-ink">Play</strong> to test{" "}
              <code className="text-ink">KitScreenSwitcher</code> tabs and HUDs.
            </li>
          </ol>
        </section>

        <section className="mx-auto mt-12 max-w-3xl space-y-4 text-sm text-ink-dim leading-relaxed">
          <h2 className="text-2xl font-semibold text-ink">
            Roblox Game UI Kits FAQ
          </h2>
          {KITS_FAQS.map((item) => (
            <div
              key={item.q}
              className="rounded-xl border border-line bg-panel p-5"
            >
              <h3 className="font-semibold text-ink">{item.q}</h3>
              <p className="mt-1.5">{item.a}</p>
            </div>
          ))}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
