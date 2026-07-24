"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  CONSOLE_HOST,
  getUtmParams,
  mergeUtmAttribution,
  readStoredUtmAttribution,
  syncUtmAttribution,
  writeStoredUtmAttribution,
} from "../lib/utm";

interface UtmPersistenceProps {
  /**
   * The base path this app owns (e.g. "/blog", "/docs").
   * Only paths under this prefix use client-side router.push().
   * Omit for the root app (no basePath).
   */
  basePath?: string;
  /**
   * Paths that are proxied to other apps via server rewrites.
   * These always use full page navigation instead of router.push().
   * Only relevant for the root app (no basePath).
   */
  proxiedPaths?: string[];
  /** Local storage key for persisting first- and last-touch UTM params. */
  storageKey: string;
}

function getActiveAttribution(storageKey: string) {
  const currentUtmParams = getUtmParams(new URLSearchParams(window.location.search));
  const attribution = mergeUtmAttribution(readStoredUtmAttribution(storageKey), currentUtmParams);

  if (attribution && Object.keys(currentUtmParams).length > 0) {
    writeStoredUtmAttribution(storageKey, attribution);
  }

  return attribution;
}

export function UtmPersistence({ basePath, proxiedPaths = [], storageKey }: UtmPersistenceProps) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    getActiveAttribution(storageKey);
  }, [pathname, storageKey]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) {
        return;
      }

      const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>("a[href]");

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

      const attribution = getActiveAttribution(storageKey);
      if (!attribution) {
        return;
      }

      const targetUrl = new URL(anchor.href, window.location.href);
      const isInternalLink = targetUrl.origin === window.location.origin;
      const isConsoleLink = targetUrl.hostname === CONSOLE_HOST;
      const isConsoleRedirect =
        isInternalLink && (targetUrl.pathname === "/login" || targetUrl.pathname === "/sign-up");

      if (!isInternalLink && !isConsoleLink) {
        return;
      }

      if (
        !syncUtmAttribution(targetUrl, attribution, {
          includeFirstTouch: isConsoleLink || isConsoleRedirect,
        })
      ) {
        return;
      }

      const nextHref = `${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`;
      const isModifiedClick = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

      if (isInternalLink && anchor.target !== "_blank" && !isModifiedClick) {
        const canClientRoute = basePath
          ? targetUrl.pathname === basePath || targetUrl.pathname.startsWith(`${basePath}/`)
          : !proxiedPaths.some(
              (p) => targetUrl.pathname === p || targetUrl.pathname.startsWith(`${p}/`),
            );

        if (canClientRoute) {
          const internalPathname = basePath
            ? targetUrl.pathname === basePath
              ? "/"
              : targetUrl.pathname.startsWith(`${basePath}/`)
                ? targetUrl.pathname.slice(basePath.length)
                : targetUrl.pathname
            : targetUrl.pathname;

          event.preventDefault();
          router.push(`${internalPathname}${targetUrl.search}${targetUrl.hash}`);
          return;
        }
      }

      anchor.setAttribute("href", isInternalLink ? nextHref : targetUrl.toString());
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [router, basePath, proxiedPaths, storageKey]);

  return null;
}
