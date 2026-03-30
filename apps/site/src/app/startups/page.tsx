import type { Metadata } from "next";
import { Button } from "@prisma/eclipse";
import { TallyEmbed } from "./_components/tally-embed";

export const metadata: Metadata = {
  title: "Startup Program | Prisma",
  description:
    "Get exclusive 1:1 guidance from Prisma's database experts, and have your database bill covered for a year and up to $10,000.",
};

const benefits = [
  {
    title: "$10k credits",
    description: "to fuel your database operations.",
  },
  {
    title: "Get 1:1 guidance from Prisma experts",
    description: "to help you build smarter and faster",
  },
  {
    title: "Direct support in Slack",
    description: "so help is just a quick message away.",
  },
];

const testimonials = [
  {
    quote: (
      <>
        We <b>adopted Prisma conventions as our standard</b>, and it saves lots
        of time from having to reinvent things ourselves.
      </>
    ),
    author: "Yuval Hazaz",
    title: "CEO",
    company: "Amplication",
    imageUrl:
      "https://cdn.sanity.io/images/p2zxqf70/production/aa129a88ed94eacc5982d635fb2c4fbf4999d27a-360x360.png",
  },
  {
    quote: (
      <>
        Thanks to Prisma, we can seamlessly <b>scale our applications</b>{" "}
        without concerns about data layer performance.
      </>
    ),
    author: "Matti Nannt",
    title: "Co-Founder",
    company: "Formbricks",
    imageUrl:
      "https://cdn.sanity.io/images/p2zxqf70/production/ad0729b674727bf68247dc8421990f49e87df894-100x100.jpg",
  },
  {
    quote: (
      <>
        Entire SaaS businesses have been built on top of the Prisma ecosystem—
        including OSS ones like Dub.co. Have been loving the recent performance
        improvements as well
      </>
    ),
    author: "Steven Tey",
    title: "Founder",
    company: "Dub.co",
    imageUrl:
      "https://cdn.sanity.io/images/p2zxqf70/production/b290d3461fbfeb0f3cddc09efceb04e2132295ee-500x500.svg",
  },
];

export default function StartupsPage() {
  return (
    <main className="flex-1 w-full z-1 -mt-24 pt-24 relative legal-hero-gradient">
      {/* Hero */}
      <div className="text-center py-20 px-4">
        <div className="max-w-[748px] mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold font-sans-display text-foreground-neutral mb-8">
            Fuel your startup&apos;s success with Prisma
          </h1>
          <p className="text-xl text-foreground-neutral-weak mb-10 max-w-[700px] mx-auto">
            <b>Get exclusive 1:1 guidance</b> from Prisma&apos;s database
            experts, and have your database bill covered for a year and up to
            $10,000.
          </p>
          <Button variant="orm" size="4xl" href="#contact-us">
            <span>Join the program</span>
            <i className="fa-regular fa-arrow-down ml-2" />
          </Button>
        </div>
      </div>

      {/* Why join + Benefits — two column */}
      <div className="py-20 px-4">
        <div className="max-w-[1021px] mx-auto">
          <div className="flex flex-col md:flex-row gap-12 md:gap-20">
            {/* Left: Why join */}
            <div className="flex-1">
              <h2 className="text-4xl font-bold font-sans-display text-foreground-neutral mb-6">
                Why join Prisma
                <br />
                for Startups?
              </h2>
              <p className="text-foreground-neutral-weak mb-4">
                Building a startup is hard – your tools shouldn&apos;t be. You
                need infra that grows with you: flexible, powerful, and built to
                scale.
              </p>
              <p className="text-foreground-neutral-weak">
                Apply if you&apos;re building a software product or service with
                an active website and meet the criteria below.
              </p>
            </div>

            {/* Right: Benefits cards */}
            <div className="flex-1">
              <p className="text-xs font-bold tracking-widest uppercase text-foreground-orm mb-4">
                Join the program to receive:
              </p>
              <div className="space-y-2">
                {benefits.map((b) => (
                  <div
                    key={b.title}
                    className="flex items-start gap-4 rounded-lg border border-stroke-neutral bg-background-neutral-weak p-4"
                  >
                    <i className="fa-solid fa-circle-check text-foreground-orm text-lg mt-0.5 shrink-0" />
                    <div>
                      <span className="font-bold text-foreground-neutral">
                        {b.title}
                      </span>
                      <br />
                      <span className="text-foreground-neutral-weak italic">
                        – {b.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Eligibility + Bootstrapped — two column */}
          <div className="flex flex-col md:flex-row gap-12 md:gap-20 mt-20">
            <div className="flex-1">
              <h2 className="text-4xl font-bold font-sans-display text-foreground-neutral mb-6">
                Eligibility
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-foreground-neutral">
                  <i className="fa-solid fa-arrow-right text-foreground-orm mt-1 shrink-0" />
                  <span className="font-semibold">
                    Pre-seed, seed, or series-A
                  </span>
                </li>
                <li className="flex items-start gap-3 text-foreground-neutral">
                  <i className="fa-solid fa-arrow-right text-foreground-orm mt-1 shrink-0" />
                  <span className="font-semibold">
                    Raised venture funding in the last 12 months
                  </span>
                </li>
                <li className="flex items-start gap-3 text-foreground-neutral">
                  <i className="fa-solid fa-arrow-right text-foreground-orm mt-1 shrink-0" />
                  <span className="font-semibold">
                    Founded in the last 5 years
                  </span>
                </li>
              </ul>
            </div>
            <div className="flex-1">
              <h2 className="text-4xl font-bold font-sans-display text-foreground-neutral mb-6">
                Bootstrapped?
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-foreground-neutral">
                  <i className="fa-solid fa-arrow-right text-foreground-orm mt-1 shrink-0" />
                  <span className="font-semibold">
                    At least 5k MRR for the last 6 months
                  </span>
                </li>
                <li className="flex items-start gap-3 text-foreground-neutral">
                  <i className="fa-solid fa-arrow-right text-foreground-orm mt-1 shrink-0" />
                  <span className="font-semibold">
                    Two full-time team members
                  </span>
                </li>
                <li className="flex items-start gap-3 text-foreground-neutral">
                  <i className="fa-solid fa-arrow-right text-foreground-orm mt-1 shrink-0" />
                  <span className="font-semibold">Can do attitude 😉</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Info box */}
          <div className="mt-20 max-w-[671px] mx-auto text-center rounded-lg border border-stroke-orm bg-background-orm p-8">
            <p className="text-foreground-neutral mb-8 text-balance">
              Prisma empowers you to innovate faster with the most reliable and
              developer-friendly database infrastructure. Build with confidence,
              scale without limits, and deliver exceptional experiences to your
              global audience—all while staying focused on what matters: your
              product.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <i className="fa-solid fa-message text-foreground-orm text-2xl" />
              <span className="font-bold text-foreground-neutral text-lg">
                Startups blog announcement
              </span>
              <Button
                variant="default"
                size="xl"
                href="/blog/prisma-startup-program"
              >
                Read it now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20 px-4">
        <div className="max-w-[1021px] mx-auto">
          <h3 className="text-3xl font-bold font-sans-display text-foreground-neutral text-center mb-10">
            Startups building with Prisma
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6">
            {testimonials.map((t) => (
              <div
                key={t.author}
                className="flex flex-col justify-between rounded-[10px] border border-stroke-neutral bg-background-neutral-weak p-6"
              >
                <p className="text-foreground-neutral-weak text-lg leading-[25px] mb-8 [&_b]:text-foreground-neutral [&_b]:font-semibold">
                  {t.quote}
                </p>
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.imageUrl}
                    alt={`Profile photo of ${t.author}`}
                    width={48}
                    height={48}
                    className="size-12 rounded-full object-cover"
                    loading="lazy"
                  />
                  <div>
                    <p className="font-bold text-foreground-orm text-lg">
                      {t.company}
                    </p>
                    <p className="text-foreground-neutral text-base">
                      {t.author}
                      <span className="text-foreground-neutral-weaker">
                        {" "}
                        / {t.title}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form — always dark since Tally form is dark-themed */}
      <div className="relative bg-background-neutral-weaker dark:bg-background-default text-center px-2.5 pt-12 pb-20">
        <span id="contact-us" className="absolute -top-30" />
        <h2 className="text-3xl font-bold font-sans-display text-foreground-neutral mb-8">
          Apply below
        </h2>
        <div className="dark">
          <TallyEmbed />
        </div>
      </div>
    </main>
  );
}
