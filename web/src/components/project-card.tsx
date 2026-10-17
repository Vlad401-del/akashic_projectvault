import Link from "next/link";

import { ProjectCover } from "@/components/project-cover";
import { SkillList } from "@/components/skill-list";
import type { Project } from "@/lib/fixtures/types";
import { firstSentence } from "@/lib/text";

/**
 * Kartu proyek untuk daftar di profil publik.
 *
 * Hanya judul yang menjadi tautan, lalu meluas menutupi seluruh kartu
 * (`after:absolute after:inset-0`). Dengan begitu keterbacaan pembaca layar
 * tetap pendek dan kartu tetap dapat diklik di mana saja.
 */
export function ProjectCard({ project, username }: { project: Project; username: string }) {
  return (
    <article className="relative flex flex-col rounded-2xl border border-line bg-surface p-3 transition-colors hover:border-accent/40">
      <ProjectCover variant={project.cover.variant} alt={project.cover.alt} />

      <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-ink-muted">{project.category}</p>
        <h3 className="mt-1.5 text-lg font-semibold leading-snug tracking-tight text-ink">
          <Link
            href={`/u/${username}/p/${project.slug}`}
            className="rounded after:absolute after:inset-0 after:content-[''] hover:text-accent"
          >
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{firstSentence(project.summary)}</p>
        <SkillList skills={project.skills} limit={3} className="mt-4" />
      </div>
    </article>
  );
}
