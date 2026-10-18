import { Icon } from "@/components/icons";
import type { ProjectStatus } from "@/lib/fixtures/types";

/**
 * Penanda status proyek di area pemilik.
 *
 * Status selalu ditulis sebagai teks, bukan hanya dibedakan warna, sesuai
 * aturan "status draft/published tetap memiliki label teks" pada spesifikasi.
 */
export function StatusChip({ status, className = "" }: { status: ProjectStatus; className?: string }) {
  const isPublished = status === "published";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-semibold ${
        isPublished
          ? "border-accent/25 bg-accent-soft text-accent"
          : "border-line bg-canvas text-ink-2"
      } ${className}`}
    >
      <Icon name={isPublished ? "checkCircle" : "pencil"} className="size-3.5" />
      {isPublished ? "Sudah terbit" : "Draft"}
    </span>
  );
}
