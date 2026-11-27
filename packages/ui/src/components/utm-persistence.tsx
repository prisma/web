"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  CONSOLE_HOST,
  getClickIdParams,
  getUtmParams,
  hasUtmParams,
  mergeUtmAttribution,
  readStoredUtmAttribution,
  syncFallbackRef,
  syncUtmAttribution,
  writeStoredUtmAttribution,
  type UtmAttribution,
  type UtmParams,
} from "../lib/utm";
import { ATTRIBUTION_CHANGE_EVENT, type AttributionChangeDetail } from "../lib/attribution";
import { hasAdvertisingConsent } from "../lib/consent";
import { readExperimentVariants, syncExperimentParams } from "../lib/experiments";
import { captureSourceTouch, syncSourceParams } from "../lib/source.browser";

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
 * Ad click IDs seen on this page session's URLs, held in memory only.
 *
 * Storage follows advertising consent (see `getActiveAttribution`), but the
 * click ID is a query parameter the visitor already carries, not a cookie, so
 * it is still forwarded on the Console hand-off. The Console keeps it in its
 * own signed cookie and reports it to the ad platform only when the visitor has
 * granted advertising consent at sign-up. Without this, a visitor who signs up
 * before answering the cookie banner reaches the Console with campaign tags but
 * no click ID, and the ad platform can never match the sign-up to the click.
 */
let sessionClickIds: UtmParams = {};

/** Forgets the click IDs seen in this page session. For tests. */
export function resetSessionClickIds() {
  sessionClickIds = {};
}

function withSessionClickIds(attribution: UtmAttribution | undefined) {
  if (!hasUtmParams(sessionClickIds)) {
    return attribution;
  }

  const last = { ...attribution?.last, ...sessionClickIds };
  return attribution ? { ...attribution, last } : { first: {}, last };
}

/**
 * Reads the visitor's first- and last-touch attribution: stored touches merged
 * with whatever campaign params are on the current URL. Persists and announces
 * a touch only when it actually changed, and keeps ad click IDs out of storage
 * when advertising consent is absent. The returned attribution still carries
 * the click IDs seen in this page session (`sessionClickIds`) so the Console
 * hand-off has them. Returns `undefined` for a visitor with no attribution.
 */
export function getActiveAttribution(storageKey: string) {
  const searchParams = new URLSearchParams(window.location.search);
  // A tagged URL is a new touch and brings its own click IDs, or none, so an
  // earlier click never rides along on a later campaign. An untagged URL (a
  // soft navigation that dropped the query) keeps the touch that is in flight.
  if (hasUtmParams(getUtmParams(searchParams))) {
    sessionClickIds = getClickIdParams(searchParams);
  }
  return withSessionClickIds(getStoredAttribution(storageKey, searchParams));
}

function getStoredAttribution(storageKey: string, searchParams: URLSearchParams) {
  // Click IDs are advertising identifiers, so what is persisted follows the
  // CookieYes advertisement category, the same gate as the ad pixels.
  const includeClickIds = hasAdvertisingConsent();
  const currentUtmParams = getUtmParams(searchParams, { includeClickIds });
  let stored = readStoredUtmAttribution(storageKey);
  if (stored && !includeClickIds) {
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

interface ConsoleLinkOptions {
  storageKey: string;
  fallbackConsoleRef?: (pathname: string) => string;
}

function closestAnchor(event: Event) {
  return (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>("a[href]") ?? null;
}

/**
 * Rewrites a Console-bound anchor's URL with attribution: the campaign tags (or
 * the `ref` fallback), the experiment variants and the classified source.
 * Returns the rewritten URL when something changed, or `undefined` when the
 * anchor is not Console-bound or already carries everything.
 */
export function decorateConsoleAnchor(
  anchor: HTMLAnchorElement,
  { storageKey, fallbackConsoleRef }: ConsoleLinkOptions,
) {
  const href = anchor.getAttribute("href");

  if (
    !href ||
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    anchor.hasAttribute("download")
  ) {
    return undefined;
  }

  const attribution = getActiveAttribution(storageKey);
  const targetUrl = new URL(anchor.href, window.location.href);
  const isInternalLink = targetUrl.origin === window.location.origin;
  const isConsoleLink = targetUrl.hostname === CONSOLE_HOST;
  const isConsoleRedirect =
    isInternalLink && (targetUrl.pathname === "/login" || targetUrl.pathname === "/sign-up");

  if (!isConsoleLink && !isConsoleRedirect) {
    return undefined;
  }

  let updated = false;
  if (attribution) {
    updated = syncUtmAttribution(targetUrl, attribution, { includeFirstTouch: true });
  } else if (fallbackConsoleRef) {
    // No campaign ever touched this visitor, so the only thing the console
    // would learn is nothing. Tell it which page sent them instead.
    updated = syncFallbackRef(targetUrl, fallbackConsoleRef(window.location.pathname));
  }
  // The experiment variants the visitor saw go along with or without a
  // campaign, so the signup counts toward the page version they saw.
  updated = syncExperimentParams(targetUrl, readExperimentVariants()) || updated;
  // The classified source goes along with or without a campaign. It is added
  // after the ref fallback, which skips links that carry any `first_` key.
  updated = syncSourceParams(targetUrl, captureSourceTouch()) || updated;

  return updated ? { targetUrl, isInternalLink } : undefined;
}

/** Events that can open a link without a primary click. */
export const OPEN_ELSEWHERE_EVENTS = ["mousedown", "auxclick", "contextmenu"] as const;

/**
 * Middle-click, right-click "Open in new tab" and a long press open a link
 * without a primary click, so the href is decorated before the browser reads
 * it. The primary click stays with the click handler, which may route it.
 */
export function decorateBeforeOpenElsewhere(event: MouseEvent, options: ConsoleLinkOptions) {
  if (event.type !== "contextmenu" && event.button === 0) return;
  const anchor = closestAnchor(event);
  const decorated = anchor && decorateConsoleAnchor(anchor, options);
  if (!anchor || !decorated) return;
  const { targetUrl, isInternalLink } = decorated;
  anchor.setAttribute(
    "href",
    isInternalLink
      ? `${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`
      : targetUrl.toString(),
  );
}

/**
 * Captures campaign parameters in storage and forwards them only at the Console
 * handoff. Ordinary links retain their authored URLs so copied docs links do not
 * replay another visitor's campaign.
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
    captureSourceTouch();
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

      const anchor = closestAnchor(event);
      const decorated = anchor && decorateConsoleAnchor(anchor, { storageKey, fallbackConsoleRef });

      if (!anchor || !decorated) {
        return;
      }

      const { targetUrl, isInternalLink } = decorated;
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

    const handleOpenElsewhere = (event: MouseEvent) =>
      decorateBeforeOpenElsewhere(event, { storageKey, fallbackConsoleRef });

    document.addEventListener("click", handleClick, true);
    for (const type of OPEN_ELSEWHERE_EVENTS) {
      document.addEventListener(type, handleOpenElsewhere, true);
    }
    return () => {
      document.removeEventListener("click", handleClick, true);
      for (const type of OPEN_ELSEWHERE_EVENTS) {
        document.removeEventListener(type, handleOpenElsewhere, true);
      }
    };
  }, [router, basePath, proxiedPaths, storageKey, fallbackConsoleRef]);

  return null;
}
