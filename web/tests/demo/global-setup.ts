/**
 * Global setup: bersihkan .data-playwright sebelum tiap full test run.
 *
 * Ini memastikan tiap run dimulai dari state bersih -- tidak ada intro, tim,
 * atau proyek dari run sebelumnya yang bisa mengganggu test berikutnya.
 *
 * Data dibersihkan dengan menulis array kosong, bukan menghapus file, supaya
 * server Next.js yang sudah berjalan tidak error karena file hilang.
 */
import { existsSync, writeFileSync, mkdirSync, renameSync } from "node:fs";
import path from "node:path";

export default function globalSetup() {
  // Resolve dari cwd (direktori web/) karena globalSetup dipanggil dari sana.
  const dataDir = path.resolve(process.cwd(), ".data-playwright");

  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }

  // Reset semua file storage ke array kosong.
  for (const file of ["teams.json", "team-requests.json", "team-discussions.json", "projects.json"]) {
    const destination = path.join(dataDir, file);
    const temporary = `${destination}.reset.tmp`;
    writeFileSync(temporary, "[]", "utf8");
    renameSync(temporary, destination);
  }
}
