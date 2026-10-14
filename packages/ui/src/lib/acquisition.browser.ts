import {
  type AcquisitionTouch,
  acquisitionAtSignup,
  acquisitionCookieHeader,
  acquisitionEventProperties,
  mergeAcquisition,
  observeAcquisition,
  readAcquisitionCookie,
} from "./acquisition";

let entry: { referrer: string; hasCampaign: boolean; now: number } | undefined;

/** One document entry, reused after consent and SPA navigation without restamping. */
export function captureBrowserAcquisition(
  surface: AcquisitionTouch[`surface`],
  analyticsConsent: boolean,
): Record<string, string | number> {
  if (
    typeof document === `undefined` ||
    typeof window === `undefined` ||
    window.top !== window.self
  )
    return {};
  try {
    entry ??= {
      referrer: document.referrer,
      hasCampaign: Array.from(new URLSearchParams(window.location.search)).some(
        ([key, value]) =>
          Boolean(value) &&
          (key.startsWith(`utm_`) ||
            [
              `gclid`,
              `wbraid`,
              `gbraid`,
              `oppref`,
              `msclkid`,
              `fbclid`,
              `li_fat_id`,
              `twclid`,
              `ttclid`,
            ].includes(key)),
      ),
      now: Date.now(),
    };
    const snapshot = analyticsConsent
      ? mergeAcquisition(
          readAcquisitionCookie(document.cookie),
          observeAcquisition({ ...entry, surface, captureMethod: `browser` }),
        )
      : acquisitionAtSignup(undefined, false, surface);
    const cookie = acquisitionCookieHeader(
      analyticsConsent ? snapshot : undefined,
      window.location.hostname,
    );
    // Synchronous for navigation and browsers without Cookie Store.
    if (cookie) document.cookie = cookie;
    return acquisitionEventProperties(acquisitionAtSignup(snapshot, true, surface));
  } catch {
    return acquisitionEventProperties(acquisitionAtSignup(undefined, false, surface));
  }
}
