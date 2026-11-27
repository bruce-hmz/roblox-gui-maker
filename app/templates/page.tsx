import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "../components/SiteNav";
import { SiteFooter } from "../components/SiteFooter";
import { SceneThumb } from "../components/SceneThumb";
import { templatePreviewSrc } from "../editor/preview-images";
import { TEMPLATES, CATEGORIES } from "../editor/templates";

export const metadata: Metadata = {
  title: "Free Roblox GUI Templates — Menus, Shops and HUDs",
  description:
    "Free Roblox GUI templates for menus, shops, settings, inventory and leaderboards. Customize responsive layouts and export Luau, JSON, or ZIP.",
  openGraph: {
    title: "Free Roblox GUI Templates — Menus, Shops and HUDs",
    description:
      "Free Roblox GUI templates for menus, shops, settings, inventory, loading screens and leaderboards. Customize and export Luau for Roblox Studio.",
    url: "https://robloxguimaker.app/templates",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Roblox GUI Templates — Menus, Shops and HUDs",
    description:
      "Free Roblox GUI templates for menus, shops, settings, inventory, loading screens and leaderboards.",
  },
  alternates: {
    canonical: "/templates",
    languages: {
      en: "https://robloxguimaker.app/templates",
      zh: "https://robloxguimaker.app/zh/templates",
    },
  },
};

const TEMPLATE_FAQS = [
  {
    q: "Are these Roblox GUI templates really free to edit and export?",
    a: "Yes. Every screen in the gallery opens directly in our browser editor with zero login required. You can edit colors, fonts, layout constraints, and export clean client and server Luau code or editable JSON free forever.",
  },
  {
    q: "Do these templates scale cleanly across 1080p desktop, tablet, and phone screens?",
    a: "Yes. Each layout combines normalized UDim2 Scale positioning, AnchorPoint centering, and layout objects (UIListLayout, UIGridLayout, UIPadding) so panels remain centered and readable across viewports.",
  },
  {
    q: "What is the difference between a single template and a 5-Screen UI Kit?",
    a: "A template is a single focused screen such as a Coin Shop or Daily Rewards modal. A UI Kit combines five screens matched to one genre theme with a wired KitScreenSwitcher controller and matching 512x512 Gamepass icons.",
  },
  {
    q: "Can I export templates as native Roblox Studio .rbxmx files instead of .lua scripts?",
    a: "Yes. While Instance.new Luau scripts stay free forever, upgrading once on Pricing lets you export native XML .rbxmx hierarchies directly into StarterGui without installing plugins.",
  },
  {
    q: "How do button actions like Show, Hide, Toggle, and RemoteEvent export?",
    a: "Configured GUI navigation actions compile into clean Activated connections inside the LocalScript, while RemoteEvent and Teleport actions also generate matching ServerScriptService boilerplate.",
  },
  {
    q: "Can I recolor an entire Roblox GUI template to match my game branding?",
    a: "Yes. Switch themes inside the editor toolbar or customize BackgroundColor3, UICorner radius, UIStroke thickness, and UIGradient stops per node.",
  },
];

const templatesFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: TEMPLATE_FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function TemplatesPage() {
  return (
    <>
      <SiteNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(templatesFaqSchema).replace(/</g, "\\u003c"),
        }}
      />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Free Roblox GUI Templates
        </h1>
        <p className="text-ink-dim max-w-2xl mb-10">
          Ready-made Roblox interfaces you can open in the editor, customize, and
          export as clean Luau. Every template is built from real Roblox
          instances and layouts.
        </p>

        {CATEGORIES.map((cat) => {
          const items = TEMPLATES.filter((t) => t.category === cat);
          if (items.length === 0) return null;
          return (
            <section key={cat} className="mb-12">
              <h2 className="text-xl font-semibold mb-4">{cat}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((t) => (
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
          );
        })}

        <section className="mx-auto mt-16 max-w-3xl space-y-4 text-ink-dim leading-relaxed">
          <h2 className="text-2xl font-semibold text-ink">
            How to choose a Roblox GUI template
          </h2>
          <p>
            Start with the screen that matches the player&rsquo;s immediate task,
            not only the closest color scheme. A main menu needs one dominant
            action and a clear route to settings. A shop needs room for real
            item names, prices, and server-validated purchase states. An
            inventory needs a hierarchy that can grow without hiding the
            selected item or equip action.
          </p>
          <p>
            Open the template in the editor and replace every placeholder with
            realistic game text. Check the hierarchy, rename important panels
            and buttons, then review desktop, tablet, and mobile sizes before
            polishing details. The guide on{" "}
            <Link
              href="/guides/how-to-make-a-gui-in-roblox"
              className="font-medium text-focus hover:underline"
            >
              How to make a GUI in Roblox
            </Link>{" "}
            walks through that complete workflow.
          </p>
        </section>

        <section className="mx-auto mt-12 max-w-3xl space-y-4 text-ink-dim leading-relaxed">
          <h2 className="text-2xl font-semibold text-ink">
            Customize, preview, and export
          </h2>
          <p>
            Templates use the same responsive geometry and interaction tools as
            a project built from scratch. Combine scale and offset, set anchors
            and constraints, and preview show, hide, toggle, RemoteEvent, or
            Teleport actions before export.
          </p>
          <p>
            Download client Luau for the interface, optional server Luau for
            configured server-backed actions, JSON for future editing, or a ZIP
            package containing the project files and placement instructions.
            Read{" "}
            <Link
              href="/guides/roblox-gui-script-generator"
              className="font-medium text-focus hover:underline"
            >
              Understand generated Roblox GUI scripts
            </Link>{" "}
            for the exact output and security boundaries,{" "}
            <Link
              href="/guides/how-to-import-rbxmx-into-roblox-studio"
              className="font-medium text-focus hover:underline"
            >
              How to import .rbxmx into Roblox Studio
            </Link>{" "}
            for drag-and-drop native models, or pair your shop screen with{" "}
            <Link
              href="/gamepass-icon-maker"
              className="font-medium text-focus hover:underline"
            >
              512×512 Gamepass icons
            </Link>
            .
          </p>
        </section>

        <section className="mt-14 pt-10 border-t border-line space-y-4">
          <div className="max-w-3xl space-y-2">
            <h2 className="text-2xl font-semibold text-ink">
              Complete Roblox GUI Templates Directory &amp; Spec Comparison
            </h2>
            <p className="text-sm text-ink-dim leading-relaxed">
              Browse every free layout below before opening the{" "}
              <Link href="/editor" className="text-focus hover:underline">
                Roblox GUI Editor
              </Link>
              . Each preset uses native Roblox instances (<code className="text-ink">ScreenGui</code>,{" "}
              <code className="text-ink">Frame</code>, <code className="text-ink">TextButton</code>,{" "}
              <code className="text-ink">ScrollingFrame</code>, and UI constraints) so exported
              Luau behaves identically inside Roblox Studio.
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-line bg-panel">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-line bg-panel-raised uppercase tracking-wider text-ink-mute">
                <tr>
                  <th className="px-4 py-3">Template</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Nodes</th>
                  <th className="px-4 py-3">Use Case Summary</th>
                  <th className="px-4 py-3">Open</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-ink-dim">
                {TEMPLATES.map((t) => (
                  <tr key={t.slug} className="hover:bg-raised/40">
                    <td className="px-4 py-2.5 font-semibold text-ink">
                      <Link href={`/templates/${t.slug}`} className="hover:text-focus hover:underline">
                        {t.title}
                      </Link>
                    </td>
                    <td className="px-4 py-2.5">{t.category}</td>
                    <td className="px-4 py-2.5 font-mono text-ink">{t.scene.length}</td>
                    <td className="px-4 py-2.5">{t.tagline}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <Link
                        href={`/editor?template=${t.slug}`}
                        className="font-medium text-focus hover:underline"
                      >
                        Edit →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-4xl rounded-2xl border border-line bg-panel p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <h2 className="text-xl font-semibold text-ink">
                Single Free Templates vs. 5-Screen Genre UI Kits
              </h2>
              <p className="text-sm text-ink-dim leading-relaxed">
                Single <strong>Roblox GUI templates</strong> are ideal when you need one polished
                menu, inventory grid, or redeem modal right away. When launching a complete
                Simulator, RPG, Tycoon, RNG roller, Obby, or Tower Defense experience, our{" "}
                <Link href="/kits" className="text-focus hover:underline">
                  5-Screen UI Kits
                </Link>{" "}
                bundle five screens in one cohesive palette plus native{" "}
                <code className="text-ink">.rbxmx</code> Studio files and 512×512 Gamepass icons.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2.5">
              <Link
                href="/kits"
                className="rounded-lg border border-line bg-raised px-4 py-2 text-xs font-semibold text-ink hover:bg-raised-hi"
              >
                Explore 6 UI Kits
              </Link>
              <Link
                href="/pricing"
                className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-on-primary hover:brightness-110"
              >
                Unlock .rbxmx Export →
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-4xl grid gap-6 md:grid-cols-2 text-sm text-ink-dim leading-relaxed">
          <div className="rounded-xl border border-line bg-panel p-5 space-y-2.5">
            <h2 className="text-lg font-semibold text-ink">
              Responsive UDim2 Architecture Across Desktop, Tablet &amp; Mobile
            </h2>
            <p>
              Hand-built Roblox screens frequently break when a desktop developer uses pixel Offsets
              on a 1920×1080 monitor and opens the place on an iPhone screen. Every preset in our{" "}
              <strong>Roblox GUI templates</strong> library relies on proportional{" "}
              <code className="text-ink">UDim2.fromScale</code> coordinates paired with center or
              edge <code className="text-ink">AnchorPoint</code> alignment.
            </p>
            <p>
              Grid shops, badge shelves, and quest logs organize children with native{" "}
              <code className="text-ink">UIListLayout</code>,{" "}
              <code className="text-ink">UIGridLayout</code>, and{" "}
              <code className="text-ink">UIPadding</code> rather than brittle hardcoded coordinates.
              Adding a seventh item to your shop or inventory requires duplicating a button node in
              the editor—never recalculating positions manually. Need to convert custom Figma pixel
              measurements alongside a template? Open our{" "}
              <Link href="/roblox-ui-sizer" className="text-focus hover:underline">
                UDim2 UI Sizer
              </Link>
              .
            </p>
          </div>

          <div className="rounded-xl border border-line bg-panel p-5 space-y-2.5">
            <h2 className="text-lg font-semibold text-ink">
              Studio Pre-Flight Checklist Before Publishing Your UI
            </h2>
            <p>
              After picking a preset from these <strong>free Roblox GUI templates</strong>, run
              this fast four-step production pass before deploying to live players:
            </p>
            <ol className="list-decimal pl-5 space-y-1.5">
              <li>
                Toggle <code className="text-ink">Desktop</code>, <code className="text-ink">Tablet</code>,
                and <code className="text-ink">Mobile</code> inside the editor toolbar to confirm
                buttons stay comfortable to tap on narrow phones.
              </li>
              <li>
                Set <code className="text-ink">ResetOnSpawn = false</code> on persistent HUD, Coin
                Counter, and Toolbar ScreenGuis so player panels stay stable across respawns.
              </li>
              <li>
                Verify server ownership checks inside <code className="text-ink">ServerScriptService</code>{" "}
                whenever wiring shop purchases, code redemptions, or RemoteEvents.
              </li>
              <li>
                Pair storefronts and reward panels with{" "}
                <Link href="/gamepass-icon-maker" className="text-focus hover:underline">
                  512×512 Gamepass badges
                </Link>{" "}
                and high-contrast{" "}
                <Link href="/roblox-thumbnail-maker" className="text-focus hover:underline">
                  1920×1080 thumbnails
                </Link>
                .
              </li>
            </ol>
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-4xl space-y-6 text-sm text-ink-dim leading-relaxed">
          <h2 className="text-2xl font-semibold text-ink">
            Roblox GUI Templates FAQ
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {TEMPLATE_FAQS.map((item) => (
              <div
                key={item.q}
                className="rounded-xl border border-line bg-panel p-5"
              >
                <h3 className="font-semibold text-ink">{item.q}</h3>
                <p className="mt-1.5">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
