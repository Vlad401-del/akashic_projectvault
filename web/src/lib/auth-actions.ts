"use server";

import { cookies } from "next/headers";
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

export type LoginResult = { ok: false; errors: LoginErrors; message?: string };
export type RegisterResult = { ok: false; errors: RegisterErrors; message?: string };

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

/** Membuat akun lokal lalu langsung masuk dan membuka dasbor. */
export async function registerAction(form: RegisterForm): Promise<RegisterResult> {
  const errors = validateRegisterForm(form);
  if (hasRegisterErrors(errors)) {
    return { ok: false, errors };
  }

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
  redirect("/dashboard");
}

/** Memverifikasi kredensial lalu membuka dasbor bila cocok. */
export async function loginAction(form: LoginForm): Promise<LoginResult> {
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

  await establishSession(user.id, form.remember);
  redirect("/dashboard");
}

/** Menghapus sesi lokal dan cookie, lalu kembali ke halaman awal. */
export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  deleteStoredSession(cookieStore.get(SESSION_COOKIE)?.value);
  cookieStore.delete(SESSION_COOKIE);
  redirect("/");
}