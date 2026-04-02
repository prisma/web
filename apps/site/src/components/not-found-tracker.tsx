"use client";

import posthog from "posthog-js";
import { useEffect } from "react";

export function NotFoundTracker() {
  useEffect(() => {
    posthog.capture("site:404_not_found", {
      $current_url: window.location.href,
      pathname: window.location.pathname,
    });
  }, []);

  return null;
}
