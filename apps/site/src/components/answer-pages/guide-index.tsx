import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAnswerPages } from "@/lib/answer-pages";
import { answerProducts, type AnswerProduct } from "@/lib/answer-products";
import { createPageMetadata } from "@/lib/page-metadata";

/** Build canonical metadata for a registered product's guide directory. */
export function getGuideIndexMetadata(product: AnswerProduct) {
  const config = answerProducts[product];
  return createPageMetadata({
    title: config.guidesTitle,
    description: config.description,
    path: config.guidesPath,
    ogKicker: config.name,
    ogAccent: config.accent,
  });
}

/** List a product's guide collection using the shared article-directory layout. */
export function GuideIndex({ product }: { product: AnswerProduct }) {
  const config = answerProducts[product];
  return (
    <section className="mx-auto max-w-site px-6 pb-24 pt-36 sm:px-8 sm:pt-44">
      <Link href={config.path} className="text-sm text-muted-foreground hover:text-foreground">
        {config.name}
      </Link>
      <h1 className="mt-6 font-heading text-4xl font-medium tracking-tight sm:text-5xl">
        {config.guidesTitle}
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
        {config.description}
      </p>
      <ul className="mt-14 max-w-4xl divide-y divide-border border-y border-border">
        {getAnswerPages(product).map((page) => (
          <li key={page.url}>
            <Link href={page.url} className="group flex items-start justify-between gap-6 py-8">
              <div>
                <h2 className="text-balance font-heading text-xl font-medium group-hover:text-prism-cyan-700 sm:text-2xl">
                  {page.data.title}
                </h2>
                <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
                  {page.data.description}
                </p>
                <p className="mt-4 text-sm text-muted-foreground">{page.data.readingTime}</p>
              </div>
              <ArrowRight
                className="mt-1 size-5 shrink-0 transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
