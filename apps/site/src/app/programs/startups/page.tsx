import { createPageMetadata } from "@/lib/page-metadata";
import { CheckBold } from "@/components/icons/forma";
import { RoleKicker } from "@/components/brand/role-kicker";
import { Texture } from "@/components/brand/texture";
import { PrismButton, PrismButtonOutline } from "@/components/brand/prism-button";

export const metadata = createPageMetadata({
  title: "Prisma Startup Program",
  description:
    "The Prisma Startup Program is designed to help early-stage founders focus on scaling their businesses, and not managing databases.",
  path: "/programs/startups",
  ogKicker: "Programs",
});

// Ported from the old site's /startups page. The Tally application form is
// linked directly instead of embedded (no third-party script needed here).
const APPLY_URL = "https://tally.so/r/mBDxkQ";

const BENEFITS = [
  { title: "$10k credits", description: "to fuel your database operations." },
  {
    title: "1:1 guidance from Prisma experts",
    description: "to help you build smarter and faster.",
  },
  { title: "Direct support in Slack", description: "so help is just a quick message away." },
];

const ELIGIBILITY = [
  "Pre-seed, seed, or series-A",
  "Raised venture funding in the last 12 months",
  "Founded in the last 5 years",
];

const BOOTSTRAPPED = [
  "At least 5k MRR for the last 6 months",
  "Two full-time team members",
  "Can-do attitude",
];

const TESTIMONIALS = [
  {
    quote:
      "We adopted Prisma conventions as our standard, and it saves lots of time from having to reinvent things ourselves.",
    author: "Yuval Hazaz",
    role: "CEO, Amplication",
  },
  {
    quote:
      "Thanks to Prisma, we can seamlessly scale our applications without concerns about data layer performance.",
    author: "Matti Nannt",
    role: "Co-Founder, Formbricks",
  },
  {
    quote:
      "Entire SaaS businesses have been built on top of the Prisma ecosystem, including OSS ones like Dub.co. Have been loving the recent performance improvements as well.",
    author: "Steven Tey",
    role: "Founder, Dub.co",
  },
];

export default function StartupsProgramPage() {
  return (
    <>
      <section className="bg-card px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-foreground/[0.06] bg-card">
          <Texture opacity={0.06} blend="multiply" />
          <div className="relative px-4 sm:px-8">
            <div className="mx-auto flex max-w-site flex-col items-center pb-14 pt-32 text-center md:pb-16 md:pt-44">
              <RoleKicker color="bg-prism-cyan-400" className="justify-center">
                Prisma for Startups
              </RoleKicker>
              <h1 className="isolate mt-4 max-w-[20ch] text-balance text-[clamp(2.5rem,4vw,3.5rem)] leading-[1.06]">
                Fuel your startup&apos;s success with Prisma
              </h1>
              <p className="mt-6 max-w-[52ch] text-pretty text-lg leading-relaxed text-muted-foreground">
                Get exclusive 1:1 guidance from Prisma&apos;s database experts, and have your
                database bill covered for a year, up to $10,000.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <PrismButton href={APPLY_URL}>Join the program</PrismButton>
                <PrismButtonOutline href="/blog/prisma-startup-program">
                  Read the announcement
                </PrismButtonOutline>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card px-4 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <h2 className="text-[clamp(1.5rem,2.25vw,2rem)] leading-[1.15]">
              Why join Prisma for Startups?
            </h2>
            <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted-foreground">
              Building a startup is hard. Your tools shouldn&apos;t be. You need infrastructure that
              grows with you: flexible and built to scale.
            </p>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted-foreground">
              Apply if you&apos;re building a software product or service with an active website and
              meet the criteria below.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground/70">Join the program to receive:</p>
            <ul className="mt-4 flex flex-col gap-3">
              {BENEFITS.map((benefit) => (
                <li
                  key={benefit.title}
                  className="flex items-start gap-3 rounded-2xl border border-foreground/[0.06] bg-card p-5 shadow-[0_1px_2px_rgba(21,21,21,0.04)]"
                >
                  <CheckBold className="mt-0.5 size-4 shrink-0 text-prism-cyan-600" aria-hidden />
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    <strong className="font-semibold text-foreground">{benefit.title}</strong>{" "}
                    {benefit.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-12 border-t border-foreground/[0.07] pt-14 md:grid-cols-2 md:gap-20">
          <div>
            <h2 className="text-[clamp(1.375rem,2vw,1.75rem)] leading-[1.15]">Eligibility</h2>
            <ul className="mt-5 flex flex-col gap-2.5">
              {ELIGIBILITY.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[0.9375rem] font-medium">
                  <span
                    aria-hidden
                    className="mt-2 size-2 shrink-0 rounded-full bg-prism-cyan-400"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-[clamp(1.375rem,2vw,1.75rem)] leading-[1.15]">Bootstrapped?</h2>
            <ul className="mt-5 flex flex-col gap-2.5">
              {BOOTSTRAPPED.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[0.9375rem] font-medium">
                  <span
                    aria-hidden
                    className="mt-2 size-2 shrink-0 rounded-full bg-prism-yellow-300"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-2xl rounded-2xl bg-card-wash p-8 text-center sm:p-10">
          <p className="text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
            Prisma gives you developer-friendly database infrastructure so you can build and scale
            your product while staying focused on what matters: shipping to your users.
          </p>
          <div className="mt-6 flex justify-center">
            <PrismButton href={APPLY_URL}>Apply now</PrismButton>
          </div>
        </div>
      </section>

      <section className="bg-card px-4 pb-24 sm:px-8 sm:pb-32">
        <div className="mx-auto max-w-site">
          <h2 className="mx-auto max-w-[24ch] text-balance text-center text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
            Startups building with Prisma
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.author}
                className="flex flex-col gap-4 rounded-2xl border border-foreground/[0.06] bg-card p-6 shadow-[0_1px_2px_rgba(21,21,21,0.04)] sm:p-7"
              >
                <blockquote className="text-pretty text-[0.9375rem] font-medium leading-relaxed text-foreground">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-auto">
                  <p className="text-sm font-semibold text-foreground">{t.author}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
