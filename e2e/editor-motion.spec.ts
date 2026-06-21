import { readFile } from "node:fs/promises";
import { expect, test, type Page } from "@playwright/test";

type FixtureNode = {
  id: string;
  cls: "ScreenGui" | "Frame";
  name: string;
  parentId: string | null;
  pos: { x: number; y: number };
  size: { x: number; y: number };
  color: string;
  transparency: number;
  cornerRadius: number;
  zindex: number;
  layout?: "list";
  motion?: {
    preset?: "fade" | "slide";
    durationMs?: number;
    slideDirection?: "left" | "right" | "up" | "down";
  };
};

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
