import { expect, test } from "@playwright/test";

test("Google yang belum dikonfigurasi tidak ditawarkan pada halaman masuk dan daftar", async ({ page }) => {
  for (const path of ["/login", "/register"]) {
    await page.goto(path);
    await expect(page.getByRole("button", { name: "Masuk dengan Google", exact: true })).toHaveCount(0);
    await expect(page.locator("input[type=email]")).toBeVisible();
  }
});

test("OAuth yang dibatalkan kembali ke login dengan pesan aman", async ({ page }) => {
  await page.goto("/auth/callback?error=access_denied&error_description=PRIVATE_PROVIDER_DETAIL&next=https://example.com");
  await expect(page).toHaveURL(/\/login\?error=oauth-failed$/);
  await expect(page.getByText("Login Google dibatalkan atau belum berhasil. Coba lagi atau gunakan email dan kata sandi.")).toBeVisible();
  await expect(page.getByText("PRIVATE_PROVIDER_DETAIL")).toHaveCount(0);
});

test("Gangguan koneksi menampilkan arahan mencoba login, bukan pemulihan sandi", async ({ page }) => {
  await page.goto("/login?error=auth-unavailable");
  await expect(page.getByText("Koneksi ke layanan login terganggu. Coba masuk lagi setelah koneksi pulih.")).toBeVisible();
  await expect(page.getByText(/Tautan konfirmasi atau pemulihan sudah kedaluwarsa/)).toHaveCount(0);
});
