import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "../components/SiteNav";
import { SiteFooter } from "../components/SiteFooter";
import { ShirtStudio } from "../tools/shirt/ShirtStudio";

const PAGE_URL = "https://robloxguimaker.app/roblox-shirt-tester";
const ZH_URL = "https://robloxguimaker.app/zh/roblox-shirt-tester";

export const metadata: Metadata = {
  title: "Roblox Shirt Tester 3D — Preview 585×559 Shirts & Pants Before Paying 10 Robux",
  description:
    "Free online Roblox Shirt & Pants Tester. Drop your 585×559 PNG template to inspect every front, back, left, right, top, and bottom R6 seam in 3D before spending 10 Robux to upload.",
  keywords: [
    "roblox shirt tester",
    "roblox 3d shirt preview",
    "roblox 585x559 clothing tester",
    "test roblox shirt without robux",
    "roblox pants seam checker",
  ],
  alternates: {
    canonical: "/roblox-shirt-tester",
    languages: {
      en: PAGE_URL,
      zh: ZH_URL,
      "x-default": PAGE_URL,
    },
  },
  openGraph: {
    title: "Roblox Shirt Tester 3D — Preview 585×559 Templates Before Uploading",
    description:
      "Inspect 585×559 Roblox shirt and pants UV alignment on an interactive 3D R6 rig in your browser. Catch misaligned seams before spending 10 Robux.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    q: "Why test a Roblox shirt before uploading to Creator Hub?",
    a: "Roblox charges a 10 Robux upload fee for every classic shirt and pants asset. Previewing your 585×559 PNG on an interactive 3D R6 rig lets you catch flipped sleeves, collar cutoffs, or neck gaps before paying.",
  },
  {
    q: "What dimensions does Roblox require for classic shirts and pants?",
    a: "Every classic Roblox shirt and pants PNG must measure exactly 585 pixels wide by 559 pixels tall. Uploads with other dimensions are rejected by Roblox Studio and the Creator Dashboard.",
  },
  {
    q: "Are my clothing PNG files uploaded to any server?",
    a: "No. Everything runs locally in your browser via FileReader and HTML5 Canvas slicing. Your designs stay private on your device.",
  },
  {
    q: "How do I create a fresh 585×559 template if I do not have one yet?",
    a: "Switch to the Template Maker tab inside the studio above or open the dedicated Roblox Shirt Template Maker to export an exact 585×559 PNG with collar, stripes, and UV guides.",
  },
];

const SCHEMA_GRAPH = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Roblox Shirt Tester 3D",
      applicationCategory: "DesignApplication",
      operatingSystem: "Any (Web Browser)",
      url: PAGE_URL,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description:
        "Browser-based 3D R6 Roblox shirt and pants tester for inspecting 585×559 UV templates before paying the 10 Robux upload fee.",
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

export default function RobloxShirtTesterPage() {
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
            Free Roblox Creator Tool
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink mb-3">
            Roblox Shirt Tester 3D
          </h1>
          <p className="text-base text-ink-dim max-w-3xl leading-relaxed">
            Drop your <span className="font-mono text-ink">585×559</span> shirt or pants PNG to
            check every R6 UV seam, sleeve wrap, and collar fit in 3D before spending 10 Robux on
            Roblox Creator Hub.
          </p>
        </div>

        <ShirtStudio defaultMode="tester" locale="en" />

        <section className="mt-14 pt-10 border-t border-line">
          <h2 className="text-2xl font-semibold text-ink mb-6">
            How to check your Roblox shirt before uploading
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: "01",
                title: "Drop 585×559 PNG",
                body: "Upload your classic shirt or pants image. Non-585×559 canvases trigger an immediate dimension alert.",
              },
              {
                step: "02",
                title: "Drag to Orbit R6",
                body: "Rotate 360° around torso, shoulders, and arm inner faces using mouse drag or quick Front/Back/Side camera buttons.",
              },
              {
                step: "03",
                title: "Swap Skin & Lighting",
                body: "Test transparent collar cutouts against warm, light, tan, or dark skin tones and studio/daylight/midnight lighting.",
              },
              {
                step: "04",
                title: "Inspect UV Slices",
                body: "Verify all 18 UV boxes—Front, Back, Left, Right, Up, Down across Torso and Limbs—align cleanly before uploading.",
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
            <h2 className="text-base font-semibold text-ink">Need a fresh 585×559 starter template?</h2>
            <p className="text-sm text-ink-dim">
              Design pixel-exact shirts and pants with collar cutouts, stripes, and UV labels.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/roblox-shirt-template-maker"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:opacity-90"
            >
              Open Template Maker →
            </Link>
            <Link
              href="/roblox-thumbnail-maker"
              className="rounded-lg border border-line bg-panel px-4 py-2 text-sm font-medium text-ink hover:bg-raised"
            >
              1920×1080 Thumbnail Maker
            </Link>
            <Link
              href="/editor"
              className="rounded-lg border border-line bg-panel px-4 py-2 text-sm font-medium text-ink hover:bg-raised"
            >
              GUI Builder
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
