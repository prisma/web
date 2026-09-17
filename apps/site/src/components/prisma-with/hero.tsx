import Image from "next/image";
import parse from "html-react-parser";
import { RoleKicker } from "@/components/brand/role-kicker";
import { Texture } from "@/components/brand/texture";
import { PrismButton, PrismButtonOutline } from "@/components/brand/prism-button";

type HeroData = {
  tech: string;
  eyebrow?: string;
  icon?: string;
  imageUrl: string;
  imageUrlLight?: string;
  imageClassName?: string;
  imageClassNameLight?: string;
  title: string;
  description: string;
  btns: Array<{
    label: string;
    icon?: string;
    url: string;
  }>;
};

// Prisma-with hero, restyled to the 2026 brand: wrapped paper panel, kicker
// dot, Sora headline, tech mark on the right. Prefers the light logo variant
// since the site is light-first.
export function Hero({ data }: { data: HeroData }) {
  const secondaryButton = data.btns[1];
  const image = data.imageUrlLight ?? data.imageUrl;

  return (
    <section className="bg-white px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
        <Texture opacity={0.06} blend="multiply" />
        <div className="relative px-4 sm:px-8">
          <div className="mx-auto grid max-w-site items-center gap-12 pb-16 pt-32 md:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] md:pb-20 md:pt-44">
            <div className="flex flex-col items-start">
              {data.eyebrow && <RoleKicker color="bg-prism-cyan-400">{data.eyebrow}</RoleKicker>}
              <h1 className="isolate mt-4 max-w-[22ch] text-balance text-[clamp(2.25rem,3.5vw,3.25rem)] leading-[1.08] [&_b]:font-medium [&_b]:text-prism-cyan-700">
                {parse(data.title)}
              </h1>
              <p className="mt-6 max-w-[56ch] text-pretty text-lg leading-relaxed text-muted-foreground [&_b]:font-semibold [&_b]:text-foreground">
                {parse(data.description)}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <PrismButton href={data.btns[0].url}>{data.btns[0].label}</PrismButton>
                {secondaryButton && (
                  <PrismButtonOutline href={secondaryButton.url}>
                    {secondaryButton.label}
                  </PrismButtonOutline>
                )}
              </div>
            </div>
            <div className="relative mx-auto hidden aspect-square w-full max-w-[16rem] md:block">
              <Image src={image} alt={data.tech} fill className="object-contain" sizes="16rem" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
