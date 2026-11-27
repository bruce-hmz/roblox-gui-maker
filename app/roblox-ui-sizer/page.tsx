import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "../components/SiteNav";
import { SiteFooter } from "../components/SiteFooter";
import { UiSizerTool } from "../tools/ui-sizer/UiSizerTool";

const PAGE_URL = "https://robloxguimaker.app/roblox-ui-sizer";
const ZH_URL = "https://robloxguimaker.app/zh/roblox-ui-sizer";

export const metadata: Metadata = {
  title: "Roblox UDim2 UI Sizer — Offset to Scale Converter",
  description:
    "Convert pixel UI offsets to responsive Roblox UDim2.fromScale values, copy UIAspectRatioConstraint Luau, and preview Asset IDs in your browser.",
  keywords: [
    "roblox udim2 converter",
    "roblox offset to scale calculator",
    "roblox ui responsive scale",
    "roblox asset id previewer",
    "uiaspectratioconstraint luau",
  ],
  alternates: {
    canonical: "/roblox-ui-sizer",
    languages: {
      en: PAGE_URL,
      zh: ZH_URL,
      "x-default": PAGE_URL,
    },
  },
  openGraph: {
    title: "Roblox UDim2 UI Sizer — Offset to Scale Converter",
    description:
      "Convert Figma or Photoshop pixel offsets to clean UDim2 Scale, copy UIAspectRatioConstraint Luau, and preview Roblox Asset IDs.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    q: "Why does Roblox UI built with pixel Offset look broken on mobile?",
    a: "Pixel Offsets stay the exact same number of pixels regardless of screen resolution. A 960px wide frame looks half-screen on 1080p PC, but overflows off-screen on a 844×390 phone. Converting Offset to Scale proportions keeps layouts consistent across every device.",
  },
  {
    q: "When should I pair UDim2 Scale with UIAspectRatioConstraint?",
    a: "Whenever a card, square inventory slot, or shop modal needs to preserve its shape between widescreen 16:9 monitors and taller 4:3 tablets. Setting AnchorPoint = Vector2.new(0.5, 0.5) plus UIAspectRatioConstraint prevents stretched UI.",
  },
  {
    q: "How does the Decal & Asset ID Previewer work?",
    a: "Paste a numeric Roblox ID or rbxassetid:// URI to resolve its live PNG thumbnail from Roblox's official thumbnail API without opening Studio.",
  },
  {
    q: "Can I visually build the entire ScreenGui instead of calculating one frame at a time?",
    a: "Yes. Open our visual GUI Builder to generate complete HUDs, Shops, and Inventories with AI or drag-and-drop and export Luau or native .rbxmx files directly.",
  },
];

const SCHEMA_GRAPH = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Roblox UDim2 UI Sizer & Asset ID Previewer",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any (Web Browser)",
      url: PAGE_URL,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description:
        "Free Roblox UDim2 pixel Offset to Scale converter, responsive constraint Luau generator, and rbxassetid:// image previewer.",
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

export default function RobloxUiSizerPage() {
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
            Responsive UI &amp; Asset Utility
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink mb-3">
            Roblox UDim2 UI Sizer &amp; Asset ID Previewer
          </h1>
          <p className="text-base text-ink-dim max-w-3xl leading-relaxed">
            Turn Figma or Photoshop pixel coordinates into exact{" "}
            <span className="font-mono text-ink">UDim2.fromScale</span> values, test 1080p vs
            mobile &amp; tablet scaling side-by-side, copy ready{" "}
            <span className="font-mono text-ink">UIAspectRatioConstraint</span> Luau, and verify
            any <span className="font-mono text-ink">rbxassetid://</span> thumbnail.
          </p>
        </div>

        <UiSizerTool locale="en" />

        <section className="mt-14 pt-10 border-t border-line">
          <h2 className="text-2xl font-semibold text-ink mb-6">
            Zero-stretch Roblox UI workflow
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: "01",
                title: "Set Reference Canvas",
                body: "Choose your design canvas (e.g. 1920×1080 PC or 1280×720) matching your mockup artboard.",
              },
              {
                step: "02",
                title: "Enter Pixel X, Y, W, H",
                body: "Input exact frame coordinates and enable centered AnchorPoint (0.5, 0.5) for balanced modals.",
              },
              {
                step: "03",
                title: "Compare 3 Viewports Live",
                body: "Check rendered pixel sizes across 1080p Desktop, Phone Landscape, and iPad 4:3 simultaneously.",
              },
              {
                step: "04",
                title: "Copy Luau + Test Decals",
                body: "Copy production Luau with optional UIAspectRatioConstraint + UISizeConstraint, and inspect Asset IDs right below.",
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
            <h2 className="text-base font-semibold text-ink">Ready to build multi-screen GUIs?</h2>
            <p className="text-sm text-ink-dim">
              Open the visual GUI Builder or sync scenes into Roblox Studio with our offline plugin.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/editor"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:opacity-90"
            >
              Launch GUI Builder →
            </Link>
            <Link
              href="/studio-plugin"
              className="rounded-lg border border-line bg-panel px-4 py-2 text-sm font-medium text-ink hover:bg-raised"
            >
              Offline Studio Plugin
            </Link>
            <Link
              href="/guides/how-to-script-a-roblox-gui"
              className="rounded-lg border border-line bg-panel px-4 py-2 text-sm font-medium text-ink hover:bg-raised"
            >
              UI Scripting Guide
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
