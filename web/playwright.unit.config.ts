import { defineConfig } from "@playwright/test";

export default defineConfig({ testDir: "./tests/unit", tsconfig: "./tsconfig.demo.json", workers: 1, reporter: "list" });
