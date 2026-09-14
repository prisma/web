import type { ReactNode } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@prisma/eclipse";

import { BlogGrid, type BlogCardItem } from "@/components/BlogGrid";
import { CategoryTagFilter } from "@/components/CategoryTagFilter";
import { LargeSearchToggle } from "@/components/search-toggle";
import { buildListingHref, getPaginationSequence, SHOW_ALL } from "@/lib/blog-listing";

interface BlogListingProps {
  /** The cards for this page's grid, already sliced. */
  items: BlogCardItem[];
  /** The lead card, page 1 of the unfiltered feed only. */
  featuredPost?: BlogCardItem;
  /** Every routable tag, for the chips. */
  uniqueTags: string[];
  /** The tag this listing is filtered by, or `show-all`. */
  currentCategory?: string;
  currentPage: number;
  totalPages: number;
  /** Slot for the featured-series shelf; only the home listing passes one. */
  seriesShelf?: ReactNode;
}

/**
 * The blog's listing body: filter chips, the series shelf, the card grid, and
 * the pagination control.
 *
 * A server component. It replaces `BlogHomeClient`, which sliced the same data
 * in the browser from `useSearchParams()` and therefore contributed nothing to
 * the prerendered HTML. Same markup, same classes, same order — the change is
 * where it renders and what the links point at:
 *
 * - pagination hrefs are `/blog` and `/blog/page/N`, not `?page=N`;
 * - the prev/next anchor is omitted on the first/last page rather than rendered
 *   as a live link carrying `aria-disabled`, which offered the crawler (and the
 *   keyboard) a link that goes nowhere.
 */
export function BlogListing({
  items,
  featuredPost,
  uniqueTags,
  currentCategory = SHOW_ALL,
  currentPage,
  totalPages,
  seriesShelf,
}: BlogListingProps) {
  const tag = currentCategory === SHOW_ALL ? undefined : currentCategory;
  const paginationSequence = getPaginationSequence(totalPages, currentPage);

  return (
    <div className="pb-20">
      {/* Filter row: chips wrap on the left, the search trigger holds the
          right edge and drops full-width on mobile. */}
      <div className="mb-8 flex flex-col items-stretch gap-4 md:flex-row md:items-center md:justify-between">
        <CategoryTagFilter
          uniqueTags={uniqueTags}
          currentCategory={currentCategory}
          className="flex min-w-0 flex-wrap justify-start gap-2"
        />
        <LargeSearchToggle className="w-full shrink-0 md:w-56" />
      </div>

      {seriesShelf}

      <BlogGrid items={items} featuredPost={featuredPost} currentCategory={currentCategory} />

      <div className="mt-12">
        {totalPages > 1 ? (
          <Pagination>
            <PaginationContent>
              {currentPage > 1 ? (
                <PaginationItem>
                  <PaginationPrevious href={buildListingHref(tag, currentPage - 1)} />
                </PaginationItem>
              ) : null}
              {paginationSequence.map((entry, index) => (
                <PaginationItem key={`${entry}-${index}`}>
                  {entry === "ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href={buildListingHref(tag, entry)}
                      isActive={entry === currentPage}
                      // Current page is an ink pill; the rest stay ghost and
                      // answer hover with the docs shell's cyan accent wash.
                      className={
                        entry === currentPage
                          ? "bg-background-neutral-reverse-strong text-foreground-neutral-reverse shadow-box-low hover:bg-background-neutral-reverse"
                          : "hover:bg-fd-accent hover:text-fd-accent-foreground"
                      }
                    >
                      {entry}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              {currentPage < totalPages ? (
                <PaginationItem>
                  <PaginationNext href={buildListingHref(tag, currentPage + 1)} />
                </PaginationItem>
              ) : null}
            </PaginationContent>
          </Pagination>
        ) : null}
      </div>
    </div>
  );
}
