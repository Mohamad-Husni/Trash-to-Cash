import type { Voucher } from "@/types";

export const mockVouchers: Voucher[] = [
  {
    id: "vou_001",
    name: "Dialog 1GB Data Pass",
    category: "Mobile Data",
    costPoints: 100,
    stock: 50,
    qrPayload: "T2C:VOUCHER:DIALOG1GB:001",
  },
  {
    id: "vou_002",
    name: "Mobitel 2GB Night Bundle",
    category: "Mobile Data",
    costPoints: 150,
    stock: 30,
    qrPayload: "T2C:VOUCHER:MOBITEL2GB:002",
  },
  {
    id: "vou_003",
    name: "Keells Super Rs.200 Off",
    category: "Supermarket",
    costPoints: 250,
    stock: 20,
    qrPayload: "T2C:VOUCHER:KEELLS200:003",
  },
  {
    id: "vou_004",
    name: "Cargills Food City Rs.500",
    category: "Supermarket",
    costPoints: 500,
    stock: 15,
    qrPayload: "T2C:VOUCHER:CARGILLS500:004",
  },
  {
    id: "vou_005",
    name: "CEB Electricity Rs.300 Credit",
    category: "Utility",
    costPoints: 400,
    stock: 25,
    qrPayload: "T2C:VOUCHER:CEB300:005",
  },
  {
    id: "vou_006",
    name: "Water Board Rs.250 Credit",
    category: "Utility",
    costPoints: 350,
    stock: 18,
    qrPayload: "T2C:VOUCHER:WATER250:006",
  },
];
