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
  await cellSizeXScale.fill("");
  await cellSizeXScale.pressSequentially("0.3", { delay: 100 });
  await expect(cellSizeXScale).toHaveValue("0.3");
  const clientCode = page.getByLabel("Client Luau code");
  await expect(clientCode).toContainText(
    ".CellSize = UDim2.new(0.3, 100, 0, 100)"
  );

  await cellSizeXScale.fill("abc");
  await expect(cellSizeXScale).toHaveValue("abc");
  await expect(cellSizeXScale).toHaveAttribute("aria-valuenow", "0.3");
  await expect(cellSizeXScale).toHaveAttribute(
    "aria-valuetext",
    'Invalid draft "abc": Enter a valid number.'
  );
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

  await cellSizeXScale.fill("0.005");
  await cellSizeXScale.press("ArrowUp");
  await expect(cellSizeXScale).toHaveValue("0.015");
  await expect(clientCode).toContainText(
    ".CellSize = UDim2.new(0.015, 100, 0, 100)"
  );
  await cellSizeXScale.fill("0.1");
  await cellSizeXScale.press("ArrowUp");
  await expect(cellSizeXScale).toHaveValue("0.11");
  await expect(clientCode).toContainText(
    ".CellSize = UDim2.new(0.11, 100, 0, 100)"
  );

  await cellSizeXScale.fill("5e-324");
  await expect(cellSizeXScale).toHaveValue("5e-324");
  await expect(clientCode).toContainText(
    ".CellSize = UDim2.new(5e-324, 100, 0, 100)"
  );
  await cellSizeXScale.press("ArrowUp");
  await expect(cellSizeXScale).toHaveValue("0.01");
  await expect(cellSizeXScale).toHaveAttribute("aria-valuenow", "0.01");
  await expect(clientCode).toContainText(
    ".CellSize = UDim2.new(0.01, 100, 0, 100)"
  );
  await expect(clientCode).not.toContainText(/NaN|Infinity/);
  await cellSizeXScale.press("ArrowDown");
  await expect(cellSizeXScale).toHaveValue("0");
  await expect(cellSizeXScale).toHaveAttribute("aria-valuenow", "0");
  await expect(clientCode).toContainText(
    ".CellSize = UDim2.new(0, 100, 0, 100)"
  );
  await cellSizeXScale.fill("0.3");
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

  const itemGridLayout = page
    .locator('[data-node-id]')
    .filter({ has: page.locator(':scope > [data-layout="grid"]') })
    .locator(':scope > [data-layout="grid"]');
  await expect(itemGridLayout).toHaveCount(1);
  await expect(itemGridLayout).toHaveAttribute("data-automatic-canvas-size", "y");
  await expect
    .poll(() =>
      itemGridLayout.evaluate((element) => {
        const style = (element as HTMLElement).style;
        return {
          gridTemplateColumns: style.gridTemplateColumns,
          gridAutoRows: style.gridAutoRows,
          columnGap: style.columnGap,
          rowGap: style.rowGap,
        };
      })
    )
    .toEqual({
      gridTemplateColumns: "repeat(auto-fill, calc(30% + 100px))",
      gridAutoRows: "120px",
      columnGap: "calc(2% + 8px)",
      rowGap: "8px",
    });

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

test("@full renders the same legacy inventory grid defaults publicly and in the editor", async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  const legacyGridContract = {
    automaticCanvasSize: "none",
    gridTemplateColumns: "repeat(auto-fill, 100px)",
    gridAutoRows: "100px",
    columnGap: "8px",
    rowGap: "8px",
  };
  const readLegacyGridContract = (locator: ReturnType<typeof page.locator>) =>
    locator.evaluate((element) => {
      const wrapper = element as HTMLElement;
      return {
        automaticCanvasSize: wrapper.dataset.automaticCanvasSize,
        gridTemplateColumns: wrapper.style.gridTemplateColumns,
        gridAutoRows: wrapper.style.gridAutoRows,
        columnGap: wrapper.style.columnGap,
        rowGap: wrapper.style.rowGap,
      };
    });

  await page.goto("/templates/inventory");
  const publicGrid = page
    .getByRole("link", { name: "Open in Editor" })
    .locator("xpath=../preceding-sibling::div[1]")
    .locator('[data-layout="grid"]');
  await expect(publicGrid).toHaveCount(1);
  const publicContract = await readLegacyGridContract(publicGrid);
  expect(publicContract).toEqual(legacyGridContract);

  await page.goto("/editor?template=inventory");
  const editorGrid = page.locator('[data-layout="grid"]');
  await expect(editorGrid).toHaveCount(1);
  const editorContract = await readLegacyGridContract(editorGrid);
  expect(editorContract).toEqual(legacyGridContract);
  expect(editorContract).toEqual(publicContract);

  expect(consoleErrors).toEqual([]);
});
