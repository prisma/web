/**
 * ChatGPT ads measurement pixel (OpenAI "oaiq").
 *
 * The loader snippet creates the `oaiq` command queue and inits the pixel; the
 * SDK script itself is inserted only with advertising consent. The SDK drains
 * the queue when it loads, so callers never wait for it.
 * Docs: https://developers.openai.com/ads/measurement-pixel
 *
 * Consent: the pixel stores the ad click id (`oppref`) and a browser id in
 * first-party cookies, so it is an advertising cookie. The loader denies
 * consent before `init`; `OpenAiPixel` grants it from the CookieYes
 * "advertisement" category. With consent denied the SDK sends nothing and
 * removes its cookies, and events sent while denied are not replayed.
 *
 * Attribution: ChatGPT ad clicks land with `?oppref=<click id>`. The pixel keeps
 * it in its `__oppref` cookie for 30 days; `lib/utm.ts` also captures it like
 * any other ad click id so it reaches the console and the server-side
 * Conversions API.
 */

/** Pixel id of the "prisma.io website" data source in OpenAI Ads Manager. Public, like the GTM container id. */
export const OPENAI_ADS_PIXEL_ID = "V7u8DWWqnx63arxK1sLzkm";
export const OPENAI_ADS_SDK_URL = "https://bzrcdn.openai.com/sdk/oaiq.min.js";

/** Event data shapes the site sends; OpenAI's full list is in the measurement pixel docs. */
export type OaiqMeasureData =
  | { type: "contents"; amount?: number; currency?: string }
  | { type: "customer_action"; amount?: number; currency?: string };

export type OaiqMeasureOptions = {
  /** Deduplicates against the same event sent through the Conversions API. */
  event_id?: string;
};

/** Events the site sends; the Console relay frame sends `registration_completed`. */
export type OaiqStandardEvent = "page_viewed" | "registration_completed";

type Oaiq = ((...args: unknown[]) => void) & { q?: unknown[] };

declare global {
  interface Window {
    oaiq?: Oaiq;
  }
}

/**
 * The inline loader: creates the `oaiq` command queue and queues `init`, but
 * inserts the SDK script only when CookieYes already holds an advertising
 * grant. Without a stored grant it queues a denial and leaves the SDK
 * uninserted; `loadOpenAiPixelSdk` inserts it once the visitor opts in, so a
 * declined or undecided visitor never requests anything from OpenAI.
 *
 * The stored decision is read from the `cookieyes-consent` cookie because the
 * loader runs before the CookieYes script. A denial followed by a grant a
 * moment later would delete the SDK's click-id cookie, hence the cookie check.
 */
export function buildOpenAiPixelLoader(pixelId: string = OPENAI_ADS_PIXEL_ID): string {
  return (
    `!function(w){if(w.oaiq)return;var q=function(){q.q.push(arguments)};q.q=[];w.oaiq=q}(window);` +
    `!function(){var m=document.cookie.match(/(?:^|; )cookieyes-consent=([^;]*)/);` +
    `var g=!!m&&/(^|,)action:yes(,|$)/.test(m[1])&&/(^|,)advertisement:yes(,|$)/.test(m[1]);` +
    `if(!g)oaiq("consent",false);` +
    `oaiq("init",{pixelId:${JSON.stringify(pixelId)}});` +
    `if(g){var d=document,s=d.createElement("script");s.async=!0;s.src=${JSON.stringify(OPENAI_ADS_SDK_URL)};` +
    `s.setAttribute("data-openai-pixel","");var f=d.getElementsByTagName("script")[0];f.parentNode.insertBefore(s,f)}}();`
  );
}

/** Inserts the SDK script once; call it only after advertising consent is granted. */
export function loadOpenAiPixelSdk(): void {
  if (typeof document === "undefined") return;
  if (document.querySelector("script[data-openai-pixel]")) return;
  const script = document.createElement("script");
  script.async = true;
  script.src = OPENAI_ADS_SDK_URL;
  script.setAttribute("data-openai-pixel", "");
  document.head.appendChild(script);
}

/** Returns false when the loader is not on the page (SSR, test, or not mounted). */
function oaiq(...args: unknown[]): boolean {
  if (typeof window === "undefined" || typeof window.oaiq !== "function") return false;
  window.oaiq(...args);
  return true;
}

export function setOpenAiPixelConsent(granted: boolean): boolean {
  return oaiq("consent", granted);
}

/** Sends one measurement event; a no-op without the loader. */
export function measureOpenAiEvent(
  event: OaiqStandardEvent,
  data: OaiqMeasureData,
  options?: OaiqMeasureOptions,
): boolean {
  return options ? oaiq("measure", event, data, options) : oaiq("measure", event, data);
}
