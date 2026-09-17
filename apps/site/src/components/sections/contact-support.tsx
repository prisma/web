import { IconTile } from "@/components/brand/icon-tile";
import { PrismButtonOutline } from "@/components/brand/prism-button";
import { Console, Discord, Github, Mail } from "@/components/icons/forma";
import { Reveal } from "@/components/motion/reveal";

const CHANNELS = [
  {
    name: "Community",
    Icon: Discord,
    description:
      "Get help and share what you're building with thousands of developers on our Discord.",
    cta: { label: "Join our Discord", href: "https://pris.ly/discord" },
  },
  {
    name: "Direct support",
    Icon: Console,
    description: "On a Pro or Business plan? Submit a ticket from your Console.",
    cta: { label: "Submit a ticket", href: "https://console.prisma.io" },
  },
  {
    name: "Bugs and feature requests",
    Icon: Github,
    description: "Report a bug or request a feature on GitHub.",
    cta: { label: "Open GitHub", href: "https://github.com/prisma/orm/issues" },
  },
];

// The three support channels, for people who don't need the form. Unwrapped and
// plain white so the hero's panel and the closing CTA's panel bracket it — the
// same rhythm /pricing uses between its two wrapped sections.
export function ContactSupport() {
  return (
    // Short tail: CtaBurst below brings its own py-32, and the two together
    // left 240px of white between the email note and the CTA panel.
    <section className="bg-white px-4 pb-8 pt-24 sm:px-8 sm:pb-10 sm:pt-28">
      <div className="mx-auto max-w-site">
        <Reveal>
          <h2 className="text-balance text-center text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1] max-md:text-left">
            Looking for support?
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {CHANNELS.map(({ name, Icon, description, cta }, i) => (
            <Reveal key={name} delay={i * 0.1} className="h-full">
              <div className="flex h-full flex-col rounded-2xl border border-black/[0.06] bg-card p-7">
                <IconTile>
                  <Icon className="size-5 text-foreground" aria-hidden />
                </IconTile>
                <h3 className="mt-5 text-xl">{name}</h3>
                <p className="mt-3 grow text-pretty leading-relaxed text-muted-foreground">
                  {description}
                </p>
                {/* inline-flex so the pill keeps its intrinsic width in the
                    card's flex column (see learn-more.tsx) */}
                <span className="mt-7 inline-flex">
                  <PrismButtonOutline href={cta.href}>{cta.label}</PrismButtonOutline>
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Full width, matching the row of cards above it (André, 2026-08-12). */}
        <Reveal delay={0.3} className="mt-5">
          <p className="flex items-start justify-center gap-2.5 rounded-2xl border border-black/[0.06] bg-card px-6 py-5 font-semibold sm:items-center">
            <Mail className="mt-0.5 size-4 shrink-0 text-muted-foreground sm:mt-0" aria-hidden />
            <span>
              Need email instead? You can reach us at{" "}
              <a
                href="mailto:support@prisma.io"
                className="spectrum-ink underline decoration-black/20 underline-offset-4 transition-colors hover:decoration-transparent"
              >
                support@prisma.io
              </a>
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
