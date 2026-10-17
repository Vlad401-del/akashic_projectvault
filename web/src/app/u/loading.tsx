/**
 * Keadaan memuat saat berpindah dari satu halaman ke halaman lain.
 * Hanya indikator tipis agar tidak ada konten rekaan yang berkedip.
 */
export default function RootLoading() {
  return (
    <div className="mx-auto max-w-[1120px] px-4 py-8" aria-busy="true">
      <p className="sr-only" role="status">
        Memuat halaman
      </p>
      <div className="h-6 w-40 animate-pulse rounded-lg bg-surface" />
      <div className="mt-8 h-52 animate-pulse rounded-2xl border border-line bg-surface" />
    </div>
  );
}
