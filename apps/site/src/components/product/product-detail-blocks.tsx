import { Reveal } from "@/components/motion/reveal";
import { PRODUCT_ICONS } from "./icons";
import type { ProductIconName } from "./icons";

// Headline and bridge side by side, the section's product abstraction beneath
// them, then the named claims in a row underneath it. V4's "Fast feedback makes
// your agent faster, and more reliable" on /orm has this shape: four claims that
// each need a sentence, hanging off one visual that shows them working.
export function ProductDetailBlocks({
  headline,
  bridge,
  blocks,
  visual,
}: {
  headline: string;
  bridge: string;
  blocks: { icon: ProductIconName; name: string; description: string }[];
  visual?: React.ReactNode;
}) {
  return (
    <section className="bg-card px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-site">
        {/* headline holds the left column, the bridge sits beside it rather than
            under it, so the visual starts higher up the section */}
        <div className="grid items-start gap-6 md:grid-cols-2 md:gap-16">
          <Reveal>
            <h2 className="max-w-[22ch] text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
              {headline}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-pretty leading-relaxed text-muted-foreground md:mt-1.5">{bridge}</p>
          </Reveal>
        </div>

        {visual ? (
          <Reveal delay={0.14} className="mt-12">
            {visual}
          </Reveal>
        ) : null}

        <div className="mt-14 grid gap-x-10 gap-y-10 border-t border-foreground/[0.06] pt-12 sm:grid-cols-2 lg:grid-cols-4">
          {blocks.map(({ icon, name, description }, i) => {
            const Icon = PRODUCT_ICONS[icon];
            return (
              <Reveal key={i} delay={(i % 4) * 0.08}>
                <h3 className="flex items-start gap-2.5 text-[0.9375rem] font-semibold leading-snug text-foreground">
                  <Icon className="mt-px size-4 shrink-0 text-foreground" aria-hidden />
                  {name}
                </h3>
                <p className="mt-2.5 text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
