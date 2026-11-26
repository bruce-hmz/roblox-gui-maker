import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "../components/SiteNav";
import { SiteFooter } from "../components/SiteFooter";
import { PricingCards } from "./PricingCards";

export const metadata: Metadata = {
  title: "Pricing — Native Roblox Studio .rbxmx & Pro UI Kits | Roblox GUI Maker",
  description:
    "Luau code exports and single 512x512 Gamepass icons are free forever. Upgrade once (no subscription) to export native Roblox Studio .rbxmx models, all 6 multi-screen UI kits, and 48 Gamepass icons.",
  alternates: {
    canonical: "/pricing",
    languages: {
      "x-default": "https://robloxguimaker.app/pricing",
      en: "https://robloxguimaker.app/pricing",
      zh: "https://robloxguimaker.app/zh/pricing",
    },
  },
  openGraph: {
    title: "Pricing — Native Roblox Studio .rbxmx & Pro UI Kits",
    description:
      "One-time buyout for native .rbxmx Studio hierarchies, 6 genre UI kits, and 48 512x512 Gamepass badge icons. Luau code stays free forever.",
    url: "https://robloxguimaker.app/pricing",
  },
};

const PRICING_FAQS = [
  {
    q: "What is the difference between free .lua export and Pro .rbxmx export?",
    a: "Free .lua export generates a clean LocalScript that creates your GUI via Instance.new at runtime. Native .rbxmx export produces an XML Roblox model containing real ScreenGui, Frame, UICorner, UIGradient, UIStroke, and constraint instances that open visually in Roblox Studio Explorer without installing any plugin.",
  },
  {
    q: "How do I import a downloaded .rbxmx file or UI Kit into Roblox Studio?",
    a: "Open your place in Roblox Studio, right-click StarterGui in the Explorer tree, select Insert from File..., and choose either a standalone .rbxmx file or the kit's -complete.rbxmx file. Move any included server/*.server.lua scripts into ServerScriptService, then press Play.",
  },
  {
    q: "Is this a recurring subscription or a one-time payment?",
    a: "Both Studio Passes are one-time buyouts processed securely by Waffo (USD 9.90 for Studio .rbxmx + 1 UI Kit Pass, or USD 19.90 for All-Access including all 6 kits and all 48 icons). There are zero monthly fees or auto-renewals.",
  },
  {
    q: "How do I restore my Pro Pass if I clear browser cookies or switch computers?",
    a: "We don't force accounts or passwords. After paying on Waffo, click Done to return to your /pro/success?order_ref=... confirmation URL, bookmark it, and download your kit ZIPs immediately. Reopening that confirmation link on another browser or device re-verifies your completed Waffo order and restores the Pro Pass cookie cleanly.",
  },
  {
    q: "Can I use Pro UI Kits, .rbxmx models, and Gamepass icons in commercial Roblox games?",
    a: "Yes. Every exported GUI, multi-screen Game UI Kit, and 512x512 Gamepass badge icon can be used in unlimited personal, group, or commissioned commercial Roblox experiences with no attribution required. Just don't repackage and resell the raw source kits as a standalone competing UI pack.",
  },
  {
    q: "Can I test the editor, AI generator, and Gamepass Icon Maker before buying?",
    a: "Yes. The visual drag-and-drop editor, AI prompt-to-GUI generator, all 13 templates, interactive kit previews, clean Luau exports, and single 512x512 Gamepass icon exports are free to test anytime without signing up.",
  },
];

const pricingFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PRICING_FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.a,
    },
  })),
};

export default function PricingPage() {
  return (
    <>
      <SiteNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pricingFaqSchema).replace(/</g, "\\u003c"),
        }}
      />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="max-w-3xl mb-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-focus mb-2">
            One-Time Buyout · Zero Subscriptions
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Free Luau Builder. Pay Once for Studio-Ready Deliverables.
          </h1>
          <p className="text-ink-dim leading-relaxed">
            Designing interfaces, copying Client &amp; Server Luau scripts, and
            downloading individual 512×512 Gamepass PNGs require zero login and
            cost nothing. When you want native{" "}
            <code className="rounded bg-raised px-1.5 py-0.5 text-xs text-ink">
              .rbxmx
            </code>{" "}
            instance hierarchies you can drag straight into{" "}
            <code className="rounded bg-raised px-1.5 py-0.5 text-xs text-ink">
              StarterGui
            </code>{" "}
            plus complete themed 5-screen Game UI Kits and matched monetization
            badges, unlock a Studio Pass once.
          </p>
        </div>

        <PricingCards locale="en" />

        <section className="mx-auto mt-14 max-w-3xl rounded-xl border border-line bg-panel p-5 text-sm text-ink-dim leading-relaxed">
          <h2 className="text-base font-semibold text-ink mb-2">
            How Studio <code className="text-ink">.rbxmx</code> import works (3 steps, no plugin needed)
          </h2>
          <ol className="list-decimal pl-5 space-y-1.5">
            <li>
              Download your single-screen <code className="text-ink">.rbxmx</code>{" "}
              from the{" "}
              <Link href="/editor" className="text-focus hover:underline">
                editor
              </Link>{" "}
              or grab a{" "}
              <Link href="/kits" className="text-focus hover:underline">
                Pro UI Kit ZIP
              </Link>
              .
            </li>
            <li>
              In Roblox Studio Explorer, right-click{" "}
              <strong className="text-ink">StarterGui</strong> →{" "}
              <strong className="text-ink">Insert from File...</strong> and pick
              your <code className="text-ink">.rbxmx</code> (or{" "}
              <code className="text-ink">*-complete.rbxmx</code> for all 5 linked
              screens).
            </li>
            <li>
              Move any included <code className="text-ink">server/*.server.lua</code>{" "}
              stubs into <strong className="text-ink">ServerScriptService</strong>{" "}
              and press <strong className="text-ink">Play</strong>. See our{" "}
              <Link
                href="/guides/how-to-import-rbxmx-into-roblox-studio"
                className="text-focus hover:underline"
              >
                full .rbxmx import guide
              </Link>{" "}
              for troubleshooting tips.
            </li>
          </ol>
        </section>

        <section className="mx-auto mt-14 max-w-3xl space-y-6 text-sm text-ink-dim leading-relaxed">
          <h2 className="text-2xl font-semibold text-ink">
            Frequently Asked Questions
          </h2>
          {PRICING_FAQS.map((item) => (
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
