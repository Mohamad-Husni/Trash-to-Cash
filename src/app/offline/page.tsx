"use client";

import { Recycle } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-navy-gradient p-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sapphire-gradient shadow-2xl glow-primary">
        <Recycle className="h-9 w-9 text-white" />
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">You&apos;re Offline</h1>
        <p className="mt-2 text-[#E0E0E0]/70">
          Please check your internet connection and try again.
        </p>
      </div>
    </div>
  );
}
