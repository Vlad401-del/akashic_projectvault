"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type RecoveryResult = { ok: boolean; message: string };

export async function requestPasswordResetAction(email: string): Promise<RecoveryResult> {
  const normalized = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return { ok: false, message: "Masukkan alamat email yang valid." };
  }
  const origin = (await headers()).get("origin");
  const url = origin ? new URL("/auth/callback?next=/reset-password", origin).toString() : undefined;
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(normalized, {
    ...(url ? { redirectTo: url } : {}),
  });
  if (error) {
    const message = error.code === "email_address_not_authorized"
      ? "Email pemulihan belum dapat dikirim ke alamat ini. Pengelola perlu mengatur layanan email Akashic."
      : error.code === "over_email_send_rate_limit" || error.code === "over_request_rate_limit"
        ? "Batas permintaan pemulihan tercapai. Tunggu beberapa saat sebelum mencoba lagi."
        : "Tautan pemulihan belum dapat dikirim. Coba lagi nanti.";
    return { ok: false, message };
  }
  return { ok: true, message: "Jika email terdaftar, periksa kotak masuk dan spam untuk tautan pemulihan." };
}

export async function updatePasswordAction(password: string): Promise<RecoveryResult> {
  if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return { ok: false, message: "Kata sandi minimal 8 karakter dan memuat huruf serta angka." };
  }
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { ok: false, message: "Tautan pemulihan sudah kedaluwarsa. Minta tautan baru." };
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { ok: false, message: "Kata sandi belum dapat diperbarui. Coba lagi." };
  redirect("/dashboard");
}
