"use client";

import { FontAwesomeScript as WebFA } from "@prisma-docs/ui/components/fontawesome-web";
import { useEffect, useState } from "react";
import { getUtmParams, hasUtmParams, type UtmParams } from "@prisma-docs/ui/lib/utm";
import { Header, type NavLink } from "@/components/chrome/Header";

interface NavigationWrapperProps {
  links: NavLink[];
}

// UTM propagation, lifted verbatim out of @prisma-docs/ui's WebNavigation so
// swapping in the blog-local CF header does not change a single outbound URL.
// Outbound links only ever carry UTMs the visitor arrived with — no defaults
// are added (matching the site-wide drop of default console-CTA UTMs).
function buildHref(base: string, utm?: UtmParams) {
  if (!utm) return base;
  const isAbsolute = base.startsWith("http");
  const url = isAbsolute ? new URL(base) : new URL(base, "https://n.co");
  for (const [key, value] of Object.entries(utm)) {
    if (key.startsWith("utm_") && value) {
      url.searchParams.set(key, value);
    }
  }
  return isAbsolute ? url.toString() : `${url.pathname}${url.search}${url.hash}`;
}

function buildConsoleHref(pathname: "/login" | "/sign-up", utm?: UtmParams) {
  if (!utm) return `https://console.prisma.io${pathname}`;

  const href = new URL(`https://console.prisma.io${pathname}`);

  for (const [key, value] of Object.entries(utm)) {
    if (key.startsWith("utm_") && value) {
      href.searchParams.set(key, value);
    }
  }

  return href.toString();
}

export function NavigationWrapper({ links }: NavigationWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentUtmParams: UtmParams = mounted
    ? getUtmParams(new URLSearchParams(window.location.search))
    : {};
  const preserveExactUtm = hasUtmParams(currentUtmParams);
  const utmForLinks = preserveExactUtm ? currentUtmParams : undefined;

  const logoHref = buildHref("https://www.prisma.io", utmForLinks);
  const resolvedLinks = preserveExactUtm
    ? links.map((link) => ({
        ...link,
        url: link.url && !link.external ? buildHref(link.url, utmForLinks) : link.url,
        sub: link.sub?.map((sub) => ({
          ...sub,
          url: sub.external ? sub.url : buildHref(sub.url, utmForLinks),
        })),
      }))
    : links;

  return (
    <>
      {/* The web FontAwesome kit used to ride along with WebNavigation. The
          blog renders `fa-brands` / `fa-regular` glyphs well outside the nav
          (share row, author bios, series markers, CTA arrows), so it stays
          mounted here now that WebNavigation is gone. */}
      <WebFA />
      <Header
        links={resolvedLinks}
        logoHref={logoHref}
        loginHref={buildConsoleHref("/login", utmForLinks)}
        signupHref={buildConsoleHref("/sign-up", utmForLinks)}
      />
    </>
  );
}
