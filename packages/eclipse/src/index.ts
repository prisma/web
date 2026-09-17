/**
 * Eclipse Design System
 *
 * A comprehensive design system built with Tailwind CSS
 */

// Export all components
export * from "./components";

// Export design tokens
export * from "./tokens";

// Export the tab-value normaliser so consumers of Tabs / CodeBlockTabs can
// compare what `onValueChange` hands them against their own labels.
export { escapeTabValue } from "./lib/tab-value";
