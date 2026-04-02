import { JsonLd } from "@/components/json-ld";
import { createSoftwareApplicationStructuredData } from "@/lib/structured-data";
import { createPageMetadata } from "@/lib/page-metadata";
import { Action, Button, Card, Separator } from "@prisma/eclipse";
import { Bento } from "@/components/homepage/bento";
import { CardSection } from "@/components/homepage/card-section/card-section";
import review from "../../data/homepage.json";
import Testimonials from "../../components/homepage/testimonials";
import { InfoStats } from "@/components/orm/info-stats";
import { cn } from "@/lib/cn";
import { Card as FeatureCard } from "@/components/homepage/bento";
import { YouTubePlayer } from "@prisma-docs/ui/components/youtube-player";
import Image from "next/image";

const statsSection = [
  {
    icon: "fa-brands fa-github",
    number: "45k+",
    text: "Stars on GitHub",
    link: "https://github.com/prisma/prisma",
  },
  {
    icon: "fa-regular fa-rocket-launch",
    number: "250k+",
    text: "Active developers",
    link: "https://www.npmjs.com/package/prisma",
  },
];
const badge_list = [
  {
    title: "supported languages",
    list: [
      {
        label: "JavaScript",
        url: "https://github.com/prisma/prisma-examples/tree/latest/orm",
      },
      { label: "TypeScript", url: "/typescript" },
    ],
  },
];
const prismaPostgresQuickstartUrl =
  "https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/prisma-postgres";

const CardFooter = () => (
  <>
    <Separator className="my-6" />
    <div className="flex flex-col md:flex-row justify-between w-full gap-8">
      {badge_list.map((badge: any) => (
        <div className="flex flex-col md:flex-row gap-2 md:gap-6 md:items-center" key={badge.title}>
          <h6 className="font-semibold text-2xs text-foreground-neutral uppercase">
            {badge.title}
          </h6>
          <div className="flex gap-3">
            {badge.list &&
              badge.list.map((item: any) => (
                <Button
                  variant="orm-reverse"
                  href={item.url}
                  key={item.label}
                  className="text-base"
                >
                  {item.label}
                </Button>
              ))}
          </div>
        </div>
      ))}
    </div>
  </>
);
const twoCol = [
  {
    content: (
      <>
        <div className="flex flex-col gap-1">
          <h5 className="font-sans-display text-foreground-orm uppercase stretch-display">
            Why Prisma ORM
          </h5>
          <h2 className="text-foreground-neutral stretch-display text-3xl font-sans-display mt-0 mb-4">
            Delightful DB workflows
          </h2>
        </div>
        <p className="text-foreground-neutral-weak! text-base">
          Database workflows can feel brittle and error-prone. Prisma ORM increases productivity and
          confidence when working with databases and makes workflows like data modeling, migrations
          and querying easy.
        </p>
      </>
    ),
    imageUrl: null,
    imageAlt: null,
    mobileImageUrl: null,
    mobileImageAlt: null,
    logos: null,
    other: (
      <YouTubePlayer
        autoplay={false}
        video="EEDGwLB55bI"
        thumbnail={"/illustrations/orm/thumbnail.png"}
      />
    ),
    useDefaultLogos: true,
    visualPosition: "right" as const,
    visualType: "other" as const,
    footer: <CardFooter />,
  },
  {
    content: (
      <div className="flex flex-col gap-4">
        <h2 className="text-foreground-neutral stretch-display text-3xl font-sans-display mt-0 mb-4">
          Works with your favorite databases and frameworks
        </h2>
        <p className="text-foreground-neutral-weak! text-base">
          Prisma's compatibility with popular tools ensures no stack lock-in, lower integration
          costs, and smooth transitions.
        </p>
        <a href="/stack" className="link-btn orm">
          <span>Learn more</span>
          <i className="fa-regular fa-arrow-right ml-2" />
        </a>
      </div>
    ),
    imageUrl: null,
    imageAlt: null,
    mobileImageUrl: null,
    mobileImageAlt: null,
    color: "orm" as const,
    logos: null,
    useDefaultLogos: true,
    visualPosition: "right" as const,
    visualType: "logoGrid" as const,
  },
];
const twoCol_2 = [
  {
    content: (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h5 className="font-sans-display text-foreground-orm uppercase stretch-display">
            Prisma Benchmarks
          </h5>
          <h2 className="text-foreground-neutral stretch-display text-3xl font-sans-display">
            Prisma vs other ORMs
          </h2>
        </div>
        <p className="text-foreground-neutral-weak! text-base">
          A meaningful comparison of database query latencies across database providers and ORM
          libraries in the Node.js & TypeScript ecosystem.
        </p>
        <Button variant="orm" size="xl" href="https://benchmarks.prisma.io" className="w-fit">
          <span>Explore Benchmarks</span>
          <i className="fa-regular fa-arrow-right ml-2!" />
        </Button>
      </div>
    ),
    imageUrl: "/illustrations/orm/orm_1",
    imageAlt: "ORM illustration",
    mobileImageUrl: "/illustrations/orm/orm_1",
    mobileImageAlt: "ORM illustration",
    logos: null,
    noShadow: true,
    useDefaultLogos: true,
    visualPosition: "left" as const,
    visualType: "image" as const,
  },
  {
    content: (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h5 className="font-sans-display text-foreground-orm uppercase stretch-display">
            Prisma Client
          </h5>
          <h2 className="text-foreground-neutral stretch-display text-3xl font-sans-display">
            Type-safe database client
          </h2>
        </div>
        <p className="text-foreground-neutral-weak! text-base">
          Prisma Client is a query builder that’s tailored to your schema. We designed its API to be
          intuitive, both for SQL veterans and developers brand new to databases. The
          auto-completion helps you figure out your query without the need for documentation.
        </p>
        <a href="/client" className="link-btn orm">
          <span>Learn more</span>
          <i className="fa-regular fa-arrow-right ml-2" />
        </a>
      </div>
    ),
    imageUrl: "/illustrations/orm/orm_2",
    imageAlt: "ORM illustration",
    mobileImageUrl: "/illustrations/orm/orm_2",
    mobileImageAlt: "ORM illustration",
    color: "orm" as const,
    noShadow: true,
    logos: null,
    useDefaultLogos: true,
    visualPosition: "right" as const,
    visualType: "image" as const,
  },
];

const twoCol_3 = [
  {
    icon: "/icons/technologies/vscode.svg",
    title: "Extra ergonomy in VS Code",
    description:
      "Auto-completion, linting, formatting and more help Prisma developers in VSCode stay confident and productive.",
    btn: {
      url: "https://marketplace.visualstudio.com/items?itemName=Prisma.prisma",
      label: "Download Prisma VSCode Extension",
      icon: "fa-regular fa-arrow-up-right",
    },
  },
  {
    icon: "/icons/technologies/ts.svg",
    title: "Make fewer errors with TypeScript",
    description:
      "Prisma ORM provides the strongest type-safety guarantees of all the ORMs in the TypeScript ecosystem.",
    btn: {
      url: "https://www.prisma.io/docs/orm/more/comparisons/prisma-and-typeorm",
      label: "Read comparison with TypeORM",
      icon: "fa-regular fa-arrow-up-right",
    },
  },
];

const features = [
  {
    title: "Manage databases",
    subtitle: "Created directly in your IDE.",
    image: "/illustrations/orm/ide",
    alt: "Manage dbs",
    icon: "fa-light fa-screwdriver-wrench",
    link: "/mcp",
  },
  {
    title: "Type-safety",
    subtitle: "Code faster with auto-completion and type safety.",
    image: "/illustrations/orm/typesafe",
    alt: "Type-safe queries",
    icon: "fa-light fa-message-text",
    link: "https://www.prisma.io/docs/orm/prisma-client/type-safety",
  },
  {
    title: "Data model you can read",
    subtitle: "The Prisma schema is intuitive and easy to use",
    image: "/illustrations/orm/collaborative",
    alt: "Collaborative work",
    icon: "fa-light fa-screen-users",
    link: "https://console.prisma.io/login?utm_source=website&utm_medium=orm&utm_campaign=cta",
  },
  {
    title: "Browse your data",
    subtitle: "Explore, filter, and edit your data with an interface.",
    image: "/illustrations/orm/data",
    alt: "Data browsing",
    icon: "fa-light fa-magnifying-glass-arrow-right",
    link: "/studio",
  },
];

const ormStructuredData = createSoftwareApplicationStructuredData({
  path: "/orm",
  name: "Prisma ORM",
  description:
    "Next-generation Node.js and TypeScript ORM for PostgreSQL, MySQL, SQL Server, SQLite, MongoDB, and CockroachDB. Provides type-safety, automated migrations, and an intuitive data model.",
});

export const metadata = createPageMetadata({
  title: "Prisma | Next-generation ORM for Node.js & TypeScript",
  description:
    "Prisma is a next-generation Node.js and TypeScript ORM for PostgreSQL, MySQL, SQL Server, SQLite, MongoDB, and CockroachDB. It provides type-safety, automated migrations, and an intuitive data model.",
  path: "/orm",
  ogImage: "/og/og-orm.png",
});

export default function ORM() {
  return (
    <main className="flex-1 w-full z-1 ">
      <JsonLd id="orm-software-application" data={ormStructuredData} />
      <div className="hero pt-40 -mt-24 flex items-end justify-center px-4 relative">
        <div className="absolute inset-0 pointer-events-none z-1 bg-[linear-gradient(180deg,var(--color-foreground-orm)_0%,var(--color-background-default)_100%)] opacity-20" />
        <div className="content relative z-2 my-12 py-12 flex flex-col gap-8">
          <div className="flex flex-col gap-4 items-center text-center">
            <div className="flex items-center gap-2 text-foreground-orm-weak uppercase tracking-widest text-sm font-sans-display font-black">
              <i className="fa-solid fa-database" />
              <span>Prisma ORM</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl stretch-display mb-0 text-center mt-0 font-sans-display text-foreground-neutral max-w-224 mx-auto">
              Next-generation Node.js and TypeScript ORM
            </h1>
          </div>
          <p className="text-center text-foreground-neutral max-w-2xl mx-auto">
            Prisma ORM elevates developer experience with intuitive data modeling, automated
            migrations, and type-safety.
          </p>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <Button
              variant="orm"
              href="https://www.prisma.io/docs/prisma-orm/quickstart/prisma-postgres"
              size="3xl"
              className="font-sans-display! font-[650]"
            >
              <span>Create database</span>
              <i className="fa-regular fa-database ml-2" />
            </Button>
            {/*<Button
              variant="default-stronger"
              href="https://console.prisma.io/sign-up?utm_source=website&utm_medium=index&utm_campaign=cta"
              size="3xl"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans-display! font-[650]"
            >
              <span>Playground</span>
              <i className="fa-regular fa-arrow-up-right ml-2" />
            </Button>*/}
          </div>
        </div>
      </div>
      <div className="my-12 flex gap-30 w-fit mx-auto px-4 md:px-40">
        {statsSection?.map((stat: any, index: number) => (
          <InfoStats
            key={index}
            icon={stat.icon}
            number={stat.number}
            link={stat.link ? stat.link : undefined}
            text={stat.text}
          />
        ))}
      </div>
      <div className="w-screen">
        <div className="my-12">
          <CardSection cardSection={twoCol} />
        </div>
      </div>
      <div className="my-12 py-12 px-4">
        <div className="max-w-260 w-full mx-auto">
          <CardSection cardSection={twoCol_2} />
          <div className="grid md:grid-cols-2 gap-9">
            {twoCol_3.map((stat, index) => (
              <div key={stat.title} className="flex flex-col gap-4">
                <Action size="4xl" color="orm" className={cn(index === 0 && "p-0", "relative")}>
                  <Image src={stat.icon} alt={stat.title} fill loading="lazy" />
                </Action>
                <h4 className="text-2xl font-sans-display stretch-display text-foreground-neutral">
                  {stat.title}
                </h4>
                <p className="text-foreground-neutral-weak">{stat.description}</p>
                <Button variant="default-stronger" href={stat.btn.url} size="xl" className="w-fit">
                  <span>
                    {stat.btn.label} {stat.btn.icon && <i className={cn("ml-2", stat.btn.icon)} />}
                  </span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="my-12 bg-[linear-gradient(180deg,var(--color-background-default)_-177.75%,var(--color-background-orm)_100%)] shadow-[0_1px_2px_0_rgba(0,0,0,0.04)] p-12">
        <div className="web-cta flex gap-3 md:gap-12 items-center mx-auto w-fit lg:p-4 flex-col md:flex-row">
          <h3 className="text-2xl text-foreground-neutral font-sans-display font-bold text-center md:text-left">
            Streamline your
            <br />
            development workflow
          </h3>
          <div className="content flex flex-col lg:flex-row gap-3 lg:gap-12 items-center md:items-start lg:items-center">
            <p className="max-w-94 w-full text-center md:text-left text-foreground-neutral-weak text-md">
              Integrate Prisma into your development ecosystem and focus on your team’s core
              competencies
            </p>
            <Button variant="orm" size="2xl" href="/enterprise">
              <span>Explore Enterprise</span>
              <i className="fa-regular fa-arrow-right ml-2" />
            </Button>
          </div>
        </div>
      </div>
      <div className="my-12 py-12 px-4">
        <div className="grid md:grid-cols-2 gap-4 max-w-249 w-full mx-auto">
          {features.map((card: any) => (
            <FeatureCard key={card.title} card={card} color="orm" />
          ))}
        </div>
      </div>

      {review?.testimonials?.length > 0 && (
        <div>
          <div className="my-12">
            <div className="px-4 py-10">
              <div className="max-w-[1240px] mx-auto">
                <h5
                  className="[&>b]:text-background-orm-reverse-strong font-sans-display stretch-display text-center text-base mb-12"
                  dangerouslySetInnerHTML={{ __html: review.title }}
                />
                <Testimonials
                  noShadow
                  color="orm"
                  list={review.testimonials}
                  mask="linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="bg-[url('/illustrations/homepage/footer_grid.svg')] bg-contain bg-center before:inset-x-30 before:inset-y-[45%] before:absolute relative before:content-[''] before:pointer-events-none before:-z-1 rounded-full before:bg-background-orm-reverse before:blur-[100px]">
        <div className="my-12 p-12">
          <div className="flex flex-col mx-auto w-fit items-center justify-center gap-8">
            <div className="flex flex-col items-center text-center gap-4">
              <h2 className="text-3xl text-foreground-neutral font-sans-display stretch-display">
                Ready to get started?
              </h2>
              <p className="text-foreground-neutral-weak max-w-121">
                Start from scratch, add Prisma ORM to your existing project, or explore how to build
                an app using your favorite framework.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
              <Button variant="orm" size="2xl" href={prismaPostgresQuickstartUrl}>
                <span>Try Prisma ORM</span>
                <i className="fa-regular fa-arrow-right ml-2" />
              </Button>
              <Button
                variant="default-stronger"
                size="2xl"
                target="_blank"
                rel="noopener noreferrer"
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
