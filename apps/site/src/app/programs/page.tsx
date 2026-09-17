import { createPageMetadata } from "@/lib/page-metadata";
import Link from "next/link";
import { ArrowRight } from "@/components/icons/forma";
import { RoleKicker } from "@/components/brand/role-kicker";
import { Texture } from "@/components/brand/texture";
import { CtaBurst } from "@/components/sections/cta-burst";

export const metadata = createPageMetadata({
  title: "Programs",
  description: "Prisma programs for startups, platform partners, and the open-source community.",
  path: "/programs",
  ogKicker: "Programs",
});

// Programs hub, the footer's "Programs" destination. Each program's full
// page is ported from the old site (/startups, /partners, /oss-friends).
const PROGRAMS = [
  {
    kicker: "Startups",
    accent: "bg-prism-cyan-400",
    title: "Prisma for Startups",
    description:
      "Up to $10k in database credits, 1:1 guidance from Prisma experts, and direct Slack support, so early-stage teams scale their business, not their database.",
    href: "/programs/startups",
    cta: "Explore the startup program",
  },
  {
    kicker: "Partners",
    accent: "bg-prism-yellow-300",
    title: "Partner network",
    description:
      "Add mission-critical infrastructure to your platform in hours: provision Postgres through the Management API, embed Prisma Studio, and deploy full-stack apps in one call.",
    href: "/programs/partners",
    cta: "Explore the partner network",
  },
  {
    kicker: "Open source",
    accent: "bg-prism-red-400",
    title: "OSS Friends & FOSS Fund",
    description:
      "Prisma grew out of open source. We support the ecosystem with our monthly FOSS Fund donations and by championing the projects we love.",
    href: "/programs/oss-friends",
    cta: "Meet our OSS friends",
  },
];

export default function ProgramsPage() {
  return (
    <>
      <section className="bg-white px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
          <Texture opacity={0.06} blend="multiply" />
          <div className="relative px-4 sm:px-8">
            <div className="mx-auto flex max-w-site flex-col items-center pb-14 pt-32 text-center md:pb-16 md:pt-44">
              <RoleKicker color="bg-prism-yellow-300" className="justify-center">
                Programs
              </RoleKicker>
              <h1 className="isolate mt-4 max-w-[20ch] text-balance text-[clamp(2.5rem,4vw,3.5rem)] leading-[1.06]">
                Programs for every kind of builder
              </h1>
              <p className="mt-6 max-w-[52ch] text-pretty text-lg leading-relaxed text-muted-foreground">
                Whether you&apos;re bootstrapping a startup, building a platform, or maintaining
                open source, there&apos;s a Prisma program for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 pb-24 pt-14 sm:px-8 sm:pb-32">
        <div className="mx-auto max-w-site">
          <div className="grid gap-5 md:grid-cols-3">
            {PROGRAMS.map((program) => (
              <Link
                key={program.href}
                href={program.href}
                className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-7 shadow-[0_1px_2px_rgba(21,21,21,0.04)] transition-[border-color,box-shadow,translate] duration-300 hover:-translate-y-0.5 hover:border-black/[0.12] hover:shadow-[0_10px_30px_rgba(21,21,21,0.08)] sm:p-8"
              >
                <RoleKicker color={program.accent}>{program.kicker}</RoleKicker>
                <h2 className="text-xl leading-snug sm:text-2xl">{program.title}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {program.description}
                </p>
                <span className="mt-auto flex items-center gap-1.5 pt-3 text-sm font-semibold text-foreground">
                  {program.cta}
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                    aria-hidden
                  />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBurst />
    </>
  );
}
