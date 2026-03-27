import type { Metadata } from "next";
import {
  SITE_HOME_DESCRIPTION,
  SITE_HOME_TITLE,
} from "../../lib/blog-metadata";
import { Button, Card, Action } from "@prisma/eclipse";
import { CopyCode } from "@/components/homepage/copy-btn";
import LogoParade from "@prisma-docs/ui/components/logo-parade";
import React from "react";
import { Bento } from "@/components/homepage/bento";
import { CardSection } from "@/components/homepage/card-section/card-section";
import review from "../../data/homepage.json";
import Testimonials from "../../components/homepage/testimonials";
import { cn } from "@/lib/cn";
import { Technology } from "@/components/technology";
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
const databases = {
  title: "Supported Databases",
  list: [
    {
      name: "PostgreSQL",
      icon: "/icons/companies/postgres.svg",
      url: "/",
    },
    {
      name: "MySQL",
      icon: "/icons/technologies/mysqlsimple.svg",
      url: "/",
    },
    {
      name: "MariaDB",
      icon: "/icons/technologies/mariadb.svg",
      url: "/",
    },
    {
      name: "SQLite",
      icon: "/icons/companies/sqlite.svg",
      url: "/",
    },
    {
      name: "SQL Server",
      icon: "/icons/companies/sqlserver.svg",
      url: "/",
    },
    {
      name: "CockroachDB",
      icon: "/icons/companies/cockroachdb.svg",
      url: "/",
    },
    {
      name: "PlanetScale",
      icon: "/icons/companies/planetscale.svg",
      url: "/",
    },
    {
      name: "MongoDB",
      icon: "/icons/technologies/mongodbsimple.svg",
      url: "/",
    },
  ],
};
const frameworks = {
  title: "Selected Frameworks",
  description:
    "Easy to integrate into your framework of choice, Prisma simplifies database access, saves repetitive CRUD boilerplate and increases type safety.",
  list: [
    {
      name: "React",
      icon: "/icons/technologies/react.svg",
      url: "/react",
    },
    {
      name: "Next.js",
      icon: "/icons/technologies/nextjs.svg",
      url: "/nextjs",
    },
    {
      name: "NestJS",
      icon: "/icons/technologies/nestjs.svg",
      url: "/nestjs",
    },
    {
      name: "Apollo",
      icon: "/icons/technologies/apollo.svg",
      url: "/apollo",
    },
    {
      name: "Hapi",
      icon: "/icons/technologies/hapi.svg",
      url: "/hapi",
    },
    {
      name: "GraphQL",
      icon: "/icons/technologies/graphql.svg",
      url: "/graphql",
    },
    {
      name: "ExpressJS",
      icon: "/icons/technologies/express.svg",
      url: "/express",
    },
    {
      name: "Redwood",
      icon: "/icons/technologies/redwoodjs.svg",
      url: "/redwood",
    },
  ],
};
export const metadata: Metadata = {
  title: SITE_HOME_TITLE,
  description: SITE_HOME_DESCRIPTION,
};

export default function SiteHome() {
  return (
    <main className="flex-1 w-full z-1 bg-background-default">
      <div className="hero h-123 -mt-24 flex items-end justify-center px-4">
        <div className="content relative z-2 my-12 flex flex-col gap-8">
          <h1 className="text-6xl [font-variation-settings:'wght'_900,'wdth'_125] mb-0 text-center mt-0 font-sans-display text-foreground-neutral">
            Postgres, <br />
            perfectly managed.
          </h1>
          <p className="text-center text-foreground-neutral max-w-2xl mx-auto">
            Real Postgres with the developer experience and infrastructure to
            ship faster.
          </p>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <Button
              variant="ppg"
              href="https://console.prisma.io/sign-up?utm_source=website&utm_medium=index&utm_campaign=cta"
              size="3xl"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans-display! font-[650]"
            >
              <span>Create database</span>
              <i className="fa-regular fa-database ml-2" />
            </Button>
            <CopyCode text="npx prisma init">
              <span className="text-foreground-neutral-reverse-weak">$</span>
              <span className="text-foreground-neutral-weak">
                &nbsp;npx prisma init
              </span>
              <i className="fa-regular fa-copy ml-2" />
            </CopyCode>
          </div>
        </div>
      </div>
      <div
        className={cn(
          "py-12 px-4 relative",
          "before:absolute before:content-[''] before:inset-0 before:opacity-20 before:z-0",
          "before:bg-[linear-gradient(180deg,var(--color-foreground-orm-weak)_0%,var(--color-background-default)_100%)]",
        )}
      >
        <div className="max-w-[1200px] mx-auto z-1 relative flex flex-col gap-40">
          <div className="cards mx-auto max-w-222 flex flex-col gap-6">
            <h2 className="text-foreground-neutral text-center stretch-display text-4xl font-black! font-sans-display mt-0 mb-4">
              Works with your favourite
              <br />
              databases and framework
            </h2>
            <Card className="bg-background-default flex-row! md:gap-8! justify-between items-center md:p-8 flex-wrap">
              <h5 className="text-xl font-sans-display stretch-display font-bold md:w-min text-foreground-neutral">
                {databases.title}
              </h5>
              <div className="flex gap-1 flex-wrap">
                {databases.list.map((db) => (
                  <Technology text={db.name} url={db.url}>
                    <Action
                      color="neutral"
                      size="4xl"
                      key={db.name}
                      className="h-[75px]! w-[75px]! hover:bg-background-neutral-strong"
                    >
                      <img src={db.icon} alt={db.name} />
                    </Action>
                  </Technology>
                ))}
              </div>
            </Card>
            <Card className="bg-background-default md:gap-8! justify-between items-start md:items-center md:p-8">
              <div className="flex gap-2 md:gap-6 items-start md:items-center md:flex-row flex-col">
                <h5 className="text-xl font-sans-display stretch-display font-bold md:w-min text-foreground-neutral">
                  {frameworks.title}
                </h5>
                <p className="text-base text-foreground-neutral-weak">
                  {frameworks.description}
                </p>
              </div>
              <div className="flex gap-1 flex-wrap">
                {frameworks.list.map((fw) => (
                  <Technology text={fw.name} url={fw.url}>
                    <Action
                      color="neutral"
                      size="4xl"
                      key={fw.name}
                      className="h-[75px]! w-[75px]! hover:bg-background-neutral-strong"
                    >
                      <img src={fw.icon} alt={fw.name} />
                    </Action>
                  </Technology>
                ))}
              </div>
            </Card>
            <div className="flex gap-4 mx-auto w-fit flex-wrap justify-center">
              <Button variant="default-stronger" size="3xl">
                <span>Browse examples on GitHub</span>
                <i className="fa-brands fa-github ml-2" />
              </Button>
              <Button variant="orm" size="3xl">
                <span>Prisma in your stack</span>
                <i className="fa-regular fa-arrow-right ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
