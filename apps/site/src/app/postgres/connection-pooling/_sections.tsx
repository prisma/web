import Link from "next/link";
import { ProductCta } from "@/components/product/product-cta";
import { ProductHero } from "@/components/product/product-hero";
import { Faq } from "@/components/sections/faq";
import { renderFaqAnswer } from "@/lib/faq-answer";
import { Code } from "./_code";
import {
  type Block,
  POOLING_CLOSER,
  POOLING_FAQ,
  POOLING_H1,
  POOLING_HERO_CHECKS,
  POOLING_PRIMARY_CTA,
  POOLING_RELATED,
  POOLING_SECONDARY_CTA,
  POOLING_SECTIONS,
  POOLING_SUBHEADLINE,
} from "./_content";
import { PoolingDiagram } from "./_diagram";

/** A list item may open with a `**bold lead.**`; the rest uses the FAQ inline syntax. */
function ListItem({ text }: { text: string }) {
  const lead = /^\*\*(.+?)\*\*\s*/.exec(text);
  if (!lead) return <li>{renderFaqAnswer(text)}</li>;
  return (
    <li>
      <strong className="font-semibold text-foreground">{lead[1]}</strong>{" "}
      {renderFaqAnswer(text.slice(lead[0].length))}
    </li>
  );
}

function BodyBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return <p>{renderFaqAnswer(block.text)}</p>;
    case "h3":
      return <h3 className="pt-2 text-xl leading-snug">{block.text}</h3>;
    case "list":
      return (
        <ul className="list-disc space-y-3 pl-5 marker:text-black/25">
          {block.items.map((item) => (
            <ListItem key={item} text={item} />
          ))}
        </ul>
      );
    case "code":
      return <Code code={block.code} lang={block.lang} title={block.title} />;
    case "table":
      return (
        <div className="overflow-x-auto rounded-xl border border-black/[0.08]">
          <table className="w-full min-w-[22rem] border-collapse text-left text-[0.9375rem]">
            <caption className="sr-only">{block.caption}</caption>
            <thead>
              <tr className="border-b border-black/[0.08] bg-black/[0.02]">
                {block.head.map((cell) => (
                  <th key={cell} scope="col" className="px-4 py-3 font-medium text-foreground">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row[0]} className="border-b border-black/[0.06] last:border-b-0">
                  {row.map((cell, index) =>
                    index === 0 ? (
                      <th key={cell} scope="row" className="px-4 py-3 font-medium text-foreground">
                        {cell}
                      </th>
                    ) : (
                      <td key={index} className="px-4 py-3 tabular-nums">
                        {cell}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

// One reading column for the explainer, so code blocks and prose share a
// measure. Inline code and links match the FAQ answers.
const BODY =
  "mx-auto flex max-w-3xl flex-col gap-5 text-base leading-7 text-foreground [&_a]:underline [&_a]:decoration-black/25 [&_a]:underline-offset-4 [&_a:hover]:decoration-foreground [&_p]:text-pretty";

function PoolingBody() {
  return (
    <section className="bg-white px-4 pt-20 pb-8 sm:px-8 sm:pt-28">
      <div className={BODY}>
        <nav aria-label="On this page" className="mb-6 rounded-xl border border-black/[0.06] p-5">
          <p className="text-sm font-medium text-muted-foreground">On this page</p>
          <ol className="mt-2 grid gap-1.5 text-[0.9375rem] sm:grid-cols-2">
            {POOLING_SECTIONS.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="no-underline hover:underline">
                  {section.heading}
                </a>
              </li>
            ))}
            <li>
              <a href="#faq" className="no-underline hover:underline">
                FAQ
              </a>
            </li>
          </ol>
        </nav>
        {POOLING_SECTIONS.map((section) => (
          <div key={section.id} className="flex flex-col gap-5 pb-10">
            <h2
              id={section.id}
              className="scroll-mt-28 text-balance text-[clamp(1.625rem,2.5vw,2.125rem)] leading-[1.15]"
            >
              {section.heading}
            </h2>
            {section.blocks.map((block, index) => (
              <BodyBlock key={index} block={block} />
            ))}
          </div>
        ))}
        <div className="flex flex-col gap-4 border-t border-black/[0.06] pt-10">
          <h2 className="text-xl">Related reading</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {POOLING_RELATED.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function PoolingPage() {
  return (
    <>
      <ProductHero
        name="Prisma Postgres"
        accent="postgres"
        visual={<PoolingDiagram />}
        visualAspect={false}
        headlineMeasure="max-w-[min(18ch,100%)]"
        hero={{
          headline: POOLING_H1,
          subheadline: POOLING_SUBHEADLINE,
          primaryCta: POOLING_PRIMARY_CTA,
          secondaryCta: POOLING_SECONDARY_CTA,
        }}
        checks={POOLING_HERO_CHECKS}
      />
      <PoolingBody />
      <Faq heading="Postgres connection pooling FAQ" items={POOLING_FAQ} id="faq" />
      <ProductCta
        cta={{
          headline: POOLING_CLOSER.headline,
          body: POOLING_CLOSER.body,
          benefits: [...POOLING_CLOSER.benefits],
          primaryCta: POOLING_CLOSER.primaryCta,
          secondaryCta: POOLING_CLOSER.secondaryCta,
        }}
      />
    </>
  );
}
