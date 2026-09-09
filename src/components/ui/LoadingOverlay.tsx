"use client";

interface Props {
  title: string;
  status: string;
  subtitle?: string;
}

export default function LoadingOverlay({ title, status, subtitle }: Props) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/95 p-6 text-center">
      <div className="relative mb-6 h-14 w-14">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-line border-t-lime" />
      </div>
      <h3 className="text-lg font-extrabold text-ink">{title}</h3>
      <p className="mt-3 text-sm font-medium text-muted">{status}</p>
      {subtitle && (
        <p className="mt-10 max-w-xs text-xs leading-relaxed text-muted">
          {subtitle}
        </p>
      )}
    </div>
  );
}
