"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { trackCTA } from "@prisma-docs/ui/lib/analytics";
import { PrismButton } from "@/components/brand/prism-button";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import { CONSOLE_SIGNUP_URL, CTA_LABEL } from "./content";

const LOGIN_URL = "https://console.prisma.io/login";

// The landing pages' header: the site header's docked-to-floating pill with
// the navigation removed. A visitor from an ad gets two ways forward, the
// sign-up CTA (from md up) and, for someone who already has an account, a
// login link. The
// logo is deliberately not a link: the homepage is a detour from the one
// action this page exists for.
export function LandingHeader() {
  const [floating, setFloating] = useState(false);

  useEffect(() => {
    const onScroll = () => setFloating(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 h-0 flow-root">
      <div
        className={cn(
          "mx-auto flex items-center justify-between rounded-full border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          floating
            ? "mt-3 h-14 max-w-[calc(100%-1.5rem)] border-black/[0.06] bg-white/85 px-5 shadow-[0_1px_2px_rgba(21,21,21,0.04),0_8px_24px_-8px_rgba(21,21,21,0.16)] backdrop-blur-md sm:max-w-3xl"
            : "mt-5 h-16 max-w-[96rem] border-transparent bg-white/0 px-6 shadow-[0_1px_2px_rgba(21,21,21,0),0_8px_24px_-8px_rgba(21,21,21,0)] backdrop-blur-0 sm:mt-7 sm:h-[4.5rem] sm:px-16",
        )}
      >
        <Image
          src="/logo/full-color.svg"
          alt={siteConfig.name}
          width={110}
          height={28}
          priority
          className="h-6 w-auto sm:h-7"
        />
        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href={LOGIN_URL}
            className="spectrum-ink-text rounded-full px-3 py-2 text-sm font-semibold text-foreground"
            onClick={() =>
              trackCTA({
                cta_text: "Log in",
                cta_location: "lp_navbar",
                cta_destination: LOGIN_URL,
                section: "website",
              })
            }
          >
            Log in
          </a>
          {/* Hidden on phones: there the hero CTA is on the first screen and
              the sticky bar (landing-sticky-cta.tsx) takes over once it
              scrolls away, so a third copy in the header is only noise. */}
          <PrismButton href={CONSOLE_SIGNUP_URL} ctaLocation="lp_navbar" className="max-md:hidden">
            {CTA_LABEL}
          </PrismButton>
        </div>
      </div>
    </header>
  );
}
