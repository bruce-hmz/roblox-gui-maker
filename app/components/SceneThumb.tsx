import { PREVIEW_HEIGHT, PREVIEW_WIDTH } from "../editor/preview-images";

// A scene thumbnail: a screenshot of the scene in the real editor canvas
// (see scripts/capture-previews.mjs). Same 16:9 frame as ScenePreview so card
// layouts don't shift. Pass `priority` for an above-the-fold image.
export function SceneThumb({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    // Plain <img>: GeFeiSites serves these pages as static HTML, so the
    // next/image optimizer URL would not resolve there.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={PREVIEW_WIDTH}
      height={PREVIEW_HEIGHT}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className="block w-full h-auto aspect-video object-cover rounded-xl bg-page ring-1 ring-line-soft"
    />
  );
}
