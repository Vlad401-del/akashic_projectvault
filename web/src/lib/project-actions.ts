"use server";

import { revalidatePath } from "next/cache";

import { DEMO_OWNER_USERNAME, listOwnedProjects } from "@/lib/content";
import { isLocalDemoEditorEnabled } from "@/lib/demo-mode";
import {
  formToProject,
  canPublish,
  hasErrors,
  slugify,
  validateForm,
  type EditorErrors,
  type EditorForm,
} from "@/lib/editor-form";
import type { Project, ProjectStatus } from "@/lib/fixtures/types";
import { saveStoredProject } from "@/lib/local-store";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { projectStory } from "@/lib/supabase/mappers";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/supabase/database.types";

export type SaveProjectInput = {
  /** Slug proyek yang sedang diedit; `null` bila ini proyek baru. */
  slug: string | null;
  /** Status yang diminta untuk proyek ini. */
  status: ProjectStatus;
  form: EditorForm;
};

export type SaveProjectResult =
  | { ok: true; slug: string; status: ProjectStatus; savedAt: string }
  | { ok: false; errors: EditorErrors };

/**
 * Membuat slug yang belum dipakai pemilik ini.
 *
 * Slug menjadi bagian alamat halaman publik, jadi harus unik. Bila judul yang
 * sama sudah ada, ditambahkan angka di belakangnya.
 */
function uniqueSlug(title: string): string {
  const base = slugify(title) || "proyek-baru";
  const taken = new Set(listOwnedProjects().map((project) => project.slug));

  if (!taken.has(base)) {
    return base;
  }

  let counter = 2;

  while (taken.has(`${base}-${counter}`)) {
    counter += 1;
  }

  return `${base}-${counter}`;
}

/**
 * Menyimpan isi editor dan mengembalikan alamat proyeknya.
 *
 * Dalam mode Cloud, sesi diverifikasi dan data ditulis ke Supabase. Tanpa
 * konfigurasi Cloud, mode pengembangan menulis ke `web/.data/projects.json`.
 * Validasi dilakukan ulang di server agar tidak hanya bergantung pada klien.
 */
export async function saveProjectAction(input: SaveProjectInput): Promise<SaveProjectResult> {
  if (isSupabaseConfigured()) {
    return saveCloudProject(input);
  }

  // Server Actions dapat dipanggil langsung; menyembunyikan halaman saja tidak cukup.
  if (!isLocalDemoEditorEnabled()) {
    throw new Error("Editor demo tidak tersedia pada aplikasi yang di-host.");
  }

  const errors = validateForm(input.form);

  if (hasErrors(errors)) {
    return { ok: false, errors };
  }

  const existing = input.slug
    ? (listOwnedProjects().find((project) => project.slug === input.slug) ?? null)
    : null;

  if (input.slug && !existing) {
    return { ok: false, errors: { title: "Proyek ini tidak ditemukan lagi di penyimpanan lokal." } };
  }

  // Slug tidak ikut berubah saat judul diubah, supaya alamat halaman publik
  // yang sudah dibagikan tidak mati begitu saja.
  const slug = existing ? existing.slug : uniqueSlug(input.form.title);

  const project: Project = {
    ...formToProject(input.form, input.status),
    slug,
    // Galeri belum dapat diubah dari editor, jadi isi lama dipertahankan.
    gallery: existing?.gallery ?? [],
  };

  const savedAt = new Date().toISOString();

  saveStoredProject({ ownerUsername: DEMO_OWNER_USERNAME, project, savedAt });

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath(`/u/${DEMO_OWNER_USERNAME}`);
  revalidatePath(`/u/${DEMO_OWNER_USERNAME}/p/${slug}`);
  revalidatePath(`/dashboard/projects/${slug}/edit`);

  return { ok: true, slug, status: project.status, savedAt };
}

async function saveCloudProject(input: SaveProjectInput): Promise<SaveProjectResult> {
  const errors = validateForm(input.form);
  if (hasErrors(errors)) return { ok: false, errors };
  if (input.status === "published" && !canPublish(input.form)) {
    return { ok: false, errors: { summary: "Lengkapi daftar kesiapan dan pernyataan sebelum menerbitkan." } };
  }

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const ownerId = auth?.claims?.sub;
  if (!ownerId) throw new Error("Sesi berakhir. Masuk kembali sebelum menyimpan.");

  const { data: owner, error: ownerError } = await supabase.from("profiles").select("username").eq("id", ownerId).single();
  if (ownerError || !owner) throw new Error("Profil akun belum tersedia.");

  const { data: existing, error: existingError } = input.slug
    ? await supabase.from("projects").select("id, slug").eq("owner_id", ownerId).eq("slug", input.slug).maybeSingle()
    : { data: null, error: null };
  if (existingError) throw new Error("Proyek belum dapat dibaca.");
  if (input.slug && !existing) return { ok: false, errors: { title: "Proyek ini tidak ditemukan di akunmu." } };

  let slug = existing?.slug;
  if (!slug) {
    const base = slugify(input.form.title) || "proyek-baru";
    const { data: rows, error: slugsError } = await supabase.from("projects").select("slug").eq("owner_id", ownerId);
    if (slugsError) throw new Error("Daftar proyek belum dapat dibaca.");
    const taken = new Set((rows ?? []).map((row) => row.slug));
    slug = base;
    for (let counter = 2; taken.has(slug); counter += 1) slug = `${base.slice(0, 56)}-${counter}`;
  }

  const project: Project = { ...formToProject(input.form, input.status), slug };
  const payload: TablesInsert<"projects"> = {
    owner_id: ownerId,
    slug,
    title: project.title,
    summary: project.summary,
    category: project.category,
    work_type: project.workType,
    period: project.period,
    course: project.course,
    role: project.role,
    team_size: project.teamSize,
    skills: project.skills,
    tools: project.tools,
    story: projectStory(project),
    status: project.status,
    updated_at: new Date().toISOString(),
  };

  const saved = existing
    ? await supabase.from("projects").update(payload).eq("id", existing.id).eq("owner_id", ownerId).select("id").single()
    : await supabase.from("projects").insert(payload).select("id").single();
  if (saved.error || !saved.data) {
    return { ok: false, errors: { title: "Proyek belum dapat disimpan. Coba judul lain atau ulangi beberapa saat lagi." } };
  }

  // Upsert before deleting trailing rows, so a failed write preserves existing evidence.
  const sourceRows = project.sources.map((source, position) => ({
    project_id: saved.data.id,
    position,
    label: source.label,
    url: source.url,
  }));
  if (sourceRows.length > 0) {
    const { error: sourceError } = await supabase.from("project_sources").upsert(sourceRows, { onConflict: "project_id,position" });
    if (sourceError) throw new Error("Proyek tersimpan, tetapi tautan bukti belum. Coba simpan ulang.");
  }
  const { error: deleteError } = await supabase.from("project_sources").delete().eq("project_id", saved.data.id).gte("position", sourceRows.length);
  if (deleteError) throw new Error("Proyek tersimpan, tetapi daftar tautan belum tersinkron. Coba simpan ulang.");

  const savedAt = new Date().toISOString();
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath(`/u/${owner.username}`);
  revalidatePath(`/u/${owner.username}/p/${slug}`);
  revalidatePath(`/dashboard/projects/${slug}/edit`);
  return { ok: true, slug, status: project.status, savedAt };
}
