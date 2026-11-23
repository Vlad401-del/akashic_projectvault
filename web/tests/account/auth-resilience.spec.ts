import { expect, test } from "@playwright/test";
import { backendUrl, session } from "./mock-backend";

test.beforeEach(async ({ request }) => { await request.get(`${backendUrl}/__test/reset`); });

test("gangguan auth tidak mengalihkan dasbor ke login atau menghapus sesi", async ({ page, context, request }) => {
  await context.addCookies([{ name: "sb-127-auth-token", value: `base64-${Buffer.from(JSON.stringify(session)).toString("base64url")}`, url: "http://127.0.0.1:3103", sameSite: "Lax" }]);
  await request.get(`${backendUrl}/__test/mode?value=auth-down`);
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: "Akun belum dapat dimuat" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Dasbor Saya", exact: true })).toHaveCount(0);
  expect((await context.cookies()).some((cookie) => cookie.name === "sb-127-auth-token")).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await request.get(`${backendUrl}/__test/mode?value=ok`);
  await page.getByRole("button", { name: "Coba lagi", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Dasbor Saya", exact: true })).toBeVisible();
});

test("gagal login membedakan koneksi, sandi, dan batas percobaan serta bisa dicoba lagi", async ({ page, request }) => {
  await page.goto("/login");
  await page.locator("#login-email").fill("mobile-test@example.com");
  await page.locator("#login-password").fill("Isolated-test-password-123");
  for (const [mode, message] of [["auth-down", "Layanan login belum dapat dihubungi"], ["bad-password", "Email atau kata sandi tidak cocok"], ["rate-limit", "Terlalu banyak percobaan"]]) {
    await request.get(`${backendUrl}/__test/mode?value=${mode}`);
    await page.getByRole("button", { name: "Masuk", exact: true }).click();
    await expect(page.getByRole("alert").filter({ hasText: message })).toBeVisible();
    await expect(page.getByRole("button", { name: "Masuk", exact: true })).toBeEnabled();
    await expect(page.locator("#login-email")).toHaveValue("mobile-test@example.com");
    await expect(page).toHaveURL(/\/login$/);
  }
  await request.get(`${backendUrl}/__test/mode?value=ok`);
  await page.getByRole("button", { name: "Masuk", exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
});

test("gangguan data tampil aman dan pulih lewat coba lagi", async ({ page, context, request }) => {
  await context.addCookies([{ name: "sb-127-auth-token", value: `base64-${Buffer.from(JSON.stringify(session)).toString("base64url")}`, url: "http://127.0.0.1:3103", sameSite: "Lax" }]);
  await request.get(`${backendUrl}/__test/mode?value=data-down`);
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { name: "Halaman belum dapat dimuat" })).toBeVisible();
  await expect(page.locator("main")).not.toContainText("PRIVATE_TEST_DB_ERROR");
  await request.get(`${backendUrl}/__test/mode?value=ok`);
  await page.getByRole("button", { name: "Coba lagi", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Dasbor Saya", exact: true })).toBeVisible();
});

test("unggah mengembalikan JSON 503 saat auth terganggu, bukan 401", async ({ context, request }) => {
  await context.addCookies([{ name: "sb-127-auth-token", value: `base64-${Buffer.from(JSON.stringify(session)).toString("base64url")}`, url: "http://127.0.0.1:3103", sameSite: "Lax" }]);
  await request.get(`${backendUrl}/__test/mode?value=auth-down`);
  const response = await context.request.post("http://127.0.0.1:3103/api/project-cover", { headers: { origin: "http://127.0.0.1:3103" } });
  expect(response.status()).toBe(503);
  expect((await response.json()).error).toContain("Layanan akun belum dapat dihubungi");
});

test("pemulihan gagal karena layanan terganggu tidak disebut tautan kedaluwarsa", async ({ page, request }) => {
  await page.goto("/forgot-password");
  await request.get(`${backendUrl}/__test/mode?value=auth-down`);
  await page.getByLabel("Email", { exact: true }).fill("mobile-test@example.com");
  await page.getByRole("button", { name: "Kirim tautan pemulihan" }).click();
  await expect(page.getByRole("status")).toContainText("Layanan pemulihan belum dapat dihubungi");
  await expect(page.getByRole("button", { name: "Kirim tautan pemulihan" })).toBeEnabled();
});

test("isian profil bertahan ketika simpan terganggu dan dapat disimpan setelah pulih", async ({ page, context, request }) => {
  await context.addCookies([{ name: "sb-127-auth-token", value: `base64-${Buffer.from(JSON.stringify(session)).toString("base64url")}`, url: "http://127.0.0.1:3103", sameSite: "Lax" }]);
  await page.goto("/dashboard/profile");
  await page.getByLabel("Nama tampilan", { exact: true }).fill("Nama Tidak Hilang");
  await request.get(`${backendUrl}/__test/mode?value=auth-down`);
  await page.getByRole("button", { name: "Simpan profil" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Layanan akun belum dapat dihubungi" })).toBeVisible();
  await expect(page.getByLabel("Nama tampilan", { exact: true })).toHaveValue("Nama Tidak Hilang");
  await expect(page).toHaveURL(/\/dashboard\/profile$/);
  await request.get(`${backendUrl}/__test/mode?value=ok`);
  await page.getByRole("button", { name: "Simpan profil" }).click();
  await expect(page.getByRole("status")).toContainText("Profil tersimpan");
  await page.reload();
  await expect(page.getByLabel("Nama tampilan", { exact: true })).toHaveValue("Nama Tidak Hilang");
});
