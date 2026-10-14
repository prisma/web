import { IconTile } from "@/components/brand/icon-tile";
import { Reveal } from "@/components/motion/reveal";
import { PRODUCT_ICONS } from "@/components/product/icons";
import type { LandingContent } from "./content";

// Four plain benefit cards: an icon tile, a name, two sentences. The
// explaining happens in words here because the visitor may have never heard
// of Prisma; the hero tour already showed the product.
export function LandingBenefits({ benefits }: { benefits: LandingContent["benefits"] }) {
  return (
    <section className="bg-white px-4 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-site">
        <div className="max-w-3xl">
          <Reveal>
            <h2 className="text-balance text-[clamp(1.875rem,3vw,2.5rem)] leading-[1.1]">
              {benefits.headline}
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-5 max-w-[62ch] text-pretty text-lg leading-relaxed text-muted-foreground">
              {benefits.bridge}
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.items.map(({ icon, name, description }, i) => {
            const Icon = PRODUCT_ICONS[icon];
            return (
              <Reveal
                key={name}
                delay={i * 0.08}
                className="flex flex-col rounded-2xl border border-black/[0.06] bg-card p-6"
              >
                <IconTile>
                  <Icon className="size-5 text-foreground" />
                </IconTile>
                <h3 className="mt-5 text-xl">{name}</h3>
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
