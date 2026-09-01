import type { UtmAttribution, UtmParams } from "./utm";

/**
 * Paid-acquisition attribution, shaped for PostHog person properties.
 *
 * Purchases can happen months after the ad click — far outside any ad
 * platform's conversion window — so paid attribution has to live on the person,
 * not on a conversion event. These properties ride along with the PostHog
 * person from the anonymous marketing-site visit through signup on the console
 * and every later event, including a server-side `purchase`.
 *
 * GDPR note: this only ever runs behind PostHog's own consent gate (PostHog is
 * initialised opted-out and only opts in on CookieYes analytics consent), so
 * declining analytics means none of this is recorded. Coverage is therefore
 * bounded by the analytics opt-in rate — it is not, and cannot be, 100%.
 */

/** Click-ID param name → the paid source it identifies. */
const CLICK_ID_SOURCES: Record<string, string> = {
  gclid: "google_ads",
  wbraid: "google_ads",
  gbraid: "google_ads",
  msclkid: "microsoft_ads",
  fbclid: "meta_ads",
  li_fat_id: "linkedin_ads",
  twclid: "x_ads",
  ttclid: "tiktok_ads",
};

/** `utm_medium` values that mean the visit was paid for. */
const PAID_MEDIUMS = new Set(["cpc", "ppc", "paid", "paidsocial", "paid_social", "display"]);

export type PaidTouch = {
  /** Normalised platform, e.g. "google_ads", or the utm_source for UTM-tagged paid traffic. */
  source: string;
  /** The click-ID param name that identified it, when there was one. */
  clickIdParam?: string;
  /** The click-ID value, when there was one. */
  clickId?: string;
  campaign?: string;
  medium?: string;
  utmSource?: string;
};

/**
 * Classifies a single set of params as a paid touch, or `undefined` if the
 * visit shows no sign of being paid for.
 *
 * A click ID is decisive on its own — Google auto-tagging appends `gclid` and
 * no UTM params at all, so requiring UTMs would miss most paid traffic.
 */
export function classifyPaidTouch(params: UtmParams): PaidTouch | undefined {
  for (const [param, source] of Object.entries(CLICK_ID_SOURCES)) {
    const clickId = params[param];
    if (clickId) {
      return {
        source,
        clickIdParam: param,
        clickId,
        campaign: params.utm_campaign,
        medium: params.utm_medium,
        utmSource: params.utm_source,
      };
    }
  }

  const medium = params.utm_medium?.toLowerCase();
  if (medium && PAID_MEDIUMS.has(medium) && params.utm_source) {
    return {
      source: params.utm_source,
      campaign: params.utm_campaign,
      medium: params.utm_medium,
      utmSource: params.utm_source,
    };
  }

  return undefined;
}

export type PaidPersonProperties = {
  /** Written with `$set_once` — the first paid touch must never be overwritten. */
  setOnce: Record<string, string | boolean>;
  /** Written with `$set` — most recent paid touch. */
  set: Record<string, string>;
};

function omitUndefined(input: Record<string, string | boolean | undefined>) {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined),
  ) as Record<string, string | boolean>;
}

/**
 * Maps stored first/last-touch attribution to PostHog person properties.
 *
 * Returns `undefined` when neither touch was paid, so organic visitors never
 * get paid properties written to them.
 *
 * @param now ISO timestamp for the touch. Injected so callers can keep this
 *   deterministic in tests.
 */
export function getPaidPersonProperties(
  attribution: UtmAttribution | undefined,
  now: string,
): PaidPersonProperties | undefined {
  if (!attribution) {
    return undefined;
  }

  const first = classifyPaidTouch(attribution.first);
  const last = classifyPaidTouch(attribution.last);

  if (!first && !last) {
    return undefined;
  }

  const setOnce = omitUndefined({
    is_paid_acquired: true,
    first_paid_at: now,
    first_paid_source: first?.source,
    first_paid_campaign: first?.campaign,
    first_paid_medium: first?.medium,
    first_paid_click_id: first?.clickId,
    first_paid_click_id_param: first?.clickIdParam,
  });

  const set = omitUndefined({
    last_paid_at: now,
    last_paid_source: last?.source,
    last_paid_campaign: last?.campaign,
    last_paid_medium: last?.medium,
    last_paid_click_id: last?.clickId,
    last_paid_click_id_param: last?.clickIdParam,
  }) as Record<string, string>;

  return { setOnce, set };
}

/** Event dispatched on `document` whenever stored attribution changes. */
export const ATTRIBUTION_CHANGE_EVENT = "prisma_attribution_change";

export type AttributionChangeDetail = { attribution: UtmAttribution };

/**
 * Subscribes to attribution changes emitted by `UtmPersistence`.
 *
 * Kept as a DOM event so `@prisma-docs/ui` does not need to depend on
 * `posthog-js`; each app wires this to its own already-initialised client.
 *
 * Returns an unsubscribe function. Safe no-op during SSR.
 */
export function onAttributionChange(onChange: (attribution: UtmAttribution) => void): () => void {
  if (typeof document === "undefined") {
    return () => {};
  }

  const handler = (event: Event) => {
    const detail = (event as CustomEvent<AttributionChangeDetail>).detail;
    if (detail?.attribution) {
      onChange(detail.attribution);
    }
  };

  document.addEventListener(ATTRIBUTION_CHANGE_EVENT, handler);
  return () => document.removeEventListener(ATTRIBUTION_CHANGE_EVENT, handler);
}
