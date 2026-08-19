import { describe, expect, it } from "vitest";
import { formatDay, formatHourRange, formatTime, groupHours, telHref } from "./format";
import type { HoursEntry } from "./site-config-schema";

describe("formatTime", () => {
  it("renders midnight and noon as 12", () => {
    expect(formatTime("00:00")).toBe("12:00 AM");
    expect(formatTime("12:00")).toBe("12:00 PM");
  });

  it("renders morning and evening times", () => {
    expect(formatTime("09:05")).toBe("9:05 AM");
    expect(formatTime("23:30")).toBe("11:30 PM");
  });
});

describe("formatHourRange", () => {
  it("joins open and close", () => {
    expect(formatHourRange({ open: "07:30", close: "18:00" })).toBe("7:30 AM – 6:00 PM");
  });
});

describe("formatDay", () => {
  it("supports long and short labels", () => {
    expect(formatDay("wednesday")).toBe("Wednesday");
    expect(formatDay("wednesday", true)).toBe("Wed");
  });
});

describe("groupHours", () => {
  it("returns nothing for an empty list", () => {
    expect(groupHours([])).toEqual([]);
  });

  it("labels a lone day with its full name", () => {
    const hours: HoursEntry[] = [{ day: "sunday", open: "10:00", close: "14:00" }];
    expect(groupHours(hours)).toEqual([
      { days: ["sunday"], label: "Sunday", open: "10:00", close: "14:00" },
    ]);
  });

  it("collapses consecutive days that share hours", () => {
    const hours: HoursEntry[] = [
      { day: "monday", open: "09:00", close: "17:00" },
      { day: "tuesday", open: "09:00", close: "17:00" },
      { day: "wednesday", open: "09:00", close: "17:00" },
    ];
    const groups = groupHours(hours);
    expect(groups).toHaveLength(1);
    expect(groups[0].label).toBe("Mon – Wed");
  });

  it("breaks a run when the hours change", () => {
    const hours: HoursEntry[] = [
      { day: "monday", open: "09:00", close: "17:00" },
      { day: "tuesday", open: "09:00", close: "17:00" },
      { day: "wednesday", open: "09:00", close: "20:00" },
    ];
    expect(groupHours(hours).map((group) => group.label)).toEqual(["Mon – Tue", "Wednesday"]);
  });

  it("breaks a run across a closed day", () => {
    const hours: HoursEntry[] = [
      { day: "monday", open: "09:00", close: "17:00" },
      { day: "wednesday", open: "09:00", close: "17:00" },
    ];
    expect(groupHours(hours).map((group) => group.label)).toEqual(["Monday", "Wednesday"]);
  });

  it("orders by the week regardless of config order", () => {
    const hours: HoursEntry[] = [
      { day: "friday", open: "09:00", close: "17:00" },
      { day: "monday", open: "09:00", close: "17:00" },
    ];
    expect(groupHours(hours).map((group) => group.days[0])).toEqual(["monday", "friday"]);
  });

  it("keeps the full week as a single group", () => {
    const hours: HoursEntry[] = (
      ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const
    ).map((day) => ({ day, open: "08:00", close: "20:00" }));
    expect(groupHours(hours)).toHaveLength(1);
    expect(groupHours(hours)[0].label).toBe("Mon – Sun");
  });
});

describe("telHref", () => {
  it("strips formatting", () => {
    expect(telHref("(555) 214-9080")).toBe("tel:5552149080");
  });

  it("keeps a leading country code", () => {
    expect(telHref("+1 (555) 214-9080")).toBe("tel:+15552149080");
  });
});
