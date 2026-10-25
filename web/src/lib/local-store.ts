/**
 * Penyimpanan lokal sementara untuk proyek yang dibuat di editor.
 *
 * Supabase dan Docker belum tersedia, tetapi proyek yang selesai diisi di
 * editor harus benar-benar muncul di halaman publik localhost. Karena itu hasil
 * editor disimpan sebagai berkas JSON di `web/.data/projects.json`.
 *
 * Sifat penyimpanan ini, supaya tidak disangka lebih dari yang sebenarnya:
 * - Hanya ada di komputer ini, tidak masuk Git (lihat `.gitignore`), dan bukan
 *   pengganti database. Tidak ada pengguna, tidak ada hak akses.
 * - Dibaca langsung setiap kali data diminta. Berkasnya kecil dan aplikasi
 *   hanya berjalan di localhost.
 * - Berkas ini adalah lapisan tambahan di atas fixture: proyek dengan slug yang
 *   sama menimpa fixture, proyek dengan slug baru ditambahkan di depan.
 *
 * Saat Supabase dipakai (tahap 2), berkas ini dihapus dan isi
 * `src/lib/content.ts` diganti kueri database. Komponen tampilan tidak berubah.
 */
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";

import type { Project } from "@/lib/fixtures/types";
import { isLocalDemoEditorEnabled } from "@/lib/demo-mode";

/** Satu proyek tersimpan beserta pemiliknya. */
export type StoredProject = {
  ownerUsername: string;
  project: Project;
  /** Waktu simpan terakhir dalam format ISO. */
  savedAt: string;
};

const DATA_DIRECTORY = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIRECTORY, "projects.json");

/** Lokasi berkas penyimpanan lokal; dipakai pada pesan kesalahan. */
export function storeFilePath(): string {
  return DATA_FILE;
}

function isStoredProject(value: unknown): value is StoredProject {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const item = value as Partial<StoredProject>;

  return (
    typeof item.ownerUsername === "string" &&
    typeof item.savedAt === "string" &&
    typeof item.project === "object" &&
    item.project !== null &&
    typeof item.project.slug === "string" &&
    typeof item.project.title === "string"
  );
}

/**
 * Membaca seluruh proyek tersimpan.
 *
 * Berkas yang belum ada dianggap kosong. Berkas yang rusak menghasilkan
 * kesalahan yang jelas, bukan data kosong diam-diam, supaya proyek yang sudah
 * dibuat tidak seolah hilang.
 */
export function readStoredProjects(): StoredProject[] {
  if (!isLocalDemoEditorEnabled()) {
    return [];
  }

  if (!existsSync(DATA_FILE)) {
    return [];
  }

  const raw = readFileSync(DATA_FILE, "utf8").trim();

  if (raw.length === 0) {
    return [];
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(
      `Berkas penyimpanan lokal tidak dapat dibaca karena JSON-nya tidak valid: ${DATA_FILE}. Perbaiki atau hapus berkas itu, lalu simpan ulang dari editor.`,
    );
  }

  if (!Array.isArray(parsed)) {
    throw new Error(
      `Berkas penyimpanan lokal harus berisi daftar proyek: ${DATA_FILE}. Hapus berkas itu untuk memulai dari kosong.`,
    );
  }

  return parsed.filter(isStoredProject);
}

/** Menyimpan atau memperbarui satu proyek (kunci: pemilik + slug). */
export function saveStoredProject(entry: StoredProject): void {
  if (!isLocalDemoEditorEnabled()) {
    throw new Error("Penyimpanan editor demo hanya tersedia saat pengembangan lokal.");
  }

  const current = readStoredProjects();
  const index = current.findIndex(
    (item) => item.ownerUsername === entry.ownerUsername && item.project.slug === entry.project.slug,
  );

  const next =
    index >= 0
      ? current.map((item, position) => (position === index ? entry : item))
      : [...current, entry];

  writeStoredProjects(next);
}

/**
 * Menulis berkas secara utuh lewat berkas sementara.
 *
 * Tujuannya supaya proses yang terputus di tengah penulisan tidak meninggalkan
 * berkas setengah jadi yang membuat seluruh proyek tidak terbaca.
 */
function writeStoredProjects(entries: StoredProject[]): void {
  mkdirSync(DATA_DIRECTORY, { recursive: true });

  const temporary = `${DATA_FILE}.tmp`;
  writeFileSync(temporary, `${JSON.stringify(entries, null, 2)}\n`, "utf8");
  renameSync(temporary, DATA_FILE);
}
