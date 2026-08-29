import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "../components/SiteNav";
import { SiteFooter } from "../components/SiteFooter";
import { GUIDES } from "./guides-data";

export const metadata: Metadata = {
  title: "Roblox GUI Guides — How to Make Menus, Shops & Loading Screens",
  description:
    "Written guides for building Roblox GUIs: main menus, shops, loading screens, and how to use UIListLayout and UIGridLayout — with copy-paste Luau.",
  openGraph: {
    title: "Roblox GUI Guides — How to Make Menus, Shops & Loading Screens",
    description:
      "Written guides for building Roblox GUIs: main menus, shops, loading screens, and how to use UIListLayout and UIGridLayout — with copy-paste Luau.",
    url: "https://robloxguimaker.app/guides",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roblox GUI Guides — How to Make Menus, Shops & Loading Screens",
    description:
      "Written guides for building Roblox GUIs: main menus, shops, loading screens, and more.",
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
          Roblox GUI Guides
        </h1>
        <p className="text-ink-dim mb-10">
          Step-by-step written guides for building common Roblox interfaces —
          with copy-paste Luau you can drop straight into Studio.
        </p>
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
