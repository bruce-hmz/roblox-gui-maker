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

  const cellSizeXScale = page.getByRole("spinbutton", {
    name: "Cell size X scale",
  });
  await cellSizeXScale.fill("0.3");
  const clientCode = page.getByLabel("Client Luau code");
  await expect(clientCode).toContainText(
    ".CellSize = UDim2.new(0.3, 100, 0, 100)"
  );

  await cellSizeXScale.fill("abc");
  await expect(cellSizeXScale).toHaveValue("abc");
  await expect(page.getByText("Enter a valid number.")).toBeVisible();
  await expect(clientCode).toContainText(
    ".CellSize = UDim2.new(0.3, 100, 0, 100)"
  );

  await cellSizeXScale.fill("");
  await expect(cellSizeXScale).toHaveValue("");
  await expect(page.getByText("A value is required.")).toBeVisible();
  await expect(clientCode).toContainText(
    ".CellSize = UDim2.new(0.3, 100, 0, 100)"
  );

  await cellSizeXScale.fill("1.1");
  await expect(cellSizeXScale).toHaveValue("1.1");
  await expect(page.getByText("Enter a value from 0 to 1.")).toBeVisible();
  await expect(clientCode).toContainText(
    ".CellSize = UDim2.new(0.3, 100, 0, 100)"
  );

  await cellSizeXScale.fill("0.3");
  for (const error of [
    "Enter a valid number.",
    "A value is required.",
    "Enter a value from 0 to 1.",
  ]) {
    await expect(page.getByText(error)).toHaveCount(0);
  }
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
