import { expect, test } from "@playwright/test";
import { backendUrl, session } from "./mock-backend";

test.beforeEach(async ({ context, request }) => {
  await request.get(`${backendUrl}/__test/reset`);
  await context.addCookies([{ name: "sb-127-auth-token", value: `base64-${Buffer.from(JSON.stringify(session)).toString("base64url")}`, url: "http://127.0.0.1:3103", sameSite: "Lax" }]);
});

test("profil dan edit tim tampil lengkap tanpa melebar", async ({ page }, testInfo) => {
  for (const path of ["/dashboard/profile", "/dashboard/tim/mobile-team/edit"]) {
    await page.goto(path);
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.locator("h1:visible")).toBeVisible();
    if (path === "/dashboard/profile" && testInfo.project.name === "320px") {
      const back = page.getByRole("link", { name: "Dasbor", exact: true });
      await expect(back).toBeVisible();
      const size = await back.boundingBox();
      expect(size?.width).toBeGreaterThan(65);
    }
    const widths = await page.evaluate(() => ({ content: document.documentElement.scrollWidth, viewport: innerWidth }));
    expect(widths.content).toBeLessThanOrEqual(widths.viewport + 1);
    await page.screenshot({ path: testInfo.outputPath(`${path.includes("profile") ? "profile" : "team-edit"}.png`), fullPage: true });
  }
});

test("perubahan profil tersimpan pada backend uji dan bertahan setelah refresh", async ({ page }) => {
  await page.goto("/dashboard/profile");
  await page.getByLabel("Nama tampilan", { exact: true }).fill("Nama Uji Mobile");
  await page.getByRole("button", { name: "Simpan profil" }).click();
  await expect(page.getByRole("status")).toContainText("Profil tersimpan");
  await page.reload();
  await expect(page.getByLabel("Nama tampilan", { exact: true })).toHaveValue("Nama Uji Mobile");
});

test("refresh mempertahankan sesi dan logout menutup akses halaman akun", async ({ page }) => {
  await page.goto("/dashboard");
  await page.reload();
  await expect(page.getByRole("heading", { name: "Dasbor Saya", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Keluar", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.goto("/dashboard/profile");
  await expect(page).toHaveURL(/\/login$/);
  await page.locator("#login-email").fill("mobile-test@example.com");
  await page.locator("#login-password").fill("Isolated-test-password-123");
  await page.getByRole("button", { name: "Masuk", exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await page.reload();
  await expect(page.getByRole("heading", { name: "Dasbor Saya", exact: true })).toBeVisible();
});

test("edit tim menyimpan perubahan pada backend uji", async ({ page }) => {
  await page.goto("/dashboard/tim/mobile-team/edit");
  await page.locator("#team-title").fill("Tim Pengujian Tampilan Diperbarui");
  await page.getByRole("button", { name: "Simpan Perubahan", exact: true }).click();
  await expect(page).toHaveURL(/\/tim\/mobile-team$/);
  await expect(page.getByRole("heading", { name: "Tim Pengujian Tampilan Diperbarui", exact: true })).toBeVisible();
  await page.goto("/dashboard/tim/mobile-team/edit");
  await expect(page.locator("#team-title")).toHaveValue("Tim Pengujian Tampilan Diperbarui");
});

test("seluruh tombol editor terbit termasuk hapus muat di layar", async ({ page, request }, testInfo) => {
  await request.get(`${backendUrl}/__test/mode?value=published-project`);
  await page.goto("/dashboard/projects/published-audit/edit");
  await expect(page.getByRole("button", { name: "Hapus proyek", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Simpan perubahan publik", exact: true })).toBeVisible();
  const layout = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  if (layout.viewport < 640) {
    const save = await page.getByRole("button", { name: "Simpan perubahan publik", exact: true }).boundingBox();
    expect(save?.width).toBeGreaterThanOrEqual(layout.viewport - 42);
  }
  await page.screenshot({ path: testInfo.outputPath("published-with-delete.png"), fullPage: true, caret: "initial" });
  expect(layout.content, JSON.stringify(layout)).toBeLessThanOrEqual(layout.viewport + 1);
});
