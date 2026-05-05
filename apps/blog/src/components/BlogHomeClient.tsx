"use client";

import { useSearchParams } from "next/navigation";
import { BlogGrid, type BlogCardItem } from "@/components/BlogGrid";
import { CategoryTagFilter } from "@/components/CategoryTagFilter";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@prisma/eclipse";
import { LargeSearchToggle } from "@/components/search-toggle";
import { withBlogBasePath } from "@/lib/url";

const SHOW_ALL = "show-all";
const PAGE_SIZE = 12;

function parsePage(value: string | null): number {
  const parsed = Number.parseInt(value ?? "1", 10);
  return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
}

function buildBlogHref(tag: string, page: number): string {
  const params = new URLSearchParams();

  if (tag !== SHOW_ALL) {
    params.set("tag", tag);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();
  const basePath = withBlogBasePath("/");
  return query ? `${basePath}?${query}` : basePath;
}

function getPaginationSequence(totalPages: number, currentPage: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: Array<number | "ellipsis"> = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) {
    pages.push("ellipsis");
  }

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (end < totalPages - 1) {
    pages.push("ellipsis");
  }

  pages.push(totalPages);
  return pages;
}

interface BlogHomeClientProps {
  items: BlogCardItem[];
  uniqueTags: string[];
}

export function BlogHomeClient({ items, uniqueTags }: BlogHomeClientProps) {
  const searchParams = useSearchParams();

  const tagFromQuery = searchParams.get("tag") ?? undefined;
  const validTags = new Set(uniqueTags);
  const currentCategory = tagFromQuery && validTags.has(tagFromQuery) ? tagFromQuery : SHOW_ALL;

  const filteredItems =
    currentCategory === SHOW_ALL
      ? items
      : items.filter((item) => item.tags?.includes(currentCategory));

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const currentPage = Math.max(1, Math.min(parsePage(searchParams.get("page")), totalPages));

  const shouldShowFeatured = currentCategory === SHOW_ALL && currentPage === 1;
  const featuredPost = shouldShowFeatured ? filteredItems[0] : undefined;
  const postsToRender = shouldShowFeatured
    ? filteredItems.slice(1, PAGE_SIZE)
    : filteredItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const paginationSequence = getPaginationSequence(totalPages, currentPage);

  return (
    <div className="pt-6 pb-12 mt-10">
      <div className="flex justify-between items-center gap-4 mb-8">
        <CategoryTagFilter
          uniqueTags={uniqueTags}
          currentCategory={currentCategory}
          className="flex justify-center flex-wrap gap-1"
        />
        <LargeSearchToggle className="w-20 h-full md:w-52" />
      </div>

      <BlogGrid
        items={postsToRender}
        featuredPost={featuredPost}
        currentCategory={currentCategory}
      />

      <div className="mt-8">
        {totalPages > 1 ? (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={buildBlogHref(currentCategory, Math.max(1, currentPage - 1))}
                  aria-disabled={currentPage === 1}
                />
              </PaginationItem>
              {paginationSequence.map((entry, index) => (
                <PaginationItem key={`${entry}-${index}`}>
                  {entry === "ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href={buildBlogHref(currentCategory, entry)}
                      isActive={entry === currentPage}
                      className={
                        entry === currentPage
                          ? "bg-background-neutral border border-stroke-neutral shadow-box-low hover:bg-background-neutral-strong"
                          : undefined
                      }
                    >
                      {entry}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href={buildBlogHref(currentCategory, Math.min(totalPages, currentPage + 1))}
                  aria-disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        ) : null}
      </div>
    </div>
  );
}
