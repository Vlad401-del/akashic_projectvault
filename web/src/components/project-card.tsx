import Link from "next/link";

import { Icon } from "@/components/icons";
import { ProjectCover } from "@/components/project-cover";
import { SkillList } from "@/components/skill-list";
import type { Project } from "@/lib/fixtures/types";
import { workTypeLabel } from "@/lib/labels";
import { firstSentence } from "@/lib/text";

/**
 * Kartu proyek untuk daftar di profil publik dan bagian "Proyek lainnya".
 *
 * Hanya judul yang menjadi tautan, lalu meluas menutupi seluruh kartu
 * (`after:absolute after:inset-0`). Dengan begitu keterbacaan pembaca layar
 * tetap pendek (nama tautan hanya judul proyek) sementara kartu tetap dapat
 * diklik di mana saja, sama seperti pada desain Figma Make.
 */
export function ProjectCard({ project, username }: { project: Project; username: string }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition-[border-color,box-shadow] hover:border-line-strong hover:shadow-[0_4px_16px_rgba(24,34,48,0.06)]">
      <ProjectCover variant={project.cover.variant} alt={project.cover.alt} frame="card" />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-[13px] font-medium text-ink-2">
          {project.category} <span aria-hidden="true">·</span> {workTypeLabel(project.workType)}
        </p>
        <h3 className="mt-1.5 text-[19px] font-semibold leading-snug tracking-tight text-ink group-hover:text-accent">
          <Link
            href={`/u/${username}/p/${project.slug}`}
            className="rounded after:absolute after:inset-0 after:content-['']"
          >
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 text-[15px] leading-[1.65] text-ink-2">{firstSentence(project.summary)}</p>
        <SkillList skills={project.skills} variant="card" className="mt-4" />

        <span className="mt-auto flex items-center gap-1.5 pt-5 text-[14px] font-medium text-accent">
          Lihat detail proyek
          <Icon name="arrowRight" className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  );
}
