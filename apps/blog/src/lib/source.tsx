import { blogPosts } from "../../.source/server";
import { type InferPageType, loader, multiple } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";

export const blog = loader({
  baseUrl: "/",
  source: toFumadocsSource(blogPosts, []),
});

export function getPageImage() {
  const segments = ["image.png"];

  return {
    segments,
    url: `/og/${segments.join("/")}`,
  };
}

export async function getLLMText(page: InferPageType<typeof blog>) {
  const processed = await page.data.getText("processed");

  return `# ${page.data.title}

${processed}`;
}

export const getCardImageSrc = (post: any) => {
  const data = post.data as any;
  const rel =
    (data.heroImagePath as string | undefined) ??
    (data.metaImagePath as string | undefined);
  if (rel) {
    // If frontmatter already provides an absolute path, use it directly
    if (rel.startsWith("/")) {
      return rel;
    }
    const base = post.url.startsWith("/") ? post.url : `/${post.url}`;
    const baseClean = base.endsWith("/") ? base.slice(0, -1) : base;
    const relClean = rel.replace(/^\.\//, "").replace(/^\/+/, "");
    return `${baseClean}/${relClean}`;
  }
  const absolute =
    (data.heroImageUrl as string | undefined) ??
    (data.metaImageUrl as string | undefined);
  return absolute ?? null;
};
