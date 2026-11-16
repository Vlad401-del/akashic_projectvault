import type { Profile, Project } from "@/lib/fixtures/types";
import { profileFromRow, projectFromRow } from "@/lib/supabase/mappers";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

type ProfileRow = Tables<"profiles">;
type ProjectRow = Tables<"projects">;
type SourceRow = Tables<"project_sources">;

async function assembleProfile(row: ProfileRow, projectRows: ProjectRow[]): Promise<Profile> {
  const supabase = await createClient();
  const ids = projectRows.map((project) => project.id);
  const { data: sources, error } = ids.length
    ? await supabase.from("project_sources").select("*").in("project_id", ids)
    : { data: [] as SourceRow[], error: null };
  if (error) throw new Error("Sumber proyek belum dapat dibaca dari Supabase.");
  const projects: Project[] = projectRows.map((project) =>
    projectFromRow(project, (sources ?? []).filter((source) => source.project_id === project.id)),
  );
  return profileFromRow(row, projects);
}

export async function getCloudOwner(): Promise<Profile | null> {
  const supabase = await createClient();
  const { data: auth, error: authError } = await supabase.auth.getClaims();
  if (authError || !auth?.claims?.sub) return null;

  const { data: row, error: profileError } = await supabase.from("profiles").select("*").eq("id", auth.claims.sub).single();
  if (profileError || !row) throw new Error("Profil akun belum tersedia. Coba keluar dan masuk kembali.");
  const { data: projects, error: projectError } = await supabase.from("projects").select("*").eq("owner_id", row.id).order("updated_at", { ascending: false });
  if (projectError) throw new Error("Proyek akun belum dapat dibaca dari Supabase.");
  return assembleProfile(row, projects ?? []);
}

export async function getCloudPublicProfile(username: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data: row, error } = await supabase.from("profiles").select("*").eq("username", username).eq("is_published", true).maybeSingle();
  if (error) throw new Error("Profil publik belum dapat dibaca dari Supabase.");
  if (!row) return null;
  const { data: projects, error: projectError } = await supabase.from("projects").select("*").eq("owner_id", row.id).eq("status", "published").order("updated_at", { ascending: false });
  if (projectError) throw new Error("Proyek publik belum dapat dibaca dari Supabase.");
  return assembleProfile(row, projects ?? []);
}

export async function listCloudPublicProfiles(): Promise<Profile[]> {
  const supabase = await createClient();
  const { data: rows, error } = await supabase.from("profiles").select("*").eq("is_published", true).order("created_at", { ascending: false }).limit(12);
  if (error) throw new Error("Daftar profil publik belum dapat dibaca dari Supabase.");
  return Promise.all((rows ?? []).map(async (row) => {
    const { data: projects, error: projectError } = await supabase.from("projects").select("*").eq("owner_id", row.id).eq("status", "published").order("updated_at", { ascending: false }).limit(12);
    if (projectError) throw new Error("Proyek publik belum dapat dibaca dari Supabase.");
    return assembleProfile(row, projects ?? []);
  }));
}
