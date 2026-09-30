"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";

export default function Home() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    } else if (user.role === "citizen") {
      router.replace("/citizen/dashboard");
    } else if (user.role === "collector") {
      if (user.collectorProfile?.status === "pending") {
        router.replace("/collector/pending-approval");
      } else {
        router.replace("/collector/dashboard");
      }
    } else if (user.role === "admin") {
      router.replace("/admin/dashboard");
    }
  }, [user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );
}
