"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  getUtmParams,
  hasUtmParams,
  mergeUtmParams,
  readStoredUtmParams,
  writeStoredUtmParams,
} from "@/lib/utm";

export function UtmPersistence() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const currentUtmParams = getUtmParams(new URLSearchParams(searchParams.toString()));

    if (hasUtmParams(currentUtmParams)) {
      writeStoredUtmParams(currentUtmParams);
      return;
    }

    const storedUtmParams = readStoredUtmParams();

    if (!hasUtmParams(storedUtmParams)) {
      return;
    }

    const currentUrl = new URL(window.location.href);

    if (!mergeUtmParams(currentUrl, storedUtmParams)) {
      return;
    }

    window.history.replaceState(
      window.history.state,
      "",
      `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`,
    );
  }, [pathname, searchParams]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>(
        "a[href]",
      );

      if (!anchor) {
        return;
      }

      const href = anchor.getAttribute("href");

      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download")
      ) {
        return;
      }

      const storedUtmParams = readStoredUtmParams();

      if (!hasUtmParams(storedUtmParams)) {
        return;
      }

      const targetUrl = new URL(anchor.href, window.location.href);

      if (targetUrl.origin !== window.location.origin) {
        return;
      }

      if (!mergeUtmParams(targetUrl, storedUtmParams)) {
        return;
      }

      anchor.setAttribute(
        "href",
        `${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`,
      );
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
