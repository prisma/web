import { Faq, type FaqItem } from "@/components/sections/faq";
import type { ProductFaqItem } from "./types";

// The product page's FAQ: the homepage accordion, fed from the page's own
// content object so lib/markdown/product.ts prints the same questions and
// answers. Answers are plain text; the optional link follows the answer as a
// short sentence of its own, so a reader and an agent both see where the
// answer is documented. The heading is the accordion's default, "FAQ", which
// the Markdown rendition repeats as a literal.
export function ProductFaq({ items }: { items: ProductFaqItem[] }) {
  const faqs: FaqItem[] = items.map(({ question, answer, link }) => ({
    question,
    answer: link ? (
      <>
        {answer}{" "}
        <a href={link.href} className="font-semibold text-foreground underline underline-offset-4">
          {link.label}
        </a>
        .
      </>
    ) : (
      answer
    ),
  }));

  return <Faq items={faqs} />;
}
