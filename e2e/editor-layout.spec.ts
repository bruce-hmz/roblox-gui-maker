import { expect, test, type Locator } from "@playwright/test";

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
    ".CellSize = UDim2.new(0.3, 0, 0, 120)"
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
    ".CellSize = UDim2.new(0.3, 0, 0, 120)"
  );

  await cellSizeXScale.fill("");
  await expect(cellSizeXScale).toHaveValue("");
  await expect(page.getByText("A value is required.")).toBeVisible();
  await expect(clientCode).toContainText(
    ".CellSize = UDim2.new(0.3, 0, 0, 120)"
  );

  await cellSizeXScale.fill("1.1");
  await expect(cellSizeXScale).toHaveValue("1.1");
  await expect(page.getByText("Enter a value from 0 to 1.")).toBeVisible();
  await expect(clientCode).toContainText(
    ".CellSize = UDim2.new(0.3, 0, 0, 120)"
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
    ".CellSize = UDim2.new(0.015, 0, 0, 120)"
  );
  await cellSizeXScale.fill("0.1");
  await cellSizeXScale.press("ArrowUp");
  await expect(cellSizeXScale).toHaveValue("0.11");
  await expect(clientCode).toContainText(
    ".CellSize = UDim2.new(0.11, 0, 0, 120)"
  );

  await cellSizeXScale.fill("5e-324");
  await expect(cellSizeXScale).toHaveValue("5e-324");
  await expect(clientCode).toContainText(
    ".CellSize = UDim2.new(5e-324, 0, 0, 120)"
  );
  await cellSizeXScale.press("ArrowUp");
  await expect(cellSizeXScale).toHaveValue("0.01");
  await expect(cellSizeXScale).toHaveAttribute("aria-valuenow", "0.01");
  await expect(clientCode).toContainText(
    ".CellSize = UDim2.new(0.01, 0, 0, 120)"
  );
  await expect(clientCode).not.toContainText(/NaN|Infinity/);
  await cellSizeXScale.press("ArrowDown");
  await expect(cellSizeXScale).toHaveValue("0");
  await expect(cellSizeXScale).toHaveAttribute("aria-valuenow", "0");
  await expect(clientCode).toContainText(
    ".CellSize = UDim2.new(0, 0, 0, 120)"
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
  const itemGridEvidence = await readGridEvidence(itemGridLayout);
  expect(itemGridEvidence.inline).toEqual({
    gridTemplateColumns: "repeat(auto-fill, 30%)",
    gridAutoRows: "120px",
    columnGap: "calc(2% + 4px)",
    rowGap: "8px",
  });
  const expectedTrackWidth = itemGridEvidence.contentWidth * 0.3;
  const expectedColumnGap = itemGridEvidence.contentWidth * 0.02 + 4;
  const computedTracks = itemGridEvidence.computed.gridTemplateColumns
    .split(" ")
    .map(Number.parseFloat);
  const expectedTrackCount = Math.max(
    1,
    Math.floor(
      (itemGridEvidence.contentWidth + expectedColumnGap) /
        (expectedTrackWidth + expectedColumnGap)
    )
  );
  expect(computedTracks).toHaveLength(expectedTrackCount);
  for (const trackWidth of computedTracks) {
    expect(Math.abs(trackWidth - expectedTrackWidth)).toBeLessThanOrEqual(0.02);
  }
  expect(itemGridEvidence.computed.gridAutoRows).toBe("120px");
  expect(itemGridEvidence.computed.columnGap).toBe("calc(2% + 4px)");
  expect(itemGridEvidence.computed.rowGap).toBe("8px");

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

test("@full renders the explicit inventory grid consistently publicly and in the editor", async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  const inventoryGridContract = {
    gridTemplateColumns: "repeat(auto-fill, 22%)",
    gridAutoRows: "92px",
    columnGap: "8px",
    rowGap: "8px",
  };
  await page.goto("/templates/inventory");
  const publicGrid = page
    .locator('[data-scene-preview="desktop"]')
    .filter({ hasText: "INVENTORY" })
    .locator('[data-layout="grid"]');
  await expect(publicGrid).toHaveCount(1);
  const publicEvidence = await readGridEvidence(publicGrid);
  expect(publicEvidence.automaticCanvasSize).toBe("none");
  expect(publicEvidence.inline).toEqual(inventoryGridContract);
  expectInventoryComputedGrid(publicEvidence);

  await page.goto("/editor?template=inventory");
  const editorGrid = page.locator('[data-layout="grid"]');
  await expect(editorGrid).toHaveCount(1);
  const editorEvidence = await readGridEvidence(editorGrid);
  expect(editorEvidence.automaticCanvasSize).toBe("none");
  expect(editorEvidence.inline).toEqual(inventoryGridContract);
  expectInventoryComputedGrid(editorEvidence);
  expect(editorEvidence.inline).toEqual(publicEvidence.inline);

  expect(consoleErrors).toEqual([]);
});

type GridEvidence = Awaited<ReturnType<typeof readGridEvidence>>;

function readGridEvidence(locator: Locator) {
  return locator.evaluate((element) => {
    const wrapper = element as HTMLElement;
    const computed = getComputedStyle(wrapper);
    const contentWidth =
      wrapper.getBoundingClientRect().width -
      parseFloat(computed.paddingLeft) -
      parseFloat(computed.paddingRight) -
      parseFloat(computed.borderLeftWidth) -
      parseFloat(computed.borderRightWidth);
    return {
      automaticCanvasSize: wrapper.dataset.automaticCanvasSize,
      contentWidth,
      inline: {
        gridTemplateColumns: wrapper.style.gridTemplateColumns,
        gridAutoRows: wrapper.style.gridAutoRows,
        columnGap: wrapper.style.columnGap,
        rowGap: wrapper.style.rowGap,
      },
      computed: {
        gridTemplateColumns: computed.gridTemplateColumns,
        gridAutoRows: computed.gridAutoRows,
        columnGap: computed.columnGap,
        rowGap: computed.rowGap,
      },
    };
  });
}

function expectInventoryComputedGrid(evidence: GridEvidence) {
  const expectedTrackWidth = evidence.contentWidth * 0.22;
  const columns = evidence.computed.gridTemplateColumns
    .split(" ")
    .map(Number.parseFloat);
  const expectedColumnCount = Math.max(
    1,
    Math.floor((evidence.contentWidth + 8) / (expectedTrackWidth + 8))
  );
  expect(columns).toHaveLength(expectedColumnCount);
  for (const columnWidth of columns) {
    expect(Math.abs(columnWidth - expectedTrackWidth)).toBeLessThanOrEqual(0.02);
  }
  expect(evidence.computed.gridAutoRows).toBe("92px");
  expect(evidence.computed.columnGap).toBe("8px");
  expect(evidence.computed.rowGap).toBe("8px");
}
