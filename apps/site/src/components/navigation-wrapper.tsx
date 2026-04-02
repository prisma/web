"use client";

import { WebNavigation } from "@prisma-docs/ui/components/web-navigation";
import { Footer } from "@prisma-docs/ui/components/footer";
import { usePathname } from "next/navigation";

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
    source: "website";
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
];
type ColorType = "orm" | "ppg" | undefined;

function getUtmMedium(pathname: string) {
  const slug = pathname
    .split("?")[0]
    .split("/")
    .filter(Boolean)
    .join("-");

  return slug || "index";
}

export function NavigationWrapper({ links, utm }: NavigationWrapperProps) {
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
    <WebNavigation
      links={links}
      utm={{ source: utm.source, medium: getUtmMedium(pathname) }}
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
