/**
 * Freebuff ads pixel.
 *
 * The queue stub is rendered in `<head>` on every page and only queues calls
 * locally; the tag script itself is inserted only once CookieYes holds an
 * advertising grant, because the pixel stores the signed `bfcid` click id from
 * a Freebuff ad landing URL. It needs no API key: the `t` value in the tag URL
 * is the public site tag, like the GTM container id.
 *
 * Attribution: the pixel reads `bfcid` from the page URL itself. next.config
 * redirects and `proxy.ts` keep the query, but a client-side navigation drops
 * it, so a visitor who lands with a `bfcid`, browses, and only then grants
 * consent would load the pixel on a URL without it. The id seen in this page
 * session is therefore held in memory (never in storage, as for the other ad
 * click ids in `components/utm-persistence.tsx`) and put back on the current
 * URL right before the tag loads.
 *
 * Conversions: signups are reported from the Console relay frame
 * (`apps/site/public/console-analytics.js`), which loads the same tag.
 */

export const FREEBUFF_TAG_SRC =
  "https://freebuff.com/freebuff-tag.v2.js?t=fbt_xr5SWt5bTx2J5xzmgUW5uQ";

/** Freebuff's queue stub, verbatim. It must run before the async tag script. */
export const FREEBUFF_QUEUE_STUB =
  "window.freebuff=window.freebuff||function(){(window.freebuff.q=window.freebuff.q||[]).push(arguments)}";

export const BFCID_PARAM = "bfcid";

type Freebuff = ((...args: unknown[]) => void) & { q?: unknown[] };

declare global {
  interface Window {
    freebuff?: Freebuff;
  }
}

/** The `bfcid` seen on this page session's URLs, held in memory only. */
let sessionBfcid: string | null = null;

/** Forgets the remembered `bfcid`. For tests. */
export function resetSessionBfcid() {
  sessionBfcid = null;
}

/** Remembers the `bfcid` on `search`, if any; a URL without one keeps the earlier id. */
export function rememberBfcid(search: string): void {
  const value = new URLSearchParams(search).get(BFCID_PARAM);
  if (value) sessionBfcid = value;
}

/**
 * Returns `href` with the remembered `bfcid` added when it carries none, or
 * null when nothing needs to change.
 */
export function withSessionBfcid(href: string): string | null {
  if (!sessionBfcid) return null;
  const url = new URL(href);
  if (url.searchParams.has(BFCID_PARAM)) return null;
  url.searchParams.set(BFCID_PARAM, sessionBfcid);
  return url.href;
}

/**
 * Inserts the tag once, after the queue stub. Call it only with advertising
 * consent. Restores the session's `bfcid` on the current URL first so the
 * pixel captures it even after client-side navigation.
 */
export function loadFreebuffPixel(): boolean {
  if (typeof document === "undefined") return false;
  if (document.querySelector("script[data-freebuff-pixel]")) return false;

  rememberBfcid(window.location.search);
  const restored = withSessionBfcid(window.location.href);
  if (restored) window.history.replaceState(window.history.state, "", restored);

  // Same queue as FREEBUFF_QUEUE_STUB, for a page where the stub did not render.
  if (typeof window.freebuff !== "function") {
    const queue: Freebuff = (...args: unknown[]) => {
      (queue.q = queue.q || []).push(args);
    };
    window.freebuff = queue;
  }
  const script = document.createElement("script");
  script.async = true;
  script.src = FREEBUFF_TAG_SRC;
  script.setAttribute("data-freebuff-pixel", "");
  document.head.appendChild(script);
  return true;
}
