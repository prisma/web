"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Avatar, Badge, Button, Card } from "@prisma-docs/eclipse";

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const rawPage = useMemo(
    () => parsePage(searchParams.get("page")),
    [searchParams],
  );
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(rawPage, totalPages);

  const visibleItems = useMemo(
    () => items.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [items, currentPage, pageSize],
  );

  const setPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newPage <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(newPage));
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
            className="grid sm:grid-cols-[1fr_384px] overflow-hidden border-b pb-4 sm:pb-6 border-stroke-neutral"
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
                  <p className="text-sm text-foreground-neutral-weak">
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

      {totalPages > 1 ? (
        <nav
          className="flex items-center justify-center gap-2 mt-8"
          aria-label="Blog pagination"
        >
          <Button
            type="button"
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="inline-flex items-center px-4 py-2 rounded-md border border-fd-primary/30 text-fd-foreground hover:border-fd-primary/60 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-fd-primary/30"
          >
            Previous
          </Button>
          <span className="px-4 py-2 text-sm text-fd-muted">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            type="button"
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="inline-flex items-center px-4 py-2 rounded-md border border-fd-primary/30 text-fd-foreground hover:border-fd-primary/60 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-fd-primary/30"
          >
            Next
          </Button>
        </nav>
      ) : null}
    </>
  );
}
