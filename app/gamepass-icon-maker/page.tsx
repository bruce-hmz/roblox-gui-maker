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

const FAQS = [
  {
    q: "What size should a Roblox Gamepass icon be?",
    a: "Roblox recommends a square 512x512 pixel PNG image for both Game Passes and Badges. Uploading a crisp 1:1 512x512 PNG prevents blurry scaling on desktop, mobile store pages, and in-game shop cards.",
  },
  {
    q: "Why does Roblox cut off the corners of my Gamepass icon?",
    a: "On your experience's Store tab, Roblox masks every Pass thumbnail into a circle. Any corner text, badges, or rims drawn outside the inner 480px circular safe zone get clipped. Use the Circle Pass mode and toggle the safe-zone ring preview above before exporting.",
  },
  {
    q: "How do I upload a Gamepass icon in Roblox Creator Dashboard?",
    a: "Open create.roblox.com, select your experience, go to Monetization -> Passes -> Create a Pass (or edit an existing pass), click Change Image, and upload your exported 512x512 PNG. Once approved, copy the Pass ID for PromptGamePassPurchase and the Image Asset ID for ImageLabel cards.",
  },
  {
    q: "What is the difference between Circle Pass and Shop Tile shapes?",
    a: "Circle Pass keeps borders, emblems, and bold labels centered inside Roblox's Store circular mask. Shop Tile exports a rounded-square card badge shaped for in-game Game Pass Shop GUIs and Developer Product ImageLabel slots.",
  },
  {
    q: "How do I wire my Gamepass icon inside a Roblox Shop GUI script?",
    a: "Assign rbxassetid://<ImageAssetId> to a square ImageLabel (with UIAspectRatioConstraint AspectRatio = 1 and ScaleType = Fit), then call MarketplaceService:PromptGamePassPurchase(player, passId) on button Activated and verify ownership server-side via UserOwnsGamePassAsync.",
  },
  {
    q: "Are exported 512x512 icons free for commercial Roblox games?",
    a: "Yes. Exporting single 512x512 PNG and vector SVG files from the Gamepass Icon Maker is free with no login and no watermark, and you can ship them in personal, group, or commercial Roblox experiences.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.a,
    },
  })),
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
            How to Make &amp; Upload Roblox Gamepass Icons in 4 Steps
          </h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <strong className="text-ink">Pick an emblem &amp; palette:</strong>{" "}
              Start with a preset matched to your game genre (Simulator, Anime,
              Obby, Dark Fantasy, Sci-Fi, or Cozy) and keep captions to 1–2 bold
              words like <code className="text-ink">VIP</code> or{" "}
              <code className="text-ink">2X COINS</code>.
            </li>
            <li>
              <strong className="text-ink">Check the circular safe zone:</strong>{" "}
              Keep Circle Pass enabled for Creator Store passes so Roblox&rsquo;s
              round thumbnail mask never slices your metallic border or text, and
              preview the 44px thumbnail view for mobile legibility.
            </li>
            <li>
              <strong className="text-ink">Export 512×512 PNG (free, no watermark):</strong>{" "}
              Download transparent PNG for Creator Dashboard passes or switch to{" "}
              <strong className="text-ink">Shop Tile</strong> for rounded-square
              in-game <code className="text-ink">ImageLabel</code> slots.
            </li>
            <li>
              <strong className="text-ink">Upload &amp; wire in Studio:</strong>{" "}
              Upload under{" "}
              <strong className="text-ink">
                Creator Dashboard → Creations → Monetization → Passes
              </strong>
              , then connect the Pass ID to{" "}
              <code className="text-ink">
                MarketplaceService:PromptGamePassPurchase
              </code>{" "}
              using our{" "}
              <Link
                href="/templates/game-pass-shop"
                className="text-focus hover:underline"
              >
                Game Pass Shop GUI template
              </Link>{" "}
              or{" "}
              <Link
                href="/guides/how-to-make-a-roblox-gamepass-shop-gui"
                className="text-focus hover:underline"
              >
                step-by-step Game Pass Shop guide
              </Link>
              .
            </li>
          </ol>
          <p>
            Need a matching full UI set? Read our{" "}
            <Link
              href="/guides/how-to-make-roblox-gamepass-icons"
              className="text-focus hover:underline"
            >
              512×512 Gamepass Icon Spec Guide
            </Link>{" "}
            or explore{" "}
            <Link href="/kits" className="text-focus hover:underline">
              multi-screen Roblox Game UI Kits
            </Link>{" "}
            that bundle 6 genre-matched icons alongside 5 Studio{" "}
            <code className="text-ink">.rbxmx</code> screens.
          </p>
        </section>

        <section className="mx-auto mt-14 max-w-3xl space-y-6 text-sm text-ink-dim leading-relaxed">
          <h2 className="text-2xl font-semibold text-ink">
            Roblox Gamepass Icon Frequently Asked Questions
          </h2>
          {FAQS.map((item) => (
            <div
              key={item.q}
              className="rounded-xl border border-line bg-panel p-5"
            >
              <h3 className="font-semibold text-ink">{item.q}</h3>
              <p className="mt-1.5">{item.a}</p>
            </div>
          ))}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
