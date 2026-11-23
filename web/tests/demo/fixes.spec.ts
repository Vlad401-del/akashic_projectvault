/**
 * Test untuk tiga perbaikan:
 * 1. Lock status "diterima" di UI -- tombol Tolak/Diskusi dinonaktifkan setelah Terima.
 * 2. SkillPicker -- pilih saran via keyboard dan klik.
 * 3. extractCategory / extractDetail / competitionCategory -- fungsi asli dari lib.
 *
 * Catatan tes DB:
 * Mode demo tidak terhubung ke Supabase, sehingga aturan trigger DB
 * (lock_accepted_intro_review) tidak dapat dibuktikan di sini.
 * Aturan DB diuji terpisah pada Supabase dengan dua identitas akun dalam transaksi
 * yang dibatalkan (ROLLBACK), sehingga data uji tidak menetap.
 *
 * Catatan tes sentuh (touch):
 * Uji mobile memakai locator.tap() agar benar-benar mengirim interaksi sentuh.
 */
import { expect, test } from "@playwright/test";
import {
  extractCategory,
  extractDetail,
  ACTIVE_DROPDOWN_CATS,
} from "@/lib/competition-category";
import { competitionCategory } from "@/lib/team-filter";

// ─── Unit: extractCategory, extractDetail, competitionCategory (kode asli) ───

test("extractCategory: mengenali kategori lomba dan detailnya", () => {
  expect(extractCategory("GEMASTIK 2027 Kategori UX Design")).toBe("GEMASTIK");
  expect(extractDetail("GEMASTIK 2027 Kategori UX Design")).toBe("2027 Kategori UX Design");
  expect(extractCategory("PKM-KC 2027")).toBe("PKM");
  expect(extractDetail("PKM-KC 2027")).toBe("-KC 2027");
  expect(extractCategory("Hackathon Web3")).toBe("Hackathon");
  expect(extractDetail("Hackathon Web3")).toBe("Web3");
  expect(extractCategory("Lainnya olimpiade sains")).toBe("Lainnya");
  expect(extractDetail("Lainnya olimpiade sains")).toBe("olimpiade sains");

  // Teks bebas tanpa prefix -- tidak ada kategori dikenal
  expect(extractCategory("lomba bebas")).toBe("");
  expect(extractDetail("lomba bebas")).toBe("lomba bebas");

  expect(ACTIVE_DROPDOWN_CATS).toEqual(["GEMASTIK", "PKM", "Hackathon", "Lainnya"]);
});

test("competitionCategory: prefix Lainnya tidak salah masuk filter PKM atau Hackathon", () => {
  // Kasus kritis: detail menyebut kata "PKM" tapi prefix-nya "Lainnya"
  expect(competitionCategory("Lainnya lomba yang mirip PKM")).toBe("Lainnya");
  expect(competitionCategory("Lainnya hackathon internal kampus")).toBe("Lainnya");
  expect(competitionCategory("Lainnya gemastik palsu")).toBe("Lainnya");

  // Prefix yang benar tetap bekerja
  expect(competitionCategory("PKM-KC 2027")).toBe("PKM");
  expect(competitionCategory("GEMASTIK 2027")).toBe("GEMASTIK");
  expect(competitionCategory("Hackathon Web3 Kampus")).toBe("Hackathon");

  // Data lama tanpa prefix -- fallback substring masih jalan
  expect(competitionCategory("lomba pkm kampus 2024")).toBe("PKM");
  expect(competitionCategory("even hackathon nasional")).toBe("Hackathon");
  expect(competitionCategory("lomba desain bebas")).toBe("Lainnya");
});

// ─── Fix 1: tombol Tolak/Diskusi dinonaktifkan setelah status = "diterima" ───

test("tombol Tolak dan Diskusi dinonaktifkan setelah pelamar diterima", async ({ page }, testInfo) => {
  const token = `${Date.now().toString(36)}-${testInfo.project.name.replace(/\W/g, "")}`;
  const title = `Tim lock-test ${token}`;
  const sender = `Pelamar Lock ${token}`;

  await page.goto("/dashboard/tim/baru");
  await page.locator("#team-title").fill(title);
  await page.locator("#team-comp-category").selectOption("Hackathon");
  await page.locator("#team-summary").fill("Tim uji untuk verifikasi lock status diterima.");
  await page.locator("select").nth(1).selectOption("UI/UX Designer");
  await page.getByPlaceholder("Cari atau tambah keahlian…").fill("Figma");
  await page.getByPlaceholder("Cari atau tambah keahlian…").press("Enter");
  await page.locator("#team-current").fill("1");
  await page.locator("#team-target").fill("3");
  await page.locator("#team-hours").fill("5");
  await page.locator("#team-deadline").fill(new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10));
  await page.getByRole("button", { name: "Terbitkan Pencarian Tim" }).click();
  await expect(page).toHaveURL(/\/tim\/tim-lock-test-/);

  await page.locator("#intro-name").fill(sender);
  await page.locator("#intro-hours").fill("5");
  await page.locator("#intro-contact").fill("lock@example.com");
  await page.locator("#intro-bring").fill("Pengalaman mendesain antarmuka aplikasi mobile.");
  await page.locator("#intro-proof").fill("https://example.com/portofolio-lock");
  await page.getByRole("checkbox", { name: /Saya setuju kontak/ }).check();
  await page.getByRole("button", { name: "Kirim Perkenalan" }).click();
  await expect(page.getByRole("heading", { name: "Perkenalan Terkirim!" })).toBeVisible();

  await page.goto("/dashboard");
  await expect(page.getByText(sender, { exact: true })).toBeVisible();
  const applicant = page.locator("div.rounded-xl").filter({ hasText: sender }).filter({ hasText: title }).first();

  // Sebelum Terima: Tolak dan Diskusi harus aktif.
  await expect(applicant.getByRole("button", { name: "Tolak" })).not.toBeDisabled();
  await expect(applicant.getByRole("button", { name: "Sedang Diskusi" })).not.toBeDisabled();

  await applicant.getByRole("button", { name: "Terima" }).click();
  await expect(applicant.getByText("Anggota tim", { exact: true })).toBeVisible();

  // Setelah Terima: Tolak dan Diskusi harus disabled.
  await expect(applicant.getByRole("button", { name: "Tolak" })).toBeDisabled();
  await expect(applicant.getByRole("button", { name: "Sedang Diskusi" })).toBeDisabled();
  await expect(applicant.getByRole("button", { name: "Terima" })).toBeDisabled();
});

// ─── Fix 2: SkillPicker -- keyboard ───

test("SkillPicker: pilih saran dari dropdown via keyboard Tab+Enter", async ({ page }) => {
  await page.goto("/dashboard/tim/baru");

  const input = page.getByPlaceholder("Cari atau tambah keahlian…");
  await input.fill("Figma");
  await expect(page.getByText("Figma", { exact: true }).first()).toBeVisible();

  // Tab ke tombol saran pertama, Enter untuk pilih.
  await input.press("Tab");
  await page.keyboard.press("Enter");

  await expect(page.locator("button.rounded-full", { hasText: "Figma" })).toBeVisible();
});

test("SkillPicker: pilih saran dari dropdown dengan klik", async ({ page }) => {
  await page.goto("/dashboard/tim/baru");

  const input = page.getByPlaceholder("Cari atau tambah keahlian…");
  await input.fill("React");
  await expect(page.getByText("React", { exact: true }).first()).toBeVisible();
  await page.getByText("React", { exact: true }).first().click();

  await expect(page.locator("button.rounded-full", { hasText: "React" })).toBeVisible();
});

test("SkillPicker: pilih saran dengan sentuhan di mobile", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chrome", "Uji sentuh hanya untuk perangkat mobile");
  await page.goto("/dashboard/tim/baru");

  const input = page.getByPlaceholder("Cari atau tambah keahlian…");
  await input.fill("React");
  await page.getByText("React", { exact: true }).first().tap();

  await expect(page.locator("button.rounded-full", { hasText: "React" })).toBeVisible();
});

// ─── Fix 3: Kategori "Lainnya" pada form tim ───

test("form baru pilih Lainnya: dropdown tetap Lainnya setelah isi detail", async ({ page }) => {
  // Verifikasi perilaku form untuk kategori "Lainnya".
  await page.goto("/dashboard/tim/baru");

  await page.locator("#team-comp-category").selectOption("Lainnya");
  const detailInput = page.locator("#team-comp");
  await expect(detailInput).toHaveValue("");
  await detailInput.fill("2025 kategori sistem informasi");
  await expect(detailInput).toHaveValue("2025 kategori sistem informasi");
  // Dropdown harus tetap "Lainnya" setelah isi detail -- tidak berubah ke kosong.
  await expect(page.locator("#team-comp-category")).toHaveValue("Lainnya");
});

test("form baru: detail Lainnya tetap ada saat kategori diganti", async ({
  page,
}) => {
  await page.goto("/dashboard/tim/baru");

  await page.locator("#team-comp-category").selectOption("Lainnya");
  await page.locator("#team-comp").fill("2027 lomba internal kampus");

  // Dropdown harus menampilkan "Lainnya".
  await expect(page.locator("#team-comp-category")).toHaveValue("Lainnya");
  // Field detail harus memuat teks yang ada.
  await expect(page.locator("#team-comp")).toHaveValue("2027 lomba internal kampus");

  // Edit detail -- kategori tidak boleh berubah.
  await page.locator("#team-comp").fill("2027 lomba internal kampus (revisi)");
  await expect(page.locator("#team-comp-category")).toHaveValue("Lainnya");
  await expect(page.locator("#team-comp")).toHaveValue("2027 lomba internal kampus (revisi)");

  // Ganti ke kategori lain lalu kembali ke "Lainnya" -- detail harus tetap ada.
  await page.locator("#team-comp-category").selectOption("PKM");
  await expect(page.locator("#team-comp")).toHaveValue("2027 lomba internal kampus (revisi)");
  await page.locator("#team-comp-category").selectOption("Lainnya");
  await expect(page.locator("#team-comp")).toHaveValue("2027 lomba internal kampus (revisi)");
});
