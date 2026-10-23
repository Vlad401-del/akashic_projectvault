import type { ReactNode } from "react";

import { Icon } from "@/components/icons";
import { ProjectCover, ProjectCoverCaption } from "@/components/project-cover";
import { SectionHeading } from "@/components/section-heading";
import type { Project } from "@/lib/fixtures/types";
import { firstName } from "@/lib/text";

/** Kotak catatan kecil, dipakai di bagian Proses dan Hasil. */
function Note({ label = "Catatan", children }: { label?: string; children: ReactNode }) {
  return (
    <p className="mt-5 flex items-start gap-2 rounded-[10px] border border-line bg-surface px-4 py-2.5 text-[13px] leading-5 text-ink-2">
      <Icon name="info" className="mt-0.5 size-4" />
      <span>
        <strong className="font-medium text-ink">{label}: </strong>
        {children}
      </span>
    </p>
  );
}

function Section({ children, first = false }: { children: ReactNode; first?: boolean }) {
  return (
    <section className={first ? "" : "mt-14 border-t border-line pt-10"}>{children}</section>
  );
}

/**
 * Narasi studi kasus: Masalah → Proses → Kontribusi saya → Hasil → Galeri.
 *
 * Kontribusi pribadi sengaja dibuat sebagai kartu terpisah dengan kepala
 * berwarna aksen, lalu daftar pekerjaan sendiri dan pekerjaan anggota lain
 * dipisah tegas supaya hasil kelompok tidak tertukar dengan hasil pribadi.
 */
export function ProjectStory({ project, ownerName }: { project: Project; ownerName: string }) {
  const isGroup = project.workType === "kelompok";

  return (
    <div>
      <Section first>
        <SectionHeading id="masalah" number="01" icon="question" title="Masalah" />
        <div className="max-w-[46rem] space-y-4 text-[17px] leading-[1.7] text-ink-2">
          {project.problem.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        {project.questions.length > 0 ? (
          <div className="mt-6 rounded-xl border border-line bg-surface p-5">
            <h3 className="text-[14px] font-semibold text-ink">Pertanyaan yang saya jawab</h3>
            <ol className="mt-4 space-y-3">
              {project.questions.map((question, index) => (
                <li key={question} className="flex gap-3">
                  <span className="mt-[1px] flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[12px] font-semibold tabular-nums text-accent">
                    {index + 1}
                  </span>
                  <span className="text-[15px] leading-[1.6] text-ink">{question}</span>
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </Section>

      <Section>
        <SectionHeading id="proses" number="02" icon="route" title="Proses" />
        <p className="max-w-[46rem] text-[17px] leading-[1.7] text-ink-2">{project.processIntro}</p>

        <ol className="mt-6">
          {project.processSteps.map((step, index) => (
            <li key={step.title} className="relative flex gap-4 pb-6 last:pb-0">
              <span className="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-[13px] font-semibold tabular-nums text-ink">
                {index + 1}
              </span>
              {index < project.processSteps.length - 1 ? (
                <span aria-hidden="true" className="absolute bottom-0 left-[13px] top-7 w-px bg-line" />
              ) : null}
              <div className="min-w-0 pt-[3px]">
                <h3 className="text-[16px] font-semibold leading-snug text-ink">{step.title}</h3>
                <p className="mt-1.5 max-w-[44rem] text-[15px] leading-[1.65] text-ink-2">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        {project.processNote ? <Note>{project.processNote}</Note> : null}
      </Section>

      <Section>
        <SectionHeading id="kontribusi-saya" number="03" icon="checkCircle" title="Kontribusi saya" />

        <div className="overflow-hidden rounded-xl border border-line bg-surface">
          <div className="flex items-center gap-2 border-b border-accent/15 bg-accent-soft px-5 py-3">
            <Icon name="check" className="size-4 text-accent" />
            <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-accent">
              {isGroup ? `Dikerjakan oleh ${firstName(ownerName)}` : "Dikerjakan sendiri"}
            </p>
          </div>

          <div className="px-5 py-5 sm:px-6 sm:py-6">
            <p className="max-w-[46rem] text-[15px] leading-[1.65] text-ink-2">{project.contributionIntro}</p>

            {project.contributionChecklist.length > 0 ? (
              <>
                <h3 className="mt-6 text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-2">
                  Dikerjakan oleh saya
                </h3>
                <ul className="mt-3 space-y-2.5">
                  {project.contributionChecklist.map((item) => (
                    <li key={item} className="flex gap-2.5 text-[15px] leading-[1.6] text-ink">
                      <Icon name="check" className="mt-[3px] size-4 text-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            {project.designDecision ? (
              <figure className="mt-6 rounded-[10px] border border-line border-l-2 border-l-accent bg-canvas px-4 py-4">
                <figcaption className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-2">
                  <Icon name="lightbulb" className="size-4" />
                  Keputusan desain yang saya ambil
                </figcaption>
                <blockquote className="mt-2.5 text-[15px] leading-[1.65] text-ink-2">
                  {project.designDecision}
                </blockquote>
              </figure>
            ) : null}

            {project.teammates.length > 0 ? (
              <>
                <h3 className="mt-6 text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-2">
                  Dikerjakan anggota lain
                </h3>
                <ul className="mt-3 divide-y divide-line rounded-[10px] border border-line">
                  {project.teammates.map((teammate) => (
                    <li key={teammate.name} className="flex flex-wrap gap-x-3 gap-y-0.5 px-4 py-3">
                      <span className="text-[15px] font-medium text-ink">{teammate.name}</span>
                      <span className="text-[15px] text-ink-2">{teammate.task}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading id="hasil" number="04" icon="flag" title="Hasil" />
        <p className="max-w-[46rem] text-[17px] leading-[1.7] text-ink-2">{project.outcomeIntro}</p>

        {project.outcomeNote ? <Note label="Catatan hasil">{project.outcomeNote}</Note> : null}

        {project.outcomeCards.length > 0 ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {project.outcomeCards.map((card, index) => (
              <div key={card.title} className="rounded-xl border border-line bg-surface p-5">
                <h3 className="flex items-center gap-2 text-[15px] font-semibold text-ink">
                  <Icon name={index === 0 ? "lightbulb" : "alert"} className="size-4 text-ink-2" />
                  {card.title}
                </h3>
                <p className="mt-2 text-[15px] leading-[1.65] text-ink-2">{card.body}</p>
              </div>
            ))}
          </div>
        ) : null}
      </Section>

      {project.gallery.length > 0 ? (
        <Section>
          <SectionHeading id="galeri" number="05" icon="image" title="Galeri" />
          <div className="grid gap-6 sm:grid-cols-2">
            {project.gallery.map((image) => (
              <figure key={image.alt}>
                <ProjectCover variant={image.variant} alt={image.alt} />
                {image.caption ? <ProjectCoverCaption text={image.caption} className="mt-3" /> : null}
              </figure>
            ))}
          </div>
        </Section>
      ) : null}
    </div>
  );
}
