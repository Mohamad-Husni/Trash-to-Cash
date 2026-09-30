import type { Settings } from "@/types";

export const mockSettings: Settings = {
  basePointCaps: {
    20: 50,
    100: 120,
    240: 200,
  },
  multipliers: {
    Plastic: 1.0,
    Glass: 1.2,
    Metal: 1.5,
    Paper: 0.8,
    "Food Waste": 0.5,
    Iron: 1.8,
    Cardboard: 0.9,
    Electronic: 2.5,
  },
};
