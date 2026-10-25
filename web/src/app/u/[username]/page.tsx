import { notFound } from "next/navigation";

import { Icon } from "@/components/icons";
import { ProfileHeader } from "@/components/profile-header";
import { ProjectCard } from "@/components/project-card";
import { PrototypeNotice } from "@/components/prototype-notice";
import { OwnerChip, TopBar } from "@/components/site-nav";
import { countStoredProjects, getPublicProjects, listKnownProfileRoutes } from "@/lib/content";
import { getVisibleProfile } from "@/lib/public-content";

/**
 * Rute ini dibuat saat build dari daftar yang dikenal (fixture dan proyek hasil
 * editor). Halaman yang sudah pernah dibuka diperbarui setelah editor menyimpan
 * lewat `revalidatePath` di `src/lib/project-actions.ts`.
 *
 * Sengaja tidak memakai `force-dynamic`: pada rute yang dialirkan, `notFound()`
 * berjalan setelah respons mulai dikirim sehingga permintaan pertama membalas
 * 200. Dengan dibuat saat build, username yang tidak ada dan profil privat
 * benar-benar membalas HTTP 404.
 */
export function generateStaticParams() {
  return listKnownProfileRoutes().map((username) => ({ username }));
}

export async function generateMetadata({ params }: PageProps<"/u/[username]">) {
  const { username } = await params;
  const profile = (await getVisibleProfile(username))?.profile;

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
  const result = await getVisibleProfile(username);
  const profile = result?.profile;

  // Profil yang belum aktif tampil publik atau username yang salah sama-sama
  // menghasilkan not-found, supaya keberadaan profil privat tidak bocor.
  if (!profile) {
    notFound();
  }

  const projects = getPublicProjects(profile);
  const storedCount = result.demo ? countStoredProjects(profile.username) : 0;

  return (
    <>
      <TopBar left={<OwnerChip profile={profile} />} />

      <div className="mx-auto max-w-[1120px] px-5 pb-24 pt-8 sm:px-8 sm:pt-12 xl:px-0">
        {result.demo ? (
          <PrototypeNotice>
            Contoh fiktif. Nama, profil, dan kontak di halaman ini dibuat untuk prototipe.
            {storedCount > 0
              ? ` ${storedCount} proyek di halaman ini dibuat lewat editor dan tersimpan di berkas lokal komputer ini, bukan di database.`
              : ""}
          </PrototypeNotice>
        ) : null}

        <ProfileHeader profile={profile} projectCount={projects.length} />

        <section aria-labelledby="daftar-proyek" className="mt-10 scroll-mt-24 border-t border-line pt-8 sm:mt-12">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 id="daftar-proyek" className="text-[24px] font-semibold tracking-tight text-ink">
              Proyek
            </h2>
            {projects.length > 0 ? (
              <p className="text-[14px] text-ink-2">{projects.length} proyek</p>
            ) : null}
          </div>

          {projects.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-line bg-surface px-6 py-14 text-center">
              <span className="mx-auto flex size-11 items-center justify-center rounded-full border border-line bg-canvas text-ink-2">
                <Icon name="image" />
              </span>
              <h3 className="mt-4 text-[17px] font-semibold text-ink">Belum ada karya yang diterbitkan</h3>
              <p className="mx-auto mt-2 max-w-[42ch] text-[15px] leading-[1.65] text-ink-2">
                {profile.displayName} belum menerbitkan proyek. Karya yang sudah diterbitkan akan tampil di sini.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {projects.map((project) => (
                <ProjectCard key={project.slug} project={project} username={profile.username} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
