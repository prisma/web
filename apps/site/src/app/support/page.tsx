import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/page-metadata";
import { cn } from "@/lib/utils";
import { Texture } from "@/components/brand/texture";
import { SupportSearch } from "@/components/support/support-search";
import { Reveal } from "@/components/support/reveal";
import {
  ArrowRight,
  CheckCircle,
  ConsoleCode,
  Discord,
  DocWindow,
  Github,
  Mail,
  PolicyTable,
  Shield,
} from "@/components/support/support-icons";
import "./support.css";

export const metadata = createPageMetadata({
  title: "Prisma Support | Get Help, Report Bugs, and Request Features",
  description:
    "Find an answer in the docs, ask the community, or reach our support team. Where you go depends on your plan and what you need.",
  path: "/support",
  ogKicker: "Support",
});

// Ported from the approved support design. Visual styling is reproduced
// faithfully; link targets use the live site's real routes.

const RAINBOW =
  "linear-gradient(85deg, #01d7e4 0%, #f3c306 25%, #f37a03 50%, #f43531 74%, #f00e5c 100%)";

const HERO_GLOW =
  "radial-gradient(52% 40% at 30% 100%, color-mix(in srgb, var(--color-prism-cyan-400) 34%, transparent), transparent 68%),radial-gradient(44% 36% at 52% 100%, color-mix(in srgb, var(--color-prism-yellow-300) 26%, transparent), transparent 66%),radial-gradient(42% 30% at 74% 100%, color-mix(in srgb, var(--color-prism-red-400) 28%, transparent), transparent 68%)";

const PANEL_GLOW =
  "radial-gradient(52% 44% at 28% 100%, color-mix(in srgb, var(--color-prism-cyan-400) 32%, transparent), transparent 70%),radial-gradient(44% 38% at 52% 100%, color-mix(in srgb, var(--color-prism-yellow-300) 24%, transparent), transparent 66%),radial-gradient(48% 40% at 74% 100%, color-mix(in srgb, var(--color-prism-red-400) 28%, transparent), transparent 70%)";

const ICON_GLOW =
  "radial-gradient(80% 55% at 20% 100%, color-mix(in srgb, var(--color-prism-cyan-300) 45%, transparent), transparent 70%),radial-gradient(70% 50% at 52% 100%, color-mix(in srgb, var(--color-prism-yellow-300) 40%, transparent), transparent 68%),radial-gradient(75% 52% at 84% 100%, color-mix(in srgb, var(--color-prism-red-300) 42%, transparent), transparent 70%)";

const outlineButton =
  "spectrum-border flex items-center justify-center rounded-full border border-[#646567] cursor-pointer transition-colors duration-500 hover:border-transparent px-[22px] py-[11px] text-[16px]";
const outlineButtonLabel = "whitespace-nowrap font-semibold leading-[1.5] text-foreground";

function GlowIcon({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-black/[0.06] bg-card shadow-[0_1px_2px_rgba(21,21,21,0.04),0_8px_16px_-8px_rgba(21,21,21,0.1)]",
        className,
      )}
    >
      <span className="absolute inset-0" style={{ background: ICON_GLOW }} />
      <span className="relative">{children}</span>
    </span>
  );
}

// Solid black pill button with a soft rainbow bloom behind it.
function PrimaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <span className="relative inline-flex shrink-0 items-center">
      <span aria-hidden className="absolute inset-0 overflow-hidden rounded-full blur-[3.2px]">
        <span className="absolute inset-y-0 block w-[240%]" style={{ backgroundImage: RAINBOW }} />
      </span>
      <a
        href={href}
        className="relative flex items-center justify-center overflow-hidden rounded-full bg-black cursor-pointer px-6 py-3 text-[16px]"
      >
        <span className="relative z-10 whitespace-nowrap font-semibold leading-[1.5] text-white">
          {children}
        </span>
      </a>
    </span>
  );
}

const SUPPORT_CARDS = [
  {
    title: "Community support",
    description:
      "Ask questions and share what you're building with thousands of developers on our Discord. Available on every plan, including the free tier.",
    icon: <Discord className="size-5 text-foreground" />,
    cta: { label: "Join our Discord", url: "https://pris.ly/discord" },
  },
  {
    title: "Direct support",
    description:
      "On a Pro or Business plan? Submit a ticket from your Console, and our team will help.",
    icon: <ConsoleCode className="size-5 text-foreground" />,
    cta: { label: "Submit a ticket", url: "https://console.prisma.io" },
  },
  {
    title: "Enterprise support",
    description:
      "Need higher-touch support with guaranteed response times? Explore our enterprise options.",
    icon: <Shield className="size-5 text-foreground" />,
    cta: { label: "Discover Enterprise support", url: "/enterprise" },
  },
];

const RESOURCES = [
  {
    title: "Documentation",
    description: "Guides, references, and API docs for every part of Prisma.",
    url: "/docs",
    cta: "Read the docs",
    icon: <DocWindow className="size-5 text-foreground" />,
  },
  {
    title: "Examples",
    description: "Ready-to-run example projects on GitHub.",
    url: "https://github.com/prisma/prisma-examples",
    cta: "Browse examples",
    icon: <Github className="size-5 text-foreground" />,
  },
  {
    title: "Platform status",
    description: "Check current status and past incidents.",
    url: "https://www.prisma-status.com",
    cta: "View status",
    icon: <CheckCircle className="size-5 text-foreground" />,
  },
  {
    title: "Support policy",
    description: "What each plan includes and how support works.",
    url: "/support-policy",
    cta: "Read the policy",
    icon: <PolicyTable className="size-5 text-foreground" />,
  },
];

export default function SupportPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-white px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[30rem] overflow-hidden"
          >
            <div
              className="absolute -bottom-1/3 left-1/2 h-[120%] w-[160%] -translate-x-1/2"
              style={{ background: HERO_GLOW }}
            />
            <div className="absolute bottom-[-24rem] left-[10%] h-[60rem] w-36 origin-bottom rotate-[-28deg] bg-prism-cyan-300/50 blur-[64px]" />
            <div className="absolute bottom-[-26rem] left-1/2 h-[62rem] w-44 origin-bottom -translate-x-1/2 rotate-[5deg] bg-prism-yellow-200/60 blur-[72px]" />
            <div className="absolute bottom-[-28rem] right-[8%] h-[60rem] w-36 origin-bottom rotate-[28deg] bg-prism-red-300/50 blur-[64px]" />
            <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-t from-transparent via-white/60 to-white" />
          </div>
          <Texture opacity={0.06} blend="multiply" />
          <div className="relative px-4 sm:px-8">
            <div className="mx-auto flex max-w-3xl animate-hero-rise flex-col items-center pb-24 pt-36 text-center motion-reduce:animate-none md:pb-28 md:pt-44">
              <h1 className="isolate max-w-[18ch] text-balance text-[clamp(2.5rem,4vw,3.5rem)] leading-[1.06]">
                How can we{" "}
                <span className="relative md:whitespace-nowrap">
                  <span className="relative z-10">help</span>
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-[-0.35em] -z-10 w-[42%] animate-glass-glide max-md:hidden motion-reduce:hidden"
                  >
                    <span className="absolute inset-x-[6%] inset-y-[18%] rounded-full bg-black/[0.07] blur-2xl" />
                    <span className="absolute inset-0 rounded-full bg-white/80 blur-xl" />
                    <span
                      className="absolute inset-x-[8%] top-1/2 h-[60%] -translate-y-1/2 rounded-full opacity-40 blur-2xl"
                      style={{ background: RAINBOW }}
                    />
                  </span>
                </span>
                ?
              </h1>
              <p className="mt-6 max-w-[52ch] text-pretty text-lg leading-relaxed text-muted-foreground">
                Find an answer in the docs, ask the community, or reach our support team. Where you
                go depends on your plan and what you need.
              </p>
              <SupportSearch />
            </div>
          </div>
        </div>
      </section>

      {/* Ways to get support */}
      <section className="bg-white px-4 pb-8 pt-24 sm:px-8 sm:pb-10 sm:pt-28">
        <div className="mx-auto max-w-site">
          <Reveal>
            <h2 className="text-balance text-center text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1] max-md:text-left">
              Ways to get support
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {SUPPORT_CARDS.map((card) => (
              <Reveal key={card.title} className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-black/[0.06] bg-card p-7">
                  <GlowIcon className="size-12">{card.icon}</GlowIcon>
                  <h3 className="mt-5 text-xl">{card.title}</h3>
                  <p className="mt-3 grow text-pretty leading-relaxed text-muted-foreground">
                    {card.description}
                  </p>
                  <span className="mt-7 inline-flex">
                    <a href={card.cta.url} className={outlineButton}>
                      <span className={outlineButtonLabel}>{card.cta.label}</span>
                    </a>
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-6 text-center text-sm italic text-muted-foreground">
              Response times depend on your subscription plan and current volume.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Report an issue */}
      <section className="bg-white px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-site">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-black/[0.06] bg-white">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[26rem] overflow-hidden"
              >
                <div
                  className="absolute -bottom-1/3 left-1/2 h-[120%] w-[160%] -translate-x-1/2"
                  style={{ background: PANEL_GLOW }}
                />
                <div className="absolute bottom-[-22rem] left-[14%] h-[52rem] w-40 origin-bottom rotate-[-26deg] bg-prism-cyan-300/50 blur-[80px]" />
                <div className="absolute bottom-[-24rem] left-1/2 h-[54rem] w-44 origin-bottom -translate-x-1/2 rotate-[5deg] bg-prism-yellow-200/55 blur-[80px]" />
                <div className="absolute bottom-[-26rem] right-[12%] h-[52rem] w-40 origin-bottom rotate-[26deg] bg-prism-red-300/50 blur-[80px]" />
                <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-t from-transparent via-white/50 to-white" />
              </div>
              <Texture opacity={0.06} blend="multiply" />
              <div className="relative flex flex-col items-center gap-6 px-6 py-16 text-center sm:px-12 sm:py-20">
                <GlowIcon className="size-14">
                  <Github className="size-6 text-foreground" />
                </GlowIcon>
                <div className="flex flex-col items-center gap-3">
                  <p className="flex items-center gap-2 text-sm font-semibold text-foreground/70">
                    <span aria-hidden className="size-2 rounded-full bg-prism-red-500" />
                    Report an issue
                  </p>
                  <h2 className="text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
                    Found a bug or want a feature?
                  </h2>
                  <p className="max-w-[52ch] text-pretty leading-relaxed text-muted-foreground">
                    Report bugs and request features on GitHub, where our team and the community
                    track them in the open.
                  </p>
                </div>
                <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
                  <PrimaryButton href="https://github.com/prisma/orm/issues/new?assignees=&labels=&template=bug_report.md">
                    Report a bug
                  </PrimaryButton>
                  <a
                    href="https://github.com/prisma/orm/issues/new?assignees=&labels=&template=feature_request.md"
                    className={outlineButton}
                  >
                    <span className={outlineButtonLabel}>Request a feature</span>
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Resources */}
      <section className="bg-white px-4 pb-10 pt-14 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <h2 className="text-balance text-center text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1] max-md:text-left">
              Resources for faster answers
            </h2>
          </Reveal>
          <Reveal className="mt-10">
            <div className="divide-y divide-black/[0.06] overflow-hidden rounded-2xl border border-black/[0.06] bg-card">
              {RESOURCES.map((resource) => (
                <a
                  key={resource.title}
                  href={resource.url}
                  className="group flex items-center gap-4 px-5 py-5 transition-colors hover:bg-black/[0.02] sm:px-6"
                >
                  <GlowIcon className="size-11">{resource.icon}</GlowIcon>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold leading-tight">{resource.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {resource.description}
                    </p>
                  </div>
                  <span className="ml-2 hidden shrink-0 items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors group-hover:text-foreground sm:inline-flex">
                    {resource.cta}
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Still stuck */}
      <section className="bg-white px-4 pb-28 pt-14 sm:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Reveal>
            <h2 className="text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
              Still stuck?
            </h2>
            <p className="mx-auto mt-4 max-w-[52ch] text-pretty leading-relaxed text-muted-foreground">
              If you can&apos;t find what you need, email us and we&apos;ll point you in the right
              direction.
            </p>
          </Reveal>
          <Reveal className="mt-8">
            <a href="mailto:support@prisma.io" className={outlineButton}>
              <span className={outlineButtonLabel}>
                <span className="inline-flex items-center gap-2">
                  <Mail className="size-4" />
                  Email support@prisma.io
                </span>
              </span>
            </a>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
