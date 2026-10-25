import Link from "next/link";

import { DemoNotice } from "@/components/demo-notice";
import { Icon, type IconName } from "@/components/icons";
import { ProjectCard } from "@/components/project-card";
import { PrismMark, SiteBrand, SpectrumRule } from "@/components/site-brand";
import { SkillList } from "@/components/skill-list";
import { TopBar } from "@/components/site-nav";
import { getDemoOwner, getPublicProjects } from "@/lib/content";
import { isLocalDemoEditorEnabled } from "@/lib/demo-mode";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { listVisibleProfiles } from "@/lib/public-content";

/**
 * Halaman ini menampilkan proyek yang sedang tampil publik, termasuk proyek
 * yang baru diterbitkan dari editor. Karena itu isinya dibaca setiap permintaan
 * dan tidak diprerender saat build.
 */
export const dynamic = "force-dynamic";

/** Judul bagian dengan deskripsi singkat, dipakai berulang di halaman ini. */
function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="mt-20 border-t border-line pt-12">
      <h2 id={id} className="text-[24px] font-semibold tracking-tight text-ink sm:text-[28px]">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 max-w-[46rem] text-[16px] leading-[1.7] text-ink-2">{description}</p>
      ) : null}
      <div className="mt-8">{children}</div>
    </section>
  );
}

const PROBLEMS: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "folder",
    title: "Tugas berserakan",
    body: "Berkas, laporan, dan tautan tersimpan di banyak tempat, sehingga sulit ditunjukkan saat melamar magang.",
  },
  {
    icon: "users",
    title: "Kontribusi tim kabur",
    body: "Pada tugas kelompok, bagian yang benar-benar Anda kerjakan sering tenggelam dalam laporan bersama.",
  },
  {
    icon: "clock",
    title: "Pembaca tidak punya waktu",
    body: "Perekrut membaca sekilas. Yang dicari: masalahnya apa, Anda mengerjakan apa, dan hasilnya seperti apa.",
  },
];

const STEPS: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "pencil",
    title: "Tulis identitas proyek",
    body: "Judul, ringkasan dua kalimat, mata kuliah, dan jenis tugasnya individu atau kelompok.",
  },
  {
    icon: "route",
    title: "Susun ceritanya",
    body: "Masalah, proses, kontribusi pribadi, dan hasil ditulis berurutan sebagai satu studi kasus.",
  },
  {
    icon: "image",
    title: "Lampirkan bukti",
    body: "Sampul dan tautan bukti karya, misalnya dashboard, repositori, prototipe, atau laporan.",
  },
  {
    icon: "upload",
    title: "Terbitkan",
    body: "Jika profil dan proyek aktif, karya tampil di satu tautan portofolio yang bisa dibuka pengunjung.",
  },
];

/**
 * Halaman awal Akashic.
 *
 * Berisi pengantar singkat, contoh karya, penjelasan alur, dan pintu masuk ke
 * area editor saat pengembangan lokal. Build produksi menampilkan demo publik
 * baca saja sampai autentikasi dan database siap.
 */
export default async function HomePage() {
  const cloudMode = isSupabaseConfigured();
  const demoEditorEnabled = isLocalDemoEditorEnabled() && !cloudMode;
  const { cloud: cloudProfiles, demo: profiles } = await listVisibleProfiles();
  const realFeatured = cloudProfiles
    .flatMap((profile) => getPublicProjects(profile).map((project) => ({ profile, project })))
    .slice(0, 4);
  const featured = realFeatured.length > 0 ? realFeatured : profiles
    .flatMap((profile) => getPublicProjects(profile).map((project) => ({ profile, project })))
    .slice(0, 4);

  const owner = getDemoOwner();
  const draftProject = owner.projects.find((project) => project.status === "draft");
  const publishedProject = owner.projects.find((project) => project.status === "published");

  const editorScreens: { icon: IconName; title: string; body: string; href: string }[] = [
    {
      icon: "plus",
      title: "Mulai proyek baru",
      body: "Ubah satu tugas menjadi cerita proyek. Simpan sebagai draft sebelum siap diterbitkan.",
      href: "/dashboard/projects/new",
    },
    ...(draftProject
      ? [
          {
            icon: "pencil" as IconName,
            title: "Lanjutkan draft",
            body: "Lengkapi cerita dan periksa kesiapan proyek sebelum ditampilkan ke publik.",
            href: `/dashboard/projects/${draftProject.slug}/edit`,
          },
        ]
      : []),
    ...(publishedProject
      ? [
          {
            icon: "checkCircle" as IconName,
            title: "Perbarui proyek terbit",
            body: "Lihat bagaimana perubahan pada proyek yang sudah terbit dikelola.",
            href: `/dashboard/projects/${publishedProject.slug}/edit`,
          },
        ]
      : []),
  ];

  return (
    <>
      <TopBar
        left={<SiteBrand />}
        right={
          <>
            <Link
              href="/u/nadia"
              className="hidden items-center gap-1.5 rounded text-[14px] font-medium text-ink-2 hover:text-accent sm:inline-flex"
            >
              Contoh portofolio
            </Link>
            {demoEditorEnabled ? (
              <Link
                href="/dashboard"
                className="inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-line bg-surface px-3 text-[14px] font-medium text-ink transition-colors hover:border-accent/40 hover:text-accent"
              >
                <Icon name="folder" className="size-4" />
                Area editor
              </Link>
            ) : cloudMode ? (
              <Link href="/dashboard" className="inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-line bg-surface px-3 text-[14px] font-medium text-ink hover:text-accent">
                Area saya
              </Link>
            ) : null}
          </>
        }
      />

      <div className="mx-auto max-w-[1120px] px-5 pb-24 pt-12 sm:px-8 sm:pt-16 xl:px-0">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-[13px] font-medium text-ink-2">
              <PrismMark className="size-3.5" />
              Ruang rekam karya mahasiswa
            </p>

            <h1 className="mt-6 text-[34px] font-semibold leading-[1.12] tracking-[-0.025em] text-ink sm:text-[48px]">
              Tugas kuliah, disusun menjadi studi kasus yang bisa dibaca.
            </h1>

            <SpectrumRule className="mt-6" />

            <p className="mt-6 max-w-[38rem] text-[17px] leading-[1.7] text-ink-2">
              Akashic menuntun mahasiswa menulis satu tugas menjadi cerita yang utuh: masalah yang dihadapi,
              proses yang dijalani, bagian yang dikerjakan sendiri, dan hasilnya. Semuanya tampil pada satu
              tautan portofolio.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/u/nadia"
                className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-accent px-4 text-[15px] font-semibold text-white transition-colors hover:bg-accent-hover"
              >
                Lihat contoh portofolio
                <Icon name="arrowRight" className="size-4" />
              </Link>
              {demoEditorEnabled ? (
                <Link
                  href="/dashboard"
                  className="inline-flex h-11 items-center gap-2 rounded-[10px] border border-line bg-surface px-4 text-[15px] font-medium text-ink transition-colors hover:border-line-strong"
                >
                  Coba area editor
                </Link>
              ) : cloudMode ? (
                <Link href="/signup" className="inline-flex h-11 items-center gap-2 rounded-[10px] border border-line bg-surface px-4 text-[15px] font-medium text-ink hover:border-line-strong">
                  Buat portofolio
                </Link>
              ) : null}
            </div>

            <DemoNotice className="mt-6 max-w-[38rem]">
              {cloudMode
                ? "Buat akun untuk menyimpan proyek di Supabase. Contoh fiktif tetap tersedia sebagai referensi tampilan."
                : demoEditorEnabled
                ? "Editor demo berjalan di komputer ini. Proyek yang Anda isi tersimpan di berkas lokal, belum di database atau akun pribadi."
                : "Versi publik ini menampilkan data contoh. Pembuatan akun dan penyimpanan proyek sedang disiapkan."}
            </DemoNotice>
          </div>

          <div className="lg:pt-4">
            <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.08em] text-ink-2">
              Kartu proyek yang tampil
            </p>
            {featured[0] ? (
              <ProjectCard project={featured[0].project} username={featured[0].profile.username} />
            ) : null}
          </div>
        </div>

        <Section
          id="masalah"
          title="Kenapa tugas kuliah perlu ditulis ulang"
          description="Isi tugas biasanya lengkap, tetapi belum tersusun untuk orang yang membaca cepat."
        >
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PROBLEMS.map((item) => (
              <li key={item.title} className="rounded-xl border border-line bg-surface p-5">
                <span className="flex size-10 items-center justify-center rounded-[10px] border border-line bg-canvas text-ink-2">
                  <Icon name={item.icon} className="size-[18px]" />
                </span>
                <h3 className="mt-4 text-[17px] font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-[15px] leading-[1.65] text-ink-2">{item.body}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section
          id="cara-kerja"
          title="Empat langkah, satu halaman"
          description="Urutan ini sengaja tetap, supaya setiap proyek punya bentuk yang sama dan mudah dibandingkan."
        >
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <li key={step.title} className="relative rounded-xl border border-line bg-surface p-5">
                <span className="flex size-8 items-center justify-center rounded-full bg-accent-soft text-[13px] font-semibold tabular-nums text-accent">
                  {index + 1}
                </span>
                <h3 className="mt-4 flex items-center gap-2 text-[16px] font-semibold text-ink">
                  <Icon name={step.icon} className="size-4 text-ink-2" />
                  {step.title}
                </h3>
                <p className="mt-2 text-[14px] leading-[1.65] text-ink-2">{step.body}</p>
              </li>
            ))}
          </ol>
        </Section>

        <Section
          id="contoh-karya"
          title="Karya yang sudah tampil"
          description={realFeatured.length > 0 ? "Karya yang diterbitkan oleh pengguna Akashic." : "Contoh fiktif untuk melihat bentuk studi kasus sebelum pengguna menerbitkan karya."}
        >
          <div className="grid gap-6 md:grid-cols-2">
            {featured.map(({ project, profile }) => (
              <ProjectCard key={`${profile.username}-${project.slug}`} project={project} username={profile.username} />
            ))}
          </div>
          <p className="mt-6">
            <Link
              href="/u/nadia"
              className="inline-flex items-center gap-1.5 rounded text-[15px] font-medium text-accent hover:text-accent-hover"
            >
              Buka semua proyek Nadia Putri
              <Icon name="arrowRight" className="size-4" />
            </Link>
          </p>
        </Section>

        {cloudProfiles.length > 0 ? (
          <Section id="portofolio-publik" title="Portofolio pengguna" description="Profil yang sudah dipilih pemiliknya untuk tampil publik.">
            <ul className="grid gap-5 sm:grid-cols-2">
              {cloudProfiles.map((profile) => (
                <li key={profile.username} className="rounded-xl border border-line bg-surface p-5">
                  <Link href={`/u/${profile.username}`} className="text-[17px] font-semibold text-ink hover:text-accent">{profile.displayName}</Link>
                  <p className="mt-2 text-sm text-ink-2">{getPublicProjects(profile).length} proyek terbit</p>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {demoEditorEnabled ? (
          <Section
            id="area-editor"
            title="Area editor"
            description="Mulai dari satu tugas, lanjutkan draft, atau perbarui proyek yang sudah terbit."
          >
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {editorScreens.map((screen) => (
                <li key={screen.href} className="flex flex-col rounded-xl border border-line bg-surface p-5">
                  <span className="flex size-10 items-center justify-center rounded-[10px] border border-line bg-canvas text-ink-2">
                    <Icon name={screen.icon} className="size-[18px]" />
                  </span>
                  <h3 className="mt-4 text-[17px] font-semibold text-ink">{screen.title}</h3>
                  <p className="mt-2 text-[15px] leading-[1.65] text-ink-2">{screen.body}</p>
                  <Link
                    href={screen.href}
                    className="mt-4 inline-flex w-fit items-center gap-1.5 rounded text-[14px] font-medium text-accent hover:text-accent-hover"
                  >
                    Buka editor
                    <Icon name="arrowRight" className="size-4" />
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        <Section
          id="profil-contoh"
          title="Jelajahi portofolio contoh"
          description="Buka profil dengan karya terbit atau lihat tampilan ketika belum ada proyek."
        >
          <ul className="grid gap-5 sm:grid-cols-2">
            {profiles.map((profile) => {
              const published = getPublicProjects(profile).length;

              return (
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
                    {published === 0
                      ? "Belum ada proyek, contoh keadaan kosong."
                      : `${published} proyek tampil publik.`}
                  </p>
                  <SkillList skills={profile.skills.slice(0, 3)} variant="card" className="mt-3" />
                </li>
              );
            })}
          </ul>

        </Section>
      </div>
    </>
  );
}
