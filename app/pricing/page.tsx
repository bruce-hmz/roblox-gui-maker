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

export default function PricingPage() {
  return (
    <>
      <SiteNav />
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

        <section className="mx-auto mt-16 max-w-3xl space-y-6 text-sm text-ink-dim leading-relaxed">
          <h2 className="text-2xl font-semibold text-ink">
            Frequently Asked Questions
          </h2>
          <div>
            <h3 className="font-semibold text-ink">
              What is the difference between free .lua export and .rbxmx export?
            </h3>
            <p className="mt-1">
              Free <code className="text-ink">.lua</code> export generates a clean{" "}
              <code className="text-ink">LocalScript</code> that constructs the GUI
              at runtime. Native <code className="text-ink">.rbxmx</code> export
              produces an XML Roblox model file containing real{" "}
              <code className="text-ink">ScreenGui</code>,{" "}
              <code className="text-ink">Frame</code>,{" "}
              <code className="text-ink">UICorner</code>,{" "}
              <code className="text-ink">UIGradient</code>,{" "}
              <code className="text-ink">UIStroke</code>, and layout instances so
              you can inspect, animate, and edit every node visually inside
              Roblox Studio&rsquo;s Explorer without installing any Studio plugin.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-ink">
              Is this a recurring subscription?
            </h3>
            <p className="mt-1">
              No. Both Studio Passes are single one-time Stripe payments (USD 9.90
              or USD 19.90). You are never billed monthly.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-ink">
              Can I use exported UI kits and Gamepass icons in commercial Roblox games?
            </h3>
            <p className="mt-1">
              Yes. Every{" "}
              <Link href="/kits" className="text-focus hover:underline">
                Game UI Kit
              </Link>{" "}
              and{" "}
              <Link
                href="/gamepass-icon-maker"
                className="text-focus hover:underline"
              >
                512×512 Gamepass badge icon
              </Link>{" "}
              can be used in unlimited personal, group, or commissioned Roblox
              experiences with no attribution required.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
