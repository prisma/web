import { notFound } from "next/navigation";
import { AnswerPage } from "@/components/answer-pages/answer-page";
import { getAnswerPage, getAnswerPageMetadata, getAnswerPages } from "@/lib/answer-pages";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;

/** Prerender each Compute guide registered by the MDX collection. */
export function generateStaticParams() {
  return getAnswerPages("compute").map((page) => ({ slug: page.slugs[1] }));
}

/** Resolve article metadata, returning 404 when the Compute guide slug is unknown. */
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const page = getAnswerPage("compute", slug);
  if (!page) notFound();
  return getAnswerPageMetadata(page);
}

/** Render the requested Compute guide through the shared answer-page template. */
export default async function ComputeAnswerPage({ params }: Props) {
  const { slug } = await params;
  const page = getAnswerPage("compute", slug);
  if (!page) notFound();
  return <AnswerPage page={page} />;
}
