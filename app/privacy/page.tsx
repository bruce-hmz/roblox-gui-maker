import type { Metadata } from "next";
import { SiteNav } from "../components/SiteNav";
import { SiteFooter } from "../components/SiteFooter";

export const metadata: Metadata = {
  title: "Privacy Policy — Roblox GUI Maker",
  description:
    "What Roblox GUI Maker does and does not collect: browser-local projects, no account, and only privacy-respecting aggregate analytics. Your rights under GDPR, CCPA, and PIPL.",
  openGraph: {
    title: "Privacy Policy — Roblox GUI Maker",
    description:
      "Browser-local projects, no account, only aggregate analytics. Your data rights explained.",
    url: "https://robloxguimaker.app/privacy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy — Roblox GUI Maker",
    description:
      "Browser-local projects, no account, only aggregate analytics. Your data rights explained.",
  },
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <SiteNav />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-focus text-xs font-semibold uppercase tracking-wider mb-2">
          Legal
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Privacy Policy
        </h1>
        <p className="text-sm text-ink-mute mb-10">Last updated: July 4, 2026</p>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-ink mb-3">In one sentence</h2>
          <p className="text-ink-dim leading-relaxed">
            Roblox GUI Maker has no account system, no server-side storage of
            your projects, and runs entirely in your browser &mdash; the only
            data collected is privacy-respecting aggregate traffic analytics,
            described below.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-ink mb-3">
            What we do not collect
          </h2>
          <ul className="space-y-2 text-ink-dim">
            {[
              "No accounts. There is no login, sign-up, or profile. We never ask for your name, email, or Roblox username.",
              "No project uploads. Everything you design stays in your browser's local storage. Your GUI projects are never transmitted to or stored on our servers.",
              "No Roblox credentials. This tool never asks for your Roblox password or your .ROBLOSECURITY cookie, and has no way to access your Roblox account.",
              "No payment data. The tool is free, so there is no checkout, card, or billing information collected.",
            ].map((t) => (
              <li key={t} className="flex gap-2.5">
                <span className="text-focus mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-focus" />
                <span className="leading-relaxed">{t}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-ink mb-3">
            What we do collect
          </h2>
          <p className="text-ink-dim leading-relaxed mb-3">
            We use Google Analytics 4 to understand aggregate traffic patterns
            &mdash; which pages are visited, roughly where visitors come from
            (country-level), and whether a visit came from a search engine or a
            referring site. This helps us improve the tool. The data collected is
            statistical and is not used to identify you personally.
          </p>
          <p className="text-ink-dim leading-relaxed mb-3">
            Specifically, Google Analytics may process:
          </p>
          <ul className="space-y-2 text-ink-dim">
            {[
              "An anonymized, country-level location derived from your IP address (Google truncates this and we cannot see your full IP).",
              "Aggregated page-view counts, session duration, and referrer information.",
              "A first-party cookie and a random client identifier so GA can tell repeat visits apart. No Roblox data or project content is ever in this cookie.",
            ].map((t) => (
              <li key={t} className="flex gap-2.5">
                <span className="text-focus mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-focus" />
                <span className="leading-relaxed">{t}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-ink mb-3">
            Third-party processors
          </h2>
          <p className="text-ink-dim leading-relaxed">
            The only third-party service this site uses is{" "}
            <span className="font-medium text-ink">Google Analytics</span>{" "}
            (operated by Google LLC). Google processes the aggregate traffic data
            described above as a processor on our behalf. Their privacy
            practices are governed by their own privacy policy at{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-focus hover:underline"
            >
              policies.google.com/privacy
            </a>
            . We have not enabled Google Advertising features, so your data is
            not used to show you personalized ads.
          </p>
          <p className="text-ink-dim leading-relaxed mt-3">
            When a template includes a Roblox item image, the image is fetched
            from Roblox's public thumbnail service. This may cause Roblox to see
            a request from your browser for that image, which is governed by
            Roblox's privacy policy.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-ink mb-3">Your rights</h2>
          <p className="text-ink-dim leading-relaxed mb-3">
            Depending on where you live, you may have rights over your personal
            data:
          </p>
          <ul className="space-y-2 text-ink-dim">
            {[
              "GDPR (EU/UK): the right to access, correct, or erase your personal data, and to object to processing.",
              "CCPA (California): the right to know what is collected, to request deletion, and to opt out of the sale of personal information. We do not sell personal information.",
              "PIPL (China): the right to know, copy, correct, and delete your personal information, and to withdraw consent.",
            ].map((t) => (
              <li key={t} className="flex gap-2.5">
                <span className="text-focus mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-focus" />
                <span className="leading-relaxed">{t}</span>
              </li>
            ))}
          </ul>
          <p className="text-ink-dim leading-relaxed mt-3">
            Because we collect only aggregate analytics through Google Analytics
            and we cannot tie it back to you as an individual, the most direct
            way to exercise these rights is to{" "}
            <span className="font-medium text-ink">
              opt out of Google Analytics
            </span>{" "}
            using Google's official{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              className="text-focus hover:underline"
            >
              browser add-on
            </a>
            , or to enable your browser's Do-Not-Track / global privacy control
            setting. You can also use ad/tracker blockers, which will prevent
            the analytics script from loading.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-ink mb-3">
            Children's privacy
          </h2>
          <p className="text-ink-dim leading-relaxed">
            Roblox has a large under-13 audience. We do not knowingly collect
            personal information from children, and the aggregate analytics we
            use has no way to estimate age. If you believe a child has provided
            personal information to us, please contact us so we can investigate.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-ink mb-3">
            Changes &amp; contact
          </h2>
          <p className="text-ink-dim leading-relaxed">
            If this policy changes, we will update the &ldquo;Last
            updated&rdquo; date above. For any privacy question or request, open
            an issue on{" "}
            <a
              href="https://github.com/firstdraft-work/roblox-gui-maker/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="text-focus hover:underline"
            >
              our GitHub repository
            </a>{" "}
            or email the maintainer at{" "}
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
