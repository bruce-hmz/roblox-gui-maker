import { expect, test } from "@playwright/test";

// Visual regression for the composer: fixed example specs rendered in the
// editor canvas. Tagged @visual (not part of @smoke/@full CI greps — pixel
// baselines are machine-specific); run locally with:
//   npx playwright test ai-examples.visual --update-snapshots   (first time)
//   npx playwright test ai-examples.visual                       (thereafter)
// The @smoke ai-funnel spec carries the CI-safe structural assertions.

const EXAMPLES = [
  "anime-battleground-hud",
  "simulator-shop",
  "rpg-inventory",
  "horror-main-menu",
  "seven-day-rewards",
];

for (const slug of EXAMPLES) {
  test(`@visual example scene ${slug}`, async ({ page }) => {
    await page.goto(`/editor?example=${slug}`);
    const canvas = page.locator("main").getByText("1920×1080").locator("xpath=..");
    // Give the initial paint a beat, then lock the pixels.
    await expect(page.getByLabel("Client Luau code")).toBeVisible();
    await page.waitForTimeout(250);
    await expect(page).toHaveScreenshot(`ai-example-${slug}.png`, {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
      animations: "disabled",
    });
  });
}
