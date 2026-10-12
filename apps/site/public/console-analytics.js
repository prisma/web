(() => {
  const consoleOrigin = "https://console.prisma.io";
  const measurementId = "G-4B72WBX9ET";
  // ChatGPT ads pixel ("prisma.io website" data source in OpenAI Ads Manager).
  // It runs here, on the prisma.io origin, so the `__oppref` click-id cookie the
  // landing-page pixel wrote is available when the Console reports a signup.
  const openaiPixelId = "V7u8DWWqnx63arxK1sLzkm";
  const openaiSdkUrl = "https://bzrcdn.openai.com/sdk/oaiq.min.js";
  if (window.parent === window) return;
  const seen = new Set();
  const seenOpenai = new Set();
  let initialized = false;
  let openaiLoaded = false;
  let previousConsent = "";
  let previousOpenaiConsent = null;
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
      ["sign_up", "login"].includes(conversion.event) && ["google", "github", "email"].includes(conversion.method)
        ? conversion
        : null;
    const measuredByOpenai = measureOpenaiConversion(consent, validConversion);
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
        gtag("event", validConversion.event, { ...parameters, method: validConversion.method });
      }
    }
    // Acknowledge once a destination has measured (or already holds) the handoff.
    if (validConversion && (analytics || measuredByOpenai)) {
      window.parent.postMessage({ type: "console-analytics-accepted", id: validConversion.id }, consoleOrigin);
    }
  });

  // Loads the OpenAI pixel the first time advertising consent is granted (so it
  // never sees a denial that would delete its click-id cookie), keeps its
  // consent flag in sync afterwards, and reports a completed signup as
  // `registration_completed`. `openaiEventId` is the same id the Console sends
  // through the Conversions API, so OpenAI counts the signup once.
  // Returns true when the pixel measured this signup now or already had it.
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
      window.oaiq("measure", "registration_completed", { type: "customer_action" }, { event_id: eventId });
    }
    return true;
  }

  window.parent.postMessage({ type: "console-analytics-ready" }, consoleOrigin);
})();
