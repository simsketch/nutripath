// Display in imperial (lbs, ft/in) but persist in metric (kg, cm).
// BMR formula uses metric directly so we never round-trip the storage value.

export const KG_PER_LB = 0.45359237;
export const CM_PER_INCH = 2.54;

export function lbsToKg(lbs: number): number {
  return lbs * KG_PER_LB;
}

export function kgToLbs(kg: number): number {
  return kg / KG_PER_LB;
}

export function feetInchesToCm(feet: number, inches: number): number {
  return (feet * 12 + inches) * CM_PER_INCH;
}

export function cmToFeetInches(cm: number): { feet: number; inches: number } {
  const totalInches = cm / CM_PER_INCH;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches - feet * 12);
  // Handle rounding edge case (e.g. 11.6" rounding to 12")
  if (inches === 12) return { feet: feet + 1, inches: 0 };
  return { feet, inches };
}
