import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "../components/SiteNav";
import { SiteFooter } from "../components/SiteFooter";

const PAGE_URL = "https://robloxguimaker.app/studio-plugin";
const ZH_URL = "https://robloxguimaker.app/zh/studio-plugin";

export const metadata: Metadata = {
  title: "Roblox GUI Maker Offline Studio Plugin — Zero-Permission Paste Sync (.lua)",
  description:
    "Download the open-source, 100% offline Roblox Studio companion plugin for robloxguimaker.app. Paste v1 scene JSON from the web editor to build native ScreenGui instances with full Undo support—zero HTTP permissions needed.",
  keywords: [
    "roblox gui maker studio plugin",
    "roblox studio offline gui plugin",
    "roblox gui json importer",
    "roblox studio companion plugin lua",
  ],
  alternates: {
    canonical: "/studio-plugin",
    languages: {
      en: PAGE_URL,
      zh: ZH_URL,
      "x-default": PAGE_URL,
    },
  },
  openGraph: {
    title: "Roblox GUI Maker Offline Studio Plugin (.lua)",
    description:
      "Install in Roblox Studio's local Plugins folder and paste v1 JSON from /editor to materialize ScreenGui trees with ChangeHistoryService Undo.",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    q: "Why does this Studio plugin work 100% offline instead of polling a local server?",
    a: "Plugins that ask for HttpService network permissions or external require() calls often trigger security warnings. By copying v1 JSON from our web editor and pasting directly into the Studio DockWidget, zero network permissions are required and the entire source stays transparent in one single .lua file.",
  },
  {
    q: "Which Roblox GUI instances and decorators does RobloxGuiMakerSync.lua recreate?",
    a: "It rebuilds ScreenGui scenes containing Frame, TextLabel, TextButton, ImageLabel, ImageButton, TextBox, and ScrollingFrame, along with UICorner, UIStroke, UIGradient, UIListLayout, UIGridLayout, UIPadding, UIAspectRatioConstraint, and UISizeConstraint.",
  },
  {
    q: "Can I undo an imported GUI inside Roblox Studio?",
    a: "Yes. Every import is wrapped in ChangeHistoryService:SetWaypoint() so pressing Ctrl+Z / Cmd+Z cleanly reverts the imported ScreenGui.",
  },
  {
    q: "Where do I put RobloxGuiMakerSync.lua on Windows and macOS?",
    a: "On Windows, place the file in %LOCALAPPDATA%\\Roblox\\Plugins. On macOS, place it in ~/Documents/Roblox/Plugins (or open Plugins → Plugins Folder inside Studio). Then restart Studio or reload local plugins.",
  },
];

const SCHEMA_GRAPH = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Roblox GUI Maker Studio Sync Plugin",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Windows, macOS (Roblox Studio)",
      url: PAGE_URL,
      downloadUrl: "https://robloxguimaker.app/studio-plugin/RobloxGuiMakerSync.lua",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description:
        "Zero-permission offline Roblox Studio plugin that turns v1 JSON from robloxguimaker.app/editor into native ScreenGui hierarchies.",
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

export default function StudioPluginPage() {
  return (
    <>
      <SiteNav />
      <main className="max-w-5xl mx-auto px-6 py-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA_GRAPH) }}
        />

        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3 py-1 text-xs font-mono text-success mb-4">
            100% Offline • Zero Network / Require() Calls
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink mb-3">
            Roblox Studio Offline Sync Plugin
          </h1>
          <p className="text-base text-ink-dim max-w-2xl leading-relaxed">
            Sync any scene designed in{" "}
            <Link href="/editor" className="text-focus hover:underline">
              /editor
            </Link>{" "}
            straight into Roblox Studio with a single clipboard paste—rebuilding native{" "}
            <span className="font-mono text-ink">ScreenGui</span>, frames, buttons, decorators,
            and <span className="font-mono text-ink">ChangeHistoryService</span> Undo waypoints.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/studio-plugin/RobloxGuiMakerSync.lua"
              download="RobloxGuiMakerSync.lua"
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-on-primary hover:opacity-90"
            >
              Download RobloxGuiMakerSync.lua (Free)
            </a>
            <Link
              href="/editor"
              className="rounded-lg border border-line bg-panel px-5 py-2.5 text-sm font-medium text-ink hover:bg-raised"
            >
              Open GUI Builder →
            </Link>
          </div>
        </div>

        <section className="rounded-xl border border-line bg-panel p-6 mb-10">
          <h2 className="text-xl font-semibold text-ink mb-4">
            Install in 60 seconds (Windows &amp; macOS)
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-ink-dim">
            <div className="space-y-3">
              <div>
                <p className="font-medium text-ink mb-1">1. Open your Studio Plugins folder</p>
                <p>
                  In Roblox Studio, open the <span className="text-ink">Plugins</span> tab and
                  click <span className="text-ink">Plugins Folder</span>, or navigate manually:
                </p>
              </div>
              <div className="rounded-lg border border-line bg-base p-3 font-mono text-xs text-ink space-y-1.5">
                <p>
                  <span className="text-ink-mute">Windows:</span> %LOCALAPPDATA%\Roblox\Plugins
                </p>
                <p>
                  <span className="text-ink-mute">macOS:</span> ~/Documents/Roblox/Plugins
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="font-medium text-ink mb-1">2. Copy Plugin JSON &amp; Import</p>
                <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
                  <li>
                    Drop <span className="font-mono text-ink">RobloxGuiMakerSync.lua</span> into
                    that folder and restart Roblox Studio (or right-click plugin → Reload).
                  </li>
                  <li>
                    In the web{" "}
                    <Link href="/editor" className="text-focus hover:underline">
                      GUI Builder
                    </Link>
                    , click <span className="font-mono text-ink">Copy Plugin JSON</span> in the Code
                    Panel.
                  </li>
                  <li>
                    Click <span className="font-mono text-ink">Import GUI</span> on the Studio
                    toolbar, paste the JSON, pick <span className="text-ink">StarterGui</span> or{" "}
                    <span className="text-ink">Selected Instance</span>, and hit Import.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-4 mb-10">
          <div className="rounded-xl border border-line bg-panel p-5">
            <h3 className="text-sm font-semibold text-ink mb-2">Security &amp; Creator Store Ready</h3>
            <p className="text-sm text-ink-dim leading-relaxed">
              Contains zero <span className="font-mono text-ink">HttpService:RequestAsync</span>,{" "}
              <span className="font-mono text-ink">GetAsync</span>, or external{" "}
              <span className="font-mono text-ink">require(id)</span> calls—only local JSON
              decoding via <span className="font-mono text-ink">HttpService:JSONDecode</span>.
            </p>
          </div>
          <div className="rounded-xl border border-line bg-panel p-5">
            <h3 className="text-sm font-semibold text-ink mb-2">7 UI Classes + 8 Decorators</h3>
            <p className="text-sm text-ink-dim leading-relaxed">
              Full fidelity mapping for Frame, TextLabel, TextButton, ImageLabel, ImageButton,
              TextBox, ScrollingFrame, UICorner, UIStroke, UIGradient, layouts, and constraints.
            </p>
          </div>
          <div className="rounded-xl border border-line bg-panel p-5">
            <h3 className="text-sm font-semibold text-ink mb-2">Need Direct .rbxmx Files?</h3>
            <p className="text-sm text-ink-dim leading-relaxed">
              Prefer drag-and-drop binary/XML Studio models without installing any plugin? Upgrade
              to{" "}
              <Link href="/pricing" className="text-focus hover:underline">
                Studio Pro
              </Link>{" "}
              for instant <span className="font-mono text-ink">.rbxmx</span> export and 10× AI quota.
            </p>
          </div>
        </section>

        <section className="pt-8 border-t border-line">
          <h2 className="text-2xl font-semibold text-ink mb-6">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {FAQ_ITEMS.map((item) => (
              <div key={item.q} className="rounded-xl border border-line bg-panel p-5">
                <h3 className="text-sm font-semibold text-ink mb-2">{item.q}</h3>
                <p className="text-sm text-ink-dim leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
