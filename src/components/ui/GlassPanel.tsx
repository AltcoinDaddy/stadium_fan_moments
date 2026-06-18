"use client";

import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

export default function GlassPanel({ children, className = "" }: Props) {
  return (
    <div
      className={`bg-[#161B22]/80 backdrop-blur-md border border-white/10 rounded-2xl ${className}`}
    >
      {children}
    </div>
  );
}
