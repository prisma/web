(() => {
  const consoleOrigin = "https://console.prisma.io";
  const measurementId = "G-4B72WBX9ET";
  if (window.parent === window) return;
  const seen = new Set();
  let initialized = false;
  let previousConsent = "";
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
    window[`ga-disable-${measurementId}`] = !analytics;
    const signature = `${analytics}:${ads}`;
    if (signature !== previousConsent) {
      previousConsent = signature;
      gtag("consent", "update", {
        analytics_storage: analytics ? "granted" : "denied",
        ad_storage: ads, ad_user_data: ads, ad_personalization: ads,
      });
    }
    if (!analytics) return;
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
    if (!conversion || typeof conversion.id !== "string" || conversion.id.length === 0 || conversion.id.length > 128 ||
        !["sign_up", "login"].includes(conversion.event) || !["google", "github", "email"].includes(conversion.method)) return;
    if (!seen.has(conversion.id)) {
      seen.add(conversion.id);
      gtag("event", conversion.event, { ...parameters, method: conversion.method });
    }
    window.parent.postMessage({ type: "console-analytics-accepted", id: conversion.id }, consoleOrigin);
  });
  window.parent.postMessage({ type: "console-analytics-ready" }, consoleOrigin);
})();
