/**
 * Keadaan memuat untuk halaman detail proyek.
 *
 * Kerangka abu-abu saja; tidak ada judul atau angka rekaan. Lihat catatan pada
 * `loading.tsx` di segmen profil soal hubungannya dengan status 404.
 */
export default function ProjectLoading() {
  return (
    <div className="mx-auto max-w-[1120px] px-5 py-8 sm:px-8 sm:py-12 xl:px-0" aria-busy="true">
      <p className="sr-only" role="status">
        Memuat proyek
      </p>
      <div className="h-12 animate-pulse rounded-[10px] border border-line bg-surface" />
      <div className="mt-10 h-10 w-2/3 animate-pulse rounded-lg bg-surface" />
      <div className="mt-4 h-20 animate-pulse rounded-lg bg-surface" />
      <div className="mt-8 h-96 animate-pulse rounded-xl border border-line bg-surface" />
    </div>
  );
}
