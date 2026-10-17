/**
 * Keadaan memuat untuk halaman profil publik.
 *
 * Isinya hanya kerangka abu-abu tanpa angka atau nama rekaan, supaya tidak ada
 * informasi palsu yang sempat terbaca pengunjung.
 *
 * Catatan: sejak `cacheComponents` dimatikan (lihat `next.config.ts`), rute
 * fixture dipra-render penuh sehingga berkas ini hanya terlihat pada navigasi
 * antarsegmen. Berkas ini tidak boleh memuat batas Suspense yang membuat
 * `notFound()` kehilangan status HTTP 404 — diuji lewat `scripts/check-routes.ps1`.
 */
export default function ProfileLoading() {
  return (
    <div className="mx-auto max-w-[1120px] px-4 py-8 sm:py-10" aria-busy="true">
      <p className="sr-only" role="status">
        Memuat profil
      </p>
      <div className="h-64 animate-pulse rounded-2xl border border-line bg-surface" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="h-72 animate-pulse rounded-2xl border border-line bg-surface" />
        <div className="h-72 animate-pulse rounded-2xl border border-line bg-surface" />
      </div>
    </div>
  );
}
