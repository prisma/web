"use client";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";

// Lazy-load react-tweet so the Twitter/X widget SDK is only pulled into the
// bundle for posts that actually use it (the same reasoning as TweetEmbed).
const Tweet = dynamic(() => import("react-tweet").then((m) => m.Tweet), {
  ssr: false,
});

const isTweetId = (value: string) => /^\d+$/.test(value);

// Two-column layout that mirrors the Notion source: prose on one side and a
// tweet on the other on wide screens, stacked (prose first, tweet below) on
// mobile. `side` controls which side the tweet sits on at desktop width.
//
// DOM order is always prose-then-tweet so the mobile (single-column) stack
// reads prose first; `md:flex-row-reverse` flips the visual order on desktop
// when the tweet should sit on the left.
const wrapperBase = "flex flex-col gap-6 md:gap-10 my-10 md:items-center";

export const TweetColumns = ({
  tweetId,
  side = "right",
  children,
}: {
  tweetId: string;
  side?: "left" | "right";
  children: ReactNode;
}) => {
  const direction = side === "left" ? "md:flex-row-reverse" : "md:flex-row";

  return (
    <div className={`${wrapperBase} ${direction}`}>
      <div className="flex-1 min-w-0 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
        {children}
      </div>
      <div className="w-full md:w-[360px] md:shrink-0 flex justify-center">
        {isTweetId(tweetId) ? (
          <Tweet id={tweetId} />
        ) : (
          <div className="w-full rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-400">
            Tweet embed pending — set <code>tweetId</code> to <code>{tweetId}</code>
          </div>
        )}
      </div>
    </div>
  );
};
