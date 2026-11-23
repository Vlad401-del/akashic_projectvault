import Link from "next/link";
import Image from "next/image";

/** New owner-supplied mark on forest so its cream details remain visible. */
export function PrismMark({ className = "size-4" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`${className} inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[22%] bg-forest p-[2px]`}>
      <Image src="/images/akashic-logo.png" alt="" width={1004} height={808} sizes="32px" className="h-full w-full object-contain" />
    </span>
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
