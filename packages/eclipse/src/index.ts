/**
 * Eclipse Design System
 *
 * A comprehensive design system built with Tailwind CSS
 */

// Export all components
export * from "./components";

// Export design tokens
export * from "./tokens";

// Export utilities
export { cn } from "./lib/cn";

// Export date helpers (server-safe)
export {
  createDateRangePresets,
  createDateRangePreset,
  getLastNDays,
  getCurrentMonth,
  getPreviousMonth,
} from "./lib/date-presets";
