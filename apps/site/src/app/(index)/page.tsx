import Antigravity from "../../components/homepage/antigravity";
import type { Metadata } from "next";
import { SITE_HOME_DESCRIPTION, SITE_HOME_TITLE } from "@/lib/site-metadata";
import { Button } from "@prisma/eclipse";
import { CopyCode } from "@/components/homepage/copy-btn";
import { Bento } from "@/components/homepage/bento";
import { CardSection } from "@/components/homepage/card-section/card-section";
import { ConsoleCtaButton } from "@/components/console-cta-button";
import review from "../../data/homepage.json";
import Testimonials from "../../components/homepage/testimonials";

const INDEX_CTA_DEFAULT_UTM = {
  utm_source: "website",
  utm_medium: "index",
  utm_campaign: "cta",
} as const;

const twoCol = [
  {
    content: (
      <>
        <h2 className="text-foreground-neutral stretch-display text-4xl font-black! font-sans-display mt-0 mb-4">
          Postgres that <br /> fits your stack.
        </h2>
        <p className="text-foreground-neutral-weak! text-base">
          Works with your existing stack, wherever you deploy.Your choice of
          ORM, frameworks, and tools, they all just connect.
        </p>
      </>
    ),
    imageUrl: null,
    imageAlt: null,
    mobileImageUrl: null,
    mobileImageAlt: null,
    logos: null,
    useDefaultLogos: true,
    visualPosition: "right" as const,
    visualType: "logoGrid" as const,
  },
  {
    content: (
      <>
        <h2 className="text-foreground-neutral stretch-display text-4xl font-black! font-sans-display mt-0 mb-4">
          Real Postgres. <br /> Better experience.
        </h2>
        <p className="text-foreground-neutral-weak! text-base">
          The PostgreSQL millions know and trust in production, ready in seconds
          with zero configuration. Automatic backups, observability and
          compliance.
        </p>
      </>
    ),
    imageUrl: "/illustrations/homepage/real_ppg",
    imageAlt: "Real Postgres",
    mobileImageUrl: "/illustrations/homepage/real_ppg_mobile",
    mobileImageAlt: "Real PPG mobile",
    logos: null,
    useDefaultLogos: false,
    visualPosition: "left" as const,
    visualType: "image" as const,
  },
];
export const metadata: Metadata = {
  title: SITE_HOME_TITLE,
  description: SITE_HOME_DESCRIPTION,
  alternates: {
    canonical: "https://www.prisma.io/",
  },
  openGraph: {
    title: SITE_HOME_TITLE,
    description: SITE_HOME_DESCRIPTION,
    url: "https://www.prisma.io/",
    images: [
      {
        url: "/og/og-index.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_HOME_TITLE,
    description: SITE_HOME_DESCRIPTION,
    images: ["/og/og-index.png"],
  },
};

export default function SiteHome() {
  return (
    <main className="flex-1 w-full z-1 bg-background-default">
      <section className="hero h-full relative -mt-24 flex items-end justify-center px-4 pt-48">
        <div className="w-screen h-full absolute inset-0">
          <Antigravity
            count={300}
            magnetRadius={16}
            ringRadius={15}
            waveSpeed={2.6}
            waveAmplitude={2.6}
            particleSize={0.9}
            lerpSpeed={0.02}
            color="#14b8a6"
            autoAnimate
            particleVariance={1}
            rotationSpeed={0}
            depthFactor={2.6}
            pulseSpeed={4.9}
            particleShape="capsule"
            fieldStrength={15.3}
          />
        </div>
        <div className="absolute inset-0 pointer-events-none z-1 bg-[linear-gradient(180deg,var(--color-foreground-ppg)_0%,var(--color-background-default)_100%)] opacity-20" />
        <div className="content relative z-2 my-12 py-12 flex flex-col gap-8">
          <div className="flex flex-col gap-4 items-center text-center">
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl stretch-display mb-0 text-center mt-0 font-sans-display text-foreground-neutral max-w-224 mx-auto">
              Postgres, <br />
              perfectly managed.
            </h1>
          </div>
          <p className="text-center text-foreground-neutral max-w-2xl mx-auto">
            Real Postgres with the developer experience and infrastructure to
            ship faster.
          </p>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <ConsoleCtaButton
              variant="ppg"
              consolePath="/sign-up"
              defaultUtm={INDEX_CTA_DEFAULT_UTM}
              size="3xl"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans-display! font-[650]"
            >
              <span>Create database</span>
              <i className="fa-regular fa-database ml-2" />
            </ConsoleCtaButton>
            <CopyCode text="npx prisma init">
              <span className="text-foreground-neutral-reverse-weak">$</span>
              <span className="text-foreground-neutral-weak">
                &nbsp;npx prisma init
              </span>
              <i className="fa-regular fa-copy ml-2" />
            </CopyCode>
          </div>
        </div>
      </section>

      <section className="my-12">
        <Bento
          bentoSection={{
            boxes: [
              {
                title: "MCP Server",
                subtitle: "Use AI to configure and manage databases.",
                imageUrl: "/illustrations/homepage/mcp",
                imageAlt: "MCP server",
                icon: "fa-light fa-cloud-arrow-up",
                link: "/mcp",
              },
              {
                title: "Manage databases",
                subtitle:
                  "Create, manage and explore databases directly in your IDE.",
                imageUrl: "/illustrations/homepage/ide",
                imageAlt: "IDE",
                icon: "fa-light fa-screwdriver-wrench",
                link: "https://marketplace.visualstudio.com/items?itemName=Prisma.prisma",
              },
              {
                title: "Type-safety",
                subtitle: "Code faster with auto-completion and type safety.",
                imageUrl: "/illustrations/homepage/typesafe",
                imageAlt: "Type-safe queries",
                icon: "fa-light fa-message-text",
                link: "https://prisma.io/docs/orm/prisma-client/type-safety",
              },
              {
                title: "Work collaboratively",
                subtitle: "Manage projects and databases with your team.",
                imageUrl: "/illustrations/homepage/collaborative",
                imageAlt: "Collaborative work",
                icon: "fa-light fa-screen-users",
                link: "https://console.prisma.io",
              },
              {
                title: "Browse your data",
                subtitle:
                  "Explore, filter, and edit your data with an interface.",
                imageUrl: "/illustrations/homepage/data",
                imageAlt: "Data browsing",
                icon: "fa-light fa-magnifying-glass-arrow-right",
                link: "/studio",
              },
            ],
          }}
        />
      </section>

      {/* Card Sections */}
      <section className="w-screen my-12">
        <CardSection cardSection={twoCol} />
      </section>

      {/* Pricing CTA Section */}
      <section className="my-12 bg-[linear-gradient(180deg,var(--color-background-default)-177.75%,var(--color-background-ppg-str)100%)] p-12 shadow-[0_1px_2px_0_rgba(0,0,0,0.04)]">
        <div className="web-cta mx-auto flex w-fit flex-col items-center gap-3 md:flex-row md:gap-12 lg:p-4">
          <h3 className="text-2xl text-center font-sans-display font-bold text-foreground-neutral md:text-left">
            Build anything.
            <br />
            Deploy instantly.
          </h3>
          <div className="content flex flex-col items-center gap-3 md:items-start lg:flex-row lg:items-center lg:gap-12">
            <p className="max-w-94 w-full text-center text-md text-foreground-neutral-weak md:text-left">
              Give your users instant production-ready Postgres, create
              databases, add a built-in data browser, and personalize it.
            </p>
            <Button variant="ppg" size="2xl" href="/pricing">
              <span>Explore Pricing</span>
              <i className="fa-regular fa-arrow-right ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {review?.testimonials?.length > 0 && (
        <section className="my-12">
          <div className="px-4 py-10">
            <div className="max-w-[1240px] mx-auto">
              <h5
                className="[&>b]:text-background-ppg-reverse-strong font-sans-display stretch-display text-center text-base mb-12"
                dangerouslySetInnerHTML={{ __html: review.title }}
              />
              <Testimonials
                noShadow
                list={review.testimonials}
                mask="linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)"
              />
            </div>
          </div>
        </section>
      )}

      {/* Footer CTA Section */}
      <section className="bg-radial from-background-ppg/50 from-0% to-background-default to-70% px-4 py-12">
        <div className="mx-auto rounded-2xl bg-[url('/illustrations/homepage/footer_grid.svg')] bg-cover bg-center px-4 py-12">
          <div className="p-4 md:p-8">
            <div className="mx-auto flex max-w-[580px] flex-col items-center gap-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <h2 className="text-3xl text-foreground-neutral font-sans-display stretch-display">
                  Ready to try Prisma?
                </h2>
                <p className="text-foreground-neutral-weak">
                  Deploy a Postgres database instantly.
                </p>
              </div>
              <div className="flex flex-col gap-6 md:flex-row">
                <ConsoleCtaButton
                  variant="ppg"
                  size="2xl"
                  consolePath="/sign-up"
                  defaultUtm={INDEX_CTA_DEFAULT_UTM}
                >
                  <span>Create your first Database</span>
                  <i className="fa-regular fa-arrow-right ml-2" />
                </ConsoleCtaButton>
                <Button variant="default-stronger" size="2xl" href="/pricing">
                  <span>Explore Pricing</span>
                  <i className="fa-regular fa-arrow-right ml-2" />
                </Button>
              </div>
              <h6 className="mb-0! -mt-4 text-xs text-foreground-neutral-weaker">
                Free to get started, no credit card needed.
              </h6>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
