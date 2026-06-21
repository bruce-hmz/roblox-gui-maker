import { readFile } from "node:fs/promises";
import { expect, test, type Page } from "@playwright/test";

type FixtureNode = {
  id: string;
  cls: "ScreenGui" | "Frame" | "TextButton";
  name: string;
  parentId: string | null;
  pos: { x: number; y: number };
  size: { x: number; y: number };
  color: string;
  transparency: number;
  cornerRadius: number;
  zindex: number;
  layout?: "list";
  initialVisible?: boolean;
  text?: string;
  action?: { type: "show" | "hide" | "toggle"; targetId: string };
  motion?: {
    preset?: "fade" | "slide" | "scale";
    durationMs?: number;
    slideDirection?: "left" | "right" | "up" | "down";
    hover?: boolean;
  };
};

async function importScene(page: Page, scene: FixtureNode[]) {
  await page.goto("/editor?template=main-menu");
  await page.locator('input[type="file"][aria-label="Import JSON"]').setInputFiles({
    name: "motion-preview.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify({ format: "roblox-gui-maker", version: 2, scene })),
  });
}

function fixtureNode(
  id: string,
  name: string,
  parentId: string | null,
  overrides: Partial<FixtureNode> = {}
): FixtureNode {
  return {
    id,
    cls: "Frame",
    name,
    parentId,
    pos: { x: 0, y: 0 },
    size: { x: 0.5, y: 0.5 },
    color: "#15171f",
    transparency: 0,
    cornerRadius: 0,
    zindex: 1,
    ...overrides,
  };
}

async function selectHierarchyNode(page: Page, name: string) {
  await page.getByRole("button", { name: "Hierarchy" }).click();
  await page
    .getByRole("treeitem")
    .filter({ has: page.getByText(name, { exact: true }) })
    .click();
}

test("@full edits motion properties only for eligible nodes", async ({ page }) => {
  await page.goto("/editor?template=main-menu");
  await selectHierarchyNode(page, "Panel");

  const motion = page.getByRole("group", { name: "Motion" });
  await expect(motion).toBeVisible();
  const transition = motion.getByRole("combobox", { name: "Transition" });
  await expect(transition).toHaveValue("none");
  await expect(transition.locator("option")).toHaveText(["None", "Fade", "Slide", "Scale"]);
  await transition.selectOption("slide");
  await motion.getByRole("spinbutton", { name: "Motion duration" }).fill("320");
  await motion
    .getByRole("combobox", { name: "Slide direction" })
    .selectOption("right");
  await expect(transition).toHaveValue("slide");
  await expect(
    motion.getByRole("spinbutton", { name: "Motion duration" })
  ).toHaveValue("320");
  await transition.selectOption("none");
  await expect(motion.getByRole("spinbutton", { name: "Motion duration" })).toHaveCount(0);
  await expect(
    motion.getByRole("combobox", { name: "Slide direction" })
  ).toHaveCount(0);
  await transition.selectOption("slide");
  await expect(
    motion.getByRole("spinbutton", { name: "Motion duration" })
  ).toHaveValue("320");
  await expect(
    motion.getByRole("combobox", { name: "Slide direction" })
  ).toHaveValue("right");

  await selectHierarchyNode(page, "Play");
  await expect(
    page.getByRole("group", { name: "Motion" }).getByRole("checkbox", {
      name: "Hover scale",
    })
  ).toBeVisible();

  await selectHierarchyNode(page, "MainMenu");
  await expect(page.getByRole("group", { name: "Motion" })).toHaveCount(0);
});

test("@full hides motion controls for ambiguous duplicate node ids", async ({ page }) => {
  const scene: FixtureNode[] = [
    fixtureNode("root", "DuplicateRoot", null, {
      cls: "ScreenGui",
      size: { x: 1, y: 1 },
      transparency: 1,
      zindex: 0,
    }),
    fixtureNode("duplicate-motion", "DuplicateFade", "root", {
      motion: { preset: "fade", durationMs: 260 },
    }),
    fixtureNode("duplicate-motion", "DuplicateSlide", "root", {
      motion: { preset: "slide", durationMs: 420, slideDirection: "right" },
    }),
  ];

  await page.goto("/editor?template=main-menu");
  await page
    .locator('input[type="file"][aria-label="Import JSON"]')
    .setInputFiles({
      name: "duplicate-motion-ids.json",
      mimeType: "application/json",
      buffer: Buffer.from(
        JSON.stringify({ format: "roblox-gui-maker", version: 2, scene })
      ),
    });

  await selectHierarchyNode(page, "DuplicateFade");
  await expect(page.getByRole("group", { name: "Motion" })).toHaveCount(0);
});

test("@full shows resolved motion fallbacks while preserving stored values and invalid drafts", async ({
  page,
}, testInfo) => {
  const scene: FixtureNode[] = [
    fixtureNode("root", "MotionRoot", null, {
      cls: "ScreenGui",
      size: { x: 1, y: 1 },
      transparency: 1,
      zindex: 0,
    }),
    fixtureNode("fade-owner", "FadeOwner", "root", {
      motion: { preset: "fade", durationMs: 260 },
    }),
    fixtureNode("owned-list", "OwnedList", "fade-owner", { layout: "list" }),
    fixtureNode("combined-slide", "CombinedSlide", "owned-list", {
      motion: { preset: "slide", durationMs: 480, slideDirection: "down" },
    }),
    fixtureNode("plain-list", "PlainList", "root", { layout: "list" }),
    fixtureNode("layout-slide", "LayoutSlide", "plain-list", {
      motion: { preset: "slide", durationMs: 340, slideDirection: "right" },
    }),
    fixtureNode("nested-fade", "NestedFade", "fade-owner", {
      motion: { preset: "fade", durationMs: 310 },
    }),
  ];

  await page.goto("/editor?template=main-menu");
  await page
    .locator('input[type="file"][aria-label="Import JSON"]')
    .setInputFiles({
      name: "motion-conflicts.json",
      mimeType: "application/json",
      buffer: Buffer.from(
        JSON.stringify({ format: "roblox-gui-maker", version: 2, scene })
      ),
    });

  await selectHierarchyNode(page, "CombinedSlide");
  let motion = page.getByRole("group", { name: "Motion" });
  const transition = motion.getByRole("combobox", { name: "Transition" });
  await expect(transition).toHaveValue("slide");
  await expect(transition.locator('option[value="slide"]')).toBeDisabled();
  await expect(
    motion.getByRole("combobox", { name: "Slide direction" })
  ).toHaveValue("down");
  const duration = motion.getByRole("spinbutton", { name: "Motion duration" });
  await expect(duration).toHaveValue("480");
  await expect(
    motion.getByText("Slide uses Scale: layout fallback Fade is owned by an ancestor.")
  ).toBeVisible();

  for (const draft of ["", "abc", "99", "2001"]) {
    await duration.fill(draft);
    await expect(duration).toHaveValue(draft);
    await page.waitForTimeout(650);
    await expect
      .poll(() =>
        page.evaluate(() =>
          JSON.parse(window.localStorage.getItem("rgm:scene:v1") ?? "{}")
            .scene?.find((node: { id?: string }) => node.id === "combined-slide")
            ?.motion?.durationMs
        )
      )
      .toBe(480);
  }

  const exportPath = testInfo.outputPath("motion-conflicts-export.json");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export JSON" }).click();
  const download = await downloadPromise;
  await download.saveAs(exportPath);
  const exported = JSON.parse(await readFile(exportPath, "utf8"));
  expect(
    exported.scene.find((node: { id?: string }) => node.id === "combined-slide")
      .motion
  ).toEqual({ preset: "slide", durationMs: 480, slideDirection: "down" });

  await selectHierarchyNode(page, "LayoutSlide");
  motion = page.getByRole("group", { name: "Motion" });
  await expect(
    motion.getByText("Slide uses Fade while the parent controls layout.")
  ).toBeVisible();

  await selectHierarchyNode(page, "NestedFade");
  motion = page.getByRole("group", { name: "Motion" });
  await expect(
    motion.getByText("Fade uses Scale while an ancestor fades this subtree.")
  ).toBeVisible();
});

test("@full previews initial motion, fallback markers, and reduced-motion snaps", async ({ page }) => {
  const scene: FixtureNode[] = [
    fixtureNode("root", "MotionRoot", null, { cls: "ScreenGui", size: { x: 1, y: 1 }, transparency: 1, zindex: 0 }),
    fixtureNode("slide", "SlideRight", "root", { motion: { preset: "slide", durationMs: 700, slideDirection: "right" } }),
    fixtureNode("fade", "FadeOwner", "root", { motion: { preset: "fade", durationMs: 700 } }),
    fixtureNode("nested", "NestedFade", "fade", { motion: { preset: "fade", durationMs: 700 } }),
  ];
  await importScene(page, scene);
  const slide = page.locator('[data-node-id="slide"]');
  const nested = page.locator('[data-node-id="nested"]');
  await page.evaluate(() => {
    const target = document.querySelector('[data-node-id="slide"]');
    const records: { phase: string; x: number; duration: string; sentinel: string | null }[] = [];
    new MutationObserver(() => {
      const value = target?.getAttribute("data-motion-phase");
      if (value) records.push({
        phase: value,
        x: new DOMMatrix(getComputedStyle(target! as Element).transform).m41,
        duration: getComputedStyle(target! as Element).transitionDuration,
        sentinel: target?.getAttribute("data-motion-initial-closed") ?? null,
      });
    }).observe(target!, { attributes: true });
    Object.assign(window, { __motionPhases: records });
    (document.querySelector('button[aria-label="Preview"]') as HTMLButtonElement).click();
  });

  await expect.poll(() => page.evaluate(() => (window as unknown as { __motionPhases: { phase: string }[] }).__motionPhases.map((record) => record.phase))).toContain("closed");
  await expect.poll(() => slide.getAttribute("data-motion-phase")).toBe("opening");
  await expect.poll(async () => {
    const phase = await slide.getAttribute("data-motion-phase");
    if (phase !== "open") return null;
    return slide.evaluate((node) => new DOMMatrix(getComputedStyle(node).transform).m41);
  }).toBe(0);
  const records = await page.evaluate(() => (window as unknown as { __motionPhases: { phase: string; x: number; duration: string; sentinel: string | null }[] }).__motionPhases);
  expect(records.map((record) => record.phase)).toEqual(expect.arrayContaining(["closed", "opening", "open"]));
  expect(records.find((record) => record.phase === "closed")).toMatchObject({ x: 24, duration: "0s", sentinel: "true" });
  await expect(nested).toHaveAttribute("data-effective-motion", "scale");

  await page.getByRole("button", { name: "Stop preview" }).click();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.getByRole("button", { name: "Preview" }).click();
  await expect.poll(() => slide.getAttribute("data-motion-phase")).toBe("opening");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => slide.getAttribute("data-motion-phase")).toBe("open");
  await expect(slide).toHaveCSS("transition-duration", "0s");
});

test("@full freezes editing controls while Preview is active", async ({ page }) => {
  await page.addInitScript(() => {
    const original = Storage.prototype.setItem;
    Object.assign(window, { __storageWrites: 0 });
    Storage.prototype.setItem = function (...args) {
      (window as unknown as { __storageWrites: number }).__storageWrites++;
      return original.apply(this, args);
    };
  });
  await importScene(page, [
    fixtureNode("root", "MotionRoot", null, { cls: "ScreenGui", size: { x: 1, y: 1 }, transparency: 1, zindex: 0 }),
    fixtureNode("panel", "Panel", "root", { motion: { preset: "scale", durationMs: 700 } }),
  ]);
  await selectHierarchyNode(page, "Panel");
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("rgm:scene:v1") ?? "{}").selectedId)).toBe("panel");
  await page.getByRole("button", { name: "Preview" }).click();
  await page.evaluate(() => { (window as unknown as { __storageWrites: number }).__storageWrites = 0; });
  await expect(page.getByRole("button", { name: "Undo" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Redo" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "New" })).toBeDisabled();
  await expect(page.locator('input[type="file"][aria-label="Import JSON"]')).toBeDisabled();
  await expect(page.locator('aside[aria-disabled="true"]')).toHaveCount(1);
  await expect(page.getByRole("group", { name: "Motion" })).toHaveCount(0);
  await expect.poll(() => page.locator('[data-node-id="panel"]').getAttribute("data-motion-phase")).toBe("open");
  expect(await page.evaluate(() => (window as unknown as { __storageWrites: number }).__storageWrites)).toBe(0);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("rgm:scene:v1") ?? "{}").selectedId)).toBe("panel");
  await page.getByRole("button", { name: "Stop preview" }).click();
  await expect(page.getByRole("button", { name: "New" })).toBeEnabled();
});

test("@full discards an import that resolves after Preview starts", async ({ page }) => {
  await importScene(page, [
    fixtureNode("root", "OriginalRoot", null, { cls: "ScreenGui", size: { x: 1, y: 1 }, transparency: 1, zindex: 0 }),
    fixtureNode("original", "Original", "root", { motion: { preset: "scale", durationMs: 700 } }),
  ]);
  await expect.poll(() => page.evaluate(() => localStorage.getItem("rgm:scene:v1"))).not.toBeNull();
  const saved = await page.evaluate(() => localStorage.getItem("rgm:scene:v1"));
  await page.evaluate(() => {
    const original = File.prototype.text;
    File.prototype.text = () => new Promise<string>((done) => {
      Object.assign(window, { __resolveImport: done });
    });
    Object.assign(window, {
      __restoreFileText: () => { File.prototype.text = original; },
    });
  });
  try {
    await page.locator('input[type="file"][aria-label="Import JSON"]').setInputFiles({
      name: "late.json",
      mimeType: "application/json",
      buffer: Buffer.from("deferred by File.text"),
    });
    await expect.poll(() => page.evaluate(() => typeof (window as unknown as { __resolveImport?: unknown }).__resolveImport)).toBe("function");
    await page.getByRole("button", { name: "Preview" }).click();
    await page.evaluate((scene) => {
      (window as unknown as { __resolveImport: (value: string) => void }).__resolveImport(
        JSON.stringify({ format: "roblox-gui-maker", version: 2, scene }),
      );
    }, [fixtureNode("late-root", "LateRoot", null, { cls: "ScreenGui" })]);
    await expect(page.locator('[data-node-id="original"]')).toBeVisible();
    await expect(page.locator('[data-node-id="late-root"]')).toHaveCount(0);
    expect(await page.evaluate(() => localStorage.getItem("rgm:scene:v1"))).toBe(saved);
  } finally {
    await page.evaluate(() => (window as unknown as { __restoreFileText: () => void }).__restoreFileText());
  }
});

test("@full interrupts visibility actions safely and gates hover by motion state", async ({ page }) => {
  const target = fixtureNode("target", "Target", "root", { motion: { preset: "scale", durationMs: 700 } });
  await importScene(page, [
    fixtureNode("root", "MotionRoot", null, { cls: "ScreenGui", size: { x: 1, y: 1 }, transparency: 1, zindex: 0 }),
    target,
    fixtureNode("hover", "Hover", "root", { cls: "TextButton", text: "Hover", motion: { preset: "scale", durationMs: 700, hover: true } }),
    { ...fixtureNode("hide", "Hide", "root", { cls: "TextButton", text: "Hide" }), action: { type: "hide", targetId: "target" } },
    { ...fixtureNode("show", "Show", "root", { cls: "TextButton", text: "Show" }), action: { type: "show", targetId: "target" } },
  ]);
  await page.getByRole("button", { name: "Preview" }).click();
  const animated = page.locator('[data-node-id="target"]');
  const hover = page.locator('[data-node-id="hover"]');
  await expect.poll(() => animated.getAttribute("data-motion-phase")).toBe("open");
  await expect.poll(() => hover.getAttribute("data-motion-phase")).toBe("open");
  await hover.dispatchEvent("pointerover");
  await expect.poll(() => hover.evaluate((node) => new DOMMatrix(getComputedStyle(node).transform).a)).toBeCloseTo(1.03, 2);
  await page.locator('[data-node-id="hide"]').dispatchEvent("pointerdown");
  await expect.poll(() => animated.getAttribute("data-motion-phase")).toBe("closing");
  const closingToken = Number(await animated.getAttribute("data-motion-token"));
  await page.locator('[data-node-id="show"]').dispatchEvent("pointerdown");
  await expect.poll(() => animated.getAttribute("data-motion-phase")).toBe("opening");
  await animated.dispatchEvent("transitionend", { propertyName: "transform" });
  await expect(animated).toHaveAttribute("data-motion-phase", "open");
  await expect(animated).toBeVisible();
  expect(Number(await animated.getAttribute("data-motion-token"))).toBeGreaterThan(closingToken);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => hover.evaluate((node) => new DOMMatrix(getComputedStyle(node).transform).a)).toBe(1);
});
