import { Icon, type IconName } from "@/components/icons";

/**
 * Judul bagian pada halaman detail proyek.
 *
 * Setiap bagian punya ikon kecil di kotak bergaris dan nomor urut, sehingga
 * pembaca bisa mengikuti alur Masalah → Proses → Kontribusi → Hasil → Galeri.
 */
export function SectionHeading({
  id,
  icon,
  title,
  number,
}: {
  id: string;
  icon: IconName;
  title: string;
  number: string;
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="flex size-10 items-center justify-center rounded-[10px] border border-line bg-surface text-ink-2">
        <Icon name={icon} className="size-[18px]" />
      </span>
      <h2 id={id} className="flex items-baseline gap-2 text-[22px] font-semibold tracking-tight text-ink">
        {title}
        <span className="text-[13px] font-medium tabular-nums text-ink-2">{number}</span>
      </h2>
    </div>
  );
}
