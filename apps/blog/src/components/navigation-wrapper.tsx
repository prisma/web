"use client";

import { WebNavigation } from "@prisma-docs/ui/components/web-navigation";
import { useEffect, useState } from "react";
import { getUtmParams, hasUtmParams, type UtmParams } from "@prisma-docs/ui/lib/utm";

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

  return (
    <WebNavigation
      links={links}
      utm={preserveExactUtm ? currentUtmParams : undefined}
      preserveExactUtm={preserveExactUtm}
    />
  );
}
