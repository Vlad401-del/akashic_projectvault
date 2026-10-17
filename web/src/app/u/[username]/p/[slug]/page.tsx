import Link from "next/link";
import { notFound } from "next/navigation";

import { Icon } from "@/components/icons";
import { ProjectCard } from "@/components/project-card";
import { ProjectContext } from "@/components/project-context";
import { ProjectCover, ProjectCoverCaption } from "@/components/project-cover";
import { ProjectStory } from "@/components/project-story";
import { PrototypeNotice } from "@/components/prototype-notice";
import { OwnerChip, TopBar } from "@/components/site-nav";
import { SiteBrand } from "@/components/site-brand";
import { SkillList } from "@/components/skill-list";
import { getOtherPublicProjects, getPublicProfile, getPublicProject } from "@/lib/content";
import { profiles } from "@/lib/fixtures/fixtures";
import { workTypeLabel } from "@/lib/labels";

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
      <TopBar
        left={
          <Link
            href={`/u/${profile.username}`}
            className="inline-flex items-center gap-1.5 rounded text-[14px] font-medium text-accent hover:text-accent-hover"
          >
            <Icon name="arrowLeft" className="size-[18px]" />
            Kembali ke portofolio
          </Link>
        }
        right={
          <>
            <OwnerChip profile={profile} />
            <span aria-hidden="true" className="hidden h-5 w-px bg-line sm:block" />
            <span className="hidden sm:block">
              <SiteBrand />
            </span>
          </>
        }
      />

      <div className="mx-auto max-w-[1120px] px-5 pb-24 pt-8 sm:px-8 sm:pt-12 xl:px-0">
        <PrototypeNotice className="mb-10 sm:mb-12">
          Contoh fiktif. Proyek dan narasi di halaman ini dibuat untuk prototipe.
        </PrototypeNotice>

        {/*
          Susunan grid: header dan sampul membentang penuh, lalu narasi di kolom
          kiri dan panel konteks di kolom kanan. Pada lebar kecil semuanya
          menumpuk berurutan: header, sampul, konteks, narasi.
        */}
        <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-x-16 lg:gap-y-14">
          <header className="lg:col-span-2 lg:row-start-1">
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] font-medium text-ink-2">
              <span>{project.category}</span>
              <span aria-hidden="true">·</span>
              <span>{workTypeLabel(project.workType)}</span>
              {project.period ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Icon name="calendar" className="size-4" />
                    {project.period}
                  </span>
                </>
              ) : null}
            </p>

            <h1 className="mt-4 text-[34px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink sm:text-[48px]">
              {project.title}
            </h1>
            <p className="mt-5 max-w-[40rem] text-[17px] leading-[1.7] text-ink-2">{project.summary}</p>
            <SkillList skills={project.skills} className="mt-6" />
          </header>

          <figure className="lg:col-span-2 lg:row-start-2">
            <ProjectCover variant={project.cover.variant} alt={project.cover.alt} />
            {project.cover.caption ? (
              <ProjectCoverCaption text={project.cover.caption} className="mt-3" />
            ) : null}
          </figure>

          <aside className="lg:col-start-2 lg:row-start-3 lg:sticky lg:top-24 lg:self-start">
            <ProjectContext project={project} />
          </aside>

          <article className="lg:col-start-1 lg:row-start-3">
            <ProjectStory project={project} ownerName={profile.displayName} />
          </article>
        </div>

        {otherProjects.length > 0 ? (
          <section aria-labelledby="proyek-lainnya" className="mt-20 border-t border-line pt-10">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 id="proyek-lainnya" className="text-[24px] font-semibold tracking-tight text-ink">
                Proyek lainnya
              </h2>
              <Link
                href={`/u/${profile.username}`}
                className="inline-flex items-center gap-1.5 rounded text-[14px] font-medium text-accent hover:text-accent-hover"
              >
                Lihat semua proyek
                <Icon name="arrowRight" className="size-4" />
              </Link>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
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
