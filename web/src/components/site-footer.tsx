/**
 * Catatan kecil di bawah setiap halaman.
 *
 * Tahap 1 masih memakai data contoh dan berjalan di localhost, jadi status ini
 * ditulis terang-terangan agar tidak disangka aplikasi daring.
 */
export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-1 px-4 py-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          Akashic — versi pengembangan. Seluruh isi yang tampil adalah <strong className="font-medium">data contoh</strong>.
        </p>
        <p>Berjalan lokal di localhost; belum diterbitkan ke internet.</p>
      </div>
    </footer>
  );
}
