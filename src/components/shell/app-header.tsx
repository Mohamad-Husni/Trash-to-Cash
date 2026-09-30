"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { RoleSwitcher } from "./role-switcher";
import { ThemeToggle } from "@/components/shell/theme-toggle";
import { Recycle, Home, Wallet, Map, ClipboardList, History, Settings, Users, ScrollText, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";

const navItems: Record<Role, { href: string; label: string; icon: typeof Home }[]> = {
  citizen: [
    { href: "/citizen/dashboard", label: "Dashboard", icon: Home },
    { href: "/citizen/book-pickup", label: "Book Pickup", icon: ClipboardList },
    { href: "/citizen/register-bin", label: "Register Bin", icon: MapPin },
    { href: "/citizen/wallet", label: "Wallet", icon: Wallet },
  ],
  collector: [
    { href: "/collector/dashboard", label: "Map", icon: Map },
    { href: "/collector/history", label: "History", icon: History },
  ],
  admin: [
    { href: "/admin/dashboard", label: "Map", icon: Map },
    { href: "/admin/collectors", label: "Collectors", icon: Users },
    { href: "/admin/audit-log", label: "Audit Log", icon: ScrollText },
    { href: "/admin/bins", label: "Bins", icon: Recycle },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ],
};

export function AppHeader() {
  const user = useAuthStore((s) => s.user);
  const pathname = usePathname();

  if (!user) return null;

  const items = navItems[user.role];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#0099FF]/15 bg-background/80 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <BrandLogo className="h-10 w-10 rounded-lg shadow-sm" />
            <span className="hidden bg-gradient-to-r from-[#003B73] to-[#0099FF] bg-clip-text text-lg font-bold text-transparent sm:inline dark:from-[#0066C5] dark:to-[#0099FF]">
              Bincoin
            </span>
          </Link>
          <nav className="ml-4 hidden max-w-[calc(100vw-180px)] items-center gap-1 overflow-x-auto md:ml-6 md:flex lg:max-w-none lg:gap-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {items.map((item) => {
              const Icon = item.icon;
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium transition-all md:px-3",
                    active
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                  <span className="hidden md:inline lg:hidden">{item.label.split(" ")[0]}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <RoleSwitcher />
        </div>
      </div>
    </header>
  );
}
