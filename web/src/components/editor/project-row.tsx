import Link from "next/link";

import { StatusChip } from "@/components/editor/status-chip";
import { Icon } from "@/components/icons";
import { ProjectCover } from "@/components/project-cover";
import type { Project } from "@/lib/fixtures/types";
import { workTypeLabel } from "@/lib/labels";
import { firstSentence } from "@/lib/text";

/**
 * Satu baris proyek di area pemilik.
 *
 * Berbeda dengan kartu publik, baris ini menampilkan status draft/terbit dan
 * tombol menuju editor, karena hanya dilihat pemiliknya sendiri.
 */
export function ProjectRow({ project, username }: { project: Project; username: string }) {
  const isPublished = project.status === "published";

  return (
    <article className="rounded-xl border border-line bg-surface p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
        <div className="w-full sm:w-44 sm:shrink-0">
          <ProjectCover
            variant={project.cover.variant}
            alt={project.cover.alt}
            frame="figure"
            aspectClassName="aspect-[16/10]"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <StatusChip status={project.status} />
            <span className="text-[13px] text-ink-2">
              {project.category} <span aria-hidden="true">·</span> {workTypeLabel(project.workType)}
            </span>
          </div>

          <h3 className="mt-2 text-[18px] font-semibold leading-snug tracking-tight text-ink">{project.title}</h3>
          <p className="mt-1.5 line-clamp-2 text-[14px] leading-6 text-ink-2">
            {firstSentence(project.summary)}
          </p>

          <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
            <Link
              href={`/dashboard/projects/${project.slug}/edit`}
              className="inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-line bg-surface px-3 text-[14px] font-medium text-ink transition-colors hover:border-accent/40 hover:text-accent"
            >
              <Icon name="pencil" className="size-4" />
              Edit proyek
            </Link>

            {isPublished ? (
              <Link
                href={`/u/${username}/p/${project.slug}`}
                className="inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-line bg-surface px-3 text-[14px] font-medium text-ink transition-colors hover:border-accent/40 hover:text-accent"
              >
                <Icon name="externalLink" className="size-4" />
                Lihat halaman publik
              </Link>
            ) : (
              <span className="inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-dashed border-line px-3 text-[13px] text-ink-2">
                <Icon name="info" className="size-4" />
                Draft: belum tampil publik
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
