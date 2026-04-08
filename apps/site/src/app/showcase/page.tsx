import { EnterpriseForm } from "@/components/enterprise/form";
import Image from "next/image";
import { FooterAccordion } from "@/components/enterprise/footer-accordion";
import { SwitchEnterprise } from "@/components/enterprise/switch-enterprise";
import LogoParade from "@/components/logo-parade";
import type { Metadata } from "next";
import { Button, Card, Action, Avatar } from "@prisma/eclipse";
import { CardSection } from "@/components/homepage/card-section/card-section";
import { cn } from "@/lib/cn";
import { ScrollCarousel } from "@/components/scroll-carousel";
import { Technology } from "@/components/technology";
import data from "@/data/showcase";
import { PostCard } from "@/components/showcase/post-card";

const SHOWCASE_TITLE = "Prisma Showcase | Customer Success stories";
const SHOWCASE_DESCRIPTION = "Learn how companies are leveraging our powerful, next-generation, type-safe ORM for Node.js.";

export const metadata: Metadata = {
  title: SHOWCASE_TITLE,
  description: SHOWCASE_DESCRIPTION,
  alternates: {
    canonical: "https://www.prisma.io/showcase",
  },
  openGraph: {
    title: SHOWCASE_TITLE,
    description: SHOWCASE_DESCRIPTION,
    url: "https://www.prisma.io/showcase",
    images: [
      {
        url: "/og/og-showcase.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SHOWCASE_TITLE,
    description: SHOWCASE_DESCRIPTION,
    images: ["/og/og-showcase.png"],
  },
};

export default function EnterprisePage() {
  return (
    <main className="flex-1 w-full z-1 bg-background-default">
      {/* Hero */}
      <section className="hero -mt-24 flex items-end justify-center px-4 relative pt-24">
        <div className="absolute inset-0 pointer-events-none z-1 bg-[linear-gradient(180deg,var(--color-foreground-orm)_0%,var(--color-background-default)_100%)] opacity-20" />
        <div className="content pt-40 relative z-2 my-12 flex flex-col gap-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl stretch-display mb-0 text-center mt-0 font-sans-display text-foreground-neutral max-w-224 mx-auto">
            Made with Prisma
          </h1>
          <p className="text-center text-foreground-neutral max-w-2xl mx-auto text-xl">
            Learn how companies use Prisma in Production
          </p>
          <h5 className="text-foreground-neutral-weak text-xs font-normal text-center -mt-4 inline-flex items-center justify-center">
            Building with Prisma? Show it off with{" "}
            <a
              href="https://github.com/prisma/presskit/tree/main?tab=readme-ov-file#badges"
              className="inline-flex items-center justify-center"
            >
              <Image
                src="/icons/made_with_prisma.svg"
                alt="Made with Prisma"
                width={140}
                height={20}
                className="w-auto h-5 hidden dark:inline-block "
              />
              <Image
                src="/icons/made_with_prisma_light.svg"
                alt="Made with Prisma"
                width={140}
                height={20}
                className="w-auto h-5 dark:hidden inline-block "
              />
              <i className="fa-regular fa-arrow-up-right" />
            </a>
          </h5>
        </div>
      </section>

      {/* Trusted by teams at */}
      <section className="my-12 px-4">
        <LogoParade />
      </section>

      <section className="my-12 px-4">
        <div className="content relative z-2 flex flex-col gap-8">
          <ScrollCarousel
            ariaLabel="Showcase carousel"
            gridClassName="auto-cols-[100%] xs:auto-cols-[calc((100%-16px)/2)] sm:auto-cols-[calc((100%-16px)/3)] md:auto-cols-[calc((100%-32px)/4)] lg:auto-cols-[calc((100%-64px)/5)]"
            itemClassName="min-h-full h-full"
          >
            {data.stories.map((item) => (
              <PostCard key={item.title} post={item} className="min-h-full" />
            ))}
          </ScrollCarousel>
        </div>
      </section>
      <section className="my-12 px-4 relative">
        <div className="absolute inset-0 pointer-events-none z-1 bg-[linear-gradient(180deg,var(--color-foreground-orm)_0%,var(--color-background-default)_100%)] opacity-20" />
        <div className="content pt-40 relative z-2 my-12 flex flex-col gap-8 max-w-[1200px] mx-auto">
          <h3 className="text-center text-foreground-neutral stretch-display text-3xl stretch-display font-sans-display my-0">
            Built with Prisma
          </h3>

          <div className="grid lg:grid-cols-3! md:grid-cols-2 gap-4">
            {data.communityProjects.map((box) => (
              <a
                href={box.link}
                target="_blank"
                className="contents"
                rel="noopener noreferrer"
                key={box.id}
              >
                <Card
                  className={cn(
                    "flex flex-col items-start [&:hover>div>p]:line-clamp-none min-h-[194px] relative z-1 hover:scale-104 transition-transform bg-background-neutral-weak transition-bg",
                  )}
                >
                  {box.logo && (
                    <Image
                      src={box.logo}
                      alt={box.name}
                      width={240}
                      height={96}
                      className={cn(
                        "max-h-element-3xl h-full max-w-[50%] object-contain w-fit flex-1",
                        box.logo_light && "dark:block hidden",
                      )}
                    />
                  )}
                  {box.logo_light && (
                    <Image
                      src={box.logo_light}
                      alt={box.name}
                      width={240}
                      height={96}
                      className="max-h-element-3xl h-full max-w-[50%] object-contain w-fit dark:hidden block flex-1"
                    />
                  )}
                  <h3 className="text-foreground-neutral font-sans-display text-xl stretch-display my-0 font-bold md:line-clamp-2">
                    {box.name}
                  </h3>
                  <p className="text-foreground-neutral font-sans-display text-sm">
                    {box.description}
                  </p>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
