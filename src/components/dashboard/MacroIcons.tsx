import { Beef, Droplets, Flame, Wheat } from "lucide-react";

export const macroIconMap = {
  calories: { Icon: Flame, color: "text-rose-500" },
  protein: { Icon: Beef, color: "text-emerald-600" },
  carbs: { Icon: Wheat, color: "text-amber-500" },
  fat: { Icon: Droplets, color: "text-pink-500" },
} as const;
