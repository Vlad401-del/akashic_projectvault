import { PrismMark, Wordmark } from "@/components/site-brand";

/**
 * Catatan kecil di bawah setiap halaman.
 *
 * Tahap 1 masih memakai data contoh dan berjalan di localhost, jadi status ini
 * ditulis terang-terangan agar tidak disangka aplikasi daring.
 */
export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line bg-surface">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-2 px-5 py-8 text-[13px] text-ink-2 sm:flex-row sm:items-center sm:justify-between sm:px-8 xl:px-0">
        <p className="flex items-center gap-2">
          <PrismMark />
          <Wordmark className="text-[15px] font-semibold tracking-tight" />
        </p>
        <p>
          Ruang rekam karya mahasiswa. Versi pengembangan: seluruh isi adalah{" "}
          <strong className="font-medium text-ink">data contoh</strong> dan berjalan lokal.
        </p>
      </div>
    </footer>
  );
}
