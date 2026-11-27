import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "../components/SiteNav";
import { SiteFooter } from "../components/SiteFooter";
import { ShirtStudio } from "../tools/shirt/ShirtStudio";

const PAGE_URL = "https://robloxguimaker.app/roblox-shirt-tester";
const ZH_URL = "https://robloxguimaker.app/zh/roblox-shirt-tester";

export const metadata: Metadata = {
  title: "Roblox Shirt Tester 3D — Preview 585x559 PNG Templates",
  description:
    "Free online Roblox shirt tester. Drop a 585x559 PNG to inspect every 3D R6 torso seam, sleeve wrap, and collar fit before paying 10 Robux.",
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
    title: "Roblox Shirt Tester 3D — Preview 585x559 PNG Templates",
    description:
      "Inspect 585x559 Roblox shirt and pants UV alignment on an interactive 3D R6 rig in your browser. Catch misaligned seams before spending 10 Robux.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    q: "Why test a Roblox shirt before uploading to Creator Hub?",
    a: "Roblox charges a 10 Robux upload fee for every classic shirt and pants asset. Previewing your 585x559 PNG in a free Roblox shirt tester lets you catch flipped sleeves, collar cutoffs, or neck gaps before spending Robux.",
  },
  {
    q: "What dimensions does Roblox require for classic shirts and pants?",
    a: "Every classic Roblox shirt and pants PNG must measure exactly 585 pixels wide by 559 pixels tall. Uploads with any other resolution are rejected automatically by Roblox Studio and the Creator Dashboard.",
  },
  {
    q: "Are my clothing PNG files uploaded to any external server?",
    a: "No. This Roblox shirt tester slices all 18 UV boxes locally in your browser using FileReader and HTML5 Canvas textures. Unpublished designs stay strictly private on your device.",
  },
  {
    q: "Why does my Roblox shirt look blurry or have a white collar box in 3D?",
    a: "Two common causes: exporting your template with an opaque white background layer instead of transparent alpha around the neck opening, or saving at 584x559 / JPEG compression instead of lossless 585x559 RGBA PNG.",
  },
  {
    q: "Will a shirt checked on this 3D R6 rig work on R15 avatars too?",
    a: "Yes. Roblox R15 avatars map the same classic 585x559 clothing sheet across segmented arm and torso parts, though R6 reveals harsh UV seams most clearly because block faces meet at sharp 90-degree edges.",
  },
  {
    q: "How do I create a fresh 585x559 template if I do not have one yet?",
    a: "Switch to the Template Maker tab in the studio above or open our Roblox Shirt Template Maker to export an exact 585x559 PNG or layered vector SVG with collar cutouts and UV labels.",
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

        <section className="mt-12 pt-10 border-t border-line grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-ink">
              6-Point Pre-Upload Shirt Seam Inspection Checklist
            </h2>
            <p className="text-sm text-ink-dim leading-relaxed">
              Before paying 10 Robux on Creator Hub, use this <strong>Roblox shirt tester</strong>{" "}
              to inspect the six failure zones where classic clothing designers lose the most Robux:
            </p>
            <ul className="space-y-2.5 text-sm text-ink-dim">
              <li className="rounded-lg border border-line bg-panel px-4 py-2.5">
                <strong className="text-ink">1. Collar cutout alignment:</strong> Swap skin tone
                swatches under the 3D preview to make sure the neck cutout reveals natural avatar
                skin without jagged gray anti-aliasing pixels.
              </li>
              <li className="rounded-lg border border-line bg-panel px-4 py-2.5">
                <strong className="text-ink">2. Left vs. Right sleeve symmetry:</strong> Outer arm
                panels (<code className="text-ink">R Outer</code> at X=151 vs{" "}
                <code className="text-ink">L Outer</code> at X=374) mirror across the template; verify
                shoulder patches face outward on both arms.
              </li>
              <li className="rounded-lg border border-line bg-panel px-4 py-2.5">
                <strong className="text-ink">3. Torso Top &amp; Shoulder bridge:</strong> Orbit to
                the top view so hoodie collars and jacket lapels flow seamlessly between{" "}
                <code className="text-ink">Torso Top</code> and{" "}
                <code className="text-ink">R/L Top</code>.
              </li>
              <li className="rounded-lg border border-line bg-panel px-4 py-2.5">
                <strong className="text-ink">4. Underarm &amp; inner sleeve bleeding:</strong> Check
                inner arm (<code className="text-ink">R Inner</code>,{" "}
                <code className="text-ink">L Inner</code>) faces from side angles so bright sleeve
                stripes do not ghost onto torso ribs.
              </li>
              <li className="rounded-lg border border-line bg-panel px-4 py-2.5">
                <strong className="text-ink">5. Shirt-over-Pants waist seam:</strong> Classic shirts
                overlap pants along the <code className="text-ink">Torso Bottom</code> edge (Y=204);
                test belt buckles or crop tops slightly above the seam line.
              </li>
              <li className="rounded-lg border border-line bg-panel px-4 py-2.5">
                <strong className="text-ink">6. Midnight &amp; Daylight contrast:</strong> Switch
                3D lighting modes between Studio, Daylight, and Midnight so dark folds and stitching
                remain legible in any Roblox experience.
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-ink">
              R6 vs. R15 Behavior &amp; Common Texture Errors
            </h2>
            <p className="text-sm text-ink-dim leading-relaxed">
              Both classic R6 and R15 Roblox characters read the same 585×559 PNG sheet, yet their
              3D geometry exposes flaws differently:
            </p>
            <div className="overflow-x-auto rounded-xl border border-line bg-panel">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-line bg-panel-raised uppercase tracking-wider text-ink-mute">
                  <tr>
                    <th className="px-3 py-2.5">Issue Found in Tester</th>
                    <th className="px-3 py-2.5">Root Cause in 585×559 PNG</th>
                    <th className="px-3 py-2.5">How to Fix Fast</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line text-ink-dim">
                  <tr>
                    <td className="px-3 py-2.5 font-semibold text-ink">Rejection error on upload</td>
                    <td className="px-3 py-2.5">Canvas saved at wrong size (e.g. 585×560 or JPG)</td>
                    <td className="px-3 py-2.5">
                      Export exact <code className="text-ink">585×559</code> lossless RGBA PNG
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2.5 font-semibold text-ink">Guide text shows on avatar</td>
                    <td className="px-3 py-2.5">Reference template overlay left unhidden</td>
                    <td className="px-3 py-2.5">Hide the UV guide layer before saving PNG</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2.5 font-semibold text-ink">Backwards sleeve emblem</td>
                    <td className="px-3 py-2.5">Confused R Outer (151,355) with R Inner (19,355)</td>
                    <td className="px-3 py-2.5">Move artwork onto outer faces &amp; re-drop PNG</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2.5 font-semibold text-ink">White halo around collar</td>
                    <td className="px-3 py-2.5">Erased against white canvas instead of alpha</td>
                    <td className="px-3 py-2.5">
                      Use clean alpha cutout or export from our{" "}
                      <Link href="/roblox-shirt-template-maker" className="text-focus hover:underline">
                        Template Maker
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-ink-dim leading-relaxed">
              Building a clothing homestore or avatar catalog game in Roblox Studio? Combine your
              tested outfits with responsive in-game menus in our{" "}
              <Link href="/editor" className="text-focus hover:underline">
                free GUI Editor
              </Link>
              , browse{" "}
              <Link href="/kits" className="text-focus hover:underline">
                5-screen UI Kits
              </Link>
              , or check{" "}
              <Link href="/pricing" className="text-focus hover:underline">
                Studio .rbxmx bundles
              </Link>
              .
            </p>
          </div>
        </section>

        <section className="mt-12 pt-10 border-t border-line grid gap-8 lg:grid-cols-2">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-ink">
              Classic Shirt vs. Pants UV Wrap Mechanics on R6 &amp; R15
            </h2>
            <p className="text-sm text-ink-dim leading-relaxed">
              On a classic Roblox R6 block rig, every limb and torso part maps six flat orthographic
              faces directly onto fixed pixel rectangles inside your{" "}
              <code className="text-ink">585×559</code> image. Because R6 faces meet at crisp
              right angles, using a <strong>Roblox shirt tester</strong> highlights even a 1-pixel
              seam gap along shoulders, ribs, or waistbands right away.
            </p>
            <p className="text-sm text-ink-dim leading-relaxed">
              R15 rigs subdivide each arm and leg into Upper, Lower, and Hand or Foot meshes that
              sample from the exact same UV sheet. If your shading gradients cross the middle Y
              split cleanly and your inner sleeve seams align on this R6 mannequin, your Classic
              Shirt or Classic Pants PNG will drape naturally on blocky, Robloxian 2.0, and Woman
              bundles alike.
            </p>
            <p className="text-sm text-ink-dim leading-relaxed">
              Pay special attention when painting distressed jeans, ripped hoodies, or tactical
              straps: use the transparent skin-tone toggle inside the{" "}
              <strong>Roblox shirt tester</strong> to rotate across Light, Warm, Tan, and Deep
              avatar skins so semi-transparent feathering never shows harsh halos in daylight maps.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-ink">
              Workflow from Digital Painting App to Roblox Marketplace
            </h2>
            <p className="text-sm text-ink-dim leading-relaxed">
              Most experienced UGC and classic clothing creators iterate rapidly before spending a
              single Robux on Creator Hub:
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-ink-dim leading-relaxed">
              <li>
                Download a clean reference sheet from our{" "}
                <Link href="/roblox-shirt-template-maker" className="text-focus hover:underline">
                  Roblox Shirt Template Maker
                </Link>{" "}
                as either SVG vector layers or transparent 585×559 PNG.
              </li>
              <li>
                Paint folds, embroidery, buttons, and fabric grain inside Photopea, Photoshop, Krita,
                or Procreate, keeping your UV guide overlay on a separate hidden layer.
              </li>
              <li>
                Toggle the guide layer OFF, export a lossless 8-bit RGBA PNG at{" "}
                <code className="text-ink">585×559</code>, and drag it into the{" "}
                <strong>Roblox shirt tester</strong> above to orbit all 360° angles.
              </li>
              <li>
                Check Torso Top, Underarms, and Back waist hem under Midnight and Studio lighting;
                nudge artwork by 1–2 pixels if shoulder stripes drift.
              </li>
              <li>
                Upload the verified file under Creator Dashboard → Creations → Avatar Items →
                Classic Shirts or Classic Pants, then embed it inside your group store or homestore
                experience.
              </li>
            </ol>
          </div>
        </section>

        <section className="mt-12 pt-10 border-t border-line">
          <h2 className="text-2xl font-semibold text-ink mb-6">Roblox Shirt Tester FAQs</h2>
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
            <h2 className="text-base font-semibold text-ink">
              Need a fresh 585×559 template or full Roblox game UI?
            </h2>
            <p className="text-sm text-ink-dim">
              Generate clean 585×559 shirts, design game shop interfaces, or grab Studio-ready
              .rbxmx kits.
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
