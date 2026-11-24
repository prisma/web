import Link from "next/link";
import { ProductCta } from "@/components/product/product-cta";
import { ProductHero } from "@/components/product/product-hero";
import { Faq } from "@/components/sections/faq";
import { renderFaqAnswer } from "@/lib/faq-answer";
import { Code } from "./_code";
import {
  type Block,
  CONNSTRING_CLOSER,
  CONNSTRING_FAQ,
  CONNSTRING_H1,
  CONNSTRING_HERO_CHECKS,
  CONNSTRING_PRIMARY_CTA,
  CONNSTRING_RELATED,
  CONNSTRING_SECONDARY_CTA,
  CONNSTRING_SECTIONS,
  CONNSTRING_SUBHEADLINE,
} from "./_content";
import { ConnectionStringDiagram } from "./_diagram";

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
          <table className="w-full min-w-[36rem] border-collapse text-left text-[0.9375rem]">
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
                        {renderFaqAnswer(cell)}
                      </th>
                    ) : (
                      <td
                        key={index}
                        className={index === 1 ? "px-4 py-3 whitespace-nowrap" : "px-4 py-3"}
                      >
                        {renderFaqAnswer(cell)}
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
  "mx-auto flex max-w-3xl flex-col gap-5 text-base leading-7 text-foreground [&_a]:underline [&_a]:decoration-black/25 [&_a]:underline-offset-4 [&_a:hover]:decoration-foreground [&_p]:text-pretty [&>*]:min-w-0 [&_p>code]:[overflow-wrap:anywhere] [&_li_code]:[overflow-wrap:anywhere]";

function ConnectionStringBody() {
  return (
    <section className="bg-white px-4 pt-20 pb-8 sm:px-8 sm:pt-28">
      <div className={BODY}>
        <nav aria-label="On this page" className="mb-6 rounded-xl border border-black/[0.06] p-5">
          <p className="text-sm font-medium text-muted-foreground">On this page</p>
          <ol className="mt-2 grid gap-1.5 text-[0.9375rem] sm:grid-cols-2">
            {CONNSTRING_SECTIONS.map((section) => (
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
        {CONNSTRING_SECTIONS.map((section) => (
          <div key={section.id} className="flex min-w-0 flex-col gap-5 pb-10 [&>*]:min-w-0">
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
            {CONNSTRING_RELATED.map((item) => (
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

const FORMAT_TOKEN = "postgres://user:password@host:port/database?parameters";

/** The hero answer, with the long URL allowed to wrap on narrow screens. */
function ConnectionStringSubtitle() {
  const [before, after] = CONNSTRING_SUBHEADLINE.split(FORMAT_TOKEN);
  return (
    <>
      {before}
      <span className="[overflow-wrap:anywhere]">{FORMAT_TOKEN}</span>
      {after}
    </>
  );
}

export function ConnectionStringPage() {
  return (
    <>
      <ProductHero
        name="Prisma Postgres"
        accent="postgres"
        visual={<ConnectionStringDiagram />}
        visualAspect={false}
        headlineMeasure="max-w-[min(18ch,100%)]"
        hero={{
          headline: CONNSTRING_H1,
          subheadline: CONNSTRING_SUBHEADLINE,
          primaryCta: CONNSTRING_PRIMARY_CTA,
          secondaryCta: CONNSTRING_SECONDARY_CTA,
        }}
        subheadline={<ConnectionStringSubtitle />}
        checks={CONNSTRING_HERO_CHECKS}
      />
      <ConnectionStringBody />
      <div className="[&_code]:[overflow-wrap:anywhere]">
        <Faq heading="Postgres connection string FAQ" items={CONNSTRING_FAQ} id="faq" />
      </div>
      <ProductCta
        cta={{
          headline: CONNSTRING_CLOSER.headline,
          body: CONNSTRING_CLOSER.body,
          benefits: [...CONNSTRING_CLOSER.benefits],
          primaryCta: CONNSTRING_CLOSER.primaryCta,
          secondaryCta: CONNSTRING_CLOSER.secondaryCta,
        }}
      />
    </>
  );
}
