"use client";

import { WebNavigation } from "@prisma-docs/ui/components/web-navigation";
import { Footer } from "@prisma-docs/ui/components/footer";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  getUtmParams,
  readStoredUtmParams,
  type UtmParams,
  writeStoredUtmParams,
} from "@/lib/utm";

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
  };
}

const orm = [
  "/careers",
  "/studio",
  "/events",
  "/newsletter",
  "/typedsql",
  "/partners",
  "/client",
  "/orm",
  "/showcase",
  "/ecosystem",
];
type ColorType = "orm" | "ppg" | undefined;

function getUtmMedium(pathname: string) {
  const slug = pathname.split("?")[0].split("/").filter(Boolean).join("-");

  return slug || "index";
}

export function NavigationWrapper({ links, utm }: NavigationWrapperProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [storedUtmParams, setStoredUtmParams] = useState<UtmParams>({
    utm_source: utm.source,
  });

  useEffect(() => {
    const currentUtmParams = getUtmParams(new URLSearchParams(searchParams.toString()));

    if (currentUtmParams.utm_source) {
      setStoredUtmParams(currentUtmParams);
      writeStoredUtmParams(currentUtmParams);
      return;
    }

    const persistedUtmParams = readStoredUtmParams();
    setStoredUtmParams(
      persistedUtmParams.utm_source
        ? persistedUtmParams
        : { utm_source: utm.source },
    );
  }, [searchParams, utm.source]);

  // Determine button variant based on pathname
  const getButtonVariant = (): ColorType => {
    if (orm.includes(pathname.split("?")[0])) {
      return "orm";
    }
    // Add more conditions here for other pages as needed
    return "ppg"; // default variant
  };

  return (
    <WebNavigation
      links={links}
      utm={{
        source: storedUtmParams.utm_source || utm.source,
        medium: storedUtmParams.utm_medium || getUtmMedium(pathname),
        campaign: storedUtmParams.utm_campaign,
        content: storedUtmParams.utm_content,
        term: storedUtmParams.utm_term,
      }}
      buttonVariant={getButtonVariant()}
    />
  );
}

export function FooterWrapper() {
  const pathname = usePathname();

  // Determine button variant based on pathname
  const getButtonVariant = (): ColorType => {
    if (orm.includes(pathname.split("?")[0])) {
      return "orm";
    }
    // Add more conditions here for other pages as needed
    return "ppg"; // default variant
  };

  return <Footer color={getButtonVariant()} />;
}
