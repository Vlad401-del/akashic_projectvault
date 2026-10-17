import Link from "next/link";

import { SiteBrand, SpectrumRule } from "@/components/site-brand";
import { listPublicProfiles } from "@/lib/content";

export default function HomePage() {
  const demoProfiles = listPublicProfiles();

  return (
    <div className="mx-auto max-w-[1120px] px-4 py-10 sm:py-14">
      <SiteBrand />

      <section className="mt-10 max-w-[68ch]">
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
          Tugas kuliah, disusun menjadi studi kasus yang bisa dibaca.
        </h1>
        <SpectrumRule className="mt-6" />
        <p className="mt-6 text-base leading-relaxed text-ink-muted">
          Akashic adalah ruang rekam karya mahasiswa. Setiap proyek ditulis dengan urutan masalah, proses,
          kontribusi pribadi, dan hasil, lalu ditampilkan pada satu tautan portofolio.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-4">
          <Link
            href="/u/nadia"
            className="inline-flex items-center rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-strong"
          >
            Lihat contoh portofolio
          </Link>
          <Link
            href="/u/nadia/p/dashboard-penjualan-ritel"
            className="inline-flex items-center rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink hover:border-accent hover:text-accent"
          >
            Buka contoh studi kasus
          </Link>
        </div>
      </section>

      <section aria-labelledby="akun-contoh" className="mt-14 border-t border-line pt-8">
        <h2 id="akun-contoh" className="text-lg font-semibold tracking-tight text-ink">
          Akun contoh untuk latihan
        </h2>
        <p className="mt-2 max-w-[68ch] text-sm leading-relaxed text-ink-muted">
          Seluruh data di halaman ini masih berupa contoh pada berkas fixture dan berjalan di localhost. Alamat
          di bawah dipakai untuk menguji perilaku halaman publik.
        </p>

        <ul className="mt-6 grid gap-4 sm:grid-cols-3">
          {demoProfiles.map((profile) => (
            <li key={profile.username} className="rounded-2xl border border-line bg-surface p-5">
              <p className="text-xs text-ink-muted">/u/{profile.username}</p>
              <h3 className="mt-1.5 text-base font-semibold text-ink">
                <Link
                  href={`/u/${profile.username}`}
                  className="rounded underline decoration-line hover:text-accent hover:decoration-accent"
                >
                  {profile.displayName}
                </Link>
              </h3>
              <p className="mt-2 text-sm text-ink-muted">
                {profile.projects.length === 0
                  ? "Belum ada proyek — contoh keadaan kosong."
                  : `${profile.projects.filter((project) => project.status === "published").length} proyek tampil publik.`}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-sm leading-relaxed text-ink-muted">
          Akun <code className="rounded bg-surface px-1.5 py-0.5 text-xs text-ink">/u/sekar</code> sengaja
          dibuat berstatus privat, sehingga tidak dapat dibuka pengunjung dan hanya menghasilkan halaman tidak
          ditemukan.
        </p>
      </section>
    </div>
  );
}
