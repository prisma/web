import type { ReactNode } from "react";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingStickyCta } from "@/components/landing/landing-sticky-cta";

// The campaign landing pages' chrome. The root layout keeps everything that
// measures the visit (consent, GTM, the ChatGPT ads pixel, PostHog, UTM
// persistence) and drops only the site header, banner and footer for these
// routes (see components/site-chrome.tsx), so this layout adds the minimal
// pair back: a header with one CTA and a footer with the legal links.
export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <LandingHeader />
      {children}
      <LandingFooter />
      <LandingStickyCta />
    </>
  );
}
