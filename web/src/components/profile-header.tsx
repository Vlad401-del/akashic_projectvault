import { SpectrumRule } from "@/components/site-brand";
import { SkillList } from "@/components/skill-list";
import type { Profile } from "@/lib/fixtures/types";
import { toSafeExternalUrl } from "@/lib/url";

/**
 * Header profil publik: nama, headline, bio, keterampilan, dan tautan kontak.
 *
 * Tidak ada tombol edit atau penanda status draft di sini karena halaman ini
 * dilihat pengunjung, bukan pemilik akun.
 */
export function ProfileHeader({ profile }: { profile: Profile }) {
  const contactUrl = profile.contact ? toSafeExternalUrl(profile.contact.url) : null;

  return (
    <header className="rounded-2xl border border-line bg-surface px-6 py-7 sm:px-8 sm:py-9">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-ink-muted">Portofolio kerja</p>

      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
        {profile.displayName}
      </h1>
      <p className="mt-2 text-sm font-medium text-ink-muted sm:text-base">{profile.headline}</p>

      <SpectrumRule className="mt-5" />

      <p className="mt-5 max-w-[68ch] text-sm leading-relaxed text-ink-muted">{profile.bio}</p>

      <div className="mt-6 flex flex-col gap-5 border-t border-line pt-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-ink">Keterampilan</h2>
          <SkillList skills={profile.skills} className="mt-3" />
        </div>

        {contactUrl && profile.contact ? (
          <div className="sm:text-right">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-ink">Kontak</h2>
            <a
              href={contactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center rounded-lg border border-line px-3 py-2 text-sm font-medium text-accent hover:border-accent"
            >
              {profile.contact.label}
              <span className="sr-only"> (terbuka di tab baru)</span>
            </a>
          </div>
        ) : null}
      </div>
    </header>
  );
}
