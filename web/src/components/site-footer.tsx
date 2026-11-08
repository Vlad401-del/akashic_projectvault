import Link from "next/link";

import { PrismMark, Wordmark } from "@/components/site-brand";
import { isLocalDemoEditorEnabled } from "@/lib/demo-mode";

/**
 * Footer setiap halaman: blok hijau hutan dengan tautan ke rute yang memang ada.
 *
 * Tahap ini masih memakai data contoh, jadi statusnya dinyatakan terang-terangan.
 */
export function SiteFooter() {
  const demoEditorEnabled = isLocalDemoEditorEnabled();

  const groups: { title: string; links: { label: string; href: string }[] }[] = [
    {
      title: "Jelajahi",
      links: [
        { label: "Papan cari tim", href: "/tim" },
        { label: "Contoh portofolio", href: "/u/nadia" },
        { label: "Cara kerja", href: "/#cara-kerja" },
      ],
    },
    ...(demoEditorEnabled
      ? [
          {
            title: "Area pemilik",
            links: [
              { label: "Proyek saya", href: "/dashboard" },
              { label: "Proyek baru", href: "/dashboard/projects/new" },
              { label: "Pasang pencarian tim", href: "/dashboard/tim/baru" },
            ],
          },
        ]
      : []),
  ];

  return (
    <footer className="on-dark relative overflow-hidden bg-forest-deep text-cream">
      <div aria-hidden="true" className="grid-lines pointer-events-none absolute inset-0 text-cream/[0.05]" />
      <div className="relative mx-auto grid max-w-[1200px] gap-12 px-5 pb-10 pt-16 sm:px-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div>
          <p className="flex items-center gap-2.5 text-[22px]">
            <PrismMark className="size-7" />
            <Wordmark />
          </p>
          <p className="mt-4 font-display text-[26px] italic leading-tight text-sun">
            Karya dulu, baru cari tim.
          </p>
          <p className="mt-3 max-w-[26rem] text-[14px] leading-6 text-cream/70">
            Ruang rekam karya mahasiswa: ubah tugas kuliah menjadi studi kasus, lalu temukan rekan lomba
            dari bukti kerja nyata.
          </p>
        </div>

        <nav aria-label="Tautan footer" className="grid grid-cols-2 gap-8">
          {groups.map((group) => (
            <div key={group.title}>
              <h2 className="uppercase text-[12px] font-bold tracking-[0.14em] text-cream/50">{group.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="link-underline text-[14px] text-cream/85 hover:text-cream">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="relative mx-auto flex max-w-[1200px] flex-col gap-2 border-t border-cream/10 px-5 py-6 text-[12px] text-cream/55 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          Seluruh isi saat ini adalah <strong className="font-semibold text-cream/85">data contoh</strong>.
          {demoEditorEnabled ? " Editor demo berjalan lokal." : ""}
        </p>
        <p>Akashic — ruang rekam karya mahasiswa</p>
      </div>
    </footer>
  );
}
