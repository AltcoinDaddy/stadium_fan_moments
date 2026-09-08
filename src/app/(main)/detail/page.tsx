"use client";

import { Suspense } from "react";
import DetailScreen from "@/screens/DetailScreen";

export default function DetailPage() {
  return (
    <Suspense fallback={null}>
      <DetailScreen />
    </Suspense>
  );
}
