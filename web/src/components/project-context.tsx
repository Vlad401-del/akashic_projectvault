import { Icon, type IconName } from "@/components/icons";
import { SourceLinks } from "@/components/source-links";
import type { Project } from "@/lib/fixtures/types";
import { workTypeWithTeam } from "@/lib/labels";

/** Daftar bagian yang bisa dilompati pembaca dari panel samping. */
const SECTIONS: { id: string; label: string }[] = [
  { id: "masalah", label: "Masalah" },
  { id: "proses", label: "Proses" },
  { id: "kontribusi-saya", label: "Kontribusi saya" },
  { id: "hasil", label: "Hasil" },
  { id: "galeri", label: "Galeri" },
];

function ContextRow({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <div className="flex gap-3 px-5 py-3.5">
      <Icon name={icon} className="mt-0.5 size-[18px] text-ink-2" />
      <div className="min-w-0">
        <dt className="text-[12px] font-medium uppercase tracking-[0.06em] text-ink-2">{label}</dt>
        <dd className="mt-0.5 text-[15px] leading-[1.5] text-ink">{value}</dd>
      </div>
    </div>
  );
}

/**
 * Panel samping halaman detail proyek.
 *
 * Berisi konteks tugas (jenis, peran, periode, mata kuliah, alat), tombol bukti
 * karya, catatan bahwa tautannya masih contoh, dan daftar bagian halaman.
 * Pada layar besar panel ini menempel (sticky) di kanan saat narasi digulir.
 */
export function ProjectContext({ project }: { project: Project }) {
  const rows: { icon: IconName; label: string; value: string | null }[] = [
    { icon: "users", label: "Jenis tugas", value: workTypeWithTeam(project.workType, project.teamSize) },
    { icon: "user", label: "Peran saya", value: project.role },
    { icon: "calendar", label: "Periode", value: project.period },
    { icon: "book", label: "Mata kuliah", value: project.course },
    { icon: "wrench", label: "Alat", value: project.tools.length > 0 ? project.tools.join(", ") : null },
  ];

  const visibleRows = rows.filter(
    (row): row is { icon: IconName; label: string; value: string } => Boolean(row.value),
  );

  const sections = SECTIONS.filter((section) => section.id !== "galeri" || project.gallery.length > 0);
  const hasSources = project.sources.some((source) => source.url.trim().length > 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-line bg-surface">
        <h2 className="border-b border-line px-5 py-4 text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-2">
          Konteks tugas
        </h2>
        <dl className="divide-y divide-line">
          {visibleRows.map((row) => (
            <ContextRow key={row.label} icon={row.icon} label={row.label} value={row.value} />
          ))}
        </dl>
      </div>

      {project.sources.length > 0 ? (
        <div>
          <SourceLinks sources={project.sources} />
          {hasSources ? (
            <p className="mt-3 flex items-start gap-2 text-[13px] leading-5 text-ink-2">
              <Icon name="info" className="mt-0.5 size-4" />
              <span>
                Tautan di atas masih contoh. Semuanya mengarah ke alamat example.com, bukan layanan
                sungguhan.
              </span>
            </p>
          ) : null}
        </div>
      ) : null}

      <nav aria-labelledby="di-halaman-ini" className="rounded-xl border border-line bg-surface p-5">
        <h2 id="di-halaman-ini" className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-2">
          Di halaman ini
        </h2>
        <ul className="mt-3 space-y-2">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="inline-flex items-center gap-2 rounded text-[14px] text-ink-2 hover:text-accent"
              >
                <Icon name="dot" className="size-2 text-ink-2/45" />
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
