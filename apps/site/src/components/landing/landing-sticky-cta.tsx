"use client";

import { useEffect, useState } from "react";
import { PrismButton } from "@/components/brand/prism-button";
import { cn } from "@/lib/utils";
import { CONSOLE_SIGNUP_URL, CTA_LABEL } from "./content";

/** The hero marks its CTA with this id so the bar knows when it has scrolled away. */
export const HERO_CTA_ID = "lp-hero-cta";

// On a phone the hero CTA leaves the screen after the first swipe, and the
// next one is a long scroll away. This bar keeps the same action one tap away
// once the hero CTA is out of view, and hides again when it comes back. Hidden
// from md up, where the floating header already carries the CTA. It sits below
// the consent banner's z-index on purpose.
export function LandingStickyCta({ label = CTA_LABEL }: { label?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById(HERO_CTA_ID);
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-black/[0.06] bg-white/90 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md transition-transform duration-300 md:hidden",
        visible ? "translate-y-0" : "pointer-events-none translate-y-full",
      )}
    >
      <PrismButton href={CONSOLE_SIGNUP_URL} ctaLocation="lp_sticky" fullWidth>
        {label}
      </PrismButton>
    </div>
  );
}
