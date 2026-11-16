"use server";

import "server-only";

import { cookies, headers } from "next/headers";
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
import { SESSION_COOKIE } from "@/lib/auth-session";
import {
  createStoredSession,
  createStoredUser,
  deleteStoredSession,
  findUserByEmail,
  sessionMaxAgeSeconds,
  verifyPassword,
} from "@/lib/auth-store";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export type LoginResult = { ok: false; errors: LoginErrors; message?: string };
export type RegisterResult =
  | { ok: true; message: string }
  | { ok: false; errors: RegisterErrors; message?: string };

async function establishSession(userId: string, remember: boolean): Promise<void> {
  const token = createStoredSession(userId, remember);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: sessionMaxAgeSeconds(remember),
  });
}

/** Membuat akun baru. Mode Supabase: kirim email verifikasi. Mode lokal: langsung masuk. */
export async function registerAction(form: RegisterForm, next?: string): Promise<RegisterResult> {
  const errors = validateRegisterForm(form);
  if (hasRegisterErrors(errors)) {
    return { ok: false, errors };
  }

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const headerStore = await headers();
    const origin = headerStore.get("origin") ?? "";
    const redirectTo = next
      ? `${origin}/auth/callback?next=${encodeURIComponent(next)}`
      : `${origin}/auth/callback`;

    const { error } = await supabase.auth.signUp({
      email: form.email.trim().toLowerCase(),
      password: form.password,
      options: {
        data: { display_name: form.name.trim() },
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      if (error.message.toLowerCase().includes("already registered") || error.code === "user_already_exists") {
        return { ok: false, errors: { email: "Email ini sudah terdaftar. Coba masuk atau gunakan email lain." } };
      }
      return { ok: false, errors: {}, message: "Pendaftaran belum berhasil. Coba lagi dalam beberapa saat." };
    }

    return {
      ok: true,
      message: `Email verifikasi dikirim ke ${form.email.trim()}. Buka email kamu dan klik tautan di dalamnya untuk mengaktifkan akun.`,
    };
  }

  // Mode lokal (tanpa Supabase)
  const user = createStoredUser({
    name: form.name,
    email: form.email,
    password: form.password,
  });

  if (!user) {
    return {
      ok: false,
      errors: { email: "Email ini sudah terdaftar. Coba masuk atau pakai email lain." },
    };
  }

  await establishSession(user.id, true);
  redirect(next && next.startsWith("/") ? next : "/dashboard");
}

/** Memverifikasi kredensial lalu membuka dasbor bila cocok. */
export async function loginAction(form: LoginForm, next?: string): Promise<LoginResult> {
  const errors = validateLoginForm(form);
  if (hasLoginErrors(errors)) {
    return { ok: false, errors };
  }

  const user = findUserByEmail(form.email);
  if (!user || !verifyPassword(form.password, user.passwordHash)) {
    return {
      ok: false,
      errors: {},
      message: "Email atau kata sandi salah. Periksa kembali, atau daftar bila belum punya akun.",
    };
  }

  await establishSession(user.id, false);
  redirect(next && next.startsWith("/") ? next : "/dashboard");
}

/** Menghapus sesi lokal dan cookie, lalu kembali ke halaman awal. */
export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  deleteStoredSession(cookieStore.get(SESSION_COOKIE)?.value);
  cookieStore.delete(SESSION_COOKIE);
  redirect("/");
}