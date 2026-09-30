"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import type { Role } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, ChevronDown } from "lucide-react";

const roleLabels: Record<Role, string> = {
  citizen: "Citizen",
  collector: "Collector",
  admin: "Admin",
};

export function RoleSwitcher() {
  const user = useAuthStore((s) => s.user);
  const loginAs = useAuthStore((s) => s.loginAs);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const handleSwitch = (role: Role) => {
    loginAs(role);
    if (role === "citizen") router.push("/citizen/dashboard");
    else if (role === "collector") router.push("/collector/dashboard");
    else if (role === "admin") router.push("/admin/dashboard");
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#0099FF]/20 bg-[#0099FF]/5 px-2.5 text-sm font-medium text-foreground transition-colors hover:border-[#0099FF]/40 hover:bg-[#0099FF]/10 sm:px-3 sm:gap-2"
      >
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Switch Role</span>
          <ChevronDown className="h-3 w-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground">
                {roleLabels[user.role]}
                {user.collectorProfile && ` (${user.collectorProfile.status})`}
              </span>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <div className="px-1.5 py-1 text-xs font-medium text-muted-foreground">
          Demo Role Switcher
        </div>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleSwitch("citizen")}>
            <User className="h-4 w-4" /> Log in as Citizen
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSwitch("collector")}>
            <User className="h-4 w-4" /> Log in as Collector
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSwitch("admin")}>
            <User className="h-4 w-4" /> Log in as Admin
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleLogout} className="text-destructive">
            <LogOut className="h-4 w-4" /> Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
