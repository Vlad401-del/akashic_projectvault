import Link from "next/link";

import { Icon, type IconName } from "@/components/icons";
import { ProjectCard } from "@/components/project-card";
import { PrismMark, SiteBrand, SpectrumRule } from "@/components/site-brand";
import { SkillList } from "@/components/skill-list";
import { TopBar } from "@/components/site-nav";
import { getDemoOwner, getPublicProjects, listPublicProfiles } from "@/lib/content";
import { isLocalDemoEditorEnabled } from "@/lib/demo-mode";

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
 * Berisi pengantar singkat, contoh karya, dan penjelasan alur. Pintu masuk
 * editor demo hanya tampil saat pengembangan lokal.
 */
export default function HomePage() {
  const demoEditorEnabled = isLocalDemoEditorEnabled();
  const profiles = listPublicProfiles();
  const featured = profiles
    .flatMap((profile) => getPublicProjects(profile).map((project) => ({ profile, project })))
    .slice(0, 4);

  const owner = getDemoOwner();
  const draftProject = owner.projects.find((project) => project.status === "draft");
  const publishedProject = owner.projects.find((project) => project.status === "published");

  const editorScreens: { icon: IconName; title: string; body: string; href: string }[] = [
    {
      icon: "plus",
      title: "Proyek baru",
      body: "Formulir kosong dengan panduan singkat, langkah proses, dan tautan bukti karya.",
      href: "/dashboard/projects/new",
    },
    ...(draftProject
      ? [
          {
            icon: "pencil" as IconName,
            title: "Editor draft",
            body: "Contoh proyek yang belum terbit: ada tombol Terbitkan dan checklist sebelum publikasi.",
            href: `/dashboard/projects/${draftProject.slug}/edit`,
          },
        ]
      : []),
    ...(publishedProject
      ? [
          {
            icon: "checkCircle" as IconName,
            title: "Editor sudah terbit",
            body: "Contoh proyek terbit: tombol Simpan perubahan publik dan penarikan dari tampilan publik.",
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
              ) : null}
            </div>

            <p className="mt-6 flex items-start gap-2 text-[13px] leading-5 text-ink-2">
              <Icon name="info" className="mt-0.5 size-4" />
              <span>
                {demoEditorEnabled
                  ? "Editor demo berjalan di komputer ini tanpa login. Proyek yang Anda isi tersimpan di berkas lokal, belum di database."
                  : "Versi publik ini menampilkan data contoh. Pembuatan akun dan penyimpanan proyek sedang disiapkan."}
              </span>
            </p>
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
          description={demoEditorEnabled
            ? "Diambil dari halaman publik akun contoh, termasuk proyek yang Anda buat sendiri lewat editor di komputer ini. Bagian Kontribusi saya dipisahkan dari hasil kelompok."
            : "Diambil dari halaman publik akun contoh. Bagian Kontribusi saya dipisahkan dari hasil kelompok."}
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

        {demoEditorEnabled ? (
          <Section
            id="area-editor"
            title="Area editor"
            description="Tiga layar editor dari desain sudah dibangun dan sekarang benar-benar menyimpan. Isi satu tugas, terbitkan, lalu buka halaman publiknya di localhost ini juga."
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
                    Buka layar
                    <Icon name="arrowRight" className="size-4" />
                  </Link>
                </li>
              ))}
            </ul>

            <p className="mt-6 flex items-start gap-2 text-[14px] leading-6 text-ink-2">
              <Icon name="info" className="mt-0.5 size-4" />
              <span>
                Tombol Simpan dan Terbitkan sudah menyimpan sungguhan, tetapi ke berkas lokal di komputer
                ini (web/.data/projects.json), bukan ke database. Belum ada login dan belum ada unggahan
                gambar.
              </span>
            </p>
          </Section>
        ) : null}

        <Section
          id="akun-contoh"
          title="Akun contoh untuk menguji aturan visibilitas"
          description="Keempat akun ini dipakai untuk memeriksa perilaku halaman publik sebelum database tersedia."
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

          <p className="mt-6 flex items-start gap-2 text-[14px] leading-6 text-ink-2">
            <Icon name="alert" className="mt-0.5 size-4" />
            <span>
              Ada satu akun contoh berstatus privat. Profilnya sengaja menghasilkan halaman tidak ditemukan,
              sama seperti perilaku yang diuji lewat skrip pemeriksaan rute.
            </span>
          </p>
        </Section>

        <p className="mt-16 flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface px-5 py-4 text-[14px] leading-6 text-ink-2">
          <PrismMark className="size-4" />
          <span>
            Tanda merek Akashic memakai prisma tiga sisi dengan spektrum cyan ke biru ke hijau. Warna terang
            itu hanya dipakai sebagai aksen; teks dan isi proyek tetap dominan.
          </span>
        </p>
      </div>
    </>
  );
}
