"use client";

import { useActionState } from "react";
import Link from "next/link";

import {
  requestPasswordResetAction,
  signInAction,
  signUpAction,
  updatePasswordAction,
  type AuthActionState,
} from "@/lib/auth-actions";

type Mode = "login" | "signup" | "forgot" | "reset";

const ACTIONS = {
  login: signInAction,
  signup: signUpAction,
  forgot: requestPasswordResetAction,
  reset: updatePasswordAction,
};

export function AuthForm({ mode }: { mode: Mode }) {
  const [state, action, pending] = useActionState<AuthActionState, FormData>(ACTIONS[mode], {});
  const needsEmail = mode !== "reset";
  const needsPassword = mode !== "forgot";

  return (
    <form action={action} className="mt-8 space-y-5">
      {mode === "signup" ? (
        <label className="block text-sm font-medium text-ink">
          Nama tampilan
          <input name="display_name" type="text" autoComplete="name" required maxLength={80}
            className="mt-2 h-11 w-full rounded-[10px] border border-line bg-surface px-3 text-ink outline-none focus:border-accent" />
        </label>
      ) : null}
      {needsEmail ? (
        <label className="block text-sm font-medium text-ink">
          Email
          <input name="email" type="email" autoComplete="email" required
            className="mt-2 h-11 w-full rounded-[10px] border border-line bg-surface px-3 text-ink outline-none focus:border-accent" />
        </label>
      ) : null}
      {needsPassword ? (
        <label className="block text-sm font-medium text-ink">
          {mode === "reset" ? "Kata sandi baru" : "Kata sandi"}
          <input name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"}
            required minLength={mode === "login" ? undefined : 8}
            className="mt-2 h-11 w-full rounded-[10px] border border-line bg-surface px-3 text-ink outline-none focus:border-accent" />
        </label>
      ) : null}
      {state.error ? <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p> : null}
      {state.message ? <p role="status" className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{state.message}</p> : null}
      <button type="submit" disabled={pending}
        className="inline-flex h-11 w-full items-center justify-center rounded-[10px] bg-accent px-4 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-60">
        {pending ? "Memproses..." : mode === "login" ? "Masuk" : mode === "signup" ? "Buat akun" : mode === "forgot" ? "Kirim tautan" : "Simpan kata sandi"}
      </button>
      <div className="flex flex-wrap justify-between gap-3 text-sm">
        {mode === "login" ? <><Link href="/signup" className="text-accent hover:underline">Buat akun</Link><Link href="/forgot-password" className="text-accent hover:underline">Lupa kata sandi?</Link></> : null}
        {mode === "signup" || mode === "forgot" ? <Link href="/login" className="text-accent hover:underline">Kembali ke masuk</Link> : null}
      </div>
    </form>
  );
}
