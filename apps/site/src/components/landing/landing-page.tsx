import type { ReactNode } from "react";
import type { Metadata } from "next";
import { CtaBurst } from "@/components/sections/cta-burst";
import { Faq } from "@/components/sections/faq";
import { createPageMetadata } from "@/lib/page-metadata";
import { CONSOLE_SIGNUP_URL, CTA_LABEL, type LandingContent } from "./content";
import { LandingBenefits } from "./landing-benefits";
import { LandingFlow } from "./landing-flow";
import { LandingHero } from "./landing-hero";
import { LandingPlans } from "./landing-plans";

const CHECK_COLORS = ["text-prism-cyan-500", "text-prism-yellow-400", "text-prism-red-500"];

/**
 * Metadata for a landing page: the site's standard card and canonical, plus
 * `noindex`. The pages exist for paid clicks; the product pages they summarise
 * are the organic entry points and should keep the ranking.
 */
export function landingMetadata(content: LandingContent): Metadata {
  return {
    ...createPageMetadata({
      title: content.meta.title,
      description: content.meta.description,
      path: content.path,
      ogKicker: content.meta.ogKicker,
      ogAccent: content.meta.ogAccent,
    }),
    robots: { index: false, follow: false },
  };
}

/**
 * The shared page shape: hero, the three-product flow, the plan ladder with
 * the Free plan lit (the second CTA, one screen below the first), the
 * benefits, then whatever proof the page adds (`children`), the FAQ and the
 * closer. Every
 * CTA on the page is the same label to the same Console URL; the attribution
 * listener in the root layout stamps the campaign params at click time.
 */
export function LandingPage({
  content,
  heroVisual,
  children,
}: {
  content: LandingContent;
  heroVisual?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <>
      <LandingHero content={content} visual={heroVisual} />
      <LandingFlow flow={content.flow} />
      <LandingPlans />
      <LandingBenefits benefits={content.benefits} />
      {children}
      <Faq heading="Before you sign up" items={content.faq} />
      <CtaBurst
        headline={content.cta.headline}
        headlineMaxWidth="max-w-[26ch]"
        body={content.cta.body}
        bodyMaxWidth="max-w-[64ch]"
        checks={content.cta.checks.map((label, i) => ({ label, color: CHECK_COLORS[i % 3] }))}
        primaryCta={{ label: CTA_LABEL, href: CONSOLE_SIGNUP_URL }}
        secondaryCta={null}
        ctaLocation="lp_closer"
      />
    </>
  );
}
