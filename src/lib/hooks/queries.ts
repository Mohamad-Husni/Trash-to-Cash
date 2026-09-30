"use client";

import { useQuery } from "@tanstack/react-query";
import { useDataStore } from "@/lib/store/data-store";
import { queryKeys } from "@/lib/query/keys";

export function useBins() {
  const bins = useDataStore((s) => s.bins);
  return useQuery({
    queryKey: queryKeys.bins(),
    queryFn: () => bins,
    initialData: bins,
  });
}

export function useBin(id: string) {
  const bins = useDataStore((s) => s.bins);
  return useQuery({
    queryKey: queryKeys.bin(id),
    queryFn: () => bins.find((b) => b.id === id),
    initialData: bins.find((b) => b.id === id),
  });
}

export function useRequests() {
  const requests = useDataStore((s) => s.requests);
  return useQuery({
    queryKey: queryKeys.requests(),
    queryFn: () => requests,
    initialData: requests,
  });
}

export function useRequest(id: string) {
  const requests = useDataStore((s) => s.requests);
  return useQuery({
    queryKey: queryKeys.request(id),
    queryFn: () => requests.find((r) => r.id === id),
    initialData: requests.find((r) => r.id === id),
  });
}

export function useTransactions() {
  const transactions = useDataStore((s) => s.transactions);
  return useQuery({
    queryKey: queryKeys.transactions(),
    queryFn: () => transactions,
    initialData: transactions,
  });
}

export function useCitizenTransactions(citizenId: string) {
  const transactions = useDataStore((s) => s.transactions);
  return useQuery({
    queryKey: queryKeys.citizenTransactions(citizenId),
    queryFn: () => transactions.filter((t) => t.citizenId === citizenId),
    initialData: transactions.filter((t) => t.citizenId === citizenId),
  });
}

export function useVouchers() {
  const vouchers = useDataStore((s) => s.vouchers);
  return useQuery({
    queryKey: queryKeys.vouchers(),
    queryFn: () => vouchers,
    initialData: vouchers,
  });
}

export function useCollectors() {
  const collectors = useDataStore((s) => s.collectors);
  return useQuery({
    queryKey: queryKeys.collectors(),
    queryFn: () => collectors,
    initialData: collectors,
  });
}

export function useSettings() {
  const settings = useDataStore((s) => s.settings);
  return useQuery({
    queryKey: queryKeys.settings(),
    queryFn: () => settings,
    initialData: settings,
  });
}
