import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const WORKING_HOUR_FIELDS = [
  { key: "mondayHours", short: "Mon", label: "Monday" },
  { key: "tuesdayHours", short: "Tue", label: "Tuesday" },
  { key: "wednesdayHours", short: "Wed", label: "Wednesday" },
  { key: "thursdayHours", short: "Thu", label: "Thursday" },
  { key: "fridayHours", short: "Fri", label: "Friday" },
  { key: "saturdayHours", short: "Sat", label: "Saturday" },
  { key: "sundayHours", short: "Sun", label: "Sunday" },
] as const;

export type WorkingHourField = (typeof WORKING_HOUR_FIELDS)[number]["key"];

type WorkingHoursSettings = Record<WorkingHourField, string>;

export function getGroupedWorkingHours(settings: WorkingHoursSettings) {
  const source = WORKING_HOUR_FIELDS.map((field) => ({
    short: field.short,
    hours: settings[field.key],
  }));

  if (source.length === 0) {
    return [];
  }

  const groups: { days: string; hours: string }[] = [];
  let startIndex = 0;

  const finalizeGroup = (endIndex: number) => {
    const startDay = source[startIndex];
    const endDay = source[endIndex];
    const days =
      startIndex === endIndex
        ? startDay.short
        : `${startDay.short} - ${endDay.short}`;

    groups.push({
      days,
      hours: startDay.hours,
    });
  };

  for (let i = 1; i < source.length; i += 1) {
    if (source[i].hours !== source[i - 1].hours) {
      finalizeGroup(i - 1);
      startIndex = i;
    }
  }

  finalizeGroup(source.length - 1);
  return groups;
}
