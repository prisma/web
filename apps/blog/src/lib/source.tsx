import { blogPosts } from "../../.source/server";
import { type InferPageType, loader, multiple } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server';

export const blog = loader({
  baseUrl: '/',
  source: toFumadocsSource(blogPosts, []),
});

// Combined loader for search across docs + blog

/* export const search = loader(blog, { */
/*   // Build URLs from virtual path segments directly: "/docs/..." and "/blog/..." */
/*   baseUrl: '/', */
/*   url: (slugs) => `/${slugs.join('/')}`, */
/* }); */
/**/
export function getPageImage(page: InferPageType<typeof blog>) {
  const segments = [...page.slugs, "image.png"];

  return {
    segments,
    url: `/og/docs/${segments.join("/")}`,
  };
}

export async function getLLMText(page: InferPageType<typeof blog>) {
  const processed = await page.data.getText("processed");

  return `# ${page.data.title}

${processed}`;
}

