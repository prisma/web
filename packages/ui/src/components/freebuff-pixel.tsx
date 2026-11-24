"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getConsentStatus, onConsentChange } from "../lib/consent";
import { FREEBUFF_QUEUE_STUB, loadFreebuffPixel, rememberBfcid } from "../lib/freebuff-pixel";

/**
 * Freebuff ads pixel: the queue stub in `<head>`, and the tag inserted only
 * once CookieYes advertising consent is granted (stored or given live). The
 * `bfcid` of each route is remembered in memory so a grant given after
 * client-side navigation still attributes the visit (see `lib/freebuff-pixel`).
 * A visitor who has not granted advertising consent loads nothing. A later
 * revocation reaches an already loaded tag through the Consent Mode update
 * that the GTM bridge (`google-tag-manager.tsx`) pushes to `dataLayer`: the tag
 * reads it, stops sending, and clears its cookie and retry queue. The tag has
 * no consent command of its own.
 */
export function FreebuffPixel() {
  const pathname = usePathname();

  useEffect(() => {
    rememberBfcid(window.location.search);
  }, [pathname]);

  useEffect(() => {
    const sync = (status: ReturnType<typeof getConsentStatus>) => {
      if (status === "granted") loadFreebuffPixel();
    };
    sync(getConsentStatus("advertisement"));
    return onConsentChange("advertisement", sync);
  }, []);

  return <script id="freebuff-queue" dangerouslySetInnerHTML={{ __html: FREEBUFF_QUEUE_STUB }} />;
}
