export type Role = "citizen" | "collector" | "admin";

export type Tier = "Bronze" | "Silver" | "Gold" | "Platinum";

export type WastageType =
  | "Plastic"
  | "Paper"
  | "Glass"
  | "Metal"
  | "Food Waste"
  | "Iron"
  | "Cardboard"
  | "Electronic";

export type BinSize = 20 | 100 | 240;

export type RequestStatus = "pending" | "claimed" | "collected" | "rejected";

export type CollectorStatus = "pending" | "approved" | "suspended";

export type VoucherCategory = "Mobile Data" | "Supermarket" | "Utility";

export type BinApprovalStatus = "approved" | "pending" | "rejected";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl: string;
  tier?: Tier;
}

export interface Bin {
  id: string;
  deviceId: string;
  label: string;
  lat: number;
  lng: number;
  address: string;
  sizeL: BinSize;
  fillPct: number;
  batteryPct: number;
  airGapCm: number;
  lastPingAt: string;
  isPublic: boolean;
  region: string;
  wasteType: WastageType;
  citizenId?: string;
  approvalStatus?: BinApprovalStatus;
  submittedBy?: string;
  submittedAt?: string;
}

export interface PickupRequest {
  id: string;
  citizenId: string;
  binId: string;
  wastageType: WastageType;
  preferredSlot: string;
  status: RequestStatus;
  collectorId?: string;
  createdAt: string;
  claimedAt?: string;
  collectedAt?: string;
  observedFillPct?: number;
  actualWastageType?: WastageType;
  driverComment?: string;
  photoRef?: string;
  pointsAwarded?: number;
  mismatchFlag?: boolean;
  invalidFlag?: boolean;
}

export interface Transaction {
  id: string;
  citizenId: string;
  requestId: string;
  date: string;
  wastageType: WastageType;
  fillPct: number;
  points: number;
  collectorName: string;
}

export interface Voucher {
  id: string;
  name: string;
  category: VoucherCategory;
  costPoints: number;
  stock: number;
  qrPayload: string;
}

export interface Collector {
  id: string;
  userId: string;
  name: string;
  email: string;
  status: CollectorStatus;
  totalJobs: number;
  penaltyCount: number;
  joinedAt: string;
  avatarUrl: string;
  lat: number;
  lng: number;
}

export interface Settings {
  basePointCaps: Record<BinSize, number>;
  multipliers: Record<WastageType, number>;
}

export interface PointCalcResult {
  points: number;
  capped: boolean;
  raw: number;
}
