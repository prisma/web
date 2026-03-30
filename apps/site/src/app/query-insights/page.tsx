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

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <main className="bg-background-default">
      <div className="pt-42! -mt-42! relative">
        <div className="opacity-20 absolute top-0 left-0 w-full h-full bg-[linear-gradient(180deg,var(--color-foreground-ppg)_0%,var(--color-background-default)_100%)]" />
        <div className="section-hero mt-18! max-w-308 px-4 w-full mx-auto! flex flex-col gap-8 relative pt-12">
          <div className="title">
            <div className="eyebrow text-center uppercase font-mona-sans stretch-display font-extrabold text-foreground-ppg-weak mb-4!">
              <span>Query insights</span>
              <i className="fa-solid fa-brain-circuit ml-2! inline-block!"></i>
            </div>
            <h1 className="font-mona-sans stretch-display text-6xl text-foreground-neutral text-center">
              AI-powered insights
              <br /> built into Prisma Postgres
            </h1>
          </div>
          <p className="text-foreground-neutral-weak font-mona-sans max-w-200 w-full mx-auto! text-center">
            Understand why your database queries are slow, see their real impact
            in production, and generate a structured AI prompt to improve them.
          </p>
          <div className="btn-group inline-flex gap-4 md:w-fit mx-auto! items-center justify-center flex-col sm:flex-row w-full sm:w-fit">
            <Button
              variant="ppg"
              size="4xl"
              className="font-mona-sans font-[650] text-base! w-full sm:w-fit"
              href="/postgres"
            >
              <span>Start with Prisma Postgres</span>
              <i className="fa-regular fa-database ml-3!" />
            </Button>
            <Button variant="default-stronger" size="4xl" href="/docs">
              <span>Read the docs</span>
              <i className="fa-regular fa-book-open ml-3!" />
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
                imageMobileUrl:
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
                imageMobileUrl:
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
                imageMobileUrl:
                  "/illustrations/query-insights/features_3_mobile",
                mobileImageAlt: "Query insights features",
                logos: null,
                useDefaultLogos: false,
                visualPosition: "left" as const,
                visualType: "image" as const,
                content: (
                  <div className="text-center md:text-left content">
                    <Badge
                      label="Coming soon"
                      color="success"
                      className="mb-4!"
                    />
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
      {/*

      COMMENTED VIDEO SECTION UNTIL WE HAVE A VIDEO

      <div className="relative my-12! z-1">
        <div className="max-w-182 px-4 w-full mx-auto!">
          <h4 className="text-[30px]! text-foreground-neutral text-center font-mona-sans my-0! stretch-display font-black!">
            See how it works
          </h4>
          <p className="mb-6! mt-4! text-foreground-neutral-weak text-center text-base! max-w-92 md:max-w-full mx-auto!">
            <strong>See the full workflow:</strong> a slow endpoint, the query
            behind it, and the prompt that helps fix it.
          </p>
          <div className="player max-w-171 w-full mx-auto! rounded-square overflow-hidden">
            <YouTubePlayer video="/" playOnView />
          </div>
        </div>
      </div>
        */}
      <div className="bg-[url('/illustrations/homepage/footer_grid.svg')] bg-contain bg-center before:inset-x-30 before:inset-y-0 before:absolute relative before:content-[''] before:pointer-events-none before:-z-1 rounded-full before:bg-teal-400 before:blur-[100px] relative">
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
              <Button variant="ppg" size="2xl" href="/postgres">
                <span>Start with Prisma Postgres</span>
                <i className="fa-regular fa-arrow-right ml-2" />
              </Button>
              <Button
                variant="default-stronger"
                size="2xl"
                href="/docs/postgres/faq#query-insights"
              >
                <span>Read the docs</span>
                <i className="fa-regular fa-book-open ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
