import { IconTile } from "@/components/brand/icon-tile";
import { Reveal } from "@/components/motion/reveal";
import { PRODUCT_ICONS } from "./icons";
import type { ProductPageContent } from "./types";

// Problem → outcomes: name the friction, then the four states the product
// unlocks. Copy carries this section; the tiles stay quiet.
export function ProductProblem({ problem }: Pick<ProductPageContent, "problem">) {
  return (
    <section className="bg-white px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-site">
        <div className="mx-auto max-w-3xl text-center max-md:text-left">
          <Reveal>
            <h2 className="text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
              {problem.headline}
            </h2>
          </Reveal>
          <div className="mt-5 flex flex-col gap-4">
            {problem.body.map((copy, i) => (
              <Reveal key={i} delay={0.1 + i * 0.06}>
                <p className="text-pretty text-lg leading-relaxed text-muted-foreground">{copy}</p>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {problem.outcomes.map(({ icon, label }, i) => {
            const Icon = PRODUCT_ICONS[icon];
            return (
              <Reveal key={i} delay={i * 0.1} className="h-full">
                <div className="flex h-full flex-col items-start gap-4 rounded-xl border border-black/[0.06] bg-white p-6">
                  <IconTile>
                    <Icon className="size-5 text-foreground" aria-hidden />
                  </IconTile>
                  <p className="font-semibold leading-snug text-foreground">{label}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
