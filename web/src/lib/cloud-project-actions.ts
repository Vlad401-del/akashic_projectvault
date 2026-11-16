import { revalidatePath } from "next/cache";

import {
  formToProject,
  hasErrors,
  slugify,
  validateForm,
  validatePublishedContent,
} from "@/lib/editor-form";
import type { SaveProjectInput, SaveProjectResult } from "@/lib/project-actions";
import { projectStory } from "@/lib/supabase/mappers";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/supabase/database.types";

export async function saveCloudProject(input: SaveProjectInput): Promise<SaveProjectResult> {
  const errors = validateForm(input.form);
  if (hasErrors(errors)) return { ok: false, errors };
  if (input.status === "published") {
    const publicationErrors = validatePublishedContent(input.form);
    if (hasErrors(publicationErrors)) return { ok: false, errors: publicationErrors };
  }

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const ownerId = auth.user?.id;
  if (!ownerId) return { ok: false, errors: { publish: "Sesi berakhir. Masuk lagi sebelum menyimpan." } };

  const { data: owner, error: ownerError } = await supabase
    .from("profiles").select("username").eq("id", ownerId).single();
  if (ownerError || !owner) throw new Error("Profil akun belum tersedia.");

  const { data: existing, error: existingError } = input.slug
    ? await supabase.from("projects").select("id, slug, status").eq("owner_id", ownerId).eq("slug", input.slug).maybeSingle()
    : { data: null, error: null };
  if (existingError) throw new Error("Proyek belum dapat dibaca.");
  if (input.slug && !existing) return { ok: false, errors: { title: "Proyek ini tidak ditemukan di akunmu." } };
  if (input.status === "published" && existing?.status !== "published"
    && (!input.form.consentRights || !input.form.consentNoSensitive)) {
    return { ok: false, errors: { publish: "Centang kedua pernyataan sebelum menerbitkan." } };
  }

  let slug = existing?.slug;
  if (!slug) {
    const base = (slugify(input.form.title) || "proyek-baru").slice(0, 54);
    const { data: rows, error: slugsError } = await supabase
      .from("projects").select("slug").eq("owner_id", ownerId);
    if (slugsError) throw new Error("Daftar proyek belum dapat dibaca.");
    const taken = new Set((rows ?? []).map((row) => row.slug));
    slug = base;
    for (let counter = 2; taken.has(slug); counter += 1) slug = `${base}-${counter}`;
  }

  const project = formToProject(input.form, input.status);
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
    status: input.status,
    updated_at: new Date().toISOString(),
  };

  let projectId = existing?.id;
  if (!projectId) {
    const { data: created, error } = await supabase.from("projects")
      .insert({ ...payload, status: "draft" }).select("id").single();
    if (error || !created) return { ok: false, errors: { title: "Proyek belum dapat disimpan. Coba judul lain." } };
    projectId = created.id;
  }

  const sourceRows = project.sources.map((source, position) => ({
    project_id: projectId,
    position,
    label: source.label,
    url: source.url,
  }));
  if (sourceRows.length > 0) {
    const { error } = await supabase.from("project_sources")
      .upsert(sourceRows, { onConflict: "project_id,position" });
    if (error) throw new Error("Tautan bukti belum tersimpan. Coba simpan ulang.");
  }
  const { error: deleteError } = await supabase.from("project_sources")
    .delete().eq("project_id", projectId).gte("position", sourceRows.length);
  if (deleteError) throw new Error("Daftar tautan belum tersinkron. Coba simpan ulang.");

  const { error: updateError } = await supabase.from("projects")
    .update(payload).eq("id", projectId).eq("owner_id", ownerId);
  if (updateError) return { ok: false, errors: { title: "Proyek belum dapat diperbarui. Coba lagi." } };

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath(`/u/${owner.username}`);
  revalidatePath(`/u/${owner.username}/p/${slug}`);
  revalidatePath(`/dashboard/projects/${slug}/edit`);
  return { ok: true, slug, status: input.status, savedAt: new Date().toISOString() };
}

export async function deleteCloudProject(slug: string): Promise<boolean> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const ownerId = auth.user?.id;
  if (!ownerId) return false;

  const { data: owner, error: ownerError } = await supabase
    .from("profiles").select("username").eq("id", ownerId).single();
  if (ownerError || !owner) return false;

  const { data: deleted, error } = await supabase.from("projects")
    .delete().eq("owner_id", ownerId).eq("slug", slug).select("id").maybeSingle();
  if (error || !deleted) return false;

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath(`/u/${owner.username}`);
  revalidatePath(`/u/${owner.username}/p/${slug}`);
  revalidatePath(`/dashboard/projects/${slug}/edit`);
  return true;
}
