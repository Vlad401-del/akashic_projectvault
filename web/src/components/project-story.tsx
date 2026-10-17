import type { ReactNode } from "react";

import type { Project } from "@/lib/fixtures/types";

function StorySection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="text-lg font-semibold tracking-tight text-ink">
        {title}
      </h2>
      <div className="mt-3 max-w-[68ch] space-y-3 text-sm leading-relaxed text-ink-muted">{children}</div>
    </section>
  );
}

/**
 * Narasi studi kasus: Masalah → Proses → Kontribusi saya → Hasil.
 *
 * Kontribusi pribadi sengaja dibuat sebagai blok terpisah dengan garis aksen
 * agar tidak tertukar dengan hasil kelompok.
 */
export function ProjectStory({ project }: { project: Project }) {
  const contributionNote =
    project.workType === "kelompok"
      ? "Bagian ini hanya pekerjaan yang saya kerjakan sendiri, terpisah dari hasil kelompok."
      : "Tugas ini dikerjakan sendiri, sehingga bagian ini mencakup seluruh pekerjaan.";

  return (
    <div className="flex flex-col gap-9">
      <StorySection id="masalah" title="Masalah">
        <p>{project.problem}</p>
      </StorySection>

      <StorySection id="proses" title="Proses">
        <p>{project.process}</p>
      </StorySection>

      <section
        aria-labelledby="kontribusi-saya"
        className="rounded-2xl border border-line border-l-4 border-l-accent bg-surface px-5 py-5 sm:px-6"
      >
        <h2 id="kontribusi-saya" className="text-lg font-semibold tracking-tight text-ink">
          Kontribusi saya
        </h2>
        <p className="mt-1 text-xs text-ink-muted">{contributionNote}</p>
        <p className="mt-3 max-w-[68ch] text-sm leading-relaxed text-ink-muted">{project.contribution}</p>
      </section>

      <StorySection id="hasil" title="Hasil">
        <p>{project.outcome}</p>
      </StorySection>
    </div>
  );
}
