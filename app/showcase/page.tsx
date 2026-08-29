import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "../components/SiteNav";
import { SiteFooter } from "../components/SiteFooter";
import { ScenePreview } from "../editor/ScenePreview";
import { TEMPLATES, getTemplate } from "../editor/templates";

export const metadata: Metadata = {
  title: "Roblox GUI Examples & Gallery — Real UI Designs | Roblox GUI Maker",
  description:
    "Browse real Roblox GUI examples — main menus, shops, HUDs, game pass stores, daily rewards, leaderboards and more. Designed visually and exported as clean Luau, free.",
  openGraph: {
    title: "Roblox GUI Examples & Gallery — Real UI Designs",
    description:
      "Browse real Roblox GUI examples — main menus, shops, HUDs, game pass stores, daily rewards, leaderboards and more. Free, exportable Luau.",
    url: "https://robloxguimaker.app/showcase",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roblox GUI Examples & Gallery — Real UI Designs",
    description:
      "Browse real Roblox GUI examples — main menus, shops, HUDs, game pass stores, daily rewards and more. Free, exportable Luau.",
  },
  alternates: {
    canonical: "/showcase",
    languages: {
      en: "https://robloxguimaker.app/showcase",
      zh: "https://robloxguimaker.app/zh/showcase",
    },
  },
};

// The most polished, game-ready screen — shown large as the anchor piece.
const FEATURED = getTemplate("game-pass-shop") ?? TEMPLATES[0];

export default function ShowcasePage() {
  return (
    <>
      <SiteNav />
      <main>
        {/* hero */}
        <section className="max-w-4xl mx-auto px-6 pt-16 pb-8 text-center">
          <p className="text-focus text-sm font-semibold uppercase tracking-wider mb-4">
            Built with Roblox GUI Maker · Free · Exportable
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
            Roblox GUI examples &amp; inspiration
          </h1>
          <p className="text-lg text-ink-dim max-w-2xl mx-auto mb-8">
            Real, in-game-style Roblox interfaces — main menus, shops, HUDs,
            reward screens — designed visually and exported as clean Luau. Open
            any one in the editor, make it yours, and ship it free.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/editor"
              className="px-6 py-3 rounded-lg font-semibold bg-primary text-on-primary hover:brightness-110 transition"
            >
              Launch the Editor →
            </Link>
            <Link
              href="/templates"
              className="px-6 py-3 rounded-lg font-medium border border-line hover:bg-raised transition"
            >
              Browse Templates
            </Link>
          </div>
        </section>

        {/* featured anchor piece */}
        <section className="max-w-5xl mx-auto px-6 pb-14">
          <div className="rounded-2xl ring-1 ring-line overflow-hidden shadow-2xl shadow-black/40">
            <ScenePreview scene={FEATURED.scene} />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
            <div>
              <p className="text-sm font-semibold text-ink">
                {FEATURED.title.replace("Roblox ", "").replace(" GUI", "")}
              </p>
              <p className="text-xs text-ink-mute">{FEATURED.tagline}</p>
            </div>
            <Link
              href={`/templates/${FEATURED.slug}`}
              className="text-sm text-focus hover:underline font-medium"
            >
              Open this template →
            </Link>
          </div>
        </section>

        {/* full gallery */}
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <h2 className="text-2xl md:text-3xl font-semibold mb-2">
            Every interface, one click from editable
          </h2>
          <p className="text-ink-dim max-w-2xl mb-8">
            Each example is a real Roblox scene built from native instances. Tap
            one to open it in the editor, swap in your own text and colors, and
            export Luau, JSON, or a ZIP.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEMPLATES.filter((t) => t.slug !== FEATURED.slug).map((t) => (
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

        {/* SEO body */}
        <section className="max-w-3xl mx-auto px-6 pb-20 space-y-5 text-ink-dim leading-relaxed">
          <h2 className="text-2xl font-semibold text-ink">
            Real Roblox GUI examples you can edit
          </h2>
          <p>
            This gallery is a working portfolio of <strong>Roblox GUI
            examples</strong> built entirely in the visual editor — no image
            mockups, no hand-drawn frames. Every screen above is made from real
            Roblox instances like <code className="text-focus">ScreenGui</code>,{" "}
            <code className="text-focus">ScrollingFrame</code>, and{" "}
            <code className="text-focus">UIListLayout</code>, so what you see is
            what you export.
          </p>
          <p>
            Browsing <strong>Roblox UI examples</strong> is the fastest way to
            decide what your game needs. A simulator wants a tight corner HUD
            and a daily-rewards popup. A tycoon wants a shop grid and a game
            pass storefront. Pick the closest match, open it in the editor, and
            replace the placeholder text with your own — then preview it on
            desktop, tablet, and mobile before you export.
          </p>
          <p>
            Unlike a static <strong>Roblox GUI design gallery</strong>, each
            example here exports ready-to-use client Luau (and optional server
            Luau for purchase, teleport, and reward actions). You get the look
            and the working code, free, with no account.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
