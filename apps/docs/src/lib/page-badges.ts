import { source } from "./source";
import type { BadgeType } from "./badge-types";

export type { BadgeType };

// Create a map of page URLs to their badge values
export function getPageBadges(): Map<string, BadgeType> {
  const badges = new Map<string, BadgeType>();

  const pages = source.getPages();

  for (const page of pages) {
    const badge = page.data.badge as BadgeType | undefined;
    if (badge) {
      badges.set(page.url, badge);
    }
  }

  return badges;
}
