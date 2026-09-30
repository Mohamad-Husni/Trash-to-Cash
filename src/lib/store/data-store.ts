import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Bin, Collector, PickupRequest, Settings, Transaction, Voucher } from "@/types";
import { mockBins } from "@/lib/mock/bins";
import { mockCollectors } from "@/lib/mock/users";
import { mockRequests } from "@/lib/mock/requests";
import { mockTransactions } from "@/lib/mock/transactions";
import { mockVouchers } from "@/lib/mock/vouchers";
import { mockSettings } from "@/lib/mock/settings";
import { STORAGE_KEYS } from "@/lib/constants";
import { generateId } from "@/lib/points";

interface DataState {
  bins: Bin[];
  requests: PickupRequest[];
  transactions: Transaction[];
  vouchers: Voucher[];
  collectors: Collector[];
  settings: Settings;

  addBin: (bin: Omit<Bin, "id" | "batteryPct" | "airGapCm" | "lastPingAt">) => Bin;
  submitBin: (bin: Omit<Bin, "id" | "batteryPct" | "airGapCm" | "lastPingAt" | "approvalStatus"> & { submittedBy: string }) => Bin;
  approveBin: (binId: string) => void;
  rejectBin: (binId: string) => void;
  updateBinFill: (binId: string, fillPct: number) => void;
  refreshBinPing: (binId: string) => void;

  createRequest: (req: Omit<PickupRequest, "id" | "createdAt" | "status">) => PickupRequest;
  claimRequest: (requestId: string, collectorId: string) => void;
  completeRequest: (
    requestId: string,
    data: {
      observedFillPct: number;
      actualWastageType?: import("@/types").WastageType;
      driverComment?: string;
      photoRef?: string;
      pointsAwarded: number;
      mismatchFlag?: boolean;
      invalidFlag?: boolean;
    }
  ) => void;
  simulateRequestCompletion: (requestId: string, points: number) => void;

  redeemVoucher: (voucherId: string, citizenId: string) => void;
  addVoucher: (voucher: Omit<Voucher, "id">) => void;
  updateVoucher: (voucherId: string, updates: Partial<Voucher>) => void;
  deleteVoucher: (voucherId: string) => void;

  approveCollector: (collectorId: string) => void;
  rejectCollector: (collectorId: string) => void;
  suspendCollector: (collectorId: string) => void;
  reactivateCollector: (collectorId: string) => void;
  setCollectorStatus: (collectorId: string, status: Collector["status"]) => void;

  updateSettings: (settings: Partial<Settings>) => void;

  resetData: () => void;
}

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      bins: mockBins,
      requests: mockRequests,
      transactions: mockTransactions,
      vouchers: mockVouchers,
      collectors: mockCollectors,
      settings: mockSettings,

      addBin: (bin) => {
        const newBin: Bin = {
          ...bin,
          id: generateId("bin"),
          batteryPct: Math.floor(Math.random() * 30) + 70,
          airGapCm: Math.round((100 - bin.fillPct) * 0.8),
          lastPingAt: new Date().toISOString(),
          approvalStatus: "approved",
        };
        set((s) => ({ bins: [...s.bins, newBin] }));
        return newBin;
      },

      submitBin: (bin) => {
        const newBin: Bin = {
          ...bin,
          id: generateId("bin"),
          batteryPct: Math.floor(Math.random() * 30) + 70,
          airGapCm: Math.round((100 - bin.fillPct) * 0.8),
          lastPingAt: new Date().toISOString(),
          approvalStatus: "pending",
          submittedAt: new Date().toISOString(),
        };
        set((s) => ({ bins: [...s.bins, newBin] }));
        return newBin;
      },

      approveBin: (binId) => {
        set((s) => ({
          bins: s.bins.map((b) =>
            b.id === binId ? { ...b, approvalStatus: "approved" } : b
          ),
        }));
      },

      rejectBin: (binId) => {
        set((s) => ({
          bins: s.bins.map((b) =>
            b.id === binId ? { ...b, approvalStatus: "rejected" } : b
          ),
        }));
      },

      updateBinFill: (binId, fillPct) => {
        set((s) => ({
          bins: s.bins.map((b) =>
            b.id === binId
              ? {
                  ...b,
                  fillPct,
                  airGapCm: Math.round((100 - fillPct) * 0.8),
                  lastPingAt: new Date().toISOString(),
                }
              : b
          ),
        }));
      },

      refreshBinPing: (binId) => {
        set((s) => ({
          bins: s.bins.map((b) =>
            b.id === binId
              ? {
                  ...b,
                  lastPingAt: new Date().toISOString(),
                  batteryPct: Math.min(100, b.batteryPct + Math.floor(Math.random() * 3)),
                }
              : b
          ),
        }));
      },

      createRequest: (req) => {
        const newReq: PickupRequest = {
          ...req,
          id: generateId("req"),
          status: "pending",
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ requests: [newReq, ...s.requests] }));
        return newReq;
      },

      claimRequest: (requestId, collectorId) => {
        set((s) => ({
          requests: s.requests.map((r) =>
            r.id === requestId
              ? {
                  ...r,
                  status: "claimed",
                  collectorId,
                  claimedAt: new Date().toISOString(),
                }
              : r
          ),
        }));
      },

      completeRequest: (requestId, data) => {
        const req = get().requests.find((r) => r.id === requestId);
        if (!req) return;

        const collector = get().collectors.find((c) => c.id === req.collectorId);

        set((s) => ({
          requests: s.requests.map((r) =>
            r.id === requestId
              ? {
                  ...r,
                  status: "collected",
                  collectedAt: new Date().toISOString(),
                  observedFillPct: data.observedFillPct,
                  actualWastageType: data.actualWastageType,
                  driverComment: data.driverComment,
                  photoRef: data.photoRef,
                  pointsAwarded: data.pointsAwarded,
                  mismatchFlag: data.mismatchFlag,
                  invalidFlag: data.invalidFlag,
                }
              : r
          ),
          transactions: [
            {
              id: generateId("txn"),
              citizenId: req.citizenId,
              requestId: req.id,
              date: new Date().toISOString(),
              wastageType: data.actualWastageType || req.wastageType,
              fillPct: data.observedFillPct,
              points: data.pointsAwarded,
              collectorName: collector?.name || "Unknown",
            },
            ...s.transactions,
          ],
          collectors: s.collectors.map((c) =>
            c.id === req.collectorId
              ? {
                  ...c,
                  totalJobs: c.totalJobs + 1,
                  penaltyCount: c.penaltyCount + (data.invalidFlag ? 1 : 0),
                }
              : c
          ),
        }));
      },

      simulateRequestCompletion: (requestId, points) => {
        const req = get().requests.find((r) => r.id === requestId);
        if (!req) return;

        const collector = get().collectors.find((c) => c.id === req.collectorId);
        const bin = get().bins.find((b) => b.id === req.binId);

        set((s) => ({
          requests: s.requests.map((r) =>
            r.id === requestId
              ? {
                  ...r,
                  status: "collected",
                  collectedAt: new Date().toISOString(),
                  observedFillPct: bin?.fillPct || 80,
                  pointsAwarded: points,
                }
              : r
          ),
          transactions: [
            {
              id: generateId("txn"),
              citizenId: req.citizenId,
              requestId: req.id,
              date: new Date().toISOString(),
              wastageType: req.wastageType,
              fillPct: bin?.fillPct || 80,
              points,
              collectorName: collector?.name || "Auto-Simulated",
            },
            ...s.transactions,
          ],
          bins: s.bins.map((b) =>
            b.id === req.binId
              ? { ...b, fillPct: Math.max(0, b.fillPct - 70) }
              : b
          ),
        }));
      },

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      redeemVoucher: (voucherId, _citizenId) => {
        set((s) => ({
          vouchers: s.vouchers.map((v) =>
            v.id === voucherId ? { ...v, stock: Math.max(0, v.stock - 1) } : v
          ),
        }));
      },

      addVoucher: (voucher) => {
        const newVoucher: Voucher = { ...voucher, id: generateId("vou") };
        set((s) => ({ vouchers: [...s.vouchers, newVoucher] }));
      },

      updateVoucher: (voucherId, updates) => {
        set((s) => ({
          vouchers: s.vouchers.map((v) => (v.id === voucherId ? { ...v, ...updates } : v)),
        }));
      },

      deleteVoucher: (voucherId) => {
        set((s) => ({ vouchers: s.vouchers.filter((v) => v.id !== voucherId) }));
      },

      approveCollector: (collectorId) => {
        set((s) => ({
          collectors: s.collectors.map((c) =>
            c.id === collectorId ? { ...c, status: "approved" } : c
          ),
        }));
      },

      rejectCollector: (collectorId) => {
        set((s) => ({
          collectors: s.collectors.filter((c) => c.id !== collectorId),
        }));
      },

      suspendCollector: (collectorId) => {
        set((s) => ({
          collectors: s.collectors.map((c) =>
            c.id === collectorId ? { ...c, status: "suspended" } : c
          ),
        }));
      },

      reactivateCollector: (collectorId) => {
        set((s) => ({
          collectors: s.collectors.map((c) =>
            c.id === collectorId ? { ...c, status: "approved" } : c
          ),
        }));
      },

      setCollectorStatus: (collectorId, status) => {
        set((s) => ({
          collectors: s.collectors.map((c) =>
            c.id === collectorId ? { ...c, status } : c
          ),
        }));
      },

      updateSettings: (updates) => {
        set((s) => ({ settings: { ...s.settings, ...updates } }));
      },

      resetData: () => {
        set({
          bins: mockBins,
          requests: mockRequests,
          transactions: mockTransactions,
          vouchers: mockVouchers,
          collectors: mockCollectors,
          settings: mockSettings,
        });
      },
    }),
    {
      name: STORAGE_KEYS.DATA,
      merge: (persisted, current) => {
        const p = persisted as Partial<DataState>;
        const merged = { ...current, ...p };
        // Ensure all bins have a wasteType (migration for older persisted data)
        if (merged.bins) {
          merged.bins = merged.bins.map((b) => ({
            ...b,
            wasteType: b.wasteType || "Plastic",
            approvalStatus: b.approvalStatus || "approved",
          }));
        }
        return merged;
      },
    }
  )
);
