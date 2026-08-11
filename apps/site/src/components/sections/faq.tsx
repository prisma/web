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
    question: "Compute is in beta. Should I run production on it?",
    answer:
      "Compute is in public beta and pricing isn't final yet. We recommend trying it with non-critical workloads first. The ORM and Prisma Postgres are production-ready and used by teams from solo developers to companies like Lush, Rapha, and Elsevier.",
  },
  {
    question: "What about Prisma 7 / Prisma ORM users today?",
    answer:
      "Prisma 7 isn't going anywhere. Prisma 8, currently a release candidate, is a separate, opinionated product built for agentic workflows, not a forced upgrade. When Prisma 8 reaches GA, we'll provide a smooth migration path for teams who want to move.",
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
    <section className="px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-site">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {heading}
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-16 max-w-3xl">
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
