/**
 * The docs IA: how top-level sections are grouped in the sidebar's landing
 * view. Grouping is nav-only — it does not affect URLs or the content tree.
 * Entries are matched against the page tree's `root: true` sections by their
 * index URL (see `getSidebarTabs`); titles and icons come from the tree, so a
 * section renamed in its meta.json needs no change here. An entry with no
 * matching section is skipped with a dev-time warning.
 */
export interface SidebarSectionGroup {
  /** Group heading rendered above the sections; null renders no heading. */
  heading: string | null;
  /**
   * Section index URLs, in display order. An entry with a `title` is a plain
   * page link rather than a `root: true` section; it renders with that title
   * and skips the tree lookup.
   */
  sections: { url: string; title?: string }[];
}

export const sidebarSectionGroups: SidebarSectionGroup[] = [
  {
    heading: "Start",
    sections: [{ url: "/" }, { url: "/prisma-compute/deploy", title: "Build your first app" }],
  },
  {
    heading: "Build",
    sections: [{ url: "/orm" }, { url: "/composer" }, { url: "/ai" }],
  },
  {
    heading: "Deploy",
    sections: [{ url: "/compute" }, { url: "/postgres" }],
  },
  {
    heading: "Manage",
    sections: [{ url: "/studio" }, { url: "/query-insights" }, { url: "/console" }],
  },
  {
    heading: "Reference",
    sections: [{ url: "/guides" }, { url: "/cli" }, { url: "/rest-api" }, { url: "/accelerate" }],
  },
];

/** Flat list of every section URL in the grouped hierarchy. */
export const sidebarSectionUrls: string[] = sidebarSectionGroups.flatMap((group) =>
  group.sections.map((section) => section.url),
);
