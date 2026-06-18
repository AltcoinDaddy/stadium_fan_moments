"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useAppStore } from "@/store";
import ProfileScreen from "@/screens/ProfileScreen";

function ProfilePageInner() {
  const searchParams = useSearchParams();
  const setProfileTab = useAppStore((s) => s.setProfileTab);

  const tab = searchParams.get("tab");
  if (tab === "captures") setProfileTab("CAPTURES");
  if (tab === "collection") setProfileTab("COLLECTION");

  return <ProfileScreen />;
}

export default function ProfilePage() {
  return (
    <Suspense>
      <ProfilePageInner />
    </Suspense>
  );
}
