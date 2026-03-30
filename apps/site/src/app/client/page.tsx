import type { Metadata } from "next";
import {
  SITE_HOME_DESCRIPTION,
  SITE_HOME_TITLE,
} from "../../lib/blog-metadata";
import { Action, Button, Card } from "@prisma/eclipse";
import API from "@/components/client/api";
import { CardSection } from "@/components/homepage/card-section/card-section";
import { cn } from "@/lib/cn";
import { Technology } from "@/components/client/technology";

export const metadata: Metadata = {
  title: SITE_HOME_TITLE,
  description: SITE_HOME_DESCRIPTION,
};

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
const twoCol = [
  {
    content: (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h5 className="text-base uppercase font-sans-display stretch-display font-bold text-foreground-orm-strong mb-1">
            Editor Integration
          </h5>
          <h2 className="text-foreground-neutral stretch-display text-4xl font-black! font-sans-display my-0">
            Autocomplete your way to success
          </h2>
        </div>
        <p className="text-foreground-neutral-weak! text-base">
          The best code is the code that writes itself. Prisma Client gives you
          a fantastic autocomplete experience so you can move quickly and be
          sure you don't write an invalid query. Our obsession with type safety
          means you can rest assured that your code works as expected, every
          time.
        </p>
        <Button variant="orm" size="3xl" className="w-fit" href="/studio">
          <span>Get started in 5 minutes</span>
        </Button>
      </div>
    ),
    imageUrl: "/illustrations/client/client_0",
    imageAlt: "Autocomplete your way to success",
    mobileImageUrl: null,
    mobileImageAlt: null,
    logos: null,
    useDefaultLogos: false,
    visualPosition: "left" as const,
    visualType: "image" as const,
  },
  {
    content: (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h5 className="text-base uppercase font-sans-display stretch-display font-bold text-foreground-orm-strong mb-1">
            TypedSQL
          </h5>
          <h2 className="text-foreground-neutral stretch-display text-4xl font-black! font-sans-display my-0">
            Fully type-safe raw SQL
          </h2>
        </div>
        <p className="text-foreground-neutral-weak! text-base">
          Execute SQL queries directly against your database without losing the
          benefits of Prisma’s type-checking and auto-completion. TypedSQL
          leverages the capabilities of Prisma Client to write raw SQL queries
          that are type-checked at compile time.
        </p>
        <Button variant="orm" size="3xl" className="w-fit" href="/typedsql">
          <span>Learn more about TypedSQL</span>
        </Button>
      </div>
    ),
    imageUrl: "/illustrations/client/client_1",
    imageAlt: "Fully type-safe raw SQL",
    mobileImageUrl: null,
    mobileImageAlt: null,
    logos: null,
    useDefaultLogos: false,
    noShadow: true,
    visualPosition: "right" as const,
    visualType: "image" as const,
  },
];

export default function Client() {
  return (
    <main className="flex-1 w-screen bg-background-default">
      <div className="hero relative w-full -mt-33 pt-45 pb-8 flex flex-col gap-8 px-4">
        <div className="bg-[linear-gradient(180deg,var(--color-foreground-orm)_0%,var(--color-background-default)_100%)] absolute inset-0 z-0 overflow-hidden opacity-20" />
        <div className="flex flex-col gap-4 relative z-1">
          <h5 className="stretch-display font-sans-display mx-auto w-fit my-0 text-foreground-orm-strong uppercase">
            Prisma Client
          </h5>
          <h1 className="stretch-display text-6xl font-bold text-center font-sans-display z-2 relative max-w-223 mx-auto">
            Intuitive database client for TypeScript and Node.js
            <br />
            Database Migrations
          </h1>
        </div>
        <p className="max-w-200 w-full mx-auto text-center relative z-1">
          The Prisma Client works seamlessly across languages and databases.
          Ship faster by writing less SQL. Avoid mistakes with a fully type-safe
          API tailored specifically for your app.
        </p>
      </div>
      <div className="px-4 relative z-1">
        <div className="max-w-[1200px] mx-auto pt-12">
          <API />
        </div>
      </div>
      <div
        className={cn(
          "-mb-12 px-4 relative",
          "before:absolute before:content-[''] before:inset-0 before:opacity-20",
          "before:bg-[linear-gradient(0deg,var(--color-foreground-orm-weak)_0%,var(--color-background-default)_100%)]",
        )}
      >
        <div className="relative z-1">
          <CardSection cardSection={twoCol} />
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
                  <Technology key={db.name} text={db.name} url={db.url}>
                    <Action
                      color="neutral"
                      size="4xl"
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
                  <Technology key={fw.name} text={fw.name} url={fw.url}>
                    <Action
                      color="neutral"
                      size="4xl"
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
          <div className="grid md:grid-cols-2 gap-12 lg:gap-23">
            <div className="grid grid-rows-[auto_auto_1fr_auto]">
              <h5 className="text-base uppercase font-sans-display stretch-display font-bold text-foreground-orm-strong mb-1">
                Prisma Studio
              </h5>
              <h3 className="text-foreground-neutral text-3xl stretch-display font-sans-display mb-4">
                Visual database browser
              </h3>
              <p className="text-foreground-neutral-weak text-md mb-8">
                Prisma Studio is the easiest way to explore and manipulate data
                in your Prisma projects. Understand your data by browsing across
                tables, filter, paginate, traverse relations and edit your data
                with safety.
              </p>
              <Button variant="orm" size="3xl" className="w-fit" href="/studio">
                <span>Learn more about Prisma Studio</span>
                <i className="fa-regular fa-arrow-right ml-2" />
              </Button>
            </div>
            <div className="grid grid-rows-[auto_auto_1fr_auto]">
              <h5 className="text-base uppercase font-sans-display stretch-display font-bold text-foreground-orm-strong mb-1">
                Prisma Migrate
              </h5>
              <h3 className="text-foreground-neutral text-3xl stretch-display font-sans-display mb-4">
                Hassle-free migrations
              </h3>
              <p className="text-foreground-neutral-weak text-md mb-8">
                Prisma Migrate auto-generates SQL migrations from your Prisma
                schema. These migration files are fully customizable, giving you
                full control and ultimate flexibility — from local development
                to production environments.
              </p>
              <Button
                variant="orm"
                size="3xl"
                className="w-fit"
                href="/migrate"
              >
                <span>Learn more about Prisma Migrate</span>
                <i className="fa-regular fa-arrow-right ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
