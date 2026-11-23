import Link from "next/link";
import { SceneThumb } from "./SceneThumb";
import type { Kit } from "../editor/kits";
import { templatePreviewSrc } from "../editor/preview-images";
import { getTheme } from "../editor/themes";
import type { Locale } from "../i18n";

// A kit card: screenshot of its cover screen (recolored with the kit theme)
// plus name, theme swatch, and tagline. Used on the kits gallery and the homepage.
// locale="en" (default) keeps the original English output.
export function KitCard({ kit, locale = "en" }: { kit: Kit; locale?: Locale }) {
  const zh = locale === "zh";
  const coverRole = kit.screens.find((s) => s.template === kit.cover)?.role;
  const theme = getTheme(kit.theme);
  return (
    <Link
      href={zh ? `/zh/kits/${kit.slug}` : `/kits/${kit.slug}`}
      className="group rounded-xl overflow-hidden ring-1 ring-line hover:ring-focus transition"
    >
      <SceneThumb
        src={templatePreviewSrc(kit.cover, kit.theme)}
        alt={
          zh
            ? `${kit.name}:${coverRole ?? ""}界面预览`
            : `${kit.name}: ${coverRole ?? "cover"} screen preview`
        }
      />
      <div className="p-4 bg-panel">
        <div className="flex items-center justify-between gap-3 mb-1">
          <p className="text-base font-semibold text-ink">{kit.name}</p>
          {theme && (
            <span className="inline-flex items-center gap-1.5 text-xs text-ink-mute">
              <span
                className="w-3 h-3 rounded-full ring-1 ring-line"
                style={{ backgroundColor: theme.primary }}
                aria-hidden
              />
              {kit.theme}
            </span>
          )}
        </div>
        <p className="text-sm text-ink-dim">{kit.tagline}</p>
        <p className="text-xs text-ink-mute mt-2">
          {zh
            ? `${kit.screens.length} 个配套界面 →`
            : `${kit.screens.length} cohesive screens →`}
        </p>
      </div>
    </Link>
  );
}
