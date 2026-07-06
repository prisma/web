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
 * Records a CTA click as a `cta_click` event in the GTM dataLayer.
 *
 * Safe no-op during SSR or before GTM has initialised (e.g. consent not granted),
 * because `window.dataLayer` will be absent.
 */
export function trackCTA(payload: CtaClickPayload): void {
  if (typeof window === "undefined" || !Array.isArray(window.dataLayer)) return;

  window.dataLayer.push({ event: "cta_click", ...payload });
}
