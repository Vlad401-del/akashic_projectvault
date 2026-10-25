"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type AuthActionState = { error?: string; message?: string };

function field(form: FormData, name: string): string {
  return String(form.get(name) ?? "").trim();
}

async function callbackUrl(next?: string): Promise<string | undefined> {
  const origin = (await headers()).get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL;
  if (!origin) return undefined;
  const url = new URL("/auth/callback", origin);
  if (next) url.searchParams.set("next", next);
  return url.toString();
}

export async function signInAction(_previous: AuthActionState, form: FormData): Promise<AuthActionState> {
  const email = field(form, "email");
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { error: "Isi email dan kata sandi." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Email atau kata sandi tidak cocok, atau akun belum dikonfirmasi." };
  redirect("/dashboard");
}

export async function signUpAction(_previous: AuthActionState, form: FormData): Promise<AuthActionState> {
  const email = field(form, "email");
  const password = String(form.get("password") ?? "");
  const displayName = field(form, "display_name");
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "Masukkan alamat email yang valid." };
  if (password.length < 8) return { error: "Kata sandi minimal 8 karakter." };
  if (!displayName || displayName.length > 80) return { error: "Nama tampilan wajib diisi, maksimal 80 karakter." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName }, emailRedirectTo: await callbackUrl() },
  });
  if (error) return { error: "Pendaftaran belum berhasil. Pada proyek uji tanpa SMTP khusus, email konfirmasi hanya dapat dikirim ke anggota tim." };
  if (data.session) redirect("/dashboard");
  return { message: "Periksa email untuk mengonfirmasi akun, lalu masuk ke Akashic." };
}

export async function requestPasswordResetAction(_previous: AuthActionState, form: FormData): Promise<AuthActionState> {
  const email = field(form, "email");
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "Masukkan alamat email yang valid." };
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, { redirectTo: await callbackUrl("/reset-password") });
  return { message: "Jika email terdaftar, tautan pemulihan akan dikirim." };
}

export async function updatePasswordAction(_previous: AuthActionState, form: FormData): Promise<AuthActionState> {
  const password = String(form.get("password") ?? "");
  if (password.length < 8) return { error: "Kata sandi minimal 8 karakter." };
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return { error: "Tautan pemulihan sudah kedaluwarsa. Minta tautan baru." };
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: "Kata sandi belum dapat diperbarui. Coba lagi." };
  redirect("/dashboard");
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
