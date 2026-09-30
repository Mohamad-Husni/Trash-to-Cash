import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Collector, Role, User } from "@/types";
import { mockUsers, mockCollectors } from "@/lib/mock/users";
import { STORAGE_KEYS } from "@/lib/constants";

interface AuthState {
  user: (User & { collectorProfile?: Collector }) | null;
  loginAs: (role: Role) => void;
  logout: () => void;
  setCollectorStatus: (status: Collector["status"]) => void;
}

function getProfileForRole(role: Role): User & { collectorProfile?: Collector } {
  if (role === "citizen") return mockUsers[0];
  if (role === "collector") {
    const approved = mockUsers.find(
      (u) => u.role === "collector" && u.collectorProfile?.status === "approved"
    );
    return approved || mockUsers[1];
  }
  if (role === "admin") return mockUsers[3];
  return mockUsers[0];
}

function getPendingCollectorProfile(): User & { collectorProfile?: Collector } {
  return mockUsers.find((u) => u.collectorProfile?.status === "pending") || mockUsers[1];
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      loginAs: (role) => {
        if (role === "collector") {
          const approved = mockUsers.find(
            (u) => u.role === "collector" && u.collectorProfile?.status === "approved"
          );
          set({ user: approved || mockUsers[1] });
        } else {
          set({ user: getProfileForRole(role) });
        }
      },

      logout: () => set({ user: null }),

      setCollectorStatus: (status) => {
        set((s) => {
          if (!s.user?.collectorProfile) return s;
          const updatedProfile = { ...s.user.collectorProfile, status };
          const collectorInList = mockCollectors.find(
            (c) => c.id === s.user!.collectorProfile!.id
          );
          if (collectorInList) {
            const idx = mockCollectors.indexOf(collectorInList);
            mockCollectors[idx] = updatedProfile;
          }
          return { user: { ...s.user, collectorProfile: updatedProfile } };
        });
      },
    }),
    {
      name: STORAGE_KEYS.AUTH,
    }
  )
);

export { getPendingCollectorProfile };
