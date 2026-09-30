import { ArrowRightBold } from "@/components/icons/forma";
import { Reveal } from "@/components/motion/reveal";
import type { ProductLinkList } from "./types";

// A hand-picked list of links: the comparison posts and the docs page a
// visitor weighing this product against the alternatives should read next.
// The headline, the body and every link come from the page's content object,
// so lib/markdown/product.ts renders the same list. Layout follows
// product-detail-blocks.tsx: headline left, body right, the list beneath.
export function ProductCompare({ compare }: { compare: ProductLinkList }) {
  return (
    <section className="bg-white px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-site">
        <div className="grid items-start gap-6 md:grid-cols-2 md:gap-16">
          <Reveal>
            <h2 className="max-w-[22ch] text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
              {compare.headline}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-pretty leading-relaxed text-muted-foreground md:mt-1.5">
              {compare.body}
            </p>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-4 border-t border-black/[0.06] pt-12 sm:grid-cols-2">
          {compare.links.map((link, i) => (
            <li key={link.href} className="h-full">
              <Reveal className="h-full" delay={(i % 2) * 0.08}>
                <a
                  href={link.href}
                  className="flex h-full items-center justify-between gap-4 rounded-2xl border border-black/[0.06] bg-card p-5 text-[0.9375rem] font-semibold leading-snug text-foreground transition-colors hover:border-black/[0.14]"
                >
                  {link.label}
                  <ArrowRightBold className="size-3.5 shrink-0" aria-hidden />
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
