"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  CONSOLE_HOST,
  getUtmParams,
  mergeUtmAttribution,
  readStoredUtmAttribution,
  syncFallbackRef,
  syncUtmAttribution,
  writeStoredUtmAttribution,
} from "../lib/utm";
import { ATTRIBUTION_CHANGE_EVENT, type AttributionChangeDetail } from "../lib/attribution";
import { hasAnalyticsConsent } from "../lib/consent";

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
  /**
   * Builds the `ref` stamped on Console links when the visitor has no stored
   * or current campaign attribution, i.e. organic and direct traffic. Receives
   * the current pathname. Omit it and untagged visitors reach the console with
   * no attribution at all. See `syncFallbackRef` for why this is `ref` and not
   * a `utm_source` default.
   */
  fallbackConsoleRef?: (pathname: string) => string;
}

/**
 * Reads the visitor's first- and last-touch attribution: stored touches merged
 * with whatever campaign params are on the current URL. Persists and announces
 * a touch only when it actually changed, and drops ad click IDs when analytics
 * consent is absent. Returns `undefined` for a visitor with no attribution.
 */
export function getActiveAttribution(storageKey: string) {
  const currentUtmParams = getUtmParams(new URLSearchParams(window.location.search), {
    // Click IDs are advertising identifiers. Without analytics consent nothing
    // downstream records them, so there is no reason to hold one.
    includeClickIds: hasAnalyticsConsent(),
  });
  let stored = readStoredUtmAttribution(storageKey);
  if (stored && !hasAnalyticsConsent()) {
    const previous = stored;
    stored = mergeUtmAttribution(
      undefined,
      getUtmParams(new URLSearchParams(stored.first), { includeClickIds: false }),
      stored.firstSeenAt,
    );
    stored = mergeUtmAttribution(
      stored,
      getUtmParams(new URLSearchParams(previous.last), { includeClickIds: false }),
      previous.lastSeenAt,
    );
    if (stored) writeStoredUtmAttribution(storageKey, stored);
    else {
      try {
        window.localStorage.removeItem(storageKey);
      } catch {
        /* Storage can be unavailable. */
      }
    }
  }
  const attribution = mergeUtmAttribution(stored, currentUtmParams, new Date().toISOString());

  if (!attribution || Object.keys(currentUtmParams).length === 0) {
    return attribution;
  }

  // The same tagged URL is re-read on every route change and every eligible
  // anchor click. Only persist and announce a touch that actually changed
  // something, or ordinary navigation would keep restamping last-touch.
  const isUnchanged =
    stored !== undefined &&
    JSON.stringify(stored.first) === JSON.stringify(attribution.first) &&
    JSON.stringify(stored.last) === JSON.stringify(attribution.last);

  if (isUnchanged) {
    return stored;
  }

  writeStoredUtmAttribution(storageKey, attribution);

  document.dispatchEvent(
    new CustomEvent<AttributionChangeDetail>(ATTRIBUTION_CHANGE_EVENT, {
      detail: { attribution },
    }),
  );

  return attribution;
}

/**
 * Document-level attribution carrier. On every route change it captures campaign
 * params into storage; on every link click it rewrites the target so internal
 * links keep the last touch and Console links also receive the first touch.
 * With `fallbackConsoleRef`, Console links clicked by a visitor with no
 * attribution at all get a `ref` naming the page that sent them.
 */
export function UtmPersistence({
  basePath,
  proxiedPaths = [],
  storageKey,
  fallbackConsoleRef,
}: UtmPersistenceProps) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    getActiveAttribution(storageKey);
    const refresh = () => getActiveAttribution(storageKey);
    document.addEventListener("cookieyes_consent_update", refresh);
    document.addEventListener("cookieyes_banner_load", refresh);
    return () => {
      document.removeEventListener("cookieyes_consent_update", refresh);
      document.removeEventListener("cookieyes_banner_load", refresh);
    };
  }, [pathname, storageKey]);

  useEffect(() => {
    /** Rewrites the clicked anchor's href with attribution before navigation. */
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
      const targetUrl = new URL(anchor.href, window.location.href);
      const isInternalLink = targetUrl.origin === window.location.origin;
      const isConsoleLink = targetUrl.hostname === CONSOLE_HOST;
      const isConsoleRedirect =
        isInternalLink && (targetUrl.pathname === "/login" || targetUrl.pathname === "/sign-up");

      if (!isInternalLink && !isConsoleLink) {
        return;
      }

      const isConsoleBound = isConsoleLink || isConsoleRedirect;

      let updated: boolean;
      if (attribution) {
        updated = syncUtmAttribution(targetUrl, attribution, {
          includeFirstTouch: isConsoleBound,
        });
      } else if (fallbackConsoleRef && isConsoleBound) {
        // No campaign ever touched this visitor, so the only thing the console
        // would learn is nothing. Tell it which page sent them instead.
        updated = syncFallbackRef(targetUrl, fallbackConsoleRef(window.location.pathname));
      } else {
        return;
      }

      if (!updated) {
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
  }, [router, basePath, proxiedPaths, storageKey, fallbackConsoleRef]);

  return null;
}
