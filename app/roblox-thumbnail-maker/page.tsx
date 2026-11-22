import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "../components/SiteNav";
import { SiteFooter } from "../components/SiteFooter";
import { ThumbnailMaker } from "../tools/thumbnail/ThumbnailMaker";

const PAGE_URL = "https://robloxguimaker.app/roblox-thumbnail-maker";
const ZH_URL = "https://robloxguimaker.app/zh/roblox-thumbnail-maker";

export const metadata: Metadata = {
  title: "Roblox Thumbnail Maker — 1920×1080 Banner, Safe-Zone Overlay & 512×512 Icon Cropper",
  description:
    "Design high-CTR 1920×1080 Roblox game thumbnails in your browser. Inspect Roblox Discover 220px card safe zones, import any Roblox Asset ID background, and export clean 1920×1080 banners plus matched 512×512 icons.",
  keywords: [
    "roblox thumbnail maker",
    "roblox 1920x1080 thumbnail generator",
    "roblox safe zone checker",
    "roblox game icon 512x512",
    "roblox discover thumbnail preview",
  ],
  alternates: {
    canonical: "/roblox-thumbnail-maker",
    languages: {
      en: PAGE_URL,
      zh: ZH_URL,
      "x-default": PAGE_URL,
    },
  },
  openGraph: {
    title: "Roblox Thumbnail Maker — 1920×1080 Safe-Zone Studio & 512×512 Icon Crop",
    description:
      "Compose 1920×1080 Roblox game banners with Discover card overlay checks and instant 1:1 512×512 game icon cropping.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    q: "What are Roblox's recommended thumbnail and game icon dimensions?",
    a: "Roblox recommends uploading widescreen game thumbnails at 1920×1080 (16:9) and square game icons at 512×512 (1:1). This studio exports both resolutions from a single layout.",
  },
  {
    q: "Why does the safe-zone overlay matter for Discover click-through rate?",
    a: "On Roblox Home and Discover feeds, game cards shrink down to ~220px wide and place bottom-corner pills/ratings over thumbnails. Keeping bold titles inside the center safe zone prevents text clipping and unreadably small lettering.",
  },
  {
    q: "Can I load a screenshot or Roblox decal Asset ID as the background?",
    a: "Yes. Drop any local PNG/JPG/WebP screenshot onto the canvas or paste a numeric Roblox Asset ID / rbxassetid:// link to pull its preview via our proxy.",
  },
  {
    q: "Is watermark-free 1920×1080 PNG export free?",
    a: "Yes. Clean 1920×1080 PNG banner export and 512×512 icon crop export work in your browser with no account or watermark required.",
  },
];

const SCHEMA_GRAPH = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Roblox Thumbnail Maker",
      applicationCategory: "DesignApplication",
      operatingSystem: "Any (Web Browser)",
      url: PAGE_URL,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description:
        "Free 1920×1080 Roblox thumbnail maker with live Discover safe-zone overlay and 512×512 game icon center cropper.",
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

export default function RobloxThumbnailMakerPage() {
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
            1920×1080 &amp; 512×512 Cover Studio
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink mb-3">
            Roblox Thumbnail Maker &amp; Safe-Zone Checker
          </h1>
          <p className="text-base text-ink-dim max-w-3xl leading-relaxed">
            Compose punchy <span className="font-mono text-ink">1920×1080</span> game thumbnails,
            inspect real-time Roblox Discover <span className="font-mono text-ink">220px</span> card
            readability and <span className="font-mono text-ink">512×512</span> square icon crop,
            then export clean PNGs directly in your browser.
          </p>
        </div>

        <ThumbnailMaker locale="en" />

        <section className="mt-14 pt-10 border-t border-line">
          <h2 className="text-2xl font-semibold text-ink mb-6">
            How to design thumbnails that stand out on Roblox Discover
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: "01",
                title: "Import Studio Render or Asset ID",
                body: "Upload a clean Roblox Studio viewport capture or fetch an existing asset preview to anchor your background.",
              },
              {
                step: "02",
                title: "Set Genre Contrast & Sunburst",
                body: "Pick Simulator, Horror, Anime RNG, or Obby presets, tune background vignette, and dial accent colors.",
              },
              {
                step: "03",
                title: "Check 220px & Corner Badges",
                body: "Toggle Roblox safe zones to verify headlines avoid Discover corner pills and remain legible at feed card scale.",
              },
              {
                step: "04",
                title: "Export 16:9 + 1:1 Together",
                body: "Download the 1920×1080 widescreen thumbnail and a matching center-cropped 512×512 game icon in one click.",
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
            <h2 className="text-base font-semibold text-ink">Building the rest of your experience?</h2>
            <p className="text-sm text-ink-dim">
              Pair your new game cover with crisp pass badges, responsive menus, and Studio UI sync.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/gamepass-icon-maker"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:opacity-90"
            >
              Gamepass Icon Maker →
            </Link>
            <Link
              href="/roblox-shirt-tester"
              className="rounded-lg border border-line bg-panel px-4 py-2 text-sm font-medium text-ink hover:bg-raised"
            >
              3D Shirt Tester
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
