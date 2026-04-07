"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  CONSOLE_HOST,
  getUtmParams,
  hasUtmParams,
  mergeUtmParams,
  readStoredUtmParams,
  replaceUtmParams,
  writeStoredUtmParams,
} from "@/lib/utm";

export function UtmPersistence() {
  const pathname = usePathname();

  useEffect(() => {
    const currentUtmParams = getUtmParams(
      new URLSearchParams(window.location.search),
    );

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
  }, [pathname]);

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
        anchor.hasAttribute("download")
      ) {
        return;
      }

      const storedUtmParams = readStoredUtmParams();

      if (!hasUtmParams(storedUtmParams)) {
        return;
      }

      const targetUrl = new URL(anchor.href, window.location.href);
      const isInternalLink = targetUrl.origin === window.location.origin;
      const isConsoleLink = targetUrl.hostname === CONSOLE_HOST;

      if (!isInternalLink && !isConsoleLink) {
        return;
      }

      const updated = isConsoleLink
        ? replaceUtmParams(targetUrl, storedUtmParams)
        : mergeUtmParams(targetUrl, storedUtmParams);

      if (!updated) {
        return;
      }

      anchor.setAttribute(
        "href",
        isInternalLink
          ? `${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`
          : targetUrl.toString(),
      );
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
