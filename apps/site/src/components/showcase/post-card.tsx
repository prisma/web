"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge, Card } from "@prisma/eclipse";
import { cn } from "@prisma-docs/ui/lib/cn";

import { formatDate, formatTag } from "@/lib/format";

export type PostCardItem = {
  url: string;
  title: string;
  excerpt?: string | null;
  author?: string | null;
  authorSrc?: string | null;
  imageSrc?: string | null;
  imageAlt?: string | null;
  tags?: string[];
};

export function PostCard({
  post,
  className,
  featured = false,
}: {
  post: PostCardItem;
  className?: string;
  featured?: boolean;
}) {
  const isFeatured = featured;
  const imageSizes = isFeatured ? "(min-width: 640px) 50vw, 100vw" : "384px";

  const containerClassName = cn(
    "group grid overflow-hidden grid-rows-[216px_1fr] bg-background-default rounded-square border border-stroke-neutral shadow-box-low",
    className,
  );
  const imageClassName = cn(
    "object-cover transition-transform duration-300 group-hover:scale-[1.02] h-[216px]! w-auto",
  );
  const imageWrapperClassName = cn(
    "relative aspect-video w-full h-full order-1 overflow-hidden",
  );

  const titleClassName = cn(
    "text-foreground-neutral font-mona-sans text-xl font-bold",
  );
  const excerptClassName = cn(
    "text-sm leading-[20px]! text-foreground-neutral-weak text-pretty",
  );

  const postBody = (
    <>
      {post?.title && <h2 className={titleClassName}>{post.title}</h2>}
      {post?.excerpt && <p className={excerptClassName}>{post.excerpt}</p>}
    </>
  );

  return (
    <Link href={post.url} className={containerClassName}>
      {post.imageSrc && (
        <div className={imageWrapperClassName}>
          <Image
            src={post.imageSrc as string}
            alt={post.imageAlt ?? post.title}
            fill
            sizes={imageSizes}
            className={imageClassName}
            loading={isFeatured ? "eager" : undefined}
            priority={isFeatured}
          />
        </div>
      )}
      <Card className="order-2 rounded-none! border-none! bg-background-default flex flex-col gap-4! overflow-hidden">
        {postBody}
      </Card>
    </Link>
  );
}
