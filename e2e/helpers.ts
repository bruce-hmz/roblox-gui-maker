import { expect, test } from "@playwright/test";

// Collect console errors while ignoring analytics-endpoint noise: GA beacons
// fire in the production build, and their network failures (offline CI runner,
// blocked domains) say nothing about the app under test.
const ANALYTICS_URL =
  /analytics\.google\.com|google-analytics\.com|doubleclick\.net|googletagmanager\.com/;

export function collectConsoleErrors(page: import("@playwright/test").Page) {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    if (ANALYTICS_URL.test(message.location().url ?? "")) return;
    consoleErrors.push(message.text());
  });
  return consoleErrors;
}
