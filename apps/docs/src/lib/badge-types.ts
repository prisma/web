// Single source of truth for documentation page badge values.
// Keep this list in sync in one place: the frontmatter zod enum
// (source.config.ts), the badge map (page-badges.ts), and the sidebar
// renderer (sidebar-badge-provider.tsx) all derive from it.
export const BADGE_TYPES = ["early-access", "beta", "deprecated", "preview"] as const;

export type BadgeType = (typeof BADGE_TYPES)[number];
