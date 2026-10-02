import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/motion/reveal";

export type FaqItem = { question: string; answer: React.ReactNode };

const faqs: FaqItem[] = [
  {
    question: "Do I have to use all three products?",
    answer:
      "No. Prisma Postgres works with any ORM. Prisma Compute works with any TypeScript app. The ORM is free and works with any database. Use whichever pieces solve your problem, and add the rest when you're ready.",
  },
  {
    question: "What if I'm not using an AI coding agent?",
    answer:
      "Everything works without one. The CLI and Management API are built so agents can drive them, but they're also just well-designed developer tools. Use Prisma the way you've always used Prisma.",
  },
  {
    question: "Is my schema locked in?",
    answer: (
      <>
        No. <code className="font-mono text-[0.9em]">contract.prisma</code> is yours, your data sits
        in standard Postgres, and you can migrate away whenever you want. Migration paths from
        Prisma to other tools are documented.
      </>
    ),
  },
  {
    question: "How do I know what an operation will cost me?",
    answer:
      "Every paid tier includes spend limits, so your bill stops at the cap you set. The pricing calculator on the pricing page gives you a usage estimate, and full operation definitions are in the docs.",
  },
  {
    question: "Should I run production on Prisma Compute?",
    answer:
      "Compute is generally available: pricing is live, and every paid plan includes spend limits. The ORM and Prisma Postgres are production-ready and used by teams from solo developers to companies like Lush, Rapha, and Elsevier.",
  },
  {
    question: "What about Prisma 7 / Prisma ORM users today?",
    answer:
      "Prisma 7 isn't going anywhere and remains fully supported. Prisma 8, now the current release, is a separate, opinionated product built for agentic workflows, not a forced upgrade. When you are ready to move, the Prisma 8 docs include an upgrade guide from Prisma 7.",
  },
];

// Defaults are the homepage set; pass `items` and `heading` to reuse the
// accordion on another page (see /pricing).
export function Faq({
  heading = "FAQ",
  items = faqs,
}: {
  heading?: string;
  items?: readonly FaqItem[];
} = {}) {
  return (
    <section className="px-6 py-14 sm:py-20 lg:px-8 lg:py-24">
      {/* From lg the heading takes a sticky left column with a way out to the
          docs and the team, and the accordion fills the rest — a centred
          3xl column left most of a 1440 screen empty */}
      <div className="mx-auto max-w-site lg:grid lg:grid-cols-12 lg:gap-16">
        <Reveal className="mx-auto max-w-3xl sm:max-w-2xl sm:text-center lg:sticky lg:top-28 lg:col-span-4 lg:mx-0 lg:max-w-none lg:self-start lg:text-left">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-[clamp(2rem,3.5vw,3rem)] lg:leading-[1.1]">
            {heading}
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground max-lg:hidden">
            More answers live in the{" "}
            <a href="/docs" className="font-medium text-foreground underline underline-offset-4">
              docs
            </a>
            , or{" "}
            <a href="/contact" className="font-medium text-foreground underline underline-offset-4">
              talk to our team
            </a>
            .
          </p>
        </Reveal>

        <Reveal
          delay={0.1}
          className="mx-auto mt-6 max-w-3xl sm:mt-16 lg:col-span-8 lg:mx-0 lg:mt-0 lg:max-w-none"
        >
          <Accordion type="single" collapsible defaultValue="item-0">
            {items.map((faq, index) => (
              <AccordionItem key={faq.question} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-base hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
