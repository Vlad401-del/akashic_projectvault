"use client";

import Link from "next/link";

/** Never expose database/provider error details in the public UI. */
export default function PageError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <section className="mx-auto my-12 max-w-xl px-5 sm:my-20">
      <div className="rounded-xl border border-line bg-surface p-6 sm:p-8">
        <h1 className="text-3xl font-semibold text-ink">Halaman belum dapat dimuat</h1>
        <p role="alert" className="mt-4 leading-7 text-ink-2">Terjadi gangguan saat memuat halaman. Coba lagi; kamu tidak perlu langsung keluar atau mengubah kata sandi.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={retry} className="min-h-11 rounded-full bg-forest px-5 font-semibold text-cream">Coba lagi</button>
          <Link href="/" className="inline-flex min-h-11 items-center rounded-full border border-line-strong px-5 font-semibold text-ink">Ke beranda</Link>
        </div>
      </div>
    </section>
  );
}
