import Link from "next/link";

/**
 * Tanda merek Akashic: ubin hijau hutan berisi prisma mustard dan titik koral.
 *
 * Prisma dari tanda lama dipertahankan sebagai bentuk, tetapi warnanya kini
 * mengikuti palet "studio lomba" (forest, sun, coral).
 */
export function PrismMark({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={`${className} shrink-0`}>
      <rect width="24" height="24" rx="6" className="fill-forest" />
      <path d="M12 4.5 19 18H5z" className="fill-sun" />
      <path d="M12 4.5 19 18h-7z" fill="#000" fillOpacity="0.14" />
      <circle cx="17.6" cy="6.4" r="2.3" className="fill-coral" />
    </svg>
  );
}

/** Kata merek dalam serif. */
export function Wordmark({ className = "" }: { className?: string }) {
  return <span className={`font-display font-semibold tracking-[-0.02em] ${className}`}>Akashic</span>;
}

/** Garis tiga warna pendek: forest, sun, coral. */
export function SpectrumRule({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block h-[3px] w-14 ${className}`}
      style={{ backgroundImage: "var(--spectrum-rule)" }}
    />
  );
}

export function SiteBrand({ href = "/", tone = "light" }: { href?: string; tone?: "light" | "dark" }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 rounded-[6px] text-[18px] ${
        tone === "dark" ? "text-cream" : "text-ink"
      }`}
    >
      <PrismMark className="size-6" />
      <Wordmark />
      <span className="sr-only">— kembali ke halaman awal</span>
    </Link>
  );
}
