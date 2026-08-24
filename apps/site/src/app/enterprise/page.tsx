import type { Metadata } from "next";
import { RoleKicker } from "@/components/brand/role-kicker";
import { Texture } from "@/components/brand/texture";
import { PrismButton } from "@/components/brand/prism-button";

export const metadata: Metadata = {
  title: "Enterprise",
  description:
    "Enterprise-level support, security, and guidance for teams running Prisma in production.",
};

// Ported (condensed) from the old site's /enterprise page. The Tally contact
// form is linked directly instead of embedded.
const CONTACT_URL = "https://tally.so/r/3jQDNR";

const BENEFITS = [
  {
    title: "Enterprise-level support",
    description:
      "Work directly with Prisma specialists who understand enterprise architectures, delivery timelines, and production constraints.",
  },
  {
    title: "Risk and compliance",
    description:
      "Navigate security reviews, procurement, and compliance requirements with clearer guidance and supporting documentation.",
  },
  {
    title: "Custom solutions",
    description:
      "Shape an engagement that fits your stack, internal processes, and the needs of your organization.",
  },
  {
    title: "Priority resolution",
    description:
      "Escalate urgent issues faster to reduce downtime, unblock teams, and keep releases on schedule.",
  },
  {
    title: "Advanced security",
    description:
      "Adopt secure defaults and harden database access patterns for sensitive workloads and regulated environments.",
  },
  {
    title: "Performance optimization",
    description:
      "Tune query patterns, schema design, and workflows for predictable performance under real production load.",
  },
  {
    title: "Scalability consultation",
    description:
      "Plan for growth with guidance on scaling data access, team workflows, and application architecture.",
  },
  {
    title: "Team training",
    description:
      "Upskill developers with hands-on enablement tailored to your codebase, workflows, and Prisma adoption goals.",
  },
  {
    title: "Influential feedback loop",
    description:
      "Share direct product feedback with the Prisma team and help shape the roadmap around enterprise needs.",
  },
];

const DATABASES = [
  { name: "PostgreSQL", icon: "/enterprise/databases/postgres.svg" },
  { name: "MySQL", icon: "/enterprise/databases/mysqlsimple.svg" },
  { name: "MariaDB", icon: "/enterprise/databases/mariadb.svg" },
  { name: "SQLite", icon: "/enterprise/databases/sqlite.svg" },
  { name: "SQL Server", icon: "/enterprise/databases/sqlserver.svg" },
  { name: "CockroachDB", icon: "/enterprise/databases/cockroachdb.svg" },
  { name: "PlanetScale", icon: "/enterprise/databases/planetscale.svg" },
  { name: "MongoDB", icon: "/enterprise/databases/mongodbsimple.svg" },
];

export default function EnterprisePage() {
  return (
    <>
      <section className="bg-white px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
          <Texture opacity={0.06} blend="multiply" />
          <div className="relative px-4 sm:px-8">
            <div className="mx-auto flex max-w-site flex-col items-center pb-14 pt-32 text-center md:pb-16 md:pt-44">
              <RoleKicker color="bg-prism-cyan-400" className="justify-center">
                Enterprise
              </RoleKicker>
              <h1 className="isolate mt-4 max-w-[22ch] text-balance text-[clamp(2.25rem,3.5vw,3.25rem)] leading-[1.08]">
                Prisma at enterprise scale
              </h1>
              <p className="mt-6 max-w-[54ch] text-pretty text-lg leading-relaxed text-muted-foreground">
                By integrating Prisma into your development workflow, you build adaptable
                applications with less code and fewer errors, and as you grow, your data layer
                scales without sacrificing performance or security.
              </p>
              <div className="mt-8">
                <PrismButton href={CONTACT_URL}>Talk to the Prisma team</PrismButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-site">
          <h2 className="mx-auto max-w-[26ch] text-balance text-center text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
            What an enterprise engagement includes
          </h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((benefit, i) => (
              <div
                key={benefit.title}
                className="relative flex flex-col gap-2.5 overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_1px_2px_rgba(21,21,21,0.04)] sm:p-7"
              >
                <span
                  aria-hidden
                  className={
                    "absolute left-0 top-0 h-1 w-full " +
                    ["bg-prism-cyan-400/70", "bg-prism-yellow-300", "bg-prism-red-400/80"][i % 3]
                  }
                />
                <h3 className="text-base font-semibold leading-snug">{benefit.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 pb-20 sm:px-8 sm:pb-24">
        <div className="mx-auto max-w-4xl rounded-2xl bg-card-wash px-6 py-10 sm:px-10">
          <p className="text-center text-sm font-semibold text-foreground/70">
            Bring your own database
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            {DATABASES.map((db) => (
              <span key={db.name} className="flex items-center gap-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={db.icon} alt="" loading="lazy" className="size-6" />
                <span className="text-sm font-medium text-foreground">{db.name}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 pb-24 sm:px-8 sm:pb-32">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 rounded-2xl border border-black/[0.06] p-8 text-center sm:p-12">
          <h2 className="text-[clamp(1.5rem,2.25vw,2rem)] leading-[1.15]">Connect with us</h2>
          <p className="max-w-[52ch] text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
            Tell us about your team, and we&apos;ll show you how our support options fit your agency
            or enterprise&apos;s work with Prisma.
          </p>
          <PrismButton href={CONTACT_URL}>Contact enterprise sales</PrismButton>
        </div>
      </section>
    </>
  );
}
