"use client";

import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";

import { PasswordInput } from "@/components/auth/password-input";
import { requestPasswordResetAction, updatePasswordAction } from "@/lib/auth-recovery-actions";

export function RecoveryForm({ mode }: { mode: "request" | "update" }) {
  const [value, setValue] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setMessage("");
    if (mode === "update" && value !== confirm) {
      setMessage("Konfirmasi kata sandi belum sama.");
      setSuccess(false);
      return;
    }
    startTransition(async () => {
      try {
        const result = mode === "request"
          ? await requestPasswordResetAction(value)
          : await updatePasswordAction(value);
        setMessage(result.message);
        setSuccess(result.ok);
      } catch (error) {
        unstable_rethrow(error);
        setSuccess(false);
        setMessage("Permintaan belum berhasil. Periksa koneksi dan coba lagi.");
      }
    });
  }

  return (
    <div className="rounded-xl border border-line bg-surface p-6 shadow-sm sm:p-8">
      <p className="eyebrow text-accent">Akun</p>
      <h1 className="mt-3 text-[28px] font-semibold text-ink">
        {mode === "request" ? "Pulihkan kata sandi" : "Buat kata sandi baru"}
      </h1>
      <p className="mt-3 text-[14px] leading-6 text-ink-2">
        {mode === "request"
          ? "Masukkan email akun Akashic. Buka tautan terbaru di browser yang sama dengan halaman ini. Jangan berpindah antara localhost dan 127.0.0.1."
          : "Gunakan kata sandi baru dengan minimal 8 karakter, huruf, dan angka."}
      </p>
      {message ? (
        <p role="status" className={`mt-5 rounded-lg p-3 text-[13px] ${success ? "bg-accent-soft text-accent" : "bg-danger-soft text-danger"}`}>
          {message}
        </p>
      ) : null}
      <form onSubmit={submit} className="mt-6 space-y-4">
        {mode === "request" ? (
          <div>
            <label htmlFor="recovery-email" className="text-[14px] font-semibold text-ink">Email</label>
            <input id="recovery-email" type="email" autoComplete="email" required value={value}
              onChange={(event) => setValue(event.target.value)}
              className="mt-1.5 h-11 w-full rounded-lg border border-line-strong bg-canvas px-3 text-ink" />
          </div>
        ) : (
          <>
            <div>
              <label htmlFor="recovery-password" className="text-[14px] font-semibold text-ink">Kata sandi baru</label>
              <PasswordInput id="recovery-password" autoComplete="new-password" value={value}
                onChange={(event) => setValue(event.target.value)} />
            </div>
            <div>
              <label htmlFor="recovery-confirm" className="text-[14px] font-semibold text-ink">Ulangi kata sandi</label>
              <PasswordInput id="recovery-confirm" autoComplete="new-password" value={confirm}
                onChange={(event) => setConfirm(event.target.value)} />
            </div>
          </>
        )}
        <button type="submit" disabled={pending} aria-busy={pending} className="inline-flex h-11 w-full items-center justify-center rounded-full bg-forest px-5 text-[14px] font-semibold text-cream disabled:opacity-60">
          {pending ? "Memproses..." : mode === "request" ? "Kirim tautan pemulihan" : "Simpan kata sandi"}
        </button>
      </form>
      <Link href="/login" className="mt-5 inline-block text-[13px] font-semibold text-accent underline">Kembali ke masuk</Link>
    </div>
  );
}
