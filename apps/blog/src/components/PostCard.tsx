'use client';

import Image from "next/image";
import Link from "next/link";
import { Badge, Card } from "@prisma/eclipse";

import { AuthorAvatarGroup } from "@/components/AuthorAvatarGroup";
import { formatDate, formatTag } from "@/lib/format";
import { withBlogBasePathForImageSrc } from "@/lib/url";

type PostCardItem = {
  url: string;
  title: string;
  date: string;
  description?: string | null;
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

  return (
    <Link
      href={post.url}
      className={
        isFeatured
          ? "group grid grid-cols-1 md:grid-cols-2 gap-4 bg-background-default rounded-square overflow-hidden border border-stroke-neutral shadow-box-low"
          : "group grid sm:grid-cols-[1fr_384px] overflow-hidden border-b pb-4 sm:pb-6 border-stroke-neutral gap-8"
      }
    >
      {isFeatured && post.imageSrc && (
        <div
          className={
            isFeatured
              ? "relative w-full h-full aspect-video"
              : "relative max-w-96 aspect-video w-full h-full hidden sm:block"
          }
        >
          <Image
            src={withBlogBasePathForImageSrc(post.imageSrc as string)}
            alt={post.imageAlt ?? post.title}
            fill
            sizes={isFeatured ? "(min-width: 640px) 50vw, 100vw" : "384px"}
            className={
              isFeatured
                ? "object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                : "rounded-square object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            }
            loading={isFeatured ? "eager" : undefined}
            priority={isFeatured}
          />
        </div>
      )}
      {isFeatured ? (
        <Card className="rounded-none! border-none! gap-0 bg-background-default flex flex-col justify-between">
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
            {post.title && (
              <h2 className="text-2xl text-foreground-neutral font-bold font-mona-sans mt-4 mb-2">
                {post.title}
              </h2>
            )}
            {post.description && (
              <p className="text-sm text-foreground-neutral-weak leading-[20px]! line-clamp-2">
                {post.description}
              </p>
            )}
          </div>
          {post.author && (
            <AuthorAvatarGroup
              authors={[post.author]}
              className="mt-auto flex items-center gap-2 font-semibold text-sm"
            />
          )}
        </Card>
      ) : (
        <div className="flex flex-col justify-between">
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
          {post.title && (
            <h2
              className={
                isFeatured
                  ? "text-2xl text-foreground-neutral font-bold font-mona-sans mt-4 mb-2"
                  : "text-md  md:text-lg text-foreground-neutral font-[650] sm:font-bold font-mona-sans mt-4 mb-2"
              }
            >
              {post.title}
            </h2>
          )}
          {post.description && (
            <p
              className={
                isFeatured
                  ? "text-sm text-foreground-neutral-weak leading-[20px]! line-clamp-2"
                  : "text-sm text-foreground-neutral-weak line-clamp-2"
              }
            >
              {post.description}
            </p>
          )}
        </div>
        {post.author && (
          <AuthorAvatarGroup
            authors={[post.author]}
            className={
              isFeatured
                ? "mt-auto flex items-center gap-2 font-semibold text-sm"
                : "hidden sm:flex items-center gap-2 font-semibold text-sm"
            }
          />
        )}
        </div>
      )}
      {!isFeatured && post.imageSrc && (
        <div
          className={
            isFeatured
              ? "relative w-full h-full aspect-video"
              : "relative max-w-96 aspect-video w-full h-full hidden sm:block"
          }
        >
          <Image
            src={withBlogBasePathForImageSrc(post.imageSrc as string)}
            alt={post.imageAlt ?? post.title}
            fill
            sizes={isFeatured ? "(min-width: 640px) 50vw, 100vw" : "384px"}
            className={
              isFeatured
                ? "object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                : "rounded-square object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            }
            loading={isFeatured ? "eager" : undefined}
            priority={isFeatured}
          />
        </div>
      )}
    </Link>
  );
}
