import { subDays, startOfDay } from "date-fns";
import type { DateRange } from "react-day-picker";

/**
 * Helper function to create common date range presets
 * This function is server-safe and can be used in both client and server components
 */
export function createDateRangePresets(): Array<{
  label: string;
  dateRange: DateRange;
}> {
  const now = new Date();
  const today = startOfDay(now);

  return [
    {
      label: "Today",
      dateRange: {
        from: today,
        to: today,
      },
    },
    {
      label: "Last 7 days",
      dateRange: {
        from: subDays(today, 6),
        to: today,
      },
    },
    {
      label: "Last 14 days",
      dateRange: {
        from: subDays(today, 13),
        to: today,
      },
    },
    {
      label: "Last 30 days",
      dateRange: {
        from: subDays(today, 29),
        to: today,
      },
    },
    {
      label: "Last 90 days",
      dateRange: {
        from: subDays(today, 89),
        to: today,
      },
    },
    {
      label: "This month",
      dateRange: {
        from: new Date(now.getFullYear(), now.getMonth(), 1),
        to: today,
      },
    },
    {
      label: "Last month",
      dateRange: {
        from: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        to: new Date(now.getFullYear(), now.getMonth(), 0),
      },
    },
  ];
}

/**
 * Create a custom date range preset
 */
export function createDateRangePreset(
  label: string,
  from: Date,
  to: Date,
): { label: string; dateRange: DateRange } {
  return {
    label,
    dateRange: { from, to },
  };
}

/**
 * Get a date range for the last N days
 */
export function getLastNDays(days: number): DateRange {
  const today = startOfDay(new Date());
  return {
    from: subDays(today, days - 1),
    to: today,
  };
}

/**
 * Get a date range for the current month
 */
export function getCurrentMonth(): DateRange {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return {
    from: new Date(now.getFullYear(), now.getMonth(), 1),
    to: today,
  };
}

/**
 * Get a date range for the previous month
 */
export function getPreviousMonth(): DateRange {
  const now = new Date();
  return {
    from: new Date(now.getFullYear(), now.getMonth() - 1, 1),
    to: new Date(now.getFullYear(), now.getMonth(), 0),
  };
}
