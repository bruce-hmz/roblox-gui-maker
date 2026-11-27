import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav } from "../../components/SiteNav";
import { SiteFooter } from "../../components/SiteFooter";
import { KitProDownloadCard } from "../../components/KitProDownloadCard";
import { SceneThumb } from "../../components/SceneThumb";
import { templatePreviewSrc } from "../../editor/preview-images";
import {
  kitGamepassIcons,
  renderGamepassIconSvg,
} from "../../editor/gamepass-icons";
import { KITS, getKit, kitScene } from "../../editor/kits";
import { getTheme } from "../../editor/themes";

export function generateStaticParams() {
  return KITS.map((k) => ({ slug: k.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const kit = getKit(slug);
  if (!kit) return { title: "UI Kit not found" };
  const title = kit.metaTitle ?? `${kit.name} — Free Roblox GUI Pack`;
  const description = kit.metaDescription ?? kit.description;
  return {
    title,
    description,
    alternates: {
      canonical: `/kits/${slug}`,
      languages: {
        en: `https://robloxguimaker.app/kits/${slug}`,
        zh: `https://robloxguimaker.app/zh/kits/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `https://robloxguimaker.app/kits/${slug}`,
    },
  };
}

export default async function KitDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const kit = getKit(slug);
  if (!kit) notFound();
  const theme = getTheme(kit.theme);
  const badgePreviews = kitGamepassIcons(kit.slug).map((icon) => ({
    id: icon.id,
    titleTop: icon.titleTop,
    ...(icon.titleBottom ? { titleBottom: icon.titleBottom } : {}),
    svgMarkup: renderGamepassIconSvg(icon),
  }));

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://robloxguimaker.app" },
      { "@type": "ListItem", position: 2, name: "UI Kits", item: "https://robloxguimaker.app/kits" },
      { "@type": "ListItem", position: 3, name: kit.name, item: `https://robloxguimaker.app/kits/${slug}` },
    ],
  };

  const kitFaqs = [
    {
      q: `How do I import the ${kit.name} into Roblox Studio?`,
      a: `Right-click StarterGui in Roblox Studio Explorer, choose Insert from File..., and select ${kit.slug}-complete.rbxmx from the kit download (or import individual screens/${kit.slug} screens from screens/*.rbxmx). Move server/${kit.slug}.server.lua into ServerScriptService and press Play.`,
    },
    {
      q: `Can I customize ${kit.name} screens for free in the editor?`,
      a: `Yes. Every one of the ${kit.screens.length} screens in ${kit.name} opens in the visual editor pre-themed in ${kit.theme} so you can edit text, tweak colors, and copy free client/server Luau code without signing up.`,
    },
    {
      q: `What icons and scripts ship with ${kit.name}?`,
      a: `Alongside the .rbxmx ScreenGuis and Luau scripts, the Pro ZIP includes 6 matched 512x512 Gamepass and shop badge icons tailored to the ${kit.theme} theme plus a pre-wired KitScreenSwitcher controller.`,
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: kitFaqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <SiteNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
        }}
      />
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* hero */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <Link
              href="/kits"
              className="text-sm text-focus hover:underline font-medium"
            >
              ← All kits
            </Link>
            {theme && (
              <span className="inline-flex items-center gap-1.5 text-xs text-ink-mute px-2 py-1 rounded-full bg-panel border border-line">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: theme.primary }}
                  aria-hidden
                />
                {kit.theme} theme
              </span>
            )}
            <span className="text-xs text-ink-mute">
              {kit.screens.length} cohesive screens
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            {kit.name}
          </h1>
          <p className="text-ink-dim max-w-2xl mb-6">{kit.description}</p>
          <Link
            href={`/editor?template=${kit.screens[0].template}&theme=${kit.theme}`}
            className="inline-flex px-6 py-3 rounded-lg font-semibold bg-primary text-on-primary hover:brightness-110 transition"
          >
            Open this kit in the editor →
          </Link>
        </div>

        <KitProDownloadCard
          kitSlug={kit.slug}
          kitName={kit.name}
          screenCount={kit.screens.length}
          icons={badgePreviews}
          locale="en"
        />

        {/* screens, recolored with the shared theme */}
        <div className="space-y-8">
          {kit.screens.map((screen) => {
            const scene = kitScene(kit, screen.template);
            if (!scene) return null;
            return (
              <section key={screen.template}>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <h2 className="text-lg font-semibold text-ink">
                    {screen.role}
                  </h2>
                  <Link
                    href={`/editor?template=${screen.template}&theme=${kit.theme}`}
                    className="text-sm text-focus hover:underline font-medium"
                  >
                    Open {screen.role} in editor →
                  </Link>
                </div>
                <div className="rounded-2xl ring-1 ring-line overflow-hidden shadow-xl shadow-black/40">
                  <SceneThumb
                    src={templatePreviewSrc(screen.template, kit.theme)}
                    alt={`${kit.name}: ${screen.role} screen preview`}
                  />
                </div>
              </section>
            );
          })}
        </div>

        <section className="mx-auto mt-16 max-w-3xl space-y-4 text-ink-dim leading-relaxed">
          <h2 className="text-2xl font-semibold text-ink">
            One theme, every screen
          </h2>
          <p>
            Every screen above uses the same {kit.theme} palette — the same panel
            tone, the same action color, the same text shades — so they feel like
            one game. That consistency is what separates a finished game UI from a
            pile of separate screens.
          </p>
          <p>
            Open any screen in the editor and it loads already themed. Tweak the
            text, add your own items, then export client Luau (and optional server
            Luau for purchase and reward actions) straight into Roblox Studio.
          </p>
        </section>

        <section className="mx-auto mt-12 max-w-3xl space-y-4 text-sm text-ink-dim leading-relaxed">
          <h2 className="text-2xl font-semibold text-ink">
            How to import {kit.name} into Roblox Studio
          </h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Download the kit Pro ZIP above (or open individual screens free in
              the editor to copy Luau).
            </li>
            <li>
              In Roblox Studio Explorer, right-click{" "}
              <strong className="text-ink">StarterGui</strong> →{" "}
              <strong className="text-ink">Insert from File...</strong> and pick{" "}
              <code className="text-ink">{kit.slug}-complete.rbxmx</code>.
            </li>
            <li>
              Place <code className="text-ink">server/{kit.slug}.server.lua</code>{" "}
              inside <strong className="text-ink">ServerScriptService</strong> and
              press <strong className="text-ink">Play</strong>. See our{" "}
              <Link
                href="/guides/how-to-import-rbxmx-into-roblox-studio"
                className="text-focus hover:underline"
              >
                Studio .rbxmx import guide
              </Link>{" "}
              if you need troubleshooting tips.
            </li>
          </ol>
        </section>

        <section className="mx-auto mt-12 max-w-3xl space-y-4 text-sm text-ink-dim leading-relaxed">
          <h2 className="text-2xl font-semibold text-ink">
            {kit.name} Frequently Asked Questions
          </h2>
          {kitFaqs.map((item) => (
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
