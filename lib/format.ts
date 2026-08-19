import type { DayOfWeek, HoursEntry } from "./site-config-schema";

export const DAY_ORDER: readonly DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

const SHORT_DAY_LABELS: Record<DayOfWeek, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

export function formatDay(day: DayOfWeek, short = false): string {
  return short ? SHORT_DAY_LABELS[day] : DAY_LABELS[day];
}

/** "09:00" -> "9:00 AM". Input is already schema-validated as 24-hour time. */
export function formatTime(value: string): string {
  const [hourPart, minutePart] = value.split(":");
  const hour = Number(hourPart);
  const suffix = hour < 12 ? "AM" : "PM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minutePart} ${suffix}`;
}

export function formatHourRange(entry: Pick<HoursEntry, "open" | "close">): string {
  return `${formatTime(entry.open)} – ${formatTime(entry.close)}`;
}

export type GroupedHours = {
  /** Consecutive days sharing the same open and close time. */
  days: DayOfWeek[];
  label: string;
  open: string;
  close: string;
};

/**
 * Collapses consecutive days with identical hours into one row, so a config
 * listing seven days renders as "Mon – Fri" rather than five near-identical
 * lines. Days absent from the config are treated as closed and break a run.
 */
export function groupHours(hours: readonly HoursEntry[]): GroupedHours[] {
  const byDay = new Map<DayOfWeek, HoursEntry>();
  for (const entry of hours) byDay.set(entry.day, entry);

  const groups: GroupedHours[] = [];
  let current: GroupedHours | null = null;

  for (const day of DAY_ORDER) {
    const entry = byDay.get(day);
    if (!entry) {
      current = null;
      continue;
    }

    if (current && current.open === entry.open && current.close === entry.close) {
      current.days.push(day);
    } else {
      current = { days: [day], label: "", open: entry.open, close: entry.close };
      groups.push(current);
    }
  }

  for (const group of groups) {
    const first = group.days[0];
    const last = group.days[group.days.length - 1];
    group.label =
      group.days.length === 1
        ? formatDay(first)
        : `${formatDay(first, true)} – ${formatDay(last, true)}`;
  }

  return groups;
}

/** Strips formatting so `tel:` links dial correctly, keeping a leading `+`. */
export function telHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  return `tel:${digits.startsWith("+") ? `+${digits.slice(1).replace(/\+/g, "")}` : digits}`;
}

export function mapSearchHref(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function mapEmbedSrc(query: string): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}
