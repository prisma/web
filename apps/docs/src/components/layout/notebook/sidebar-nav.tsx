"use client";
import {
  createContext,
  Fragment,
  type ReactNode,
  use,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "fumadocs-core/link";
import { usePathname } from "fumadocs-core/framework";
import { useOnChange } from "fumadocs-core/utils/use-on-change";
import { useTreeContext } from "@fumadocs/base-ui/contexts/tree";
import { ChevronLeft } from "lucide-react";
import { cn } from "@prisma-docs/ui/lib/cn";
import { isTabActive } from "../sidebar/tabs";
import { useCurrentSection, useSectionTabs } from "../use-current-section";
import { sidebarSectionGroups } from "../../../lib/sidebar-sections";
import { getVersionedNavPathname } from "../../../lib/version";
import { useSidebar } from "../sidebar/base";
import { itemVariants, SidebarPageTree, SidebarSeparator } from "./sidebar";
import type { SidebarPageTreeComponents } from "../sidebar/page-tree";

type SidebarView = "top" | "section";

const SidebarViewContext = createContext<{
  view: SidebarView;
  showTop: () => void;
  drillIn: (targetIsCurrentSection: boolean) => void;
  /** True exactly once after a back-press, so the top view knows to move focus. */
  consumeFocusRequest: () => boolean;
} | null>(null);

/**
 * Drill-in state for the vertical sidebar nav: the grouped section list, or one
 * section's page tree. Mounted once in DocsLayout so the desktop aside and the
 * mobile drawer share it.
 *
 * The URL seeds the view but does not own it. Reading inside a section keeps
 * the reader in that section's tree until they press "All docs" or open a page
 * in another section — only a change of section re-derives. That distinction
 * matters because `/` is both the docs home (grouped list) and the Getting
 * Started index page: re-deriving on every navigation would eject the reader
 * to the all-docs list the moment they opened "Get started with Prisma" from
 * inside the section.
 */
export function SidebarViewProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { root, full } = useTreeContext();
  const section = useCurrentSection();

  // The docs root shows the grouped "All docs" list (its content is the Getting
  // started page); any page inside a `root: true` section shows that section's
  // tree. 404 (no section) falls back to top.
  const derived: SidebarView = pathname === "/" || root === full ? "top" : "section";

  const [view, setView] = useState<SidebarView>(derived);
  // Set on back-press only: the top view moves keyboard focus to its first
  // link when the pressed button unmounts, but must not steal focus on an
  // ordinary page load that happens to show the top view.
  const focusRequestRef = useRef(false);

  // Leaving the section re-derives, and voids a pending focus request (the
  // drawer may have auto-closed before any visible top view consumed it; a
  // later mount must not inherit it).
  useOnChange(section?.url ?? null, () => {
    setView(derived);
    focusRequestRef.current = false;
  });

  // Opening a page that only exists inside a section always shows that
  // section's tree, however the reader got there. The reverse (a section page
  // to `/`) deliberately does not flip back — that is the Getting Started case
  // above.
  useOnChange(derived, () => {
    if (derived === "section") setView("section");
  });

  const value = useMemo(
    () => ({
      view,
      showTop: () => {
        focusRequestRef.current = true;
        setView("top");
      },
      consumeFocusRequest: () => {
        const requested = focusRequestRef.current;
        focusRequestRef.current = false;
        return requested;
      },
      // Clicking a section row: flip to the section view immediately ONLY when
      // the target is the section the reader is already in (covers Getting
      // Started on `/`, where no pathname change will arrive). For any other
      // section, stay on the top list until the navigation commits — flipping
      // early would flash the previous section's title and tree.
      drillIn: (targetIsCurrentSection: boolean) => {
        if (targetIsCurrentSection) setView("section");
      },
    }),
    [view],
  );

  return <SidebarViewContext value={value}>{children}</SidebarViewContext>;
}

/**
 * The sidebar's current view. Exported for the navbar breadcrumb, which needs
 * it to name the section on the docs root — see NavBreadcrumb.
 */
export function useSidebarView() {
  const ctx = use(SidebarViewContext);
  if (!ctx) throw new Error("Missing SidebarViewContext; wrap the layout in SidebarViewProvider.");

  return ctx;
}

function SidebarNavTopView() {
  const pathname = usePathname();
  const { prefetch } = useSidebar();
  const { drillIn, consumeFocusRequest } = useSidebarView();
  const tabsByUrl = useSectionTabs();
  const containerRef = useRef<HTMLDivElement>(null);

  // Back-button focus handoff: when this view replaces the section view, the
  // pressed button unmounts; keyboard users continue from the first section.
  // Gated on the back-press request so an ordinary page load that shows the
  // top view does not steal focus, and on visibility so that of the two
  // rendered surfaces (desktop aside, mobile drawer) only the one the reader
  // can see consumes the shared request — the aside is display:none on
  // mobile but stays mounted.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || container.getClientRects().length === 0) return;
    if (!consumeFocusRequest()) return;
    const first = container.querySelector<HTMLAnchorElement>("a[href]");
    first?.focus({ preventScroll: true });
  }, [consumeFocusRequest]);

  return (
    <div ref={containerRef} className="flex flex-col gap-0.5">
      {sidebarSectionGroups.map((group, i) => (
        <Fragment key={group.heading ?? i}>
          {group.heading && <SidebarSeparator>{group.heading}</SidebarSeparator>}
          {group.sections.map(({ url, title, icon }) => {
            const tab = tabsByUrl.get(url);
            // A `title` entry is a plain page link, not a root section.
            if (!tab && title) {
              return (
                <Link
                  key={url}
                  href={url}
                  prefetch={prefetch}
                  className={cn(itemVariants({ variant: "link" }), "ps-2")}
                >
                  {icon}
                  {title}
                </Link>
              );
            }
            if (!tab) {
              if (process.env.NODE_ENV !== "production") {
                console.warn(`sidebar-sections: no root section found for "${url}"`);
              }
              return null;
            }
            // Rows carry no selected state on purpose: after "back", the
            // section the reader came from should not stay highlighted.
            return (
              <Link
                key={url}
                // Keep the reader's version context: /orm routes to /orm/v7
                // when they are on a v7 page, matching the old top-nav tabs.
                href={getVersionedNavPathname(tab.url, pathname)}
                prefetch={prefetch}
                onClick={(event) => {
                  // Clicking the section the reader is already in only drills
                  // the sidebar back into its tree — the open page stays.
                  if (isTabActive(tab, pathname)) {
                    event.preventDefault();
                    drillIn(true);
                  }
                }}
                className={cn(itemVariants({ variant: "link" }), "ps-2")}
              >
                {tab.icon}
                {tab.title}
              </Link>
            );
          })}
        </Fragment>
      ))}
    </div>
  );
}

/**
 * The non-scrolling strip above the sidebar's scroll viewport, shown in the
 * section view: the back button (always visible regardless of tree scroll),
 * the section title, then the version switcher passed in as `banner`.
 */
export function SidebarNavHeader({ banner }: { banner?: ReactNode }) {
  const { view, showTop } = useSidebarView();
  const section = useCurrentSection();

  if (view !== "section") return null;

  return (
    <div className="flex flex-col gap-2 px-4 pt-4">
      {/* Back navigates to the docs root, so the content area returns to the
          Getting started page; showTop makes the flip instant (and covers the
          no-op navigation when already on "/"). */}
      <Link
        href="/"
        onClick={showTop}
        aria-label="Back to all docs sections"
        className={cn(itemVariants({ variant: "link" }), "w-full text-sm font-medium")}
      >
        <ChevronLeft />
        All docs
      </Link>
      {section && (
        <div className="flex items-center gap-2 px-2 font-medium text-fd-foreground [&_svg]:size-4 [&_svg]:shrink-0">
          {section.icon}
          {section.title}
        </div>
      )}
      {banner}
    </div>
  );
}

function SidebarNavSectionView({
  components,
}: {
  components?: Partial<SidebarPageTreeComponents>;
}) {
  return <SidebarPageTree {...components} />;
}

/**
 * The sidebar's drill-in navigation: the grouped top-level section list, or
 * the current section's page tree behind a back button. Rendered inside the
 * shared SidebarViewport so the desktop aside and mobile drawer stay in sync.
 */
export function SidebarNav({ components }: { components?: Partial<SidebarPageTreeComponents> }) {
  const { view } = useSidebarView();

  if (view === "top") return <SidebarNavTopView />;
  return <SidebarNavSectionView components={components} />;
}
