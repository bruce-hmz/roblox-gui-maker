import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "../components/SiteNav";
import { SiteFooter } from "../components/SiteFooter";
import { GamepassIconMaker } from "./GamepassIconMaker";

export const metadata: Metadata = {
  title: "Roblox Gamepass Icon Maker — Free 512x512 Pass & Badge Builder",
  description:
    "Create crisp 512x512 Roblox Gamepass icons and Developer Product shop badges in your browser. Customize VIP, 2x Cash, Auto Hatch, and Luck emblems, preview Roblox circular crop, and download transparent PNGs free.",
  alternates: {
    canonical: "/gamepass-icon-maker",
    languages: {
      "x-default": "https://robloxguimaker.app/gamepass-icon-maker",
      en: "https://robloxguimaker.app/gamepass-icon-maker",
      zh: "https://robloxguimaker.app/zh/gamepass-icon-maker",
    },
  },
  openGraph: {
    title: "Roblox Gamepass Icon Maker — Free 512x512 Pass & Badge Builder",
    description:
      "Design and export 512x512 transparent PNG Roblox Gamepass & shop icons instantly. Zero watermark, no login.",
    url: "https://robloxguimaker.app/gamepass-icon-maker",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roblox Gamepass Icon Maker — Free 512x512 Pass & Badge Builder",
    description:
      "Build 512x512 transparent Roblox Gamepass icons (VIP, 2x Cash, Auto Hatch, 3x Luck) free in your browser.",
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Roblox Gamepass Icon Maker",
  applicationCategory: "DesignApplication",
  operatingSystem: "Any (Web Browser)",
  url: "https://robloxguimaker.app/gamepass-icon-maker",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What size should a Roblox Gamepass icon be?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Roblox recommends a square 512x512 pixel PNG with a transparent background for both Game Passes and Badges. Note that Roblox masks Pass icons into a circle on the experience store tab, so keep text and emblems inside the circular safe zone.",
      },
    },
    {
      "@type": "Question",
      name: "Are icons exported from this Roblox Gamepass Icon Maker free for commercial games?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Single 512x512 PNG and vector SVG downloads are completely free with no watermark and can be uploaded to any personal, group, or commercial Roblox experience.",
      },
    },
    {
      "@type": "Question",
      name: "How do I connect my Gamepass icon to an in-game Roblox shop GUI?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Upload the 512x512 PNG under Creations -> Associated Items -> Passes in the Roblox Creator Dashboard, copy the Pass ID (and Image Asset ID), then wire MarketplaceService:PromptGamePassPurchase(player, passId) inside your Shop GUI LocalScript or ServerScriptService handler.",
      },
    },
  ],
};

export default function GamepassIconMakerPage() {
  return (
    <>
      <SiteNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareSchema).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
        }}
      />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="max-w-3xl mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-focus mb-2">
            512 × 512 Transparent PNG · Circular Safe-Zone Checked
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Roblox Gamepass Icon Maker
          </h1>
          <p className="text-ink-dim leading-relaxed">
            Build clean, readable 512×512 Roblox Gamepass badges and Developer
            Product shop icons in seconds. Pick a proven monetization archetype
            (VIP, 2X Cash, Auto Hatch, 3X Luck, Starter Pack), customize colors
            and metallic rims, verify legibility at 44px store size, and export
            a transparent PNG ready for the Creator Dashboard.
          </p>
        </div>

        <GamepassIconMaker locale="en" />

        <section className="mx-auto mt-16 max-w-3xl space-y-5 text-sm text-ink-dim leading-relaxed">
          <h2 className="text-2xl font-semibold text-ink">
            How to Size &amp; Wire Roblox Gamepass Icons Without Cropped Text
          </h2>
          <p>
            When you upload an image under{" "}
            <strong className="text-ink">
              Creator Dashboard → Creations → Passes
            </strong>
            , Roblox requires a square <strong className="text-ink">512×512</strong>{" "}
            image (PNG or JPG) and automatically clips the corners into a circle
            on your game&rsquo;s Store tab. Every Circle Pass preset above keeps
            the metallic rim, emblem, and heavy-stroke caption inside a 480px
            safe diameter so your pass title never gets clipped on mobile or
            console screens.
          </p>
          <p>
            For in-game{" "}
            <Link
              href="/templates/game-pass-shop"
              className="text-focus hover:underline"
            >
              Game Pass Shop GUIs
            </Link>{" "}
            and Developer Product grids (such as coin packs or stage skips),
            switch the badge shape to <strong className="text-ink">Shop Tile</strong>{" "}
            to export a rounded-square icon that fills{" "}
            <code className="text-ink">ImageLabel</code> cards cleanly, then pair
            it with one of our{" "}
            <Link href="/kits" className="text-focus hover:underline">
              multi-screen Roblox Game UI Kits
            </Link>
            .
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
