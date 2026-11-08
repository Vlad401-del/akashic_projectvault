/**
 * Daftar keterampilan sebagai label bulat.
 *
 * Dua gaya dipakai: `profile` untuk header profil dan detail proyek, `card`
 * untuk kartu proyek yang ruangnya lebih sempit.
 */
export function SkillList({
  skills,
  variant = "profile",
  className = "",
}: {
  skills: string[];
  variant?: "profile" | "card";
  className?: string;
}) {
  if (skills.length === 0) {
    return null;
  }

  const itemClass =
    variant === "card"
      ? "rounded-full border border-ink/15 bg-canvas px-2.5 py-0.5 text-[12px] font-semibold text-ink"
      : "rounded-full border border-ink/15 bg-surface px-3 py-1 text-[13px] font-semibold text-ink";

  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {skills.map((skill) => (
        <li key={skill} className={itemClass}>
          {skill}
        </li>
      ))}
    </ul>
  );
}
