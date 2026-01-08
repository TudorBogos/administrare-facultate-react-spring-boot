type SectionHeaderProps = {
  title: string;
  description?: string;
  label?: string;
};

export function SectionHeader({
  title,
  description,
  label = "Sectiune",
}: SectionHeaderProps) {
  return (
    <header className="space-y-3">
      <p className="label">{label}</p>
      <h2 className="font-display text-3xl">{title}</h2>
      {description ? (
        <p className="text-sm text-(--muted)">{description}</p>
      ) : null}
    </header>
  );
}
