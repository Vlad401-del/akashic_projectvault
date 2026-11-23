import { expect, test } from "@playwright/test";

const routes = [
  "/", "/tim", "/tim/gemastik-2027-analitik-komplain", "/login", "/register", "/forgot-password",
  "/u/nadia", "/u/rangga", "/u/nadia/p/dashboard-penjualan-ritel",
  "/dashboard", "/dashboard/projects/new", "/dashboard/projects/dashboard-penjualan-ritel/edit", "/dashboard/tim/baru",
];

for (const width of [320, 390, 768, 1440]) {
  test(`seluruh halaman muat pada lebar ${width}px`, async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    await page.setViewportSize({ width, height: 850 });
    const failures: string[] = [];
    page.on("pageerror", (error) => failures.push(`Browser: ${error.message}`));
    page.on("console", (message) => {
      if (message.type() === "error" && /hydrat/i.test(message.text())) failures.push(`Hydration: ${message.text()}`);
    });
    for (const path of routes) {
      const response = await page.goto(path);
      if (response?.status() !== 200) failures.push(`${path}: HTTP ${response?.status()}`);
      await page.locator("h1:visible").first().waitFor();
      const layout = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        content: document.documentElement.scrollWidth,
        outside: Array.from(document.querySelectorAll("input,select,textarea,button"))
          .filter((el) => {
            const r = el.getBoundingClientRect();
            return r.width > 0 && r.height > 0 && (r.right > innerWidth + 1 || r.left < -1);
          }).map((el) => el.getAttribute("aria-label") || el.textContent?.trim().slice(0, 70) || el.tagName),
      }));
      if (layout.content > layout.viewport + 1 || layout.outside.length) failures.push(`${path}: ${JSON.stringify(layout)}`);
      // Hiding the caret mutates inline styles and can race React hydration in dev.
      if (width === 390 || width === 1440) await page.screenshot({ path: testInfo.outputPath(`${path.replace(/\W/g, "_") || "home"}.png`), fullPage: true, caret: "initial" });
    }
    expect(failures).toEqual([]);
  });
}

test("menu ponsel memberi akses ke fitur desktop dan dapat ditutup", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 850 });
  for (const path of ["/", "/tim", "/u/nadia"]) {
    await page.goto(path);
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
  }
});

test("kontrol formulir tim cukup besar untuk disentuh pada ponsel", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 850 });
  await page.goto("/dashboard/tim/baru");
  await expect(page.getByRole("combobox", { name: "Nama peran", exact: false })).toHaveCount(1);
  await expect(page.getByRole("textbox", { name: "Keahlian yang diharapkan", exact: false })).toHaveCount(1);
  const tooSmall = await page.locator(".team-post-form").evaluate((form) =>
    Array.from(form.querySelectorAll("button, select, input:not([type=hidden])"))
      .filter((element) => { const box = element.getBoundingClientRect(); return box.width > 0 && box.height > 0 && box.height < 44; })
      .map((element) => element.getAttribute("id") || element.textContent?.trim()),
  );
  expect(tooSmall).toEqual([]);
});

test("editor proyek terbit tidak melebar pada layar ponsel", async ({ page }, testInfo) => {
  for (const width of [320, 390, 414]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/dashboard/projects/dashboard-penjualan-ritel/edit");
    await page.getByRole("textbox", { name: "Judul proyek", exact: true }).fill("Uji deployment Akashic 23 Nov 2026 dengan judul yang panjang");
    await expect(page.getByRole("button", { name: "Simpan perubahan publik", exact: true })).toBeVisible();
    const layout = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
      outside: Array.from(document.querySelectorAll("button,a,input,select,textarea"))
        .filter((element) => { const box = element.getBoundingClientRect(); return box.width > 0 && box.height > 0 && (box.right > document.documentElement.clientWidth + 1 || box.left < -1); })
        .map((element) => ({ text: element.textContent?.trim().slice(0, 80), width: element.getBoundingClientRect().width })),
    }));
    await page.screenshot({ path: testInfo.outputPath(`published-editor-${width}.png`), fullPage: true, caret: "initial" });
    expect(layout.content, JSON.stringify(layout)).toBeLessThanOrEqual(layout.viewport + 1);
    expect(layout.outside).toEqual([]);
  }
});

test("pratinjau dan isian editor tetap nyaman pada ponsel kecil", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/dashboard/projects/new");
  const title = page.getByRole("textbox", { name: /Judul proyek/ });
  await expect(title).toHaveCSS("font-size", "16px");
  await page.getByRole("button", { name: "Pratinjau", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Pratinjau proyek" });
  await expect(dialog).toBeVisible();
  const close = dialog.getByRole("button", { name: "Tutup pratinjau" });
  const box = await close.boundingBox();
  expect(box?.height).toBeGreaterThanOrEqual(44);
  expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(320);
  await close.click();
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("button", { name: "Pratinjau", exact: true })).toBeFocused();
  const compactPreview = page.locator("details").filter({ hasText: "Lihat pratinjau ringkas" });
  await expect(compactPreview).not.toHaveAttribute("open");
  await compactPreview.locator("summary").click();
  await expect(compactPreview).toHaveAttribute("open", "");
  await compactPreview.locator("summary").click();
  await title.fill(`Uji mobile ${Date.now()}`);
  await page.getByRole("textbox", { name: /Ringkasan/ }).fill("Proyek uji untuk memeriksa perpindahan langkah pada layar ponsel.");
  await page.getByRole("button", { name: "Lanjut", exact: true }).click();
  const nextStep = page.getByRole("region", { name: "Langkah 2: Masalah & proses" });
  await expect(nextStep).toBeFocused();
  const nextBox = await nextStep.boundingBox();
  expect(nextBox?.y).toBeGreaterThanOrEqual(64);
  expect(nextBox?.y).toBeLessThan(150);
});

test("fokus keyboard tetap di dalam pratinjau dan kembali ke tombol pembuka", async ({ page }) => {
  await page.goto("/dashboard/projects/new");
  const opener = page.getByRole("button", { name: "Pratinjau", exact: true });
  await opener.click();
  const dialog = page.getByRole("dialog", { name: "Pratinjau proyek" });
  await expect(dialog.getByRole("button", { name: "Tutup pratinjau" })).toBeFocused();
  for (const key of ["Shift+Tab", "Tab", "Tab", "Tab"]) {
    await page.keyboard.press(key);
    expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});

test("tautan berbagi memakai username pemilik, bukan dashboard", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/dashboard");
  const link = page.getByRole("textbox", { name: "Tautan portofolio publik" });
  await expect(link).toHaveValue("https://akashic-projectvault.vercel.app/u/nadia");
  await page.getByRole("button", { name: "Salin tautan portofolio" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Tautan portofolio tersalin." })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("https://akashic-projectvault.vercel.app/u/nadia");
});

test("penolakan clipboard menyediakan tautan yang bisa disalin manual", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async () => { throw new Error("denied"); } } });
  });
  await page.goto("/dashboard");
  await page.getByRole("button", { name: "Salin tautan portofolio" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Penyalinan otomatis belum berhasil" })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Tautan portofolio publik" })).toHaveValue("https://akashic-projectvault.vercel.app/u/nadia");
});
