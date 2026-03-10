"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Avatar,
  Badge,
  Card,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@prisma/eclipse";

import { withBlogBasePathForImageSrc } from "@/lib/url";
import { formatTag, formatDate } from "@/lib/format";

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

  const [currentCat, setCurrentCat] = useState<string>(() => {
    const tagFromQuery = searchParams.get("tag");
    return tagFromQuery && uniqueTags.includes(tagFromQuery)
      ? tagFromQuery
      : "show-all";
  });

  const filteredItems = useMemo(() => {
    return currentCat === "show-all"
      ? items
      : items.filter((item) => item.tags?.includes(currentCat!));
  }, [items, currentCat]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));

  const [currentPage, setPage] = useState<number>(() => {
    const pageFromQuery = parsePage(searchParams.get("page"));
    return Math.max(1, Math.min(pageFromQuery, totalPages));
  });

  const visibleItems = useMemo(() => {
    if (currentPage === 1) {
      return filteredItems.slice(1, pageSize + 1);
    }

    return filteredItems.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize,
    );
  }, [filteredItems, currentPage, pageSize]);

  const setCurrentPage = (page: number) => {
    const clampedPage = Math.max(1, Math.min(page, totalPages));
    setPage(clampedPage);
  };

  const setCategory = (nextCategory: string) => {
    if (nextCategory === currentCat) return;

    setCurrentCat(nextCategory);
    setPage(1);
  };

  useEffect(() => {
    const pageFromQuery = parsePage(searchParams.get("page"));
    const clampedPage = Math.max(1, Math.min(pageFromQuery, totalPages));
    setPage((prevPage) => (prevPage === clampedPage ? prevPage : clampedPage));
  }, [searchParams, totalPages]);

  useEffect(() => {
    // Skip if we just updated the URL programmatically
    if (isUpdatingUrlRef.current) {
      isUpdatingUrlRef.current = false;
      return;
    }

    const tagFromQuery = searchParams.get("tag");
    const newCat =
      tagFromQuery && uniqueTags.includes(tagFromQuery)
        ? tagFromQuery
        : "show-all";
    setCurrentCat((prevCat) => (prevCat === newCat ? prevCat : newCat));
  }, [searchParams, uniqueTags]);

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

  return (
    <>
      {/* Category pills (static "Show all" to match layout) */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Badge
          color={currentCat === "show-all" ? "ppg" : "neutral"}
          onClick={() => setCategory("show-all")}
          className="cursor-pointer"
          label="Show all"
        />
        {uniqueTags.map((category: string, idx: number) => (
          <Badge
            color={currentCat === category ? "ppg" : "neutral"}
              onClick={() => {
                const nextCategory =
                  category === "show-all" || currentCat === category
                    ? "show-all"
                    : category;
                setCategory(nextCategory);
              }}
            className="cursor-pointer"
            label={formatTag(category)}
            key={idx}
          />
        ))}
      </div>
      {currentPage === 1 && filteredItems.length > 0 && (
        <Link
          href={filteredItems[0].url}
          className="group grid grid-cols-1 md:grid-cols-2 gap-4 bg-background-default rounded-square overflow-hidden border border-stroke-neutral shadow-box-low"
        >
          <div className="relative w-full h-full aspect-video">
            <Image
              src={withBlogBasePathForImageSrc(
                filteredItems[0].imageSrc as string,
              )}
              alt={filteredItems[0].imageAlt ?? filteredItems[0].title}
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              loading="eager"
              priority
            />
          </div>
          <Card className="rounded-none! border-none! gap-0 bg-background-default">
            <div className="eyebrow flex gap-2 items-center">
              {filteredItems[0].tags && filteredItems[0].tags.length > 0 && (
                <Badge
                  color="success"
                  label={formatTag(
                    currentCat !== "show-all"
                      ? currentCat
                      : filteredItems[0].tags[0],
                  )}
                  className="w-fit"
                />
              )}
              <span className="text-xs text-foreground-neutral-weak">
                {formatDate(new Date(filteredItems[0].date).toISOString())}
              </span>
            </div>
            <h2 className="text-2xl text-foreground-neutral font-bold font-mona-sans mt-4 mb-2">
              {filteredItems[0].title}
            </h2>
            {filteredItems[0].description && (
              <p className="text-sm text-foreground-neutral-weak leading-[20px]! line-clamp-2">
                {filteredItems[0].description}
              </p>
            )}
            {filteredItems[0].author && (
              <span className="mt-auto flex items-center gap-2 font-semibold text-sm">
                {filteredItems[0]?.authorSrc && filteredItems[0] && (
                  <Avatar
                    format="image"
                    src={filteredItems[0].authorSrc}
                    alt={filteredItems[0].author}
                    size="lg"
                  />
                )}
                <span>{filteredItems[0].author}</span>
              </span>
            )}
          </Card>
        </Link>
      )}
      <div className="grid gap-6 mt-12 grid-cols-1">
        {visibleItems.map((post) => (
          <Link
            key={post.url}
            href={post.url}
            className="group grid sm:grid-cols-[1fr_384px] overflow-hidden border-b pb-4 sm:pb-6 border-stroke-neutral gap-8"
          >
            <div className="flex flex-col justify-between">
              <div>
                <div className="eyebrow flex gap-2 items-center">
                  {post.tags && post.tags.length > 0 && (
                    <Badge
                      color="success"
                      label={formatTag(
                        currentCat !== "show-all" ? currentCat : post.tags[0],
                      )}
                      className="w-fit"
                    />
                  )}
                  {post.date && (
                    <span className="text-xs text-foreground-neutral-weak">
                      {formatDate(new Date(post.date).toISOString())}
                    </span>
                  )}
                </div>
                {post.title && (
                  <h2 className="text-md  md:text-lg text-foreground-neutral font-[650] sm:font-bold font-mona-sans mt-4 mb-2">
                    {post.title}
                  </h2>
                )}
                {post.description && (
                  <p className="text-sm text-foreground-neutral-weak line-clamp-2">
                    {post.description}
                  </p>
                )}
              </div>
              {post.author && (
                <span className="hidden sm:flex items-center gap-2 font-semibold text-sm">
                  {post?.authorSrc && (
                    <Avatar
                      format="image"
                      src="/avatar.jpg"
                      alt="Disabled user"
                      size="lg"
                      disabled
                    />
                  )}
                  <span>{post.author}</span>
                </span>
              )}
            </div>
            {post.imageSrc && (
              <div className="relative max-w-96 aspect-video w-full h-full hidden sm:block">
                <Image
                  src={withBlogBasePathForImageSrc(post.imageSrc as string)}
                  alt={post.imageAlt ?? post.title}
                  fill
                  sizes="384px"
                  className="rounded-square object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
            )}
          </Link>
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
