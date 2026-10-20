import { Fragment } from "react";
import { createPageMetadata } from "@/lib/page-metadata";
import { ProductHero } from "@/components/product/product-hero";
import { CtaBurst } from "@/components/sections/cta-burst";
import { StackBento } from "@/components/sections/stack-bento";
import { ComparisonTable } from "@/components/use-case/segment/comparison-table";
import { SegmentWhen } from "@/components/use-case/segment/sections";
import { BestFor } from "./best-for";
import { bestFor, comparison, cta, hero, stack, when } from "./content";
import { StackHeroVisual } from "./stack-hero-visual";

export const metadata = createPageMetadata({
  title: "The Prisma Stack | ORM, Postgres, and Compute for TypeScript",
  description:
    "ORM, Postgres, and Compute, one platform for your app and its database, with one shared context across your stack.",
  path: "/stack",
  ogKicker: "The Prisma Stack",
});

/** The copy marks inline code with backticks (content.ts stays React-free); set it in <code>. */
function withInlineCode(text: string) {
  return text.split(/(`[^`]+`)/g).map((part, i) =>
    part.startsWith("`") && part.endsWith("`") ? (
      <code key={i} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8125em]">
        {part.slice(1, -1)}
      </code>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

// Separate from /stack. Built from existing sections in the copy's order: the
// product-page hero carrying a stack abstraction, the homepage stack bento
// (unwrapped, since the hero directly above is the wrapped panel), the segment
// pages' comparison table and "when to use" cards, a ruled audience list, and
// the site's closing CTA.
export default function PrismaStackPage() {
  return (
    <>
      <ProductHero
        name="The Prisma Stack"
        accent="orm"
        hero={hero}
        visual={<StackHeroVisual />}
        visualAspect={false}
      />
      <StackBento
        content={{ ...stack, cli: { body: withInlineCode(stack.cli.body) } }}
        wrapped={false}
      />
      <ComparisonTable comparison={comparison} />
      <SegmentWhen when={when} />
      <BestFor bestFor={bestFor} />
      <CtaBurst
        headline={cta.headline}
        body={cta.body}
        bodyMaxWidth="max-w-[60ch]"
        checks={cta.checks}
      />
    </>
  );
}
