import { EcosystemGrid } from "@/components/ecosystem/grid";
import Antigravity from "../../components/homepage/antigravity";
import { createPageMetadata } from "@/lib/page-metadata";
import { Button } from "@prisma/eclipse";
import { CopyCode } from "@/components/homepage/copy-btn";
import LogoParade from "@prisma-docs/ui/components/logo-parade";
import React from "react";
import { Bento } from "@/components/homepage/bento";
import { CardSection } from "@/components/homepage/card-section/card-section";
import review from "../../data/homepage.json";
import Testimonials from "../../components/homepage/testimonials";

const twoCol = [
  {
    content: (
      <>
        <h2 className="text-foreground-neutral stretch-display text-4xl font-black! font-sans-display mt-0 mb-4">
          Postgres that <br /> fits your stack.
        </h2>
        <p className="text-foreground-neutral-weak! text-base">
          Works with your existing stack, wherever you deploy.Your choice of
          ORM, frameworks, and tools, they all just connect.
        </p>
      </>
    ),
    imageUrl: null,
    imageAlt: null,
    mobileImageUrl: null,
    mobileImageAlt: null,
    logos: null,
    useDefaultLogos: true,
    visualPosition: "right" as const,
    visualType: "logoGrid" as const,
  },
  {
    content: (
      <>
        <h2 className="text-foreground-neutral stretch-display text-4xl font-black! font-sans-display mt-0 mb-4">
          Real Postgres. <br /> Better experience.
        </h2>
        <p className="text-foreground-neutral-weak! text-base">
          The PostgreSQL millions know and trust in production, ready in seconds
          with zero configuration. Automatic backups, observability and
          compliance.
        </p>
      </>
    ),
    imageUrl: "/illustrations/homepage/real_ppg",
    imageAlt: "Real Postgres",
    mobileImageUrl: "/illustrations/homepage/real_ppg_mobile",
    mobileImageAlt: "Real PPG mobile",
    logos: null,
    useDefaultLogos: false,
    visualPosition: "left" as const,
    visualType: "image" as const,
  },
];
export const metadata = createPageMetadata({
  title: "Prisma ORM Ecosystem",
  description:
    "Explore the variety of tools (from generators, to middleware, to CLIs) created by the Prisma community.",
  path: "/ecosystem",
  ogImage: "/og/og-ecosystem.png",
});

export default function SiteHome() {
  return (
    <main className="flex-1 w-full z-1 bg-background-default">
      <div className="hero -mt-24 flex items-end justify-center px-4 relative pt-24">
        <div className="absolute inset-0 pointer-events-none z-1 bg-[linear-gradient(180deg,var(--color-foreground-orm)_0%,var(--color-background-default)_100%)] opacity-20" />
        <div className="content pt-31 relative z-2 my-12 flex flex-col gap-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl stretch-display mb-0 text-center mt-0 font-sans-display text-foreground-neutral max-w-224 mx-auto">
            Prisma Ecosystem
          </h1>
          <p className="text-center text-foreground-neutral max-w-2xl mx-auto">
            Explore the wide variety of tools created by our amazing community.
          </p>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <Button
              variant="orm"
              href="https://pris.ly/submit-your-package"
              size="3xl"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans-display! font-[650]"
            >
              <span>Submit your package</span>
              <i className="fa-regular fa-envelope ml-2" />
            </Button>
          </div>
        </div>
      </div>
      <div className="my-12 px-4">
        <div className="py-12 flex flex-col gap-6 max-w-[1200px] mx-auto">
          <h2 className="text-foreground-neutral stretch-display text-center text-4xl font-black! font-sans-display my-0">
            Dedicated ORM support options
          </h2>
          <p className="text-center text-foreground-neutral max-w-xl mx-auto">
            Focus on core competencies of your team, rather than building and
            managing complex infrastructure components.
          </p>
          <EcosystemGrid />
        </div>
      </div>
    </main>
  );
}
