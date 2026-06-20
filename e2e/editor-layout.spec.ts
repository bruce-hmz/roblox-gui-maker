import { expect, test } from "@playwright/test";

test("@full edits container layout properties without losing inactive values", async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.goto("/editor?template=shop");
  await page.getByRole("button", { name: "Hierarchy" }).click();
  await page.getByRole("treeitem", { name: /ItemGrid/ }).click();

  const layout = page.getByRole("combobox", { name: "Layout" });
  await expect(layout).toHaveValue("grid");

  await page.getByRole("spinbutton", { name: "Cell size X scale" }).fill("0.3");
  await page.getByRole("spinbutton", { name: "Cell size Y offset" }).fill("120");
  await page.getByRole("spinbutton", { name: "Cell padding X scale" }).fill("0.02");
  await page
    .getByRole("combobox", { name: "Horizontal alignment" })
    .selectOption("center");
  await page
    .getByRole("combobox", { name: "Vertical alignment" })
    .selectOption("bottom");
  await page
    .getByRole("combobox", { name: "Automatic canvas size" })
    .selectOption("y");

  await layout.selectOption("list");
  await expect(page.getByRole("combobox", { name: "Direction" })).toBeVisible();
  await expect(page.getByRole("spinbutton", { name: "Gap scale" })).toBeVisible();
  await expect(page.getByRole("spinbutton", { name: "Gap offset" })).toBeVisible();
  await expect(
    page.getByRole("spinbutton", { name: "Cell size X scale" })
  ).toHaveCount(0);

  await layout.selectOption("grid");
  await expect(
    page.getByRole("spinbutton", { name: "Cell size X scale" })
  ).toHaveValue("0.3");
  await expect(
    page.getByRole("spinbutton", { name: "Cell size Y offset" })
  ).toHaveValue("120");
  await expect(
    page.getByRole("spinbutton", { name: "Cell padding X scale" })
  ).toHaveValue("0.02");
  await expect(
    page.getByRole("combobox", { name: "Horizontal alignment" })
  ).toHaveValue("center");
  await expect(
    page.getByRole("combobox", { name: "Vertical alignment" })
  ).toHaveValue("bottom");
  await expect(
    page.getByRole("combobox", { name: "Automatic canvas size" })
  ).toHaveValue("y");

  expect(consoleErrors).toEqual([]);
});
