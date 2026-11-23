import { expect, test } from "@playwright/test";

test.skip(!process.env.AKASHIC_E2E_BASE_URL, "Pemeriksaan khusus deployment nyata.");
const profile = process.env.AKASHIC_E2E_PROFILE || "/u/rafitp";
const paths = ["/", "/tim", "/login", "/register", "/forgot-password", profile, `${profile}/p/${process.env.AKASHIC_E2E_PROJECT || "website-pembelajaran-mandiri"}`];

test("deployment: logo baru terlihat dan tim penuh tidak muncul di papan pencarian", async ({ page }) => {
  await page.goto("/");
  const logos = page.locator('img[src*="akashic-logo"]');
  expect(await logos.count()).toBeGreaterThan(0);
  for (const logo of await logos.all()) {
    await logo.scrollIntoViewIfNeeded();
    await expect.poll(() => logo.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0)).toBe(true);
  }
  await page.goto("/tim");
  await expect(page.getByRole("heading", { name: "Dipaksa Mas Reza Lomba", exact: true })).toHaveCount(0);
});

for (const width of [320, 390, 768, 1440]) {
  test(`deployment: halaman publik muat tanpa galat pada ${width}px`, async ({ page }, testInfo) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width, height: 850 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error" && /hydrat/i.test(message.text())) errors.push(message.text()); });
    for (const path of paths) {
      const response = await page.goto(path);
      expect(response?.status(), path).toBe(200);
      await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
      await expect(page.getByRole("heading", { name: "Halaman belum dapat dimuat" })).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), path).toBe(true);
      if (width === 390 && ["/", "/tim", profile].includes(path)) {
        await page.screenshot({ path: testInfo.outputPath(`${path.replace(/\W/g, "_")}.png`), fullPage: true, caret: "initial" });
      }
    }
    expect(errors).toEqual([]);
  });
}

test("deployment: menu ponsel membuka cari tim dan dapat ditutup", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 850 });
  await page.goto("/");
  const toggle = page.locator("summary").filter({ hasText: "Menu" });
  await toggle.click();
  const nav = page.getByRole("navigation", { name: "Navigasi ponsel" });
  for (const name of ["Cara kerja", "Karya", "Lomba", "Cari tim"]) await expect(nav.getByRole("link", { name, exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(nav).toBeHidden();
  await toggle.click();
  await nav.getByRole("link", { name: "Cari tim", exact: true }).click();
  await expect(page).toHaveURL(/\/tim$/);
  await expect(nav).toBeHidden();
});

test("deployment: tombol Google mencapai halaman masuk Google", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Masuk dengan Google" }).click();
  await expect(page).toHaveURL(/^https:\/\/accounts\.google\.com\//, { timeout: 20_000 });
});
