import type { Metadata } from "next";
import { ArrowRight } from "@/components/icons/forma";
import { RoleKicker } from "@/components/brand/role-kicker";
import { Texture } from "@/components/brand/texture";
import { PrismButton } from "@/components/brand/prism-button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  alternates: { canonical: "/programs/partners" },
  title: "Partner network",
  description:
    "Join our partner network designed for affiliates, technology partners, and resellers.",
};

// Ported from the old site's /partners page. The Tally contact form is linked
// directly instead of embedded; illustrations reuse the old page's light set.
const CONTACT_URL = "https://tally.so/r/wMgZxp";

const CAPABILITIES = [
  {
    title: "Provision & manage Postgres",
    image: "/programs/partners_0_light.svg",
    paragraphs: [
      "Spin up and manage Prisma Postgres databases on demand with our Management API. Databases feel like a natural extension of your product rather than a separate service, giving your users a native experience.",
      "You can also let your AI agent take full control through our MCP server, automating database creation and management for instant ownership, or manage the databases yourself until users are ready to claim them.",
    ],
    links: [
      { label: "Try the demo", href: "https://create-db.prisma.io/" },
      { label: "Management API docs", href: "/docs/postgres/introduction/management-api" },
    ],
  },
  {
    title: "A built-in data explorer",
    image: "/programs/partners_1_light.svg",
    paragraphs: [
      "Complete your database experience with Prisma Studio, an embeddable UI built for your provisioned Prisma Postgres databases. Explore tables and relationships, filter records, and edit data directly in the interface.",
      "Prisma Studio fits into your product's design and workflow, with white-label support and customization to match your platform's design system, so it looks native to your users.",
    ],
    links: [
      {
        label: "Studio embedding docs",
        href: "/docs/postgres/database/prisma-studio/embedding-studio",
      },
      { label: "Integration guide", href: "/docs/guides/embed-studio-nextjs" },
    ],
  },
  {
    title: "Instant app deployment",
    image: "/programs/partners_2_light.svg",
    paragraphs: [
      "Deploy full-stack applications in a single API call with Vercel and Prisma. We've closely partnered with them to make app deployments as simple as adding a deploy button to your workflow. Every deployment is production-ready, with database connectivity preconfigured and automatic scaling across Vercel's global edge network.",
      "User claiming lets entire deployments (database and app) transfer into users' own Vercel and Prisma accounts, useful for spinning up complete development environments or handing off live apps.",
    ],
    links: [
      { label: "Try the demo", href: "https://app-deploy-demo.prisma.io/" },
      { label: "Integration guide", href: "https://pris.ly/claim-vercel-guide" },
    ],
  },
];

const PLATFORM_TYPES = [
  {
    title: "AI code generators",
    description:
      "Database provisioning matches AI generation speed, keeping users engaged throughout app creation. Scale-to-zero economics handle experimental projects whether they get abandoned or go viral.",
  },
  {
    title: "No-code tools",
    description:
      "Enable creating data-driven apps without exposing database complexity. Visual data browsing and editing integrate directly, making databases feel like core platform features.",
  },
  {
    title: "Developer tools & IDEs",
    description:
      "Instant databases for any development need with no setup or cleanup required. Provisioning keeps developers focused instead of context-switching to database administration.",
  },
  {
    title: "CI/CD & testing",
    description:
      "Every pipeline run needs isolated test databases. Fast provisioning and teardown keeps builds moving, complete isolation prevents test conflicts, and scale-to-zero economics make high-volume testing affordable.",
  },
  {
    title: "Infrastructure providers",
    description:
      "Expand hosting services to include databases without building database infrastructure. Revenue sharing creates additional income streams while flexible ownership models integrate with existing platform flows.",
  },
];

const QUOTES = [
  {
    quote:
      "The provisioning experience was smooth and fast. With per-branch databases, developers can safely test migrations and isolate changes when using Deno Deploy. Prisma made it easy to support that.",
    author: "Arnau",
    role: "Engineer, Deno",
  },
  {
    quote:
      "We were so blown away with the speed of their API, we thought our tests were broken. <1s to create a database.",
    author: "Sam Goodwin",
    role: "Founder, Alchemy",
  },
];

export default function PartnersProgramPage() {
  return (
    <>
      <section className="bg-white px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
          <Texture opacity={0.06} blend="multiply" />
          <div className="relative px-4 sm:px-8">
            <div className="mx-auto flex max-w-site flex-col items-center pb-14 pt-32 text-center md:pb-16 md:pt-44">
              <RoleKicker color="bg-prism-yellow-300" className="justify-center">
                Prisma Partners
              </RoleKicker>
              <h1 className="isolate mt-4 max-w-[24ch] text-balance text-[clamp(2.25rem,3.5vw,3.25rem)] leading-[1.08]">
                Add mission-critical infra to your platform in hours, not weeks
              </h1>
              <p className="mt-6 max-w-[54ch] text-pretty text-lg leading-relaxed text-muted-foreground">
                Focus on shipping while we handle the infrastructure. One API call provisions
                databases in under a second, plus embeddable data editing that feels native to your
                product, plus app hosting.
              </p>
              <div className="mt-8">
                <PrismButton href={CONTACT_URL}>Get in touch</PrismButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-site">
          <h2 className="mx-auto max-w-[28ch] text-balance text-center text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
            Everything you need from data to deployment
          </h2>
          <p className="mx-auto mt-4 max-w-[56ch] text-center text-[0.9375rem] leading-relaxed text-muted-foreground">
            Every piece of infrastructure your users need, built to work together or on its own, and
            optimized for your platform.
          </p>

          <div className="mt-14 flex flex-col gap-16 md:gap-20">
            {CAPABILITIES.map((capability, i) => (
              <div
                key={capability.title}
                className="grid items-center gap-8 md:grid-cols-2 md:gap-14"
              >
                <div className={cn(i % 2 === 1 && "md:order-2")}>
                  <h3 className="text-[clamp(1.375rem,2vw,1.75rem)] leading-[1.15]">
                    {capability.title}
                  </h3>
                  {capability.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 24)}
                      className="mt-4 text-[0.9375rem] leading-relaxed text-muted-foreground"
                    >
                      {paragraph}
                    </p>
                  ))}
                  <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
                    {capability.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        className="group flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-prism-cyan-700"
                      >
                        {link.label}
                        <ArrowRight
                          className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                          aria-hidden
                        />
                      </a>
                    ))}
                  </div>
                </div>
                <div
                  className={cn(
                    "relative overflow-hidden rounded-2xl border border-black/[0.06] bg-card-wash",
                    i % 2 === 1 && "md:order-1",
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={capability.image}
                    alt=""
                    loading="lazy"
                    className="w-full"
                    draggable={false}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 pb-20 sm:px-8 sm:pb-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="mx-auto max-w-[24ch] text-balance text-center text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
            Built for modern platforms
          </h2>
          <div className="mt-10 flex flex-col">
            {PLATFORM_TYPES.map((type) => (
              <div
                key={type.title}
                className="grid gap-2 border-b border-black/[0.06] py-6 last:border-b-0 sm:grid-cols-[14rem_1fr] sm:gap-8"
              >
                <h3 className="text-base font-semibold leading-snug">{type.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 pb-24 sm:px-8 sm:pb-32">
        <div className="mx-auto max-w-site">
          <div className="grid gap-5 md:grid-cols-2">
            {QUOTES.map((q) => (
              <figure
                key={q.author}
                className="flex flex-col gap-4 rounded-2xl bg-card-wash p-7 sm:p-9"
              >
                <blockquote className="text-pretty text-base font-medium leading-relaxed text-foreground sm:text-lg">
                  &ldquo;{q.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-auto">
                  <p className="text-sm font-semibold text-foreground">{q.author}</p>
                  <p className="text-sm text-muted-foreground">{q.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-14 flex flex-col items-center gap-5 rounded-2xl border border-black/[0.06] p-8 text-center sm:p-12">
            <h2 className="text-[clamp(1.5rem,2.25vw,2rem)] leading-[1.15]">Get in touch</h2>
            <p className="max-w-[48ch] text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
              Discuss your platform, pricing, and integration approach. Our team works closely with
              you during integration.
            </p>
            <PrismButton href={CONTACT_URL}>Contact the partner team</PrismButton>
            <p className="text-xs text-muted-foreground">
              We&apos;re fully GDPR, HIPAA, ISO 27001 and SOC 2 compliant.{" "}
              <a href="https://trust.prisma.io/" className="underline">
                Find more details here.
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
