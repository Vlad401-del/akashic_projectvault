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
