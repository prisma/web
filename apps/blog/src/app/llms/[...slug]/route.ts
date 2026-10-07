import { buildLlmsYearContent, getPostYears } from "@/lib/llms";
import { getLlmsPosts } from "@/lib/llms-source";
import { getBaseUrl } from "@/lib/url";
import { notFound } from "next/navigation";

export const revalidate = false;
export const dynamicParams = false;

/** `/blog/llms/2026.txt` -> 2026. Anything else is not a year index. */
function parseYear(slug: string[] | undefined): number {
  const match = slug?.length === 1 ? /^(\d{4})\.txt$/.exec(slug[0]) : null;
  if (!match) notFound();
  return Number(match[1]);
}

export async function GET(_req: Request, { params }: RouteContext<"/llms/[...slug]">) {
  const { slug } = await params;
  const year = parseYear(slug);
  const posts = getLlmsPosts();
  if (!getPostYears(posts).includes(year)) notFound();

  return new Response(buildLlmsYearContent(year, posts, getBaseUrl()), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

export function generateStaticParams() {
  return getPostYears(getLlmsPosts()).map((year) => ({ slug: [`${year}.txt`] }));
}
