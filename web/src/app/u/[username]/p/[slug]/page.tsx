import Link from "next/link";
import { notFound } from "next/navigation";

import { ProjectCard } from "@/components/project-card";
import { ProjectCover, ProjectCoverCaption } from "@/components/project-cover";
import { ProjectStory } from "@/components/project-story";
import { SkillList } from "@/components/skill-list";
import { SourceLinks } from "@/components/source-links";
import { getOtherPublicProjects, getPublicProfile, getPublicProject } from "@/lib/content";
import { profiles } from "@/lib/fixtures/fixtures";

/**
 * Daftar rute proyek dibuat saat build dari fixture. Proyek draft dan proyek
 * milik profil privat ikut didaftarkan supaya keduanya benar-benar diuji
 * menghasilkan 404, bukan sekadar tidak pernah dibangun.
 */
export function generateStaticParams() {
  return profiles.flatMap((profile) =>
    profile.projects.map((project) => ({ username: profile.username, slug: project.slug })),
  );
}

function workTypeLabel(workType: "individu" | "kelompok") {
  return workType === "kelompok" ? "Tugas kelompok" : "Tugas individu";
}

/**
 * Lihat penjelasan di `next.config.ts`: prerender parsial dimatikan agar draft
 * dan proyek milik profil privat benar-benar membalas HTTP 404.
 */
export async function generateMetadata({ params }: PageProps<"/u/[username]/p/[slug]">) {
  const { username, slug } = await params;
  const profile = getPublicProfile(username);
  const project = profile ? getPublicProject(profile, slug) : null;

  if (!profile || !project) {
    return { title: "Proyek tidak ditemukan" };
  }

  return {
    title: `${project.title} — ${profile.displayName}`,
    description: project.summary,
  };
}

export default async function PublicProjectPage({ params }: PageProps<"/u/[username]/p/[slug]">) {
  const { username, slug } = await params;
  const profile = getPublicProfile(username);

  if (!profile) {
    notFound();
  }

  // Draft tidak dapat dibuka lewat URL langsung meskipun slug-nya diketahui.
  const project = getPublicProject(profile, slug);

  if (!project) {
    notFound();
  }

  const otherProjects = getOtherPublicProjects(profile, slug);

  return (
    <>
      {/* Navigasi tipis: nama pemilik + jalan kembali ke portofolio. */}
      <div className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-3 px-4 py-4">
          <p className="text-sm text-ink-muted">
            <span className="font-medium text-ink">{profile.displayName}</span>
            <span className="hidden sm:inline"> • studi kasus proyek</span>
          </p>
          <Link
            href={`/u/${profile.username}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink hover:border-accent hover:text-accent"
          >
            <span aria-hidden="true">←</span> Kembali ke portofolio
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-[1120px] px-4 py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-12">
          <header className="order-1 lg:col-start-1 lg:row-start-1">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-ink-muted">
              {project.category} • {workTypeLabel(project.workType)}
              {project.course ? <> • {project.course}</> : null}
            </p>
            <h1 className="mt-2.5 text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
              {project.title}
            </h1>
            <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-ink-muted">{project.summary}</p>
            <SkillList skills={project.skills} className="mt-5" />
            {project.period ? (
              <p className="mt-5 text-xs text-ink-muted">
                Periode: <span className="text-ink">{project.period}</span>
              </p>
            ) : null}
          </header>

          {/* Panel ringkas: pada ponsel panel pindah ke bawah header (order-2). */}
          <aside className="order-2 lg:sticky lg:top-6 lg:col-start-2 lg:row-start-1">
            <div className="rounded-2xl border border-line bg-surface p-5">
              <h2 className="text-sm font-semibold tracking-tight text-ink">Bukti karya</h2>

              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-[0.12em] text-ink-muted">Jenis tugas</dt>
                  <dd className="mt-0.5 text-ink">{workTypeLabel(project.workType)}</dd>
                </div>
                {project.course ? (
                  <div>
                    <dt className="text-xs uppercase tracking-[0.12em] text-ink-muted">Mata kuliah</dt>
                    <dd className="mt-0.5 text-ink">{project.course}</dd>
                  </div>
                ) : null}
                {project.period ? (
                  <div>
                    <dt className="text-xs uppercase tracking-[0.12em] text-ink-muted">Periode</dt>
                    <dd className="mt-0.5 text-ink">{project.period}</dd>
                  </div>
                ) : null}
                <div>
                  <dt className="text-xs uppercase tracking-[0.12em] text-ink-muted">Status</dt>
                  <dd className="mt-0.5 text-ink">Tampil pada portofolio lokal</dd>
                </div>
              </dl>

              <SourceLinks sources={project.sources} className="mt-5" />

              {project.sources.length > 0 ? (
                <p className="mt-4 text-xs leading-relaxed text-ink-muted">
                  Tautan di atas adalah contoh (demo) dan mengarah ke alamat example.com, bukan layanan
                  sungguhan.
                </p>
              ) : null}
            </div>
          </aside>

          <div className="order-3 flex flex-col gap-10 lg:col-start-1 lg:row-start-2">
            <figure>
              <ProjectCover
                variant={project.cover.variant}
                alt={project.cover.alt}
                aspectClassName="aspect-[16/9]"
              />
              <ProjectCoverCaption alt={project.cover.alt} />
            </figure>

            <ProjectStory project={project} />

            {project.gallery.length > 0 ? (
              <section aria-labelledby="galeri-proyek">
                <h2 id="galeri-proyek" className="text-lg font-semibold tracking-tight text-ink">
                  Galeri
                </h2>
                <div className="mt-4 grid gap-5 sm:grid-cols-2">
                  {project.gallery.map((image) => (
                    <ProjectCover key={image.alt} variant={image.variant} alt={image.alt} />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </div>

        {otherProjects.length > 0 ? (
          <section aria-labelledby="proyek-lainnya" className="mt-14 border-t border-line pt-8">
            <h2 id="proyek-lainnya" className="text-xl font-semibold tracking-tight text-ink">
              Proyek lainnya dari {profile.displayName}
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {otherProjects.map((other) => (
                <ProjectCard key={other.slug} project={other} username={profile.username} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}
