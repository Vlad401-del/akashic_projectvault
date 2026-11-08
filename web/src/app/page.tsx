import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { Icon } from "@/components/icons";
import { HeroSpotlight, PathTabs, RevealObserver, type PathData } from "@/components/landing/landing-motion";
import { ProjectCard } from "@/components/project-card";
import { SiteBrand } from "@/components/site-brand";
import { TopBar } from "@/components/site-nav";
import { TeamCard } from "@/components/team/team-card";
import { getPublicProjects, listPublicProfiles } from "@/lib/content";
import { isLocalDemoEditorEnabled } from "@/lib/demo-mode";
import { openSlots } from "@/lib/team-utils";
import { listOpenTeamPosts } from "@/lib/teams";

/**
 * Halaman ini menampilkan proyek dan pencarian tim yang sedang terbuka,
 * termasuk yang baru disimpan dari editor. Karena itu isinya dibaca setiap
 * permintaan dan tidak diprerender saat build.
 */
export const dynamic = "force-dynamic";

const PHOTO_TEAM =
  "https://images.unsplash.com/photo-1774842391684-b819ec9bd409?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400";
const PHOTO_STUDENTS =
  "https://images.unsplash.com/photo-1569682535081-3e826bee049b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1000";

/** Jeda animasi bertingkat lewat variabel CSS `--d`. */
function delay(ms: number): CSSProperties {
  return { ["--d" as string]: `${ms}ms` };
}

const PRINCIPLES = [
  {
    title: "Kontribusi jujur",
    body: "Bagian “Kontribusi saya” dipisah dari hasil kelompok, lengkap dengan apa yang dikerjakan anggota lain. Tidak ada klaim kerja tim sebagai kerja sendiri.",
  },
  {
    title: "Privasi terkendali",
    body: "Profil privat dan draft tidak bisa dibuka lewat tautan langsung, dan pesannya tidak membedakan keduanya, jadi keberadaan profil privat tidak bisa ditebak.",
  },
  {
    title: "Bukti dulu",
    body: "Setiap pencarian tim menautkan portofolio pembuatnya, dan setiap perkenalan menjawab peran, jam per minggu, serta apa yang dibawa — bukan DM kosong.",
  },
];

/**
 * Halaman awal Akashic.
 *
 * Komposisi: hero gelap dengan kartu tim yang melayang → pita lomba miring →
 * dua jalur bernomor → karya → prinsip kepercayaan → lomba terbuka → ajakan.
 * Gerak dibuat ringan dengan CSS dan satu IntersectionObserver.
 */
export default function HomePage() {
  const demoEditorEnabled = isLocalDemoEditorEnabled();
  const profiles = listPublicProfiles();
  const featured = profiles
    .flatMap((profile) => getPublicProjects(profile).map((project) => ({ profile, project })))
    .slice(0, 4);
  const openTeams = listOpenTeamPosts();

  const heroTeam = openTeams[0] ?? null;
  const heroProject = featured[0] ?? null;
  const heroSlots = heroTeam ? openSlots(heroTeam.team) : 0;

  const portfolioCta = demoEditorEnabled
    ? { label: "Buat portofolio", href: "/dashboard/projects/new" }
    : { label: "Lihat contoh portofolio", href: "/u/nadia" };
  const openTeamCta = demoEditorEnabled
    ? { label: "Pasang pencarian tim", href: "/dashboard/tim/baru" }
    : { label: "Buka papan tim", href: "/tim" };

  const tickerItems = Array.from(
    new Set([
      ...openTeams.map((item) => item.team.competition),
      ...openTeams.flatMap((item) => item.team.roles.map((role) => role.title)),
      ...featured.map((item) => item.project.category),
    ]),
  );

  const paths: PathData[] = [
    {
      id: "cari",
      label: "Saya cari tim",
      intro:
        "Mulai dari karya yang sudah ada. Calon rekan melihat apa yang benar-benar kamu kerjakan sebelum kalian bicara.",
      steps: [
        {
          title: "Susun portofolio",
          body: "Ubah satu tugas kuliah menjadi studi kasus: masalah, proses, kontribusimu sendiri, lalu hasilnya.",
        },
        {
          title: "Jelajahi papan tim",
          body: "Saring pencarian berdasarkan jenis lomba, keahlian yang dicari, dan batas jam komitmen per minggu.",
        },
        {
          title: "Kirim perkenalan terstruktur",
          body: "Jawab peran yang diminati, jam yang sanggup dijamin, apa yang kamu bawa, dan tautan bukti karya.",
        },
        {
          title: "Ngobrol, lalu gabung",
          body: "Pemilik tim meninjau perkenalanmu dan menghubungi lewat kontak yang kamu cantumkan.",
        },
      ],
      cta: { label: "Buka papan tim", href: "/tim" },
    },
    {
      id: "buka",
      label: "Saya buka tim",
      intro:
        "Tulis kebutuhan timmu sejelas mungkin. Semakin spesifik perannya, semakin relevan perkenalan yang masuk.",
      steps: [
        {
          title: "Tulis ide & lomba",
          body: "Nama tim, kompetisi yang dituju, ringkasan masalah yang ingin diselesaikan, dan tenggat pendaftaran.",
        },
        {
          title: "Rinci peran",
          body: "Sebutkan peran yang dicari beserta keahliannya, ukuran tim, dan komitmen jam per minggu.",
        },
        {
          title: "Terima perkenalan",
          body: "Perkenalan masuk ke area pemilik dalam format yang sama, jadi mudah dibandingkan satu per satu.",
        },
        {
          title: "Tinjau & tandai",
          body: "Tandai setiap pelamar: baru, sedang diskusi, diterima, atau ditolak — supaya tidak ada yang tergantung.",
        },
      ],
      cta: openTeamCta,
    },
  ];

  return (
    <div className="overflow-x-clip">
      <TopBar
        tone="dark"
        left={<SiteBrand tone="dark" />}
        right={
          <>
            <nav aria-label="Bagian halaman" className="hidden items-center gap-6 md:flex">
              {[
                { label: "Cara kerja", href: "#cara-kerja" },
                { label: "Karya", href: "#karya" },
                { label: "Lomba", href: "#lomba" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="link-underline text-[14px] font-semibold text-cream/80 hover:text-cream"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            {demoEditorEnabled ? (
              <Link
                href="/dashboard"
                className="link-underline hidden text-[14px] font-semibold text-cream/80 hover:text-cream sm:ml-2 sm:inline"
              >
                Area pemilik
              </Link>
            ) : null}
            <Link
              href="/tim"
              className="inline-flex h-10 items-center gap-1.5 rounded-full bg-sun px-4 text-[14px] font-bold text-ink transition-transform hover:-translate-y-0.5"
            >
              <Icon name="users" className="size-4" />
              Cari tim
            </Link>
          </>
        }
      />

      {/* ---------------- Hero ---------------- */}
      <section
        aria-labelledby="hero-title"
        className="on-dark cut-bottom relative isolate overflow-hidden bg-forest text-cream"
        style={{ ["--cut" as string]: "72px" }}
      >
        <div aria-hidden="true" className="grid-lines absolute inset-0 -z-10 text-cream/[0.07]" />
        <HeroSpotlight />
        <div
          aria-hidden="true"
          className="absolute -right-40 -top-40 -z-10 size-[520px] rounded-full border border-dashed border-sun/25"
        />
        <div aria-hidden="true" className="hatch absolute bottom-24 left-0 -z-10 h-40 w-1/3 text-cream/[0.06]" />
        <p
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[0.2em] left-1/2 -z-10 -translate-x-1/2 select-none whitespace-nowrap font-display text-[16vw] font-semibold leading-none text-cream/[0.05]"
        >
          karya nyata
        </p>

        <div className="mx-auto grid max-w-[1200px] gap-14 px-5 pb-40 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:items-center lg:gap-10">
          <div>
            <p className="eyebrow fade-up text-sun" style={delay(100)}>
              Portofolio · Komunitas lomba mahasiswa
            </p>

            <h1
              id="hero-title"
              className="mt-6 text-[46px] font-semibold leading-[0.98] tracking-[-0.03em] sm:text-[68px] lg:text-[84px]"
            >
              <span className="line-mask">
                <span style={delay(150)}>Temukan tim</span>
              </span>
              <span className="line-mask">
                <span style={delay(260)}>lomba lewat</span>
              </span>
              <span className="line-mask">
                <span style={delay(370)}>
                  <em className="font-medium italic text-sun">karya nyata.</em>
                </span>
              </span>
            </h1>

            <p className="fade-up mt-8 max-w-[34rem] text-[18px] leading-[1.65] text-cream/80" style={delay(520)}>
              Tunjukkan proyekmu sebagai studi kasus, cari anggota yang cocok dari bukti kerjanya, lalu gabung
              tim kompetisi tanpa basa-basi.
            </p>

            <div className="fade-up mt-10 flex flex-wrap items-center gap-3" style={delay(640)}>
              <Link
                href="/tim"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-sun px-6 text-[15px] font-bold text-ink shadow-[4px_4px_0_0_#0b1a13] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#0b1a13]"
              >
                Cari tim sekarang
                <Icon name="arrowRight" className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href={portfolioCta.href}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-cream/35 px-6 text-[15px] font-semibold text-cream transition-colors hover:border-cream hover:bg-cream/10"
              >
                {portfolioCta.label}
              </Link>
            </div>

            <p className="fade-up mt-8 flex items-center gap-2 text-[13px] text-cream/65" style={delay(760)}>
              <Icon name="checkCircle" className="size-4 text-sun" />
              Kontribusi pribadi selalu dipisah dari hasil kelompok.
            </p>
          </div>

          {/* Gugus kartu: bukti karya di belakang, pencarian tim di depan. */}
          <div className="fade-up relative mx-auto h-[460px] w-full max-w-[460px]" style={delay(450)}>
            <div aria-hidden="true" className="corner-marks absolute -inset-5 text-sun/50" />

            {heroProject ? (
              <article
                className="drift absolute left-0 top-2 w-[80%] rounded-[18px] border border-ink bg-cream p-5 text-ink shadow-[6px_6px_0_0_#0b1a13]"
                style={{ ["--tilt" as string]: "-5deg", ...delay(0) }}
              >
                <span className="inline-flex rounded-full bg-sun px-2.5 py-0.5 text-[11px] font-bold">Bukti karya</span>
                <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.12em] text-ink-2">
                  {heroProject.project.category}
                </p>
                <h2 className="mt-1 text-[22px] font-semibold leading-tight">
                  <Link
                    href={`/u/${heroProject.profile.username}/p/${heroProject.project.slug}`}
                    className="hover:underline"
                  >
                    {heroProject.project.title}
                  </Link>
                </h2>
                <p className="mt-3 text-[13px] text-ink-2">oleh {heroProject.profile.displayName}</p>
              </article>
            ) : null}

            {heroTeam ? (
              <article
                className="drift absolute bottom-6 right-0 w-[88%] rounded-[18px] border border-ink bg-surface p-5 text-ink shadow-[6px_6px_0_0_#0b1a13]"
                style={{ ["--tilt" as string]: "2.5deg", ...delay(1400) }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex rounded-full bg-coral px-2.5 py-0.5 text-[11px] font-bold">
                    {heroTeam.team.competition}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-accent">
                    <Icon name="clock" className="size-3.5" />~{heroTeam.team.weeklyHours} jam/minggu
                  </span>
                </div>
                <h2 className="mt-3 text-[21px] font-semibold leading-tight">
                  <Link href={`/tim/${heroTeam.team.id}`} className="hover:underline">
                    {heroTeam.team.title}
                  </Link>
                </h2>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {heroTeam.team.roles.map((role) => (
                    <li
                      key={role.title}
                      className="rounded-full border border-ink/15 bg-sun-soft/70 px-2.5 py-0.5 text-[12px] font-semibold"
                    >
                      {role.title}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-3 text-[12px] text-ink-2">
                  <span>Tenggat {heroTeam.team.deadline}</span>
                  <span className="font-bold text-ink">Ajukan diri →</span>
                </div>
              </article>
            ) : null}

            {heroTeam && heroSlots > 0 ? (
              <p
                className="absolute -right-3 top-[34%] flex size-24 -rotate-12 flex-col items-center justify-center rounded-full border border-ink bg-coral text-center text-ink shadow-[3px_3px_0_0_#0b1a13]"
              >
                <span className="font-display text-[30px] font-semibold leading-none">{heroSlots}</span>
                <span className="mt-0.5 text-[10px] font-bold uppercase leading-tight tracking-[0.08em]">
                  slot
                  <br />
                  terbuka
                </span>
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {/* ---------------- Pita lomba ---------------- */}
      {tickerItems.length > 0 ? (
        <div className="marquee relative z-10 -mx-[4%] -mt-12 -rotate-2 overflow-hidden border-y border-ink bg-sun py-4 text-ink">
          <div className="marquee-track">
            {[0, 1].map((copy) => (
              <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
                {[...tickerItems, ...tickerItems].map((item, index) => (
                  <li
                    key={`${copy}-${index}`}
                    className="flex items-center gap-6 whitespace-nowrap pr-6 font-display text-[22px] font-semibold sm:text-[26px]"
                  >
                    {item}
                    <span aria-hidden="true" className="size-2.5 rotate-45 bg-ink" />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      ) : null}

      {/* ---------------- Dua jalur ---------------- */}
      <section id="cara-kerja" aria-labelledby="jalur-title" className="scroll-mt-24 bg-canvas pb-28 pt-28">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <div data-reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow text-coral">Alur kolaborasi</p>
              <h2
                id="jalur-title"
                className="mt-4 text-[44px] font-semibold leading-[1] tracking-[-0.03em] sm:text-[64px]"
              >
                Dua jalur,
                <br />
                <em className="font-medium italic text-forest">satu tujuan.</em>
              </h2>
            </div>
            <p className="max-w-[24rem] text-[16px] leading-[1.7] text-ink-2">
              Pilih perannya sekarang untuk melihat bagaimana kolaborasi dimulai — keduanya berangkat dari karya
              nyata.
            </p>
          </div>

          <div data-reveal className="mt-16" style={delay(120)}>
            <PathTabs paths={paths} />
          </div>
        </div>
      </section>

      {/* ---------------- Karya ---------------- */}
      <section
        id="karya"
        aria-labelledby="karya-title"
        className="cut-top relative isolate scroll-mt-16 bg-mint pb-32 pt-36"
        style={{ ["--cut" as string]: "64px" }}
      >
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <div data-reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow text-forest">Karya mahasiswa</p>
              <h2
                id="karya-title"
                className="mt-4 text-[44px] font-semibold leading-[1] tracking-[-0.03em] sm:text-[64px]"
              >
                Karya yang <em className="font-medium italic text-forest">bicara.</em>
              </h2>
              <p className="mt-5 max-w-[34rem] text-[16px] leading-[1.7] text-ink-2">
                {demoEditorEnabled
                  ? "Diambil dari halaman publik akun contoh, termasuk proyek yang kamu terbitkan lewat editor di komputer ini."
                  : "Diambil dari halaman publik akun contoh. Setiap studi kasus memisahkan bagian pribadi dari hasil kelompok."}
              </p>
            </div>
            <Link
              href="/u/nadia"
              className="group inline-flex items-center gap-2 text-[15px] font-bold text-forest"
            >
              <span className="link-underline">Lihat semua proyek Nadia</span>
              <Icon name="arrowUpRight" className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map(({ project, profile }, index) => (
              <div
                key={`${profile.username}-${project.slug}`}
                data-reveal
                style={delay(index * 110)}
                className={index % 2 === 1 ? "lg:mt-14" : ""}
              >
                <ProjectCard project={project} username={profile.username} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Prinsip kepercayaan ---------------- */}
      <section aria-labelledby="prinsip-title" className="on-dark relative isolate overflow-hidden bg-night py-28 text-cream">
        <div aria-hidden="true" className="grid-lines absolute inset-0 -z-10 text-cream/[0.05]" />
        <div className="mx-auto grid max-w-[1200px] gap-14 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
          <figure data-reveal className="relative">
            <div aria-hidden="true" className="absolute -left-4 -top-4 h-full w-full bg-sun" style={{ clipPath: "polygon(0 0, 88% 0, 100% 12%, 100% 100%, 12% 100%, 0 88%)" }} />
            <div
              className="relative aspect-[4/5] overflow-hidden"
              style={{ clipPath: "polygon(0 0, 88% 0, 100% 12%, 100% 100%, 12% 100%, 0 88%)" }}
            >
              <Image
                src={PHOTO_TEAM}
                alt="Sekelompok orang berdiskusi di depan papan tulis penuh catatan tempel"
                fill
                sizes="(min-width: 1024px) 480px, 100vw"
                unoptimized
                className="object-cover grayscale contrast-125"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-forest/55" />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-night/70 via-transparent to-transparent" />
              <p className="absolute bottom-5 left-6 right-6 font-display text-[24px] italic leading-tight text-cream">
                “Siapa mengerjakan apa” harus jelas sejak awal.
              </p>
            </div>
            <figcaption className="mt-4 pl-1 text-[11px] text-cream/45">Foto: blue sky / Unsplash</figcaption>
          </figure>

          <div className="lg:pt-6">
            <div data-reveal>
              <p className="eyebrow text-sun">Dibangun untuk kepercayaan</p>
              <h2
                id="prinsip-title"
                className="mt-4 text-[42px] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-[60px]"
              >
                Bukan CV. Bukan DM kosong.{" "}
                <em className="font-medium italic text-sun">Bukti.</em>
              </h2>
            </div>

            <ol className="mt-12 border-t border-cream/15">
              {PRINCIPLES.map((item, index) => (
                <li
                  key={item.title}
                  data-reveal
                  style={delay(index * 120)}
                  className="group grid grid-cols-[56px_minmax(0,1fr)] gap-5 border-b border-cream/15 py-7"
                >
                  <span className="font-display text-[15px] font-semibold tabular-nums text-sun">
                    0{index + 1}
                  </span>
                  <div>
                    <h3 className="text-[24px] font-semibold leading-tight transition-colors group-hover:text-sun">
                      {item.title}
                    </h3>
                    <p className="mt-2 max-w-[34rem] text-[15px] leading-[1.7] text-cream/70">{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ---------------- Lomba terbuka ---------------- */}
      <section id="lomba" aria-labelledby="lomba-title" className="relative isolate scroll-mt-16 bg-sky py-28">
        <div aria-hidden="true" className="hatch absolute right-0 top-0 -z-10 h-48 w-1/4 text-ink/[0.07]" />
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <div data-reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow text-forest">Agenda kompetisi aktif</p>
              <h2
                id="lomba-title"
                className="mt-4 text-[44px] font-semibold leading-[1] tracking-[-0.03em] sm:text-[64px]"
              >
                Lomba yang lagi <em className="font-medium italic text-forest">cari tim.</em>
              </h2>
              <p className="mt-5 text-[16px] leading-[1.7] text-ink-2">
                <strong className="font-display text-[22px] font-semibold text-ink">{openTeams.length}</strong>{" "}
                tim sedang mencari anggota saat ini.
              </p>
            </div>
            <Link href="/tim" className="group inline-flex items-center gap-2 text-[15px] font-bold text-forest">
              <span className="link-underline">Lihat semua lomba</span>
              <Icon name="arrowRight" className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {openTeams.length > 0 ? (
            <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {openTeams.slice(0, 3).map((item, index) => (
                <div key={item.team.id} data-reveal style={delay(index * 110)}>
                  <TeamCard item={item} />
                </div>
              ))}
            </div>
          ) : (
            <div data-reveal className="mt-14 rounded-[18px] border border-dashed border-ink/30 bg-surface/60 p-10 text-center">
              <p className="font-display text-[24px] font-semibold">Belum ada pencarian tim yang terbuka.</p>
              <Link
                href={openTeamCta.href}
                className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-forest px-5 text-[14px] font-semibold text-cream"
              >
                {openTeamCta.label}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ---------------- Ajakan ---------------- */}
      <section
        aria-labelledby="ajakan-title"
        className="cut-top relative isolate overflow-hidden bg-sun pb-28 pt-36 text-ink"
        style={{ ["--cut" as string]: "56px" }}
      >
        <div aria-hidden="true" className="absolute -left-24 bottom-[-180px] -z-10 size-[420px] rounded-full border border-ink/20" />
        <div aria-hidden="true" className="absolute -left-10 bottom-[-120px] -z-10 size-[300px] rounded-full border border-ink/15" />
        <div className="mx-auto grid max-w-[1200px] items-center gap-14 px-5 sm:px-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
          <div data-reveal>
            <h2
              id="ajakan-title"
              className="text-[48px] font-semibold leading-[0.98] tracking-[-0.035em] sm:text-[76px]"
            >
              Punya karya?
              <br />
              <em className="font-medium italic">Waktunya ketemu timnya.</em>
            </h2>
            <p className="mt-6 max-w-[32rem] text-[17px] leading-[1.7] text-ink/80">
              Mulai dari satu tugas kuliah yang paling kamu banggakan. Tulis ceritanya, terbitkan, lalu pakai
              tautannya saat mengajukan diri ke tim lomba.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href={portfolioCta.href}
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-forest px-6 text-[15px] font-semibold text-cream shadow-[4px_4px_0_0_var(--color-ink)] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--color-ink)]"
              >
                {portfolioCta.label}
                <Icon name="arrowRight" className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/tim"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-ink px-6 text-[15px] font-semibold text-ink transition-colors hover:bg-ink hover:text-sun"
              >
                Cari tim sekarang
              </Link>
            </div>
          </div>

          <figure data-reveal style={delay(150)} className="relative mx-auto w-full max-w-[340px]">
            <div
              className="drift relative aspect-[3/4] overflow-hidden rounded-[18px] border border-ink bg-ink shadow-[8px_8px_0_0_var(--color-ink)]"
              style={{ ["--tilt" as string]: "3deg" }}
            >
              <Image
                src={PHOTO_STUDENTS}
                alt="Mahasiswa duduk bersama di ruang kelas"
                fill
                sizes="340px"
                unoptimized
                className="object-cover grayscale"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-coral/25" />
            </div>
            <figcaption className="mt-5 text-center text-[11px] text-ink/60">Foto: Xin Wang / Unsplash</figcaption>
          </figure>
        </div>
      </section>

      <RevealObserver />
    </div>
  );
}
