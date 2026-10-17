import Link from "next/link";

/**
 * Tanda merek Akashic: prisma tiga sisi dengan spektrum cyan -> biru -> hijau.
 *
 * Bentuk prisma tetap seperti sebelumnya supaya kesan "prismatic" bertahan;
 * yang berubah hanya warnanya, mengikuti gradien referensi "dreamer"
 * (cyan, biru, hijau) yang diminta pemilik produk.
 */
export function PrismMark({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" className={`${className} shrink-0`}>
      <path className="fill-spectrum-blue" d="M8 1.5 14.5 13.5H8z" />
      <path className="fill-spectrum-cyan" d="M8 1.5 1.5 13.5H8z" />
      <path className="fill-spectrum-green" d="M1.5 13.5h13L8 10.2z" />
    </svg>
  );
}

/**
 * Kata merek dengan gradien spektrum.
 *
 * Gradien ini memakai varian yang sedikit lebih gelap daripada spektrum
 * dekoratif supaya tetap terbaca (lihat catatan kontras di `globals.css`).
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`bg-clip-text text-transparent ${className}`}
      style={{ backgroundImage: "var(--spectrum-word)" }}
    >
      Akashic
    </span>
  );
}

/** Garis tipis spektrum; satu-satunya pemakaian gradient di luar tanda merek. */
export function SpectrumRule({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block h-[3px] w-12 rounded-full ${className}`}
      style={{ backgroundImage: "var(--spectrum-rule)" }}
    />
  );
}

export function SiteBrand({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-[6px] text-[15px] font-semibold tracking-tight"
    >
      <PrismMark />
      <Wordmark />
      <span className="sr-only">— kembali ke halaman awal</span>
    </Link>
  );
}
