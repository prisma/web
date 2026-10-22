import { IconTile } from "@/components/brand/icon-tile";
import { Reveal } from "@/components/motion/reveal";
import { PRODUCT_ICONS } from "@/components/product/icons";
import type { LandingContent } from "./content";

// Four benefits as a plain two-by-two list: an icon tile, the thing you stop
// doing, two sentences. No card chrome, so the section reads as prose with
// markers rather than as another grid of boxes; the proof sections that
// follow it carry the tables.
export function LandingBenefits({
  benefits,
}: {
  benefits: NonNullable<LandingContent["benefits"]>;
}) {
  return (
    <section className="bg-white px-4 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-site">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
          <Reveal>
            <h2 className="text-balance text-[clamp(1.875rem,3vw,2.5rem)] leading-[1.1]">
              {benefits.headline}
            </h2>
            <p className="mt-5 max-w-[46ch] text-pretty text-lg leading-relaxed text-muted-foreground">
              {benefits.bridge}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
            {benefits.items.map(({ icon, name, description }) => {
              const Icon = PRODUCT_ICONS[icon];
              return (
                <div key={name} className="flex gap-4">
                  <IconTile className="size-10">
                    <Icon className="size-4 text-foreground" />
                  </IconTile>
                  <div className="min-w-0">
                    <h3 className="text-lg leading-snug">{name}</h3>
                    <p className="mt-2 text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </div>
              );
            })}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
