"use client";

import { WebNavigation } from "@prisma-docs/ui/components/web-navigation";
import { useEffect, useState } from "react";
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
  const [mounted, setMounted] = useState(false);
  const defaultUtmParams = {
    utm_source: utm.source,
    utm_medium: utm.medium,
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentUtmParams: UtmParams =
    mounted ? getUtmParams(new URLSearchParams(window.location.search)) : {};
  const preserveExactUtm = hasUtmParams(currentUtmParams);
  const resolvedUtmParams = preserveExactUtm ? currentUtmParams : defaultUtmParams;

  return (
    <WebNavigation
      links={links}
      utm={resolvedUtmParams}
      preserveExactUtm={preserveExactUtm}
    />
  );
}
