import type { ReactNode } from "react";

type CardHeaderProps = {
  title: string;
  meta?: ReactNode;
};

export function CardHeader({ title, meta }: CardHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h3 className="font-display text-xl">{title}</h3>
      {meta}
    </div>
  );
}
