export function SkillList({
  skills,
  limit,
  className = "",
}: {
  skills: string[];
  limit?: number;
  className?: string;
}) {
  const shown = typeof limit === "number" ? skills.slice(0, limit) : skills;
  const hiddenCount = skills.length - shown.length;

  if (shown.length === 0) {
    return null;
  }

  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {shown.map((skill) => (
        <li
          key={skill}
          className="rounded-full border border-line bg-canvas px-2.5 py-1 text-xs font-medium text-ink-muted"
        >
          {skill}
        </li>
      ))}
      {hiddenCount > 0 ? (
        <li className="rounded-full border border-dashed border-line px-2.5 py-1 text-xs font-medium text-ink-muted">
          +{hiddenCount} keterampilan lain
        </li>
      ) : null}
    </ul>
  );
}
