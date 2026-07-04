import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "../components/SiteNav";
import { SiteFooter } from "../components/SiteFooter";

export const metadata: Metadata = {
  title: "Is Roblox GUI Maker Safe? — Trust & Security",
  description:
    "Roblox GUI Maker never asks for your Roblox password or .ROBLOSECURITY cookie, has no login, and runs entirely in your browser. Why it is safe to use.",
  openGraph: {
    title: "Is Roblox GUI Maker Safe? — Trust & Security",
    description:
      "No login, no .ROBLOSECURITY cookie, browser-local projects. Why Roblox GUI Maker is safe.",
    url: "https://robloxguimaker.app/trust",
  },
  twitter: {
    card: "summary_large_image",
    title: "Is Roblox GUI Maker Safe? — Trust & Security",
    description:
      "No login, no .ROBLOSECURITY cookie, browser-local projects. Why Roblox GUI Maker is safe.",
  },
  alternates: { canonical: "/trust" },
};

export default function TrustPage() {
  return (
    <>
      <SiteNav />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-focus text-xs font-semibold uppercase tracking-wider mb-2">
          Trust &amp; Safety
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Is Roblox GUI Maker safe to use?
        </h1>
        <p className="text-lg text-ink-dim leading-relaxed mb-10">
          Yes. Roblox GUI Maker is a browser-based design tool that{" "}
          <span className="font-medium text-ink">
            never asks for your Roblox password, never reads your{" "}
            <code className="text-focus">.ROBLOSECURITY</code> cookie, and has no
            login at all
          </span>
          . Your GUI projects stay on your device. This page explains exactly
          what the tool does and does not touch, and why you can use it without
          risking your Roblox account.
        </p>

        {/* Direct answer block — the citable passage for "is it safe" queries.
            Question-style H2 matches AI Overview / answer-engine extraction. */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-ink mb-3">
            Will this steal my Roblox account or cookie?
          </h2>
          <p className="text-ink-dim leading-relaxed">
            No. This is the single most important thing to understand about the
            tool. There is a category of &ldquo;Roblox GUI maker&rdquo; sites and
            downloaded scripts whose real purpose is to harvest your{" "}
            <code className="text-focus">.ROBLOSECURITY</code> authentication
            cookie and take over your account. Roblox GUI Maker is the opposite
            of that. It is a visual editor that runs in your browser, exports
            Luau source code you can read, and has{" "}
            <span className="font-medium text-ink">no mechanism</span> to read,
            transmit, or request your Roblox credentials. You can verify this
            yourself: the tool has no login form, no place to paste a cookie, and
            the source code is{" "}
            <a
              href="https://github.com/firstdraft-work/roblox-gui-maker"
              target="_blank"
              rel="noopener noreferrer"
              className="text-focus hover:underline"
            >
              public on GitHub
            </a>
            .
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-ink mb-3">
            What &ldquo;runs in your browser&rdquo; actually means
          </h2>
          <p className="text-ink-dim leading-relaxed mb-3">
            When you design a GUI here, the work happens entirely on your device:
          </p>
          <ul className="space-y-2 text-ink-dim">
            {[
              "Your designs are stored in your browser's local storage, not on our servers. Clearing your browser data clears your projects.",
              "When you export Luau, JSON, or a ZIP, the file is generated on your device and downloaded directly to you. The project content is never uploaded.",
              "There is no account database. Because nothing is sent to us, there is nothing for us to lose, leak, or be hacked for.",
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
            How to verify a Roblox tool is safe
          </h2>
          <p className="text-ink-dim leading-relaxed mb-3">
            &ldquo;Roblox GUI maker&rdquo; tools are a known vector for account
            theft. Whatever tool you are evaluating &mdash; ours or anyone
            else's &mdash; the same warning signs apply:
          </p>
          <div className="rounded-xl border border-line bg-panel p-5 mb-3">
            <p className="text-sm font-semibold text-ink mb-2">
              <span className="text-red-400">⚠</span> Treat a tool as unsafe if
              it:
            </p>
            <ul className="space-y-1.5 text-sm text-ink-dim">
              {[
                "Asks for your Roblox username and password.",
                "Tells you to paste your .ROBLOSECURITY cookie, or to run a script that reads it.",
                "Asks you to download and run a .exe, .scr, or browser extension to &ldquo;import&rdquo; or &ldquo;test&rdquo; your GUI.",
                "Has no source code you can inspect and no explanation of how it works.",
              ].map((t) => (
                <li key={t} className="flex gap-2.5">
                  <span className="text-red-400 mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-red-400" />
                  <span className="leading-relaxed">{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-focus bg-panel p-5 ring-1 ring-focus/30">
            <p className="text-sm font-semibold text-ink mb-2">
              <span className="text-focus">✓</span> A tool is likely safe if it:
            </p>
            <ul className="space-y-1.5 text-sm text-ink-dim">
              {[
                "Runs in the browser with no install and no login.",
                "Exports readable source code (Luau) you can review before using.",
                "Has a public source repository you can audit.",
                "Only connects to the Roblox APIs it strictly needs (and explains why).",
              ].map((t) => (
                <li key={t} className="flex gap-2.5">
                  <span className="text-focus mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-focus" />
                  <span className="leading-relaxed">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-ink mb-3">
            What about the Luau the tool exports?
          </h2>
          <p className="text-ink-dim leading-relaxed">
            The exported Luau is plain source code that creates Roblox UI
            instances (<code className="text-focus">Instance.new</code>,{" "}
            <code className="text-focus">UDim2.new</code>) and wires button
            clicks. It does not contain anything that reads your account, your
            inventory, or your Robux balance. You should still{" "}
            <span className="font-medium text-ink">read it before pasting it into
            Studio</span>{" "}
            &mdash; the same way you'd read any code from the internet &mdash;
            and you remain responsible for adding server-side validation for any
            RemoteEvent, purchase, or admin action. See our{" "}
            <Link href="/terms" className="text-focus hover:underline">
              Terms of Service
            </Link>{" "}
            for the full responsibility scope.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-ink mb-3">
            If something looks off
          </h2>
          <p className="text-ink-dim leading-relaxed">
            If you see behavior you do not understand or that contradicts this
            page, do not use the tool and{" "}
            <a
              href="https://github.com/firstdraft-work/roblox-gui-maker/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="text-focus hover:underline"
            >
              report it on GitHub
            </a>{" "}
            so it can be investigated. Full details on data handling are in our{" "}
            <Link href="/privacy" className="text-focus hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </section>

        <div className="rounded-xl bg-panel border border-line p-6 flex flex-wrap items-center justify-between gap-4 mb-12">
          <p className="text-ink-dim">
            Ready to build a GUI? It is free, runs in your browser, and asks for
            nothing.
          </p>
          <Link
            href="/editor"
            className="px-5 py-2.5 rounded-lg font-semibold bg-primary text-on-primary hover:brightness-110 transition"
          >
            Launch the Editor →
          </Link>
        </div>

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
