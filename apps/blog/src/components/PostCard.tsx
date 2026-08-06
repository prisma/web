"use client";

import { AuthorAvatarGroup } from "@/components/AuthorAvatarGroup";
import { formatDate, formatTag } from "@/lib/format";
import { withBlogBasePathForImageSrc } from "@/lib/url";
import { cn } from "@prisma-docs/ui/lib/cn";

type PostCardItem = {
  url: string;
  title: string;
  date: string;
  updatedAt?: string | null;
  excerpt?: string | null;
  author?: string | null;
  authors?: string[] | null;
  authorSrc?: string | null;
  imageSrc?: string | null;
  imageAlt?: string | null;
  tags?: string[];
};

/**
 * The blog's card idiom, and the one place the brand's interaction signature
 * carries a whole page.
 *
 * Resting state is deliberately quiet — a hairline `stroke-neutral` ring on the
 * page surface, 14px radius, a single-pixel shadow. On hover the hairline fades
 * to transparent while `.spectrum-border` lights that same ring with the
 * sliding prism gradient and the shadow lifts: one gesture, 500ms. The utility
 * ships its own `prefers-reduced-motion` guard for the gradient slide; the
 * transitions declared here carry an explicit `motion-reduce:` of their own.
 *
 * Three shapes, one surface language:
 * - default  — feed card in the 3-up grid.
 * - vertical — the same upright card, kept as a separate prop so the series
 *              prev/next and "Keep reading" call sites don't have to change.
 * - featured — the lead slot: full grid width, image beside the body from md
 *              up, seated on `card-wash` so it reads as a panel above the
 *              white cards below it.
 *
 * Previously this file wrapped `@prisma-docs/ui`'s shared PostCard. That
 * package is shared with the other apps and out of scope for this rebrand, so
 * the card is implemented locally instead — same props, same data mapping.
 */
export function PostCard({
  post,
  currentCategory,
  featured = false,
  vertical = false,
}: {
  post: PostCardItem;
  currentCategory: string;
  featured?: boolean;
  vertical?: boolean;
}) {
  const authorNames =
    post.authors && post.authors.length > 0 ? post.authors : post.author ? [post.author] : [];

  const badge =
    post.tags && post.tags.length > 0
      ? formatTag(currentCategory !== "show-all" ? currentCategory : post.tags[0])
      : null;

  // `formatDate` already returns "" for an empty or unparseable value.
  const date = formatDate(post.date);
  const updatedAt = post.updatedAt ? formatDate(post.updatedAt) : "";

  const imageSrc = post.imageSrc ? withBlogBasePathForImageSrc(post.imageSrc) : null;

  // The featured slot only splits into two columns when there is an image to
  // put in the second one; without one it falls back to the upright card so no
  // empty grid track is left behind.
  const isSplit = featured && !vertical && Boolean(imageSrc);

  const body = (
    <div
      className={cn(
        "flex min-w-0 flex-1 flex-col gap-3",
        isSplit ? "justify-center p-6 sm:p-8" : "p-5",
      )}
    >
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {badge ? (
          <span className="inline-flex items-center rounded-circle bg-background-ppg px-2.5 py-0.5 type-text-xs-strong capitalize text-foreground-ppg">
            {badge}
          </span>
        ) : null}
        {date ? <span className="text-xs text-foreground-neutral-weak">{date}</span> : null}
        {date && updatedAt ? (
          <span aria-hidden className="text-xs text-foreground-neutral-weaker">
            ·
          </span>
        ) : null}
        {updatedAt ? (
          <span className="text-xs text-foreground-neutral-weak">Updated {updatedAt}</span>
        ) : null}
      </div>

      <h2
        className={cn(
          "text-balance text-foreground-neutral-strong",
          isSplit ? "type-title-2xl sm:type-title-3xl" : "type-heading-xl",
        )}
      >
        {post.title}
      </h2>

      {post.excerpt ? (
        <p
          className={cn(
            "line-clamp-3 text-sm leading-relaxed text-foreground-neutral-weak",
            isSplit && "sm:text-base",
          )}
        >
          {post.excerpt}
        </p>
      ) : null}

      {authorNames.length > 0 ? (
        // `linkAuthors={false}` — the whole card is already an anchor, and an
        // author link nested inside it would be invalid markup.
        <AuthorAvatarGroup
          authors={authorNames}
          linkAuthors={false}
          className="mt-auto flex items-center gap-2 pt-2 text-sm font-medium text-foreground-neutral"
        />
      ) : null}
    </div>
  );

  return (
    <a
      href={post.url}
      className={cn(
        "spectrum-border group flex h-full flex-col overflow-hidden rounded-square-high border border-stroke-neutral shadow-box-low",
        "transition-[box-shadow,border-color] duration-500 hover:border-transparent hover:shadow-box",
        "motion-reduce:transition-none",
        isSplit
          ? "bg-card-wash md:grid md:grid-cols-2 md:items-stretch"
          : featured
            ? "bg-card-wash"
            : "bg-background-default",
      )}
    >
      {imageSrc ? (
        <div
          className={cn(
            "relative w-full shrink-0 overflow-hidden bg-background-neutral",
            isSplit ? "aspect-video md:aspect-auto md:h-full" : "aspect-video",
          )}
        >
          <img
            src={imageSrc}
            alt={post.imageAlt ?? post.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            loading={featured ? "eager" : "lazy"}
          />
        </div>
      ) : null}
      {body}
    </a>
  );
}
