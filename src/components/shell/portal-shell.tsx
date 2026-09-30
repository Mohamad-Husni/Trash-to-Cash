"use client";

import type { ReactNode } from "react";
import { AppHeader } from "./app-header";
import { MobileBottomNav } from "./mobile-bottom-nav";

export function PortalShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader />
      <main className="w-full flex-1 pb-16 md:pb-0">{children}</main>
      <MobileBottomNav />
    </div>
  );
}
