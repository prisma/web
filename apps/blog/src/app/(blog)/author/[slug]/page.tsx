import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

import { Avatar } from "@prisma/eclipse";
import { JsonLd } from "@prisma-docs/ui/components/json-ld";

import { blog } from "@/lib/source";
import { findAuthorProfile, getAllAuthorProfiles, getPostsByAuthorSlug } from "@/lib/authors-pages";
import { getAuthorBioBySlug } from "@/lib/author-bios";
import { getBaseUrl, withBlogBasePath, withBlogBasePathForImageSrc } from "@/lib/url";
import { AuthorSocialLinks } from "@/components/AuthorBio";
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

function buildAuthorJsonLd(
  profile: NonNullable<ReturnType<typeof findAuthorProfile>>,
  bio: ReturnType<typeof getAuthorBioBySlug>,
  avatarSrc: string | null,
): object {
  const profileUrl = new URL(withBlogBasePath(`/author/${profile.slug}`), getBaseUrl()).toString();

  const person: Record<string, unknown> = {
    "@type": "Person",
    "@id": `${profileUrl}#person`,
    name: profile.name,
    url: profileUrl,
  };
  if (bio?.bio) person.description = bio.bio;
  if (avatarSrc) person.image = new URL(avatarSrc, getBaseUrl()).toString();
  const sameAs = bio?.socials.map((s) => s.url) ?? [];
  if (sameAs.length > 0) person.sameAs = sameAs;

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: profileUrl,
    mainEntity: person,
  };
}

export default async function AuthorPage(props: { params: Promise<AuthorPageParams> }) {
  const { slug } = await props.params;
  const profile = findAuthorProfile(slug);
  if (!profile) notFound();

  const items = buildCardItems(slug);
  const avatarSrc = profile.imageSrc ? withBlogBasePathForImageSrc(profile.imageSrc) : null;
  const bio = getAuthorBioBySlug(slug);

  return (
    <main className="flex-1 w-full max-w-249 mx-auto px-4 py-8 z-1">
      <JsonLd id="author-structured-data" data={buildAuthorJsonLd(profile, bio, avatarSrc)} />
      <Link href="/" className="text-fd-primary hover:underline text-sm">
        ← Back to Blog
      </Link>

      <header className="mt-6 mb-10 flex flex-col gap-4 sm:flex-row sm:items-start">
        {avatarSrc ? <Avatar format="image" src={avatarSrc} alt={profile.name} size="xl" /> : null}
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wide text-foreground-neutral-weak font-semibold mb-2">
            Author · {items.length} {items.length === 1 ? "post" : "posts"}
          </div>
          <h1 className="type-title-3xl md:type-title-4xl text-foreground-neutral break-words hyphens-auto">
            {profile.name}
          </h1>
          {bio ? <p className="mt-3 max-w-2xl text-foreground-neutral-weak">{bio.bio}</p> : null}
          {bio ? (
            <AuthorSocialLinks socials={bio.socials} name={profile.name} className="mt-3" />
          ) : null}
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

  const bio = getAuthorBioBySlug(slug);
  const title = `${profile.name} — ${BLOG_HOME_TITLE}`;
  const description = bio?.bio ?? `Posts by ${profile.name} on the Prisma blog.`;

  return {
    title,
    description,
    alternates: { canonical: withBlogBasePath(`/author/${profile.slug}`) },
    openGraph: {
      siteName: "Prisma",
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
