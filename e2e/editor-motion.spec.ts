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
  rotation?: number;
  anchor?: { x: number; y: number };
  action?:
    | { type: "show" | "hide" | "toggle"; targetId: string }
    | { type: "hideGui" }
    | { type: "remoteEvent"; eventName: string; argument?: string }
    | { type: "teleport"; placeId: string };
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
  await page.getByRole("button", { name: "Stop preview" }).click();
  await page.evaluate(() => {
    const target = document.querySelector('[data-node-id="slide"]')!;
    const phases: string[] = [];
    new MutationObserver(() => {
      const phase = target.getAttribute("data-motion-phase");
      if (phase) phases.push(phase);
    }).observe(target, { attributes: true });
    Object.assign(window, { __reducedPhases: phases });
    (document.querySelector('button[aria-label="Preview"]') as HTMLButtonElement).click();
  });
  await expect.poll(() => slide.getAttribute("data-motion-phase")).toBe("open");
  expect(await page.evaluate(() => (window as unknown as { __reducedPhases: string[] }).__reducedPhases)).not.toContain("opening");
  await expect(slide).toHaveCSS("transition-duration", "0s");
});

test("@full freezes editing controls while Preview is active", async ({ page }, testInfo) => {
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
  const panel = page.locator('[data-node-id="panel"]');
  const previewLeft = await panel.evaluate((node) => getComputedStyle(node).left);
  await expect(page.getByRole("button", { name: "Undo" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Redo" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "New" })).toBeDisabled();
  await expect(page.locator('input[type="file"][aria-label="Import JSON"]')).toBeDisabled();
  await expect(page.locator('aside[aria-disabled="true"]')).toHaveCount(1);
  await expect(page.getByRole("group", { name: "Motion" })).toHaveCount(0);
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Delete");
  await page.keyboard.press("Control+d");
  await page.keyboard.press("Control+z");
  await page.evaluate(() => {
    const frame = [...document.querySelectorAll("button")].find((button) => button.textContent?.includes("Frame"));
    (frame as HTMLButtonElement | undefined)?.click();
    (document.querySelector('button[aria-label="New"]') as HTMLButtonElement).click();
  });
  await page.getByRole("button", { name: "Mobile" }).click();
  await expect(page.getByRole("button", { name: "Mobile" })).toHaveAttribute("aria-pressed", "true");
  expect(await panel.evaluate((node) => getComputedStyle(node).left)).toBe(previewLeft);
  await expect(page.locator('[data-node-id]')).toHaveCount(2);
  const exportPath = testInfo.outputPath("preview-frozen.json");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export JSON" }).click();
  const download = await downloadPromise;
  await download.saveAs(exportPath);
  expect(JSON.parse(await readFile(exportPath, "utf8")).scene.map((node: { id: string }) => node.id)).toEqual(["root", "panel"]);
  await expect.poll(() => page.locator('[data-node-id="panel"]').getAttribute("data-motion-phase")).toBe("open");
  expect(await page.evaluate(() => (window as unknown as { __storageWrites: number }).__storageWrites)).toBe(0);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("rgm:scene:v1") ?? "{}").selectedId)).toBe("panel");
  await page.getByRole("button", { name: "Stop preview" }).click();
  await expect(page.getByRole("button", { name: "New" })).toBeEnabled();
  await selectHierarchyNode(page, "Panel");
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => panel.evaluate((node) => getComputedStyle(node).left)).not.toBe(previewLeft);
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
    fixtureNode("plain-target", "PlainTarget", "root"),
    fixtureNode("hover", "Hover", "root", { cls: "TextButton", text: "Hover", motion: { preset: "scale", durationMs: 700, hover: true } }),
    { ...fixtureNode("hide", "Hide", "root", { cls: "TextButton", text: "Hide" }), action: { type: "hide", targetId: "target" } },
    { ...fixtureNode("show", "Show", "root", { cls: "TextButton", text: "Show" }), action: { type: "show", targetId: "target" } },
    { ...fixtureNode("toggle", "Toggle", "root", { cls: "TextButton", text: "Toggle" }), action: { type: "toggle", targetId: "plain-target" } },
    { ...fixtureNode("remote", "Remote", "root", { cls: "TextButton", text: "Remote" }), action: { type: "remoteEvent", eventName: "PreviewEvent", argument: "" } },
    { ...fixtureNode("hide-gui", "HideGui", "root", { cls: "TextButton", text: "HideGui" }), action: { type: "hideGui" } },
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
  await page.locator('[data-node-id="toggle"]').dispatchEvent("pointerdown");
  await expect(page.locator('[data-node-id="plain-target"]')).toHaveCount(0);
  await page.locator('[data-node-id="toggle"]').dispatchEvent("pointerdown");
  await expect(page.locator('[data-node-id="plain-target"]')).toBeVisible();
  await page.locator('[data-node-id="remote"]').dispatchEvent("pointerdown");
  await expect(page.getByRole("status")).toContainText("RemoteEvent actions run in Roblox Studio");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => hover.evaluate((node) => new DOMMatrix(getComputedStyle(node).transform).a)).toBe(1);
  await page.locator('[data-node-id="hide-gui"]').dispatchEvent("pointerdown");
  await expect(page.locator('[data-node-id="root"]')).toHaveCount(0);
});

test("@full fades a subtree from its root opacity and preserves configured timing", async ({ page }) => {
  await importScene(page, [
    fixtureNode("root", "Root", null, { cls: "ScreenGui", size: { x: 1, y: 1 }, transparency: 1, zindex: 0 }),
    fixtureNode("fade", "Fade", "root", { motion: { preset: "fade", durationMs: 700 } }),
    fixtureNode("child", "Child", "fade"),
  ]);
  const fade = page.locator('[data-node-id="fade"]');
  await page.evaluate(() => {
    const target = document.querySelector('[data-node-id="fade"]')!;
    const records: { phase: string; opacity: string }[] = [];
    new MutationObserver(() => {
      const phase = target.getAttribute("data-motion-phase");
      if (phase) records.push({ phase, opacity: getComputedStyle(target).opacity });
    }).observe(target, { attributes: true });
    Object.assign(window, { __fadeRecords: records });
    (document.querySelector('button[aria-label="Preview"]') as HTMLButtonElement).click();
  });
  await expect.poll(() => page.evaluate(() => (window as unknown as { __fadeRecords: { phase: string }[] }).__fadeRecords.map((record) => record.phase))).toContain("closed");
  const closed = await page.evaluate(() => (window as unknown as { __fadeRecords: { phase: string; opacity: string }[] }).__fadeRecords.find((record) => record.phase === "closed"));
  expect(closed?.opacity).toBe("0");
  await expect(fade).toHaveCSS("transition-property", "opacity");
  await expect(fade).toHaveCSS("transition-duration", "0.7s");
  await expect.poll(() => fade.getAttribute("data-motion-phase")).toBe("open");
  await expect(fade).toHaveCSS("opacity", "1");
  await expect(page.locator('[data-node-id="child"]')).toBeVisible();
});

test("@full subscribes reduced motion only for the active Preview session", async ({ page }) => {
  await page.addInitScript(() => {
    const native = window.matchMedia.bind(window);
    Object.assign(window, { __mediaAdds: 0, __mediaRemoves: 0 });
    window.matchMedia = (query) => {
      const result = native(query);
      const add = result.addEventListener.bind(result);
      const remove = result.removeEventListener.bind(result);
      result.addEventListener = ((type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => {
        (window as unknown as { __mediaAdds: number }).__mediaAdds++;
        return add(type as "change", listener, options);
      }) as typeof result.addEventListener;
      result.removeEventListener = ((type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => {
        (window as unknown as { __mediaRemoves: number }).__mediaRemoves++;
        return remove(type as "change", listener, options);
      }) as typeof result.removeEventListener;
      return result;
    };
  });
  await importScene(page, [fixtureNode("root", "Root", null, { cls: "ScreenGui" })]);
  expect(await page.evaluate(() => (window as unknown as { __mediaAdds: number }).__mediaAdds)).toBe(0);
  await page.getByRole("button", { name: "Preview" }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { __mediaAdds: number }).__mediaAdds)).toBe(1);
  await page.getByRole("button", { name: "Stop preview" }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { __mediaRemoves: number }).__mediaRemoves)).toBe(1);
});

test("@full gates hover eligibility and composes rotated Slide in screen direction", async ({ page }) => {
  await importScene(page, [
    fixtureNode("root", "Root", null, { cls: "ScreenGui", size: { x: 1, y: 1 }, transparency: 1, zindex: 0 }),
    fixtureNode("plain", "Plain", "root", { cls: "TextButton", text: "Plain", motion: { preset: "scale", durationMs: 700 } }),
    fixtureNode("hover", "Hover", "root", { cls: "TextButton", text: "Hover", motion: { preset: "fade", durationMs: 700, hover: true } }),
    fixtureNode("rotated", "Rotated", "root", { rotation: 90, anchor: { x: 0.5, y: 0.5 }, motion: { preset: "slide", durationMs: 700, slideDirection: "right" } }),
    fixtureNode("fade-flow", "FadeFlow", "root", { motion: { preset: "fade", durationMs: 700 } }),
    fixtureNode("flow-list", "FlowList", "fade-flow", { layout: "list" }),
    fixtureNode("flow-child", "FlowChild", "flow-list", { motion: { preset: "slide", durationMs: 700, slideDirection: "right" } }),
  ]);
  const plain = page.locator('[data-node-id="plain"]');
  const hover = page.locator('[data-node-id="hover"]');
  const rotated = page.locator('[data-node-id="rotated"]');
  const flowChild = page.locator('[data-node-id="flow-child"]');
  const canonicalX = await rotated.evaluate((node) => new DOMMatrix(getComputedStyle(node).transform).m41);
  const canonicalCenter = await flowChild.evaluate((node) => {
    const rect = node.getBoundingClientRect();
    return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
  });
  await page.evaluate(() => {
    const target = document.querySelector('[data-node-id="rotated"]')!;
    const flow = document.querySelector('[data-node-id="flow-child"]')!;
    const records: { phase: string; x: number }[] = [];
    new MutationObserver(() => {
      const phase = target.getAttribute("data-motion-phase");
      if (phase) records.push({ phase, x: new DOMMatrix(getComputedStyle(target).transform).m41 });
    }).observe(target, { attributes: true });
    const flowRecords: { phase: string; x: number; y: number }[] = [];
    new MutationObserver(() => {
      const phase = flow.getAttribute("data-motion-phase");
      const rect = flow.getBoundingClientRect();
      if (phase) flowRecords.push({ phase, x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 });
    }).observe(flow, { attributes: true });
    Object.assign(window, { __rotatedRecords: records, __flowRecords: flowRecords });
    (document.querySelector('button[aria-label="Preview"]') as HTMLButtonElement).click();
  });
  await expect.poll(() => plain.getAttribute("data-motion-phase")).toBe("open");
  await plain.dispatchEvent("pointerover");
  await expect.poll(() => plain.evaluate((node) => new DOMMatrix(getComputedStyle(node).transform).a)).toBe(1);
  await expect.poll(() => hover.getAttribute("data-motion-phase")).toBe("open");
  await hover.focus();
  await expect(hover).toHaveCSS("transition-property", "opacity, transform");
  await expect(hover).toHaveCSS("transition-duration", "0.7s");
  await expect.poll(() => hover.evaluate((node) => new DOMMatrix(getComputedStyle(node).transform).a)).toBeCloseTo(1.03, 2);
  const initialX = await page.evaluate(() => (window as unknown as { __rotatedRecords: { phase: string; x: number }[] }).__rotatedRecords.find((record) => record.phase === "closed")!.x);
  expect(initialX - canonicalX).toBeCloseTo(24, 4);
  await expect(flowChild).toHaveAttribute("data-effective-motion", "scale");
  const flowClosed = await page.evaluate(() => (window as unknown as { __flowRecords: { phase: string; x: number; y: number }[] }).__flowRecords.find((record) => record.phase === "closed")!);
  expect(flowClosed.x).toBeCloseTo(canonicalCenter.x, 4);
  expect(flowClosed.y).toBeCloseTo(canonicalCenter.y, 4);
});
