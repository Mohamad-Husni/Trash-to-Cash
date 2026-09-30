"use client";

import { useDataStore } from "@/lib/store/data-store";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { toast } from "sonner";
import type { Bin, PickupRequest, WastageType } from "@/types";

export function useCreateRequest() {
  const createRequest = useDataStore((s) => s.createRequest);
  const qc = useQueryClient();

  return (input: {
    citizenId: string;
    binId: string;
    wastageType: WastageType;
    preferredSlot: string;
  }): PickupRequest => {
    const req = createRequest(input);
    qc.invalidateQueries({ queryKey: queryKeys.requests() });
    toast.success("Pickup request created!");
    return req;
  };
}

export function useClaimJob() {
  const claimRequest = useDataStore((s) => s.claimRequest);
  const qc = useQueryClient();

  return (requestId: string, collectorId: string) => {
    claimRequest(requestId, collectorId);
    qc.invalidateQueries({ queryKey: queryKeys.requests() });
    toast.success("Job claimed successfully!");
  };
}

export function useCompleteJob() {
  const completeRequest = useDataStore((s) => s.completeRequest);
  const qc = useQueryClient();

  return (
    requestId: string,
    data: {
      observedFillPct: number;
      actualWastageType?: WastageType;
      driverComment?: string;
      photoRef?: string;
      pointsAwarded: number;
      mismatchFlag?: boolean;
      invalidFlag?: boolean;
    }
  ) => {
    completeRequest(requestId, data);
    qc.invalidateQueries({ queryKey: queryKeys.requests() });
    qc.invalidateQueries({ queryKey: queryKeys.transactions() });
    qc.invalidateQueries({ queryKey: queryKeys.collectors() });
    toast.success("Pickup completed! Points awarded.");
  };
}

export function useSimulateCompletion() {
  const simulateRequestCompletion = useDataStore((s) => s.simulateRequestCompletion);
  const qc = useQueryClient();

  return (requestId: string, points: number) => {
    simulateRequestCompletion(requestId, points);
    qc.invalidateQueries({ queryKey: queryKeys.requests() });
    qc.invalidateQueries({ queryKey: queryKeys.transactions() });
    qc.invalidateQueries({ queryKey: queryKeys.bins() });
    toast.success(`Pickup simulated! +${points} points awarded.`);
  };
}

export function useRedeemVoucher() {
  const redeemVoucher = useDataStore((s) => s.redeemVoucher);
  const qc = useQueryClient();

  return (voucherId: string, citizenId: string) => {
    redeemVoucher(voucherId, citizenId);
    qc.invalidateQueries({ queryKey: queryKeys.vouchers() });
    toast.success("Voucher redeemed! QR code generated.");
  };
}

export function useAddBin() {
  const addBin = useDataStore((s) => s.addBin);
  const qc = useQueryClient();

  return (bin: Omit<Bin, "id" | "batteryPct" | "airGapCm" | "lastPingAt">): Bin => {
    const newBin = addBin(bin);
    qc.invalidateQueries({ queryKey: queryKeys.bins() });
    toast.success("Smart bin registered successfully!");
    return newBin;
  };
}

export function useSubmitBin() {
  const submitBin = useDataStore((s) => s.submitBin);
  const qc = useQueryClient();

  return (
    bin: Omit<Bin, "id" | "batteryPct" | "airGapCm" | "lastPingAt" | "approvalStatus"> & { submittedBy: string }
  ): Bin => {
    const newBin = submitBin(bin);
    qc.invalidateQueries({ queryKey: queryKeys.bins() });
    toast.success("Bin registration submitted! Awaiting admin approval.");
    return newBin;
  };
}

export function useApproveBin() {
  const approveBin = useDataStore((s) => s.approveBin);
  const qc = useQueryClient();

  return (binId: string) => {
    approveBin(binId);
    qc.invalidateQueries({ queryKey: queryKeys.bins() });
    toast.success("Bin approved and now visible on maps.");
  };
}

export function useRejectBin() {
  const rejectBin = useDataStore((s) => s.rejectBin);
  const qc = useQueryClient();

  return (binId: string) => {
    rejectBin(binId);
    qc.invalidateQueries({ queryKey: queryKeys.bins() });
    toast.success("Bin registration rejected.");
  };
}

export function useUpdateBinFill() {
  const updateBinFill = useDataStore((s) => s.updateBinFill);
  const qc = useQueryClient();

  return (binId: string, fillPct: number) => {
    updateBinFill(binId, fillPct);
    qc.invalidateQueries({ queryKey: queryKeys.bins() });
  };
}

export function useRefreshBinPing() {
  const refreshBinPing = useDataStore((s) => s.refreshBinPing);
  const qc = useQueryClient();

  return (binId: string) => {
    refreshBinPing(binId);
    qc.invalidateQueries({ queryKey: queryKeys.bins() });
    toast.success("Sensor ping refreshed.");
  };
}

export function useApproveCollector() {
  const approveCollector = useDataStore((s) => s.approveCollector);
  const qc = useQueryClient();

  return (collectorId: string) => {
    approveCollector(collectorId);
    qc.invalidateQueries({ queryKey: queryKeys.collectors() });
    toast.success("Collector approved.");
  };
}

export function useRejectCollector() {
  const rejectCollector = useDataStore((s) => s.rejectCollector);
  const qc = useQueryClient();

  return (collectorId: string) => {
    rejectCollector(collectorId);
    qc.invalidateQueries({ queryKey: queryKeys.collectors() });
    toast.success("Collector application rejected.");
  };
}

export function useSuspendCollector() {
  const suspendCollector = useDataStore((s) => s.suspendCollector);
  const qc = useQueryClient();

  return (collectorId: string) => {
    suspendCollector(collectorId);
    qc.invalidateQueries({ queryKey: queryKeys.collectors() });
    toast.success("Collector suspended.");
  };
}

export function useReactivateCollector() {
  const reactivateCollector = useDataStore((s) => s.reactivateCollector);
  const qc = useQueryClient();

  return (collectorId: string) => {
    reactivateCollector(collectorId);
    qc.invalidateQueries({ queryKey: queryKeys.collectors() });
    toast.success("Collector reactivated.");
  };
}

export function useUpdateSettings() {
  const updateSettings = useDataStore((s) => s.updateSettings);
  const qc = useQueryClient();

  return (settings: Partial<import("@/types").Settings>) => {
    updateSettings(settings);
    qc.invalidateQueries({ queryKey: queryKeys.settings() });
    toast.success("Settings updated.");
  };
}

export function useAddVoucher() {
  const addVoucher = useDataStore((s) => s.addVoucher);
  const qc = useQueryClient();

  return (voucher: Omit<import("@/types").Voucher, "id">) => {
    addVoucher(voucher);
    qc.invalidateQueries({ queryKey: queryKeys.vouchers() });
    toast.success("Voucher added.");
  };
}

export function useUpdateVoucher() {
  const updateVoucher = useDataStore((s) => s.updateVoucher);
  const qc = useQueryClient();

  return (voucherId: string, updates: Partial<import("@/types").Voucher>) => {
    updateVoucher(voucherId, updates);
    qc.invalidateQueries({ queryKey: queryKeys.vouchers() });
    toast.success("Voucher updated.");
  };
}

export function useDeleteVoucher() {
  const deleteVoucher = useDataStore((s) => s.deleteVoucher);
  const qc = useQueryClient();

  return (voucherId: string) => {
    deleteVoucher(voucherId);
    qc.invalidateQueries({ queryKey: queryKeys.vouchers() });
    toast.success("Voucher deleted.");
  };
}
