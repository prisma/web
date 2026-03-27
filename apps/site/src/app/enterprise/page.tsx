import { EnterpriseForm } from "@/components/enterprise/form";

import Script from "next/script";
import { FooterAccordion } from "@/components/enterprise/footer-accordion";

import { SwitchEnterprise } from "@/components/enterprise/switch-enterprise";
import LogoParade from "@/components/logo-parade";
import type { Metadata } from "next";
import {
  SITE_HOME_DESCRIPTION,
  SITE_HOME_TITLE,
} from "../../lib/blog-metadata";
import { Button, Card, Action } from "@prisma/eclipse";
import { CopyCode } from "@/components/homepage/copy-btn";
import React from "react";
import { Bento } from "@/components/homepage/bento";
import { CardSection } from "@/components/homepage/card-section/card-section";
import review from "../../data/homepage.json";
import Testimonials from "../../components/homepage/testimonials";
import { cn } from "@/lib/cn";
import { Technology } from "@/components/technology";
import { Animation } from "@/components/animation";
import { Fit } from "@rive-app/react-webgl2";

const first = [
  {
    content: (
      <>
        <h2 className="text-foreground-neutral stretch-display text-4xl font-black! font-sans-display mt-0 mb-4">
          Boost your <br />
          application’s lifecycle
        </h2>
        <p className="text-foreground-neutral-weak! text-base my-4">
          By integrating Prisma into your development ecosystem, you leverage
          its capabilities to Build robust, adaptable applications with less
          code and fewer errors and also Fortify your database interactions for
          peak performance right from the start.
        </p>
        <p className="text-foreground-neutral-weak! text-base my-4">
          As your application Grows, our platform products Accelerate and Prisma
          Postgres ensure that your data layer can adapt and scale, supporting
          increased traffic and requirements without sacrificing performance or
          security.
        </p>
      </>
    ),
    imageUrl: null,
    imageAlt: null,
    mobileImageUrl: null,
    mobileImageAlt: null,
    logos: null,
    other: (
      <Animation
        name="enterprise/build_fortify_grow"
        fit={Fit.FitHeight}
        className={cn(
          "h-94",
          "[&>canvas]:max-w-full",
          "[&>canvas]:h-auto!",
          "[&>div]:flex",
          "[&>div]:items-center",
          "[&>div]:justify-center",
        )}
      />
    ),
    useDefaultLogos: true,
    visualPosition: "left" as const,
    visualType: "other" as const,
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

const complexities = [
  {
    title: "Improved developer experience",
    image: "/illustrations/enterprise/enterprise_0",
    subtitle:
      "Prisma ORM enhances code clarity and modularity. New team members can onboard quickly, thanks to the high level of abstraction and the intuitive query syntax.",
    icon: "fa-regular fa-cubes-stacked",
  },
  {
    title: "Increased productivity",
    image: "/illustrations/enterprise/enterprise_1",
    subtitle:
      "The Prisma ORM Client API comes with an intuitive querying interface and editor auto-completion, allowing developers to focus on business logic instead of database syntax.",
    icon: "fa-regular fa-code",
  },
  {
    title: "Bring your own database",
    subtitle:
      "Prisma ORM’s extensive compatibility enables teams to work with different databases and switch without significant changes to the application logic.",
    icon: "fa-regular fa-database",
  },
];

const enterprises = [
  {
    title: "Enterprise-level support",
    description:
      "Obtain the level of dedicated support from a team that understands and caters to the complexities and demands of large-scale enterprise operations.",
    icon: "fa-regular fa-headset", // or "fa-light fa-headset"
  },
  {
    title: "Risk and compliance",
    description:
      "Obtain the level of dedicated support from a team that understands and caters to the complexities and demands of large-scale enterprise operations.",
    icon: "fa-regular fa-file-contract", // or "fa-light fa-file-contract"
  },
  {
    title: "Custom solutions",
    description:
      "Obtain the level of dedicated support from a team that understands and caters to the complexities and demands of large-scale enterprise operations.",
    icon: "fa-regular fa-wrench", // or "fa-light fa-wrench"
  },
  {
    title: "Priority resolution",
    description:
      "Obtain the level of dedicated support from a team that understands and caters to the complexities and demands of large-scale enterprise operations.",
    icon: "fa-regular fa-check-to-slot", // or "fa-light fa-circle-check"
  },
  {
    title: "Advanced security",
    description:
      "Obtain the level of dedicated support from a team that understands and caters to the complexities and demands of large-scale enterprise operations.",
    icon: "fa-regular fa-shield-exclamation", // or "fa-light fa-shield-exclamation"
  },
  {
    title: "Performance optimization",
    description:
      "Obtain the level of dedicated support from a team that understands and caters to the complexities and demands of large-scale enterprise operations.",
    icon: "fa-regular fa-chart-line-up", // or "fa-light fa-chart-line-up"
  },
  {
    title: "Expert scalability consultation",
    description:
      "Obtain the level of dedicated support from a team that understands and caters to the complexities and demands of large-scale enterprise operations.",
    icon: "fa-regular fa-up-right-and-down-left-from-center", // or "fa-light fa-arrow-trend-up"
  },
  {
    title: "Comprehensive team training",
    description:
      "Obtain the level of dedicated support from a team that understands and caters to the complexities and demands of large-scale enterprise operations.",
    icon: "fa-regular fa-screen-users", // or "fa-light fa-people-group"
  },
  {
    title: "Influential feedback loop",
    description:
      "Obtain the level of dedicated support from a team that understands and caters to the complexities and demands of large-scale enterprise operations.",
    icon: "fa-regular fa-repeat", // or "fa-light fa-repeat"
  },
];
const solution_providers = [
  {
    title: "Direct access to product experts",
    description:
      "Engage with the brains behind the Prisma ORM for in-depth problem-solving and specialized insights.",
    icon: "fa-regular fa-person-chalkboard", // or "fa-light fa-person-chalkboard"
  },
  {
    title: "Swift problem resolution",
    description:
      "Benefit from quick and effective support responses that are crucial in maintaining the pace of your project timelines.",
    icon: "fa-regular fa-gauge-simple-max", // or "fa-light fa-badge-check"
  },
  {
    title: "Bespoke customization guidance",
    description:
      "Receive personalized advice on tailoring the Prisma ORM to the specific requirements of your unique projects.",
    icon: "fa-regular fa-comments-question-check", // or "fa-light fa-comments-question"
  },
  {
    title: "Advanced updates",
    description:
      "Stay ahead in the game with the latest updates and best practices.",
    icon: "fa-regular fa-file-arrow-up", // or "fa-light fa-file-import"
  },
  {
    title: "Expedited and priority support",
    description:
      "Benefit from prioritized attention to your inquiries and problems.",
    icon: "fa-regular fa-phone-volume", // or "fa-light fa-phone-arrow-up-right"
  },
  {
    title: "Specialized training for your team",
    description:
      "Empower your team with advanced training sessions, enabling them to leverage the full capabilities of our ORM.",
    icon: "fa-regular fa-screen-users", // or "fa-light fa-people-group"
  },
  {
    title: "Optimization for peak performance",
    description: "Ensure your software solutions run smoothly and efficiently.",
    icon: "fa-regular fa-arrow-up-right-dots", // or "fa-light fa-chart-mixed"
  },
  {
    title: "Proactive risk management",
    description:
      "Help you to anticipate and mitigate risks, ensuring a seamless development process and uninterrupted service to your clients.",
    icon: "fa-regular fa-triangle-exclamation", // or "fa-light fa-triangle-exclamation"
  },
];

export const metadata: Metadata = {
  title: SITE_HOME_TITLE,
  description: SITE_HOME_DESCRIPTION,
};

export default function SiteHome() {
  return (
    <main className="flex-1 w-full z-1 bg-background-default">
      <div className="hero -mt-24 flex items-end justify-center px-4 relative">
        <div className="absolute inset-0 z-0 bg-[linear-gradient(180deg,var(--color-foreground-orm)_0%,var(--color-background-default)_100%)] opacity-20" />
        <div className="content pt-31 relative z-2 my-12 flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <h5 className="text-foreground-orm-strong text-center stretch-display font-sans-display text-base uppercase">
              Enterprise & Solution Providers
            </h5>
            <h1 className="text-6xl [font-variation-settings:'wght'_900,'wdth'_125] mb-0 text-center mt-0 font-sans-display text-foreground-neutral max-w-200 mx-auto">
              Streamline your
              <br /> development workflow
            </h1>
          </div>
          <p className="text-center text-foreground-neutral max-w-2xl mx-auto">
            Prisma acts as your comprehensive enterprise data toolset,
            simplifying database interactions and reducing complexity so
            developers can focus on business logic.
          </p>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <Button
              variant="orm"
              href="https://console.prisma.io/sign-up?utm_source=website&utm_medium=index&utm_campaign=cta"
              size="3xl"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans-display! font-[650]"
            >
              <span>Get in touch</span>
              <i className="fa-regular fa-envelope ml-2" />
            </Button>
          </div>
        </div>
      </div>
      <div className="my-12 px-4">
        <h5 className=" text-center text-foreground-orm-strong stretch-display text-base font-sans-display uppercase">
          Trusted by teams at
        </h5>
        <LogoParade />
      </div>
      <div className="my-12 px-4">
        <CardSection cardSection={first} />
      </div>
      <div className="my-12 px-4">
        <div className="py-12 relative gap-8 flex flex-col">
          <h3 className="text-center text-foreground-neutral stretch-display text-3xl stretch-display font-sans-display my-0">
            Leave the database complexities to us
          </h3>
          <p className="text-center text-foreground-neutral max-w-xl mx-auto">
            Focus on core competencies of your team, rather than building and
            managing complex infrastructure components.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-230 mx-auto w-full">
          {complexities.map((card: any, index: number) => {
            const last = index === complexities.length - 1;
            return (
              <Card
                key={card.title}
                className={cn(
                  "bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-orm)_262.5%)] relative",
                  last && "md:col-span-2",
                  !last && "pb-25",
                )}
              >
                <div className={cn(last && "grid md:grid-cols-2 gap-6")}>
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4 items-center">
                      <Action color="orm" size="4xl">
                        <i className={card.icon} />
                      </Action>
                      <h3 className="text-foreground-neutral font-sans-display text-xl stretch-display mt-0 mb-1 font-bold">
                        {card.title}
                      </h3>
                    </div>
                    <p className="text-foreground-neutral dark:text-foreground-neutral-weak text-sm font-normal m-0">
                      {card.subtitle}
                    </p>
                    {!last && (
                      <div className="bottom-0 left-0 right-0 px-4 after:content-[''] after:absolute after:inset-0 after:bg-[linear-gradient(0deg,var(--color-background-default)_0%,transparent_62.5%)] after:top-0 absolute after:rounded-square">
                        <img
                          src={`${card.image}.svg`}
                          alt="Enterprise"
                          className="hidden dark:block mx-auto"
                        />
                        <img
                          src={`${card.image}_light.svg`}
                          className="block dark:hidden mx-auto"
                          alt="Enterprise"
                        />
                      </div>
                    )}
                  </div>
                  {last && (
                    <div className="flex gap-2 flex-col">
                      <h5 className="text-xl font-sans-display stretch-display font-bold w-fit text-foreground-neutral">
                        {databases.title}
                      </h5>
                      <div className="flex gap-1 flex-wrap">
                        {databases.list.map((db) => (
                          <Technology
                            text={db.name}
                            url={db.url}
                            key={db.name}
                            className="bg-transparent! [&>div]:bg-transparent! hover:bg-background-default!"
                          >
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
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
      <div className="my-12 px-4">
        <div className="py-12 gap-8 flex flex-col max-w-[1200px] mx-auto">
          <h2 className="text-foreground-neutral stretch-display text-left text-4xl font-black! font-sans-display ">
            Code quality and safety
          </h2>
          <section className="w-full overflow-visible">
            <div
              className={cn(
                "[&_h2]:mt-0 flex gap-8 lg:gap-12 md:gap-8 sm:gap-6 items-center overflow-visible lg:flex-row-reverse flex-col",
              )}
            >
              <div
                className={cn(
                  "flex-1 min-w-0 overflow-visible text-center lg:text-left lg:w-full lg:ml-12",
                )}
              >
                <FooterAccordion />
              </div>
              <div
                className={cn(
                  "flex-1 min-w-0 overflow-visible w-full lg:max-w-unset max-w-137 lg:w-full",
                )}
              >
                <img
                  className="sm:relative w-full h-auto hidden dark:block object-contain w-full"
                  src="/illustrations/enterprise/enterprise_2.svg"
                  alt="Code quality and safety"
                />
                <img
                  className="sm:relative block w-full h-auto dark:hidden object-contain w-full"
                  src="/illustrations/enterprise/enterprise_2_light.svg"
                  alt="Code quality and safety"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
      <div className="my-12 px-4">
        <div className="py-12 gap-8 flex flex-col max-w-[968px] mx-auto">
          <h2 className="text-foreground-neutral stretch-display text-center text-4xl font-black! font-sans-display my-0">
            Dedicated ORM support options
          </h2>
          <p className="text-center text-foreground-neutral max-w-xl mx-auto">
            Focus on core competencies of your team, rather than building and
            managing complex infrastructure components.
          </p>
          <SwitchEnterprise
            content={[enterprises, solution_providers]}
            tabs={[
              { id: "enterprise", value: "Enterprise" },
              { id: "agencies", value: "Agencies" },
            ]}
          />
        </div>
      </div>
      <div className="my-12 px-4">
        <div className="py-12 gap-8 flex flex-col max-w-221 mx-auto">
          <h2 className="text-foreground-neutral stretch-display text-center text-4xl font-black! font-sans-display my-0">
            Connect with us
          </h2>
          <p className="text-center text-foreground-neutral max-w-192 mx-auto">
            To explore how our support solutions can revolutionize your agency
            or enterprise's approach to developing with Prisma ORM.
          </p>
          <EnterpriseForm />
        </div>
      </div>
    </main>
  );
}
