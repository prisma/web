import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentRoot = path.join(process.cwd(), "content");

export function getContentSlugs(dir: string): string[] {
  const fullPath = path.join(contentRoot, dir);
  if (!fs.existsSync(fullPath)) return [];
  return fs
    .readdirSync(fullPath)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getContentBySlug<T extends Record<string, unknown>>(
  dir: string,
  slug: string,
): { frontmatter: T; content: string; slug: string } | null {
  const fullPath = path.join(contentRoot, dir, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;
  const raw = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(raw);
  return { frontmatter: data as T, content, slug };
}

export function getAllContent<T extends Record<string, unknown>>(
  dir: string,
  sortField?: keyof T,
): { frontmatter: T; content: string; slug: string }[] {
  const slugs = getContentSlugs(dir);
  const items = slugs
    .map((slug) => getContentBySlug<T>(dir, slug))
    .filter((item): item is NonNullable<typeof item> => item !== null);

  if (sortField) {
    items.sort((a, b) => {
      const aVal = a.frontmatter[sortField];
      const bVal = b.frontmatter[sortField];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return aVal.localeCompare(bVal);
      }
      return 0;
    });
  }

  return items;
}
