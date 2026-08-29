import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav } from "../../components/SiteNav";
import { SiteFooter } from "../../components/SiteFooter";
import { ScenePreview } from "../../editor/ScenePreview";
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
  return {
    title: `${kit.name} — Free Roblox Game UI Kit | Roblox GUI Maker`,
    description: kit.description,
    alternates: {
      canonical: `/kits/${slug}`,
      languages: {
        en: `https://robloxguimaker.app/kits/${slug}`,
        zh: `https://robloxguimaker.app/zh/kits/${slug}`,
      },
    },
    openGraph: {
      title: `${kit.name} — Free Roblox Game UI Kit`,
      description: kit.description,
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

  return (
    <>
      <SiteNav />
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
                  <ScenePreview scene={scene} />
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
      </main>
      <SiteFooter />
    </>
  );
}
