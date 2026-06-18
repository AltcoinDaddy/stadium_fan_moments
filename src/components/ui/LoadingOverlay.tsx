"use client";

interface Props {
  title: string;
  status: string;
  subtitle?: string;
}

export default function LoadingOverlay({ title, status, subtitle }: Props) {
  return (
    <div className="absolute inset-0 bg-[#0B0E11]/95 z-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-[#ff5540]/20 border-t-[#ff5540] animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-4 border-[#00eefc]/10 border-t-[#00eefc] animate-spin duration-700"></div>
      </div>
      <h3 className="text-lg font-display font-extrabold text-white uppercase tracking-wider">
        {title}
      </h3>
      <p className="text-sm font-mono text-[#00eefc] mt-3 animate-pulse">
        {status}
      </p>
      {subtitle && (
        <p className="text-xs text-[#c2c7d0] mt-12 max-w-xs leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
