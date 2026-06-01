import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

import { Avatar } from "@prisma/eclipse";

import { blog } from "@/lib/source";
import {
  findAuthorProfile,
  getAllAuthorProfiles,
  getPostsByAuthorSlug,
} from "@/lib/authors-pages";
import { withBlogBasePath, withBlogBasePathForImageSrc } from "@/lib/url";
import { BlogGrid, type BlogCardItem } from "@/components/BlogGrid";
import { BLOG_HOME_TITLE } from "@/lib/blog-metadata";

export const revalidate = false;

interface AuthorPageParams {
  slug: string;
}

function buildCardItems(slug: string): BlogCardItem[] {
  const posts = getPostsByAuthorSlug(slug);
  return posts.map((post) => {
    const data = post.data as {
      title?: string;
      date?: Date | string;
      metaDescription?: string;
      authors?: string[];
      heroImagePath?: string;
      heroImageAlt?: string;
      tags?: string[];
    };

    let dateISO = "";
    if (data.date) {
      const dateObj = new Date(data.date);
      if (!Number.isNaN(dateObj.getTime())) {
        dateISO = dateObj.toISOString();
      }
    }

    const authors = Array.isArray(data.authors)
      ? data.authors.filter((a): a is string => typeof a === "string")
      : [];

    return {
      url: withBlogBasePath(post.url),
      title: data.title ?? "",
      date: dateISO,
      excerpt: data.metaDescription,
      author: authors[0] ?? null,
      authors,
      imageSrc: withBlogBasePathForImageSrc(data.heroImagePath ?? ""),
      imageAlt: data.heroImageAlt ?? data.title ?? "",
      tags: data.tags,
    };
  });
}

export default async function AuthorPage(props: { params: Promise<AuthorPageParams> }) {
  const { slug } = await props.params;
  const profile = findAuthorProfile(slug);
  if (!profile) notFound();

  const items = buildCardItems(slug);
  const avatarSrc = profile.imageSrc ? withBlogBasePathForImageSrc(profile.imageSrc) : null;

  return (
    <main className="flex-1 w-full max-w-249 mx-auto px-4 py-8 z-1">
      <Link href="/" className="text-fd-primary hover:underline text-sm">
        ← Back to Blog
      </Link>

      <header className="mt-6 mb-10 flex items-center gap-4">
        {avatarSrc ? (
          <Avatar format="image" src={avatarSrc} alt={profile.name} size="xl" />
        ) : null}
        <div>
          <div className="text-xs uppercase tracking-wide text-foreground-neutral-weak font-semibold mb-2">
            Author · {items.length} {items.length === 1 ? "post" : "posts"}
          </div>
          <h1 className="type-title-3xl md:type-title-4xl text-foreground-neutral break-words hyphens-auto">
            {profile.name}
          </h1>
        </div>
      </header>

      <BlogGrid items={items} currentCategory="show-all" />
    </main>
  );
}

export function generateStaticParams(): AuthorPageParams[] {
  return getAllAuthorProfiles().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<AuthorPageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const profile = findAuthorProfile(slug);
  if (!profile) return {};

  const title = `${profile.name} — ${BLOG_HOME_TITLE}`;
  const description = `Posts by ${profile.name} on the Prisma blog.`;

  return {
    title,
    description,
    alternates: { canonical: withBlogBasePath(`/author/${profile.slug}`) },
    openGraph: {
      type: "website",
      title,
      description,
      url: withBlogBasePath(`/author/${profile.slug}`),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

void blog;
