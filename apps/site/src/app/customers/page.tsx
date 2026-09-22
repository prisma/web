import { createPageMetadata } from "@/lib/page-metadata";
import { CtaBurst } from "@/components/sections/cta-burst";
import { CustomersGrid } from "@/components/sections/customers-grid";
import { CustomersHero } from "@/components/sections/customers-hero";
import { LogoCloud } from "@/components/sections/logo-cloud";
import { COMMUNITY_LOGOS } from "@/data/customers";

export const metadata = createPageMetadata({
  title: "Customers",
  description:
    "Real teams, real production stories. See how developers use Prisma to build, deploy, and scale without wrestling their backend at every step.",
  path: "/customers",
  ogKicker: "Customers",
});

// /customers — the redesign of prisma.io/showcase, built from the approved
// copy (Notion: Customers Index — Copy and Design, V1) with the section order
// the copy gives, and the card/logo-band structure of the reference layout
// André supplied. Layout notes and the rulings behind them:
// .context/customers-index-layout.md.
//
// Four sections. The copy asks for logos twice, and the two moments are
// deliberately different jobs: the hero band is twelve recognisable marks
// answering "who", the marquee is all 44 community projects answering "how
// many". If one ever has to go, it's the band — the marquee is the one the copy
// gives an actual heading to.
//
// The closer is CtaBurst with a headline override and nothing else: /contact
// already ships this block with these exact three checks, so the approved copy
// needed no new component.
export default function CustomersPage() {
  return (
    <>
      <CustomersHero />
      <CustomersGrid />
      {/* 180s, not the default 45s. The track is 44 wide tiles (~8600px) against
          the homepage's 21 square ones (~2400px), and the keyframe duration is
          per-loop, so the default made this strip drift 3.5x faster than the
          homepage's. 180s puts it at ~48px/s, a shade calmer than home. */}
      <LogoCloud
        logos={COMMUNITY_LOGOS}
        wide
        durationSeconds={180}
        className="pt-0 lg:pt-0"
        heading={
          <h2 className="text-balance text-center text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
            Trusted by 500K+ developers globally
          </h2>
        }
      />
      <CtaBurst
        headline="Ready to build with Prisma?"
        headlineMaxWidth="max-w-[22ch]"
        body="Free to start, no credit card required."
        bodyMaxWidth="max-w-[44ch]"
        checks={[
          {
            label: "Create a database and start building in minutes",
            color: "text-prism-cyan-500",
          },
          {
            label: "Read the docs for guides and API reference",
            color: "text-prism-yellow-400",
          },
          { label: "Trusted by 500K+ developers globally", color: "text-prism-red-500" },
        ]}
        primaryCta={{ label: "Get started free", href: "https://console.prisma.io" }}
        secondaryCta={{ label: "Talk to us", href: "/contact" }}
      />
    </>
  );
}
