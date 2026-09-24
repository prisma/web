/**
 * The docs IA: how top-level sections are grouped in the sidebar's landing
 * view. Grouping is nav-only — it does not affect URLs or the content tree.
 * Entries are matched against the page tree's `root: true` sections by their
 * index URL (see `getSidebarTabs`); titles and icons come from the tree, so a
 * section renamed in its meta.json needs no change here. An entry with no
 * matching section is skipped with a dev-time warning.
 */
import type { ReactNode } from "react";

export interface SidebarSectionGroup {
  /** Group heading rendered above the sections; null renders no heading. */
  heading: string | null;
  /**
   * Section index URLs, in display order. An entry with a `title` is a plain
   * page link rather than a `root: true` section; it renders with that title
   * and skips the tree lookup.
   */
  sections: { url: string; title?: string; icon?: ReactNode }[];
}

export const sidebarSectionGroups: SidebarSectionGroup[] = [
  {
    heading: "Start",
    sections: [
      { url: "/" },
      { url: "/prisma-compute/deploy", title: "Deploy your first app" },
      { url: "/full-stack-tutorial", title: "Deploy the full Prisma stack" },
    ],
  },
  {
    heading: "Build",
    sections: [{ url: "/orm" }, { url: "/composer" }, { url: "/local-development" }],
  },
  {
    heading: "Deploy",
    sections: [{ url: "/compute" }, { url: "/postgres" }, { url: "/storage" }],
  },
  {
    heading: "Manage",
    sections: [{ url: "/console" }, { url: "/studio" }, { url: "/query-insights" }],
  },
  {
    heading: "Reference",
    sections: [
      { url: "/guides" },
      { url: "/cli" },
      { url: "/rest-api" },
      { url: "/ai" },
      { url: "/accelerate" },
    ],
  },
];

/** Flat list of every section URL in the grouped hierarchy. */
export const sidebarSectionUrls: string[] = sidebarSectionGroups.flatMap((group) =>
  group.sections.map((section) => section.url),
);
