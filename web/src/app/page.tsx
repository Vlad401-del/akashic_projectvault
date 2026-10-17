import Link from "next/link";

import { Icon } from "@/components/icons";
import { PrismMark, SiteBrand, SpectrumRule } from "@/components/site-brand";
import { listPublicProfiles } from "@/lib/content";

/**
 * Halaman awal versi pengembangan.
 *
 * Halaman ini bukan bagian dari desain publik Akashic; fungsinya hanya pintu
 * masuk untuk mencoba empat akun contoh pada tahap fixture.
 */
export default function HomePage() {
  const demoProfiles = listPublicProfiles();

  return (
    <div className="mx-auto max-w-[1120px] px-5 py-10 sm:px-8 sm:py-14 xl:px-0">
      <SiteBrand />

      <section className="mt-10 max-w-[42rem]">
        <h1 className="text-[34px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink sm:text-[44px]">
          Tugas kuliah, disusun menjadi studi kasus yang bisa dibaca.
        </h1>
        <SpectrumRule className="mt-6" />
        <p className="mt-6 text-[17px] leading-[1.7] text-ink-2">
          Akashic adalah ruang rekam karya mahasiswa. Setiap proyek ditulis dengan urutan masalah, proses,
          kontribusi pribadi, dan hasil, lalu ditampilkan pada satu tautan portofolio.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link
            href="/u/nadia"
            className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-accent px-4 text-[15px] font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            Lihat contoh portofolio
            <Icon name="arrowRight" className="size-4" />
          </Link>
          <Link
            href="/u/nadia/p/dashboard-penjualan-ritel"
            className="inline-flex h-11 items-center gap-2 rounded-[10px] border border-line bg-surface px-4 text-[15px] font-medium text-ink transition-colors hover:border-accent/40 hover:text-accent"
          >
            Buka contoh studi kasus
          </Link>
        </div>
      </section>

      <section aria-labelledby="akun-contoh" className="mt-14 border-t border-line pt-10">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-[10px] border border-line bg-surface text-ink-2">
            <PrismMark className="size-[18px]" />
          </span>
          <h2 id="akun-contoh" className="text-[22px] font-semibold tracking-tight text-ink">
            Akun contoh untuk latihan
          </h2>
        </div>

        <p className="mt-4 max-w-[46rem] text-[15px] leading-[1.65] text-ink-2">
          Seluruh data di halaman ini masih berupa contoh pada berkas fixture dan berjalan di localhost. Alamat
          di bawah dipakai untuk menguji perilaku halaman publik.
        </p>

        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {demoProfiles.map((profile) => (
            <li key={profile.username} className="rounded-xl border border-line bg-surface p-5">
              <p className="text-[13px] text-ink-2">/u/{profile.username}</p>
              <h3 className="mt-1.5 text-[17px] font-semibold text-ink">
                <Link
                  href={`/u/${profile.username}`}
                  className="rounded underline decoration-line hover:text-accent hover:decoration-accent"
                >
                  {profile.displayName}
                </Link>
              </h3>
              <p className="mt-2 text-[14px] text-ink-2">
                {profile.projects.length === 0
                  ? "Belum ada proyek — contoh keadaan kosong."
                  : `${profile.projects.filter((project) => project.status === "published").length} proyek tampil publik.`}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-[14px] leading-[1.65] text-ink-2">
          Akun <code className="rounded bg-surface px-1.5 py-0.5 text-[13px] text-ink">/u/sekar</code> sengaja
          dibuat berstatus privat, sehingga tidak dapat dibuka pengunjung dan hanya menghasilkan halaman tidak
          ditemukan.
        </p>

        <p className="mt-8 flex items-center gap-2 text-[15px] text-ink-2">
          <PrismMark />
          <span>Tanda merek Akashic memakai spektrum cyan → biru → hijau.</span>
        </p>
      </section>
    </div>
  );
}
