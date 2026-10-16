"use client";

import { useEffect, useState } from "react";
import { PrismButton } from "@/components/brand/prism-button";
import { cn } from "@/lib/utils";
import { CONSOLE_SIGNUP_URL, CTA_LABEL } from "./content";

/** The hero marks its CTA with this id so the bar knows when it has scrolled away. */
export const HERO_CTA_ID = "lp-hero-cta";
/** The closer marks its CTA too, so the bar does not sit on top of it. */
export const CLOSER_CTA_ID = "lp-closer-cta";

// On a phone the hero CTA leaves the screen after the first swipe, and the
// next one is a long scroll away. This bar keeps the same action one tap away
// once the hero CTA is out of view, and hides again when it comes back or when
// the closer's CTA is on screen, so there is never a second button on top of
// one. Hidden from md up, where the floating header already carries the CTA.
// It sits below the consent banner's z-index on purpose.
export function LandingStickyCta({ label = CTA_LABEL }: { label?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById(HERO_CTA_ID);
    if (!hero) return;
    const closer = document.getElementById(CLOSER_CTA_ID);
    const onScreen = new Map<Element, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) onScreen.set(entry.target, entry.isIntersecting);
        const heroAbove = !onScreen.get(hero) && hero.getBoundingClientRect().top < 0;
        setVisible(heroAbove && !(closer && onScreen.get(closer)));
      },
      { threshold: 0 },
    );
    observer.observe(hero);
    if (closer) observer.observe(closer);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-hidden={!visible}
      inert={!visible}
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
