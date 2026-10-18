import type { Metadata } from "next";
import Link from "next/link";

import { OwnerTopBar } from "@/components/editor/owner-top-bar";
import { ProjectRow } from "@/components/editor/project-row";
import { Icon } from "@/components/icons";
import { PrototypeNotice } from "@/components/prototype-notice";
import { Avatar } from "@/components/site-nav";
import { getDemoOwner, listOwnedProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Proyek saya",
};

/**
 * Halaman daftar proyek milik pemilik akun.
 *
 * Ini pintu masuk area editor. Belum ada autentikasi, jadi pemilik yang dipakai
 * adalah akun contoh; hal itu dinyatakan pada pemberitahuan di atas daftar.
 */
export default function DashboardPage() {
  const owner = getDemoOwner();
  const projects = listOwnedProjects();
  const draftCount = projects.filter((project) => project.status === "draft").length;
  const publishedCount = projects.length - draftCount;

  return (
    <>
      <OwnerTopBar owner={owner} backHref="/" backLabel="Halaman awal" />

      <div className="mx-auto max-w-[1120px] px-5 pb-24 pt-8 sm:px-8 sm:pt-12 xl:px-0">
        <PrototypeNotice className="mb-8">
          Area pemilik masih simulasi. Belum ada login maupun database, jadi daftar ini memakai akun contoh
          dan setiap perubahan hanya bertahan di peramban.
        </PrototypeNotice>

        <header className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex min-w-0 items-start gap-4">
            <Avatar displayName={owner.displayName} size="lg" />

            <div className="min-w-0">
              <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-2">Area pemilik</p>
              <h1 className="mt-1.5 text-[28px] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[34px]">
                Proyek saya
              </h1>
              <p className="mt-2 max-w-[40rem] text-[15px] leading-[1.65] text-ink-2">{owner.headline}</p>
              <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px] text-ink-2">
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="checkCircle" className="size-4" />
                  {publishedCount} sudah terbit
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="pencil" className="size-4" />
                  {draftCount} draft
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              href={`/u/${owner.username}`}
              className="inline-flex h-11 items-center gap-2 rounded-[10px] border border-line bg-surface px-4 text-[15px] font-medium text-ink transition-colors hover:border-line-strong"
            >
              <Icon name="externalLink" className="size-4" />
              Lihat portofolio publik
            </Link>
            <Link
              href="/dashboard/projects/new"
              className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-accent px-4 text-[15px] font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              <Icon name="plus" className="size-4" />
              Proyek baru
            </Link>
          </div>
        </header>

        <section aria-labelledby="daftar-proyek-pemilik" className="mt-10 border-t border-line pt-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="daftar-proyek-pemilik" className="text-[22px] font-semibold tracking-tight text-ink">
              Daftar proyek
            </h2>
            <p className="text-[14px] text-ink-2">
              Draft hanya terlihat di sini, bukan di halaman publik.
            </p>
          </div>

          {projects.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-line bg-surface px-6 py-14 text-center">
              <span className="mx-auto flex size-11 items-center justify-center rounded-full border border-line bg-canvas text-ink-2">
                <Icon name="folder" />
              </span>
              <h3 className="mt-4 text-[17px] font-semibold text-ink">Belum ada proyek</h3>
              <p className="mx-auto mt-2 max-w-[42ch] text-[15px] leading-[1.65] text-ink-2">
                Mulai dari satu tugas kuliah. Judul dan ringkasan sudah cukup untuk menyimpan draft pertama.
              </p>
              <Link
                href="/dashboard/projects/new"
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-[10px] bg-accent px-4 text-[15px] font-semibold text-white transition-colors hover:bg-accent-hover"
              >
                <Icon name="plus" className="size-4" />
                Buat proyek baru
              </Link>
            </div>
          ) : (
            <ul className="mt-6 space-y-4">
              {projects.map((project) => (
                <li key={project.slug}>
                  <ProjectRow project={project} username={owner.username} />
                </li>
              ))}
            </ul>
          )}

          <p className="mt-6 flex items-start gap-2 text-[14px] leading-6 text-ink-2">
            <Icon name="info" className="mt-0.5 size-4" />
            <span>
              Pengaturan profil pemilik belum dibuat. Tahap berikutnya menambahkan halaman itu beserta
              autentikasi dan penyimpanan sungguhan.
            </span>
          </p>
        </section>
      </div>
    </>
  );
}
