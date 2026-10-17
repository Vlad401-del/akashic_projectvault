import { Avatar } from "@/components/site-nav";
import { Icon, type IconName } from "@/components/icons";
import { SkillList } from "@/components/skill-list";
import type { ContactKind, Profile } from "@/lib/fixtures/types";
import { toSafeExternalUrl } from "@/lib/url";

const CONTACT_ICON: Record<ContactKind, IconName> = {
  email: "mail",
  linkedin: "linkedin",
  cv: "download",
  situs: "externalLink",
};

/**
 * Header profil publik: avatar, nama, headline, program studi, bio,
 * keterampilan, dan tombol kontak.
 *
 * Tidak ada tombol edit atau penanda status draft di sini karena halaman ini
 * dilihat pengunjung, bukan pemilik akun.
 */
export function ProfileHeader({ profile }: { profile: Profile }) {
  const contacts = profile.contacts
    .map((contact) => ({ ...contact, safeUrl: toSafeExternalUrl(contact.url) }))
    .filter((contact): contact is typeof contact & { safeUrl: string } => contact.safeUrl !== null);

  return (
    <section className="mt-10 grid gap-6 sm:mt-12 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-8">
      <Avatar displayName={profile.displayName} size="lg" />

      <div className="min-w-0 max-w-[42rem]">
        <h1 className="text-[32px] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[40px]">
          {profile.displayName}
        </h1>
        <p className="mt-2 text-[17px] font-medium leading-snug text-ink sm:text-[18px]">{profile.headline}</p>

        <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[14px] text-ink-2">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="graduationCap" className="size-4" />
            {profile.program}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="mapPin" className="size-4" />
            {profile.city}
          </span>
        </p>

        <p className="mt-5 max-w-[37.5rem] text-[17px] leading-[1.7] text-ink-2">{profile.bio}</p>

        <div className="mt-8">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-2">Keterampilan</h2>
          <SkillList skills={profile.skills} className="mt-3" />
        </div>

        {contacts.length > 0 ? (
          <div className="mt-8">
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-2">Kontak</h2>
            <ul className="mt-3 flex flex-wrap gap-2.5">
              {contacts.map((contact) => (
                <li key={`${contact.kind}-${contact.safeUrl}`}>
                  <a
                    href={contact.safeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-line bg-surface px-3.5 text-[14px] font-medium text-accent transition-colors hover:border-accent/40 hover:bg-accent-soft"
                  >
                    <Icon name={CONTACT_ICON[contact.kind]} className="size-4" />
                    {contact.label}
                    <span className="sr-only"> (terbuka di tab baru)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
