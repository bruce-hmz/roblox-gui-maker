import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "../components/SiteNav";
import { SiteFooter } from "../components/SiteFooter";
import { AvatarGallery } from "./AvatarGallery";

export const metadata: Metadata = {
  title: "Roblox Avatar Ideas — Free & Budget Outfits with Real Item IDs",
  description:
    "Curated Roblox avatar outfit ideas with real catalog item IDs: free starter looks, streetwear, soft pastel, hime cut and formal styles. Copy an ID, open the Roblox catalog, equip.",
  alternates: {
    canonical: "/avatar",
    languages: {
      en: "https://robloxguimaker.app/avatar",
      zh: "https://robloxguimaker.app/zh/avatar",
    },
  },
  openGraph: {
    title: "Roblox Avatar Ideas — Free & Budget Outfits with Real Item IDs",
    description:
      "Curated Roblox avatar looks with real catalog item IDs — free starter fits, streetwear, soft pastel, hime cut and formal. Copy an ID, equip it in minutes.",
    url: "https://robloxguimaker.app/avatar",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roblox Avatar Ideas — Free & Budget Outfits with Real Item IDs",
    description:
      "Curated Roblox avatar looks with real catalog item IDs — free starter fits, streetwear, soft pastel, hime cut and formal.",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Are there free Roblox avatar outfits here?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Two looks on this page — Classic Start and Clean Campus — are built entirely from Roblox's official free items (hair, face, hoodie, pants, sneakers), so they cost 0 Robux.",
      },
    },
    {
      "@type": "Question",
      name: "How do I use an item ID to get an outfit?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Copy the item ID on this page, open the item's catalog page via the link button, then buy (or get it free) and equip it in the Roblox avatar editor at roblox.com/my/avatar. You can also paste an ID into the catalog search.",
      },
    },
    {
      "@type": "Question",
      name: "Do the Robux prices on this page stay accurate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "They are the lowest catalog prices at the time we pulled them (August 2026). Community clothing prices shift over time, so treat each catalog page as the source of truth.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use these avatar items inside my own Roblox game?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Avatar items belong to the player's character, not the game. What you can build yourself is the game's interface — main menus, shops and inventory screens — which is exactly what Roblox GUI Maker generates Luau for.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://robloxguimaker.app" },
    { "@type": "ListItem", position: 2, name: "Avatar Ideas", item: "https://robloxguimaker.app/avatar" },
  ],
};

export default function AvatarPage() {
  return (
    <>
      <SiteNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c"),
        }}
      />
      <main className="max-w-5xl mx-auto px-6 py-12">
        <p className="text-focus text-xs font-semibold uppercase tracking-wider mb-2">
          For Roblox players
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Roblox Avatar Ideas — Free &amp; Budget Outfit Looks
        </h1>
        <p className="text-lg text-ink-dim mb-10 leading-relaxed max-w-3xl">
          Eight curated outfits built from real catalog items — two cost nothing at
          all, none goes over R$ 205. Every item shows its ID: copy it, open it in
          the Roblox catalog, and equip it on your avatar in minutes.
        </p>

        <AvatarGallery />

        <section className="mt-14 max-w-3xl">
          <h2 className="text-xl font-semibold text-ink mb-4">
            How to equip these items on your avatar
          </h2>
          <ol className="flex flex-col gap-3 text-ink-dim leading-relaxed list-decimal list-inside">
            <li>
              Copy the item ID (or use the link button) for any piece you like.
            </li>
            <li>
              Open the item's catalog page and get it — free items attach
              instantly, paid ones show the current Robux price.
            </li>
            <li>
              Go to{" "}
              <a
                href="https://www.roblox.com/my/avatar"
                target="_blank"
                rel="noopener noreferrer"
                className="text-focus hover:underline"
              >
                roblox.com/my/avatar
              </a>{" "}
              and equip everything from your inventory.
            </li>
          </ol>
        </section>

        <section className="mt-12 max-w-3xl">
          <h2 className="text-xl font-semibold text-ink mb-4">FAQ</h2>
          <div className="flex flex-col gap-4">
            {[
              {
                q: "Are there free Roblox avatar outfits here?",
                a: "Yes — Classic Start and Clean Campus are built entirely from Roblox's official free items, so both cost 0 Robux.",
              },
              {
                q: "How do I use an item ID to get an outfit?",
                a: "Copy the ID, open the item's catalog page (the link button next to each item), get the item, then equip it in the avatar editor at roblox.com/my/avatar.",
              },
              {
                q: "Do the Robux prices stay accurate?",
                a: "They are the lowest prices at our August 2026 pull. Community clothing prices shift, so the catalog page is always the source of truth.",
              },
              {
                q: "Can I use these avatar items inside my own game?",
                a: "Avatar items live on the player's character, not in games. The part you can build is the game's interface — which is what the GUI maker below is for.",
              },
            ].map((f) => (
              <div key={f.q}>
                <h3 className="font-semibold text-ink">{f.q}</h3>
                <p className="text-ink-dim text-sm mt-1">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-12 text-sm text-ink-mute max-w-3xl leading-relaxed">
          Roblox GUI Maker is an independent, unofficial tool and is not
          affiliated with or endorsed by Roblox Corporation. Item names, IDs and
          prices reference the public Roblox catalog. Building a game for your
          avatar to star in?{" "}
          <Link href="/editor" className="text-focus hover:underline">
            Make its interface here
          </Link>
          .
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
