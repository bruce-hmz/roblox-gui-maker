import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "./components/SiteNav";
import { SiteFooter } from "./components/SiteFooter";
import { HeroDemo } from "./components/HeroDemo";
import { KitCard } from "./components/KitCard";
import { PromptBox } from "./components/PromptBox";
import { AiExamples } from "./components/AiExamples";
import { SceneThumb } from "./components/SceneThumb";
import { templatePreviewSrc } from "./editor/preview-images";
import { KITS } from "./editor/kits";
import { TEMPLATES, getTemplate } from "./editor/templates";
import { USE_CASES } from "./for/usecases";
import { GUIDES } from "./guides/guides-data";

export const metadata: Metadata = {
  title: "Free Roblox GUI Maker with AI | Visual Editor, Luau, .rbxmx",
  description:
    "Free AI Roblox GUI maker: describe your interface to generate editable ScreenGui instances, preview device layouts, make Gamepass icons, export Luau or .rbxmx.",
  keywords: [
    "Roblox GUI Maker",
    "AI Roblox GUI Generator",
    "Roblox GUI Generator",
    "Roblox UI Maker",
    "Roblox GUI builder",
    "online Roblox GUI editor",
    "Roblox rbxmx export",
    "Roblox Gamepass Icon Maker",
    "Roblox Studio GUI",
    "free Roblox GUI tool",
  ],
  openGraph: {
    title: "Free Roblox GUI Maker with AI | Visual Editor, Luau & .rbxmx Export",
    description:
      "Describe your Roblox UI and get real, editable ScreenGui instances with working interactions, clean Luau, and native Studio .rbxmx export. Free, no login.",
    url: "https://robloxguimaker.app",
    siteName: "Roblox GUI Maker",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Roblox GUI Maker with AI | Visual Editor, Luau & .rbxmx Export",
    description:
      "Describe your Roblox UI and get real, editable ScreenGui instances with clean Luau and native Studio .rbxmx export. Free, no login.",
  },
  alternates: {
    canonical: "/",
    languages: {
      "x-default": "https://robloxguimaker.app",
      en: "https://robloxguimaker.app",
      zh: "https://robloxguimaker.app/zh",
    },
  },
};

const STEPS = [
  {
    n: "1",
    title: "Generate with AI or drag & drop",
    body: "Start from a prompt, a template, or a blank canvas. Drop ScreenGui, Frame, TextButton, and layout containers into a real Roblox hierarchy.",
  },
  {
    n: "2",
    title: "Tweak properties & test screens",
    body: "Edit BackgroundColor3, UDim2 scale/offset, UICorner, UIGradient, and button actions — then preview desktop, tablet, and mobile viewports.",
  },
  {
    n: "3",
    title: "Export Luau or native .rbxmx",
    body: "Copy free client and server Luau for StarterGui and ServerScriptService, save JSON/ZIP, or export a native .rbxmx model to drop directly into Studio.",
  },
];

const PRODUCT_PROOFS = [
  {
    title: "Responsive Layout",
    body: "Combine scale and offset with anchors, aspect ratios, and size constraints for desktop, tablet, and mobile screens.",
  },
  {
    title: "Interaction Preview",
    body: "Preview show, hide, toggle, RemoteEvent, and Teleport button actions before exporting your GUI.",
  },
  {
    title: "Server-Safe Actions",
    body: "Generate separate server handlers with clear validation boundaries for RemoteEvent and allow-listed Teleport actions.",
  },
  {
    title: "Luau, ZIP & .rbxmx",
    body: "Export free client + server Luau scripts and editable JSON/ZIP packages, or native .rbxmx models ready to drag into Studio.",
  },
];

const FAQS = [
  {
    question: "Is Roblox GUI Maker free to use?",
    answer:
      "Yes. The visual editor, AI scene starter, all 13 templates, the 512×512 Gamepass Icon Maker, and clean client + server Luau, JSON, and ZIP exports are free with no account required. Optional one-time Pro passes unlock native .rbxmx Studio model export and multi-screen UI Kit bundles.",
  },
  {
    question: "How is this different from AI image generators?",
    answer:
      "Image tools give you a flat picture of a GUI. Describe your interface here and you get a real, editable Roblox GUI — actual ScreenGui, Frame, TextLabel, and TextButton instances you can drag, restyle, preview on desktop, tablet, and mobile, and export as clean client and server Luau or .rbxmx.",
  },
  {
    question: "What is the difference between free Luau export and Pro .rbxmx export?",
    answer:
      "Free Luau export generates clean Instance.new scripts you paste into a LocalScript (and optional server Script). Native .rbxmx export packages your entire ScreenGui hierarchy — complete with UDim2 values, UICorner, UIGradient, UIStroke, UIListLayout, and embedded scripts — as a Roblox XML model file you drop straight into StarterGui without plugins.",
  },
  {
    question: "How do I import exported GUIs into Roblox Studio?",
    answer:
      "For free Luau exports, create a LocalScript inside StarterGui and paste the client script (and place any generated RemoteEvent/Teleport handler in a Script inside ServerScriptService). For .rbxmx models, go to File → Import Roblox Model in Studio or drag the .rbxmx file onto StarterGui in the Explorer.",
  },
  {
    question: "What files can I export?",
    answer:
      "You can copy or download client Luau, download optional server Luau, export an editable JSON scene, download a ZIP containing project files and setup notes, export PNG Gamepass icons at 512×512, or export native .rbxmx files with Pro.",
  },
  {
    question: "Can I design responsive GUIs for phones and tablets?",
    answer:
      "Yes. Device previews and responsive geometry controls cover UDim2 Scale vs Offset, AnchorPoint, UIAspectRatioConstraint, UISizeConstraint, UIListLayout, and UIGridLayout so panels stay aligned on phones, tablets, and widescreen monitors.",
  },
  {
    question: "Does the editor generate server scripts and game logic?",
    answer:
      "It generates UI instances and selected interaction wiring, including separate RemoteEvent and Teleport server handlers with clear server-validation boundaries. Economy balance, Robux purchase verification via MarketplaceService, rewards, and DataStore persistence remain your server logic.",
  },
  {
    question: "How do I make 512×512 Roblox Gamepass icons that don't get cropped?",
    answer:
      "Roblox automatically crops square Gamepass thumbnails into a circle on the experience Store page. Open our free Gamepass Icon Maker, preview the live circular safe zone overlay so badges and text stay inside the inner margin, and export a crisp 512×512 PNG ready for Creator Hub.",
  },
  {
    question: "Do I need to download Roblox GUI Maker?",
    answer:
      "No download or installation is required. Roblox GUI Maker runs 100% in your browser as a free online Roblox GUI designer — design your ScreenGui visually, preview interactions live, and copy clean Luau straight into Roblox Studio (or optionally download .lua scripts, editable JSON/ZIP packages, our offline Studio plugin, or native .rbxmx files).",
  },
  {
    question:
      "Are my GUI designs and files uploaded to a server, or processed locally in my browser?",
    answer:
      "Visual editing, saved project drafts (browser localStorage), and Client/Server Luau, JSON, and ZIP exports run 100% locally in your browser — your GUI scenes are never uploaded to our servers. We have no login and never ask for your Roblox password or .ROBLOSECURITY cookie, and our source code is public on GitHub. Only text prompts you explicitly submit to the optional AI generator are sent to /api/generate-gui; see our Trust & Security page (/trust) and Privacy Policy (/privacy) for full details.",
  },
  {
    question:
      "Are there any usage limits, daily caps, or export limits on the free plan?",
    answer:
      "Manual visual editing, all 13 starter templates, all 6 interactive 5-screen Game UI Kit previews, and Client/Server Luau, JSON, ZIP, offline Studio plugin JSON, and single 512×512 Gamepass icon exports are unlimited and free with no account required. The optional free AI prompt-to-GUI generator has a fair-use quota of up to 3 prompts per hour and 5 prompts per day without signing up. Optional Studio Pro Passes (USD 9.90 or USD 19.90 one-time buyout, zero recurring subscription) unlock native .rbxmx Studio model exports and full multi-screen kit bundles.",
  },
  {
    question:
      "Can I use Roblox GUI Maker on an iPhone, Android phone, or iPad — or do I need a desktop?",
    answer:
      "On an iPhone, Android phone, or tablet browser you can browse all 13 templates, generate AI UI starting points from the homepage, preview Game UI Kits, and use mobile-friendly tools like the UDim2 UI Sizer and Gamepass Icon Maker. The full drag-and-drop /editor canvas is built for wider screens (desktop, laptop, or landscape tablet at 768px+) for accurate UDim2 positioning and property editing, and Roblox Studio itself requires Windows or Mac to import and publish your exported GUI.",
  },
  {
    question:
      "What Roblox UI instances and customization options are supported without a paid subscription?",
    answer:
      "Without any subscription or sign-up, you can customize 7 core Roblox UI classes (ScreenGui, Frame, ScrollingFrame, TextLabel, TextButton, TextBox, ImageLabel), responsive UDim2 Scale and Offset, AnchorPoint, ZIndex, BackgroundColor3, BackgroundTransparency, 9 Roblox fonts, UICorner, UIStroke, UIGradient, UIListLayout, UIGridLayout, UIAspectRatioConstraint, UISizeConstraint, and 5 interactive button actions (Show, Hide, Toggle, RemoteEvent, Teleport), starting from a blank canvas, an AI prompt, 13 starter templates, or 6 multi-screen Game UI Kit previews.",
  },
  {
    question: "Is this an official Roblox product?",
    answer:
      "No. Roblox GUI Maker is an independent, unofficial creator tool and is not affiliated with or endorsed by Roblox Corporation.",
  },
];

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Roblox GUI Maker",
  url: "https://robloxguimaker.app",
  description:
    "Free online visual Roblox GUI maker and AI generator. Build responsive Roblox UIs with drag-and-drop, create 512×512 Gamepass icons, preview interactions, and export clean Luau or native .rbxmx models for Roblox Studio.",
  applicationCategory: "DesignApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  featureList: [
    "AI-generated GUI starting points from a text prompt (editable, not an image)",
    "Visual drag-and-drop Roblox GUI editor",
    "Responsive geometry with scale, offset, anchors, aspect ratios, and size constraints",
    "Interaction previews for show, hide, toggle, RemoteEvent, and Teleport actions",
    "Server handlers for RemoteEvent and Teleport actions",
    "Versioned JSON and browser-local ZIP project export",
    "Native Roblox Studio .rbxmx model export (drag-and-drop into StarterGui)",
    "512×512 Roblox Gamepass Icon Maker with live circular safe-zone preview",
    "6 themed 5-screen Game UI Kits, 13 starter templates, and 22 step-by-step guides",
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

// The hero demo builds this scene up node-by-node. main-menu is the canonical
// first template; fall back to the first template if its slug ever changes.
const HERO_SCENE = getTemplate("main-menu")?.scene ?? TEMPLATES[0].scene;

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webAppSchema).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
        }}
      />
      <SiteNav />
      <main>
        {/* hero */}
        <section className="max-w-4xl mx-auto px-6 pt-20 pb-12 text-center">
          <p className="text-focus text-sm font-semibold uppercase tracking-wider mb-4">
            Free · No login · Editable · Client + Server Luau
          </p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-5">
            Free Roblox GUI Maker with AI
          </h1>
          <p className="text-lg md:text-xl text-ink-dim max-w-2xl mx-auto mb-8">
            Describe your Roblox UI and get a real, editable interface with
            working interactions and clean Luau — not just a mockup.
          </p>
          <PromptBox locale="en" />
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <Link
              href="/editor"
              className="px-6 py-3 rounded-lg font-semibold border border-line hover:bg-raised transition"
            >
              Launch the Editor →
            </Link>
            <Link
              href="/templates"
              className="px-6 py-3 rounded-lg font-medium border border-line hover:bg-raised transition"
            >
              Browse Templates
            </Link>
          </div>
          <p className="mt-4 text-xs sm:text-sm text-ink-dim">
            Also included:{" "}
            <Link
              href="/roblox-ui-sizer"
              className="text-focus hover:underline font-medium"
            >
              UDim2 UI Sizer
            </Link>{" "}
            ·{" "}
            <Link
              href="/studio-plugin"
              className="text-focus hover:underline font-medium"
            >
              Offline Studio Plugin
            </Link>{" "}
            ·{" "}
            <Link
              href="/gamepass-icon-maker"
              className="text-focus hover:underline font-medium"
            >
              512×512 Gamepass Icons
            </Link>{" "}
            ·{" "}
            <Link href="/kits" className="text-focus hover:underline font-medium">
              5-Screen Game UI Kits
            </Link>{" "}
            ·{" "}
            <Link
              href="/pricing"
              className="text-focus hover:underline font-medium"
            >
              Studio .rbxmx Pro Export
            </Link>
          </p>
        </section>

        {/* hero preview */}
        <section className="max-w-4xl mx-auto px-6 pb-4">
          <HeroDemo buildOrder={HERO_SCENE} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
            {PRODUCT_PROOFS.map((proof) => (
              <article
                key={proof.title}
                className="rounded-xl border border-line bg-panel p-4"
              >
                <h2 className="mb-1.5 text-sm font-semibold text-ink">
                  {proof.title}
                </h2>
                <p className="text-xs leading-relaxed text-ink-dim">
                  {proof.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* AI examples */}
        <AiExamples
          heading="AI examples you can open and edit"
          subheading="Every example below was generated from its prompt as a real Roblox scene — open one, change anything, export Luau. Free, no account."
          openLabel="Open in Editor"
        />

        {/* hire vs build */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-3">
            Hire a designer, or build it yourself?
          </h2>
          <p className="text-ink-dim text-center max-w-2xl mx-auto mb-10">
            Commissioning Roblox UI on a freelance marketplace means paying,
            waiting, and handing off revisions. Roblox GUI Maker gives you the
            same result in minutes — free, with the scripts included.
          </p>
          <div className="grid md:grid-cols-2 gap-4 items-start">
            <div className="rounded-xl border border-line bg-panel p-6">
              <h3 className="font-semibold mb-4 text-ink-dim">
                Hire a UI designer
              </h3>
              <ul className="space-y-3 text-sm">
                {[
                  ["Cost", "$25–150+ per project"],
                  ["Turnaround", "Days of waiting"],
                  ["Revisions", "Cost time, often money"],
                  ["Code", "Design only — scripts extra"],
                ].map(([k, v]) => (
                  <li key={k} className="flex items-baseline gap-3">
                    <span className="w-20 shrink-0 text-ink-mute">{k}</span>
                    <span className="text-ink-dim">{v}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-focus bg-panel p-6 ring-1 ring-focus shadow-lg shadow-focus/10">
              <h3 className="font-semibold mb-4 text-ink">
                Build it in Roblox GUI Maker
              </h3>
              <ul className="space-y-3 text-sm">
                {[
                  ["Cost", "Free, no account"],
                  ["Turnaround", "Minutes, in your browser"],
                  ["Revisions", "Edit anything, instantly"],
                  ["Code", "Luau + server scripts included"],
                ].map(([k, v]) => (
                  <li key={k} className="flex items-baseline gap-3">
                    <span className="w-20 shrink-0 text-ink-mute">{k}</span>
                    <span className="text-ink">{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link
              href="/editor"
              className="px-6 py-3 rounded-lg font-semibold bg-primary text-on-primary hover:brightness-110 transition"
            >
              Launch the Editor →
            </Link>
          </div>
        </section>

        {/* comparison vs alternatives */}
        <section className="max-w-5xl mx-auto px-6 py-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-3">
            How Roblox GUI Maker (robloxguimaker.app) compares to alternatives
          </h2>
          <p className="text-ink-dim text-center max-w-2xl mx-auto mb-8 text-sm md:text-base">
            Most Roblox UI workflows trade off between speed, real Roblox Studio
            compatibility, and zero setup. Here is how{" "}
            <strong className="text-ink">robloxguimaker.app</strong> compares to
            building directly in Studio, converting from Figma, or using AI image
            mockups.
          </p>
          <div className="overflow-x-auto rounded-xl border border-line bg-panel">
            <table className="w-full min-w-[640px] text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-line bg-raised/60 text-xs uppercase tracking-wider text-ink-mute">
                  <th className="px-4 py-3 font-semibold">Feature</th>
                  <th className="px-4 py-3 font-semibold text-focus">
                    Roblox GUI Maker (robloxguimaker.app)
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    Roblox Studio UI Editor
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    Figma + Importer Plugin
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    AI Image Generators
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-ink-dim">
                <tr>
                  <td className="px-4 py-3 font-medium text-ink">
                    Cost &amp; Account
                  </td>
                  <td className="px-4 py-3 text-ink">
                    Free forever, no sign-up; optional one-time Pro pass (no
                    subscription)
                  </td>
                  <td className="px-4 py-3">Free, Roblox account required</td>
                  <td className="px-4 py-3">
                    Account required; some plugins paid
                  </td>
                  <td className="px-4 py-3">Usually credits or subscription</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-ink">
                    No Download / Browser
                  </td>
                  <td className="px-4 py-3 text-ink">
                    100% browser-based; no software or Studio plugin required
                  </td>
                  <td className="px-4 py-3">
                    Windows / Mac desktop install required
                  </td>
                  <td className="px-4 py-3">
                    Browser + Studio importer plugin needed
                  </td>
                  <td className="px-4 py-3">Browser-based</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-ink">
                    Editable ScreenGui + AI
                  </td>
                  <td className="px-4 py-3 text-ink">
                    AI prompt → editable ScreenGui, drag-and-drop canvas, 13
                    templates + 6 UI kits
                  </td>
                  <td className="px-4 py-3">Manual inspector editing</td>
                  <td className="px-4 py-3">
                    Manual vector design; image slicing needed
                  </td>
                  <td className="px-4 py-3">Flat PNG mockup only (not editable)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-ink">
                    Roblox Studio Exports
                  </td>
                  <td className="px-4 py-3 text-ink">
                    Unlimited free Client + Server Luau, JSON/ZIP, offline sync
                    JSON; Pro native <code>.rbxmx</code>
                  </td>
                  <td className="px-4 py-3">Native inside Studio</td>
                  <td className="px-4 py-3">Plugin import / image assets</td>
                  <td className="px-4 py-3">None (manual rebuild required)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-ink">
                    Privacy &amp; Free Limits
                  </td>
                  <td className="px-4 py-3 text-ink">
                    Browser-local storage &amp; export, open-source on GitHub;
                    unlimited manual edits/exports, 3/hr &amp; 5/day free AI
                  </td>
                  <td className="px-4 py-3">Roblox cloud / local .rbxl</td>
                  <td className="px-4 py-3">Cloud account storage</td>
                  <td className="px-4 py-3">
                    Prompts/images uploaded; daily credit caps
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-center text-xs text-ink-mute">
            Read the full{" "}
            <Link
              href="/guides/roblox-gui-maker-alternatives"
              className="text-focus hover:underline"
            >
              Roblox GUI Maker alternatives comparison
            </Link>
            , verify local processing on{" "}
            <Link href="/trust" className="text-focus hover:underline">
              Trust &amp; Security
            </Link>
            , or compare free vs one-time Pro deliverables on{" "}
            <Link href="/pricing" className="text-focus hover:underline">
              Pricing
            </Link>
            .
          </p>
        </section>

        {/* how it works */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10">
            How to make a Roblox GUI in 3 steps
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-xl bg-panel border border-line p-5">
                <div className="grid place-items-center w-8 h-8 rounded-lg bg-input text-focus font-bold mb-3">
                  {s.n}
                </div>
                <h3 className="font-semibold mb-1.5">{s.title}</h3>
                <p className="text-sm text-ink-dim leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* use cases */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-3">
            Roblox GUI Maker for every screen type
          </h2>
          <p className="text-ink-dim text-center max-w-2xl mx-auto mb-10">
            Shops, HUDs, inventories, menus, admin panels, loading screens — each
            use case maps to a real Roblox Studio layout you can build and export.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {USE_CASES.map((u) => {
              const tpl = u.template ? getTemplate(u.template) : undefined;
              return (
                <Link
                  key={u.slug}
                  href={`/for/${u.slug}`}
                  className="group rounded-xl overflow-hidden ring-1 ring-line hover:ring-focus transition"
                >
                  {tpl && (
                    <SceneThumb
                      src={templatePreviewSrc(tpl.slug)}
                      alt={`${tpl.title} template preview`}
                    />
                  )}
                  <div className="p-3 bg-panel">
                    <p className="text-sm font-medium text-ink capitalize">
                      {u.noun}
                    </p>
                    <p className="text-xs text-ink-mute line-clamp-2">
                      {u.blurb}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="text-center mt-6">
            <Link
              href="/for"
              className="text-sm text-focus hover:underline font-medium"
            >
              Browse all use cases →
            </Link>
          </div>
        </section>

        {/* game ui kits */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold">
                Game UI Kits
              </h2>
              <p className="text-sm text-ink-dim mt-1 max-w-md">
                Whole-game interface sets — menu, shop, HUD, inventory, and
                rewards in one shared theme. Start free with single-screen Luau
                exports, or unlock full Studio <code>.rbxmx</code> bundles.
              </p>
            </div>
            <Link href="/kits" className="text-sm text-focus hover:underline font-medium">
              All kits →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {KITS.map((kit) => (
              <KitCard key={kit.slug} kit={kit} />
            ))}
          </div>
        </section>

        {/* gamepass icon maker callout */}
        <section className="max-w-6xl mx-auto px-6 py-6">
          <div className="rounded-2xl border border-focus/40 bg-panel p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-focus mb-2">
                Free Tool · 512×512 PNG · Circular Safe-Zone Check
              </p>
              <h2 className="text-xl md:text-2xl font-semibold text-ink mb-2">
                Roblox Gamepass Icon Maker — stop getting edges cropped
              </h2>
              <p className="text-sm text-ink-dim leading-relaxed">
                Roblox automatically crops square Gamepass thumbnails into a
                circle on Store pages. Design badges with sunburst gradients,
                text, and a live circular safe-zone ring, then export crisp
                512×512 PNGs ready for Creator Hub.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link
                href="/gamepass-icon-maker"
                className="px-5 py-3 rounded-lg font-semibold bg-primary text-on-primary hover:brightness-110 transition text-sm"
              >
                Make Free Icons →
              </Link>
              <Link
                href="/guides/how-to-make-roblox-gamepass-icons"
                className="px-4 py-3 rounded-lg font-medium border border-line hover:bg-raised transition text-sm"
              >
                512×512 Icon Guide
              </Link>
            </div>
          </div>
        </section>

        {/* free gui workflow tools */}
        <section className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-focus mb-1">
                Free Roblox GUI Companion Tools
              </p>
              <h2 className="text-2xl font-semibold text-ink">
                Every GUI helper alongside your Roblox Studio workflow
              </h2>
            </div>
            <Link href="/showcase" className="text-sm text-focus hover:underline">
              Explore Showcase →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                href: "/roblox-ui-sizer",
                badge: "UDim2 + rbxassetid://",
                title: "UDim2 UI Sizer & Decal Preview",
                desc: "Convert pixel Offsets into responsive UDim2.fromScale + UIAspectRatioConstraint Luau and test decals.",
              },
              {
                href: "/gamepass-icon-maker",
                badge: "512×512 Circular Crop",
                title: "Gamepass Icon Maker",
                desc: "Design crisp store badges with sunbursts, text, and a live circle crop safe-zone indicator.",
              },
              {
                href: "/studio-plugin",
                badge: "Zero HTTP Permissions",
                title: "Offline Studio Sync Plugin",
                desc: "Install RobloxGuiMakerSync.lua once and paste /editor JSON into Studio with full Ctrl+Z Undo.",
              },
            ].map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group rounded-xl border border-line bg-panel p-5 transition hover:border-focus hover:bg-raised"
              >
                <p className="text-[11px] font-mono uppercase tracking-wider text-focus mb-1.5">
                  {tool.badge}
                </p>
                <h3 className="text-base font-semibold text-ink group-hover:text-focus transition">
                  {tool.title} →
                </h3>
                <p className="mt-1.5 text-sm text-ink-dim leading-relaxed">{tool.desc}</p>
              </Link>
            ))}
          </div>
          <p className="mt-4 text-xs text-ink-mute">
            More Roblox creator utilities:{" "}
            <Link href="/roblox-shirt-tester" className="hover:text-ink underline underline-offset-2">
              3D Shirt Tester
            </Link>{" "}
            ·{" "}
            <Link href="/roblox-shirt-template-maker" className="hover:text-ink underline underline-offset-2">
              Shirt Template Maker
            </Link>{" "}
            ·{" "}
            <Link href="/roblox-thumbnail-maker" className="hover:text-ink underline underline-offset-2">
              Thumbnail Maker
            </Link>
          </p>
        </section>

        {/* templates strip */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold">Start from a template</h2>
            <div className="flex items-center gap-4 text-sm">
              <Link href="/for" className="text-ink-dim hover:text-ink">
                By use case
              </Link>
              <Link href="/templates" className="text-focus hover:underline">
                All templates →
              </Link>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEMPLATES.map((t) => (
              <Link
                key={t.slug}
                href={`/templates/${t.slug}`}
                className="group rounded-xl overflow-hidden ring-1 ring-line hover:ring-focus transition"
              >
                <SceneThumb
                  src={templatePreviewSrc(t.slug)}
                  alt={`${t.title} template preview`}
                />
                <div className="p-3 bg-panel">
                  <p className="text-sm font-medium text-ink">
                    {t.title.replace("Roblox ", "").replace(" GUI", "")}
                  </p>
                  <p className="text-xs text-ink-mute">{t.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* guides strip — direct home→detail links so every guide is one
            click from the root. Reduces click depth for crawlers and spreads
            PageRank from the homepage out to guide detail pages. */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold">
                Guides &amp; tutorials
              </h2>
              <p className="text-sm text-ink-dim mt-1 max-w-md">
                Step-by-step written tutorials for every common Roblox GUI —
                main menu, shop, inventory, loading screen, and more. Each pairs
                with a template you can open in the editor.
              </p>
            </div>
            <Link href="/guides" className="text-sm text-focus hover:underline font-medium">
              All guides →
            </Link>
          </div>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {GUIDES.map((g) => (
              <li key={g.slug}>
                <Link
                  href={`/guides/${g.slug}`}
                  className="block rounded-xl border border-line bg-panel hover:border-focus p-4 transition h-full"
                >
                  <p className="text-xs text-focus font-semibold uppercase tracking-wider mb-1">
                    {g.category}
                  </p>
                  <p className="text-sm font-medium text-ink leading-snug">
                    {g.title}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* SEO body */}
        <section className="max-w-3xl mx-auto px-6 py-16 space-y-5 text-ink-dim leading-relaxed">
          <h2 className="text-2xl font-semibold text-ink">
            What is a Roblox GUI?
          </h2>
          <p>
            A GUI (Graphical User Interface) in Roblox is the 2D layer drawn on
            top of your game — main menus, health bars, shops, inventories,
            settings panels, loading screens and HUDs. Under the hood these are
            built from instances like <code className="text-focus">ScreenGui</code>,{" "}
            <code className="text-focus">Frame</code>,{" "}
            <code className="text-focus">TextButton</code> and{" "}
            <code className="text-focus">TextLabel</code>, positioned with UDim2
            scale so they adapt to every screen size. A{" "}
            <strong>Roblox GUI maker</strong> or{" "}
            <strong>Roblox GUI generator</strong> lets you build these interfaces
            visually without hand-editing each property in Studio.
          </p>

          <h2 className="text-2xl font-semibold text-ink pt-4">
            Why making GUIs in Roblox Studio is slow
          </h2>
          <p>
            Roblox Studio ships with a built-in UI editor, but it&rsquo;s the
            part of Studio developers complain about most. Placing every Frame by
            hand, nudging UDim2 offsets until things line up, and rebuilding the
            same menu patterns game after game eats hours — especially for solo
            developers and younger creators learning to script. That friction is
            exactly what a dedicated <strong>Roblox GUI builder</strong> removes.
            An <strong>online Roblox GUI editor</strong> like this one lets you
            design and export from any device without installing Studio.
          </p>

          <h2 className="text-2xl font-semibold text-ink pt-4">
            How this Roblox GUI maker is different
          </h2>
          <p>
            Most &ldquo;AI GUI&rdquo; tools spit out placeholder layouts you then
            have to clean up. This <strong>Roblox UI maker</strong> is the
            opposite: a precise, visual canvas where you stay in control.
            Property names match Roblox exactly (BackgroundColor3,
            BackgroundTransparency, ZIndex), you can nest containers and
            auto-arrange children with{" "}
            <Link
              href="/guides/how-to-use-uilistlayout-in-roblox"
              className="text-focus hover:underline"
            >
              UIListLayout
            </Link>{" "}
            and UIGridLayout, and the
            exported Luau is clean enough to ship as-is — real{" "}
            <code className="text-focus">Instance.new</code> calls,{" "}
            <code className="text-focus">UDim2.new</code> positioning, and
            correct parenting. Unlike a typical <strong>
            Roblox UI generator</strong> that outputs raw text, this tool gives
            you a live preview on desktop and mobile.
          </p>

          <h2 className="text-2xl font-semibold text-ink pt-4">
            How to import an exported GUI into Roblox Studio (Luau &amp; .rbxmx)
          </h2>
          <p>
            For free Luau exports, create a{" "}
            <code className="text-focus">LocalScript</code> under{" "}
            <code className="text-focus">StarterGui</code> and paste the
            client script — and if your UI includes RemoteEvent or Teleport
            actions, paste the separate server script under{" "}
            <code className="text-focus">ServerScriptService</code>. Prefer a
            drag-and-drop model instead? Unlock native{" "}
            <code className="text-focus">.rbxmx</code> export on{" "}
            <Link href="/pricing" className="text-focus hover:underline">
              Pro
            </Link>{" "}
            and follow our{" "}
            <Link
              href="/guides/how-to-import-rbxmx-into-roblox-studio"
              className="text-focus hover:underline"
            >
              Studio .rbxmx import guide
            </Link>
            .
          </p>

          <h2 className="text-2xl font-semibold text-ink pt-4">Who it&rsquo;s for</h2>
          <p>
            Beginners who want a good-looking menu without fighting Studio&rsquo;s
            inspector; experienced developers who want to scaffold a shop or HUD
            in minutes instead of an hour; and solo creators who also need a{" "}
            <Link
              href="/gamepass-icon-maker"
              className="text-focus hover:underline"
            >
              512×512 Roblox Gamepass icon
            </Link>{" "}
            that survives Store circular cropping. It&rsquo;s free, runs in your
            browser, and never asks you to sign up. Whether you call it a{" "}
            <strong>Roblox GUI maker</strong>, <strong>Roblox UI builder</strong>,
            or <strong>online Roblox GUI editor</strong> — the goal is the same:
            ship polished interfaces faster.
          </p>
        </section>

        <section
          aria-labelledby="faq-heading"
          className="max-w-3xl mx-auto px-6 pb-20"
        >
          <h2
            id="faq-heading"
            className="mb-8 text-2xl font-semibold text-ink md:text-3xl"
          >
            Frequently asked questions about Roblox GUI Maker
          </h2>
          <div className="space-y-3">
            {FAQS.map((item) => (
              <details
                key={item.question}
                className="rounded-xl border border-line bg-panel"
              >
                <summary className="cursor-pointer px-5 py-4 font-semibold text-ink marker:text-focus">
                  {item.question}
                </summary>
                <p className="px-5 pb-5 text-sm leading-relaxed text-ink-dim">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
