import { loader, type InferPageType } from "fumadocs-core/source";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";
import { answerPages } from "../../.source/server";
import { createPageMetadata } from "./page-metadata";
import { getAnswerProduct, type AnswerProduct } from "./answer-products";

export const answerPageSource = loader({
  baseUrl: "/",
  source: toFumadocsSource(answerPages, []),
});

export type AnswerPage = InferPageType<typeof answerPageSource>;

/** List compiled guides newest first, optionally restricted to a product URL prefix. */
export function getAnswerPages(product?: AnswerProduct) {
  return answerPageSource
    .getPages()
    .filter((page) => !product || page.slugs[0] === product)
    .sort((a, b) => b.data.date.localeCompare(a.data.date) || a.url.localeCompare(b.url));
}

/** Look up a compiled guide using its product and filename-derived slug. */
export function getAnswerPage(product: AnswerProduct, slug: string) {
  return answerPageSource.getPage([product, slug]);
}

/** Build article metadata with a canonical URL and the same question as the visible H1. */
export function getAnswerPageMetadata(page: AnswerPage) {
  const product = getAnswerProduct(page.slugs[0]);
  const metadata = createPageMetadata({
    title: page.data.title,
    description: page.data.description,
    path: page.url,
    ogKicker: product.guidesTitle,
    ogAccent: product.accent,
  });

  // Answer pages keep the question identical in the title and H1.
  return {
    ...metadata,
    title: { absolute: page.data.title },
    openGraph: {
      ...metadata.openGraph,
      type: "article" as const,
      title: page.data.title,
      publishedTime: page.data.date,
      modifiedTime: page.data.updatedAt,
      authors: [page.data.authorUrl],
    },
    twitter: { ...metadata.twitter, title: page.data.title },
  };
}

/** Format an ISO calendar date in UTC so readers in every time zone see the same day. */
export function formatAnswerDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
