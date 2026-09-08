import { defineConfig, devices } from "@playwright/test";

const isCi = Boolean(process.env.CI);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCi,
  retries: isCi ? 2 : 0,
  workers: isCi ? 1 : undefined,
  reporter: isCi ? "github" : "line",
  outputDir: "test-results",
  use: {
    baseURL: "http://127.0.0.1:3199",
    viewport: { width: 1280, height: 900 },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // PLAYWRIGHT_USE_SYSTEM_CHROME=1 runs on the locally installed Google
        // Chrome (channel) instead of the downloaded chromium build — handy
        // when the download is slow/unavailable. CI keeps the default.
        ...(process.env.PLAYWRIGHT_USE_SYSTEM_CHROME
          ? { channel: "chrome" as const }
          : {}),
      },
    },
  ],
  webServer: {
    // AI_PROVIDER=mock wires /api/generate-gui to the deterministic keyword
    // classifier so e2e exercises the real funnel without a provider key.
    command:
      "AI_PROVIDER=mock npm run start -- --hostname 127.0.0.1 --port 3199",
    url: "http://127.0.0.1:3199/editor",
    reuseExistingServer: !isCi,
    timeout: 30_000,
  },
});
