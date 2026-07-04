import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "./components/SiteNav";
import { SiteFooter } from "./components/SiteFooter";
import { KitCard } from "./components/KitCard";
import { ScenePreview } from "./editor/ScenePreview";
import { KITS } from "./editor/kits";
import { TEMPLATES, getTemplate } from "./editor/templates";
import { USE_CASES } from "./for/usecases";
import { GUIDES } from "./guides/guides-data";

export const metadata: Metadata = {
  title: "Free Online Roblox GUI Maker | Visual UI Builder",
  description:
    "Free online Roblox GUI maker. Create responsive designs, preview interactions, and export Luau, JSON, and ZIP for Roblox Studio. No login required.",
  keywords: [
    "Roblox GUI Maker",
    "Roblox GUI Generator",
    "Roblox UI Maker",
    "Roblox UI Generator",
    "Roblox GUI builder",
    "online Roblox GUI editor",
    "Roblox Studio GUI",
    "free Roblox GUI tool",
  ],
  openGraph: {
    title: "Free Online Roblox GUI Maker | Visual UI Builder",
    description:
      "Create responsive Roblox GUIs, preview interactions, and export Luau, JSON, and complete ZIP projects for Roblox Studio.",
    url: "https://robloxguimaker.app",
    siteName: "Roblox GUI Maker",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Roblox GUI Maker | Visual UI Builder",
    description:
      "Create responsive Roblox GUIs, preview interactions, and export Luau, JSON, and complete ZIP projects for Roblox Studio.",
  },
  alternates: {
    canonical: "/",
    languages: {
      en: "https://robloxguimaker.app",
      zh: "https://robloxguimaker.app/zh",
    },
  },
};

const STEPS = [
  {
    n: "1",
    title: "Drag & drop",
    body: "Drop ScreenGui, Frame, TextButton, labels and more onto the canvas. Nest containers, snap them into place, resize from any corner.",
  },
  {
    n: "2",
    title: "Tweak properties",
    body: "Edit real Roblox properties — BackgroundColor3, transparency, text, font, corner radius. Everything uses the names you already know from Studio.",
  },
  {
    n: "3",
    title: "Download a complete project",
    body: "Export clean client and server Luau, keep an editable JSON project, or download everything together as a ZIP for Roblox Studio.",
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
    title: "ZIP + JSON Export",
    body: "Download a complete project package or save a versioned scene document that imports back into the editor.",
  },
];

const FAQS = [
  {
    question: "Is Roblox GUI Maker free to use?",
    answer:
      "Yes. The editor is free, requires no account, and keeps project work in your browser unless you download it.",
  },
  {
    question: "What files can I export?",
    answer:
      "You can copy or download client Luau, download optional server Luau, export an editable JSON scene, or download a ZIP containing the project files and instructions.",
  },
  {
    question: "Can I design for phones and tablets?",
    answer:
      "Yes. Device previews and responsive geometry controls cover scale, offset, anchors, aspect ratios, and size constraints.",
  },
  {
    question: "Does the editor generate game logic?",
    answer:
      "It generates UI instances and selected interaction wiring, including separate RemoteEvent and Teleport server handlers. Secure economy, purchase, reward, permission, and datastore validation remains your responsibility.",
  },
  {
    question: "Where do the generated scripts go in Roblox Studio?",
    answer:
      "Place client Luau in a LocalScript under StarterGui. Place generated server Luau in a Script under ServerScriptService.",
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
    "Free online visual Roblox GUI maker and generator. Build responsive Roblox UIs with drag-and-drop, preview interactions, and export clean Luau for Roblox Studio.",
  applicationCategory: "DesignApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  featureList: [
    "Visual drag-and-drop Roblox GUI editor",
    "Responsive geometry with scale, offset, anchors, aspect ratios, and size constraints",
    "Interaction previews for show, hide, toggle, RemoteEvent, and Teleport actions",
    "Server handlers for RemoteEvent and Teleport actions",
    "Versioned JSON project import and export",
    "Browser-local ZIP project export",
    "Roblox GUI templates and how-to guides",
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
            Free · No login · Browser-local exports
          </p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-5">
            Roblox GUI Maker
          </h1>
          <p className="text-lg md:text-xl text-ink-dim max-w-2xl mx-auto mb-8">
            Design responsive Roblox interfaces visually, preview button
            behavior, then download clean Luau, editable JSON, or a complete
            ZIP project for Roblox Studio.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/editor"
              className="px-6 py-3 rounded-lg font-semibold bg-primary text-on-primary hover:brightness-110 transition"
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
        </section>

        {/* hero preview */}
        <section className="max-w-4xl mx-auto px-6 pb-4">
          <div className="rounded-2xl ring-1 ring-line overflow-hidden shadow-2xl shadow-black/40">
            <ScenePreview scene={TEMPLATES[0].scene} />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
            {PRODUCT_PROOFS.map((proof) => (
              <article
                key={proof.title}
                className="rounded-xl border border-line bg-panel p-4"
              >
                <h3 className="mb-1.5 text-sm font-semibold text-ink">
                  {proof.title}
                </h3>
                <p className="text-xs leading-relaxed text-ink-dim">
                  {proof.body}
                </p>
              </article>
            ))}
          </div>
        </section>

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

        {/* how it works */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10">
            From a blank screen to a working GUI in three steps
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
                  {tpl && <ScenePreview scene={tpl.scene} />}
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
                Whole-game interface sets — menu, shop, HUD and rewards in one
                shared theme. The look of a finished game, free.
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
                <ScenePreview scene={t.scene} />
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
            auto-arrange children with UIListLayout and UIGridLayout, and the
            exported Luau is clean enough to ship as-is — real{" "}
            <code className="text-focus">Instance.new</code> calls,{" "}
            <code className="text-focus">UDim2.new</code> positioning, and
            correct parenting. Unlike a typical <strong>
            Roblox UI generator</strong> that outputs raw text, this tool gives
            you a live preview on desktop and mobile.
          </p>

          <h2 className="text-2xl font-semibold text-ink pt-4">Who it&rsquo;s for</h2>
          <p>
            Beginners who want a good-looking menu without fighting Studio&rsquo;s
            inspector; experienced developers who want to scaffold a shop or HUD
            in minutes instead of an hour; and anyone who&rsquo;d rather design a
            GUI visually and hand off clean Luau. It&rsquo;s free, runs in your
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
            Frequently asked questions
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
