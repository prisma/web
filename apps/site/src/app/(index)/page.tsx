import Antigravity from "../../components/homepage/antigravity";
import type { Metadata } from "next";
import {
  SITE_HOME_DESCRIPTION,
  SITE_HOME_TITLE,
} from "../../lib/blog-metadata";
import { Button } from "@prisma/eclipse";
import { CopyCode } from "@/components/homepage/copy-btn";
import LogoParade from "@prisma-docs/ui/components/logo-parade";
import React from "react";
import { Bento } from "@/components/homepage/bento";
const MemorizedLogoParade = React.memo(LogoParade);

export const metadata: Metadata = {
  title: SITE_HOME_TITLE,
  description: SITE_HOME_DESCRIPTION,
};

export default function SiteHome() {
  return (
    <main className="flex-1 w-full z-1 bg-background-default">
      <div className="hero h-123 -mt-24 flex items-end justify-center">
        <div className="w-screen h-123 absolute inset-0">
          <Antigravity
            count={300}
            magnetRadius={16}
            ringRadius={15}
            waveSpeed={2.6}
            waveAmplitude={2.6}
            particleSize={0.9}
            lerpSpeed={0.02}
            color="#14b8a6"
            autoAnimate
            particleVariance={1}
            rotationSpeed={0}
            depthFactor={2.6}
            pulseSpeed={4.9}
            particleShape="capsule"
            fieldStrength={15.3}
          />
        </div>
        <div className="content relative z-2 my-12 flex flex-col gap-8">
          <h1 className="text-6xl [font-variation-settings:'wght'_900,'wdth'_125] mb-0 text-center mt-0 font-sans-display text-foreground-neutral">
            Postgres, <br />
            perfectly managed.
          </h1>
          <p className="text-center text-foreground-neutral max-w-2xl mx-auto">
            Real Postgres with the developer experience and infrastructure to
            ship faster.
          </p>
          <div className="flex gap-4 items-center justify-center">
            <Button
              variant="ppg"
              href="/signup"
              size="3xl"
              className="font-sans-display! font-[650]"
            >
              <span>Create database</span>
              <i className="fa-regular fa-database ml-2" />
            </Button>
            <CopyCode text="npx prisma init --db">
              <span className="text-foreground-neutral-reverse-weak">$</span>
              <span className="text-foreground-neutral-weak">
                &nbsp;npx prisma init --db
              </span>
              <i className="fa-regular fa-copy ml-2" />
            </CopyCode>
          </div>
        </div>
      </div>
      <div className="logo-parade"></div>
      <Bento
        bentoSection={{
          boxes: [
            {
              title: "MCP Server",
              subtitle: "Use AI to configure and manage databases.",
              imageUrl: "/illustrations/homepage/mcp.svg",
              imageAlt: "MCP server",
              icon: "fa-light fa-cloud-arrow-up",
              link: "/mcp",
            },
            {
              title: "Manage databases",
              subtitle:
                "Create, manage and explore databases directly in your IDE.",
              imageUrl: "/illustrations/homepage/ide.svg",
              imageAlt: "IDE",
              icon: "fa-light fa-screwdriver-wrench",
              link: "https://marketplace.visualstudio.com/items?itemName=Prisma.prisma",
            },
            {
              title: "Type-safety",
              subtitle: "Code faster with auto-completion and type safety.",
              imageUrl: "/illustrations/homepage/typesafe.svg",
              imageAlt: "Type-safe queries",
              icon: "fa-light fa-message-text",
              link: "https://prisma.io/docs/orm/prisma-client/type-safety",
            },
            {
              title: "Work collaboratively",
              subtitle: "Manage projects and databases with your team.",
              imageUrl: "/illustrations/homepage/collaborative.svg",
              imageAlt: "Collaborative work",
              icon: "fa-light fa-screen-users",
              link: "https://console.prisma.io",
            },
            {
              title: "Browse your data",
              subtitle:
                "Explore, filter, and edit your data with an interface.",
              imageUrl: "/illustrations/homepage/data.svg",
              imageAlt: "Data browsing",
              icon: "fa-light fa-magnifying-glass-arrow-right",
              link: "/studio",
            },
          ],
        }}
      />
    </main>
  );
}
