import { buildLlmsYearContent, getPostYears } from "@/lib/llms";
import { getLlmsPosts } from "@/lib/llms-source";
import { getBaseUrl } from "@/lib/url";
import { notFound } from "next/navigation";

export const revalidate = false;
/**
 * Only the years generateStaticParams lists exist: Next answers any other
 * `/blog/llms/*` path with a 404 before this handler runs.
 */
export const dynamicParams = false;

let cached: { posts: ReturnType<typeof getLlmsPosts>; years: number[] } | undefined;

/** Built once per process: every route call and every static param shares it. */
function getIndex() {
  cached ??= (() => {
    const posts = getLlmsPosts();
    return { posts, years: getPostYears(posts) };
  })();
  return cached;
}

/** `/blog/llms/2026.txt` -> 2026, or null for anything that is not a year file. */
function parseYear(slug: string[] | undefined): number | null {
  const match = slug?.length === 1 ? /^(\d{4})\.txt$/.exec(slug[0]) : null;
  return match ? Number(match[1]) : null;
}

export async function GET(_req: Request, { params }: RouteContext<"/llms/[...slug]">) {
  const { slug } = await params;
  const { posts, years } = getIndex();
  const year = parseYear(slug);
  // Unreachable while dynamicParams is false; kept so flipping it cannot serve an empty file.
  if (year === null || !years.includes(year)) notFound();

  return new Response(buildLlmsYearContent(year, posts, getBaseUrl()), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

export function generateStaticParams() {
  return getIndex().years.map((year) => ({ slug: [`${year}.txt`] }));
}
