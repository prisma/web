import { createPageMetadata } from "@/lib/page-metadata";
import LogoParade from "@prisma-docs/ui/components/logo-parade";

import { Accordion, Accordions, Button } from "@prisma/eclipse";
import { CardSection } from "@/components/homepage/card-section/card-section";
import { Quote } from "@prisma-docs/ui/components/quote";
import { PartnersTable } from "@/components/partners/partners-table";
import { Form } from "@/components/partners/form";

const twoCol = [
  {
    content: (
      <div className="flex flex-col gap-4">
        <h3 className="text-foreground-neutral stretch-display text-3xl font-sans-display mt-0 mb-4">
          Provision & Manage Postgres
        </h3>
        <p className="text-foreground-neutral-weak! text-base">
          Spin up and manage Prisma Postgres databases on demand with our{" "}
          <b>database management API</b>. Integration is seamless, so databases
          feel like a natural extension of your product rather than a bolt-on
          service, giving your users a smooth, native experience.
        </p>
        <p className="text-foreground-neutral-weak! text-base">
          You can also let your AI agent take full control through our{" "}
          <b>MCP server</b>, automating database creation and management
          end-to-end. Choose the approach that works best for your product:
          provision directly into users’ existing{" "}
          <a href="https://console.prisma.io/" className="underline">
            Prisma accounts
          </a>{" "}
          for instant ownership, or manage the databases yourself until users
          are ready to claim them.
        </p>
        <div className="flex gap-4 items-center justify-start mx-auto md:ml-0">
          <a href="https://create-db.prisma.io/" className="link-btn orm">
            <span>Try demo</span>
            <i className="fa-regular fa-arrow-right ml-1" />
          </a>
          <a
            href="https://www.prisma.io/docs/postgres/introduction/management-api"
            className="link-btn orm"
          >
            <span>Management API Docs</span>
            <i className="fa-regular fa-arrow-right ml-1" />
          </a>
        </div>
      </div>
    ),
    imageUrl: "/illustrations/partners/partners_0",
    imageAlt: "Partners illustration",
    mobileImageUrl: "/illustrations/partners/partners_0",
    mobileImageAlt: "Partners illustration",
    logos: null,
    noShadow: true,
    useDefaultLogos: true,
    visualPosition: "right" as const,
    visualType: "image" as const,
  },
  {
    content: (
      <div className="flex flex-col gap-4">
        <h3 className="text-foreground-neutral stretch-display text-3xl font-sans-display mt-0 mb-4">
          A Built-in Data Explorer
        </h3>
        <p className="text-foreground-neutral-weak! text-base">
          Complete your database experience with{" "}
          <a href="/studio" className="underline">
            Prisma Studio
          </a>
          , an embeddable UI built for your provisioned Prisma Postgres
          databases. Explore tables and relationships, apply powerful filters
          with ease, and edit data directly in an intuitive interface.
        </p>
        <p className="text-foreground-neutral-weak! text-base">
          Studio blends seamlessly into your product’s design and workflow, with
          full white-label support and customization to match your platform’s
          design system. It delivers a native, cohesive experience for your
          users without extra development effort on your side.
        </p>
        <div className="flex gap-4 items-center justify-start mx-auto md:ml-0">
          <a
            href="https://www.prisma.io/docs/postgres/database/prisma-studio/embedding-studio"
            className="link-btn orm"
          >
            <span>Studio Embedding Docs</span>
            <i className="fa-regular fa-arrow-right ml-1" />
          </a>
          <a href="https://www.prisma.io/docs/guides/embed-studio-nextjs" className="link-btn orm">
            <span>Integration Guide</span>
            <i className="fa-regular fa-arrow-right ml-1" />
          </a>
        </div>
      </div>
    ),
    imageUrl: "/illustrations/partners/partners_1",
    imageAlt: "Partners illustration",
    mobileImageUrl: "/illustrations/partners/partners_1",
    mobileImageAlt: "Partners illustration",
    logos: null,
    noShadow: true,
    useDefaultLogos: true,
    visualPosition: "left" as const,
    visualType: "image" as const,
  },
  {
    content: (
      <div className="flex flex-col gap-4">
        <h3 className="text-foreground-neutral stretch-display text-3xl font-sans-display mt-0 mb-4">
          Instant App Deployment
        </h3>
        <p className="text-foreground-neutral-weak! text-base">
          Deploy full-stack applications in a single API call with{" "}
          <a href="https://vercel.com/" className="underline">
            Vercel
          </a>{" "}
          and Prisma! We’ve closely partnered with them to make app deployments
          as simple as adding a <b>deploy</b> button to your workflow. Every
          deployment is production-ready, with database connectivity
          preconfigured and automatic scaling across Vercel’s global edge
          network.
        </p>
        <p className="text-foreground-neutral-weak! text-base">
          Seamless user claiming allows entire deployments (database + app) to
          be transferred into users’ own Vercel and Prisma accounts. Perfect for
          spinning up complete development environments or handing off live
          apps.
        </p>
        <div className="flex gap-4 items-center justify-start mx-auto md:ml-0">
          <a
            href="https://app-deploy-demo.prisma.io/"
            className="link-btn orm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Try demo</span>
            <i className="fa-regular fa-arrow-right ml-1" />
          </a>
          <a
            href="https://pris.ly/claim-vercel-guide"
            className="link-btn orm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Integration Guide</span>
            <i className="fa-regular fa-arrow-right ml-1" />
          </a>
        </div>
      </div>
    ),
    imageUrl: "/illustrations/partners/partners_2",
    imageAlt: "Partners illustration",
    mobileImageUrl: "/illustrations/partners/partners_2",
    mobileImageAlt: "Partners illustration",
    logos: null,
    useDefaultLogos: true,
    noShadow: true,
    visualPosition: "right" as const,
    visualType: "image" as const,
  },
];

export const metadata = createPageMetadata({
  title: "Prisma Partners | Postgres provisioning and data infra for platforms",
  description:
    "Embed Prisma Postgres, white-label Prisma Studio, and provision data infrastructure faster with partner tooling built for modern platforms.",
  path: "/partners",
  ogImage: "/og/og-partners.png",
});

export default function Partners() {
  return (
    <main className="flex-1 w-full z-1 text-prety">
      <div className="hero pt-36 -mt-24 flex items-center justify-center px-4 relative flex-col gap-8">
        <div className="absolute inset-0 z-0 bg-[linear-gradient(180deg,var(--color-foreground-orm)_0%,var(--color-background-default)_100%)] opacity-20"></div>
        <div className="flex flex-col gap-4 z-1 relative">
          <h5 className="font-sans-display text-foreground-orm-strong uppercase stretch-display text-center mx-auto">
            Prisma Partners
          </h5>
          <h1 className="text-5xl md:text-6xl stretch-display mb-0 text-center mt-0 font-sans-display text-foreground-neutral max-w-224 mx-auto">
            Add mission critical infra to your platform in hours, not weeks.
          </h1>
        </div>
        <div className="content relative z-1 flex flex-col gap-8 pb-12">
          <p className="text-center text-foreground-neutral max-w-2xl mx-auto">
            Focus on shipping, we'll handle the infrastructure complexity. One
            API call provisions databases in under a second, plus embeddable
            data editing that feels native to your product. Oh, and app hosting
            too!
          </p>
        </div>
      </div>
      <div className="w-screen py-12!">
        <LogoParade />
      </div>
      <div className="w-screen px-4 ">
        <div className="my-12 flex flex-col gap-8">
          <h2 className="text-foreground-neutral stretch-display text-4xl font-black! font-sans-display my-0 mx-auto text-center">
            Everything you need from data to deployment
          </h2>
          <p className="text-center text-base text-foreground-neutral-weak max-w-2xl mx-auto -mb-20">
            From data to deployment, every piece of infra your users need built
            to work together or on its own. Optimized for your platform.
          </p>
          <CardSection cardSection={twoCol} />
        </div>
      </div>
      <div className="w-screen px-4">
        <div className="my-12 flex flex-col gap-8 max-w-200 mx-auto">
          <h2 className="text-foreground-neutral stretch-display text-4xl font-black! font-sans-display my-0 mx-auto">
            Built for modern platforms
          </h2>

          <Accordions type="single">
            <Accordion title="AI Code Generators">
              Database provisioning matches AI generation speed, keeping users
              engaged throughout app creation. Scale-to-zero economics handle
              experimental projects whether they get abandoned or go viral.
              Perfect for high-volume platforms.
            </Accordion>
            <Accordion title="No-code tools">
              Enable creating data-driven apps without exposing database
              complexity. Visual data browsing and editing integrate perfectly,
              making databases feel like core platform features.
            </Accordion>
            <Accordion title="Developer Tools & IDE">
              Instant databases for any development need with no setup or
              cleanup required. Reliable provisioning keeps developers in flow
              state instead of context-switching to database administration.
            </Accordion>
            <Accordion title="CI/CD & Testing">
              Every pipeline run needs isolated test databases. Fast
              provisioning and teardown keeps builds moving, complete isolation
              prevents test conflicts, and scale-to-zero economics make
              high-volume testing affordable.
            </Accordion>
            <Accordion title="Infrastructure Providers">
              Expand hosting services to include databases without building
              database infrastructure. Revenue sharing creates additional income
              streams while flexible ownership models integrate with existing
              platform flows.
            </Accordion>
          </Accordions>
        </div>
      </div>
      <div className="w-screen px-4">
        <div className="my-12 py-12 grid md:grid-cols-2 gap-8 max-w-[1200px] mx-auto">
          <Quote
            color="orm"
            author={{
              name: "Arnau",
              imageUrl: "/photos/people/arnau.avif",
              title: "Engineer",
              company: "Deno",
            }}
          >
            <p>
              The provisioning experience was smooth and fast. We want to ensure
              the development flow isn’t hindered by the platform. With
              per-branch databases, developers can safely test migrations and
              isolate changes when using Deno Deploy. Prisma made it easy to
              support that.
            </p>
          </Quote>
          <Quote
            className="h-fit my-auto"
            color="orm"
            author={{
              name: "Sam Goodwin",
              imageUrl: "/photos/people/sam-goodwin.avif",
              title: "Founder",
              company: "Alchemy",
            }}
          >
            <p>
              We were so blown away with the speed of their API, we thought our
              tests were broken. <br />
              <br /> {"<1s"} to create a database 🤯
            </p>
          </Quote>
        </div>
      </div>
      <div className="w-screen px-4">
        <div className="my-12 py-12 w-full gap-8 max-w-[1200px] mx-auto flex flex-col gap-8">
          <PartnersTable />
          <h6 className="text-center text-foreground-neutral-weaker text-xs">
            We're fully GDPR, HIPAA, ISO 27001 and SOC 2 compliant.{" "}
            <a href="https://trust.prisma.io/">Find more details here.</a>
            <br />
            App hosting partner plans with Vercel are separate, contact us to
            learn more.
          </h6>
        </div>
      </div>
      <div className="w-screen px-4">
        <div className="my-12 py-12 w-full gap-8 max-w-[1200px] mx-auto flex flex-col">
          <h2 className="text-foreground-neutral stretch-display text-4xl font-black! font-sans-display my-0 mx-auto text-center">
            Get in touch
          </h2>
          <p className="text-center text-base text-foreground-neutral-weak max-w-2xl mx-auto">
            Discuss your platform, pricing, and integration approach.
            <br />
            Our team works closely with you during integration.
          </p>
          <Form />
        </div>
      </div>
    </main>
  );
}
