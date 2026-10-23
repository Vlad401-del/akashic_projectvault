import Link from "next/link";

import { Icon } from "@/components/icons";
import { ProjectCover } from "@/components/project-cover";
import { SkillList } from "@/components/skill-list";
import type { Project, ProjectStatus } from "@/lib/fixtures/types";
import { workTypeLabel } from "@/lib/labels";

/**
 * Panel pratinjau ringkas di kolom kanan editor.
 *
 * Isinya dihitung dari formulir yang sedang diisi, jadi pengguna melihat
 * perubahan tanpa harus membuka halaman publik. Panel ini bukan halaman
 * publik: pada pratinjau draft disebutkan bahwa pengunjung belum bisa
 * membukanya, supaya tidak menimbulkan harapan yang salah.
 */
export function EditorPreview({
  project,
  status,
  publicHref,
  className = "",
}: {
  project: Project;
  status: ProjectStatus;
  /** Tautan halaman publik; `null` bila proyek belum pernah diterbitkan. */
  publicHref: string | null;
  className?: string;
}) {
  const skills = project.skills.slice(0, 3);
  const isPublished = status === "published" && publicHref !== null;

  return (
    <section aria-labelledby="pratinjau-ringkas" className={`rounded-xl border border-line bg-surface ${className}`}>
      <header className="border-b border-line px-5 py-4">
        <h2 id="pratinjau-ringkas" className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-2">
          Pratinjau ringkas
        </h2>
        <p className="mt-1 text-[13px] leading-5 text-ink-2">Ikut berubah saat Anda mengetik.</p>
      </header>

      <ProjectCover variant={project.cover.variant} alt={project.cover.alt} frame="card" aspectClassName="aspect-[16/9]" />

      <div className="p-5">
        <p className="text-[13px] font-medium text-ink-2">
          {project.category} <span aria-hidden="true">·</span> {workTypeLabel(project.workType)}
        </p>
        <h3 className="mt-1.5 text-[19px] font-semibold leading-snug tracking-tight text-ink">
          {project.title}
        </h3>

        {project.summary.trim().length > 0 ? (
          <p className="mt-2 line-clamp-5 text-[14px] leading-[1.65] text-ink-2">{project.summary}</p>
        ) : (
          <p className="mt-2 text-[14px] leading-[1.65] text-ink-2">
            Ringkasan proyek akan tampil di sini.
          </p>
        )}

        {skills.length > 0 ? <SkillList skills={skills} variant="card" className="mt-4" /> : null}

        <div className="mt-5 border-t border-line pt-4">
          {isPublished ? (
            <Link
              href={publicHref}
              className="inline-flex items-center gap-1.5 rounded text-[14px] font-medium text-accent hover:text-accent-hover"
            >
              Buka halaman publik
              <Icon name="externalLink" className="size-4" />
            </Link>
          ) : (
            <p className="flex items-start gap-2 text-[13px] leading-5 text-ink-2">
              <Icon name="info" className="mt-0.5 size-4" />
              <span>
                Belum tampil publik. Pratinjau ini hanya untuk pemilik, pengunjung belum bisa membukanya.
              </span>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
