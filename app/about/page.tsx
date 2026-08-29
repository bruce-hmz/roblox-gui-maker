import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "../components/SiteNav";
import { SiteFooter } from "../components/SiteFooter";

export const metadata: Metadata = {
  title: "About — Roblox GUI Maker",
  description:
    "Roblox GUI Maker is a free, browser-based visual builder for Roblox game GUIs. Why it exists, how it works, and what's under the hood.",
  openGraph: {
    title: "About — Roblox GUI Maker",
    description:
      "Roblox GUI Maker is a free, browser-based visual builder for Roblox game GUIs. Why it exists, how it works, and what's under the hood.",
    url: "https://robloxguimaker.app/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "About — Roblox GUI Maker",
    description:
      "Roblox GUI Maker is a free, browser-based visual builder for Roblox game GUIs.",
  },
  alternates: {
    canonical: "/about",
    languages: {
      en: "https://robloxguimaker.app/about",
      zh: "https://robloxguimaker.app/zh/about",
    },
  },
};

const FEATURES = [
  "Drag and drop ScreenGui, Frame, TextButton, TextLabel, TextBox, ImageLabel and ScrollingFrame onto a desktop, tablet or mobile canvas, and resize from any corner.",
  "Nest containers and reparent by dragging, reorder siblings, and auto-arrange children with UIListLayout and UIGridLayout.",
  "Round corners and add gradients (UICorner, UIGradient), inset content with UIPadding, and constrain sizing responsively with anchor and min/max size.",
  "Wire a button to show, hide or toggle a panel, then preview the result before exporting.",
  "Edit every property by its real Roblox name — BackgroundColor3, BackgroundTransparency, Font, TextSize, ZIndex.",
  "Undo/redo, duplicate, keyboard shortcuts, and autosave to your browser — no account, no login.",
  "Start from a template (main menu, shop, settings, inventory, loading screen, leaderboard) or a written guide.",
];

export default function AboutPage() {
  return (
    <>
      <SiteNav />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-5">
          About Roblox GUI Maker
        </h1>
        <p className="text-lg text-ink-dim leading-relaxed mb-12">
          Roblox GUI Maker is a free, browser-based visual builder for Roblox
          game interfaces. You design with drag-and-drop, wire up interactive
          buttons, and export clean Luau that runs the moment you paste it into
          Studio — no login required.
        </p>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-ink mb-3">Why it exists</h2>
          <p className="text-ink-dim leading-relaxed">
            Building a Roblox GUI by hand means nudging UDim2 offsets, rebuilding
            the same menu patterns every project, and fighting the parts of
            Studio that developers complain about most. Roblox GUI Maker replaces
            that grind with a visual editor that keeps you in control: you stay
            precise, the tool handles the busywork, and the output is code you
            would have written yourself.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-ink mb-3">
            What makes it different
          </h2>
          <p className="text-ink-dim leading-relaxed">
            Most &ldquo;AI makes your GUI&rdquo; tools spit out placeholder
            layouts you then have to clean up. This is the opposite: a precise
            canvas where the exported Luau is clean enough to ship. It recreates
            your GUI with real <code className="text-focus">Instance.new</code>{" "}
            calls and <code className="text-focus">UDim2.new</code>{" "}
            positioning — and if you wired a button to open a panel, the export
            includes that{" "}
            <code className="text-focus">.Activated:Connect</code> handler too.
            Paste it into a LocalScript and it just works.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-ink mb-3">What you can do</h2>
          <ul className="space-y-2 text-ink-dim">
            {FEATURES.map((f) => (
              <li key={f} className="flex gap-2.5">
                <span className="text-focus mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-focus" />
                <span className="leading-relaxed">{f}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-ink mb-3">How it works</h2>
          <p className="text-ink-dim leading-relaxed">
            The editor runs entirely in your browser. There&rsquo;s no account
            and your designs aren&rsquo;t sent to a server — they live in your
            browser&rsquo;s local storage. The only third-party service is
            privacy-respecting aggregate analytics that measures traffic, never
            your designs. It&rsquo;s built with Next.js and deploys as static
            pages.
          </p>
        </section>

        <div className="rounded-xl bg-panel border border-line p-6 flex flex-wrap items-center justify-between gap-4 mb-12">
          <p className="text-ink-dim">
            Ready to build a GUI? It&rsquo;s free and there&rsquo;s nothing to
            install.
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
            is a trademark of Roblox Corporation. All references to Roblox
            classes and APIs (ScreenGui, UIListLayout, UDim2, and so on) are
            properties of the Roblox platform.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
