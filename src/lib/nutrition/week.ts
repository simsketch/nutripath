import {
  addWeeks,
  endOfISOWeek,
  format,
  getISOWeek,
  getISOWeekYear,
  startOfISOWeek,
} from "date-fns";

export type WeekRef = { year: number; weekNumber: number };

export function currentWeek(now: Date = new Date()): WeekRef {
  return { year: getISOWeekYear(now), weekNumber: getISOWeek(now) };
}

export function weekRange(ref: WeekRef): { start: Date; end: Date } {
  // Reconstruct a date in the target ISO week, then take its start/end.
  // We use the Thursday of week 1 trick: ISO week 1 is the one containing Jan 4.
  const jan4 = new Date(Date.UTC(ref.year, 0, 4));
  const week1Start = startOfISOWeek(jan4);
  const target = addWeeks(week1Start, ref.weekNumber - 1);
  return { start: startOfISOWeek(target), end: endOfISOWeek(target) };
}

export function formatWeekLabel(ref: WeekRef): string {
  const { start, end } = weekRange(ref);
  const sameMonth = start.getMonth() === end.getMonth();
  if (sameMonth) {
    return `${format(start, "MMM d")} – ${format(end, "d, yyyy")}`;
  }
  return `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`;
}

export function shiftWeek(ref: WeekRef, delta: number): WeekRef {
  const { start } = weekRange(ref);
  const shifted = addWeeks(start, delta);
  return { year: getISOWeekYear(shifted), weekNumber: getISOWeek(shifted) };
}

export function todayDay():
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday" {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ] as const;
  return days[new Date().getDay()];
}
