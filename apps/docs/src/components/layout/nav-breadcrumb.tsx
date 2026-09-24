"use client";
import Link from "fumadocs-core/link";
import { usePathname } from "fumadocs-core/framework";
import { getVersionedNavPathname } from "../../lib/version";
import { useCurrentSection } from "./use-current-section";
import { useSidebarView } from "./notebook/sidebar-nav";

/**
 * The trailing segment of the navbar's `Prisma / docs` lockup: the top-level
 * section the reader is currently inside, e.g. `Prisma / docs / Composer`.
 *
 * Renders nothing on pages outside every configured section, such as 404.
 *
 * The section comes from the URL everywhere except the docs root, which is both
 * the docs home and the Getting Started index page. There the crumb follows the
 * sidebar instead: nothing while it shows the grouped "All docs" list, and
 * "Getting Started" once the reader has drilled into that section.
 *
 * Shown at every width — the Prisma lockup drops out below `lg` rather than
 * this segment. `truncate` is the last resort only: on a phone the longest
 * section names ("Local Development") cannot fit beside the Ask AI and sidebar
 * controls, and clipping the name beats pushing those controls off-screen.
 */
export function NavBreadcrumb() {
  const pathname = usePathname();
  const section = useCurrentSection();
  const { view } = useSidebarView();

  if (!section) return null;
  if (pathname === "/" && view === "top") return null;

  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <span className="text-fd-muted-foreground" aria-hidden="true">
        /
      </span>
      {/* Same version-aware target as the sidebar's section row, so the crumb
          keeps a v7 reader on v7. */}
      <Link
        href={getVersionedNavPathname(section.url, pathname)}
        className="font-mono text-lg block translate-y-px truncate"
      >
        {section.title}
      </Link>
    </span>
  );
}
