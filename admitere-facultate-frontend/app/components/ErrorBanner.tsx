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
      className={`rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 ${className}`.trim()}
    >
      {message}
    </p>
  );
}
