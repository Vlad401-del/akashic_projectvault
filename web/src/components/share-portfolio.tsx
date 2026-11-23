"use client";

import { useState } from "react";

export function SharePortfolio({ username }: { username: string }) {
  const url = `https://akashic-projectvault.vercel.app/u/${encodeURIComponent(username)}`;
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  return (
    <section aria-label="Bagikan portofolio" className="mt-6 rounded-xl border border-line bg-surface p-4 sm:p-5">
      <label htmlFor="public-portfolio-url" className="block text-sm font-semibold text-ink">Tautan portofolio publik</label>
      <p className="mt-1 text-sm leading-6 text-ink-2">Bagikan tautan ini agar orang lain melihat portofoliomu. Alamat /dashboard selalu membuka akun orang yang sedang masuk.</p>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <input id="public-portfolio-url" readOnly value={url} onFocus={(event) => event.currentTarget.select()} className="min-h-11 min-w-0 flex-1 rounded-lg border border-line-strong bg-canvas px-3 text-base text-ink" />
        <button type="button" disabled={pending} onClick={async () => {
          setPending(true); setError(""); setCopied(false);
          try { await navigator.clipboard.writeText(url); setCopied(true); }
          catch { setError("Penyalinan otomatis belum berhasil. Pilih dan salin tautan di atas."); }
          finally { setPending(false); }
        }} className="min-h-11 shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-60">
          {pending ? "Menyalin…" : "Salin tautan portofolio"}
        </button>
      </div>
      {copied ? <p role="status" className="mt-2 text-sm text-accent">Tautan portofolio tersalin.</p> : null}
      {error ? <p role="alert" className="mt-2 text-sm text-danger">{error}</p> : null}
    </section>
  );
}
