import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "../components/SiteNav";
import { SiteFooter } from "../components/SiteFooter";
import { GUIDES } from "./guides-data";

export const metadata: Metadata = {
  title: "Roblox GUI Guides — How to Make Menus, Shops, Gamepasses & Studio UI",
  description:
    "Step-by-step Roblox Studio UI tutorials: how to make main menus, coin & Game Pass shops, loading screens, responsive Scale layouts, TweenService animations, 512x512 Gamepass icons, and .rbxmx imports.",
  openGraph: {
    title: "Roblox GUI Guides — How to Make Menus, Shops, Gamepasses & Studio UI",
    description:
      "Step-by-step Roblox Studio UI tutorials: menus, shops, Game Pass UI, UIListLayout, TweenService, 512x512 icons, and .rbxmx import workflows.",
    url: "https://robloxguimaker.app/guides",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roblox GUI Guides — How to Make Menus, Shops, Gamepasses & Studio UI",
    description:
      "Step-by-step Roblox Studio UI guides with copy-paste Luau, responsive layouts, Gamepass icons, and .rbxmx Studio imports.",
  },
  alternates: {
    canonical: "/guides",
    languages: {
      en: "https://robloxguimaker.app/guides",
      zh: "https://robloxguimaker.app/zh/guides",
    },
  },
};

export default function GuidesPage() {
  return (
    <>
      <SiteNav />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Roblox GUI Guides &amp; How-To Tutorials
        </h1>
        <p className="text-ink-dim mb-6 leading-relaxed">
          Practical Roblox Studio tutorials answering real UI questions &mdash; from
          responsive Scale layouts and TweenService animations to Game Pass
          shops, 512&times;512 pass icons, and importing{" "}
          <code className="text-ink">.rbxmx</code> models straight into{" "}
          <code className="text-ink">StarterGui</code>.
        </p>
        <div className="flex flex-wrap gap-2 mb-10 text-xs">
          <Link
            href="/templates"
            className="rounded-lg border border-line bg-panel px-3 py-1.5 font-medium text-ink-dim hover:border-focus hover:text-ink transition"
          >
            Browse 13 GUI templates →
          </Link>
          <Link
            href="/gamepass-icon-maker"
            className="rounded-lg border border-line bg-panel px-3 py-1.5 font-medium text-ink-dim hover:border-focus hover:text-ink transition"
          >
            512&times;512 Gamepass Icon Maker →
          </Link>
          <Link
            href="/kits"
            className="rounded-lg border border-line bg-panel px-3 py-1.5 font-medium text-ink-dim hover:border-focus hover:text-ink transition"
          >
            6 Pro UI Kits →
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          {GUIDES.map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="block rounded-xl bg-panel border border-line hover:border-focus p-5 transition"
            >
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-focus bg-input px-1.5 py-0.5 rounded mb-2">
                {g.category}
              </span>
              <h2 className="text-lg font-semibold text-ink">{g.title}</h2>
              <p className="text-sm text-ink-dim mt-1">{g.description}</p>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
