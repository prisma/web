"use client";

import Script from "next/script";

export function TallyEmbed() {
  return (
    <>
      <iframe
        data-tally-src="https://tally.so/embed/mBDxkQ?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
        loading="lazy"
        width="100%"
        height="693"
        title="Startups"
        className="max-w-[883px] mx-auto"
      />
      <Script
        src="https://tally.so/widgets/embed.js"
        onLoad={() => {
          // @ts-expect-error -- Tally is loaded via script
          if (window.Tally) window.Tally.loadEmbeds();
        }}
      />
    </>
  );
}
