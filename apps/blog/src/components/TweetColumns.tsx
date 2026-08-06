import type { CSSProperties, ReactNode } from "react";
import { getTweet, type Tweet } from "react-tweet/api";
import { EmbeddedTweet } from "react-tweet";
import { TweetBoundary, TweetFallbackLink } from "./TweetBoundary";
import { sanitizeTweet } from "@/lib/sanitize-tweet";

const isTweetId = (value: string) => /^\d+$/.test(value);

async function TweetCard({ tweetId }: { tweetId: string }) {
  let tweet: Tweet | undefined;
  try {
    tweet = await getTweet(tweetId);
  } catch {
    tweet = undefined;
  }

  if (!tweet) {
    return <TweetFallbackLink tweetId={tweetId} />;
  }

  return (
    <TweetBoundary tweetId={tweetId}>
      <EmbeddedTweet tweet={sanitizeTweet(tweet)} />
    </TweetBoundary>
  );
}

// Two-column layout that mirrors the Notion source: prose on one side and a
// tweet on the other on wide screens, stacked (prose first, tweet below) on
// mobile. `side` controls which side the tweet sits on at desktop width.
//
// DOM order is always prose-then-tweet so the mobile (single-column) stack
// reads prose first; `md:flex-row-reverse` flips the visual order on desktop
// when the tweet should sit on the left.
// `md:items-start` top-aligns the prose with the tweet header rather than
// vertically centering it against the (usually taller) embed.
const wrapperBase = "flex flex-col gap-6 md:gap-10 my-10 md:items-start";

export async function TweetColumns({
  tweetId,
  side = "right",
  children,
}: {
  tweetId: string;
  side?: "left" | "right";
  children: ReactNode;
}) {
  const direction = side === "left" ? "md:flex-row-reverse" : "md:flex-row";

  return (
    <div className={`${wrapperBase} ${direction}`}>
      <div className="flex-1 min-w-0 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">{children}</div>
      <div
        className="w-full md:w-[360px] md:shrink-0 flex justify-center [&_.react-tweet-theme]:!my-0"
        style={{ "--tweet-container-margin": "0" } as CSSProperties}
      >
        {isTweetId(tweetId) ? (
          <TweetCard tweetId={tweetId} />
        ) : (
          <div className="w-full rounded-square-high border border-dashed border-stroke-neutral-strong bg-paper p-6 text-center text-sm text-foreground-neutral-weak">
            Tweet embed pending — set <code>tweetId</code> to <code>{tweetId}</code>
          </div>
        )}
      </div>
    </div>
  );
}
