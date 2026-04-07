"use client";

import { WebNavigation } from "@prisma-docs/ui/components/web-navigation";
import { getUtmParams, hasUtmParams, type UtmParams } from "@/lib/utm";

interface Link {
  text: string;
  external?: boolean;
  url?: string;
  icon?: string;
  desc?: string;
  col?: number;
  sub?: Array<{
    text: string;
    external?: boolean;
    url: string;
    icon?: string;
    desc?: string;
  }>;
}

interface NavigationWrapperProps {
  links: Link[];
  utm: {
    source: string;
    medium: string;
  };
}

export function NavigationWrapper({ links, utm }: NavigationWrapperProps) {
  const defaultUtmParams = {
    utm_source: utm.source,
    utm_medium: utm.medium,
  };
  const currentUtmParams: UtmParams =
    typeof window === "undefined"
      ? {}
      : getUtmParams(new URLSearchParams(window.location.search));
  const hasExactUtm = hasUtmParams(currentUtmParams);
  const resolvedUtmParams = hasExactUtm ? currentUtmParams : defaultUtmParams;

  return (
    <WebNavigation
      links={links}
      utm={resolvedUtmParams}
      preserveExactUtm={hasExactUtm}
    />
  );
}
