import { blog, getPageImage } from "@/lib/source";
import { BlogGrid, type BlogCardItem } from "@/components/BlogGrid";
import { CategoryTagFilter } from "@/components/CategoryTagFilter";
import { BLOG_HOME_DESCRIPTION, BLOG_HOME_TITLE } from "@/lib/blog-metadata";
import type { Metadata } from "next";
import { withBlogBasePath, withBlogBasePathForImageSrc } from "@/lib/url";
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

const SHOW_ALL = "show-all";
const PAGE_SIZE = 12;

type BlogHomeSearchParams = {
  page?: string | string[];
  tag?: string | string[];
};

function getFirstQueryValue(value?: string | string[]): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function parsePage(value: string | undefined): number {
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

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: BLOG_HOME_TITLE,
    description: BLOG_HOME_DESCRIPTION,
    alternates: {
      canonical: withBlogBasePath("/"),
    },
    openGraph: {
      type: "website",
      title: BLOG_HOME_TITLE,
      description: BLOG_HOME_DESCRIPTION,
      url: withBlogBasePath("/"),
      images: withBlogBasePath(getPageImage().url),
    },
    twitter: {
      card: "summary_large_image",
      title: BLOG_HOME_TITLE,
      description: BLOG_HOME_DESCRIPTION,
      images: withBlogBasePath(getPageImage().url),
    },
  };
}

export default async function BlogHome({
  searchParams,
}: {
  searchParams?: Promise<BlogHomeSearchParams> | BlogHomeSearchParams;
}) {
  const resolvedSearchParams = (await Promise.resolve(searchParams)) ?? {};
  const posts = blog.getPages().sort((a, b) => {
    const aTime =
      a.data.date instanceof Date
        ? a.data.date.getTime()
        : new Date((a.data.date as unknown as string) ?? "").getTime();
    const bTime =
      b.data.date instanceof Date
        ? b.data.date.getTime()
        : new Date((b.data.date as unknown as string) ?? "").getTime();
    return bTime - aTime;
  });

  const getPrimaryAuthor = (post: (typeof posts)[number]) => {
    const data = post.data as any;
    const authors = Array.isArray(data?.authors) ? data?.authors : [];
    return authors.length > 0 ? authors[0] : null;
  };


  const items: BlogCardItem[] = posts.map((post) => {
    const data = post.data as any;

    // Safely convert date to ISO string with validation
    let dateISO = "";
    if (data.date) {
      try {
        const dateObj = new Date(data.date);
        if (!isNaN(dateObj.getTime())) {
          dateISO = dateObj.toISOString();
        }
      } catch (error) {
        // If date conversion fails, fall back to empty string
        dateISO = "";
      }
    }

    return {
      url: post.url,
      title: data.title as string,
      date: dateISO,
      excerpt: data.metaDescription as string,
      author: getPrimaryAuthor(post),
      imageSrc: withBlogBasePathForImageSrc(post.data.heroImagePath ?? ""),
      imageAlt: (data.heroImageAlt as string) ?? (data.title as string),
      seriesTitle: data.series?.title ?? null,
      tags: data.tags,
    };
  });

  const uniqueTags = [
    ...new Set(
      items
        .flatMap((item) => item.tags ?? [])
        .filter((tag): tag is string => Boolean(tag)),
    ),
  ];
  const validTags = new Set(uniqueTags);
  const tagFromQuery = getFirstQueryValue(resolvedSearchParams.tag);
  const currentCategory =
    tagFromQuery && validTags.has(tagFromQuery) ? tagFromQuery : SHOW_ALL;
  const filteredItems =
    currentCategory === SHOW_ALL
      ? items
      : items.filter((item) => item.tags?.includes(currentCategory));

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const pageFromQuery = parsePage(getFirstQueryValue(resolvedSearchParams.page));
  const currentPage = Math.max(1, Math.min(pageFromQuery, totalPages));

  const shouldShowFeatured = currentCategory === SHOW_ALL && currentPage === 1;
  const featuredPost = shouldShowFeatured ? filteredItems[0] : undefined;
  const postsToRender = shouldShowFeatured
    ? filteredItems.slice(1, PAGE_SIZE)
    : filteredItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const paginationSequence = getPaginationSequence(totalPages, currentPage);

  return (
    <main className="flex-1 w-full max-w-249 mx-auto px-4 py-8 z-1">
      <h1 className="stretch-display text-4xl font-bold mb-2 landing-h1 text-center mt-9 font-sans-display">
        Blog
      </h1>
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
                      >
                        {entry}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href={buildBlogHref(
                      currentCategory,
                      Math.min(totalPages, currentPage + 1),
                    )}
                    aria-disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          ) : null}
        </div>
      </div>
    </main>
  );
}
