import { getLLMText } from "@/lib/get-llm-text";
import { source, sourceV6 } from "@/lib/source";
import { notFound } from "next/navigation";

export const revalidate = false;

function resolvePage(slug: string[] | undefined) {
  const slugs = slug ?? [];

  return (
    source.getPage(slugs) ||
    sourceV6.getPage(slugs) ||
    (slugs[0] === "v6" ? sourceV6.getPage(slugs.slice(1)) : undefined)
  );
}

export async function GET(_req: Request, { params }: RouteContext<"/llms.mdx/[[...slug]]">) {
  const { slug } = await params;
  const page = resolvePage(slug);
  if (!page) notFound();

  const content = await getLLMText(page);

  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}

export function generateStaticParams() {
  // Only pre-render leaf pages to avoid file/dir conflicts during static export.
  // A slug is considered non-leaf if it is a prefix of any other slug.
  const v7Params = source.generateParams();
  const v6Params = sourceV6
    .generateParams()
    .map((p) => ({ ...p, slug: ["v6", ...(p.slug ?? [])] }));

  // Deduplicate identical slugs from v7 and v6
  const seen = new Set<string>();
  const allParams = [...v7Params, ...v6Params].filter((p) => {
    const key = JSON.stringify(p.slug ?? []);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const allSlugs = allParams.map((p) => p.slug ?? []);
  const isPrefix = (a: string[], b: string[]) =>
    a.length < b.length && a.every((seg, i) => seg === b[i]);

  return allParams.filter((p) => {
    const s = p.slug ?? [];
    return !allSlugs.some((other) => isPrefix(s, other));
  });
}
