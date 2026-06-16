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
  authors?: string[] | null;
  authorSrc?: string | null;
  imageSrc?: string | null;
  imageAlt?: string | null;
  tags?: string[];
};

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
  const sourceAuthorNames =
    post.authors && post.authors.length > 0 ? post.authors : post.author ? [post.author] : [];
  const authorProfiles: AuthorProfile[] = getAuthorProfiles(sourceAuthorNames).map((profile) => ({
    name: profile.name,
    imageSrc: profile.imageSrc ? withBlogBasePathForImageSrc(profile.imageSrc) : null,
  }));
  const author: AuthorProfile | null = authorProfiles[0] ?? null;

  const badge =
    post.tags && post.tags.length > 0
      ? formatTag(currentCategory !== "show-all" ? currentCategory : post.tags[0])
      : null;

  const sharedPost: SharedPostCardItem = {
    url: post.url,
    title: post.title,
    date: formatDate(new Date(post.date).toISOString()),
    excerpt: post.excerpt,
    author,
    authors: authorProfiles,
    imageSrc: post.imageSrc ? withBlogBasePathForImageSrc(post.imageSrc) : null,
    imageAlt: post.imageAlt,
    badge,
  };

  return <SharedPostCard post={sharedPost} featured={featured} vertical={vertical} />;
}
