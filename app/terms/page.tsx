import type { Metadata } from "next";
import { SiteNav } from "../components/SiteNav";
import { SiteFooter } from "../components/SiteFooter";

export const metadata: Metadata = {
  title: "Terms of Service — Roblox GUI Maker",
  description:
    "The terms for using Roblox GUI Maker: a free, unofficial tool that exports Luau you are responsible for. Disclaimer of warranty, trademark notice, and acceptable use.",
  openGraph: {
    title: "Terms of Service — Roblox GUI Maker",
    description:
      "Free, unofficial tool. Exported Luau is your responsibility. No warranty.",
    url: "https://robloxguimaker.app/terms",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service — Roblox GUI Maker",
    description:
      "Free, unofficial tool. Exported Luau is your responsibility. No warranty.",
  },
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <SiteNav />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-focus text-xs font-semibold uppercase tracking-wider mb-2">
          Legal
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Terms of Service
        </h1>
        <p className="text-sm text-ink-mute mb-10">Last updated: July 4, 2026</p>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-ink mb-3">
            What this tool is
          </h2>
          <p className="text-ink-dim leading-relaxed">
            Roblox GUI Maker is a free, browser-based visual builder for Roblox
            game interfaces. By using the tool you accept these terms. If you do
            not accept them, do not use the tool. There is no account and no
            payment &mdash; you simply use the editor in your browser.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-ink mb-3">
            You own what you build
          </h2>
          <p className="text-ink-dim leading-relaxed">
            The Roblox GUI designs and Luau scripts you create with this tool are
            entirely yours. We claim no ownership over your projects, and nothing
            you design is uploaded to us &mdash; your projects stay in your
            browser until you export them. You may use the exported Luau,
            JSON, and ZIP files in your own Roblox games, including commercial
            Roblox experiences, without crediting us.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-ink mb-3">
            You are responsible for the code you ship
          </h2>
          <p className="text-ink-dim leading-relaxed mb-3">
            This tool generates UI instance code and basic interaction wiring
            (show/hide/toggle, RemoteEvent and Teleport handlers). It does{" "}
            <span className="font-medium text-ink">not</span> generate secure
            game logic for you. Specifically, the following remain your sole
            responsibility:
          </p>
          <ul className="space-y-2 text-ink-dim">
            {[
              "Server-side validation of every RemoteEvent and purchase. Never trust the client for economy actions.",
              "Permission and admin checks on privileged actions (kick, ban, teleport).",
              "DataStore protection, anti-exploit measures, and rate limiting.",
              "Reviewing the generated Luau before shipping it, and adapting it to your game's specific needs.",
            ].map((t) => (
              <li key={t} className="flex gap-2.5">
                <span className="text-focus mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-focus" />
                <span className="leading-relaxed">{t}</span>
              </li>
            ))}
          </ul>
          <p className="text-ink-dim leading-relaxed mt-3">
            The tool is a productivity aid, not a substitute for secure coding.
            We are not liable for any damage, data loss, or abuse that results
            from code you export and ship.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-ink mb-3">Acceptable use</h2>
          <p className="text-ink-dim leading-relaxed mb-3">You agree not to:</p>
          <ul className="space-y-2 text-ink-dim">
            {[
              "Use the tool to build UI intended to deceive players, phish credentials, or bypass Roblox's Terms of Service.",
              "Attempt to access, scan, or overload the service or its underlying infrastructure.",
              "Embed or rehost the tool elsewhere in a way that implies it is your own product.",
            ].map((t) => (
              <li key={t} className="flex gap-2.5">
                <span className="text-focus mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-focus" />
                <span className="leading-relaxed">{t}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-ink mb-3">No warranty</h2>
          <p className="text-ink-dim leading-relaxed">
            The tool is provided &ldquo;as is&rdquo; and &ldquo;as
            available,&rdquo; without warranty of any kind. We do not guarantee
            that the tool will be uninterrupted, error-free, or that exported
            code will be free of bugs. You use it at your own risk.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-ink mb-3">
            Unofficial &amp; trademark notice
          </h2>
          <p className="text-ink-dim leading-relaxed">
            Roblox GUI Maker is an independent, unofficial creator tool. It is{" "}
            <span className="font-medium text-ink">
              not affiliated with, sponsored by, or endorsed by Roblox
              Corporation
            </span>
            . &ldquo;Roblox&rdquo; and all related class and API names
            (ScreenGui, Frame, TextButton, UDim2, RemoteEvent, etc.) are
            trademarks or properties of Roblox Corporation. References to these
            names are for descriptive purposes only.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-ink mb-3">
            Changes &amp; contact
          </h2>
          <p className="text-ink-dim leading-relaxed">
            We may update these terms as the tool evolves; the &ldquo;Last
            updated&rdquo; date above will reflect any change. For questions,
            open an issue on{" "}
            <a
              href="https://github.com/bruce-hmz/roblox-gui-maker/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="text-focus hover:underline"
            >
              our GitHub repository
            </a>{" "}
            or email{" "}
            <a
              href="mailto:support@robloxguimaker.app"
              className="text-focus hover:underline"
            >
              support@robloxguimaker.app
            </a>
            .
          </p>
        </section>

        <section className="text-sm text-ink-mute leading-relaxed border-t border-line pt-6">
          <p>
            Roblox GUI Maker is an independent, unofficial tool. It is not
            affiliated with or endorsed by Roblox Corporation. &ldquo;Roblox&rdquo;
            is a trademark of Roblox Corporation.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
