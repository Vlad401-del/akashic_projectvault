import Link from "next/link";

/**
 * Tanda merek Akashic: prisma kecil dengan aksen spektrum.
 *
 * Spektrum violet → biru → cyan hanya dipakai di sini dan pada satu garis tipis
 * di halaman, sesuai arah desain "prismatic minimal".
 */
export function PrismMark({ className = "size-5" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 rounded-[3px] bg-[linear-gradient(135deg,#6D28D9_0%,#2563EB_55%,#0891B2_100%)] [clip-path:polygon(50%_0%,100%_100%,0%_100%)] ${className}`}
    />
  );
}

/** Garis tipis spektrum; satu-satunya pemakaian gradient di luar tanda merek. */
export function SpectrumRule({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block h-[3px] w-12 rounded-full bg-[linear-gradient(90deg,#6D28D9_0%,#2563EB_55%,#0891B2_100%)] ${className}`}
    />
  );
}

export function SiteBrand({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-lg px-1 py-1 text-base font-semibold tracking-tight text-ink"
    >
      <PrismMark />
      <span>Akashic</span>
      <span className="sr-only">— kembali ke halaman awal</span>
    </Link>
  );
}
