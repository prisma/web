import { getAllContent, getContentBySlug } from "@/lib/content";

// Changelog entries, ported from apps/site/content/changelog (fumadocs there,
// plain gray-matter + next-mdx-remote here to match this app's content stack).

export type ChangelogFrontmatter = {
  title: string;
  date: string;
  headline?: string;
  tags?: string[];
  metaDescription?: string;
};

// Entry images still live in apps/site/public/changelog (~78MB — deliberately
// not duplicated into this app). Until the asset cutover, point them at the
// live site, which serves the same paths today.
export function rewriteChangelogAssets(content: string) {
  return content.replaceAll("](/changelog/image-", "](https://www.prisma.io/changelog/image-");
}

export function getChangelogEntries() {
  return getAllContent<ChangelogFrontmatter>("changelog").sort(
    (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime(),
  );
}

export function getChangelogEntry(slug: string) {
  return getContentBySlug<ChangelogFrontmatter>("changelog", slug);
}

export function formatChangelogDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

// First real paragraph of the body, markdown stripped — used as the index
// preview. Ported (simplified) from the old site's changelog-source.
export function extractPreview(content: string, maxLength = 200) {
  const lines = content.split("\n");
  let inCode = false;
  const paragraph: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("```")) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    if (!trimmed) {
      if (paragraph.length) break;
      continue;
    }
    if (/^(#|!\[|- |\* |>|\d+\.\s|<)/.test(trimmed)) {
      if (paragraph.length) break;
      continue;
    }
    paragraph.push(trimmed);
  }

  const text = paragraph
    .join(" ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) return null;
  return text.length <= maxLength ? text : `${text.slice(0, maxLength).trimEnd()}…`;
}
