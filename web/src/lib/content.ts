/**
 * Pemilih data (selector) untuk halaman publik.
 *
 * Semua aturan visibilitas publik terkumpul di sini supaya halaman tinggal
 * memanggil fungsi ini dan tidak menulis ulang logikanya:
 * - Profil privat tidak dapat dibuka pengunjung anonim.
 * - Proyek hanya tampil bila profil publik DAN status proyek `published`.
 * - Draft tidak dapat dibuka lewat URL langsung meskipun slug-nya diketahui.
 *
 * Saat Supabase dipakai (tahap 2), isi berkas ini diganti kueri ke database
 * dengan aturan yang sama, sedangkan komponen UI tetap tidak berubah.
 */
import { profiles } from "@/lib/fixtures/fixtures";
import type { Profile, Project } from "@/lib/fixtures/types";

export function getPublicProfile(username: string): Profile | null {
  const profile = profiles.find((item) => item.username === username);

  if (!profile || !profile.isPublished) {
    return null;
  }

  return profile;
}

export function getPublicProjects(profile: Profile): Project[] {
  return profile.projects.filter((project) => project.status === "published");
}

export function getPublicProject(profile: Profile, slug: string): Project | null {
  return getPublicProjects(profile).find((project) => project.slug === slug) ?? null;
}

export function getOtherPublicProjects(profile: Profile, slug: string): Project[] {
  return getPublicProjects(profile).filter((project) => project.slug !== slug);
}

/** Dipakai halaman akar untuk menampilkan daftar portofolio contoh. */
export function listPublicProfiles(): Profile[] {
  return profiles.filter((profile) => profile.isPublished);
}

/**
 * Akun yang dipakai sebagai pemilik pada tahap UI.
 *
 * Autentikasi baru masuk tahap 2, jadi sampai saat itu area pemilik memakai
 * akun contoh Nadia Putri. Saat Supabase dipakai, nilai ini diganti dengan
 * identitas pengguna yang sedang login.
 */
export const DEMO_OWNER_USERNAME = "nadia";

/**
 * Pemilih data area pemilik (dashboard dan editor).
 *
 * PENTING: fungsi di bawah ini sengaja mengembalikan draft juga, karena
 * pemilik memang harus bisa membuka draftnya sendiri. Karena itu fungsi ini
 * JANGAN dipakai pada rute publik. Rute publik tetap memakai `getPublicProfile`
 * dan `getPublicProject` yang menyaring profil privat dan proyek draft.
 *
 * Saat database siap, isi berkas ini diganti kueri yang dibatasi pemilik yang
 * sedang login, bukan sekadar username tetap.
 */
export function getDemoOwner(): Profile {
  const owner = profiles.find((profile) => profile.username === DEMO_OWNER_USERNAME);

  if (!owner) {
    throw new Error(`Akun contoh pemilik "${DEMO_OWNER_USERNAME}" tidak ditemukan di fixture.`);
  }

  return owner;
}

/** Seluruh proyek pemilik, termasuk yang masih draft. */
export function listOwnedProjects(): Project[] {
  return getDemoOwner().projects;
}

/** Proyek pemilik berdasarkan slug, tanpa menyaring status draft. */
export function getOwnedProject(slug: string): Project | null {
  return listOwnedProjects().find((project) => project.slug === slug) ?? null;
}
