"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { EditorForm } from "@/components/editor/editor-form";
import { EditorPreview } from "@/components/editor/editor-preview";
import { PreviewDialog } from "@/components/editor/preview-dialog";
import { PublishChecklist } from "@/components/editor/publish-checklist";
import { StatusChip } from "@/components/editor/status-chip";
import { DemoNotice } from "@/components/demo-notice";
import { Icon } from "@/components/icons";
import {
  canPublish,
  emptyForm,
  formToProject,
  hasErrors,
  projectToForm,
  publishChecklist,
  validateForm,
  type EditorErrors,
  type EditorForm as EditorFormValue,
  type EditorSource,
} from "@/lib/editor-form";
import type { Profile, Project, ProjectStatus } from "@/lib/fixtures/types";
import { saveProjectAction } from "@/lib/project-actions";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const PRIMARY_BUTTON =
  "inline-flex h-11 items-center gap-2 rounded-[10px] bg-accent px-4 text-[15px] font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60";
const SECONDARY_BUTTON =
  "inline-flex h-11 items-center gap-2 rounded-[10px] border border-line bg-surface px-4 text-[15px] font-medium text-ink transition-colors hover:border-line-strong disabled:cursor-not-allowed disabled:opacity-60";

/** Aksi yang sedang berjalan; dipakai untuk menonaktifkan tombol dan mengganti label. */
type BusyKind = null | "save" | "publish" | "unpublish";
type GuidedStep = 0 | 1 | 2 | 3;

const GUIDED_STEPS = ["Identitas", "Cerita proyek", "Bukti karya", "Siap terbit"] as const;
const STEP_HELP = [
  "Mulai dari judul dan ringkasan. Dua isian ini diperlukan untuk menyimpan draft pertama.",
  "Jelaskan masalah, proses, kontribusi pribadi, dan hasil proyek.",
  "Pilih ilustrasi contoh dan tambahkan tautan karya jika tersedia.",
  "Periksa kelengkapan dan pernyataan sebelum proyek diterbitkan.",
] as const;

function timeNow(): string {
  return new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit" }).format(new Date());
}

function focusFirstInvalidField() {
  const invalid = document.querySelector('[aria-invalid="true"]');

  if (invalid instanceof HTMLElement) {
    invalid.focus();
    invalid.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

/**
 * Editor proyek untuk pemilik akun.
 *
 * Dengan konfigurasi Supabase, isi formulir disimpan pada akun pengguna.
 * Tanpa konfigurasi itu, mode pengembangan tetap memakai penyimpanan demo
 * lokal (`web/.data/projects.json`).
 *
 * Tiga keadaan layar mengikuti desain: Proyek baru (formulir kosong), Draft
 * (sudah ada isinya tetapi belum tampil publik), dan Sudah terbit.
 */
export function ProjectEditor({
  owner,
  project = null,
}: {
  owner: Profile;
  project?: Project | null;
}) {
  const [form, setForm] = useState<EditorFormValue>(() => (project ? projectToForm(project) : emptyForm()));
  const [status, setStatus] = useState<ProjectStatus>(project ? project.status : "draft");
  const [savedSlug, setSavedSlug] = useState<string | null>(project ? project.slug : null);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState<BusyKind>(null);
  const [errors, setErrors] = useState<EditorErrors>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [unpublishConfirm, setUnpublishConfirm] = useState(false);
  const [errorFocusRequest, setErrorFocusRequest] = useState(0);
  const [currentStep, setCurrentStep] = useState<GuidedStep>(0);
  const saveInFlight = useRef(false);
  const cloudMode = isSupabaseConfigured();

  // Proyek baru dan draft memakai alur terpandu. Proyek yang sudah terbit tetap
  // dapat diedit sebagai satu formulir agar perubahan publik tidak tersimpan otomatis.
  const isGuided = project?.status !== "published";

  const previewProject = useMemo(() => formToProject(form, status), [form, status]);
  const checklist = useMemo(() => publishChecklist(form), [form]);
  const publishReady = useMemo(() => canPublish(form), [form]);

  // Alamat publik hanya ada setelah proyek benar-benar tersimpan.
  const publicHref = status === "published" && savedSlug ? `/u/${owner.username}/p/${savedSlug}` : null;

  const update = useCallback((patch: Partial<EditorFormValue>) => {
    setForm((current) => ({ ...current, ...patch }));
    setDirty(true);

    // Pesan kesalahan yang sudah diperbaiki langsung dibersihkan supaya tidak
    // tertinggal di layar padahal isiannya sudah diisi.
    setErrors((current) => {
      if (!current.title && !current.summary) {
        return current;
      }

      const next = { ...current };

      if (patch.title !== undefined && patch.title.trim().length > 0) {
        delete next.title;
      }

      if (patch.summary !== undefined && patch.summary.trim().length > 0) {
        delete next.summary;
      }

      return next;
    });
  }, []);

  const changeSource = useCallback((index: number, patch: Partial<EditorSource>) => {
    setForm((current) => ({
      ...current,
      sources: current.sources.map((source, position) => (position === index ? { ...source, ...patch } : source)),
    }));
    setDirty(true);

    setErrors((current) => {
      if (!current.sources?.[index]) {
        return current;
      }

      const sources = { ...current.sources };
      delete sources[index];

      return { ...current, sources: Object.keys(sources).length > 0 ? sources : undefined };
    });
  }, []);

  const addSource = useCallback(() => {
    setForm((current) => ({ ...current, sources: [...current.sources, { label: "", url: "" }] }));
    setDirty(true);
  }, []);

  const removeSource = useCallback((index: number) => {
    setForm((current) =>
      current.sources.length <= 1 ? current : { ...current, sources: current.sources.filter((_, position) => position !== index) },
    );
    setDirty(true);
  }, []);

  useEffect(() => {
    if (!flash) {
      return;
    }

    const timer = window.setTimeout(() => setFlash(null), 6000);

    return () => window.clearTimeout(timer);
  }, [flash]);

  // Peringatan bawaan peramban bila pengguna menutup tab dengan perubahan belum disimpan.
  useEffect(() => {
    if (!dirty) {
      return;
    }

    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener("beforeunload", handler);

    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  /*
   * Setelah pesan kesalahan tampil, fokus diarahkan ke isian pertama yang
   * perlu diperbaiki. Dipakai effect, bukan requestAnimationFrame, supaya
   * pasti berjalan setelah DOM diperbarui.
   */
  useEffect(() => {
    if (errorFocusRequest === 0) {
      return;
    }

    focusFirstInvalidField();
  }, [errorFocusRequest]);

  const closePreview = useCallback(() => setPreviewOpen(false), []);

  /**
   * Menyimpan formulir ke Supabase atau ke penyimpanan demo lokal.
   *
   * Validasi dijalankan di sini dan sekali lagi di server (`saveProjectAction`),
   * supaya aturan yang sama tidak hanya bergantung pada sisi peramban.
   */
  const save = async ({
    nextStatus,
    busyKind,
    note,
  }: {
    nextStatus: ProjectStatus;
    busyKind: Exclude<BusyKind, null>;
    note: string;
  }): Promise<boolean> => {
    if (saveInFlight.current) {
      return false;
    }

    const found = validateForm(form);
    setErrors(found);
    setSaveError(null);

    if (hasErrors(found)) {
      setFlash(null);
      setErrorFocusRequest((request) => request + 1);
      return false;
    }

    const isNewProject = savedSlug === null;
    saveInFlight.current = true;
    setBusy(busyKind);

    try {
      const result = await saveProjectAction({ slug: savedSlug, status: nextStatus, form });

      if (!result.ok) {
        setErrors(result.errors);
        setSaveError("Isian belum dapat disimpan. Periksa bagian yang ditandai, lalu simpan lagi.");
        setErrorFocusRequest((request) => request + 1);
        return false;
      }

      setStatus(result.status);
      setDirty(false);
      setErrors({});

      if (isNewProject) {
        /*
         * Proyek baru dipindahkan ke alamat editornya sendiri tanpa memuat ulang
         * halaman: pesan konfirmasi tetap terlihat, dan menekan simpan dua kali
         * tidak membuat proyek kedua. `replaceState` bawaan peramban dipakai
         * supaya tidak ada permintaan ulang ke server (didukung App Router).
         */
        setSavedSlug(result.slug);
        window.history.replaceState(null, "", `/dashboard/projects/${result.slug}/edit`);
      }

      setFlash(`${note} Pukul ${timeNow()}.`);
      return true;
    } catch {
      setSaveError(
        cloudMode ? "Gagal menyimpan ke Supabase. Periksa koneksi, lalu coba lagi." : "Gagal menulis ke penyimpanan lokal. Pastikan server masih berjalan, lalu simpan lagi.",
      );
      return false;
    } finally {
      saveInFlight.current = false;
      setBusy(null);
    }
  };

  const handleSave = () => {
    void save({
      nextStatus: status,
      busyKind: "save",
      note: status === "published" ? "Perubahan publik tersimpan." : "Draft tersimpan.",
    });
  };

  const moveToStep = async (target: GuidedStep) => {
    if (busy) {
      return;
    }

    // Kembali tetap bisa dilakukan ketika pengguna baru mengisi sebagian
    // tautan. Isinya tetap ada di state formulir, dengan status belum disimpan.
    if (target < currentStep && hasErrors(validateForm(form))) {
      setCurrentStep(target);
      document.getElementById("editor-langkah")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    // Berpindah langkah menyimpan draft, bukan sekadar menahan
    // isi formulir di memori browser. Jika gagal, tetap di langkah saat ini.
    if (status === "draft" && (dirty || !savedSlug)) {
      const saved = await save({
        nextStatus: "draft",
        busyKind: "save",
        note: "Draft tersimpan.",
      });

      if (!saved) {
        return;
      }
    }

    setCurrentStep(target);
    document.getElementById("editor-langkah")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePublish = () => {
    if (!publishReady) {
      document.getElementById("checklist-terbit")?.scrollIntoView({ behavior: "smooth", block: "start" });
      setFlash(null);
      return;
    }

    void save({
      nextStatus: "published",
      busyKind: "publish",
      note: "Proyek diterbitkan. Tautan halaman publiknya ada di panel pratinjau.",
    });
  };

  const confirmUnpublish = () => {
    setUnpublishConfirm(false);
    void save({
      nextStatus: "draft",
      busyKind: "unpublish",
      note: "Proyek ditarik dari tampilan publik.",
    });
  };

  const isPublished = status === "published";
  const isBusy = busy !== null;
  const activeSection = isGuided
    ? currentStep === 0
      ? "identity"
      : currentStep === 1
        ? "story"
        : currentStep === 2
          ? "evidence"
          : undefined
    : undefined;

  return (
    <div className="mx-auto max-w-[1120px] px-5 pb-36 pt-8 sm:px-8 sm:pb-28 sm:pt-10 xl:px-0">
      {cloudMode ? (
        <p className="mb-8 rounded-xl border border-line bg-surface px-4 py-3 text-sm leading-6 text-ink-2">
          Proyek tersimpan di akunmu. Draft hanya terlihat olehmu; proyek terbit tampil setelah profilmu diterbitkan.
        </p>
      ) : (
        <DemoNotice className="mb-8">
          Isi formulir disimpan di berkas lokal komputer ini. Siapa pun yang membuka aplikasi lokal
          dapat mengubah proyek akun contoh.
        </DemoNotice>
      )}

      <header>
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="min-w-0">
            <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-2">
              {project ? "Editor proyek" : "Proyek baru"}
            </p>
            <h1 className="mt-2 text-[26px] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[32px]">
              {form.title.trim().length > 0 ? form.title : "Proyek tanpa judul"}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2.5">
              <StatusChip status={status} />
              {dirty ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas px-2.5 py-1 text-[12px] font-medium text-ink-2">
                  <Icon name="dot" className="size-2 text-accent" />
                  Ada perubahan belum disimpan
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button type="button" onClick={() => setPreviewOpen(true)} className={SECONDARY_BUTTON}>
              <Icon name="eye" className="size-4" />
              Pratinjau
            </button>

            {isPublished ? (
              <button
                type="button"
                onClick={() => setUnpublishConfirm(true)}
                disabled={unpublishConfirm || isBusy}
                className={SECONDARY_BUTTON}
              >
                <Icon name="x" className="size-4" />
                {busy === "unpublish" ? "Menarik..." : "Tarik dari publik"}
              </button>
            ) : null}
          </div>
        </div>

        {isPublished ? (
          <p className="mt-4 max-w-[46rem] text-[13px] leading-5 text-ink-2">
            Simpan perubahan publik langsung mengganti isi halaman publik proyek ini. Tidak ada versi
            draft kedua pada tahap ini.
          </p>
        ) : null}

        {unpublishConfirm ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-danger/20 bg-danger-soft px-4 py-3">
            <p className="flex items-start gap-2 text-[14px] leading-6 text-ink">
              <Icon name="alert" className="mt-0.5 size-4 text-danger" />
              Tarik proyek ini dari tampilan publik? Tautan publiknya langsung tidak dapat dibuka pengunjung.
            </p>
            <span className="flex gap-2">
              <button
                type="button"
                onClick={confirmUnpublish}
                className="h-9 rounded-[10px] bg-danger px-3.5 text-[14px] font-semibold text-white"
              >
                Ya, tarik
              </button>
              <button
                type="button"
                onClick={() => setUnpublishConfirm(false)}
                className="h-9 rounded-[10px] border border-line bg-surface px-3.5 text-[14px] font-medium text-ink"
              >
                Batal
              </button>
            </span>
          </div>
        ) : null}

        {saveError ? (
          <p
            role="alert"
            className="mt-4 flex items-start gap-2 rounded-[10px] border border-danger/20 bg-danger-soft px-4 py-2.5 text-[14px] leading-6 text-ink"
          >
            <Icon name="alert" className="mt-0.5 size-4 text-danger" />
            {saveError}
          </p>
        ) : null}

        {hasErrors(errors) ? (
          <p
            role="alert"
            className="mt-4 flex items-start gap-2 rounded-[10px] border border-danger/20 bg-danger-soft px-4 py-2.5 text-[14px] leading-6 text-ink"
          >
            <Icon name="alert" className="mt-0.5 size-4 text-danger" />
            Beberapa isian wajib belum lengkap. Isian yang perlu diperbaiki sudah ditandai.
          </p>
        ) : null}

        <p role="status" aria-live="polite" className="mt-4 empty:hidden">
          {flash ? (
            <span className="inline-flex items-start gap-2 rounded-[10px] border border-accent/20 bg-accent-soft px-3.5 py-2 text-[14px] leading-6 text-accent">
              <Icon name="checkCircle" className="mt-0.5 size-4" />
              {flash}
            </span>
          ) : null}
        </p>
      </header>

      {isGuided ? (
        <section id="editor-langkah" aria-label="Langkah pengisian proyek" className="mt-8 scroll-mt-24 rounded-xl border border-line bg-surface p-4 sm:p-5">
          <p className="text-[13px] font-semibold text-accent">Langkah {currentStep + 1} dari 4</p>
          <h2 className="mt-1 text-[20px] font-semibold text-ink">{GUIDED_STEPS[currentStep]}</h2>
          <p className="mt-1 text-[14px] leading-6 text-ink-2">{STEP_HELP[currentStep]}</p>
          <ol className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {GUIDED_STEPS.map((label, index) => (
              <li
                key={label}
                aria-current={index === currentStep ? "step" : undefined}
                className={`flex min-h-10 items-center gap-2 rounded-[10px] border px-3 text-[13px] font-medium ${
                  index === currentStep
                    ? "border-accent bg-accent-soft text-accent"
                    : index < currentStep
                      ? "border-line bg-canvas text-ink"
                      : "border-line bg-surface text-ink-2"
                }`}
              >
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-current text-[11px]">
                  {index + 1}
                </span>
                {label}
              </li>
            ))}
          </ol>
        </section>
      ) : (
        <nav aria-label="Bagian editor proyek" className="mt-8 rounded-xl border border-line bg-surface p-4">
          <p className="text-[13px] font-medium text-ink-2">Lompat ke bagian yang ingin diubah</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { href: "#identitas-proyek", label: "Identitas" },
              { href: "#cerita-proyek", label: "Cerita" },
              { href: "#bukti-karya", label: "Bukti karya" },
            ].map((section) => (
              <a
                key={section.href}
                href={section.href}
                className="inline-flex min-h-9 items-center rounded-full border border-line bg-canvas px-3 text-[13px] font-medium text-ink transition-colors hover:border-accent/40 hover:text-accent"
              >
                {section.label}
              </a>
            ))}
          </div>
        </nav>
      )}

      <div className="mt-9 grid gap-9 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
        <div className="min-w-0">
          {isGuided && currentStep === 3 ? (
            isPublished && publicHref ? (
              <section className="rounded-xl border border-accent/20 bg-accent-soft p-6">
                <Icon name="checkCircle" className="size-8 text-accent" />
                <h2 className="mt-4 text-[22px] font-semibold text-ink">Proyek sudah terbit</h2>
                <p className="mt-2 text-[15px] leading-6 text-ink-2">
                  Halaman publik proyek sudah dapat dibuka. Anda tetap bisa meninjau isinya dari sini.
                </p>
                <Link href={publicHref} className={`${PRIMARY_BUTTON} mt-5`}>
                  Buka proyek publik
                  <Icon name="arrowRight" className="size-4" />
                </Link>
              </section>
            ) : (
              <PublishChecklist
                id="checklist-terbit"
                items={checklist}
                consentRights={form.consentRights}
                consentNoSensitive={form.consentNoSensitive}
                onConsentRightsChange={(value) => update({ consentRights: value })}
                onConsentNoSensitiveChange={(value) => update({ consentNoSensitive: value })}
              />
            )
          ) : (
            <EditorForm
              form={form}
              errors={errors}
              activeSection={activeSection}
              onChange={update}
              onSourceChange={changeSource}
              onAddSource={addSource}
              onRemoveSource={removeSource}
            />
          )}

          {!isGuided && !isPublished ? (
            <PublishChecklist
              id="checklist-terbit"
              className="mt-10"
              items={checklist}
              consentRights={form.consentRights}
              consentNoSensitive={form.consentNoSensitive}
              onConsentRightsChange={(value) => update({ consentRights: value })}
              onConsentNoSensitiveChange={(value) => update({ consentNoSensitive: value })}
            />
          ) : null}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <EditorPreview project={previewProject} status={status} publicHref={publicHref} />
        </aside>
      </div>

      <PreviewDialog
        open={previewOpen}
        onClose={closePreview}
        project={previewProject}
        status={status}
        ownerName={owner.displayName}
        publicHref={publicHref}
      />

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 px-5 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur sm:px-8">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex items-center justify-between gap-3 text-[13px] leading-5 text-ink-2 sm:justify-start">
            <span aria-live="polite">
              {saveError
                ? "Gagal menyimpan"
                : hasErrors(errors)
                  ? "Periksa isian yang ditandai"
                  : isBusy
                    ? "Sedang menyimpan..."
                    : dirty || !savedSlug
                      ? "Perubahan belum disimpan"
                      : "Semua perubahan tersimpan"}
            </span>
            {isGuided ? <span className="font-medium sm:hidden">{currentStep + 1}/4</span> : null}
          </div>

          <div className="flex w-full gap-2 sm:w-auto sm:shrink-0">
            {isGuided && currentStep > 0 ? (
              <button
                type="button"
                onClick={() => void moveToStep((currentStep - 1) as GuidedStep)}
                disabled={isBusy}
                className={`${SECONDARY_BUTTON} flex-1 justify-center sm:flex-none`}
              >
                Kembali
              </button>
            ) : null}

            {!(isGuided && isPublished && currentStep === 3) ? (
              <button
                type="button"
                onClick={handleSave}
                disabled={isBusy}
                className={`${isPublished ? PRIMARY_BUTTON : SECONDARY_BUTTON} flex-1 justify-center sm:flex-none`}
              >
                <Icon name="save" className="hidden size-4 sm:block" />
                {busy === "save" ? "Menyimpan..." : isPublished ? "Simpan perubahan publik" : "Simpan draft"}
              </button>
            ) : null}

            {isGuided && !isPublished && currentStep < 3 ? (
              <button
                type="button"
                onClick={() => void moveToStep((currentStep + 1) as GuidedStep)}
                disabled={isBusy}
                className={`${PRIMARY_BUTTON} flex-1 justify-center sm:flex-none`}
              >
                Berikutnya
                <Icon name="arrowRight" className="hidden size-4 sm:block" />
              </button>
            ) : null}

            {!isPublished && (!isGuided || currentStep === 3) ? (
              <button
                type="button"
                onClick={handlePublish}
                disabled={isBusy}
                className={`${PRIMARY_BUTTON} flex-1 justify-center sm:flex-none`}
              >
                <Icon name="upload" className="hidden size-4 sm:block" />
                {busy === "publish" ? "Menerbitkan..." : "Terbitkan"}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
