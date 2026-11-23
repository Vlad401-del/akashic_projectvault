import { expect, test } from "@playwright/test";

const publicProfile = "/u/user-8373091f28e644979447648d";
const publicProject = `${publicProfile}/p/website-pembelajaran-mandiri`;

test("pengunjung dapat membuka jalur utama tanpa galat browser", async ({ page }) => {
  const browserErrors: string[] = [];
  page.on("pageerror", (error) => browserErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && /hydrat/i.test(message.text())) browserErrors.push(message.text());
  });

  for (const path of ["/", "/tim", "/login", "/register", "/forgot-password", publicProfile, publicProject]) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
  }
  expect(browserErrors).toEqual([]);
});

test("halaman akun mengarahkan pengunjung ke login", async ({ page }) => {
  for (const path of ["/dashboard", "/dashboard/profile", "/dashboard/projects/new", "/dashboard/tim/baru", "/dashboard/tim/tidak-ada/edit"]) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("heading", { name: "Masuk ke Akashic" })).toBeVisible();
  }
});

test("navigasi pengunjung menampilkan satu tombol Masuk", async ({ page }) => {
  for (const path of ["/", "/tim", publicProfile]) {
    await page.goto(path);
    const topBar = page.locator(".sticky.top-0").first();
    await expect(topBar.getByRole("link", { name: "Masuk" })).toBeVisible();
    await expect(topBar.getByRole("link", { name: "Daftar" })).toHaveCount(0);
    await expect(topBar.getByText("Akun", { exact: true })).toHaveCount(0);
  }
});

test("draft, profil privat, dan tim tak dikenal tidak terbuka", async ({ page }) => {
  for (const path of [
    `${publicProfile}/p/akashic`,
    "/u/user-8eea12a1938e4a21b3fd67c7",
    "/tim/tidak-ada",
  ]) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(404);
  }
});

test("form login dan pendaftaran menandai isian wajib", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: /^Masuk$/ }).click();
  await expect(page.getByText("Isi alamat email Anda.")).toBeVisible();
  await expect(page.getByText("Isi kata sandi Anda.")).toBeVisible();

  await page.getByRole("link", { name: "Daftar gratis" }).click();
  await expect(page).toHaveURL(/\/register$/);
  await page.getByRole("button", { name: "Buat akun" }).click();
  await expect(page.locator("[aria-invalid='true']").first()).toBeVisible();
});

test("tombol sandi dan tautan pemulihan dapat digunakan", async ({ page }) => {
  await page.goto("/login");
  const password = page.locator("#login-password");
  await expect(password).toHaveAttribute("type", "password");
  await page.getByRole("button", { name: "Lihat kata sandi" }).click();
  await expect(password).toHaveAttribute("type", "text");
  await page.getByRole("button", { name: "Sembunyikan kata sandi" }).click();
  await expect(password).toHaveAttribute("type", "password");
  await page.getByRole("link", { name: "Lupa kata sandi?" }).click();
  await expect(page).toHaveURL(/\/forgot-password$/);
  await expect(page.getByRole("heading", { name: "Pulihkan kata sandi" })).toBeVisible();
});

test("navigasi studi kasus menuju bagian yang ada dan tautan aman", async ({ page }) => {
  await page.goto(publicProject);
  const sectionLinks = page.getByRole("navigation", { name: "Di halaman ini" }).locator("a");
  for (const href of await sectionLinks.evaluateAll((links) => links.map((link) => link.getAttribute("href")))) {
    expect(href).toMatch(/^#[a-z-]+$/);
    await expect(page.locator(href!)).toHaveCount(1);
  }
  const unsafe = await page.locator('a[href^="javascript:"], a[href^="data:"]').count();
  expect(unsafe).toBe(0);
});

test("papan tim menampilkan keadaan kosong atau filter yang dapat direset", async ({ page }) => {
  await page.goto("/tim");
  const search = page.getByRole("searchbox", { name: "Kata kunci" });
  if (await search.count() === 0) {
    await expect(page.getByText("Belum ada pencarian tim yang terbuka saat ini.")).toBeVisible();
    await expect(page.getByRole("link", { name: "Buat Pencarian Tim" })).toHaveAttribute("href", "/dashboard/tim/baru");
    return;
  }
  await search.fill("kata-yang-tidak-ada-92843");
  await expect(page.getByText("Tidak ada tim yang cocok dengan filter Anda")).toBeVisible();
  await page.getByRole("button", { name: "Hapus semua filter" }).click();
  await expect(search).toHaveValue("");
});

test("contoh tim dapat dibaca tanpa membuka pengajuan palsu", async ({ page }) => {
  await page.goto("/tim");
  const examples = page.getByRole("heading", { name: "Contoh pencarian tim" });
  test.skip(await examples.count() === 0, "Papan sudah memiliki pencarian nyata.");
  await expect(page.getByText("Contoh tampilan · data fiktif").first()).toBeVisible();
  await page.getByRole("link", { name: "Lihat contoh detail tim" }).first().click();
  await expect(page.getByText("Tim ini tidak menerima pengajuan atau pesan.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Kirim Perkenalan" })).toHaveCount(0);
});

test("halaman utama tidak melebar di luar layar", async ({ page }) => {
  for (const path of ["/", "/tim", "/login", "/register", publicProfile, publicProject]) {
    await page.goto(path);
    await expect(page.locator("body")).toHaveCSS("font-family", /sans/);
    const widths = await page.evaluate(() => ({
      content: document.documentElement.scrollWidth,
      viewport: document.documentElement.clientWidth,
    }));
    expect(widths.content, `${path}: ${JSON.stringify(widths)}`).toBeLessThanOrEqual(widths.viewport + 1);
  }
});
