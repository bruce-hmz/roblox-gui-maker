import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "../components/SiteNav";
import { SiteFooter } from "../components/SiteFooter";
import { ShirtStudio } from "../tools/shirt/ShirtStudio";
import { CLOTHING_UV_REGIONS } from "../tools/shirt/shirt-uv";

const PAGE_URL = "https://robloxguimaker.app/roblox-shirt-template-maker";
const ZH_URL = "https://robloxguimaker.app/zh/roblox-shirt-template-maker";

export const metadata: Metadata = {
  title: "Roblox Shirt Template Maker — Free 585x559 PNG Generator",
  description:
    "Create pixel-exact 585x559 Roblox shirt and pants PNG templates in your browser. Customize collar, sleeves, trim, and preview live on 3D R6.",
  keywords: [
    "roblox shirt template maker",
    "roblox shirt template",
    "roblox 585x559 template generator",
    "roblox pants template png",
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
    title: "Roblox Shirt Template Maker — Free 585x559 PNG Generator",
    description:
      "Design and export upload-ready 585x559 Roblox shirt and pants PNG templates with collar cutouts, UV guide overlays, and live 3D R6 preview.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    q: "What size does a Roblox shirt template PNG need to be?",
    a: "Every classic Roblox shirt template and Roblox pants template must measure exactly 585 pixels wide by 559 pixels tall (585x559 PNG). Uploads with scaled dimensions such as 585x558 or 1170x1118 are rejected by Roblox Creator Hub.",
  },
  {
    q: "Does the exported Roblox shirt template include transparent margins?",
    a: "Yes. When UV Guides are toggled off, every pixel outside the 18 official body UV rectangles stays transparent RGBA so skin tones show cleanly through collars and rolled sleeves.",
  },
  {
    q: "Can I edit the generated Roblox shirt template in Photopea, Photoshop, or Figma?",
    a: "Yes. Exporting the clean SVG gives you layered vector rectangles aligned to the exact 585x559 Roblox shirt template coordinates so you can add custom fabric shading, pockets, or artwork on top.",
  },
  {
    q: "Can I make both Classic Shirts and Classic Pants here?",
    a: "Yes. Switch between Shirt (Torso + Arms) and Pants (Torso + Legs) in the studio toggle above. Both garments share the exact same 585x559 UV map coordinates.",
  },
  {
    q: "How much Robux does it cost to upload a Roblox shirt template?",
    a: "Designing and exporting templates in this Roblox shirt template maker is 100% free. Roblox charges a 10 Robux upload fee on Creator Hub when publishing Classic Shirts or Classic Pants, whereas Classic T-Shirts (front chest decal only) cost 0 Robux to upload.",
  },
  {
    q: "How do I test a Roblox shirt template I painted externally?",
    a: "Switch to the 3D Tester tab above or open our dedicated Roblox Shirt Tester page and drop your edited 585x559 PNG directly onto the interactive 3D R6 model before paying 10 Robux.",
  },
  {
    q: "What happens if torso front and side sleeves do not match at the shoulders?",
    a: "Shoulder edges connect the Top face (231, 8 for Torso; 217, 289 and 308, 289 for arms) to Front, Back, and Outer faces. Always keep stripes and gradients continuous across adjacent UV rectangles or verify them by orbiting the 3D mannequin first.",
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

        <section className="mt-12 pt-10 border-t border-line space-y-6">
          <div className="max-w-3xl space-y-3">
            <h2 className="text-2xl font-semibold text-ink">
              Official 585×559 Roblox Shirt Template UV Coordinates
            </h2>
            <p className="text-sm text-ink-dim leading-relaxed">
              Every classic <strong>Roblox shirt template</strong> and pants texture splits across
              18 rectangular UV faces inside a strict{" "}
              <code className="text-ink">585 × 559</code> pixel canvas. Painting even two pixels
              outside a face boundary creates stray colored dots on your character&rsquo;s neck or
              wrists, while placing opaque pixels behind the torso neck cutout hides the player&rsquo;s
              skin tone. Use this exact pixel coordinate reference when editing our exported{" "}
              <strong>Roblox shirt template</strong> PNG or SVG in Photopea, Photoshop, or Clip
              Studio Paint.
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-line bg-panel">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-panel-raised text-xs uppercase tracking-wider text-ink-mute">
                <tr>
                  <th className="px-4 py-3">Body Part</th>
                  <th className="px-4 py-3">UV Face</th>
                  <th className="px-4 py-3">Origin (X, Y)</th>
                  <th className="px-4 py-3">Size (W × H px)</th>
                  <th className="px-4 py-3">What Wraps Here</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-ink-dim">
                {CLOTHING_UV_REGIONS.map((region) => (
                  <tr key={region.id} className="hover:bg-raised/40">
                    <td className="px-4 py-2.5 font-medium text-ink">
                      {region.part === "torso"
                        ? "Torso"
                        : region.part === "rightLimb"
                          ? "Right Arm / Leg"
                          : "Left Arm / Leg"}
                    </td>
                    <td className="px-4 py-2.5">{region.labelEn}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-ink">
                      ({region.x}, {region.y})
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs text-ink">
                      {region.width} × {region.height}
                    </td>
                    <td className="px-4 py-2.5 text-xs">
                      {region.part === "torso" && region.face === "front"
                        ? "Chest emblem, collar V-cutout, front zipper or pocket"
                        : region.part === "torso" && region.face === "back"
                          ? "Hoodie hood drop, back print, team number"
                          : region.face === "top"
                            ? "Shoulder seam connecting Front, Back, and Outer edges"
                            : region.face === "bottom"
                              ? "Waistband or sleeve cuff underside"
                              : "Side / seam edge wrap"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12 pt-10 border-t border-line grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-ink">
              Classic Shirt vs. Classic Pants vs. Classic T-Shirt
            </h2>
            <p className="text-sm text-ink-dim leading-relaxed">
              Before exporting a <strong>Roblox shirt template</strong>, double-check which
              Creator Hub asset category matches your design. Choosing the wrong slot causes broken
              wraps or wasted upload Robux.
            </p>
            <div className="overflow-x-auto rounded-xl border border-line bg-panel">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-line bg-panel-raised uppercase tracking-wider text-ink-mute">
                  <tr>
                    <th className="px-3 py-2.5">Asset Type</th>
                    <th className="px-3 py-2.5">Canvas</th>
                    <th className="px-3 py-2.5">Upload Fee</th>
                    <th className="px-3 py-2.5">Body Coverage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line text-ink-dim">
                  <tr>
                    <td className="px-3 py-2.5 font-semibold text-ink">Classic Shirt</td>
                    <td className="px-3 py-2.5 font-mono">585 × 559 PNG</td>
                    <td className="px-3 py-2.5">10 Robux</td>
                    <td className="px-3 py-2.5">Torso + both arms (layerable over skins)</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2.5 font-semibold text-ink">Classic Pants</td>
                    <td className="px-3 py-2.5 font-mono">585 × 559 PNG</td>
                    <td className="px-3 py-2.5">10 Robux</td>
                    <td className="px-3 py-2.5">Torso waist + both legs (same UV grid)</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2.5 font-semibold text-ink">Classic T-Shirt</td>
                    <td className="px-3 py-2.5 font-mono">Square (e.g. 512×512)</td>
                    <td className="px-3 py-2.5">0 Robux</td>
                    <td className="px-3 py-2.5">Front chest square sticker only</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-ink">
              Creator Hub Pre-Upload Checklist
            </h2>
            <p className="text-sm text-ink-dim leading-relaxed">
              Avoid burning 10 Robux on rejected or blurry clothing uploads by checking these five
              rules before clicking Create Asset on{" "}
              <code className="text-ink">create.roblox.com</code>:
            </p>
            <ul className="space-y-2.5 text-sm text-ink-dim">
              <li className="rounded-lg border border-line bg-panel px-4 py-2.5">
                <strong className="text-ink">1. Toggle UV Guides OFF before export:</strong>{" "}
                Reference boxes (<code className="text-ink">F, B, L, R</code>) are great while
                painting in Figma or Photopea, but leaving the guide layer visible prints colored
                boxes directly onto your avatar.
              </li>
              <li className="rounded-lg border border-line bg-panel px-4 py-2.5">
                <strong className="text-ink">2. Verify transparent alpha cutout:</strong> Keep a
                transparent neck opening inside Torso Front (<code className="text-ink">231, 74</code>)
                and exposed wrists so Roblox avatar skin tone blends cleanly.
              </li>
              <li className="rounded-lg border border-line bg-panel px-4 py-2.5">
                <strong className="text-ink">3. Inspect left vs. right sleeve seams:</strong>{" "}
                Outer and inner arm coordinates mirror across the center of the{" "}
                <strong>Roblox shirt template</strong> sheet; spin the 3D R6 preview 360° first.
              </li>
              <li className="rounded-lg border border-line bg-panel px-4 py-2.5">
                <strong className="text-ink">4. Moderate text contrast and content rules:</strong>{" "}
                Keep chest logos crisp above 18px stroke thickness and avoid copyrighted brand marks
                that trigger Roblox moderation.
              </li>
              <li className="rounded-lg border border-line bg-panel px-4 py-2.5">
                <strong className="text-ink">5. Shipping a full Roblox game alongside outfits?</strong>{" "}
                Pair custom avatar merch inside a matching shop UI using our{" "}
                <Link href="/editor" className="text-focus hover:underline">
                  visual GUI editor
                </Link>
                ,{" "}
                <Link href="/kits" className="text-focus hover:underline">
                  5-screen genre UI kits
                </Link>
                , or{" "}
                <Link href="/pricing" className="text-focus hover:underline">
                  one-time Studio .rbxmx bundles
                </Link>
                .
              </li>
            </ul>
          </div>
        </section>

        <section className="mt-12 pt-10 border-t border-line">
          <h2 className="text-2xl font-semibold text-ink mb-6">
            Roblox Shirt Template Maker FAQs
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
            <h2 className="text-base font-semibold text-ink">
              Ready to test your Roblox shirt template or build game menus?
            </h2>
            <p className="text-sm text-ink-dim">
              Drop any edited 585×559 PNG into the 3D Shirt Tester, build in-game shop UI in the
              editor, or grab a complete Studio UI kit.
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
              href="/editor"
              className="rounded-lg border border-line bg-panel px-4 py-2 text-sm font-medium text-ink hover:bg-raised"
            >
              Open GUI Editor
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
