"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { EditorForm } from "@/components/editor/editor-form";
import { EditorPreview } from "@/components/editor/editor-preview";
import { PreviewDialog } from "@/components/editor/preview-dialog";
import { PublishChecklist } from "@/components/editor/publish-checklist";
import { StatusChip } from "@/components/editor/status-chip";
import { Icon } from "@/components/icons";
import { PrototypeNotice } from "@/components/prototype-notice";
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

const PRIMARY_BUTTON =
  "inline-flex h-11 items-center gap-2 rounded-[10px] bg-accent px-4 text-[15px] font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60";
const SECONDARY_BUTTON =
  "inline-flex h-11 items-center gap-2 rounded-[10px] border border-line bg-surface px-4 text-[15px] font-medium text-ink transition-colors hover:border-line-strong disabled:cursor-not-allowed disabled:opacity-60";

/** Aksi yang sedang berjalan; dipakai untuk menonaktifkan tombol dan mengganti label. */
type BusyKind = null | "save" | "publish" | "unpublish";

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
 * Isi formulir disimpan sungguhan, tetapi ke penyimpanan lokal di komputer ini
 * (`web/.data/projects.json`), bukan ke database. Belum ada autentikasi, jadi
 * pemilik proyek selalu akun contoh; hal itu dinyatakan pada pemberitahuan di
 * atas formulir.
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
    const found = validateForm(form);
    setErrors(found);
    setSaveError(null);

    if (hasErrors(found)) {
      setFlash(null);
      setErrorFocusRequest((request) => request + 1);
      return;
    }

    const isNewProject = savedSlug === null;
    setBusy(busyKind);

    try {
      const result = await saveProjectAction({ slug: savedSlug, status: nextStatus, form });

      if (!result.ok) {
        setErrors(result.errors);
        setSaveError("Penyimpanan lokal menolak isian ini. Periksa bagian yang ditandai, lalu simpan lagi.");
        setErrorFocusRequest((request) => request + 1);
        return;
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
    } catch {
      setSaveError(
        "Gagal menulis ke penyimpanan lokal. Pastikan server masih berjalan, lalu simpan lagi.",
      );
    } finally {
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

  return (
    <div className="mx-auto max-w-[1120px] px-5 pb-24 pt-8 sm:px-8 sm:pt-10 xl:px-0">
      <PrototypeNotice className="mb-8">
        Area pemilik tanpa login. Isi formulir disimpan ke berkas lokal di komputer ini
        (web/.data/projects.json), bukan ke database, dan siapa pun yang dapat membuka localhost
        juga dapat mengubahnya.
      </PrototypeNotice>

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
              <>
                <button
                  type="button"
                  onClick={() => setUnpublishConfirm(true)}
                  disabled={unpublishConfirm || isBusy}
                  className={SECONDARY_BUTTON}
                >
                  <Icon name="x" className="size-4" />
                  {busy === "unpublish" ? "Menarik..." : "Tarik dari publik"}
                </button>
                <button type="button" onClick={handleSave} disabled={isBusy} className={PRIMARY_BUTTON}>
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
                <button type="button" onClick={handlePublish} disabled={isBusy} className={PRIMARY_BUTTON}>
                  <Icon name="upload" className="size-4" />
                  {busy === "publish" ? "Menerbitkan..." : "Terbitkan"}
                </button>
              </>
            )}
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

      <div className="mt-9 grid gap-9 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
        <div className="min-w-0">
          <EditorForm
            form={form}
            errors={errors}
            onChange={update}
            onSourceChange={changeSource}
            onAddSource={addSource}
            onRemoveSource={removeSource}
          />

          {isPublished ? null : (
            <PublishChecklist
              id="checklist-terbit"
              className="mt-10"
              items={checklist}
              consentRights={form.consentRights}
              consentNoSensitive={form.consentNoSensitive}
              onConsentRightsChange={(value) => update({ consentRights: value })}
              onConsentNoSensitiveChange={(value) => update({ consentNoSensitive: value })}
            />
          )}
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
    </div>
  );
}
