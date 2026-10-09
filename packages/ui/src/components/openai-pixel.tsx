"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { getConsentStatus, onConsentChange } from "../lib/consent";
import {
  buildOpenAiPixelLoader,
  loadOpenAiPixelSdk,
  measureOpenAiEvent,
  OPENAI_ADS_PIXEL_ID,
  setOpenAiPixelConsent,
} from "../lib/openai-pixel";

interface OpenAiPixelProps {
  pixelId?: string;
}

/**
 * ChatGPT ads pixel: command queue in `<head>`, the SDK inserted only once
 * CookieYes advertising consent exists, and a `page_viewed` per route (the
 * SDK sends none by itself). A page view that happened while consent was
 * still pending is sent once the visitor opts in, because the SDK does not
 * replay denied events.
 *
 * "pending" is never pushed to the SDK: the loader already denied consent
 * when no grant was stored, and pushing a denial here would clear the SDK's
 * click-id cookie before CookieYes restores a returning visitor's grant.
 */
export function OpenAiPixel({ pixelId = OPENAI_ADS_PIXEL_ID }: OpenAiPixelProps) {
  const pathname = usePathname();
  const viewedPathname = useRef<string | null>(null);

  useEffect(() => {
    const sync = (status: ReturnType<typeof getConsentStatus>) => {
      if (status === "pending") return;
      const granted = status === "granted";
      if (granted) loadOpenAiPixelSdk();
      setOpenAiPixelConsent(granted);
      if (!granted || viewedPathname.current === pathname) return;
      viewedPathname.current = pathname;
      measureOpenAiEvent("page_viewed", { type: "contents" });
    };

    sync(getConsentStatus("advertisement"));
    return onConsentChange("advertisement", sync);
  }, [pathname]);

  return (
    <script
      id="openai-ads-pixel"
      // The loader is a static snippet with a JSON-encoded pixel id.
      dangerouslySetInnerHTML={{ __html: buildOpenAiPixelLoader(pixelId) }}
    />
  );
}
