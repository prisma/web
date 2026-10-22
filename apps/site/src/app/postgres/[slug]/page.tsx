import { notFound } from "next/navigation";
import { AnswerPage } from "@/components/answer-pages/answer-page";
import { getAnswerPage, getAnswerPageMetadata, getAnswerPages } from "@/lib/answer-pages";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

/** Prerender each Postgres guide registered by the MDX collection. */
export function generateStaticParams() {
  return getAnswerPages("postgres").map((page) => ({ slug: page.slugs[1] }));
}

/** Resolve a guide's article metadata, returning 404 when the slug is unknown. */
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const page = getAnswerPage("postgres", slug);
  if (!page) notFound();
  return getAnswerPageMetadata(page);
}

/** Render the guide selected by the URL through the shared answer-page template. */
export default async function PostgresAnswerPage({ params }: Props) {
  const { slug } = await params;
  const page = getAnswerPage("postgres", slug);
  if (!page) notFound();
  return <AnswerPage page={page} />;
}
