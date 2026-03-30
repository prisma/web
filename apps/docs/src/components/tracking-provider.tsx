"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import { getContentArea, getContentSubtype, isPpgOrCompute } from "@/lib/tracking";

export function TrackingProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const area = getContentArea(pathname);
    posthog.register({
      content_area: area,
      is_ppg_or_compute: isPpgOrCompute(area),
      content_subtype: getContentSubtype(pathname),
    });
  }, [pathname]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>(
        'a[href*="console.prisma.io"]',
      );
      if (!anchor) return;

      const url = anchor.href;
      posthog.capture("docs:console_link_click", {
        page_path: pathname,
        destination_url: url,
        has_utm: url.includes("utm_source"),
      });
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname]);

  return null;
}
