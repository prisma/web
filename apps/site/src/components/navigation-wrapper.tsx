"use client";

import { WebNavigation } from "@prisma-docs/ui/components/web-navigation";
import { Footer } from "@prisma-docs/ui/components/footer";
import { FooterNewsletterForm } from "@prisma-docs/ui/components/newsletter";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
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

export function NavigationWrapper({ links }: NavigationWrapperProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentUtmParams: UtmParams = mounted
    ? getUtmParams(new URLSearchParams(window.location.search))
    : {};
  const preserveExactUtm = hasUtmParams(currentUtmParams);

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
      utm={preserveExactUtm ? currentUtmParams : undefined}
      preserveExactUtm={preserveExactUtm}
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

  return (
    <Footer
      color={getButtonVariant()}
      newsletterComponent={<FooterNewsletterForm stacked apiUrl="/api/newsletter" />}
    />
  );
}
