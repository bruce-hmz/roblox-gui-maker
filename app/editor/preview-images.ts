// Static thumbnail screenshots of scenes, captured from the real editor canvas
// by scripts/capture-previews.mjs. They live under /gallery/ because that path
// is routed to the Next.js Worker in production; GeFeiSites-served pages
// reference them by absolute path.

export const PREVIEW_DIR = "/gallery/previews";

// Pixel size of every capture: the editor's 860px desktop frame at 1.5x.
export const PREVIEW_WIDTH = 1290;
export const PREVIEW_HEIGHT = 726;

export function templatePreviewSrc(slug: string, theme?: string): string {
  return `${PREVIEW_DIR}/template-${slug}${theme ? `--${theme}` : ""}.webp`;
}

export function examplePreviewSrc(slug: string): string {
  return `${PREVIEW_DIR}/example-${slug}.webp`;
}
