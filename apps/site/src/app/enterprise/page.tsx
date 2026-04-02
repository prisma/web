import { EnterpriseForm } from "@/components/enterprise/form";
import { CarouselItem } from "@/components/enterprise/carousel-item";
import Image from "next/image";
import { FooterAccordion } from "@/components/enterprise/footer-accordion";
import { SwitchEnterprise } from "@/components/enterprise/switch-enterprise";
import LogoParade from "@/components/logo-parade";
import type { Metadata } from "next";
import { Button, Card, Action } from "@prisma/eclipse";
import { CardSection } from "@/components/homepage/card-section/card-section";
import { cn } from "@/lib/cn";
import { ScrollCarousel } from "@/components/scroll-carousel";
import { Technology } from "@/components/technology";

interface DatabaseItem {
  name: string;
  icon: string;
  url?: string;
}

interface ComplexityCard {
  title: string;
  subtitle: string;
  icon: string;
  image?: string;
}

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
      <>
        <Image
          src="/illustrations/enterprise/bgf.svg"
          alt="Build Fortify Grow"
          width={100}
          height={100}
          className="w-94 h-94 object-contain mx-auto hidden dark:block"
        />
        <Image
          src="/illustrations/enterprise/bgf-light.svg"
          alt="Build Fortify Grow"
          width={100}
          height={100}
          className="w-94 h-94 object-contain mx-auto dark:hidden"
        />
      </>
    ),
    useDefaultLogos: true,
    visualPosition: "left" as const,
    visualType: "other" as const,
  },
];

const databases: { title: string; list: DatabaseItem[] } = {
  title: "Supported Databases",
  list: [
    {
      name: "PostgreSQL",
      icon: "/icons/companies/postgres.svg",
    },
    {
      name: "MySQL",
      icon: "/icons/technologies/mysqlsimple.svg",
    },
    {
      name: "MariaDB",
      icon: "/icons/technologies/mariadb.svg",
    },
    {
      name: "SQLite",
      icon: "/icons/companies/sqlite.svg",
    },
    {
      name: "SQL Server",
      icon: "/icons/companies/sqlserver.svg",
    },
    {
      name: "CockroachDB",
      icon: "/icons/companies/cockroachdb.svg",
    },
    {
      name: "PlanetScale",
      icon: "/icons/companies/planetscale.svg",
    },
    {
      name: "MongoDB",
      icon: "/icons/technologies/mongodbsimple.svg",
    },
  ],
};

const complexities: ComplexityCard[] = [
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
      "Work directly with Prisma specialists who understand enterprise architectures, delivery timelines, and production constraints.",
    icon: "fa-regular fa-headset", // or "fa-light fa-headset"
  },
  {
    title: "Risk and compliance",
    description:
      "Navigate security reviews, procurement, and compliance requirements with clearer guidance and supporting documentation.",
    icon: "fa-regular fa-file-contract", // or "fa-light fa-file-contract"
  },
  {
    title: "Custom solutions",
    description:
      "Shape an engagement that fits your stack, internal processes, and the needs of your organization.",
    icon: "fa-regular fa-wrench", // or "fa-light fa-wrench"
  },
  {
    title: "Priority resolution",
    description:
      "Escalate urgent issues faster to reduce downtime, unblock teams, and keep releases on schedule.",
    icon: "fa-regular fa-check-to-slot", // or "fa-light fa-circle-check"
  },
  {
    title: "Advanced security",
    description:
      "Adopt secure defaults and harden database access patterns for sensitive workloads and regulated environments.",
    icon: "fa-regular fa-shield-exclamation", // or "fa-light fa-shield-exclamation"
  },
  {
    title: "Performance optimization",
    description:
      "Tune query patterns, schema design, and workflows for predictable performance under real production load.",
    icon: "fa-regular fa-chart-line-up", // or "fa-light fa-chart-line-up"
  },
  {
    title: "Expert scalability consultation",
    description:
      "Plan for growth with guidance on scaling data access, team workflows, and application architecture.",
    icon: "fa-regular fa-up-right-and-down-left-from-center", // or "fa-light fa-arrow-trend-up"
  },
  {
    title: "Comprehensive team training",
    description:
      "Upskill developers with hands-on enablement tailored to your codebase, workflows, and Prisma adoption goals.",
    icon: "fa-regular fa-screen-users", // or "fa-light fa-people-group"
  },
  {
    title: "Influential feedback loop",
    description:
      "Share direct product feedback with the Prisma team and help shape the roadmap around enterprise needs.",
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
const scal_port = [
  {
    title: "Support for multiple databases",
    description:
      "Prisma ORM's compatibility enables teams to work with different databases without significant changes to the application logic. Developers can easily switch between different projects, and applications can be easily adapted to future requirements without extensive rework.",
    icon: "fa-regular fa-layer-plus", // or "fa-light fa-layer-group"
  },
  {
    title: "Community and ecosystem",
    description:
      "The vibrant Prisma community and ecosystem offer extensive resources, including documentation, tutorials, and support forums. This knowledge pool aids in resolving issues swiftly and exchanging best practices.",
    icon: "fa-regular fa-hands-holding-circle", // or "fa-light fa-people-group"
  },
  {
    title: "Scalability at its core",
    description:
      "Designed with scalability in mind, Prisma products support efficient data fetching and manipulation patterns that are essential for high-load applications, ensuring that the database layer does not become a bottleneck as the application grows.",
    icon: "fa-regular fa-up-right-and-down-left-from-center", // or "fa-light fa-chart-network"
  },
  {
    title: "Code maintainability",
    description:
      "The reduction in handwritten SQL leads to cleaner, more maintainable codebases. Developers can focus on the business logic rather than the intricacies of SQL syntax, making it easier to update and refactor code.",
    icon: "fa-regular fa-gear-complex-code", // or "fa-light fa-code"
  },
];

const abstraction_ease_of_use = [
  {
    title: "Abstraction and ease of use",
    description:
      "Prisma ORM allows developers to work with high-level objects and methods instead of raw SQL queries. This accelerates development and minimizes errors associated with directly handling SQL. Retrieving user data can be as straightforward as <code>prisma.user.findMany()</code> instead of constructing a complex SQL query.",
    icon: "fa-regular fa-shapes",
  },
  {
    title: "Database schema migration",
    description:
      "Prisma Migrate facilitates easy version control for database schemas, streamlining the deployment and rollback of changes. This is crucial for maintaining consistency across environments. The schema evolution necessary for application development becomes safe and hassle-free, yet customizable to provide flexibility.",
    icon: "fa-regular fa-arrow-up-triangle-square",
  },
  {
    title: "Reduced training needs",
    description:
      "By standardizing database interactions, Prisma ORM reduces the need for in-depth database-specific training. New team members can contribute quickly, focusing on learning your data model rather than the nuances of SQL.",
    icon: "fa-regular fa-head-side-gear",
  },
  {
    title: "Transferability of responsibilities",
    description:
      "The uniform interface provided by Prisma ORM simplifies the transfer of responsibilities within the team. Developers can easily understand and work on different parts of the application, enhancing team flexibility and resilience.",
    icon: "fa-regular fa-person-walking-dashed-line-arrow-right",
  },
  {
    title: "Improved productivity",
    description:
      "The Prisma ORM Client API boosts developer productivity by providing a querying interface that is intuitive and comes with features like editor auto-completion. This reduces the cognitive load on developers, allowing them to focus on business logic rather than database syntax intricacies.",
    icon: "fa-regular fa-arrow-up-right-dots",
  },
  {
    title: "Cross-functional team collaboration",
    description:
      "Prisma ORM's schema-centric approach enhances collaboration between developers and database administrators (DBAs) by providing a clear, version-controlled schema definition. This shared understanding facilitates smoother communication and decision-making.",
    icon: "fa-regular fa-screen-users",
  },
  {
    title: "Improved developer experience",
    description:
      "Prisma ORM contributes to a more modular and understandable codebase, significantly enhancing developer experience. The modularity facilitates easier testing and debugging, as developers can focus on smaller, more isolated parts of the application logic.",
    icon: "fa-regular fa-cubes-stacked",
  },
];

const ENTERPRISE_TITLE =
  "Streamline your enterprise development workflow with Prisma";
const ENTERPRISE_DESCRIPTION =
  "Learn how Prisma ORM can improve your team's productivity and explore our tailored ORM support solutions for enterprises and solution providers.";

export const metadata: Metadata = {
  title: ENTERPRISE_TITLE,
  description: ENTERPRISE_DESCRIPTION,
  alternates: {
    canonical: "https://www.prisma.io/enterprise",
  },
  openGraph: {
    title: ENTERPRISE_TITLE,
    description: ENTERPRISE_DESCRIPTION,
    url: "https://www.prisma.io/enterprise",
    images: [
      {
        url: "/og/og-enterprise.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: ENTERPRISE_TITLE,
    description: ENTERPRISE_DESCRIPTION,
    images: ["/og/og-enterprise.png"],
  },
};

export default function EnterprisePage() {
  return (
    <main className="flex-1 w-full z-1 bg-background-default">
      {/* Hero */}
      <section className="hero -mt-24 flex items-end justify-center px-4 relative">
        <div className="absolute inset-0 z-0 bg-[linear-gradient(180deg,var(--color-foreground-orm)_0%,var(--color-background-default)_100%)] opacity-20" />
        <div className="content pt-31 relative z-2 my-12 flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <h5 className="text-foreground-orm-strong text-center stretch-display font-sans-display text-base uppercase">
              Enterprise & Solution Providers
            </h5>
            <h1 className="text-[clamp(2.5rem,9vw,3.75rem)] md:text-6xl [font-variation-settings:'wght'_900,'wdth'_125] mb-0 text-center mt-0 font-sans-display text-foreground-neutral max-w-200 mx-auto">
              Streamline your <br /> development workflow
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
      </section>

      {/* Trusted by teams at */}
      <section className="my-12 px-4">
        <h5 className=" text-center text-foreground-orm-strong stretch-display text-base font-sans-display uppercase">
          Trusted by teams at
        </h5>
        <LogoParade />
      </section>

      {/* Boost your application’s lifecycle */}
      <section className="my-12 px-4">
        <CardSection cardSection={first} key="first" />
      </section>

      {/* Leave the database complexities to us */}
      <section className="my-12 px-4">
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
          {complexities.map((card, index) => {
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
                    <p className="text-foreground-neutral-weak text-sm font-normal m-0">
                      {card.subtitle}
                    </p>
                    {!last && (
                      <div className="bottom-0 left-0 right-0 px-4 after:content-[''] after:absolute after:inset-0 after:bg-[linear-gradient(0deg,var(--color-background-default)_0%,transparent_62.5%)] after:top-0 absolute after:rounded-square">
                        <Image
                          src={`${card.image}.svg`}
                          alt="Enterprise"
                          width={1200}
                          height={900}
                          className="hidden dark:block mx-auto"
                        />
                        <Image
                          src={`${card.image}_light.svg`}
                          alt="Enterprise"
                          width={1200}
                          height={900}
                          className="block dark:hidden mx-auto"
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
                        {databases.list.map((db, idx) => (
                          <Technology
                            key={db.name}
                            text={db.name}
                            url={db.url}
                            className="bg-transparent! [&>div]:bg-transparent! hover:bg-background-default!"
                          >
                            <Action
                              color="neutral"
                              size="4xl"
                              className="h-[75px]! w-[75px]! hover:bg-background-neutral-strong"
                            >
                              <Image
                                src={db.icon}
                                alt={db.name}
                                width={40}
                                height={40}
                                className="h-auto w-auto"
                              />
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
      </section>

      {/* Developer experience */}
      <section className="my-12 px-4">
        <div className="py-12 gap-8 flex flex-col max-w-[1200px] mx-auto">
          <h2 className="text-foreground-neutral stretch-display text-left text-4xl font-black! font-sans-display ">
            Developer experience
          </h2>
          <ScrollCarousel
            ariaLabel="Enterprise carousel"
            gridClassName="auto-cols-[100%] sm:auto-cols-[calc((100%-2rem)/3)]"
          >
            {abstraction_ease_of_use.map((item) => (
              <CarouselItem
                key={item.title}
                card={item}
                className="min-h-full"
              />
            ))}
          </ScrollCarousel>
        </div>
      </section>
      {/* Code quality and safety */}
      <section className="my-12 px-4">
        <div className="py-12 gap-8 flex flex-col max-w-[1200px] mx-auto">
          <h2 className="text-foreground-neutral stretch-display text-left text-4xl font-black! font-sans-display ">
            Code quality and safety
          </h2>
          <div className="w-full overflow-visible">
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
                <Image
                  className="sm:relative w-full h-auto hidden dark:block object-contain"
                  src="/illustrations/enterprise/enterprise_2.svg"
                  alt="Code quality and safety"
                  width={1200}
                  height={900}
                />
                <Image
                  className="sm:relative block w-full h-auto dark:hidden object-contain"
                  src="/illustrations/enterprise/enterprise_2_light.svg"
                  alt="Code quality and safety"
                  width={1200}
                  height={900}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scalability and portability */}
      <section className="my-12 px-4">
        <div className="py-12 gap-8 flex flex-col max-w-[1200px] mx-auto">
          <h2 className="text-foreground-neutral stretch-display text-left text-4xl font-black! font-sans-display">
            Scalability and portability
          </h2>
          <ScrollCarousel
            ariaLabel="Enterprise carousel"
            gridClassName="auto-cols-[100%] sm:auto-cols-[calc((100%-2rem)/3)]"
          >
            {scal_port.map((item) => (
              <CarouselItem
                key={item.title}
                card={item}
                className="min-h-full"
              />
            ))}
          </ScrollCarousel>
        </div>
      </section>

      {/* Dedicated ORM support options */}
      <section className="my-12 px-4">
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
      </section>

      {/* Connect with us */}
      <section className="my-12 px-4">
        <div className="py-12 gap-8 flex flex-col max-w-221 mx-auto">
          <h2 className="text-foreground-neutral stretch-display text-center text-4xl font-black! font-sans-display my-0">
            Connect with us
          </h2>
          <p className="text-center text-foreground-neutral max-w-3xl mx-auto">
            To explore how our support solutions can revolutionize your agency
            or enterprise's approach to developing with Prisma ORM.
          </p>
          <EnterpriseForm />
        </div>
      </section>
    </main>
  );
}
