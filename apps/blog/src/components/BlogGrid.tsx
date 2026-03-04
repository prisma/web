'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@prisma-docs/eclipse';
import { withBlogBasePathForImageSrc } from '@/lib/url';


type BlogCardItem = {
  url: string;
  title: string;
  date: string; // ISO string
  description?: string | null;
  author?: string | null;
  imageSrc?: string | null;
  imageAlt?: string | null;
  seriesTitle?: string | null;
};

function parsePage(value: string | null): number {
  const n = parseInt(value ?? '1', 10);
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
    () => parsePage(searchParams.get('page')),
    [searchParams],
  );
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(rawPage, totalPages);

  const visibleItems = useMemo(
    () =>
      items.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize,
      ),
    [items, currentPage, pageSize],
  );

  const setPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newPage <= 1) {
      params.delete('page');
    } else {
      params.set('page', String(newPage));
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (iso: string) => {
    if (!iso) return '';
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visibleItems.map((post) => (
          <Link
            key={post.url}
            href={post.url}
            className="group block rounded-2xl border border-fd-primary/20 hover:border-fd-primary/40 transition-colors shadow-md overflow-hidden bg-fd-secondary"
          >
            {post.imageSrc ? (
              <div className="relative w-full aspect-video overflow-hidden">
                <Image
                  src={withBlogBasePathForImageSrc(post.imageSrc)}
                  alt={post.imageAlt ?? post.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  priority={false}
                />
              </div>
            ) : null}

            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
              <p className="text-sm text-fd-muted mb-2">
                {formatDate(post.date)}
                {post.author ? (
                  <>
                    {' • '}
                    <span className="text-fd-foreground/80">{post.author}</span>
                  </>
                ) : null}
              </p>
              {post.description ? (
                <p className="mb-5 text-fd-foreground/90">{post.description}</p>
              ) : null}

              {post.seriesTitle ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-fd-primary/10 text-fd-primary">
                  {post.seriesTitle}
                </span>
              ) : null}
            </div>
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

