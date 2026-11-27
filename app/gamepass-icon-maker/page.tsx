import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "../components/SiteNav";
import { SiteFooter } from "../components/SiteFooter";
import { GamepassIconMaker } from "./GamepassIconMaker";

export const metadata: Metadata = {
  title: "Roblox Gamepass Icon Maker — Free 512x512 Badge Tool",
  description:
    "Create transparent 512x512 Roblox Gamepass icons and shop badges free. Pick VIP, 2x Cash, or Luck presets, check circular crop, and export PNG.",
  alternates: {
    canonical: "/gamepass-icon-maker",
    languages: {
      "x-default": "https://robloxguimaker.app/gamepass-icon-maker",
      en: "https://robloxguimaker.app/gamepass-icon-maker",
      zh: "https://robloxguimaker.app/zh/gamepass-icon-maker",
    },
  },
  openGraph: {
    title: "Roblox Gamepass Icon Maker — Free 512x512 Badge Tool",
    description:
      "Design and export 512x512 transparent PNG Roblox Gamepass and shop icons instantly. Zero watermark, no login.",
    url: "https://robloxguimaker.app/gamepass-icon-maker",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roblox Gamepass Icon Maker — Free 512x512 Badge Tool",
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

        <section className="mx-auto mt-14 max-w-4xl space-y-6 text-sm text-ink-dim leading-relaxed">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-ink">
              Monetization Badge Archetypes That Convert in Top Experiences
            </h2>
            <p>
              High-earning Roblox games rarely reinvent UI iconography for every pass. Players scan
              the Store tab and in-game shop grid looking for familiar visual shorthand. Choosing a
              proven color-and-symbol pair inside your{" "}
              <strong>Roblox Gamepass icon</strong> helps players understand the perk before even
              reading the Robux price:
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-line bg-panel">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-line bg-panel-raised uppercase tracking-wider text-ink-mute">
                <tr>
                  <th className="px-4 py-3">Pass Type</th>
                  <th className="px-4 py-3">Recommended Color &amp; Emblem</th>
                  <th className="px-4 py-3">Short Label</th>
                  <th className="px-4 py-3">Best Genre Fit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-ink-dim">
                <tr>
                  <td className="px-4 py-2.5 font-semibold text-ink">VIP Status Pass</td>
                  <td className="px-4 py-2.5">Gold metallic rim + Crown</td>
                  <td className="px-4 py-2.5 font-mono text-ink">VIP</td>
                  <td className="px-4 py-2.5">Simulators, Tycoons, Roleplay hubs</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-semibold text-ink">2X Currency / Coins</td>
                  <td className="px-4 py-2.5">Emerald green or bright yellow + Coin Stack / X2</td>
                  <td className="px-4 py-2.5 font-mono text-ink">2X CASH</td>
                  <td className="px-4 py-2.5">Clickers, Tycoons, Grind RPGs</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-semibold text-ink">Auto Hatch / Fast Open</td>
                  <td className="px-4 py-2.5">Electric cyan + Bolt / Pet Egg</td>
                  <td className="px-4 py-2.5 font-mono text-ink">AUTO</td>
                  <td className="px-4 py-2.5">Pet Simulators, RNG Rollers</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-semibold text-ink">Super / Mega Luck</td>
                  <td className="px-4 py-2.5">Royal violet or vibrant lime + Clover / Star</td>
                  <td className="px-4 py-2.5 font-mono text-ink">3X LUCK</td>
                  <td className="px-4 py-2.5">RNG Aura games, Tower Defense</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-semibold text-ink">Skip Stage / Speed Coil</td>
                  <td className="px-4 py-2.5">Crimson orange + Wing / Fast-Forward</td>
                  <td className="px-4 py-2.5 font-mono text-ink">SKIP</td>
                  <td className="px-4 py-2.5">Obby, Parkour, Difficulty Towers</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-semibold text-ink">Starter Pack Bundle</td>
                  <td className="px-4 py-2.5">Sunset sky blue + Gift Chest / Shield</td>
                  <td className="px-4 py-2.5 font-mono text-ink">STARTER</td>
                  <td className="px-4 py-2.5">All monetization genres</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-4xl space-y-4 text-sm text-ink-dim leading-relaxed">
          <h2 className="text-2xl font-semibold text-ink">
            Circular Safe-Zone Specs &amp; Luau Shop Wiring
          </h2>
          <p>
            Even though Roblox Creator Dashboard asks for a{" "}
            <code className="text-ink">512×512</code> square PNG, the public Store page clips every{" "}
            <strong>Roblox Gamepass icon</strong> inside a circle and shrinks it down to roughly
            44×44 CSS pixels inside mobile cards. Keep main artwork inside the center 480px circle,
            use thick dark outlines around captions, and preview at 44px scale before exporting.
          </p>
          <p>
            Once Roblox moderation approves your upload, copy both the Image Asset ID (for your
            shop card&rsquo;s <code className="text-ink">ImageLabel</code>) and the Game Pass ID
            (for prompting checkout in Luau):
          </p>
          <pre className="overflow-x-auto rounded-xl border border-line bg-panel p-4 font-mono text-xs text-ink">
{`local MarketplaceService = game:GetService("MarketplaceService")
local Players = game:GetService("Players")

local VIP_PASS_ID = 123456789 -- Replace with your Creator Dashboard Pass ID
local vipButton = script.Parent:WaitForChild("VipBuyButton")

vipButton.Activated:Connect(function()
\tMarketplaceService:PromptGamePassPurchase(Players.LocalPlayer, VIP_PASS_ID)
end)`}
          </pre>
          <p>
            Prefer not to build the surrounding storefront from scratch? Pair your 512×512 badges
            with our free{" "}
            <Link href="/editor" className="text-focus hover:underline">
              Roblox GUI Editor
            </Link>
            , preview every screen inside our{" "}
            <Link href="/kits" className="text-focus hover:underline">
              6 genre-matched UI Kits
            </Link>
            , or unlock all 48 pre-rendered monetization badges plus native Studio{" "}
            <code className="text-ink">.rbxmx</code> models on{" "}
            <Link href="/pricing" className="text-focus hover:underline">
              Pricing
            </Link>
            .
          </p>
        </section>

        <section className="mx-auto mt-14 max-w-4xl grid gap-6 md:grid-cols-2 text-sm text-ink-dim leading-relaxed">
          <div className="rounded-xl border border-line bg-panel p-5 space-y-2.5">
            <h2 className="text-lg font-semibold text-ink">
              Pass Ordering &amp; Anchoring Strategy for Higher Robux Conversion
            </h2>
            <p>
              Ordering your <strong>Roblox Gamepass icon</strong> cards inside an in-game store
              directly affects conversion rate. Successful Simulator and Tycoon games avoid listing
              only cheap 25 Robux boosts at the top. Instead, anchor player expectations by placing
              your flagship high-value <strong>VIP</strong> or <strong>2X Luck</strong> badge beside
              an accessible <strong>2X Cash</strong> or <strong>Starter Pack</strong> card.
            </p>
            <p>
              Give your highest-margin pass the warmest metallic frame (Gold or Royal Violet) while
              keeping utility toggles like Auto Hatch in cool Cyan so players immediately distinguish
              status perks, multipliers, and convenience tools at a glance.
            </p>
          </div>

          <div className="rounded-xl border border-line bg-panel p-5 space-y-2.5">
            <h2 className="text-lg font-semibold text-ink">
              Creator Dashboard Approval &amp; Moderation Checklist
            </h2>
            <p>
              Every uploaded <strong>Roblox Gamepass icon</strong> passes through automated and
              human image moderation before displaying in live servers. Keep approvals fast and
              zero-rejection with three habits:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                Never bake raw Robux currency logos, fake discount percentages over third-party IP,
                or unreadable micro-text smaller than 16px inside the 512×512 frame.
              </li>
              <li>
                Keep descriptive benefit text clean and concise (e.g., <code className="text-ink">VIP</code>,{" "}
                <code className="text-ink">2X CASH</code>, <code className="text-ink">AUTO</code>).
              </li>
              <li>
                Test both the public circular store preview and rounded{" "}
                <code className="text-ink">Shop Tile</code> card variant before uploading bulk
                passes to Creator Dashboard.
              </li>
            </ul>
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-4xl space-y-6 text-sm text-ink-dim leading-relaxed">
          <h2 className="text-2xl font-semibold text-ink">
            Roblox Gamepass Icon Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {FAQS.map((item) => (
              <div
                key={item.q}
                className="rounded-xl border border-line bg-panel p-5"
              >
                <h3 className="font-semibold text-ink">{item.q}</h3>
                <p className="mt-1.5">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
