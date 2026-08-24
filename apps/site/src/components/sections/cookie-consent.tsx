"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CookieConsent() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background shadow-lg">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 py-4 sm:flex-row sm:justify-between lg:px-8">
        <p className="text-sm leading-relaxed text-muted-foreground">
          We use cookies to improve your experience, analyze traffic, and personalize content. By
          continuing to use this site you consent to our use of cookies.{" "}
          <a href="#" className="underline underline-offset-2 hover:text-foreground">
            Learn more
          </a>
        </p>
        <div className="flex shrink-0 gap-3">
          <Button variant="outline" size="sm">
            Manage preferences
          </Button>
          <Button size="sm" onClick={() => setDismissed(true)}>
            Accept all
          </Button>
        </div>
      </div>
    </div>
  );
}
