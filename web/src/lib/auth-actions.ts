"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  hasLoginErrors,
  hasRegisterErrors,
  validateLoginForm,
  validateRegisterForm,
  type LoginErrors,
  type LoginForm,
  type RegisterErrors,
  type RegisterForm,
} from "@/lib/auth-form";
import { createClient } from "@/lib/supabase/server";
import { loginErrorMessage } from "@/lib/login-error";
import { isAuthUnavailable } from "@/lib/auth-availability";

export type LoginResult = { ok: false; errors: LoginErrors; message?: string };
export type RegisterResult =
  | { ok: false; errors: RegisterErrors; message?: string }
  | { ok: true; message: string };

export async function registerAction(form: RegisterForm): Promise<RegisterResult> {
  const errors = validateRegisterForm(form);
  if (hasRegisterErrors(errors)) return { ok: false, errors };

  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const { data, error } = await supabase.auth.signUp({
    email: form.email.trim().toLowerCase(),
    password: form.password,
    options: {
      data: { display_name: form.name.trim() },
      ...(origin ? { emailRedirectTo: new URL("/auth/callback", origin).toString() } : {}),
    },
  });
  if (error) {
    const message = isAuthUnavailable(error) && error.status !== 429
      ? "Layanan pendaftaran belum dapat dihubungi. Coba lagi setelah koneksi pulih."
      : error.status === 429 || error.code === "over_email_send_rate_limit" || error.code === "over_request_rate_limit"
      ? "Batas pengiriman email konfirmasi tercapai. Coba lagi nanti."
      : error.code === "email_address_not_authorized"
        ? "Alamat ini belum dapat menerima email konfirmasi dari layanan Akashic. Hubungi pengelola."
      : error.code === "weak_password"
        ? "Kata sandi belum memenuhi syarat keamanan. Gunakan sandi yang lebih kuat."
        : "Pendaftaran belum berhasil. Periksa kembali data Anda atau coba lagi nanti.";
    return { ok: false, errors: {}, message };
  }
  if (data.session) redirect("/dashboard");
  return {
    ok: true,
    message: "Jika alamat ini baru terdaftar, periksa inbox dan spam untuk tautan konfirmasi. Jika sudah pernah mendaftar, gunakan Masuk atau Lupa kata sandi.",
  };
}

export async function loginAction(form: LoginForm): Promise<LoginResult> {
  const errors = validateLoginForm(form);
  if (hasLoginErrors(errors)) return { ok: false, errors };

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email.trim().toLowerCase(),
      password: form.password,
    });
    if (error) {
      // Record only the error category; never email, password, token, or raw provider messages.
      console.warn("[auth:login]", { code: error.code ?? "unknown", status: error.status ?? 0 });
      return { ok: false, errors: {}, message: loginErrorMessage(error) };
    }
  } catch {
    console.warn("[auth:login]", { code: "transport_or_configuration_error" });
    return { ok: false, errors: {}, message: "Permintaan login terputus. Periksa koneksi dan coba lagi." };
  }
  redirect("/dashboard");
}

export async function logoutAction(): Promise<{ error: string }> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) return { error: "Belum berhasil keluar. Periksa koneksi lalu coba lagi." };
  redirect("/");
}
