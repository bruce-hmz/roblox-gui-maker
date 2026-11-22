import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "../components/SiteNav";
import { SiteFooter } from "../components/SiteFooter";
import { ShirtStudio } from "../tools/shirt/ShirtStudio";

const PAGE_URL = "https://robloxguimaker.app/roblox-shirt-template-maker";
const ZH_URL = "https://robloxguimaker.app/zh/roblox-shirt-template-maker";

export const metadata: Metadata = {
  title: "Roblox Shirt Template Maker — Custom 585×559 Shirts & Pants PNG Generator",
  description:
    "Create pixel-exact 585×559 Roblox classic shirt and pants PNG templates in your browser. Customize torso, sleeves, collar cutout, pocket stripe, chest emblem, and UV guides, then preview live in 3D.",
  keywords: [
    "roblox shirt template maker",
    "roblox 585x559 template generator",
    "roblox pants template png",
    "roblox classic clothing maker",
    "transparent roblox shirt template",
  ],
  alternates: {
    canonical: "/roblox-shirt-template-maker",
    languages: {
      en: PAGE_URL,
      zh: ZH_URL,
      "x-default": PAGE_URL,
    },
  },
  openGraph: {
    title: "Roblox Shirt Template Maker — 585×559 Transparent PNG & SVG",
    description:
      "Design and export upload-ready 585×559 Roblox shirts and pants with collar cutouts, UV guide overlays, and live 3D R6 preview.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    q: "Does the exported PNG already include transparent margins for Roblox?",
    a: "Yes. When UV Guides are toggled off, areas outside the 18 official body UV rectangles remain fully transparent and export at an exact 585×559 resolution.",
  },
  {
    q: "Can I use the generated SVG in Photoshop, Photopea, or Figma?",
    a: "Yes. Exporting the clean SVG gives you vector layers at the exact 585×559 Roblox UV coordinates so you can paint custom shading or logos on top.",
  },
  {
    q: "Can I make both Shirts and Pants here?",
    a: "Yes. Switch between Shirt (Torso + Arms) and Pants (Torso + Legs) in the top toggle; UV layout coordinates are identical in Roblox’s 585×559 spec.",
  },
  {
    q: "How do I test a template I edited in Photoshop afterward?",
    a: "Switch to the 3D Tester tab or visit the Roblox Shirt Tester page and drop your edited 585×559 PNG right onto the 3D R6 model.",
  },
];

const SCHEMA_GRAPH = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Roblox Shirt Template Maker",
      applicationCategory: "DesignApplication",
      operatingSystem: "Any (Web Browser)",
      url: PAGE_URL,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description:
        "Free 585×559 Roblox classic shirt and pants template generator with live 3D R6 preview and clean PNG/SVG export.",
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ],
};

export default function RobloxShirtTemplateMakerPage() {
  return (
    <>
      <SiteNav />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA_GRAPH) }}
        />

        <div className="mb-8">
          <p className="text-xs font-mono uppercase tracking-wider text-focus mb-2">
            585×559 Clothing Generator
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink mb-3">
            Roblox Shirt Template Maker
          </h1>
          <p className="text-base text-ink-dim max-w-3xl leading-relaxed">
            Build upload-ready <span className="font-mono text-ink">585×559</span> Roblox shirt and
            pants templates with transparent neck cutouts, trim stripes, UV labels, and instant 3D R6
            preview—free with no watermark.
          </p>
        </div>

        <ShirtStudio defaultMode="maker" locale="en" />

        <section className="mt-14 pt-10 border-t border-line">
          <h2 className="text-2xl font-semibold text-ink mb-6">
            From template generator to Creator Hub in 4 steps
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: "01",
                title: "Pick Shirt or Pants + Preset",
                body: "Start from Hoodie, Streetwear Jacket, Tactician Suit, or Cozy Varsity palettes with pre-calibrated colors.",
              },
              {
                step: "02",
                title: "Tune Collar & Trim",
                body: "Adjust crew/V-neck/hoodie collar cutouts, chest stripe accents, and minimalist chest emblem shapes.",
              },
              {
                step: "03",
                title: "Preview Live in 3D",
                body: "Every slider updates both the flat 585×559 UV sheet and the interactive 3D R6 mannequin simultaneously.",
              },
              {
                step: "04",
                title: "Export Clean 585×559 PNG",
                body: "Disable UV Guides before clicking Export PNG to download an upload-ready Roblox asset with transparent margins.",
              },
            ].map((card) => (
              <div key={card.step} className="rounded-xl border border-line bg-panel p-5">
                <span className="text-xs font-mono text-focus">{card.step}</span>
                <h3 className="text-base font-semibold text-ink mt-1 mb-2">{card.title}</h3>
                <p className="text-sm text-ink-dim leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 pt-10 border-t border-line">
          <h2 className="text-2xl font-semibold text-ink mb-6">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {FAQ_ITEMS.map((item) => (
              <div key={item.q} className="rounded-xl border border-line bg-panel p-5">
                <h3 className="text-sm font-semibold text-ink mb-2">{item.q}</h3>
                <p className="text-sm text-ink-dim leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 pt-8 border-t border-line flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-ink">Ready to test your own artwork?</h2>
            <p className="text-sm text-ink-dim">
              Drop any edited 585×559 PNG into the 3D Shirt Tester or build your game UI next.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/roblox-shirt-tester"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:opacity-90"
            >
              3D Shirt Tester →
            </Link>
            <Link
              href="/roblox-ui-sizer"
              className="rounded-lg border border-line bg-panel px-4 py-2 text-sm font-medium text-ink hover:bg-raised"
            >
              UDim2 UI Sizer
            </Link>
            <Link
              href="/gamepass-icon-maker"
              className="rounded-lg border border-line bg-panel px-4 py-2 text-sm font-medium text-ink hover:bg-raised"
            >
              Gamepass Icon Maker
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
