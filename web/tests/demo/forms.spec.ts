import { expect, test } from "@playwright/test";

test("editor menahan langkah pertama yang belum lengkap dan membuka pratinjau", async ({ page }) => {
  await page.goto("/dashboard/projects/new");
  await expect(page.getByRole("heading", { name: "Identitas proyek" })).toBeVisible();
  await page.getByRole("button", { name: "Lanjut" }).click();
  await expect(page.getByText("Judul proyek wajib diisi.")).toBeVisible();
  await expect(page.getByText("Ringkasan wajib diisi, maksimal 280 karakter.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Identitas proyek" })).toBeVisible();
  await page.getByRole("button", { name: "Pratinjau" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("form pencarian tim memeriksa rincian wajib sebelum menerbitkan", async ({ page }) => {
  await page.goto("/dashboard/tim/baru");
  await expect(page.getByRole("heading", { name: "Pasang Pencarian Anggota Tim" })).toBeVisible();
  await page.getByRole("button", { name: "Terbitkan Pencarian Tim" }).click();
  await expect(page.getByRole("alert").first()).toBeVisible();
  await expect(page.getByText("Pilih tenggat hari ini atau setelahnya.")).toBeVisible();
  await expect(page).toHaveURL(/\/dashboard\/tim\/baru$/);
});

test("dasbor dan kedua formulir pemilik tidak melebar di luar ponsel", async ({ page }) => {
  for (const path of ["/dashboard", "/dashboard/projects/new", "/dashboard/tim/baru"]) {
    await page.goto(path);
    const widths = await page.evaluate(() => ({ content: document.documentElement.scrollWidth, viewport: document.documentElement.clientWidth }));
    expect(widths.content, `${path}: ${JSON.stringify(widths)}`).toBeLessThanOrEqual(widths.viewport + 1);
  }
});

test("pencarian tersimpan, menerima perkenalan, dan dapat ditinjau", async ({ page }) => {
  const token = Date.now().toString(36);
  const title = `Tim uji Playwright ${token}`;
  const sender = `Pelamar ${token}`;
  await page.goto("/dashboard/tim/baru");
  await page.locator("#team-title").fill(title);
  await page.locator("#team-comp").fill("Lomba uji lokal");
  await page.locator("#team-summary").fill("Kami membuat prototipe untuk menguji alur pendaftaran dan kolaborasi tim secara lengkap.");
  await page.getByPlaceholder("Mis. Desainer UI/UX, Backend Dev").fill("Desainer UI");
  await page.getByPlaceholder("Mis. Figma, User Research, Wireframing").fill("Figma");
  await page.locator("#team-current").fill("1");
  await page.locator("#team-target").fill("2");
  await page.locator("#team-hours").fill("6");
  await page.locator("#team-deadline").fill(new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10));
  await page.getByRole("button", { name: "Terbitkan Pencarian Tim" }).click();
  await expect(page).toHaveURL(/\/tim\/tim-uji-playwright-/);
  await expect(page.getByRole("heading", { name: title })).toBeVisible();
  const teamUrl = page.url();

  await page.locator("#intro-name").fill(sender);
  await page.locator("#intro-hours").fill("5");
  await page.locator("#intro-contact").fill("tester@example.com");
  await page.locator("#intro-bring").fill("Saya pernah mendesain prototipe aplikasi dan menguji alur pengguna.");
  await page.getByRole("button", { name: "Kirim Perkenalan" }).click();
  await expect(page.getByText("Tambahkan tautan bukti karya HTTPS yang valid.")).toBeVisible();
  await expect(page.getByText("Setujui pembagian kontak kepada pemilik tim sebelum mengirim.")).toBeVisible();
  await page.locator("#intro-proof").fill("https://example.com/portofolio-uji");
  await page.getByRole("checkbox", { name: /Saya setuju kontak/ }).check();
  await page.getByRole("button", { name: "Kirim Perkenalan" }).click();
  await expect(page.getByRole("heading", { name: "Perkenalan Terkirim!" })).toBeVisible();

  await page.goto("/dashboard");
  await expect(page.getByText(sender, { exact: true })).toBeVisible();
  const applicant = page.locator("div.rounded-xl").filter({ hasText: sender }).first();
  await applicant.getByRole("button", { name: "Terima" }).click();
  await expect(applicant.getByText("Diterima", { exact: true })).toBeVisible();

  await page.goto(teamUrl);
  await page.locator('input[id^="diskusi-nama-"]').fill(sender);
  await page.locator('textarea[id^="diskusi-body-"]').fill("Apakah tim akan bertemu secara daring setiap minggu?");
  await page.getByRole("button", { name: "Kirim pesan" }).click();
  await expect(page.getByText("Pesan berhasil dikirim.")).toBeVisible();
  await expect(page.getByText("Apakah tim akan bertemu secara daring setiap minggu?")).toBeVisible();
});

test("editor menyimpan tiap langkah lalu menerbitkan proyek dengan bukti", async ({ page }) => {
  const title = `Studi kasus uji ${Date.now().toString(36)}`;
  await page.goto("/dashboard/projects/new");
  await page.getByRole("textbox", { name: /Judul proyek/ }).fill(title);
  await page.getByRole("textbox", { name: /Ringkasan/ }).fill("Prototipe uji untuk memastikan alur empat langkah dan publikasi karya berjalan dari awal sampai akhir.");
  await page.getByRole("button", { name: "Lanjut" }).click();
  await expect(page.getByRole("heading", { name: "Masalah dan proses" })).toBeVisible();
  await page.goto("/dashboard");
  const projectRow = page.getByRole("article").filter({ hasText: title });
  await projectRow.getByRole("link", { name: "Edit proyek" }).click();
  await expect(page.getByRole("textbox", { name: /Judul proyek/ })).toHaveValue(title);
  await page.getByRole("button", { name: "Lanjut" }).click();
  await expect(page.getByRole("heading", { name: "Masalah dan proses" })).toBeVisible();

  await page.getByRole("textbox", { name: /^Masalah/ }).fill("Alur pendaftaran tim belum pernah diuji secara menyeluruh pada layar kecil.");
  await page.getByRole("textbox", { name: "Pengantar bagian Proses" }).fill("Saya menyusun skenario, menguji formulir, lalu memeriksa hasilnya pada halaman publik.");
  await page.getByRole("button", { name: "Lanjut" }).click();
  await expect(page.getByRole("heading", { name: "Kontribusi dan hasil" })).toBeVisible();
  await page.getByRole("textbox", { name: "Pengantar bagian Kontribusi" }).fill("Saya membuat dan menjalankan skenario pengujian Playwright.");
  await page.getByRole("textbox", { name: "Pengantar bagian Hasil" }).fill("Formulir dan halaman publik dapat digunakan pada desktop serta ponsel.");
  await page.getByRole("button", { name: "Lanjut" }).click();
  await expect(page.getByRole("heading", { name: /Bukti/ }).first()).toBeVisible();

  await page.getByRole("textbox", { name: "Label" }).fill("Lihat artefak uji");
  await page.getByRole("textbox", { name: "Alamat" }).fill("https://example.com/artefak-uji");
  await page.getByRole("checkbox").nth(0).check();
  await page.getByRole("checkbox").nth(1).check();
  await page.getByRole("button", { name: "Terbitkan proyek" }).click();
  const publicLink = page.getByRole("link", { name: "Buka halaman publik" });
  await expect(publicLink).toBeVisible();
  await publicLink.click();
  await expect(page).toHaveURL(/\/u\/nadia\/p\//);
  await expect(page.getByRole("heading", { name: title, level: 1 })).toBeVisible();
  const publicUrl = page.url();
  await page.goto("/dashboard");
  await page.getByRole("article").filter({ hasText: title }).getByRole("link", { name: "Edit proyek" }).click();
  await page.getByRole("button", { name: "Tarik dari publik" }).click();
  await page.getByRole("button", { name: "Ya, tarik" }).click();
  await expect(page.getByText("Draft", { exact: true }).first()).toBeVisible();
  const hidden = await page.goto(publicUrl);
  expect(hidden?.status()).toBe(404);
});
