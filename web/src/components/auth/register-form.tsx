"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import { PasswordInput } from "@/components/auth/password-input";
import { Field, TextInput } from "@/components/editor/field";
import { Icon } from "@/components/icons";
import { SpectrumRule } from "@/components/site-brand";
import { registerAction } from "@/lib/auth-actions";
import {
  emptyRegisterForm,
  hasRegisterErrors,
  passwordStrength,
  validateRegisterForm,
  type RegisterErrors,
  type RegisterForm,
} from "@/lib/auth-form";

const METER_COLORS = ["bg-danger", "bg-coral", "bg-sun", "bg-accent", "bg-accent"];

export function RegisterForm() {
  const [form, setForm] = useState<RegisterForm>(emptyRegisterForm);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const strength = passwordStrength(form.password);

  function handleChange<K extends keyof RegisterForm>(field: K, value: RegisterForm[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setMessage(null);
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const clientErrors = validateRegisterForm(form);
    if (hasRegisterErrors(clientErrors)) {
      setErrors(clientErrors);
      return;
    }

    startTransition(async () => {
      const result = await registerAction(form);
      if (result) {
        setErrors(result.errors);
        setMessage(result.message ?? null);
      }
    });
  }

  return (
    <div className="fade-up">
      <p className="eyebrow text-accent">Akun baru</p>
      <h1 className="mt-3 text-[32px] font-semibold leading-tight text-ink">Daftar ke Akashic</h1>
      <SpectrumRule className="mt-4" />
      <p className="mt-4 text-[14px] leading-6 text-ink-2">
        Sudah punya akun?{" "}
        <Link href="/login" className="link-underline font-semibold text-accent">
          Masuk di sini
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
        <Field label="Nama atau panggilan" required htmlFor="reg-name" error={errors.name}>
          <TextInput
            id="reg-name"
            type="text"
            autoComplete="name"
            placeholder="Contoh: Budi Santoso"
            value={form.name}
            invalid={Boolean(errors.name)}
            onChange={(event) => handleChange("name", event.target.value)}
          />
        </Field>

        <Field label="Email" required htmlFor="reg-email" error={errors.email}>
          <TextInput
            id="reg-email"
            type="email"
            autoComplete="email"
            placeholder="nama@kampus.ac.id"
            value={form.email}
            invalid={Boolean(errors.email)}
            onChange={(event) => handleChange("email", event.target.value)}
          />
        </Field>

        <Field
          label="Kata sandi"
          required
          htmlFor="reg-password"
          error={errors.password}
          hint="Minimal 8 karakter, memuat huruf dan angka."
        >
          <PasswordInput
            id="reg-password"
            autoComplete="new-password"
            placeholder="Buat kata sandi"
            value={form.password}
            invalid={Boolean(errors.password)}
            onChange={(event) => handleChange("password", event.target.value)}
          />
          <div className="mt-2 flex items-center gap-2" aria-hidden="true">
            {[0, 1, 2, 3].map((index) => (
              <span
                key={index}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  form.password && index < strength.score ? METER_COLORS[strength.score] : "bg-line"
                }`}
              />
            ))}
          </div>
          <p className="mt-1 text-[12px] font-medium text-ink-2">
            Kekuatan sandi: <span className="text-ink">{form.password ? strength.label : "Belum diisi"}</span>
          </p>
        </Field>

        <Field label="Ulangi kata sandi" required htmlFor="reg-confirm" error={errors.confirm}>
          <PasswordInput
            id="reg-confirm"
            autoComplete="new-password"
            placeholder="Ulangi kata sandi"
            value={form.confirm}
            invalid={Boolean(errors.confirm)}
            onChange={(event) => handleChange("confirm", event.target.value)}
          />
        </Field>

        <div>
          <label className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-5 text-ink">
            <input
              type="checkbox"
              checked={form.agree}
              onChange={(event) => handleChange("agree", event.target.checked)}
              className="mt-0.5 size-4 rounded border-line-strong accent-[#1f4d3a]"
            />
            <span>
              Saya setuju karya yang saya unggah adalah milik saya sendiri, dan saya memahami mode lokal
              ini menyimpan data di komputer pengembang.
            </span>
          </label>
          {errors.agree ? (
            <p className="mt-1.5 flex items-start gap-1.5 text-[13px] leading-5 text-danger">
              <Icon name="alert" className="mt-px size-4" />
              <span>{errors.agree}</span>
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-forest px-6 text-[15px] font-semibold text-cream transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {isPending ? (
            "Memproses..."
          ) : (
            <>
              Buat akun
              <Icon name="arrowRight" className="size-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}