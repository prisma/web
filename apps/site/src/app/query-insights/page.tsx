import React from "react";

import { CardSection } from "@/components/homepage/card-section/card-section";
import { Metadata } from "next";
import { Badge, Button, Card } from "@prisma/eclipse";
import {
  QueryInsightsBars,
  QueryInsightsLine,
  QueryInsightsTable,
} from "../../components/query-insights";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Prisma Query Insights",
    description:
      "Understand why your database queries are slow, see their real impact in production, and generate a structured AI prompt to improve them.",
    openGraph: {
      title: "Prisma Query Insights",
      description:
        "Understand why your database queries are slow, see their real impact in production, and generate a structured AI prompt to improve them.",
      url: "https://www.prisma.io/query-insights",
      type: "website",
      siteName: "Prisma",
      images: [
        {
          url: "/og-images/og-query-insights.png",
          width: 1200,
          height: 630,
          alt: "Prisma Query Insights",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@prisma",
      creator: "@prisma",
    },
  };
}

export default async function Page() {
  return (
    <main className="bg-background-default">
      <div className="hero -mt-24 pt-40 flex items-end justify-center px-4 relative">
        <div className="absolute inset-0 pointer-events-none z-1 bg-[linear-gradient(180deg,var(--color-foreground-ppg)_0%,var(--color-background-default)_100%)] opacity-20" />
        <div className="content relative z-2 flex flex-col gap-8 max-w-308 w-full">
          <div className="flex flex-col gap-4 items-center text-center">
            <div className="flex items-center gap-2 text-foreground-ppg-weak uppercase tracking-widest text-sm font-sans-display font-black">
              <span>Query insights</span>
              <i className="fa-solid fa-brain-circuit" aria-hidden="true"></i>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl stretch-display mb-0 text-center mt-0 font-sans-display text-foreground-neutral max-w-4xl mx-auto">
              AI-powered insights
              <br /> built into Prisma Postgres
            </h1>
          </div>
          <p className="text-center text-foreground-neutral max-w-2xl mx-auto text-xl">
            Understand why your database queries are slow, see their real impact
            in production, and generate a structured AI prompt to improve them.
          </p>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <Button asChild variant="ppg" size="2xl">
              <a href="/postgres">
                <span>Get Started</span>
                <i
                  className="fa-regular fa-arrow-right ml-2"
                  aria-hidden="true"
                />
              </a>
            </Button>
            <Button asChild variant="default-strong" size="2xl">
              <a href="/docs/postgres/faq#query-insights">
                <span>Read the docs</span>
                <i
                  className="fa-regular fa-book-open ml-2"
                  aria-hidden="true"
                />
              </a>
            </Button>
          </div>
          <i className="text-xs text-foreground-neutral-weaker text-center mx-auto!">
            Query Insights is <span className="underline">included</span> with
            Prisma Postgres at no additional cost.
          </i>
        </div>
      </div>
      <div className="relative my-12!">
        <div className="section-latency max-w-253 px-4 w-full mx-auto! relative">
          <div className="grid md:grid-cols-2 gap-2">
            <Card className="p-0.25! border-none! bg-[linear-gradient(180deg,var(--color-stroke-neutral-weak)_0%,var(--color-stroke-ppg)_100%)]">
              <div className="bg-background-default p-4 rounded-square">
                <div className="font-mona-sans text-base text-foreground-neutral-weak uppercase stretch-display font-extrabold mb-2">
                  Average Latency
                </div>
                <div className="flex gap-1 items-end leading-[40px] mb-4!">
                  <span className="font-mona-sans text-[30px] text-foreground-neutral stretch-display font-black">
                    15
                  </span>
                  <span className="mb-1! inline-block text-sm text-foreground-neutral-weak">
                    Milliseconds
                  </span>
                </div>
                <QueryInsightsBars />
              </div>
            </Card>
            <Card className="p-0.25! border-none! bg-[linear-gradient(180deg,var(--color-stroke-neutral-weak)_0%,var(--color-stroke-ppg)_100%)]">
              <div className="bg-background-default p-4 rounded-square">
                <div className="font-mona-sans text-base text-foreground-neutral-weak uppercase stretch-display font-extrabold mb-2">
                  Average Latency
                </div>
                <div className="flex gap-1 items-end leading-[40px] mb-4!">
                  <span className="font-mona-sans text-[30px] text-foreground-neutral stretch-display font-black">
                    15
                  </span>
                  <span className="mb-1! inline-block text-sm text-foreground-neutral-weak">
                    Milliseconds
                  </span>
                </div>
                <QueryInsightsLine />
              </div>
            </Card>
          </div>
          <div className="hidden md:block relative">
            <QueryInsightsTable />
          </div>
        </div>
      </div>
      <div className="relative my-12!">
        <div className="section-features max-w-308 px-4 mx-auto! w-full">
          <CardSection
            cardSection={[
              {
                imageUrl: "/illustrations/query-insights/features_1",
                imageAlt: "Query insights features",
                mobileImageUrl:
                  "/illustrations/query-insights/features_1_mobile",
                mobileImageAlt: "Query insights features",
                logos: null,
                useDefaultLogos: false,
                visualPosition: "left" as const,
                visualType: "image" as const,
                content: (
                  <div className="text-center md:text-left content">
                    <h3 className="m-0! font-sans-display stretch-display text-3xl! md:text-[40px]! text-foreground-neutral">
                      Actionable query visibility
                    </h3>
                    <p className="mb-0 mt-4! text-foreground-neutral-weak text-base!">
                      Query Insights groups your queries, tracks execution time
                      and read volume, and shows you which query shapes are
                      driving performance issues, in one single overview page.
                    </p>
                  </div>
                ),
              },
              {
                imageUrl: "/illustrations/query-insights/features_2",
                imageAlt: "Query insights features",
                mobileImageUrl:
                  "/illustrations/query-insights/features_2_mobile",
                mobileImageAlt: "Query insights features",
                logos: null,
                useDefaultLogos: false,
                visualPosition: "right" as const,
                visualType: "image" as const,
                content: (
                  <div className="text-center md:text-left content">
                    <h3 className="m-0! font-mona-sans font-sans-display stretch-display text-3xl! md:text-[40px]! text-foreground-neutral">
                      From application query to SQL impact
                    </h3>
                    <p className="mb-0 mt-4! text-foreground-neutral-weak text-base!">
                      See which code-level query is causing slow responses or
                      increased load. Prisma ORM queries get exclusive
                      attribution. All other SQL queries are visible too.
                    </p>
                  </div>
                ),
              },
              {
                imageUrl: "/illustrations/query-insights/features_3",
                imageAlt: "Query insights features",
                mobileImageUrl:
                  "/illustrations/query-insights/features_3_mobile",
                mobileImageAlt: "Query insights features",
                logos: null,
                useDefaultLogos: false,
                visualPosition: "left" as const,
                visualType: "image" as const,
                content: (
                  <div className="text-center md:text-left content">
                    <h3 className="m-0! font-mona-sans font-sans-display stretch-display text-3xl! md:text-[40px]! text-foreground-neutral">
                      Generate an AI prompt to fix it
                    </h3>
                    <p className="mb-0 mt-4! text-foreground-neutral-weak text-base!">
                      Query Insights generates an optimization prompt for each
                      query group, covering likely causes like missing indexes
                      or excessive reads. Works with any AI coding assistant.
                    </p>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>
      <div className="bg-[url('/illustrations/homepage/footer_grid.svg')] bg-contain bg-center before:inset-x-30 before:inset-y-0 before:absolute relative before:content-[''] before:pointer-events-none before:-z-1 rounded-full before:bg-teal-400 before:blur-[100px]">
        <div className="my-12 p-12">
          <div className="flex flex-col mx-auto w-fit items-center justify-center gap-8">
            <div className="flex flex-col items-center text-center gap-4">
              <h2 className="text-3xl text-foreground-neutral font-sans-display stretch-display">
                Built in and free
              </h2>
              <p className="text-foreground-neutral-weak">
                Already built into Prisma Postgres. No setup, no extra cost.
                Open the Queries tab and start analyzing.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
              <Button asChild variant="ppg" size="2xl">
                <a href="/postgres">
                  <span>Get Started</span>
                  <i
                    className="fa-regular fa-arrow-right ml-2"
                    aria-hidden="true"
                  />
                </a>
              </Button>
              <Button asChild variant="default-strong" size="2xl">
                <a href="/docs/postgres/faq#query-insights">
                  <span>Read the docs</span>
                  <i
                    className="fa-regular fa-book-open ml-2"
                    aria-hidden="true"
                  />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
