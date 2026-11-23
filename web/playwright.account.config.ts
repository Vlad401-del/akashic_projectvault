import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/account", testMatch: "*.spec.ts", globalSetup: "./tests/account/mock-backend.ts",
  workers: 1, reporter: "list", timeout: 40_000,
  use: { baseURL: "http://127.0.0.1:3103", channel: "chrome", screenshot: "only-on-failure" },
  projects: [320, 390, 768, 1440].map((width) => ({ name: `${width}px`, use: { viewport: { width, height: 844 }, isMobile: width < 768, hasTouch: width < 768 } })),
  webServer: {
    command: "node node_modules/next/dist/bin/next dev --hostname 127.0.0.1 -p 3103",
    url: "http://127.0.0.1:3103/login", timeout: 120_000,
    env: { NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:3104", NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "test-only-publishable-key", GOOGLE_AUTH_ENABLED: "false", AKASHIC_TEST_DIST_DIR: ".next-playwright" },
  },
});
