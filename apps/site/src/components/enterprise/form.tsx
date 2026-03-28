"use client";
import Script from "next/script";

export const EnterpriseForm = () => (
  <>
    <iframe
      data-tally-src="https://tally.so/embed/3jQDNR?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
      loading="eager"
      width="100%"
      height="899"
      title="Enterprise - Contact form"
      allow="autoplay; clipboard-write; encrypted-media"
    />
    <Script
      src="https://tally.so/widgets/embed.js"
      onLoad={() => window.Tally?.loadEmbeds()}
    />
  </>
);
