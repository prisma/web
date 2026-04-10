"use client";

import { useEffect, useState } from "react";
import { Button, type ButtonProps } from "@prisma/eclipse";
import { getUtmParams, hasUtmParams, type UtmParams } from "@/lib/utm";

interface ConsoleCtaButtonProps extends Omit<ButtonProps, "asChild"> {
  consolePath: "/login" | "/sign-up";
  defaultUtm: UtmParams;
  target?: string;
  rel?: string;
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
  ...props
}: ConsoleCtaButtonProps) {
  const [href, setHref] = useState(() => buildConsoleHref(consolePath, defaultUtm));

  useEffect(() => {
    const currentUtmParams = getUtmParams(
      new URLSearchParams(window.location.search),
    );

    setHref(
      buildConsoleHref(
        consolePath,
        hasUtmParams(currentUtmParams) ? currentUtmParams : defaultUtm,
      ),
    );
  }, [consolePath, defaultUtm]);

  return (
    <Button asChild {...props}>
      <a href={href} target={target} rel={rel}>
        {children}
      </a>
    </Button>
  );
}
