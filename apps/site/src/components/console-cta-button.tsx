"use client";

import { useEffect, useState } from "react";
import { Button, type ButtonProps } from "@prisma/eclipse";
import { getUtmParams, hasUtmParams, type UtmParams } from "@prisma-docs/ui/lib/utm";
import { trackCTA } from "@prisma-docs/ui/lib/analytics";

interface ConsoleCtaButtonProps extends Omit<ButtonProps, "asChild"> {
  consolePath: "/login" | "/sign-up";
  defaultUtm: UtmParams;
  target?: string;
  rel?: string;
  /** Where this CTA sits, e.g. "navbar", "hero", "pricing". Sent with the cta_click event. */
  ctaLocation?: string;
  /** Explicit label for the cta_click event; falls back to `children` when it is a string. */
  ctaText?: string;
}

function buildConsoleHref(consolePath: "/login" | "/sign-up", utmParams: UtmParams) {
  const href = new URL(`https://console.prisma.io${consolePath}`);

  for (const [key, value] of Object.entries(utmParams)) {
    if (key.startsWith("utm_") && value) {
      href.searchParams.set(key, value);
    }
  }

  return href.toString();
}

export function ConsoleCtaButton({
  consolePath,
  defaultUtm,
  children,
  target,
  rel,
  ctaLocation,
  ctaText,
  ...props
}: ConsoleCtaButtonProps) {
  const [href, setHref] = useState(() => buildConsoleHref(consolePath, defaultUtm));

  useEffect(() => {
    const currentUtmParams = getUtmParams(new URLSearchParams(window.location.search));

    setHref(
      buildConsoleHref(consolePath, hasUtmParams(currentUtmParams) ? currentUtmParams : defaultUtm),
    );
  }, [consolePath, defaultUtm]);

  return (
    <Button asChild {...props}>
      <a
        href={href}
        target={target}
        rel={rel}
        onClick={() =>
          trackCTA({
            cta_text:
              ctaText ?? (typeof children === "string" ? children : consolePath.replace("/", "")),
            cta_location: ctaLocation ?? "console_cta",
            cta_destination: href,
            section: "website",
          })
        }
      >
        {children}
      </a>
    </Button>
  );
}
