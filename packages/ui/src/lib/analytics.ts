/**
 * Client-side analytics helpers.
 *
 * Events are pushed to the Google Tag Manager `dataLayer`. GTM itself is loaded
 * consent-gated (see `components/google-tag-manager.tsx`), so when the visitor has
 * not granted analytics consent there is no `dataLayer` consumer and these pushes
 * are inert — nothing leaves the browser.
 */

/** The public prisma.io zones tracked under one GA4 property. */
export type SiteSection = "website" | "blog" | "docs";

export type CtaClickPayload = {
  /** Visible label of the CTA, e.g. "Try Prisma". */
  cta_text: string;
  /** Where the CTA lives, e.g. "blog_post_footer", "navbar", "hero". */
  cta_location: string;
  /** Resolved destination href. */
  cta_destination: string;
  /** Overrides the page-level `site_section` for this event if provided. */
  section?: SiteSection;
};

type DataLayerObject = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: DataLayerObject[];
  }
}

/**
 * DOM event dispatched on `document` for every CTA click, consent or not.
 *
 * The GTM push above is inert without analytics consent, so a product
 * analytics client that counts consent-less visitors (PostHog in cookieless
 * mode) would otherwise never see the click. Kept as a DOM event so this
 * package does not depend on `posthog-js`; each app wires it to its own
 * client, the same way `lib/attribution.ts` announces attribution changes.
 */
export const CTA_CLICK_EVENT = "prisma_cta_click";

/**
 * Records a CTA click: a `cta_click` event in the GTM dataLayer when GTM is
 * loaded, and a `CTA_CLICK_EVENT` DOM event always.
 *
 * Safe no-op during SSR. The dataLayer push is skipped before GTM has
 * initialised (e.g. consent not granted), because `window.dataLayer` will be
 * absent.
 */
export function trackCTA(payload: CtaClickPayload): void {
  if (typeof window === "undefined") return;

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: "cta_click", ...payload });
  }

  if (typeof document !== "undefined" && typeof CustomEvent === "function") {
    document.dispatchEvent(new CustomEvent<CtaClickPayload>(CTA_CLICK_EVENT, { detail: payload }));
  }
}

/**
 * Subscribes to CTA clicks announced by `trackCTA`. Returns an unsubscribe
 * function. Safe no-op during SSR.
 */
export function onCtaClick(onClick: (payload: CtaClickPayload) => void): () => void {
  if (typeof document === "undefined") {
    return () => {};
  }

  const handler = (event: Event) => {
    const detail = (event as CustomEvent<CtaClickPayload>).detail;
    if (detail?.cta_location) {
      onClick(detail);
    }
  };

  document.addEventListener(CTA_CLICK_EVENT, handler);
  return () => document.removeEventListener(CTA_CLICK_EVENT, handler);
}
