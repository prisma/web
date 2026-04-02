"use client";

import {
  PostCard as SharedPostCard,
  type PostCardItem as SharedPostCardItem,
} from "@prisma-docs/ui/components/post-card";
import { type AuthorProfile } from "@prisma-docs/ui/components/author-avatar-group";
import { getAuthorProfiles } from "@/lib/authors";
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
  // Transform blog-specific post data to shared component format
  const authorProfiles = post.author ? getAuthorProfiles([post.author]) : [];
  const author: AuthorProfile | null =
    authorProfiles.length > 0
      ? {
          name: authorProfiles[0].name,
          imageSrc: authorProfiles[0].imageSrc
            ? withBlogBasePathForImageSrc(authorProfiles[0].imageSrc)
            : null,
        }
      : null;

  const badge =
    post.tags && post.tags.length > 0
      ? formatTag(
          currentCategory !== "show-all" ? currentCategory : post.tags[0],
        )
      : null;

  const sharedPost: SharedPostCardItem = {
    url: post.url,
    title: post.title,
    date: formatDate(new Date(post.date).toISOString()),
    excerpt: post.excerpt,
    author,
    imageSrc: post.imageSrc ? withBlogBasePathForImageSrc(post.imageSrc) : null,
    imageAlt: post.imageAlt,
    badge,
  };

  return <SharedPostCard post={sharedPost} featured={featured} />;
}
