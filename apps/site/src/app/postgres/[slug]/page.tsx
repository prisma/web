import { notFound } from "next/navigation";
import { AnswerPage } from "@/components/answer-pages/answer-page";
import { getAnswerPage, getAnswerPageMetadata, getAnswerPages } from "@/lib/answer-pages";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAnswerPages("postgres").map((page) => ({ slug: page.slugs[1] }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const page = getAnswerPage("postgres", slug);
  if (!page) notFound();
  return getAnswerPageMetadata(page);
}

export default async function PostgresAnswerPage({ params }: Props) {
  const { slug } = await params;
  const page = getAnswerPage("postgres", slug);
  if (!page) notFound();
  return <AnswerPage page={page} />;
}
