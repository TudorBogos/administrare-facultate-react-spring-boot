type ErrorBannerProps = {
  message?: string;
  className?: string;
};

export function ErrorBanner({ message, className = "" }: ErrorBannerProps) {
  if (!message) {
    return null;
  }

  return (
    <p
      className={`border border-rose-500/40 bg-rose-950/40 px-3 py-2 text-sm text-rose-100 ${className}`.trim()}
    >
      {message}
    </p>
  );
}
