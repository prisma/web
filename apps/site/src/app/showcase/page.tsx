import { EnterpriseForm } from "@/components/enterprise/form";
import { ShowcaseScrollCarousel } from "@/components/showcase/components";
import Image from "next/image";
import { FooterAccordion } from "@/components/enterprise/footer-accordion";
import { SwitchEnterprise } from "@/components/enterprise/switch-enterprise";
import LogoParade from "@/components/logo-parade";
import type { Metadata } from "next";
import { Button, Card, Action, Avatar } from "@prisma/eclipse";
import { CardSection } from "@/components/homepage/card-section/card-section";
import { cn } from "@/lib/cn";
import { Technology } from "@/components/technology";
import data from "@/data/showcase";

const ENTERPRISE_TITLE =
  "Streamline your enterprise development workflow with Prisma";
const ENTERPRISE_DESCRIPTION =
  "Learn how Prisma ORM can improve your team's productivity and explore our tailored ORM support solutions for enterprises and solution providers.";

export const metadata: Metadata = {
  title: ENTERPRISE_TITLE,
  description: ENTERPRISE_DESCRIPTION,
  alternates: {
    canonical: "https://www.prisma.io/enterprise",
  },
  openGraph: {
    title: ENTERPRISE_TITLE,
    description: ENTERPRISE_DESCRIPTION,
    url: "https://www.prisma.io/enterprise",
    images: [
      {
        url: "/og/og-enterprise.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: ENTERPRISE_TITLE,
    description: ENTERPRISE_DESCRIPTION,
    images: ["/og/og-enterprise.png"],
  },
};

export default function EnterprisePage() {
  return (
    <main className="flex-1 w-full z-1 bg-background-default">
      {/* Hero */}
      <section className="hero -mt-24 flex items-end justify-center px-4 relative">
        <div className="absolute inset-0 z-0 bg-[linear-gradient(180deg,var(--color-foreground-orm)_0%,var(--color-background-default)_100%)] opacity-20" />
        <div className="content pt-40 relative z-2 my-12 flex flex-col gap-8">
          <h1 className="text-5xl md:text-6xl mb-0 text-center mt-0 font-sans-display text-foreground-neutral max-w-200 mx-auto stretch-display">
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
              <img
                src="/icons/made_with_prisma.svg"
                alt="Made with Prisma"
                className="w-auto h-5 hidden dark:inline-block "
              />
              <img
                src="/icons/made_with_prisma_light.svg"
                alt="Made with Prisma"
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
        <div className="content relative z-2 flex flex-col gap-8 max-w-">
          <ShowcaseScrollCarousel items={data.stories} />
        </div>
      </section>
      <section className="my-12 px-4 relative">
        <div className="absolute inset-0 z-0 bg-[linear-gradient(180deg,var(--color-foreground-orm)_0%,var(--color-background-default)_100%)] opacity-20" />
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
                  <img
                    src={box.logo}
                    alt={box.name}
                    className={cn(
                      "max-h-element-3xl h-full max-w-[50%] object-contain w-fit flex-1",
                      box.logo_light && "dark:hidden block",
                    )}
                  />
                  {box.logo_light && (
                    <img
                      src={box.logo_light}
                      alt={box.name}
                      className="max-h-element-3xl h-full max-w-[50%] object-contain w-fit dark:hidden block"
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
