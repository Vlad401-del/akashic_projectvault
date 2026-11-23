import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/demo",
  timeout: 30_000,
  expect: { timeout: 10_000 },
  workers: 1,
  reporter: "list",
  tsconfig: "./tsconfig.demo.json",
  globalSetup: "./tests/demo/global-setup.ts",
  use: { baseURL: "http://127.0.0.1:3101", screenshot: "only-on-failure" },
  projects: [
    { name: "desktop-chrome", use: { ...devices["Desktop Chrome"], channel: "chrome" } },
    { name: "mobile-chrome", use: { ...devices["Pixel 7"], channel: "chrome" } },
  ],
  webServer: {
    command: "node node_modules/next/dist/bin/next dev --hostname 127.0.0.1 -p 3101",
    url: "http://127.0.0.1:3101",
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      NEXT_PUBLIC_SUPABASE_URL: "",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "",
      GOOGLE_AUTH_ENABLED: "false",
      AKASHIC_DEMO_DATA_DIR: ".data-playwright",
      AKASHIC_TEST_DIST_DIR: ".next-playwright",
    },
  },
});
