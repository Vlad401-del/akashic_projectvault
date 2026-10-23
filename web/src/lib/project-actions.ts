"use server";

import { revalidatePath } from "next/cache";

import { DEMO_OWNER_USERNAME, listOwnedProjects } from "@/lib/content";
import {
  formToProject,
  hasErrors,
  slugify,
  validateForm,
  type EditorErrors,
  type EditorForm,
} from "@/lib/editor-form";
import type { Project, ProjectStatus } from "@/lib/fixtures/types";
import { saveStoredProject } from "@/lib/local-store";

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
 * Menyimpan isi editor ke penyimpanan lokal dan mengembalikan alamat proyeknya.
 *
 * Ini tindakan server (server action), bukan simulasi di peramban: isinya
 * ditulis ke `web/.data/projects.json`. Validasi yang sama dipakai lagi di sini
 * supaya aturan tidak hanya bergantung pada sisi klien.
 *
 * Yang belum ada dan sengaja ditunda: autentikasi, jadi pemilik proyek selalu
 * akun contoh; dan database, jadi penyimpanannya berkas lokal, bukan Supabase.
 */
export async function saveProjectAction(input: SaveProjectInput): Promise<SaveProjectResult> {
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
