"use client";

import Link from "next/link";

export function ServiceUnavailable() {
  return (
    <section className="mx-auto my-12 max-w-xl px-5 sm:my-20" aria-labelledby="service-title">
      <div className="rounded-xl border border-line bg-surface p-6 sm:p-8">
        <p className="eyebrow text-accent">Koneksi terganggu</p>
        <h1 id="service-title" className="mt-3 text-3xl font-semibold text-ink">Akun belum dapat dimuat</h1>
        <p role="status" className="mt-4 leading-7 text-ink-2">Kami belum bisa memeriksa sesi akunmu. Ini tidak berarti kamu sudah keluar. Coba lagi setelah koneksi pulih.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={() => window.location.reload()} className="min-h-11 rounded-full bg-forest px-5 font-semibold text-cream">Coba lagi</button>
          <Link href="/" className="inline-flex min-h-11 items-center rounded-full border border-line-strong px-5 font-semibold text-ink">Ke beranda</Link>
        </div>
      </div>
    </section>
  );
}
