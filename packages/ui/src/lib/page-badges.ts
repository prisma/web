export type BadgeType = "early-access" | "deprecated" | "preview";

// Create a map of page URLs to their badge values
export function getPageBadges(source: {
  getPages(): { url: string; data: { badge?: string } }[];
}): Map<string, BadgeType> {
  const badges = new Map<string, BadgeType>();

  // Get all pages from the source
  const pages = source.getPages();

  for (const page of pages) {
    const badge = page.data.badge as BadgeType | undefined;
    if (badge === "early-access" || badge === "deprecated" || badge === "preview") {
      badges.set(page.url, badge);
    }
  }

  return badges;
}
