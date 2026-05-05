import {
  filterAvailableLLMsSections,
  filterPagesForLLMsIndex,
  filterPagesForLLMsSection,
  formatLLMsPageLink,
  getLLMsSection,
  llmsSections,
} from "@/lib/llms";
import { getPageTitleText } from "@/lib/page-title";
import { source } from "@/lib/source";
import { getBaseUrl } from "@/lib/urls";
import { notFound } from "next/navigation";

export const revalidate = false;

function parseSectionSlug(slug: string[] | undefined) {
  if (!slug || slug.length !== 1 || !slug[0].endsWith(".txt")) notFound();
  return slug[0].slice(0, -".txt".length);
}

export async function GET(_req: Request, { params }: RouteContext<"/llms/[...slug]">) {
  const { slug } = await params;
  const sourcePages = filterPagesForLLMsIndex(source.getPages());
  const section = getLLMsSection(parseSectionSlug(slug), sourcePages);
  if (!section) notFound();

  const baseUrl = getBaseUrl();
  const pages = filterPagesForLLMsSection(sourcePages, section).sort((a, b) =>
    getPageTitleText(a.data.title, a.url).localeCompare(getPageTitleText(b.data.title, b.url)),
  );
  const docsList =
    pages.map((page) => formatLLMsPageLink(page, baseUrl)).join("\n") ||
    "_No pages currently match this section._";

  const content = `# Prisma Documentation - ${section.title}

> ${section.description}

${docsList}
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

export function generateStaticParams() {
  return filterAvailableLLMsSections(llmsSections, filterPagesForLLMsIndex(source.getPages())).map(
    (section) => ({
      slug: [`${section.slug}.txt`],
    }),
  );
}
