import { Icon, type IconName } from "@/components/icons";
import type { SourceLink } from "@/lib/fixtures/types";
import { toSafeExternalUrl } from "@/lib/url";

/** Ikon tombol dipilih dari awal kata label supaya tetap masuk akal. */
function sourceIcon(label: string): IconName {
  if (/unduh/i.test(label)) return "download";
  if (/baca/i.test(label)) return "book";

  return "arrowUpRight";
}

/**
 * Tombol bukti karya (dashboard, laporan, repositori).
 *
 * Aturan keamanan:
 * - Hanya tautan http/https yang dirender; `javascript:` atau `data:` dibuang
 *   sebelum sampai ke DOM, jadi tidak bisa dijalankan sebagai skrip.
 * - Isi tautan dirender sebagai teks (`{source.label}`), bukan HTML mentah.
 * - Bila tidak ada tautan yang lolos, seluruh bagian ini tidak ditampilkan.
 *
 * Tautan pertama menjadi tombol utama, sisanya tombol bergaris.
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
    <ul className={`flex flex-col gap-2.5 ${className}`}>
      {safeSources.map((source, index) => (
        <li key={`${source.label}-${source.url}`}>
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className={
              index === 0
                ? "inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-accent px-4 text-[15px] font-semibold text-white transition-colors hover:bg-accent-hover"
                : "inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] border border-line bg-surface px-4 text-[15px] font-medium text-ink transition-colors hover:border-accent/40 hover:text-accent"
            }
          >
            <Icon name={sourceIcon(source.label)} className="size-4" />
            {source.label}
            <span className="sr-only"> (terbuka di tab baru)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
