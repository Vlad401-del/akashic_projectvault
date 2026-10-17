import Link from "next/link";
import { notFound } from "next/navigation";

import { ProjectCard } from "@/components/project-card";
import { ProfileHeader } from "@/components/profile-header";
import { SiteBrand } from "@/components/site-brand";
import { getPublicProfile, getPublicProjects } from "@/lib/content";
import { profiles } from "@/lib/fixtures/fixtures";

/**
 * Daftar rute profil dibuat saat build karena sumber data tahap 1 adalah
 * fixture. Username yang tidak ada di daftar tetap ditangani `notFound()` di
 * dalam halaman.
 */
export function generateStaticParams() {
  return profiles.map((profile) => ({ username: profile.username }));
}

/**
 * Rute ini tidak memakai prerender parsial supaya `notFound()` benar-benar
 * membalas HTTP 404 (lihat penjelasan di `next.config.ts`).
 */
export async function generateMetadata({ params }: PageProps<"/u/[username]">) {
  const { username } = await params;
  const profile = getPublicProfile(username);

  if (!profile) {
    return { title: "Profil tidak ditemukan" };
  }

  return {
    title: profile.displayName,
    description: `${profile.headline}. ${profile.bio}`,
  };
}

export default async function PublicProfilePage({ params }: PageProps<"/u/[username]">) {
  const { username } = await params;
  const profile = getPublicProfile(username);

  // Profil yang belum aktif tampil publik atau username yang salah sama-sama
  // menghasilkan not-found, supaya keberadaan profil privat tidak bocor.
  if (!profile) {
    notFound();
  }

  const projects = getPublicProjects(profile);

  return (
    <>
      <div className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-4 px-4 py-4">
          <SiteBrand />
          <p className="text-xs text-ink-muted">Profil publik (local)</p>
        </div>
      </div>

      <div className="mx-auto max-w-[1120px] px-4 py-8 sm:py-10">
        <ProfileHeader profile={profile} />

        <section aria-labelledby="daftar-proyek" className="mt-10">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 id="daftar-proyek" className="text-xl font-semibold tracking-tight text-ink">
              Proyek
            </h2>
            {projects.length > 0 ? (
              <p className="text-sm text-ink-muted">{projects.length} proyek tampil pada portofolio lokal</p>
            ) : null}
          </div>

          {projects.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-line bg-surface px-6 py-14 text-center">
              <h3 className="text-base font-semibold text-ink">Belum ada karya yang diterbitkan</h3>
              <p className="mx-auto mt-2 max-w-[54ch] text-sm leading-relaxed text-ink-muted">
                Profil ini sudah tampil publik, tetapi pemiliknya belum menerbitkan proyek. Silakan kembali lagi
                nanti untuk membaca studi kasus yang sedang disiapkan.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {projects.map((project) => (
                <ProjectCard key={project.slug} project={project} username={profile.username} />
              ))}
            </div>
          )}
        </section>

        <p className="mt-10 text-sm text-ink-muted">
          Ingin melihat contoh lain?{" "}
          <Link href="/" className="font-medium text-accent underline decoration-line hover:decoration-accent">
            Kembali ke halaman awal
          </Link>
        </p>
      </div>
    </>
  );
}
