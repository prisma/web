import Link from "next/link";
import { ProductCta } from "@/components/product/product-cta";
import { ProductHero } from "@/components/product/product-hero";
import { Faq } from "@/components/sections/faq";
import { renderFaqAnswer } from "@/lib/faq-answer";
import { Code } from "./_code";
import {
  type Block,
  SERVERLESS_CLOSER,
  SERVERLESS_FAQ,
  SERVERLESS_H1,
  SERVERLESS_HERO_CHECKS,
  SERVERLESS_PRIMARY_CTA,
  SERVERLESS_RELATED,
  SERVERLESS_SECONDARY_CTA,
  SERVERLESS_SECTIONS,
  SERVERLESS_SUBHEADLINE,
} from "./_content";
import { ServerlessDiagram } from "./_diagram";

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
  }
}

// One reading column for the explainer, so code blocks and prose share a
// measure. Inline code and links match the FAQ answers.
const BODY =
  "mx-auto flex max-w-3xl flex-col gap-5 text-base leading-7 text-foreground [&_a]:underline [&_a]:decoration-black/25 [&_a]:underline-offset-4 [&_a:hover]:decoration-foreground [&_p]:text-pretty";

function ServerlessBody() {
  return (
    <section className="bg-white px-4 pt-20 pb-8 sm:px-8 sm:pt-28">
      <div className={BODY}>
        <nav aria-label="On this page" className="mb-6 rounded-xl border border-black/[0.06] p-5">
          <p className="text-sm font-medium text-muted-foreground">On this page</p>
          <ol className="mt-2 grid gap-1.5 text-[0.9375rem] sm:grid-cols-2">
            {SERVERLESS_SECTIONS.map((section) => (
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
        {SERVERLESS_SECTIONS.map((section) => (
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
            {SERVERLESS_RELATED.map((item) => (
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

export function ServerlessPage() {
  return (
    <>
      <ProductHero
        name="Prisma Postgres"
        accent="postgres"
        visual={<ServerlessDiagram />}
        visualAspect={false}
        headlineMeasure="max-w-[min(18ch,100%)]"
        hero={{
          headline: SERVERLESS_H1,
          subheadline: SERVERLESS_SUBHEADLINE,
          primaryCta: SERVERLESS_PRIMARY_CTA,
          secondaryCta: SERVERLESS_SECONDARY_CTA,
        }}
        checks={SERVERLESS_HERO_CHECKS}
      />
      <ServerlessBody />
      <Faq heading="Serverless Postgres FAQ" items={SERVERLESS_FAQ} id="faq" />
      <ProductCta
        cta={{
          headline: SERVERLESS_CLOSER.headline,
          body: SERVERLESS_CLOSER.body,
          benefits: [...SERVERLESS_CLOSER.benefits],
          primaryCta: SERVERLESS_CLOSER.primaryCta,
          secondaryCta: SERVERLESS_CLOSER.secondaryCta,
        }}
      />
    </>
  );
}
