import type { ReactNode } from "react";

type TableProps = {
  children: ReactNode;
  className?: string;
};

type TableSectionProps = {
  children: ReactNode;
  className?: string;
};

export function Table({ children, className = "" }: TableProps) {
  return (
    <table
      className={`w-full border-separate border-spacing-x-3 border-spacing-y-0 text-sm ${className}`.trim()}
    >
      {children}
    </table>
  );
}

export function TableHead({ children, className = "" }: TableSectionProps) {
  return (
    <thead
      className={`text-left text-[11px] uppercase tracking-[0.2em] text-(--muted) ${className}`.trim()}
    >
      {children}
    </thead>
  );
}

export function TableBody({ children, className = "" }: TableSectionProps) {
  return (
    <tbody className={`divide-y divide-(--stroke) ${className}`.trim()}>
      {children}
    </tbody>
  );
}
