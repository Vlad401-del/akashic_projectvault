import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/oauth",
  workers: 1,
  reporter: "list",
  use: { baseURL: "http://127.0.0.1:3102" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], channel: "chrome" } },
    { name: "mobile", use: { ...devices["Pixel 7"], channel: "chrome" } },
  ],
  webServer: {
    command: "node node_modules/next/dist/bin/next dev --hostname 127.0.0.1 -p 3102",
    url: "http://127.0.0.1:3102/login",
    timeout: 120_000,
    env: {
      NEXT_PUBLIC_SUPABASE_URL: "https://auth-test.example.com",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "test-publishable-key",
      GOOGLE_AUTH_ENABLED: "true",
      AKASHIC_TEST_DIST_DIR: ".next-playwright",
    },
  },
});
