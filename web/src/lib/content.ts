/**
 * Pemilih data (selector) untuk halaman publik.
 *
 * Semua aturan visibilitas publik terkumpul di sini supaya halaman tinggal
 * memanggil fungsi ini dan tidak menulis ulang logikanya:
 * - Profil privat tidak dapat dibuka pengunjung anonim.
 * - Proyek hanya tampil bila profil publik DAN status proyek `published`.
 * - Draft tidak dapat dibuka lewat URL langsung meskipun slug-nya diketahui.
 *
 * Sejak editor dapat menyimpan, sumber data bukan hanya fixture: proyek hasil
 * editor disimpan di berkas lokal (lihat `src/lib/local-store.ts`) dan
 * digabungkan di fungsi `mergeProjects` pada berkas ini.
 *
 * Saat Supabase dipakai (tahap 2), isi berkas ini diganti kueri ke database
 * dengan aturan yang sama, sedangkan komponen UI tetap tidak berubah.
 */
import { profiles } from "@/lib/fixtures/fixtures";
import type { Profile, Project } from "@/lib/fixtures/types";
import { readStoredProjects } from "@/lib/local-store";

/**
 * Menggabungkan proyek fixture dengan proyek yang tersimpan di berkas lokal.
 *
 * Proyek tersimpan dengan slug yang sama menimpa fixture (jadi hasil edit
 * langsung terlihat), sedangkan slug yang belum ada ditambahkan di depan supaya
 * proyek yang baru dibuat mudah ditemukan.
 */
function mergeProjects(username: string, fixtureProjects: Project[]): Project[] {
  const stored = readStoredProjects().filter((item) => item.ownerUsername === username);
  const fixtureSlugs = new Set(fixtureProjects.map((project) => project.slug));

  const fixtureWithOverrides = fixtureProjects.map(
    (project) => stored.find((item) => item.project.slug === project.slug)?.project ?? project,
  );

  const added = stored
    .filter((item) => !fixtureSlugs.has(item.project.slug))
    .map((item) => item.project)
    .reverse();

  return [...added, ...fixtureWithOverrides];
}

/** Benar bila proyek ini dibuat lewat editor dan tersimpan di berkas lokal. */
export function isStoredProject(username: string, slug: string): boolean {
  return readStoredProjects().some(
    (item) => item.ownerUsername === username && item.project.slug === slug,
  );
}

/** Jumlah proyek hasil editor yang tersimpan untuk satu pemilik. */
export function countStoredProjects(username: string): number {
  return readStoredProjects().filter((item) => item.ownerUsername === username).length;
}

export function getPublicProfile(username: string): Profile | null {
  const profile = profiles.find((item) => item.username === username);

  if (!profile || !profile.isPublished) {
    return null;
  }

  return { ...profile, projects: mergeProjects(profile.username, profile.projects) };
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

/**
 * Daftar username yang dikenal saat build: fixture ditambah pemilik proyek
 * hasil editor, supaya `generateStaticParams` tidak melewatkan halaman pemilik.
 */
export function listKnownProfileRoutes(): string[] {
  const usernames = profiles.map((profile) => profile.username);

  for (const item of readStoredProjects()) {
    if (!usernames.includes(item.ownerUsername)) {
      usernames.push(item.ownerUsername);
    }
  }

  return usernames;
}

/**
 * Daftar rute proyek yang dikenal saat build.
 *
 * Fixture didaftarkan seluruhnya, termasuk proyek draft, supaya aturan
 * visibilitas benar-benar diuji menghasilkan 404. Proyek hasil editor
 * ditambahkan agar halaman publiknya sudah tersedia sejak build.
 */
export function listKnownProjectRoutes(): { username: string; slug: string }[] {
  const routes = profiles.flatMap((profile) =>
    profile.projects.map((project) => ({ username: profile.username, slug: project.slug })),
  );
  const seen = new Set(routes.map((route) => `${route.username}/${route.slug}`));

  for (const item of readStoredProjects()) {
    const key = `${item.ownerUsername}/${item.project.slug}`;

    if (!seen.has(key)) {
      routes.push({ username: item.ownerUsername, slug: item.project.slug });
      seen.add(key);
    }
  }

  return routes;
}

/** Dipakai halaman akar untuk menampilkan daftar portofolio contoh. */
export function listPublicProfiles(): Profile[] {
  return profiles
    .filter((profile) => profile.isPublished)
    .map((profile) => ({ ...profile, projects: mergeProjects(profile.username, profile.projects) }));
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

  return { ...owner, projects: mergeProjects(owner.username, owner.projects) };
}

/** Seluruh proyek pemilik, termasuk yang masih draft. */
export function listOwnedProjects(): Project[] {
  return getDemoOwner().projects;
}

/** Proyek pemilik berdasarkan slug, tanpa menyaring status draft. */
export function getOwnedProject(slug: string): Project | null {
  return listOwnedProjects().find((project) => project.slug === slug) ?? null;
}
