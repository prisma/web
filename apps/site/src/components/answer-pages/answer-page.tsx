import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import { PrismButton } from "@/components/brand/prism-button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { renderFaqAnswer } from "@/lib/faq-answer";
import { createFaqStructuredData } from "@/lib/structured-data";
import { getBaseUrl } from "@/lib/url";
import { formatAnswerDate, type AnswerPage as AnswerPageContent } from "@/lib/answer-pages";
import { getMDXComponents } from "@/mdx-components";
import { EnvironmentDiagram } from "./environment-diagram";
import { getAnswerProduct } from "@/lib/answer-products";

// Conversion Factory's article structure, using the site's brand components.
// The reference's empty header image is deliberately absent.
/** Render a guide with article metadata, heading navigation and server-rendered FAQ answers. */
export function AnswerPage({ page }: { page: AnswerPageContent }) {
  const { data } = page;
  const product = getAnswerProduct(page.slugs[0]);
  const Body = data.body;
  const url = new URL(page.url, getBaseUrl()).toString();
  const toc = [
    ...data.toc.filter((item) => item.depth === 2),
    { title: "Frequently asked questions", url: "#faq" },
  ];

  return (
    <article className="bg-background pb-24 pt-32 sm:pt-40">
      <JsonLd
        id="answer-article-structured-data"
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: data.title,
          description: data.description,
          url,
          mainEntityOfPage: url,
          datePublished: data.date,
          dateModified: data.updatedAt,
          author: { "@type": "Person", name: data.author, url: data.authorUrl },
          publisher: { "@id": `${getBaseUrl()}#organization` },
        }}
      />
      <JsonLd
        id="answer-faq-structured-data"
        data={createFaqStructuredData(page.url, data.faq, data.title)}
      />

      <header className="mx-auto max-w-site px-6 sm:px-8">
        <div className="rounded-2xl bg-muted/50 px-6 py-10 sm:px-12 sm:py-14 lg:px-16">
          <nav
            aria-label="Breadcrumb"
            className="mb-7 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
          >
            <Link href={product.path} className="hover:text-foreground">
              {product.name}
            </Link>
            <ChevronRight className="size-3.5" aria-hidden />
            <Link href={product.guidesPath} className="hover:text-foreground">
              Guides
            </Link>
          </nav>
          <h1 className="max-w-4xl text-balance font-heading text-3xl leading-[1.15] font-medium tracking-[-0.03em] sm:text-4xl lg:text-5xl">
            {data.title}
          </h1>
          <p className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-foreground">
            {renderFaqAnswer(data.summary)}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span>
              By{" "}
              <a
                href={data.authorUrl}
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                {data.author}
              </a>
            </span>
            <time dateTime={data.date}>{formatAnswerDate(data.date)}</time>
            <span>{data.readingTime}</span>
            {data.updatedAt !== data.date ? (
              <span>
                Updated <time dateTime={data.updatedAt}>{formatAnswerDate(data.updatedAt)}</time>
              </span>
            ) : null}
          </div>
        </div>
      </header>

      <div className="mx-auto mt-12 grid max-w-site gap-10 px-6 sm:px-8 lg:mt-16 lg:grid-cols-[220px_minmax(0,760px)] lg:gap-14 xl:gap-20">
        <aside className="hidden lg:block">
          <nav
            aria-label="On this page"
            className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-3"
          >
            <p className="mb-4 text-sm font-semibold">On this page</p>
            <ul className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              {toc.map((item) => (
                <li key={item.url}>
                  <a href={item.url} className="transition-colors hover:text-foreground">
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="min-w-0 max-w-3xl">
          <div className="answer-prose prose max-w-none text-foreground prose-headings:scroll-mt-28 prose-headings:font-heading prose-headings:font-medium prose-headings:text-balance prose-h2:mt-14 prose-h2:text-2xl prose-h3:mt-8 prose-h3:text-xl prose-p:text-pretty prose-p:leading-[1.8] prose-a:text-foreground prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-prism-cyan-700 prose-strong:font-semibold prose-li:leading-[1.8] prose-code:break-words prose-th:text-left">
            <Body components={getMDXComponents({ EnvironmentDiagram })} />
          </div>

          <section id="faq" aria-labelledby="faq-heading" className="mt-16 scroll-mt-28">
            <h2 id="faq-heading" className="font-heading text-2xl font-medium">
              Frequently asked questions
            </h2>
            <Accordion type="single" collapsible className="mt-6">
              {data.faq.map(({ question, answer }, index) => (
                <AccordionItem key={question} value={`faq-${index}`}>
                  <AccordionTrigger className="text-base">{question}</AccordionTrigger>
                  <AccordionContent className="text-base leading-relaxed text-foreground">
                    {renderFaqAnswer(answer)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <section
            aria-labelledby="answer-cta-heading"
            className="mt-16 rounded-xl bg-muted/60 p-7 sm:p-10"
          >
            <h2 id="answer-cta-heading" className="text-balance font-heading text-2xl font-medium">
              {data.cta.title}
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-foreground">
              {data.cta.description}
            </p>
            <div className="mt-7">
              <PrismButton href={data.cta.href} ctaLocation="answer-page">
                {data.cta.label}
              </PrismButton>
            </div>
          </section>

          <nav aria-labelledby="related-guides-heading" className="mt-14">
            <h2 id="related-guides-heading" className="font-heading text-xl font-medium">
              Related guides
            </h2>
            <ul className="mt-5 divide-y divide-border border-y border-border">
              {data.related.map(({ title, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group flex items-center justify-between gap-4 py-4 text-sm hover:text-prism-cyan-700"
                  >
                    {title}
                    <ArrowRight
                      className="size-4 shrink-0 transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </article>
  );
}
