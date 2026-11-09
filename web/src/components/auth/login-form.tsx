"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import { PasswordInput } from "@/components/auth/password-input";
import { Field, TextInput } from "@/components/editor/field";
import { Icon } from "@/components/icons";
import { SpectrumRule } from "@/components/site-brand";
import { loginAction } from "@/lib/auth-actions";
import {
  emptyLoginForm,
  hasLoginErrors,
  validateLoginForm,
  type LoginErrors,
  type LoginForm,
} from "@/lib/auth-form";

export function LoginForm() {
  const [form, setForm] = useState<LoginForm>(emptyLoginForm);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [showResetNote, setShowResetNote] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleChange<K extends keyof LoginForm>(field: K, value: LoginForm[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setMessage(null);
    if (field === "email" || field === "password") {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const clientErrors = validateLoginForm(form);
    if (hasLoginErrors(clientErrors)) {
      setErrors(clientErrors);
      return;
    }

    startTransition(async () => {
      const result = await loginAction(form);
      if (result) {
        setErrors(result.errors);
        setMessage(result.message ?? null);
      }
    });
  }

  return (
    <div className="fade-up">
      <p className="eyebrow text-accent">Akun</p>
      <h1 className="mt-3 text-[32px] font-semibold leading-tight text-ink">Masuk ke Akashic</h1>
      <SpectrumRule className="mt-4" />
      <p className="mt-4 text-[14px] leading-6 text-ink-2">
        Lanjutkan studi kasus dan pencarian tim Anda. Belum punya akun?{" "}
        <Link href="/register" className="link-underline font-semibold text-accent">
          Daftar gratis
        </Link>
        .
      </p>

      {message ? (
        <p
          role="alert"
          className="mt-5 flex items-start gap-2 rounded-[10px] border border-danger/30 bg-danger-soft px-3.5 py-3 text-[13px] leading-5 text-danger"
        >
          <Icon name="alert" className="mt-px size-4" />
          <span>{message}</span>
        </p>
      ) : null}

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
        <Field label="Email" required htmlFor="login-email" error={errors.email}>
          <TextInput
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="nama@kampus.ac.id"
            value={form.email}
            invalid={Boolean(errors.email)}
            onChange={(event) => handleChange("email", event.target.value)}
          />
        </Field>

        <Field label="Kata sandi" required htmlFor="login-password" error={errors.password}>
          <PasswordInput
            id="login-password"
            autoComplete="current-password"
            placeholder="Kata sandi Anda"
            value={form.password}
            invalid={Boolean(errors.password)}
            onChange={(event) => handleChange("password", event.target.value)}
          />
        </Field>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-[13px] font-medium text-ink">
            <input
              type="checkbox"
              checked={form.remember}
              onChange={(event) => handleChange("remember", event.target.checked)}
              className="size-4 rounded border-line-strong accent-[#1f4d3a]"
            />
            Ingat saya
          </label>
          <button
            type="button"
            onClick={() => setShowResetNote((prev) => !prev)}
            className="link-underline text-[13px] font-semibold text-accent"
          >
            Lupa kata sandi?
          </button>
        </div>

        {showResetNote ? (
          <p className="rounded-[10px] border border-line bg-surface px-3.5 py-3 text-[13px] leading-5 text-ink-2">
            Pemulihan kata sandi lewat email belum aktif. Untuk sekarang, daftarkan akun baru dengan
            email berbeda bila Anda tidak dapat masuk.
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-forest px-6 text-[15px] font-semibold text-cream transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {isPending ? (
            "Memproses..."
          ) : (
            <>
              Masuk
              <Icon name="arrowRight" className="size-4" />
            </>
          )}
        </button>
      </form>

      <p className="mt-6 rounded-[10px] border border-dashed border-line-strong bg-surface/60 px-3.5 py-3 text-[12px] leading-5 text-ink-2">
        Pertama kali di sini? Buat akun untuk merekam karya dan mencari rekan tim dari bukti kerja.
      </p>
    </div>
  );
}