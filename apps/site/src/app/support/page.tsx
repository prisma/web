import type { Metadata } from "next";
import { ArrowRight } from "@/components/icons/forma";
import { RoleKicker } from "@/components/brand/role-kicker";
import { Texture } from "@/components/brand/texture";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Get help with Prisma. Search for answers, report bugs, request features, or contact the Prisma support team.",
};

// Ported from the old site's /support page (apps/site + data/support.json),
// rebuilt in the redesign language: one card per support path, accent bars
// instead of the old gradient washes.

type SupportCard = {
  title: string;
  description: string;
  accent: string;
  links: { label: string; url: string }[];
};

const SUPPORT_CARDS: SupportCard[] = [
  {
    title: "Issues & feature requests",
    description: "Found a bug, or want to request something new? Let us know.",
    accent: "bg-prism-cyan-400/70",
    links: [
      {
        label: "Report a bug",
        url: "https://github.com/prisma/prisma/issues/new?assignees=&labels=&template=bug_report.md",
      },
      {
        label: "Request a new feature",
        url: "https://github.com/prisma/prisma/issues/new?assignees=&labels=&template=feature_request.md",
      },
    ],
  },
  {
    title: "Starter plan",
    description:
      "Support for customers on our Starter plan is provided through our community channels.",
    accent: "bg-prism-yellow-300",
    links: [{ label: "Join our Discord channel", url: "https://pris.ly/discord" }],
  },
  {
    title: "Pro & Business plans",
    description:
      "Support for customers on our Pro or Business plan is provided through the Platform Console.",
    accent: "bg-prism-red-400/80",
    links: [{ label: "Submit a ticket", url: "https://console.prisma.io" }],
  },
];

const MORE_LINKS = [
  { label: "Documentation", url: "/docs" },
  { label: "Prisma examples", url: "https://github.com/prisma/prisma-examples" },
  { label: "Support policy", url: "/support-policy" },
  { label: "Enterprise support", url: "/enterprise" },
];

export default function SupportPage() {
  return (
    <>
      <section className="bg-white px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
          <Texture opacity={0.06} blend="multiply" />
          <div className="relative px-4 sm:px-8">
            <div className="mx-auto flex max-w-site flex-col items-center pb-14 pt-32 text-center md:pb-16 md:pt-44">
              <RoleKicker color="bg-prism-cyan-400" className="justify-center">
                Support
              </RoleKicker>
              <h1 className="isolate mt-4 max-w-[20ch] text-balance text-[clamp(2.5rem,4vw,3.5rem)] leading-[1.06]">
                How can we help?
              </h1>
              <p className="mt-6 max-w-[46ch] text-pretty text-lg leading-relaxed text-muted-foreground">
                Search the docs, report bugs, request features, or reach the Prisma support team.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 pb-24 pt-14 sm:px-8 sm:pb-32">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-5 md:grid-cols-3">
            {SUPPORT_CARDS.map((card) => (
              <div
                key={card.title}
                className="relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_1px_2px_rgba(21,21,21,0.04)] sm:p-7"
              >
                <span aria-hidden className={`absolute left-0 top-0 h-1 w-full ${card.accent}`} />
                <h2 className="text-lg leading-snug">{card.title}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{card.description}</p>
                <div className="mt-auto flex flex-col gap-2 pt-2">
                  {card.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
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
            ))}
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-[2fr_1fr]">
            <div className="flex flex-col justify-between gap-4 rounded-2xl bg-card-wash p-7 sm:flex-row sm:items-center sm:p-9">
              <div>
                <h2 className="text-xl leading-snug">Still need help?</h2>
                <p className="mt-2 max-w-[48ch] text-sm leading-relaxed text-muted-foreground">
                  We&apos;re here to help. Response times depend on your subscription level and the
                  volume of requests we&apos;re receiving.
                </p>
              </div>
              <a
                href="mailto:support@prisma.io"
                className="group flex shrink-0 items-center gap-1.5 text-sm font-semibold text-foreground"
              >
                Email us
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                  aria-hidden
                />
              </a>
            </div>
            <div className="flex flex-col justify-center gap-3 rounded-2xl border border-black/[0.06] p-7">
              {MORE_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
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
        </div>
      </section>
    </>
  );
}
