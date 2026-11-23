"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { EditorForm } from "@/components/editor/editor-form";
import { EditorPreview } from "@/components/editor/editor-preview";
import { PreviewDialog } from "@/components/editor/preview-dialog";
import { PublishChecklist } from "@/components/editor/publish-checklist";
import { StatusChip } from "@/components/editor/status-chip";
import { Icon } from "@/components/icons";
import {
  canPublish,
  emptyForm,
  formToProject,
  hasErrors,
  projectToForm,
  publishChecklist,
  validateForm,
  validatePublishedContent,
  validateStep,
  type EditorErrors,
  type EditorForm as EditorFormValue,
  type EditorSource,
} from "@/lib/editor-form";
import type { Profile, Project, ProjectStatus } from "@/lib/fixtures/types";
import { deleteProjectAction, saveProjectAction } from "@/lib/project-actions";

const PRIMARY_BUTTON =
  "inline-flex h-11 items-center justify-center gap-2 rounded-[10px] bg-accent px-4 text-[15px] font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60";
const SECONDARY_BUTTON =
  "inline-flex h-11 items-center justify-center gap-2 rounded-[10px] border border-line bg-surface px-4 text-[15px] font-medium text-ink transition-colors hover:border-line-strong disabled:cursor-not-allowed disabled:opacity-60";

/** Aksi yang sedang berjalan; dipakai untuk menonaktifkan tombol dan mengganti label. */
type BusyKind = null | "save" | "publish" | "unpublish" | "delete";

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
 * Isi formulir disimpan lalu langsung tampil di halaman publik proyek saat
 * diterbitkan.
 *
 * Tiga keadaan layar mengikuti desain: Proyek baru (formulir kosong), Draft
 * (sudah ada isinya tetapi belum tampil publik), dan Sudah terbit.
 */
export function ProjectEditor({
  owner,
  project = null,
  allowDelete = false,
}: {
  owner: Profile;
  project?: Project | null;
  allowDelete?: boolean;
}) {
  const router = useRouter();
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
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [errorFocusRequest, setErrorFocusRequest] = useState(0);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const stepContent = useRef<HTMLDivElement>(null);
  const previousStep = useRef(step);
  useEffect(() => {
    if (previousStep.current === step) return;
    previousStep.current = step;
    stepContent.current?.scrollIntoView({ block: "start", behavior: "instant" });
    stepContent.current?.focus({ preventScroll: true });
  }, [step]);

  const steps = ["Identitas", "Masalah & proses", "Kontribusi & hasil", "Bukti & terbit"] as const;

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
      const next = { ...current };
      for (const field of Object.keys(patch) as (keyof EditorFormValue)[]) {
        if (field in next) delete next[field as keyof EditorErrors];
      }
      if (patch.coverImageUrl !== undefined) delete next.evidence;
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

      return { ...current, evidence: undefined, sources: Object.keys(sources).length > 0 ? sources : undefined };
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
   * Menyimpan formulir ke penyimpanan lokal.
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
  }) => {
    const found = nextStatus === "published" ? validatePublishedContent(form) : validateForm(form);
    setErrors(found);
    setSaveError(null);

    if (hasErrors(found)) {
      setFlash(null);
      const firstIncomplete = ([1, 2, 3, 4] as const).find((item) => hasErrors(validateStep(form, item)));
      if (firstIncomplete) setStep(firstIncomplete);
      setErrorFocusRequest((request) => request + 1);
      return false;
    }

    const isNewProject = savedSlug === null;
    setBusy(busyKind);

    try {
      const result = await saveProjectAction({ slug: savedSlug, status: nextStatus, form });

      if (!result.ok) {
        setErrors(result.errors);
        setSaveError("Ada isian yang belum sesuai. Periksa bagian yang ditandai, lalu simpan lagi.");
        const firstIncomplete = ([1, 2, 3, 4] as const).find((item) => hasErrors(validateStep(form, item)));
        if (firstIncomplete) setStep(firstIncomplete);
        setErrorFocusRequest((request) => request + 1);
        return false;
      }

      setStatus(result.status);
      setDirty(false);
      setErrors({});

      if (isNewProject) {
        // Simpan slug di state agar langkah yang sedang diisi tidak ter-reset
        // oleh pergantian rute. Draft dapat dibuka kembali dari dasbor.
        setSavedSlug(result.slug);
      }

      setFlash(`${note} Pukul ${timeNow()}.`);
      return true;
    } catch {
      setSaveError(
        "Gagal menyimpan perubahan. Pastikan koneksi stabil, lalu simpan lagi.",
      );
      return false;
    } finally {
      setBusy(null);
    }
  };

  const nextStep = async () => {
    if (step === 4 || isBusy) return;
    const found = validateStep(form, step);
    setErrors(found);
    if (hasErrors(found)) {
      setSaveError("Lengkapi isian yang ditandai sebelum melanjutkan.");
      setErrorFocusRequest((request) => request + 1);
      return;
    }

    if (status === "draft") {
      const saved = await save({ nextStatus: "draft", busyKind: "save", note: "Draft otomatis tersimpan." });
      if (!saved) return;
    }

    setErrors({});
    setSaveError(null);
    setStep((current) => (current + 1) as 1 | 2 | 3 | 4);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = () => {
    void save({
      nextStatus: status,
      busyKind: "save",
      note: status === "published" ? "Perubahan publik tersimpan." : "Draft tersimpan.",
    });
  };

  const handlePublish = () => {
    if (!publishReady) {
      const found = validatePublishedContent(form);
      if (hasErrors(found)) {
        setErrors(found);
        const firstIncomplete = ([1, 2, 3, 4] as const).find((item) => hasErrors(validateStep(form, item)));
        if (firstIncomplete) setStep(firstIncomplete);
        setSaveError("Lengkapi bagian yang ditandai sebelum menerbitkan.");
        setErrorFocusRequest((request) => request + 1);
      } else {
        document.getElementById("checklist-terbit")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
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

  const confirmDelete = async () => {
    if (!savedSlug || busy) return;
    setBusy("delete");
    setSaveError(null);
    try {
      const deleted = await deleteProjectAction(savedSlug);
      if (!deleted) {
        setSaveError("Proyek belum dapat dihapus. Muat ulang halaman lalu coba lagi.");
        return;
      }
      setDirty(false);
      router.replace("/dashboard");
    } catch {
      setSaveError("Proyek belum dapat dihapus. Periksa koneksi lalu coba lagi.");
    } finally {
      setBusy(null);
      setDeleteConfirm(false);
    }
  };

  const isPublished = status === "published";
  const isBusy = busy !== null;

  return (
    <div className="mx-auto min-w-0 w-full max-w-[1120px] px-5 pb-24 pt-8 sm:px-8 sm:pt-10 xl:px-0">
      <header>
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="min-w-0 w-full sm:w-auto">
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

          <div className="grid min-w-0 w-full grid-cols-2 gap-2.5 sm:flex sm:w-auto sm:flex-wrap">
            {allowDelete && savedSlug ? (
              <button
                type="button"
                onClick={() => setDeleteConfirm(true)}
                disabled={isBusy}
                className="inline-flex h-11 items-center justify-center rounded-[10px] border border-danger/30 bg-surface px-4 text-[15px] font-medium text-danger transition-colors hover:bg-danger-soft disabled:opacity-60"
              >
                Hapus proyek
              </button>
            ) : null}
            <button type="button" onClick={() => setPreviewOpen(true)} className={SECONDARY_BUTTON}>
              <Icon name="eye" className="size-4" />
              Pratinjau
            </button>

            {isPublished ? (
              <>
                <button
                  type="button"
                  onClick={() => setUnpublishConfirm(true)}
                  disabled={unpublishConfirm || isBusy}
                  className={`${SECONDARY_BUTTON} col-span-2 sm:col-span-1`}
                >
                  <Icon name="x" className="size-4" />
                  {busy === "unpublish" ? "Menarik..." : "Tarik dari publik"}
                </button>
                <button type="button" onClick={handleSave} disabled={isBusy} className={`${PRIMARY_BUTTON} col-span-2 sm:col-span-1`}>
                  <Icon name="save" className="size-4" />
                  {busy === "save" ? "Menyimpan..." : "Simpan perubahan publik"}
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={handleSave} disabled={isBusy} className={SECONDARY_BUTTON}>
                  <Icon name="save" className="size-4" />
                  {busy === "save" ? "Menyimpan..." : "Simpan draft"}
                </button>
              </>
            )}
          </div>
        </div>

        {isPublished ? (
          <div className="mt-4 space-y-3">
            <p className="max-w-[46rem] text-[13px] leading-5 text-ink-2">
              Simpan perubahan langsung mengganti isi halaman publik proyek ini.
            </p>
            {publicHref ? <Link href={publicHref} className={`${SECONDARY_BUTTON} lg:hidden`}><Icon name="externalLink" className="size-4" />Buka halaman publik</Link> : null}
          </div>
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

        {deleteConfirm ? (
          <div role="alertdialog" aria-label="Konfirmasi hapus proyek" className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-danger/30 bg-danger-soft px-4 py-3">
            <p className="max-w-[40rem] text-[14px] leading-6 text-ink">
              Hapus “{project?.title}” beserta tautan buktinya? Proyek tidak bisa dipulihkan setelah dihapus.
              {dirty ? " Perubahan yang belum disimpan juga akan hilang." : ""}
            </p>
            <span className="flex gap-2">
              <button type="button" onClick={() => void confirmDelete()} disabled={isBusy} className="h-9 rounded-[10px] bg-danger px-3.5 text-[14px] font-semibold text-white disabled:opacity-60">
                {busy === "delete" ? "Menghapus..." : "Ya, hapus proyek"}
              </button>
              <button type="button" onClick={() => setDeleteConfirm(false)} disabled={isBusy} className="h-9 rounded-[10px] border border-line bg-surface px-3.5 text-[14px] font-medium text-ink disabled:opacity-60">
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

      <nav aria-label="Langkah membuat proyek" className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {steps.map((label, index) => {
          const number = (index + 1) as 1 | 2 | 3 | 4;
          return (
            <button
              key={label}
              type="button"
              disabled={number > step}
              onClick={() => setStep(number)}
              aria-current={number === step ? "step" : undefined}
              className={`min-h-12 rounded-lg border px-3 py-2 text-left text-[13px] font-semibold transition-colors ${
                number === step ? "border-accent bg-accent text-white" : "border-line bg-surface text-ink disabled:opacity-60 hover:border-accent"
              }`}
            >
              <span className="mr-2 tabular-nums">{number}.</span>{label}
            </button>
          );
        })}
      </nav>
      <p className="mt-3 text-[13px] leading-5 text-ink-2">
        Langkah {step} dari 4. Isian opsional boleh dikosongkan. {status === "draft" ? "Draft tersimpan saat kamu menekan Lanjut." : "Perubahan publik berlaku setelah Simpan perubahan publik."}
      </p>

      <div className="mt-9 grid gap-9 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
        <div ref={stepContent} tabIndex={-1} role="region" aria-label={`Langkah ${step}: ${steps[step - 1]}`} className="min-w-0 scroll-mt-24 focus:outline-none">
          <EditorForm
            form={form}
            step={step}
            errors={errors}
            onChange={update}
            onSourceChange={changeSource}
            onAddSource={addSource}
            onRemoveSource={removeSource}
          />

          {!isPublished && step === 4 ? (
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

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
            <button type="button" disabled={step === 1 || isBusy} onClick={() => setStep((current) => (current - 1) as 1 | 2 | 3 | 4)} className={SECONDARY_BUTTON}>
              Kembali
            </button>
            {step < 4 ? (
              <button type="button" disabled={isBusy} onClick={() => void nextStep()} className={PRIMARY_BUTTON}>
                {busy === "save" ? "Menyimpan..." : "Lanjut"}
                <Icon name="arrowRight" className="size-4" />
              </button>
            ) : !isPublished ? (
              <button type="button" disabled={isBusy} onClick={handlePublish} className={PRIMARY_BUTTON}>
                <Icon name="upload" className="size-4" />
                {busy === "publish" ? "Menerbitkan..." : "Terbitkan proyek"}
              </button>
            ) : null}
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <details className="rounded-xl border border-line lg:hidden">
            <summary className="min-h-11 cursor-pointer px-4 py-3 text-sm font-semibold text-accent">Lihat pratinjau ringkas</summary>
            <EditorPreview project={previewProject} status={status} publicHref={publicHref} />
          </details>
          <div className="hidden lg:block"><EditorPreview project={previewProject} status={status} publicHref={publicHref} /></div>
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
    </div>
  );
}
