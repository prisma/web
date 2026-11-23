(() => {
  const consoleOrigin = "https://console.prisma.io";
  const measurementId = "G-4B72WBX9ET";
  // ChatGPT ads pixel ("prisma.io website" data source in OpenAI Ads Manager).
  // It runs here, on the prisma.io origin, so the `__oppref` click-id cookie the
  // landing-page pixel wrote is available when the Console reports a signup.
  const openaiPixelId = "V7u8DWWqnx63arxK1sLzkm";
  const openaiSdkUrl = "https://bzrcdn.openai.com/sdk/oaiq.min.js";
  // Freebuff ads pixel. Same site tag as the landing pages
  // (packages/ui/src/lib/freebuff-pixel.ts); on this prisma.io origin it can
  // read the `bfcid` the landing-page pixel stored. Public, no API key.
  const freebuffTagUrl = "https://freebuff.com/freebuff-tag.v2.js?t=fbt_xr5SWt5bTx2J5xzmgUW5uQ";
  if (window.parent === window) return;
  const seen = new Set();
  const seenOpenai = new Set();
  const seenFreebuff = new Set();
  let initialized = false;
  let openaiLoaded = false;
  let freebuffLoaded = false;
  let previousConsent = "";
  let previousOpenaiConsent = null;
  let openaiExternalId = null;
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag("consent", "default", {
    analytics_storage: "denied", ad_storage: "denied",
    ad_user_data: "denied", ad_personalization: "denied",
  });
  gtag("set", "ads_data_redaction", true);

  window.addEventListener("message", (message) => {
    if (message.origin !== consoleOrigin || message.source !== window.parent || message.data?.type !== "console-analytics") return;
    const { consent, attribution, conversion } = message.data;
    const analytics = consent?.decided === true && consent?.analytics === true;
    const ads = analytics && consent?.advertisement === true ? "granted" : "denied";
    // One validation for both destinations: an invalid handoff is neither measured nor acknowledged.
    const validConversion =
      conversion && typeof conversion.id === "string" && conversion.id.length > 0 && conversion.id.length <= 128 &&
      (conversion.event === "project_created" ||
        (["sign_up", "login"].includes(conversion.event) && ["google", "github", "email"].includes(conversion.method)))
        ? conversion
        : null;
    const measuredByOpenai = measureOpenaiConversion(consent, validConversion);
    const measuredByFreebuff = measureFreebuffConversion(consent, validConversion);
    window[`ga-disable-${measurementId}`] = !analytics;
    const signature = `${analytics}:${ads}`;
    if (signature !== previousConsent) {
      previousConsent = signature;
      gtag("consent", "update", {
        analytics_storage: analytics ? "granted" : "denied",
        ad_storage: ads, ad_user_data: ads, ad_personalization: ads,
      });
    }
    if (analytics) {
      const parameters = {
        send_to: measurementId, page_location: `${consoleOrigin}/`,
        page_referrer: "", page_title: "Prisma Console",
      };
      const campaignFields = {
        utm_source: "campaign_source", utm_medium: "campaign_medium",
        utm_campaign: "campaign_name", utm_term: "campaign_term", utm_content: "campaign_content",
      };
      for (const [key, field] of Object.entries(campaignFields)) {
        const value = attribution?.[key];
        if (typeof value === "string" && value.length <= 2048) parameters[field] = value;
      }
      if (ads === "granted") {
        const url = new URL(parameters.page_location);
        for (const key of ["gclid", "dclid", "gbraid", "wbraid"]) {
          const value = attribution?.[key];
          if (typeof value === "string" && /^[A-Za-z0-9_-]{1,2048}$/.test(value)) url.searchParams.set(key, value);
        }
        parameters.page_location = url.href;
      }
      if (!initialized) {
        initialized = true;
        gtag("js", new Date());
        gtag("config", measurementId, { ...parameters, send_page_view: false, cookie_domain: "auto" });
        const script = document.createElement("script");
        script.async = true;
        script.referrerPolicy = "origin";
        script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        document.head.appendChild(script);
      }
      if (validConversion && !seen.has(validConversion.id)) {
        seen.add(validConversion.id);
        const eventParameters = { ...parameters };
        if (validConversion.event !== "project_created") eventParameters.method = validConversion.method;
        gtag("event", validConversion.event, eventParameters);
      }
    }
    // Acknowledge once a destination has measured (or already holds) the handoff.
    if (validConversion && (analytics || measuredByOpenai || measuredByFreebuff)) {
      window.parent.postMessage({ type: "console-analytics-accepted", id: validConversion.id }, consoleOrigin);
    }
  });

  // Loads the OpenAI pixel the first time advertising consent is granted (so it
  // never sees a denial that would delete its click-id cookie), keeps its
  // consent flag in sync afterwards, and reports a completed signup as
  // `registration_completed`. `openaiEventId` is the same id the Console sends
  // through the Conversions API, so OpenAI counts the signup once, and
  // `openaiExternalId` is the same hashed user id that report carries as its
  // customer identifier, so OpenAI can match the browser copy to the click.
  // Returns true when the pixel measured this signup now or already had it,
  // or left it to the Conversions API report (see the identifier note below).
  function measureOpenaiConversion(consent, conversion) {
    const granted = consent?.decided === true && consent?.advertisement === true;
    if (!granted && !openaiLoaded) return false;
    if (!openaiLoaded) {
      openaiLoaded = true;
      previousOpenaiConsent = true;
      const queue = function () { queue.q.push(arguments); };
      queue.q = [];
      window.oaiq = window.oaiq || queue;
      window.oaiq("init", { pixelId: openaiPixelId });
      const script = document.createElement("script");
      script.async = true;
      script.src = openaiSdkUrl;
      document.head.appendChild(script);
    }
    if (previousOpenaiConsent !== granted) {
      previousOpenaiConsent = granted;
      window.oaiq("consent", granted);
    }
    if (!granted || !conversion || conversion.event !== "sign_up") return false;
    const eventId = conversion.openaiEventId;
    if (typeof eventId !== "string" || !/^[A-Za-z0-9_:-]{1,128}$/.test(eventId)) return false;
    if (!seenOpenai.has(eventId)) {
      seenOpenai.add(eventId);
      // The SDK takes identifiers through `init` only; a repeat `init` on the
      // same pixel updates its user data for the events measured afterwards.
      const externalId = conversion.openaiExternalId;
      const identified = typeof externalId === "string" && /^[0-9a-f]{64}$/.test(externalId);
      // The SDK documents no way to clear user data once it is set. A signup
      // without a valid identifier that follows an identified one would be
      // measured under the earlier user, so the frame leaves it to the
      // Console's Conversions API report, which carries the same event id.
      if (!identified && openaiExternalId !== null) return true;
      if (identified && externalId !== openaiExternalId) {
        openaiExternalId = externalId;
        window.oaiq("init", { pixelId: openaiPixelId, user: { external_id_sha256: externalId } });
      }
      window.oaiq("measure", "registration_completed", { type: "customer_action" }, { event_id: eventId });
    }
    return true;
  }

  // Loads the Freebuff pixel the first time advertising consent is granted and
  // reports a completed signup as `signup_completed`. Only `sign_up` counts: a
  // login is not an account creation, and the Console reports no trial,
  // subscription, or installation here. The handoff id is the random id the
  // Console gives each authentication handoff and reuses on its retries and
  // replays, so the namespaced eventId lets Freebuff collapse a repeated report.
  // Nothing reports signups to Freebuff server-side, so this is the only report.
  function measureFreebuffConversion(consent, conversion) {
    const granted = consent?.decided === true && consent?.advertisement === true;
    if (!granted) return false;
    if (!freebuffLoaded) {
      freebuffLoaded = true;
      window.freebuff = window.freebuff || function () { (window.freebuff.q = window.freebuff.q || []).push(arguments); };
      const script = document.createElement("script");
      script.async = true;
      script.src = freebuffTagUrl;
      document.head.appendChild(script);
    }
    if (!conversion || conversion.event !== "sign_up") return false;
    const eventId = `signup_completed:${conversion.id}`;
    if (!seenFreebuff.has(eventId)) {
      seenFreebuff.add(eventId);
      window.freebuff("conversion", "signup_completed", { eventId });
    }
    return true;
  }

  window.parent.postMessage({ type: "console-analytics-ready" }, consoleOrigin);
})();
