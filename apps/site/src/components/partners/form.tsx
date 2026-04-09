"use client";
import Script from "next/script";

export const Form = () => (
  <div className="mx-auto max-w-[887px] w-full">
    <iframe
      data-tally-src="https://tally.so/embed/wMgZxp?alignLeft=1&hideTitle=1&dynamicHeight=1"
      loading="lazy"
      width="100%"
      height="589"
      allow="autoplay; clipboard-write; encrypted-media"
      title="Partners - Contact form"
    />
    <Script
      src="https://tally.so/widgets/embed.js"
      onLoad={() => window.Tally?.loadEmbeds()}
    />
  </div>
);
