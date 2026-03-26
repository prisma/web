import Antigravity from "../../components/homepage/antigravity";
import type { Metadata } from "next";
import {
  SITE_HOME_DESCRIPTION,
  SITE_HOME_TITLE,
} from "../../lib/blog-metadata";
import { Button, Separator } from "@prisma/eclipse";
import { Bento } from "@/components/homepage/bento";
import { CardSection } from "@/components/homepage/card-section/card-section";
import review from "../../data/homepage.json";
import Testimonials from "../../components/homepage/testimonials";
import { InfoStats } from "@/components/orm/info-stats";

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
      { label: "JavaScript", url: "/js" },
      { label: "TypeScript", url: "/ts" },
    ],
  },
  {
    title: "community-supported languages",
    list: [
      { label: "Python", url: "/py" },
      { label: "Dart", url: "/dart" },
      { label: "GO", url: "/GO" },
      { label: "Rust", url: "/rust" },
    ],
  },
];
const CardFooter = () => (
  <>
    <Separator className="my-6" />
    <div className="flex justify-between w-full">
      {badge_list.map((badge: any, index: number) => (
        <div className="flex gap-6 items-center" key={index}>
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
          <h5 className="font-sans-display text-foreground-orm uppercase stretch-dispaly">
            Why Prisma ORM
          </h5>
          <h2 className="text-foreground-neutral stretch-display text-4xl font-sans-display mt-0 mb-4">
            Postgres that <br /> fits your stack.
          </h2>
        </div>
        <p className="text-foreground-neutral-weak! text-base">
          Database workflows can feel brittle and error-prone. Prisma ORM
          increases productivity and confidence when working with databases and
          makes workflows like data modeling, migrations and querying easy.
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
    visualType: "video" as const,
    footer: <CardFooter />,
  },
  {
    content: (
      <>
        <h2 className="text-foreground-neutral stretch-display text-4xl font-sans-display mt-0 mb-4">
          Postgres that <br /> fits your stack.
        </h2>
        <p className="text-foreground-neutral-weak! text-base">
          Database workflows can feel brittle and error-prone. Prisma ORM
          increases productivity and confidence when working with databases and
          makes workflows like data modeling, migrations and querying easy.
        </p>
      </>
    ),
    imageUrl: null,
    imageAlt: null,
    mobileImageUrl: null,
    mobileImageAlt: null,
    color: "orm",
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
    imageUrl: "/illustrations/homepage/real_orm",
    imageAlt: "Real Postgres",
    mobileImageUrl: "/illustrations/homepage/real_orm_mobile",
    mobileImageAlt: "Real orm mobile",
    logos: null,
    useDefaultLogos: false,
    visualPosition: "left" as const,
    visualType: "image" as const,
  },
];
export const metadata: Metadata = {
  title: SITE_HOME_TITLE,
  description: SITE_HOME_DESCRIPTION,
};

export default function ORM() {
  return (
    <main className="flex-1 w-full z-1 ">
      <div className="hero pt-36 -mt-24 flex items-end justify-center px-4 relative">
        <div className="absolute inset-0 z-0 bg-[linear-gradient(180deg,var(--color-foreground-orm)_0%,var(--color-background-default)_100%)] opacity-20" />
        <div className="content relative z-2 flex flex-col gap-8 py-12">
          <h1 className="text-6xl stretch-display mb-0 text-center mt-0 font-sans-display text-foreground-neutral max-w-224 mx-auto">
            Next-generation Node.js and TypeScript ORM
          </h1>
          <p className="text-center text-foreground-neutral max-w-2xl mx-auto">
            Real Postgres with the developer experience and infrastructure to
            ship faster.
          </p>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <Button
              variant="orm"
              href="/docs/getting-started/quickstart-prismaPostgres"
              size="3xl"
              className="font-sans-display! font-[650]"
            >
              <span>Create database</span>
              <i className="fa-regular fa-database ml-2" />
            </Button>
            <Button
              variant="default-stronger"
              href="https://console.prisma.io/sign-up?utm_source=website&utm_medium=index&utm_campaign=cta"
              size="3xl"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans-display! font-[650]"
            >
              <span>Create database</span>
              <i className="fa-regular fa-database ml-2" />
            </Button>
          </div>
        </div>
      </div>
      <div className="my-12 flex gap-30 w-fit mx-auto px-40">
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
      <div>
        <div className="my-12 bg-[linear-gradient(180deg,var(--color-background-default)-177.75%,var(--color-background-orm-str)100%)] shadow-[0_1px_2px_0_rgba(0,0,0,0.04)] p-12">
          <div className="web-cta flex gap-3 md:gap-12 items-center mx-auto w-fit lg:p-4 flex-col md:flex-row">
            <h3 className="text-2xl text-foreground-neutral font-sans-display font-bold text-center md:text-left">
              Build anything.
              <br />
              Deploy instantly.
            </h3>
            <div className="content flex flex-col lg:flex-row gap-3 lg:gap-12 items-center md:items-start lg:items-center">
              <p className="max-w-94 w-full text-center md:text-left text-foreground-neutral-weak text-md">
                Give your users instant production-ready Postgres, create
                databases, add a built-in data browser, and personalize it.
              </p>
              <Button variant="orm" size="2xl">
                <span>Explore Pricing</span>
                <i className="fa-regular fa-arrow-right ml-2" />
              </Button>
            </div>
          </div>
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
                  list={review.testimonials}
                  mask="linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="bg-[url('/illustrations/homepage/footer_grid.svg')] bg-contain bg-center before:inset-x-30 before:inset-y-[45%] before:absolute relative before:content-[''] before:pointer-events-none before:-z-1 rounded-full before:bg-teal-400 before:blur-[100px]">
        <div className="my-12 p-12">
          <div className="flex flex-col mx-auto w-fit items-center justify-center gap-8">
            <div className="flex flex-col items-center text-center gap-4">
              <h2 className="text-3xl text-foreground-neutral font-sans-display stretch-display">
                Ready to try Prisma?
              </h2>
              <p className="text-foreground-neutral-weak">
                Deploy a Postgres database instantly.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
              <Button variant="orm" size="2xl">
                <span>Create your first Database</span>
                <i className="fa-regular fa-arrow-right ml-2" />
              </Button>
              <Button variant="default-stronger" size="2xl" href="/pricing">
                <span>Explore Pricing</span>
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
