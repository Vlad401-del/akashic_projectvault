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

const PRIMARY_BUTTON =
  "inline-flex h-11 items-center gap-2 rounded-[10px] bg-accent px-4 text-[15px] font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60";
const SECONDARY_BUTTON =
  "inline-flex h-11 items-center gap-2 rounded-[10px] border border-line bg-surface px-4 text-[15px] font-medium text-ink transition-colors hover:border-line-strong disabled:cursor-not-allowed disabled:opacity-60";

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
 * Ini layar UI tanpa database maupun autentikasi. Tombol Simpan dan Terbitkan
 * menyimulasikan perilakunya di dalam peramban ini saja dan hal itu dinyatakan
 * pada pemberitahuan di atas formulir, supaya tidak disangka data tersimpan.
 *
 * Tiga keadaan layar mengikuti desain: Proyek baru (formulir kosong), Draft
 * (sudah ada isinya tetapi belum tampil publik), dan Sudah terbit.
 */
export function ProjectEditor({ owner, project = null }: { owner: Profile; project?: Project | null }) {
  const initialStatus: ProjectStatus = project ? project.status : "draft";

  const [form, setForm] = useState<EditorFormValue>(() => (project ? projectToForm(project) : emptyForm()));
  const [status, setStatus] = useState<ProjectStatus>(initialStatus);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [errors, setErrors] = useState<EditorErrors>({});
  const [flash, setFlash] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [unpublishConfirm, setUnpublishConfirm] = useState(false);
  const [errorFocusRequest, setErrorFocusRequest] = useState(0);

  const previewProject = useMemo(() => formToProject(form, status), [form, status]);
  const checklist = useMemo(() => publishChecklist(form), [form]);
  const publishReady = useMemo(() => canPublish(form), [form]);

  const originallyPublished = project !== null && project.status === "published";
  const publicHref =
    status === "published" && originallyPublished ? `/u/${owner.username}/p/${project.slug}` : null;

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

  // Simulasi proses menyimpan. Tidak ada permintaan jaringan di sini.
  useEffect(() => {
    if (!saving) {
      return;
    }

    const timer = window.setTimeout(() => {
      setSaving(false);
      setDirty(false);
      setErrors({});
      setFlash(`Tersimpan pukul ${timeNow()} sebagai simulasi. Belum ada data yang dikirim.`);
    }, 700);

    return () => window.clearTimeout(timer);
  }, [saving]);

  // Simulasi penerbitan lokal.
  useEffect(() => {
    if (!publishing) {
      return;
    }

    const timer = window.setTimeout(() => {
      setPublishing(false);
      setStatus("published");
      setDirty(false);
      setFlash("Status diubah menjadi sudah terbit sebagai simulasi tampilan.");
    }, 900);

    return () => window.clearTimeout(timer);
  }, [publishing]);

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

  const handleSave = () => {
    const found = validateForm(form);
    setErrors(found);

    if (hasErrors(found)) {
      setFlash(null);
      setErrorFocusRequest((request) => request + 1);
      return;
    }

    setSaving(true);
  };

  const handlePublish = () => {
    if (!publishReady) {
      document.getElementById("checklist-terbit")?.scrollIntoView({ behavior: "smooth", block: "start" });
      setFlash(null);
      return;
    }

    setPublishing(true);
  };

  const confirmUnpublish = () => {
    setUnpublishConfirm(false);
    setStatus("draft");
    setDirty(false);
    setFlash("Proyek ditarik dari tampilan publik sebagai simulasi.");
  };

  const isPublished = status === "published";

  return (
    <div className="mx-auto max-w-[1120px] px-5 pb-24 pt-8 sm:px-8 sm:pt-10 xl:px-0">
      <PrototypeNotice className="mb-8">
        Simulasi area pemilik. Belum ada login, database, atau unggahan, jadi tombol Simpan dan Terbitkan
        hanya mengubah tampilan di peramban ini.
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
                  disabled={unpublishConfirm || publishing}
                  className={SECONDARY_BUTTON}
                >
                  <Icon name="x" className="size-4" />
                  Tarik dari publik
                </button>
                <button type="button" onClick={handleSave} disabled={saving} className={PRIMARY_BUTTON}>
                  <Icon name="save" className="size-4" />
                  {saving ? "Menyimpan..." : "Simpan perubahan publik"}
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={handleSave} disabled={saving} className={SECONDARY_BUTTON}>
                  <Icon name="save" className="size-4" />
                  {saving ? "Menyimpan..." : "Simpan draft"}
                </button>
                <button type="button" onClick={handlePublish} disabled={publishing} className={PRIMARY_BUTTON}>
                  <Icon name="upload" className="size-4" />
                  {publishing ? "Menerbitkan..." : "Terbitkan"}
                </button>
              </>
            )}
          </div>
        </div>

        {isPublished ? (
          <p className="mt-4 max-w-[46rem] text-[13px] leading-5 text-ink-2">
            {publicHref
              ? "Simpan perubahan publik langsung mengganti isi halaman publik proyek ini. Tidak ada versi draft kedua pada tahap ini."
              : "Pada simulasi ini belum ada halaman publik baru. Setelah database tersedia, terbit akan membuat tautan publiknya."}
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

        {hasErrors(errors) ? (
          <p role="alert" className="mt-4 flex items-start gap-2 rounded-[10px] border border-danger/20 bg-danger-soft px-4 py-2.5 text-[14px] leading-6 text-ink">
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
