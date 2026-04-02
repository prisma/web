import type { Metadata } from "next";
import Image from "next/image";
import { Action, Button } from "@prisma/eclipse";
import { CardSection } from "@/components/homepage/card-section/card-section";
import { StatsList } from "@/components/careers/stats-list";

import { Flexible } from "@/components/careers/Flexible";
import { Challenges } from "@/components/careers/Challenges";
import { WorldMap } from "@/components/careers/WorldMap";
import { OpenRoles } from "@/components/careers/open-roles";

import { MasonryPict } from "@/components/careers/masonry";

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

const benefits = [
  {
    icon: "fa-regular fa-arrow-trend-up",
    text: "<b>Stock options package</b> with a maximum exercise period of 10 years after grant",
  },
  {
    icon: "fa-regular fa-hand-holding-dollar",
    text: "<b>Generous recurring tech budget</b> and subsidy for an ergonomic chair",
  },
  {
    icon: "fa-regular fa-sunglasses",
    text: "<b>24 vacation days</b> per year in addition to sick leave and public holidays",
  },
  {
    icon: "fa-regular fa-baby-carriage",
    text: "<b>20 weeks paid parental leave</b> and 10 days paid time off per year in the event of the sickness of your child",
  },
  {
    icon: "fa-regular fa-head-side-medical",
    text: "<b>4 mental health days</b> per year",
  },
  {
    icon: "fa-regular fa-star",
    text: "<b>6-week paid sabbatical leave</b> after three years",
  },
  {
    icon: "fa-regular fa-lamp-desk",
    text: "Access to <b>co-working spaces</b> in your area",
  },
  {
    icon: "fa-regular fa-headset",
    text: "Dedicated <b>People</b> and <b>Operations</b> team",
  },
  {
    icon: "fa-regular fa-island-tropical",
    text: "Two company <b>offsites</b> each year",
  },
  {
    icon: "fa-regular fa-heart-pulse",
    text: "<b>[US] 401K matching</b> as well as medical, dental, and vision cover",
  },
];

const twoCol = [
  {
    content: (
      <>
        <h2 className="text-foreground-neutral stretch-display text-4xl font-black! font-sans-display mt-0 mb-4">
          Solve challenging <br /> technical problems
        </h2>
        <p className="text-foreground-neutral-weak! text-base">
          Prisma is building the data access layer for modern applications. If
          you're drawn to the technology powering large companies but desire the
          challenges and freedom of a startup, then consider joining us.
        </p>
      </>
    ),
    imageUrl: null,
    imageAlt: null,
    mobileImageUrl: null,
    mobileImageAlt: null,
    other: <Challenges />,
    logos: null,
    useDefaultLogos: true,
    visualPosition: "right" as const,
    visualType: "other" as const,
  },
  {
    content: (
      <>
        <h2 className="text-foreground-neutral stretch-display text-4xl font-black! font-sans-display mt-0 mb-4">
          Flexible work environment
        </h2>
        <p className="text-foreground-neutral-weak! text-base">
          We offer flexible working hours and generous paid time off to
          accommodate different lifestyles and responsibilities. As long as it
          suits your team, you have the freedom to build your work schedule
          around your life.
        </p>
      </>
    ),
    imageUrl: null,
    imageAlt: null,
    mobileImageUrl: null,
    mobileImageAlt: null,
    other: <Flexible />,
    logos: null,
    useDefaultLogos: false,
    visualPosition: "left" as const,
    visualType: "other" as const,
  },
  {
    content: (
      <>
        <h2 className="text-foreground-neutral stretch-display text-4xl font-black! font-sans-display mt-0 mb-4">
          Flexible remote organization
        </h2>
        <p className="text-foreground-neutral-weak! text-base">
          Our team is globally distributed and everyone can work from any
          location within the UTC -5 to UTC +3 timezones. We want you to choose
          wherever you are happiest and most productive.
        </p>
      </>
    ),
    imageUrl: null,
    imageAlt: null,
    mobileImageUrl: null,
    mobileImageAlt: null,
    other: <WorldMap />,
    logos: null,
    useDefaultLogos: false,
    visualPosition: "right" as const,
    visualType: "other" as const,
  },
];

const statsList = [
  { head: "45", sub: "Team Members" },
  { head: "16", sub: "Countries" },
  { head: "100", sub: "Remote" },
];

export const metadata: Metadata = {
  title: "Careers | Prisma",
  description:
    "See open positions at Prisma. Join us to empower developers to build data-intensive applications.",
  alternates: {
    canonical: "https://www.prisma.io/careers",
  },
  openGraph: {
    title: "Careers | Prisma",
    description:
      "See open positions at Prisma. Join us to empower developers to build data-intensive applications.",
    url: "https://www.prisma.io/careers",
    images: [
      {
        url: "/og/og-careers.png",
        width: 1200,
        height: 630,
        alt: "Database tools for modern developers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers | Prisma",
    description:
      "See open positions at Prisma. Join us to empower developers to build data-intensive applications.",
    images: ["/og/og-careers.png"],
  },
};

export default function Careers() {
  return (
    <main className="flex-1 w-full z-1 bg-background-default">
      <div className="hero -mt-24 relative flex items-end justify-center px-4 pt-24">
        <div className="w-screen absolute inset-0 opacity-20">
          <Image
            src="/illustrations/careers/hero_lines.svg"
            alt="Hero lines"
            fill
            priority={true}
            className="object-cover object-bottom hidden dark:block"
          />
          <Image
            src="/illustrations/careers/hero_lines_light.svg"
            alt="Hero lines"
            fill
            priority={true}
            className="object-cover object-bottom block dark:hidden"
          />
        </div>
        <div className="content relative z-2 my-12 flex flex-col gap-8 mt-30 py-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl stretch-display mb-0 text-center mt-0 font-sans-display text-foreground-neutral max-w-224 mx-auto">
            Join Prisma
          </h1>
          <p className="text-center text-foreground-neutral max-w-2xl mx-auto">
            Help us empower developers to build data-driven applications.
          </p>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <Button
              variant="orm"
              href="#open-positions"
              size="3xl"
              className="font-sans-display! font-[650]"
            >
              <span>View open positions</span>
              <i className="fa-solid fa-arrow-down ml-2" />
            </Button>
          </div>
        </div>
      </div>

      <div className="py-12 relative px-4 ">
        <div className="absolute inset-0 pointer-events-none z-1 bg-[linear-gradient(180deg,var(--color-foreground-orm)_0%,var(--color-background-default)_100%)] opacity-20" />
        <div className="z-1 relative">
          <StatsList statsList={statsList} />
        </div>
        <div className="my-12 relative z-1">
          <MasonryPict images={masonryImages} gutter="16px" />
        </div>
      </div>
      <div className="py-12 px-4 relative">
        <div className="max-w-[1200px] w-full mx-auto">
          <div className="absolute inset-0 pointer-events-none z-1 bg-[linear-gradient(0deg,var(--color-foreground-orm)_0%,var(--color-background-default)_100%)] opacity-20" />
          <h2 className="relative z-1 text-center m-0 mb-4 text-4xl md:text-[36px] font-black text-foreground-neutral font-sans-display stretch-display">
            Why Prisma?
          </h2>
          <div className="mt-12 relative z-1">
            <CardSection cardSection={twoCol} />
          </div>
        </div>
      </div>
      <div className="py-12 px-4 relative">
        <div className="absolute inset-0 pointer-events-none z-1 bg-[linear-gradient(180deg,var(--color-foreground-orm)_0%,var(--color-background-default)_100%)] opacity-20" />
        <div className="max-w-[1200px] w-full mx-auto flex flex-col gap-8 relative z-1">
          <section className="py-16 px-4">
            <div className="max-w-[1200px] mx-auto flex-col flex gap-8">
              <h2 className="relative z-1 text-center text-4xl md:text-[36px] font-black text-foreground-neutral font-sans-display stretch-display">
                Our Values
              </h2>
              <p className="text-base text-foreground-neutral-weak text-center max-w-[844px] mx-auto mb-4">
                At Prisma, we believe that our company values are essential to
                our success. They guide us in our daily work, helping us to
                thrive and creating an environment where team members can grow
                and collaborate effectively.
              </p>

              {/* Values Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[800px] mx-auto">
                {/* Transparency */}
                <div className="flex items-center gap-6">
                  <Action color="orm" size="5xl">
                    <i className="fa-regular fa-eye text-3xl" />
                  </Action>
                  <h3 className="text-2xl font-bold font-sans-display">
                    Transparency
                  </h3>
                </div>

                {/* Curiosity */}
                <div className="flex items-center gap-6">
                  <Action color="orm" size="5xl">
                    <i className="fa-regular fa-face-raised-eyebrow text-3xl" />
                  </Action>
                  <h3 className="text-2xl font-bold font-sans-display">
                    Curiosity
                  </h3>
                </div>

                {/* Solidarity */}
                <div className="flex items-center gap-6">
                  <Action color="orm" size="5xl">
                    <i className="fa-regular fa-handshake text-3xl" />
                  </Action>
                  <h3 className="text-2xl font-bold">Solidarity</h3>
                </div>

                {/* Accountability */}
                <div className="flex items-center gap-6">
                  <Action color="orm" size="5xl">
                    <i className="fa-regular fa-hand-pointer text-3xl" />
                  </Action>
                  <h3 className="text-2xl font-bold">Accountability</h3>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div className="py-12 px-4 relative">
        <div className="relative z-1 max-w-[940px] w-full mx-auto flex flex-col gap-8 my-12">
          <h2 className="text-center m-0 mb-4 text-4xl md:text-[36px] font-black text-foreground-neutral font-sans-display stretch-display">
            Benefits
          </h2>
          <div className="grid md:grid-cols-2 gap-10">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4">
                <i
                  className={`fa-regular ${benefit.icon} text-3xl text-foreground-orm`}
                />
                <p
                  className="text-lg"
                  dangerouslySetInnerHTML={{ __html: benefit.text }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="py-12 px-4 relative scroll-m-24" id="open-positions">
        <div className="max-w-[1200px] w-full mx-auto flex flex-col md:flex-row gap-8 my-12">
          <OpenRoles />
        </div>
      </div>
    </main>
  );
}
