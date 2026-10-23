"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { Icon } from "@/components/icons";
import { ProjectContext } from "@/components/project-context";
import { ProjectCover, ProjectCoverCaption } from "@/components/project-cover";
import { ProjectStory } from "@/components/project-story";
import { PrismMark } from "@/components/site-brand";
import { SkillList } from "@/components/skill-list";
import { StatusChip } from "@/components/editor/status-chip";
import type { Project, ProjectStatus } from "@/lib/fixtures/types";
import { workTypeLabel } from "@/lib/labels";

/**
 * Jendela pratinjau penuh untuk pemilik proyek.
 *
 * Susunannya sengaja memakai komponen halaman publik yang sama supaya yang
 * dilihat pemilik memang bentuk akhirnya. Bedanya, pratinjau ini tidak dapat
 * dibuka pengunjung anonim ketika proyek masih draft, dan hal itu dinyatakan
 * di bagian atas jendela.
 */
export function PreviewDialog({
  open,
  onClose,
  project,
  status,
  ownerName,
  publicHref,
}: {
  open: boolean;
  onClose: () => void;
  project: Project;
  status: ProjectStatus;
  ownerName: string;
  publicHref: string | null;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const isPubliclyVisible = status === "published" && publicHref !== null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Pratinjau proyek"
      className="fixed inset-0 z-50 flex flex-col bg-canvas"
    >
      <div className="border-b border-line bg-surface">
        <div className="mx-auto flex h-14 max-w-[1120px] items-center justify-between gap-4 px-5 sm:px-8 xl:px-0">
          <div className="flex min-w-0 items-center gap-3">
            <PrismMark />
            <span className="truncate text-[15px] font-semibold text-ink">Pratinjau proyek</span>
            <StatusChip status={status} />
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-[10px] border border-line bg-surface px-3 text-[14px] font-medium text-ink transition-colors hover:border-line-strong"
          >
            <Icon name="x" className="size-4" />
            Tutup pratinjau
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1120px] px-5 py-8 sm:px-8 sm:py-10 xl:px-0">
          <div className="mb-8 flex flex-wrap items-start justify-between gap-3 rounded-[10px] border border-line bg-surface px-4 py-3 text-[13px] leading-5 text-ink-2">
            <p className="flex items-start gap-2">
              <Icon name="info" className="mt-0.5 size-4" />
              <span>
                {isPubliclyVisible
                  ? "Pratinjau ini sama dengan tampilan yang dilihat pengunjung di halaman publik."
                  : "Pratinjau pemilik. Proyek ini belum tampil publik, jadi pengunjung belum bisa membukanya."}
              </span>
            </p>
            {isPubliclyVisible ? (
              <Link
                href={publicHref}
                className="inline-flex items-center gap-1.5 rounded font-medium text-accent hover:text-accent-hover"
              >
                Buka halaman publik
                <Icon name="externalLink" className="size-4" />
              </Link>
            ) : null}
          </div>

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

              <h1 className="mt-4 text-[30px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink sm:text-[44px]">
                {project.title}
              </h1>
              {project.summary.trim().length > 0 ? (
                <p className="mt-5 max-w-[40rem] text-[17px] leading-[1.7] text-ink-2">{project.summary}</p>
              ) : null}
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
              <ProjectStory project={project} ownerName={ownerName} />
            </article>
          </div>

          <p className="mt-12 border-t border-line pt-6 text-[13px] leading-5 text-ink-2">
            Pratinjau ini hanya tampilan di peramban. Belum ada data yang dikirim atau disimpan ke database.
          </p>
        </div>
      </div>
    </div>
  );
}
