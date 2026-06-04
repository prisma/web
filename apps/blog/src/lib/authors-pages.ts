import { blog } from "./source";
import { getAuthorImageSrc, normalizeAuthorName, toAuthorSlug } from "./authors";

type BlogPage = ReturnType<typeof blog.getPages>[number];

export type AuthorProfile = {
  slug: string;
  name: string;
  imageSrc: string | null;
  postCount: number;
};

function readAuthors(page: BlogPage): string[] {
  const raw = (page.data as { authors?: unknown }).authors;
  if (!Array.isArray(raw)) return [];
  return raw.filter((a): a is string => typeof a === "string" && a.trim().length > 0);
}

/**
 * Resolves all unique author slugs across the blog corpus. Each slug maps to
 * a display name (the first non-normalized form encountered) and the count
 * of posts in which the author appears.
 */
export function getAllAuthorProfiles(): AuthorProfile[] {
  const bySlug = new Map<string, { name: string; count: number }>();
  for (const page of blog.getPages()) {
    for (const name of readAuthors(page)) {
      const slug = toAuthorSlug(name);
      if (!slug) continue;
      const entry = bySlug.get(slug);
      if (entry) {
        entry.count += 1;
      } else {
        bySlug.set(slug, { name: name.trim(), count: 1 });
      }
    }
  }
  return Array.from(bySlug.entries())
    .map(([slug, { name, count }]) => ({
      slug,
      name,
      imageSrc: getAuthorImageSrc(name),
      postCount: count,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function findAuthorProfile(slug: string): AuthorProfile | null {
  const normalized = slug.toLowerCase();
  const all = getAllAuthorProfiles();
  return all.find((p) => p.slug === normalized) ?? null;
}

/**
 * Returns all posts (newest first) that list the author whose slug matches.
 */
export function getPostsByAuthorSlug(slug: string): BlogPage[] {
  const normalized = slug.toLowerCase();
  return blog
    .getPages()
    .filter((page) => readAuthors(page).some((name) => toAuthorSlug(name) === normalized))
    .sort((a, b) => {
      const ad = new Date((a.data as { date?: Date }).date ?? 0).getTime();
      const bd = new Date((b.data as { date?: Date }).date ?? 0).getTime();
      return bd - ad;
    });
}

export { normalizeAuthorName, toAuthorSlug };
