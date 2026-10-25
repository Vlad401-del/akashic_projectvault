"use server";

import { revalidatePath } from "next/cache";

import { toCsv } from "@/lib/editor-form";
import { profiles as demoProfiles } from "@/lib/fixtures/fixtures";
import { createClient } from "@/lib/supabase/server";

export type ProfileActionState = { error?: string; message?: string };

function value(form: FormData, name: string): string {
  return String(form.get(name) ?? "").trim();
}

export async function updateProfileAction(_previous: ProfileActionState, form: FormData): Promise<ProfileActionState> {
  const username = value(form, "username").toLowerCase();
  const displayName = value(form, "display_name");
  const headline = value(form, "headline");
  const bio = value(form, "bio");
  const program = value(form, "program");
  const city = value(form, "city");
  const isPublished = form.get("is_published") === "on";

  if (!/^[a-z0-9][a-z0-9_-]{2,29}$/.test(username)) return { error: "Username harus 3–30 karakter: huruf kecil, angka, garis bawah, atau tanda hubung." };
  if (demoProfiles.some((profile) => profile.username === username)) return { error: "Username ini dipakai untuk contoh portofolio. Pilih yang lain." };
  if (!displayName || displayName.length > 80) return { error: "Nama tampilan wajib diisi, maksimal 80 karakter." };
  if (headline.length > 180 || bio.length > 2000) return { error: "Headline atau bio terlalu panjang." };
  if (isPublished && !headline) return { error: "Isi headline sebelum menerbitkan profil." };

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const ownerId = auth?.claims?.sub;
  if (!ownerId) return { error: "Sesi berakhir. Masuk kembali untuk mengubah profil." };

  const { data: previous } = await supabase.from("profiles").select("username").eq("id", ownerId).single();
  const { error } = await supabase.from("profiles").update({
    username,
    display_name: displayName,
    headline,
    bio,
    program,
    city,
    skills: toCsv(value(form, "skills")),
    is_published: isPublished,
    updated_at: new Date().toISOString(),
  }).eq("id", ownerId);

  if (error) return { error: error.code === "23505" ? "Username sudah dipakai. Pilih yang lain." : "Profil belum dapat disimpan. Coba lagi." };
  revalidatePath("/dashboard");
  revalidatePath("/");
  revalidatePath(`/u/${username}`);
  if (previous?.username && previous.username !== username) revalidatePath(`/u/${previous.username}`);
  return { message: isPublished ? "Profil tersimpan dan sudah tampil publik." : "Profil tersimpan sebagai privat." };
}
