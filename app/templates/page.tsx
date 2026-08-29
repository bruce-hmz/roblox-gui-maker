import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "../components/SiteNav";
import { SiteFooter } from "../components/SiteFooter";
import { ScenePreview } from "../editor/ScenePreview";
import { TEMPLATES, CATEGORIES } from "../editor/templates";

export const metadata: Metadata = {
  title: "Free Roblox GUI Templates — Menus, Shops, HUDs | Roblox GUI Maker",
  description:
    "Free Roblox GUI templates for menus, shops, settings, inventory, loading screens and leaderboards. Customize responsive layouts, then export Luau, JSON, or ZIP.",
  openGraph: {
    title: "Free Roblox GUI Templates — Menus, Shops, HUDs",
    description:
      "Free Roblox GUI templates for menus, shops, settings, inventory, loading screens and leaderboards. Customize and export Luau for Roblox Studio.",
    url: "https://robloxguimaker.app/templates",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Roblox GUI Templates — Menus, Shops, HUDs",
    description:
      "Free Roblox GUI templates for menus, shops, settings, inventory, loading screens and leaderboards.",
  },
  alternates: {
    canonical: "/templates",
    languages: {
      en: "https://robloxguimaker.app/templates",
      zh: "https://robloxguimaker.app/zh/templates",
    },
  },
};

export default function TemplatesPage() {
  return (
    <>
      <SiteNav />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Free Roblox GUI Templates
        </h1>
        <p className="text-ink-dim max-w-2xl mb-10">
          Ready-made Roblox interfaces you can open in the editor, customize, and
          export as clean Luau. Every template is built from real Roblox
          instances and layouts.
        </p>

        {CATEGORIES.map((cat) => {
          const items = TEMPLATES.filter((t) => t.category === cat);
          if (items.length === 0) return null;
          return (
            <section key={cat} className="mb-12">
              <h2 className="text-xl font-semibold mb-4">{cat}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/templates/${t.slug}`}
                    className="group rounded-xl overflow-hidden ring-1 ring-line hover:ring-focus transition"
                  >
                    <ScenePreview scene={t.scene} />
                    <div className="p-3 bg-panel">
                      <p className="text-sm font-medium text-ink">
                        {t.title.replace("Roblox ", "").replace(" GUI", "")}
                      </p>
                      <p className="text-xs text-ink-mute">{t.tagline}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        <section className="mx-auto mt-16 max-w-3xl space-y-4 text-ink-dim leading-relaxed">
          <h2 className="text-2xl font-semibold text-ink">
            How to choose a Roblox GUI template
          </h2>
          <p>
            Start with the screen that matches the player&rsquo;s immediate task,
            not only the closest color scheme. A main menu needs one dominant
            action and a clear route to settings. A shop needs room for real
            item names, prices, and server-validated purchase states. An
            inventory needs a hierarchy that can grow without hiding the
            selected item or equip action.
          </p>
          <p>
            Open the template in the editor and replace every placeholder with
            realistic game text. Check the hierarchy, rename important panels
            and buttons, then review desktop, tablet, and mobile sizes before
            polishing details. The guide on{" "}
            <Link
              href="/guides/how-to-make-a-gui-in-roblox"
              className="font-medium text-focus hover:underline"
            >
              How to make a GUI in Roblox
            </Link>{" "}
            walks through that complete workflow.
          </p>
        </section>

        <section className="mx-auto mt-12 max-w-3xl space-y-4 text-ink-dim leading-relaxed">
          <h2 className="text-2xl font-semibold text-ink">
            Customize, preview, and export
          </h2>
          <p>
            Templates use the same responsive geometry and interaction tools as
            a project built from scratch. Combine scale and offset, set anchors
            and constraints, and preview show, hide, toggle, RemoteEvent, or
            Teleport actions before export.
          </p>
          <p>
            Download client Luau for the interface, optional server Luau for
            configured server-backed actions, JSON for future editing, or a ZIP
            package containing the project files and placement instructions.
            Read{" "}
            <Link
              href="/guides/roblox-gui-script-generator"
              className="font-medium text-focus hover:underline"
            >
              Understand generated Roblox GUI scripts
            </Link>{" "}
            for the exact output and security boundaries.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
