"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationInput,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@prisma-docs/eclipse";

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
};

const PaginationWithEllipsis = ({
  totalPages,
  currentPage,
  setCurrentPage,
}: any) => (
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
      {currentPage > 2 && currentPage < totalPages - 1 && (
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
  pageSize = 12,
}: {
  items: BlogCardItem[];
  pageSize?: number;
}) {
  const searchParams = useSearchParams();
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  const [currentPage, setCurrentPage] = useState<number>(1);
  const visibleItems = useMemo(
    () => items.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [items, currentPage, pageSize],
  );

  const formatDate = (iso: string) => {
    if (!iso) return "";
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="grid gap-6 mt-12 grid-cols-1">
        {visibleItems.map((post) => (
          <Link
            key={post.url}
            href={post.url}
            className="grid sm:grid-cols-[1fr_384px] overflow-hidden border-b pb-4 sm:pb-6 border-stroke-neutral gap-8"
          >
            <div className="grid grid-rows-[1fr_auto]">
              <div className="">
                <div className="eyebrow flex gap-2 items-center">
                  {post.badge && (
                    <Badge color="success" label="Release" className="w-min" />
                  )}
                  {post.date && (
                    <span className="text-xs text-foreground-neutral-weak">
                      {formatDate(post.date)}
                    </span>
                  )}
                </div>
                {post.title && (
                  <h2 className="text-2xl text-foreground-neutral font-[650] sm:font-bold font-mona-sans mt-4 mb-2">
                    {post.title}
                  </h2>
                )}
                {post.description && (
                  <p className="text-sm text-foreground-neutral-weak line-clamp-3">
                    {post.description}
                  </p>
                )}
              </div>
              {post.author && (
                <span className="mt-auto hidden sm:flex items-center gap-2 font-semibold text-sm">
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
              <div className="relative max-w-96 h-54 w-full hidden sm:block">
                <Image
                  src={post.imageSrc}
                  alt={post.imageAlt ?? post.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="rounded-square w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  priority={false}
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
