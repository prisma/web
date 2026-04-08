import type { Metadata } from "next";
import { Button, Card, Action } from "@prisma/eclipse";
import { cn } from "@/lib/cn";
import { CardSection } from "@/components/homepage/card-section/card-section";
import { PostgresTabs } from "../../components/postgres";
import postgresData from "../../data/postgres.json";
import { LogoGrid } from "@/components/homepage/card-section/logo-grid";
import { ScrollCarousel } from "@/components/scroll-carousel";
import { Youtube } from "@prisma-docs/ui/components/youtube";
import { CarouselItem } from "@/components/enterprise/carousel-item";

const CONSOLE_URL =
  "https://console.prisma.io/login?utm_source=website&utm_medium=postgres&utm_campaign=cta";

const twoCol = [
  {
    content: (
      <>
        <h2 className="text-foreground-neutral text-xl font-black! font-sans-display mt-0 mb-4">
          The database <br />
          you already know
        </h2>
        <p className="text-foreground-neutral-weak! text-base">
          This is the mature, proven, and production-tested PostgreSQL millions
          of developers already rely on. Standard SQL and wire protocol,
          Postgres extensions like pgvector, and data import with pg_dump.
        </p>
      </>
    ),
    imageUrl: "/illustrations/postgres/postgres_7",
    imageAlt: "Postgres experience",
    mobileImageUrl: "/illustrations/postgres/postgres_7",
    mobileImageAlt: "Postgres experience",
    logos: null,
    useDefaultLogos: true,
    noShadow: true,
    visualPosition: "right" as const,
    visualType: "image" as const,
    step: "fa-regular fa-database",
  },
  {
    content: (
      <>
        <h2 className="text-foreground-neutral text-xl font-black! font-sans-display mt-0 mb-4">
          Instant provisioning with
          <br />
          zero configuration
        </h2>
        <p className="text-foreground-neutral-weak! text-base">
          Handles connection pooling automatically, and runs on bare metal and
          unikernels for maximum performance.
        </p>
      </>
    ),
    imageUrl: "/illustrations/postgres/postgres_8",
    imageAlt: "Postgres experience",
    mobileImageUrl: "/illustrations/postgres/postgres_8",
    mobileImageAlt: "Postgres experience",
    noShadow: true,
    logos: null,
    useDefaultLogos: true,
    visualPosition: "right" as const,
    visualType: "image" as const,
    step: "fa-regular fa-rocket-launch",
  },
  {
    content: (
      <>
        <h2 className="text-foreground-neutral text-xl font-black! font-sans-display mt-0 mb-4">
          Production-ready <br />
          from day one
        </h2>
        <p className="text-foreground-neutral-weak! text-base">
          Automated backups, encryption at rest and in transit, full tenant
          isolation and enterprise-grade compliance. Everything you need to ship
          with confidence, managed automatically.
        </p>
      </>
    ),
    imageUrl: "/illustrations/postgres/postgres_9",
    imageAlt: "Postgres experience",
    mobileImageUrl: "/illustrations/postgres/postgres_9",
    mobileImageAlt: "Postgres experience",
    noShadow: true,
    logos: null,
    useDefaultLogos: true,
    visualPosition: "right" as const,
    visualType: "image" as const,
    step: "fa-regular fa-shield-check",
  },
];
export const metadata: Metadata = {
  title: "Prisma Postgres | Instant Global Databases",
  description:
    "Free to start, no setup, no commitments. Easily grow your database as your app scales.",
  alternates: {
    canonical: "https://www.prisma.io/postgres",
  },
  openGraph: {
    title: "Prisma Postgres | Instant Global Databases",
    description:
      "Free to start, no setup, no commitments. Easily grow your database as your app scales.",
    url: "https://www.prisma.io/postgres",
    images: [
      {
        url: "/og/og-postgres.png",
        width: 1200,
        height: 630,
        alt: "Prisma Postgres | Instant Global Databases",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prisma Postgres | Instant Global Databases",
    description:
      "Free to start, no setup, no commitments. Easily grow your database as your app scales.",
    images: ["/og/og-postgres.png"],
  },
};

export default async function SiteHome() {
  return (
    <main className="flex-1 w-full z-1 bg-background-default">
      <div className="hero -mt-24 pt-40 flex items-end justify-center px-4 relative">
        <div className="absolute inset-0 pointer-events-none z-1 bg-[linear-gradient(180deg,var(--color-foreground-ppg)_0%,var(--color-background-default)_100%)] opacity-20" />
        <div className="content relative z-2 flex flex-col gap-8">
          <div className="flex flex-col gap-4 items-center text-center">
            <div className="flex items-center gap-2 text-foreground-ppg-weak uppercase tracking-widest text-sm font-sans-display font-black">
              <i className="fa-solid fa-chart-pyramid" />
              <span>Prisma Postgres</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl stretch-display mb-0 text-center mt-0 font-sans-display text-foreground-neutral max-w-224 mx-auto">
              The fastest way <br />
              to real Postgres
            </h1>
          </div>
          <p className="text-center text-foreground-neutral max-w-2xl mx-auto text-xl">
            Build, test and ship faster with zero infrastructure to manage.
          </p>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <Button
              variant="ppg"
              href={CONSOLE_URL}
              size="3xl"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans-display! font-[650]"
            >
              <span>Create database</span>
              <i className="fa-regular fa-database ml-2" />
            </Button>
            <Button
              variant="default-stronger"
              href="https://www.prisma.io/docs/postgres"
              size="3xl"
              className="font-sans-display! font-[650]"
            >
              <span>Read the docs</span>
              <i className="fa-regular fa-book-open ml-2" />
            </Button>
          </div>
        </div>
      </div>
      <div>
        <div className="my-12">
          <PostgresTabs data={postgresData} />
        </div>
      </div>

      <section className="my-12 px-4 py-12">
        <div className="py-12 relative gap-8 flex flex-col max-w-300 mx-auto w-full">
          <h3 className="text-center text-foreground-neutral stretch-display text-3xl stretch-display font-sans-display my-0">
            Postgres that fits your stack
          </h3>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-300 mx-auto w-full">
          {postgresData.stack.map((card, index) => {
            const first = index === 0;
            return (
              <Card
                key={card.title}
                className={cn(
                  "first:bg-background-default not-first:bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-ppg)_262.5%)] relative md:col-span-1",
                  "first:md:col-span-2 overflow-hidden",
                )}
              >
                <div
                  className={cn("flex flex-col gap-6 justify-between h-full")}
                >
                  <div className="flex justify-between items-start flex-col lg:flex-row gap-6">
                    <div className="flex flex-col gap-4 w-full flex-1">
                      <div className="flex flex-col gap-4 items-start">
                        <Action color="ppg" size="4xl">
                          <i className={cn("text-2xl", card.icon)} />
                        </Action>
                        <h3 className="text-foreground-neutral font-sans-display text-xl stretch-display mt-0 mb-1 font-bold">
                          {card.title}
                        </h3>
                      </div>
                      <p className="text-foreground-neutral-weak text-base font-normal m-0">
                        {card.subtitle}
                      </p>
                    </div>
                    {typeof card.image === "string" &&
                    card.image === "logo-grid" ? (
                      <div
                        className={cn(
                          "min-w-0 overflow-visible flex-1 flex items-center relative md:max-w-unset sm:max-w-[60%] max-w-full mx-auto",
                          "before:absolute before:inset-0 before:bg-[linear-gradient(90deg,var(--color-background-default)_0%,transparent_50%,var(--color-background-default)_100%)] before:z-10 before:pointer-events-none w-full",
                        )}
                      >
                        <LogoGrid
                          logos={card.useDefaultLogos ? undefined : card.logos}
                          type="track"
                        />
                      </div>
                    ) : null}
                  </div>
                  {typeof card.image === "string" &&
                  card.image === "logo-bar" &&
                  card.logos ? (
                    <div className={cn("w-full")}>
                      <LogoGrid
                        logos={card.logos}
                        type="spotlight"
                        color="ppg"
                      />
                    </div>
                  ) : null}
                </div>
              </Card>
            );
          })}
        </div>
      </section>
      <section className="my-12">
        <div className="pt-12 relative gap-8 flex flex-col max-w-249 w-full mx-auto">
          <h3 className="text-center text-foreground-neutral stretch-display text-3xl stretch-display font-sans-display my-0 -mb-12 px-4">
            Real Postgres. Better experience.
          </h3>
          <CardSection cardSection={twoCol} />
        </div>
      </section>
      <div
        className={cn(
          "my-12 md:p-12 mb-24 p-4",
          "bg-background-default md:bg-[linear-gradient(180deg,var(--color-background-default)_-177.75%,var(--color-background-ppg)_100%)] shadow-[0_1px_2px_0_rgba(0,0,0,0.04)]",
        )}
      >
        <div className="web-cta flex gap-4 md:gap-12 items-center mx-auto md:p-4 flex-col md:flex-row md:bg-none bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-ppg)_330.76%)] md:border-none border border-stroke-neutral md:max-w-none max-w-137 w-full md:w-fit p-12 md:rounded-none rounded-square-high">
          <h3 className="text-2xl text-foreground-neutral font-sans-display font-bold text-center md:text-left md:mb-0 mb-3">
            Pay as you scale
          </h3>
          <div className="content flex flex-col lg:flex-row gap-3 lg:gap-12 items-center md:items-start lg:items-center">
            <p className="max-w-94 w-full text-center md:text-left text-foreground-neutral-weak text-md">
              Usage-based pricing, with a generous free tier. Spend limits
              included, so you never get surprised.
            </p>
            <Button variant="ppg" size="2xl" href="/pricing">
              <span>Explore Pricing</span>
              <i className="fa-regular fa-arrow-right ml-2" />
            </Button>
          </div>
        </div>
      </div>
      <section className="my-12 px-4">
        <div className="py-12 gap-12 flex flex-col max-w-[1200px] mx-auto">
          <h2 className="text-foreground-neutral stretch-display text-center text-4xl font-black! font-sans-display ">
            Made for every kind of app
          </h2>
          <ScrollCarousel
            ariaLabel="Made for every kind of app carousel"
            gridClassName="auto-cols-[100%] sm:auto-cols-[calc((100%-2rem)/3)]"
          >
            {postgresData.made_for.map((item) => (
              <CarouselItem key={item.title} card={item} color="ppg" />
            ))}
          </ScrollCarousel>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto flex max-w-[682px] flex-col gap-12">
          <div className="flex flex-col gap-6 items-center justify-center text-center max-w-[549px] mx-auto">
            <div className="max-w-[420px]">
              <h2 className="m-0 text-3xl text-foreground-neutral font-sans-display [font-variation-settings:'wght'_900]">
                See Postgres in action
              </h2>
              <p className="m-0 mt-4 text-base leading-6 text-foreground-neutral-weak">
                See how to get started in just a couple of minutes, with Prisma
                Postgres.
              </p>
            </div>

            <Button
              variant="ppg"
              size="xl"
              href={CONSOLE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Create your first Database</span>
              <i className="fa-regular fa-arrow-right ml-2" />
            </Button>
          </div>

          <div className="relative overflow-hidden rounded-lg shadow-box-low">
            <Youtube
              videoId="O1S0ax7GlL8"
              width="100%"
              height="400"
              title="See how Prisma Studio works"
            />
          </div>
        </div>
      </section>
      <div className="bg-[url('/illustrations/homepage/footer_grid.svg')] bg-contain bg-center before:inset-x-30 before:inset-y-[45%] before:absolute relative before:content-[''] before:pointer-events-none before:-z-1 rounded-full before:bg-teal-400 before:blur-[100px]">
        <div className="my-12 p-12">
          <div className="flex flex-col mx-auto w-fit items-center justify-center gap-8">
            <div className="flex flex-col items-center text-center gap-4">
              <h2 className="text-3xl text-foreground-neutral font-sans-display stretch-display">
                Try Prisma Postgres
              </h2>
              <p className="text-foreground-neutral-weak">
                Deploy a Postgres database instantly.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
              <Button
                variant="ppg"
                size="2xl"
                href={CONSOLE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Create your first Database</span>
                <i className="fa-regular fa-arrow-right ml-2" />
              </Button>
              <Button
                variant="default-stronger"
                size="2xl"
                href="https://www.prisma.io/docs"
              >
                <span>Read the docs</span>
                <i className="fa-regular fa-arrow-right ml-2" />
              </Button>
            </div>
            <h6 className="mb-0! -mt-4 text-foreground-neutral-weaker text-xs">
              Free to get started, no credit card needed.
            </h6>
          </div>
        </div>
      </div>
    </main>
  );
}
