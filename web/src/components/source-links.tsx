import type { SourceLink } from "@/lib/fixtures/types";
import { toSafeExternalUrl } from "@/lib/url";

/**
 * Tombol bukti karya (dashboard, laporan, repositori).
 *
 * Aturan keamanan:
 * - Hanya tautan http/https yang dirender; `javascript:` atau `data:` dibuang
 *   sebelum sampai ke DOM, jadi tidak bisa dijalankan sebagai skrip.
 * - Isi tautan dirender sebagai teks (`{source.label}`), bukan HTML mentah.
 * - Bila tidak ada tautan yang lolos, seluruh bagian ini tidak ditampilkan.
 */
export function SourceLinks({
  sources,
  className = "",
}: {
  sources: SourceLink[];
  className?: string;
}) {
  const safeSources = sources
    .map((source) => ({ label: source.label.trim(), url: toSafeExternalUrl(source.url) }))
    .filter((source): source is { label: string; url: string } => source.url !== null && source.label.length > 0);

  if (safeSources.length === 0) {
    return null;
  }

  return (
    <ul className={`flex flex-wrap gap-3 ${className}`}>
      {safeSources.map((source, index) => (
        <li key={`${source.label}-${source.url}`}>
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className={
              index === 0
                ? "inline-flex items-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-strong"
                : "inline-flex items-center rounded-lg border border-line bg-surface px-4 py-2 text-sm font-medium text-ink hover:border-accent hover:text-accent"
            }
          >
            {source.label}
            <span className="sr-only"> (terbuka di tab baru)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
