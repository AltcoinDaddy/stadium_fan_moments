"use client";

import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

export default function GlassPanel({ children, className = "" }: Props) {
  return (
    <div className={`rounded-[28px] bg-white ${className}`}>
      {children}
    </div>
  );
}
