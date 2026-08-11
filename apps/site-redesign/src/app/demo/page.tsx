import type { Metadata } from "next";
import { ArrowRight } from "@/components/icons/forma";
import { RoleKicker } from "@/components/brand/role-kicker";
import { Texture } from "@/components/brand/texture";
import { PrismButton, PrismButtonOutline } from "@/components/brand/prism-button";

export const metadata: Metadata = {
  title: "See Prisma in action",
  description:
    "Try Prisma's live demos: provision a Postgres database in under a second, deploy a full-stack app in one call, or book a walkthrough with the team.",
};

// Replaces CF's placeholder demo-request form (which didn't submit anywhere)
// with Prisma's real live demos plus a walkthrough CTA.
const DEMOS = [
  {
    title: "Provision a database in under a second",
    description:
      "create-db provisions a real Prisma Postgres database instantly: no signup, no config. See the fastest path from nothing to a connection string.",
    href: "https://create-db.prisma.io/",
    cta: "Try create-db",
    accent: "bg-prism-cyan-400",
  },
  {
    title: "Deploy a full-stack app in one call",
    description:
      "Watch a complete application (app and database) deploy in a single API call, production-ready with connectivity preconfigured.",
    href: "https://app-deploy-demo.prisma.io/",
    cta: "Try the deploy demo",
    accent: "bg-prism-yellow-300",
  },
  {
    title: "Explore the Console",
    description:
      "The Prisma Console is where your databases, deployments, and usage live. The free tier has no time limit. The demo is just using it.",
    href: "https://console.prisma.io",
    cta: "Open the Console",
    accent: "bg-prism-red-400",
  },
];

export default function DemoPage() {
  return (
    <>
      <section className="bg-white px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
          <Texture opacity={0.06} blend="multiply" />
          <div className="relative px-4 sm:px-8">
            <div className="mx-auto flex max-w-site flex-col items-center pb-14 pt-32 text-center md:pb-16 md:pt-44">
              <RoleKicker color="bg-prism-cyan-400" className="justify-center">
                Demo
              </RoleKicker>
              <h1 className="isolate mt-4 max-w-[20ch] text-balance text-[clamp(2.5rem,4vw,3.5rem)] leading-[1.06]">
                See Prisma in action
              </h1>
              <p className="mt-6 max-w-[50ch] text-pretty text-lg leading-relaxed text-muted-foreground">
                The fastest way to evaluate Prisma is to use it. These live demos run against
                real infrastructure.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <PrismButton href="https://create-db.prisma.io/">
                  Create a database now
                </PrismButton>
                <PrismButtonOutline href="https://tally.so/r/3jQDNR">
                  Book a walkthrough
                </PrismButtonOutline>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 pb-24 pt-14 sm:px-8 sm:pb-32">
        <div className="mx-auto max-w-site">
          <div className="grid gap-5 md:grid-cols-3">
            {DEMOS.map((demo) => (
              <a
                key={demo.title}
                href={demo.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-7 shadow-[0_1px_2px_rgba(21,21,21,0.04)] transition-[border-color,box-shadow,translate] duration-300 hover:-translate-y-0.5 hover:border-black/[0.12] hover:shadow-[0_10px_30px_rgba(21,21,21,0.08)] sm:p-8"
              >
                <span aria-hidden className={`absolute left-0 top-0 h-1 w-full ${demo.accent}`} />
                <h2 className="text-lg leading-snug sm:text-xl">{demo.title}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{demo.description}</p>
                <span className="mt-auto flex items-center gap-1.5 pt-3 text-sm font-semibold text-foreground">
                  {demo.cta}
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                    aria-hidden
                  />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
