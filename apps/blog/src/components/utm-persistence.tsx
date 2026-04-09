"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  clearStoredUtmParams,
  CONSOLE_HOST,
  getUtmParams,
  hasUtmParams,
  syncUtmParams,
  writeStoredUtmParams,
} from "@/lib/utm";

export function UtmPersistence() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const currentUtmParams = getUtmParams(
      new URLSearchParams(window.location.search),
    );

    if (hasUtmParams(currentUtmParams)) {
      writeStoredUtmParams(currentUtmParams);
      return;
    }

    clearStoredUtmParams();
  }, [pathname]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) {
        return;
      }

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

      const activeUtmParams = getUtmParams(
        new URLSearchParams(window.location.search),
      );

      if (!hasUtmParams(activeUtmParams)) {
        return;
      }

      const targetUrl = new URL(anchor.href, window.location.href);
      const isInternalLink = targetUrl.origin === window.location.origin;
      const isConsoleLink = targetUrl.hostname === CONSOLE_HOST;

      if (!isInternalLink && !isConsoleLink) {
        return;
      }

      if (!syncUtmParams(targetUrl, activeUtmParams)) {
        return;
      }

      const nextHref = `${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`;
      const isModifiedClick =
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

      if (isInternalLink && anchor.target !== "_blank" && !isModifiedClick) {
        event.preventDefault();
        router.push(nextHref);
        return;
      }

      anchor.setAttribute(
        "href",
        isInternalLink ? nextHref : targetUrl.toString(),
      );
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [router]);

  return null;
}
