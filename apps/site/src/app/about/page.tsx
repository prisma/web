import Antigravity from "../../components/homepage/antigravity";
import type { Metadata } from "next";
import {
  SITE_HOME_DESCRIPTION,
  SITE_HOME_TITLE,
} from "../../lib/blog-metadata";
import {
  Action,
  Accordion,
  Button,
  Card,
  Separator,
  Avatar,
  Accordions,
} from "@prisma/eclipse";
import { CardSection } from "@/components/homepage/card-section/card-section";
import review from "../../data/homepage.json";
import { cn } from "@/lib/cn";

import { MasonryPict } from "@/components/careers/masonry";

const what_we_care_about = [
  {
    content: (
      <div className="flex flex-col gap-6 self-start">
        <h3 className="text-foreground-neutral stretch-display text-2xl font-black! font-sans-display">
          Open-Source
        </h3>
        <p className="text-foreground-neutral-weak! text-base">
          To support the OSS community and help fund the ecosystem around
          Prisma, we started our Free and Open Source Software (FOSS) Fund in
          April 2022. Each month Prisma donates a one-off amount of $500 to a
          selected open-source project.
        </p>

        <Accordions type="single" className="border-none">
          <Accordion title="How the program works">
            <>
              <Separator className="-ml-[36px] -mr-[16px] w-[calc(100%+36px+16px)]" />
              <ul className="list-disc text-left flex flex-col items-start">
                <li className="my-1 md:my-1.5">
                  The Prisma team nominates projects they believe deserve
                  support.
                </li>
                <li className="my-1 md:my-1.5">
                  The Developer Connections team and representatives from the
                  engineering teams review the nominations.
                </li>
                <li className="my-1 md:my-1.5">
                  The entire company votes to select three recipients each
                  quarter to receive the one-time stipend of $500.
                </li>
                <li className="my-1 md:my-1.5">
                  Recipient projects are announced each month on social media.
                </li>
              </ul>
              <p className="my-2 text-left">
                To qualify, nominees need to meet the following criteria:
              </p>
              <ul className="list-disc text-left flex flex-col items-start">
                <li className="my-1 md:my-1.5">
                  Usage within Prisma or the Prisma ecosystem
                </li>
                <li className="my-1 md:my-1.5">
                  Overall project health and aligned with Prisma company values
                </li>
                <li className="my-1 md:my-1.5">
                  Ability to receive and distribute funds
                </li>
              </ul>
              <h6 className="mt-6 mb-4  text-foreground-neutral-weaker text-xs">
                Projects owned or managed by Prisma employees cannot be
                nominated.
              </h6>
            </>
          </Accordion>
        </Accordions>
      </div>
    ),
    imageUrl: "/illustrations/about/about_0",
    imageAlt: "About",
    mobileImageUrl: "/illustrations/about/about_0",
    mobileImageAlt: "About",
    logos: null,
    useDefaultLogos: true,
    alignItems: "items-start" as const,
    visualPosition: "left" as const,
    visualType: "image" as const,
  },
  {
    content: (
      <div className="flex flex-col gap-6 self-start">
        <h3 className="text-foreground-neutral stretch-display text-2xl font-black! font-sans-display">
          Climate change
        </h3>
        <p className="text-foreground-neutral-weak! text-base">
          Prisma is committed to supporting initiatives that raise awareness
          about and combat the effects of climate change. We will all be
          affected by this, and we owe it to the places, people, and wildlife of
          this planet to make substantial changes and reduce our impact on the
          climate.
        </p>

        <Accordions type="single" className="border-none">
          <Accordion title="To fight climate change, Prisma...">
            <Separator className="-ml-[36px] -mr-[16px] w-[calc(100%+36px+16px)]" />
            <ul className="list-disc text-left flex flex-col items-start">
              <li className="my-1 md:my-1.5">
                Matches all employee donations for climate change-related
                charities and fundraising
              </li>
              <li className="my-1 md:my-1.5">
                Maintains sustainable practices—i.e. utilizing green energy,
                recycling, and reducing waste—in the Prisma office space
              </li>
              <li className="my-1 md:my-1.5">
                Encourages all employees to participate in local climate
                strikes/events
              </li>
              <li className="my-1 md:my-1.5">
                <a
                  href="https://www.travelperk.com/travel-solutions/sustainability/greenperk/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Offsets the carbon footprint
                </a>{" "}
                of company travel and shipping
              </li>
              <li className="my-1 md:my-1.5">
                Commits 1% of earned revenue (via Stripe) to fund{" "}
                <a
                  href="https://www.nap.edu/read/25259/chapter/2#4"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  carbon removal
                </a>
              </li>
            </ul>
          </Accordion>
        </Accordions>
      </div>
    ),
    imageUrl: "/illustrations/about/about_1",
    imageAlt: "About",
    mobileImageUrl: "/illustrations/about/about_1",
    mobileImageAlt: "About",
    logos: null,
    useDefaultLogos: true,
    alignItems: "items-start" as const,
    visualPosition: "right" as const,
    visualType: "image" as const,
  },
];

const masonryImages = [
  { imageUrl: "/photos/careers/masonry_1.webp", imageAlt: "Masonry 1" },
  { imageUrl: "/photos/careers/masonry_2.webp", imageAlt: "Masonry 2" },
  { imageUrl: "/photos/careers/masonry_3.webp", imageAlt: "Masonry 3" },
  { imageUrl: "/photos/careers/masonry_4.webp", imageAlt: "Masonry 4" },
  { imageUrl: "/photos/careers/masonry_5.webp", imageAlt: "Masonry 5" },
  { imageUrl: "/photos/careers/masonry_10.webp", imageAlt: "Masonry 10" },
  { imageUrl: "/photos/careers/masonry_6.webp", imageAlt: "Masonry 6" },
  { imageUrl: "/photos/careers/masonry_7.webp", imageAlt: "Masonry 7" },
  { imageUrl: "/photos/careers/masonry_8.webp", imageAlt: "Masonry 8" },
  { imageUrl: "/photos/careers/masonry_9.webp", imageAlt: "Masonry 9" },
  { imageUrl: "/photos/careers/masonry_14.webp", imageAlt: "Masonry 14" },
  { imageUrl: "/photos/careers/masonry_11.webp", imageAlt: "Masonry 11" },
  { imageUrl: "/photos/careers/masonry_12.webp", imageAlt: "Masonry 12" },
  { imageUrl: "/photos/careers/masonry_13.webp", imageAlt: "Masonry 13" },
];

const boxes = [
  {
    icon: "fa-regular fa-code",
    title: "Built on open source",
    description: (
      <p className="text-foreground-neutral text-foreground-neutral-weak text-sm font-normal m-0 leading-6">
        Prisma evolved from an open-source project to the{" "}
        <a
          href="https://www.prisma.io/blog/how-prisma-orm-became-the-most-downloaded-orm-for-node-js"
          target="_blank"
          rel="noopener noreferrer"
        >
          most downloaded ORM in the Node.js ecosystem
        </a>
        , powered by our commitment to improving DX and a strong community.
      </p>
    ),
  },
  {
    icon: "fa-regular fa-recycle",
    title: "Throughout the development lifecycle",
    description: (
      <p className="text-foreground-neutral text-foreground-neutral-weak text-sm font-normal m-0 leading-6">
        We equip developers with the right tools at every stage, whether they
        are <a href="/blog/bfg">building, fortifying, or growing</a> their
        applications.
      </p>
    ),
  },
  {
    icon: "fa-regular fa-cubes-stacked",
    title: "Built on open source",
    description: (
      <p className="text-foreground-neutral text-foreground-neutral-weak text-sm font-normal m-0 leading-6">
        Applying <a href="https://www.datadx.io/">Data DX</a> principles to all
        our products, we create simple solutions for complex problems, making
        building with data more accessible, regardless of team size.
      </p>
    ),
  },
];

const investors = {
  companies: [
    {
      name: "Amplify",
      logo: "/icons/companies/about/amplify.svg",
      url: "https://amplify.com",
    },
    {
      name: "Altimeter",
      logo: "/icons/companies/about/altimeter.svg",
      url: "https://altimeter.ai",
    },
    {
      name: "ivp",
      logo: "/icons/companies/about/ivp.svg",
      url: "https://www.ivp.com/",
    },
    {
      name: "Kleiner Perkins",
      logo: "/icons/companies/about/kleiner-perkins.svg",
      url: "https://www.kleinerperkins.com/",
    },
    {
      name: "Fathom.",
      logo: "/icons/companies/about/fathom.svg",
      url: "https://www.fathom.ai/",
    },
    {
      name: "System.one",
      logo: "/icons/companies/about/system-one.svg",
      url: "https://www.system.one/",
    },
  ],
  people: [
    {
      name: "Guillermo Rauch",
      title: "CEO at Vercel",
      imageUrl: "/photos/people/guillermo-rauch.jpeg",
    },
    {
      name: "Adam Wiggins",
      title: "Founder of Heroku",
      imageUrl: "/photos/people/adam-wiggins.jpg",
    },
    {
      name: "Nicholas Schrock",
      title: "Creator of GraphQL",
      imageUrl: "/photos/people/nick-schrock.jpg",
    },
    {
      name: "Augusto Marietti",
      title: "CEO at Kong",
      imageUrl: "/photos/people/augusto-marietti.jpeg",
    },
    {
      name: "Jeremy Yap",
      title: "Angel Investor",
      imageUrl: "/photos/people/jeremy-yap.png",
    },
    {
      name: "Philip Moehring",
      title: "AngelList Europe",
      imageUrl: "/photos/people/philip-moehring.png",
    },
    {
      name: "Andy Chung",
      title: "AngelList Europe",
      imageUrl: "/photos/people/andy-chung.png",
    },
    {
      name: "Nicolas Dessaigne",
      title: "CEO at Algolia",
      imageUrl: "/photos/people/nicolas-dessaigne.jpg",
    },
    {
      name: "Robin Vasan",
      title: "GP at Mango Capital",
      imageUrl: "/photos/people/robin-vasan.jpg",
    },
    {
      name: "Spencer Kimball",
      title: "CEO Cockroach Labs",
      imageUrl: "/photos/people/spencer-kimball.jpeg",
    },
    {
      name: "Tom Preston Warner",
      title: "Founder, GitHub",
      imageUrl: "/photos/people/tom-preston-warner.webp",
    },
    {
      name: "Sam Lambert",
      title: "CEO Planetscale",
      imageUrl: "/photos/people/sam-lambert.webp",
    },
    {
      name: "Adam Gross",
      title: "Investor",
      imageUrl: "/photos/people/adam-gross.jpg",
    },
    {
      name: "Christian Bach",
      title: "Co-founder Netlify",
      imageUrl: "/photos/people/christian-bach.png",
    },
    {
      name: "James Walker",
      title: "VP, Product Marketing Temporal",
      imageUrl: "/photos/people/james.png",
    },
  ],
};

export const metadata: Metadata = {
  title: SITE_HOME_TITLE,
  description: SITE_HOME_DESCRIPTION,
};

export default function About() {
  return (
    <main className="flex-1 w-full z-1 bg-background-default">
      <div className="hero -mt-24 relative flex items-end justify-center px-4 py-12 pb-40">
        <div className="absolute inset-0 z-1 bg-[linear-gradient(180deg,transparent_0%,var(--color-background-default)_150%)]" />
        <div className="w-screen absolute inset-0 z-0">
          <img
            src="/illustrations/about/hero_bg.svg"
            alt="Hero lines"
            className="w-full h-full object-cover object-bottom hidden dark:block"
          />
          <img
            src="/illustrations/about/hero_bg_light.svg"
            alt="Hero lines"
            className="w-full h-full object-cover object-bottom block dark:hidden"
          />
        </div>
        <div className="content relative z-2 my-12 flex flex-col gap-8 mt-30 py-12">
          <h1 className="text-6xl [font-variation-settings:'wght'_900,'wdth'_125] mb-0 text-center mt-0 font-sans-display text-foreground-neutral">
            Join Prisma
          </h1>
          <p className="text-center text-foreground-neutral max-w-2xl mx-auto mb-12">
            Our mission is to unlock productivity for developers by bringing
            delightful ways to build with data. Data DX is at the core of all
            our products.
          </p>
          <Card className="grid! md:grid-cols-3 gap-6 max-w-[1200px] mx-auto bg-background-default p-12 border-none -mb-80 gap-y-8">
            {boxes.map((box: any, idx: number) => (
              <div className="flex flex-col gap-4" key={idx}>
                <div className="flex gap-4 items-center">
                  <Action color="orm" size="4xl">
                    <i className={cn("text-xl", box.icon)} />
                  </Action>
                  <h3 className="text-foreground-neutral font-sans-display text-xl stretch-display mt-0 mb-1 font-bold">
                    {box.title}
                  </h3>
                </div>
                {box.description}
              </div>
            ))}
          </Card>
        </div>
      </div>

      <div className="py-12 relative px-4">
        <div className="absolute inset-0 z-0 bg-background-default" />
        <div className="my-12 relative z-1">
          <MasonryPict images={masonryImages} gutter="16px" />
        </div>
      </div>
      <div className="py-12 px-4 relative">
        <div className="absolute inset-0 z-0 bg-[linear-gradient(0deg,var(--color-foreground-orm)_0%,var(--color-background-default)_100%)] opacity-20" />
        <div className="max-w-[1200px] w-full p-4 mx-auto">
          <h2 className="relative z-1 text-center m-0 mb-4 text-4xl md:text-[36px] font-black text-foreground-neutral font-sans-display stretch-display">
            Our Investors
          </h2>
          <div className="my-12 relative z-1 flex justify-center lg:justify-between items-center flex-wrap gap-4 gap-y-6 invert dark:filter-none">
            {investors.companies.map((company: any, idx: number) => (
              <a
                key={idx}
                className="contents"
                href={company.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={company.logo} alt={company.name} className="w-auto" />
              </a>
            ))}
          </div>
          <Separator className="my-12" />
          <div className="investors-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {investors.people.map((investor: any, idx: number) => (
              <div key={idx} className="p-4 flex gap-4">
                <Avatar size="3xl">
                  <img
                    src={investor.imageUrl}
                    alt={investor.name}
                    className="w-full"
                  />
                </Avatar>
                <div className="flex flex-col gap-1">
                  <h4 className="text-foreground-neutral">{investor.name}</h4>
                  <p className="text-foreground-neutral-weak">
                    {investor.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="py-12 px-4 relative">
        <div className="absolute inset-0 z-0 bg-[linear-gradient(180deg,var(--color-foreground-orm)_0%,var(--color-background-default)_100%)] opacity-20" />
        <div className="max-w-[1200px] w-full p-4 mx-auto relative z-1">
          <Card className="p-12  flex-row justify-around bg-background-default border-none flex-wrap">
            <a
              href="https://www.crunchbase.com/organization/prisma-io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground-neutral hover:text-foreground-orm-strong transition-colors font-bold"
            >
              <i className="fa-kit fa-crunchbase mr-4 text-foreground-orm-strong" />
              <span className="underline underline-offset-3  font-sans-display">
                Prisma on Crunchbase
              </span>
              <i className="fa-regular fa-arrow-up-right ml-2" />
            </a>
            <a
              href="https://pris.ly/linkedin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground-neutral hover:text-foreground-orm-strong transition-colors font-bold"
            >
              <i className="fa-brands fa-square-linkedin mr-3 text-foreground-orm-strong" />
              <span className="underline underline-offset-3  font-sans-display">
                Prisma on LinkedIn
              </span>
              <i className="fa-regular fa-arrow-up-right ml-2" />
            </a>
            <a
              href="https://github.com/prisma/presskit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground-neutral hover:text-foreground-orm-strong transition-colors font-bold"
            >
              <i className="fa-kit fa-prisma mr-2 text-foreground-orm-strong text-xl" />
              <span className="underline underline-offset-3  font-sans-display">
                Press kit
              </span>
              <i className="fa-regular fa-arrow-up-right ml-2" />
            </a>
          </Card>
        </div>
      </div>
      <div className="pt-12 px-4 relative">
        <div className="max-w-[1200px] w-full mx-auto flex flex-col gap-8 relative z-1">
          <section className="py-16 px-4">
            <h3 className="relative z-1 text-center text-3xl md:text-[36px] font-black text-foreground-neutral font-sans-display stretch-display">
              What we care about
            </h3>

            <CardSection cardSection={what_we_care_about} />
          </section>
        </div>
      </div>
      <div className="pb-24 relative">
        <div className="bg-[linear-gradient(180deg,var(--color-background-default)-177.75%,var(--color-background-orm-strong)100%)] shadow-[0_1px_2px_0_rgba(0,0,0,0.04)] p-12">
          <div className="web-cta flex gap-3 md:gap-12 items-center mx-auto w-fit lg:p-4 flex-col md:flex-row">
            <h3 className="text-2xl text-foreground-neutral font-sans-display font-bold text-center md:text-left">
              Join the team
            </h3>
            <div className="content flex flex-col lg:flex-row gap-3 lg:gap-12 items-center md:items-start lg:items-center">
              <p className="max-w-94 w-full text-center md:text-left text-foreground-neutral-weak text-md">
                We’re always excited to talk to more people who share our vision
                to empower developers to build data-driven applications.
              </p>
              <Button variant="orm" size="4xl" href="/careers">
                <span>View open positions</span>
                <i className="fa-regular fa-arrow-right ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
