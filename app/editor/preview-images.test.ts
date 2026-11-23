import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { AI_EXAMPLES } from "./ai/examples";
import { KITS } from "./kits";
import {
  examplePreviewSrc,
  PREVIEW_HEIGHT,
  PREVIEW_WIDTH,
  templatePreviewSrc,
} from "./preview-images";
import { TEMPLATES } from "./templates";

const PUBLIC_DIR = join(__dirname, "..", "..", "public");

// Width/height of a WebP file (lossy VP8, lossless VP8L or extended VP8X).
function webpSize(buf: Buffer): { width: number; height: number } {
  expect(buf.toString("ascii", 0, 4)).toBe("RIFF");
  expect(buf.toString("ascii", 8, 12)).toBe("WEBP");
  const chunk = buf.toString("ascii", 12, 16);
  if (chunk === "VP8 ") {
    return {
      width: buf.readUInt16LE(26) & 0x3fff,
      height: buf.readUInt16LE(28) & 0x3fff,
    };
  }
  if (chunk === "VP8L") {
    const bits = buf.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  expect(chunk).toBe("VP8X");
  return { width: buf.readUIntLE(24, 3) + 1, height: buf.readUIntLE(27, 3) + 1 };
}

// Every scene the site shows as a thumbnail must have a capture; run
// `node scripts/capture-previews.mjs` against a local build to add one.
const expected = [
  ...TEMPLATES.map((t) => templatePreviewSrc(t.slug)),
  ...AI_EXAMPLES.map((e) => examplePreviewSrc(e.slug)),
  ...KITS.flatMap((k) => k.screens.map((s) => templatePreviewSrc(s.template, k.theme))),
];

describe("scene preview screenshots", () => {
  it.each([...new Set(expected)])("%s exists at the capture size", (src) => {
    const file = join(PUBLIC_DIR, src);
    expect(existsSync(file), `missing ${src} — run scripts/capture-previews.mjs`).toBe(true);
    expect(webpSize(readFileSync(file))).toEqual({
      width: PREVIEW_WIDTH,
      height: PREVIEW_HEIGHT,
    });
  });

  it("serves previews from a path routed to the Next.js Worker", () => {
    expect(templatePreviewSrc("shop")).toMatch(/^\/gallery\//);
  });

  it.each(KITS)("$slug cover is one of its own screens", (kit) => {
    expect(kit.screens.map((s) => s.template)).toContain(kit.cover);
  });

  it("gives every kit a different cover screen", () => {
    const covers = KITS.map((k) => k.cover);
    expect(new Set(covers).size).toBe(covers.length);
  });
});
