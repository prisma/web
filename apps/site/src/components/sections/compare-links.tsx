import { ArrowRightBold } from "@/components/icons/forma";
import { Reveal } from "@/components/motion/reveal";
import { COMPARE_PRISMA_LINKS } from "./compare-links-data";

// The "Compare Prisma" reading list: the comparison posts and the import guide,
// by their stable URLs, for the pages where someone is weighing Prisma against
// other options (/postgres, /compute and /pricing). The list is shared; the
// sentence above it comes from the page, so no paragraph repeats verbatim
// across pages (content brief). Same rhythm as sections/faq.tsx: a
// centred heading, then one column of entries. The heading is literal JSX on
// purpose, so markdown-parity.test.ts catches the Markdown rendition drifting
// (see lib/markdown/compare-links.ts). The links cross into the blog and docs
// zones, so they are plain anchors rather than next/link.
export function CompareLinks({ intro }: { intro: string }) {
  return (
    <section className="px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-site">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Compare Prisma
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {intro}
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-12 max-w-3xl">
          <ul className="divide-y divide-border">
            {COMPARE_PRISMA_LINKS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="group flex items-start justify-between gap-4 py-5 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <span>
                    <span className="block text-base font-semibold text-foreground group-hover:underline">
                      {item.label}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </span>
                  </span>
                  <ArrowRightBold
                    className="mt-1.5 size-4 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
