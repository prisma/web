"use client";

import { Badge, Card } from "@prisma/eclipse";
import { cn } from "../lib/cn";
import { AuthorAvatarGroup, type AuthorProfile } from "./author-avatar-group";

export type PostCardItem = {
  url: string;
  title: string;
  date: string;
  excerpt?: string | null;
  author?: AuthorProfile | null;
  imageSrc?: string | null;
  imageAlt?: string | null;
  badge?: string | null;
};

export function PostCard({
  post,
  featured = false,
  vertical = false,
}: {
  post: PostCardItem;
  featured?: boolean;
  vertical?: boolean;
}) {
  const isFeatured = featured;
  const imageSizes = isFeatured ? "(min-width: 640px) 50vw, 100vw" : "384px";

  const containerClassName = cn(
    "group grid overflow-hidden",
    isFeatured
      ? "grid-cols-1 md:grid-cols-2 gap-4 bg-background-default rounded-square border border-stroke-neutral shadow-box-low"
      : "sm:grid-cols-[1fr_384px] border-b pb-4 sm:pb-6 border-stroke-neutral gap-8",
    vertical ? "sm:grid-cols-1 grid-rows-2" : "",
  );
  const imageClassName = cn(
    "object-cover transition-transform duration-300 group-hover:scale-[1.02]",
    !isFeatured && "rounded-square",
  );
  const imageWrapperClassName = cn(
    "relative aspect-video w-full h-full",
    isFeatured ? "order-1" : "order-2 max-w-96 hidden sm:block",
    vertical && "order-none! h-52 cover",
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
          {post.badge && (
            <Badge
              color="success"
              label={post.badge}
              className="w-fit text-xs"
            />
          )}
          {post.date && (
            <span className="text-xs text-foreground-neutral-weak">
              {post.date}
            </span>
          )}
        </div>
        {post.title && <h2 className={titleClassName}>{post.title}</h2>}
        {post.excerpt && <p className={excerptClassName}>{post.excerpt}</p>}
      </div>
      {post.author && (
        <AuthorAvatarGroup
          authors={[post.author]}
          className={authorClassName}
        />
      )}
    </>
  );

  return (
    <a href={post.url} className={containerClassName}>
      {post.imageSrc && (
        <div className={imageWrapperClassName}>
          <img
            src={post.imageSrc}
            alt={post.imageAlt ?? post.title}
            className={imageClassName}
            loading={isFeatured ? "eager" : "lazy"}
          />
        </div>
      )}
      {isFeatured ? (
        <Card
          className={cn(
            "rounded-none! border-none! gap-4 bg-background-default flex flex-col justify-between",
            !vertical && "order-2 gap-0",
          )}
        >
          {postBody}
        </Card>
      ) : (
        <div
          className={cn(
            "flex flex-col justify-between",
            !vertical && "order-1",
          )}
        >
          {postBody}
        </div>
      )}
    </a>
  );
}
