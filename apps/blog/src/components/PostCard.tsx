'use client';

import Image from "next/image";
import Link from "next/link";
import { Badge, Card } from "@prisma/eclipse";
import { cn } from "@prisma-docs/ui/lib/cn";

import { AuthorAvatarGroup } from "@/components/AuthorAvatarGroup";
import { formatDate, formatTag } from "@/lib/format";
import { withBlogBasePathForImageSrc } from "@/lib/url";

type PostCardItem = {
  url: string;
  title: string;
  date: string;
  excerpt?: string | null;
  author?: string | null;
  authorSrc?: string | null;
  imageSrc?: string | null;
  imageAlt?: string | null;
  tags?: string[];
};

export function PostCard({
  post,
  currentCategory,
  featured = false,
}: {
  post: PostCardItem;
  currentCategory: string;
  featured?: boolean;
}) {
  const isFeatured = featured;
  const imageSizes = isFeatured ? "(min-width: 640px) 50vw, 100vw" : "384px";

  const containerClassName = cn(
    "group grid overflow-hidden",
    isFeatured
      ? "grid-cols-1 md:grid-cols-2 gap-4 bg-background-default rounded-square border border-stroke-neutral shadow-box-low"
      : "sm:grid-cols-[1fr_384px] border-b pb-4 sm:pb-6 border-stroke-neutral gap-8",
  );
  const imageClassName = cn(
    "object-cover transition-transform duration-300 group-hover:scale-[1.02]",
    !isFeatured && "rounded-square",
  );
  const imageWrapperClassName = cn(
    "relative aspect-video w-full h-full",
    isFeatured ? "order-1" : "order-2 max-w-96 hidden sm:block",
  );

  const titleClassName = cn(
    "text-foreground-neutral font-mona-sans mt-4 mb-2",
    isFeatured
      ? "text-2xl font-bold"
      : "text-md md:text-lg font-[650] sm:font-bold",
  );
  const excerptClassName = cn(
    "text-sm text-foreground-neutral-weak line-clamp-2",
    isFeatured && "leading-[20px]!",
  );
  const authorClassName = cn(
    "items-center gap-2 font-semibold text-sm mt-4 md:mt-0",
    isFeatured ? "flex" : "hidden sm:flex",
  );

  const postBody = (
    <>
      <div>
        <div className="eyebrow flex gap-2 items-center">
          {post.tags && post.tags.length > 0 && (
            <Badge
              color="success"
              label={formatTag(
                currentCategory !== "show-all" ? currentCategory : post.tags[0],
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
        {post.title && <h2 className={titleClassName}>{post.title}</h2>}
        {post.excerpt && <p className={excerptClassName}>{post.excerpt}</p>}
      </div>
      {post.author && (
        <AuthorAvatarGroup authors={[post.author]} className={authorClassName} />
      )}
    </>
  );

  return (
    <Link href={post.url} className={containerClassName}>
      {post.imageSrc && (
        <div className={imageWrapperClassName}>
          <Image
            src={withBlogBasePathForImageSrc(post.imageSrc as string)}
            alt={post.imageAlt ?? post.title}
            fill
            sizes={imageSizes}
            className={imageClassName}
            loading={isFeatured ? "eager" : undefined}
            priority={isFeatured}
          />
        </div>
      )}
      {isFeatured ? (
        <Card className="order-2 rounded-none! border-none! gap-0 bg-background-default flex flex-col justify-between">
          {postBody}
        </Card>
      ) : (
        <div className="order-1 flex flex-col justify-between">{postBody}</div>
      )}
    </Link>
  );
}
