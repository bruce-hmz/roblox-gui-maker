import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "../components/SiteNav";
import { SiteFooter } from "../components/SiteFooter";
import { ThumbnailMaker } from "../tools/thumbnail/ThumbnailMaker";
import {
  GAME_ICON_SIZE,
  ROBLOX_SAFE_ZONES,
  THUMBNAIL_HEIGHT,
  THUMBNAIL_WIDTH,
} from "../tools/thumbnail/thumbnail-spec";

const PAGE_URL = "https://robloxguimaker.app/roblox-thumbnail-maker";
const ZH_URL = "https://robloxguimaker.app/zh/roblox-thumbnail-maker";

export const metadata: Metadata = {
  title: "Roblox Thumbnail Maker — 1920x1080 Banner and Safe Zones",
  description:
    "Design 1920x1080 Roblox game thumbnails with live 220px Discover card safe-zone overlays and matching 512x512 game icon cropping in your browser.",
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
    title: "Roblox Thumbnail Maker — 1920x1080 Banner and Safe Zones",
    description:
      "Compose 1920x1080 Roblox game banners with Discover card overlay checks and instant 1:1 512x512 game icon cropping.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    q: "What are the recommended Roblox thumbnail and game icon sizes?",
    a: "Roblox recommends uploading widescreen experience thumbnails at 1920x1080 (16:9 PNG or JPG) and square game icons at 512x512 (1:1). This Roblox thumbnail maker exports both resolutions from a single layout.",
  },
  {
    q: "Why does the safe-zone overlay matter for Roblox Discover click-through rate?",
    a: "On Roblox Home and Discover feeds, game cards shrink down to ~220px wide and place rating percentages, live player pills, and event badges over corners. Keeping headlines inside the 5% safe zone prevents awkward text clipping.",
  },
  {
    q: "How do I turn a 1920x1080 thumbnail into a matching 512x512 Game Icon?",
    a: "Keep your focal character and bold title inside the center square box inside the studio above, then click Export 512x512 Icon to crop a sharp 1:1 game icon automatically.",
  },
  {
    q: "Can I load a Studio render or Roblox decal Asset ID as the background?",
    a: "Yes. Drop any local PNG, JPG, or WebP Roblox Studio capture onto the canvas or paste a numeric Asset ID or rbxassetid:// link to fetch its background image.",
  },
  {
    q: "What makes a Roblox game thumbnail convert higher on mobile feeds?",
    a: "Use fewer than 4 giant headline words (e.g., UPDATE 12 or 2X COINS), strong warm/cool foreground-to-background separation, clean sunburst framing, and crisp readability at the live 220px card preview size.",
  },
  {
    q: "Is watermark-free 1920x1080 PNG export completely free?",
    a: "Yes. Clean 1920x1080 banner export and 512x512 game icon cropping run locally in your browser with no login and no watermark.",
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

        <section className="mt-12 pt-10 border-t border-line space-y-6">
          <div className="max-w-3xl space-y-3">
            <h2 className="text-2xl font-semibold text-ink">
              Roblox Thumbnail Dimensions &amp; Discover Safe-Zone Coordinates
            </h2>
            <p className="text-sm text-ink-dim leading-relaxed">
              A sharp <strong>Roblox thumbnail maker</strong> does more than paste big text onto a
              16:9 canvas. Roblox Discover, Search, and Experience Detail pages overlay rating
              pills, sponsored tags, and square icon crops directly on top of your{" "}
              <code className="text-ink">
                {THUMBNAIL_WIDTH}×{THUMBNAIL_HEIGHT}
              </code>{" "}
              banner. Keep headlines and faces clear of these exact pixel boxes so nothing gets
              covered on mobile or desktop:
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-line bg-panel">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-panel-raised text-xs uppercase tracking-wider text-ink-mute">
                <tr>
                  <th className="px-4 py-3">Format / Overlay Zone</th>
                  <th className="px-4 py-3">Canvas Coordinates (X, Y)</th>
                  <th className="px-4 py-3">Dimensions (px)</th>
                  <th className="px-4 py-3">Design Rule</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-ink-dim">
                <tr>
                  <td className="px-4 py-2.5 font-medium text-ink">Widescreen Experience Thumbnail</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-ink">(0, 0)</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-ink">
                    {THUMBNAIL_WIDTH} × {THUMBNAIL_HEIGHT}
                  </td>
                  <td className="px-4 py-2.5 text-xs">
                    16:9 hero banner used across detail carousel and Search cards
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-medium text-ink">
                    {ROBLOX_SAFE_ZONES.titleSafe.labelEn}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-ink">
                    ({ROBLOX_SAFE_ZONES.titleSafe.x}, {ROBLOX_SAFE_ZONES.titleSafe.y})
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-ink">
                    {ROBLOX_SAFE_ZONES.titleSafe.width} × {ROBLOX_SAFE_ZONES.titleSafe.height}
                  </td>
                  <td className="px-4 py-2.5 text-xs">
                    Keep all update titles, subtitles, and character heads inside this frame
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-medium text-ink">
                    {ROBLOX_SAFE_ZONES.bottomLeftOverlay.labelEn}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-ink">
                    ({ROBLOX_SAFE_ZONES.bottomLeftOverlay.x},{" "}
                    {ROBLOX_SAFE_ZONES.bottomLeftOverlay.y})
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-ink">
                    {ROBLOX_SAFE_ZONES.bottomLeftOverlay.width} ×{" "}
                    {ROBLOX_SAFE_ZONES.bottomLeftOverlay.height}
                  </td>
                  <td className="px-4 py-2.5 text-xs">
                    Covered by Roblox Discover player counts and rating percentage overlays
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-medium text-ink">
                    {ROBLOX_SAFE_ZONES.topRightOverlay.labelEn}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-ink">
                    ({ROBLOX_SAFE_ZONES.topRightOverlay.x}, {ROBLOX_SAFE_ZONES.topRightOverlay.y})
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-ink">
                    {ROBLOX_SAFE_ZONES.topRightOverlay.width} ×{" "}
                    {ROBLOX_SAFE_ZONES.topRightOverlay.height}
                  </td>
                  <td className="px-4 py-2.5 text-xs">
                    Reserved for Sponsored / Event badges and age maturity indicators
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-medium text-ink">Center Game Icon Export</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-ink">(420, 0) → 1:1</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-ink">
                    {GAME_ICON_SIZE} × {GAME_ICON_SIZE}
                  </td>
                  <td className="px-4 py-2.5 text-xs">
                    Square Home feed tile cropped cleanly from your center composition
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12 pt-10 border-t border-line grid gap-8 lg:grid-cols-2">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-ink">
              High-CTR Roblox Discover Thumbnail Playbook
            </h2>
            <p className="text-sm text-ink-dim leading-relaxed">
              On mobile devices, a Roblox game thumbnail renders smaller than a postage stamp.
              Top-performing experiences follow three visual rules before spending Robux on
              Sponsored Ads:
            </p>
            <ul className="space-y-2 text-sm text-ink-dim">
              <li className="rounded-lg border border-line bg-panel px-4 py-2.5">
                <strong className="text-ink">Strong foreground silhouette:</strong> Capture your
                main avatar or boss cleanly in Roblox Studio with FOV around 50 and dramatic rim
                lighting so it pops against a dark vignette.
              </li>
              <li className="rounded-lg border border-line bg-panel px-4 py-2.5">
                <strong className="text-ink">2-to-4 word punchy headline:</strong> Players scroll
                past full sentences. Phrases like <code className="text-ink">MEGA PETS</code> or{" "}
                <code className="text-ink">UPDATE 12</code> read instantly at 220px width.
              </li>
              <li className="rounded-lg border border-line bg-panel px-4 py-2.5">
                <strong className="text-ink">Consistent update cadence:</strong> Save clean base
                renders so every Friday update needs only a fresh corner tag (<code className="text-ink">UPD</code>,{" "}
                <code className="text-ink">2X EVENT</code>) and headline tweak.
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-ink">
              Complete Your Game Launch Visual Stack
            </h2>
            <p className="text-sm text-ink-dim leading-relaxed">
              A great thumbnail earns the first click, while crisp in-game interfaces and shop
              badges convert that traffic into Favorites, longer session times, and Gamepass sales.
              Continue building your launch assets in one workspace:
            </p>
            <ul className="space-y-2 text-sm text-ink-dim">
              <li className="rounded-lg border border-line bg-panel px-4 py-2.5">
                <strong className="text-ink">In-Game Shop &amp; HUD Menus:</strong> Drag and drop
                responsive interfaces in our{" "}
                <Link href="/editor" className="text-focus hover:underline">
                  Roblox GUI Editor
                </Link>{" "}
                or start from{" "}
                <Link href="/kits" className="text-focus hover:underline">
                  5-Screen Genre UI Kits
                </Link>
                .
              </li>
              <li className="rounded-lg border border-line bg-panel px-4 py-2.5">
                <strong className="text-ink">Monetization Pass Badges:</strong> Match your thumbnail
                accent palette with circular-safe{" "}
                <Link href="/gamepass-icon-maker" className="text-focus hover:underline">
                  512×512 Gamepass Icons
                </Link>
                .
              </li>
              <li className="rounded-lg border border-line bg-panel px-4 py-2.5">
                <strong className="text-ink">Native Studio Bundles:</strong> Grab all 6 themed kits
                and native <code className="text-ink">.rbxmx</code> exports with one buyout on{" "}
                <Link href="/pricing" className="text-focus hover:underline">
                  Pricing
                </Link>
                .
              </li>
            </ul>
          </div>
        </section>

        <section className="mt-12 pt-10 border-t border-line grid gap-8 lg:grid-cols-2">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-ink">
              Roblox Studio Screenshot Capture Settings for Clean Backgrounds
            </h2>
            <p className="text-sm text-ink-dim leading-relaxed">
              The strongest output from any <strong>Roblox thumbnail maker</strong> starts with a
              clean, high-contrast background render straight out of Roblox Studio. Instead of flat
              default Noon lighting, set up a quick dedicated camera rig in Studio for 3x sharper
              characters and environments:
            </p>
            <ul className="space-y-2 text-sm text-ink-dim">
              <li className="rounded-lg border border-line bg-panel px-4 py-2.5">
                <strong className="text-ink">Camera FOV 40–50:</strong> Lowering the workspace
                Camera FieldOfView from 70 down to 45 eliminates wide-angle distortion and makes
                posed characters fill the hero center crop nicely.
              </li>
              <li className="rounded-lg border border-line bg-panel px-4 py-2.5">
                <strong className="text-ink">Lighting &amp; DepthOfField:</strong> Enable{" "}
                <code className="text-ink">Future</code> or <code className="text-ink">ShadowMap</code>{" "}
                lighting, tilt SunRays slightly behind your hero pet or boss for glowing edges, and
                add mild background <code className="text-ink">DepthOfField</code> blur so bold
                overlay typography reads cleanly.
              </li>
              <li className="rounded-lg border border-line bg-panel px-4 py-2.5">
                <strong className="text-ink">Leave breathing room in corners:</strong> Frame your
                boss on the right or center-left slightly above the bottom border so Roblox
                Discover player pills and top-right event tags never overlap eyes or weapons.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-ink">
              Experience Thumbnail vs. Game Icon vs. Sponsored Ad Sizes
            </h2>
            <p className="text-sm text-ink-dim leading-relaxed">
              Every Roblox experience page needs multiple matching visual formats that feel cohesive
              when players browse Home, Search, and group showcases:
            </p>
            <div className="overflow-x-auto rounded-xl border border-line bg-panel">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-line bg-panel-raised uppercase tracking-wider text-ink-mute">
                  <tr>
                    <th className="px-3 py-2.5">Placement</th>
                    <th className="px-3 py-2.5">Aspect / Size</th>
                    <th className="px-3 py-2.5">Best Visual Focus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line text-ink-dim">
                  <tr>
                    <td className="px-3 py-2.5 font-semibold text-ink">Experience Thumbnail</td>
                    <td className="px-3 py-2.5 font-mono">1920 × 1080 (16:9)</td>
                    <td className="px-3 py-2.5">Wide action scene, boss silhouette, update callout</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2.5 font-semibold text-ink">Game Icon</td>
                    <td className="px-3 py-2.5 font-mono">512 × 512 (1:1)</td>
                    <td className="px-3 py-2.5">Tight center face/logo, zero tiny subtitle text</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2.5 font-semibold text-ink">Gamepass &amp; Badges</td>
                    <td className="px-3 py-2.5 font-mono">512 × 512 (Circle)</td>
                    <td className="px-3 py-2.5">
                      Single icon inside our{" "}
                      <Link href="/gamepass-icon-maker" className="text-focus hover:underline">
                        Gamepass Icon Maker
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-ink-dim leading-relaxed">
              Because our <strong>Roblox thumbnail maker</strong> exports both the full{" "}
              <code className="text-ink">1920×1080</code> banner and a centered{" "}
              <code className="text-ink">512×512</code> icon simultaneously, your Search row and
              Experience Detail gallery match effortlessly without Photoshop resizing.
            </p>
          </div>
        </section>

        <section className="mt-12 pt-10 border-t border-line">
          <h2 className="text-2xl font-semibold text-ink mb-6">
            Roblox Thumbnail Maker FAQs
          </h2>
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
              Pair your 1920×1080 thumbnail with crisp pass badges, responsive menus, and native
              Studio UI kits.
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
              href="/editor"
              className="rounded-lg border border-line bg-panel px-4 py-2 text-sm font-medium text-ink hover:bg-raised"
            >
              GUI Editor
            </Link>
            <Link
              href="/kits"
              className="rounded-lg border border-line bg-panel px-4 py-2 text-sm font-medium text-ink hover:bg-raised"
            >
              5-Screen UI Kits
            </Link>
            <Link
              href="/pricing"
              className="rounded-lg border border-line bg-panel px-4 py-2 text-sm font-medium text-ink hover:bg-raised"
            >
              Studio .rbxmx Pricing
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
