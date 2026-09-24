"use client";

import { useState } from "react";
import { ArrowRight, X } from "lucide-react";

export function Banner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative bg-primary px-6 py-3 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-x-4 text-sm text-primary-foreground">
        <p className="text-center">
          We just launched v2.0 &mdash; faster, smarter, and more powerful than ever.{" "}
          <a
            href="#"
            className="inline-flex items-center gap-1 font-medium underline underline-offset-4 hover:opacity-80"
          >
            See what&apos;s new
            <ArrowRight className="size-3.5" />
          </a>
        </p>

        <button
          onClick={() => setVisible(false)}
          className="absolute right-4 rounded-md p-1 transition-opacity hover:opacity-70 lg:right-8"
          aria-label="Dismiss banner"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
