"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@prisma/eclipse";

import { LargeSearchToggle } from "./search-toggle";
import { CategoryTagFilter } from "./CategoryTagFilter";
import { PostCard } from "./PostCard";

type BlogCardItem = {
  url: string;
  title: string;
  date: string; // ISO string
  description?: string | null;
  author?: string | null;
  authorSrc?: string | null;
  imageSrc?: string | null;
  imageAlt?: string | null;
  seriesTitle?: string | null;
  badge?: string | null;
  tags?: string[];
};

const PaginationWithEllipsis = ({
  totalPages,
  currentPage,
  setCurrentPage,
}: any) =>
  totalPages > 1 && (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) setCurrentPage(currentPage - 1);
            }}
            aria-disabled={currentPage === 1}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(1);
            }}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          {currentPage > 3 ? (
            <PaginationEllipsis />
          ) : (
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(2);
              }}
              isActive={currentPage === 2}
            >
              2
            </PaginationLink>
          )}
        </PaginationItem>
        {totalPages > 2 && currentPage > 2 && currentPage < totalPages - 1 && (
          <>
            {currentPage > 3 && (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(currentPage - 1);
                  }}
                >
                  {currentPage - 1}
                </PaginationLink>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(currentPage);
                }}
                isActive
              >
                {currentPage}
              </PaginationLink>
            </PaginationItem>
            {currentPage < totalPages - 2 && (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(currentPage + 1);
                  }}
                >
                  {currentPage + 1}
                </PaginationLink>
              </PaginationItem>
            )}
          </>
        )}
        {totalPages > 2 && (
          <>
            <PaginationItem>
              {currentPage < totalPages - 2 ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(totalPages - 1);
                  }}
                  isActive={currentPage === totalPages - 1}
                >
                  {totalPages - 1}
                </PaginationLink>
              )}
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(totalPages);
                }}
                isActive={currentPage === totalPages}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) setCurrentPage(currentPage + 1);
            }}
            aria-disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );

function parsePage(value: string | null): number {
  const n = parseInt(value ?? "1", 10);
  return Number.isNaN(n) || n < 1 ? 1 : n;
}

export function BlogGrid({
  items,
  uniqueTags,
  pageSize = 12,
}: {
  items: BlogCardItem[];
  uniqueTags: string[];
  pageSize?: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isUpdatingUrlRef = useRef(false);
  const validTags = useMemo(() => new Set(uniqueTags), [uniqueTags]);

  const [currentCat, setCurrentCat] = useState<string>(() => {
    const tagFromQuery = searchParams.get("tag");
    return tagFromQuery && validTags.has(tagFromQuery)
      ? tagFromQuery
      : "show-all";
  });

  const filteredItems = useMemo(() => {
    return currentCat === "show-all"
      ? items
      : items.filter((item) => item.tags?.includes(currentCat));
  }, [items, currentCat]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));

  const [currentPage, setPage] = useState<number>(() => {
    const pageFromQuery = parsePage(searchParams.get("page"));
    return Math.max(1, Math.min(pageFromQuery, totalPages));
  });

  const { featuredPost, postsToRender } = useMemo(() => {
    const shouldShowFeatured = currentCat === "show-all" && currentPage === 1;

    if (shouldShowFeatured) {
      return {
        featuredPost: filteredItems[0],
        postsToRender: filteredItems.slice(1, pageSize),
      };
    }

    return {
      featuredPost: undefined,
      postsToRender: filteredItems.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize,
      ),
    };
  }, [filteredItems, currentCat, currentPage, pageSize]);

  const setCurrentPage = (page: number) => {
    const clampedPage = Math.max(1, Math.min(page, totalPages));
    setPage((prevPage) => (prevPage === clampedPage ? prevPage : clampedPage));
  };

  const setCategory = (nextCategory: string) => {
    if (nextCategory === currentCat) return;

    setCurrentCat(nextCategory);
    setPage((prevPage) => (prevPage === 1 ? prevPage : 1));
  };

  useEffect(() => {
    // Skip if we just updated the URL programmatically
    if (isUpdatingUrlRef.current) {
      isUpdatingUrlRef.current = false;
      return;
    }

    const pageFromQuery = parsePage(searchParams.get("page"));
    const clampedPage = Math.max(1, Math.min(pageFromQuery, totalPages));
    setPage((prevPage) => (prevPage === clampedPage ? prevPage : clampedPage));

    const tagFromQuery = searchParams.get("tag");
    const newCat =
      tagFromQuery && validTags.has(tagFromQuery)
        ? tagFromQuery
        : "show-all";
    setCurrentCat((prevCat) => (prevCat === newCat ? prevCat : newCat));
  }, [searchParams, totalPages, validTags]);

  // Sync both tag and page to URL
  useEffect(() => {
    // Skip if we just updated the URL programmatically
    if (isUpdatingUrlRef.current) {
      isUpdatingUrlRef.current = false;
      return;
    }

    const clampedCurrentPage = Math.max(1, Math.min(currentPage, totalPages));
    const params = new URLSearchParams();

    // Add tag if not "show-all"
    if (currentCat !== "show-all") {
      params.set("tag", currentCat);
    }

    // Add page if not page 1
    if (clampedCurrentPage > 1) {
      params.set("page", String(clampedCurrentPage));
    }

    const nextQuery = params.toString();
    const currentQuery = searchParams.toString();

    if (currentQuery === nextQuery) return;

    // Mark that we're updating the URL programmatically
    isUpdatingUrlRef.current = true;

    if (nextQuery) {
      router.replace(`${pathname}?${nextQuery}`, { scroll: false });
    } else {
      router.replace(pathname, { scroll: false });
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentCat, currentPage, pathname, router, totalPages]);

  const formatTag = (tag: string) => {
    return tag === "orm"
      ? "ORM"
      : tag.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <>
      {/* Category pills */}
      <div className="flex justify-between items-center gap-4 mb-8">
        <CategoryTagFilter
          uniqueTags={uniqueTags}
          currentCategory={currentCat}
          onChange={setCategory}
          className="flex justify-center  flex-wrap gap-1"
        />
        <LargeSearchToggle className="w-20 h-full md:w-52" />
      </div>
     
      {featuredPost && (
        <PostCard
          post={featuredPost}
          currentCategory={currentCat}
          featured
        />
      )}
      <div className="grid gap-6 mt-12 grid-cols-1">
        {postsToRender.map((post) => (
          <PostCard key={post.url} post={post} currentCategory={currentCat} />
        ))}
      </div>
      <div className="mt-8">
        <PaginationWithEllipsis
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </>
  );
}
