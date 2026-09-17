"use client";
import dynamic from "next/dynamic";
import { TweetBoundary } from "./TweetBoundary";

// Lazy-load the react-tweet-backed embed so it is excluded from the global MDX
// component bundle. Because TweetEmbedComp is registered in getMDXComponents(),
// a static import would embed the Twitter/X widget SDK in every blog post's JS
// bundle even for posts that contain no tweets.
//
// SafeTweet, not react-tweet's own <Tweet>: the upstream component crashes the
// whole page on payloads whose entities are partial (see @/lib/sanitize-tweet).
const Tweet = dynamic(() => import("./TweetEmbedClient").then((m) => m.SafeTweet), {
  ssr: false,
});

export const TweetEmbedComp = ({ tweets }: { tweets: string[] }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: tweets.length === 1 ? "1fr" : "repeat(auto-fit, minmax(330px, 1fr))",
        gap: "2rem",
        justifyItems: tweets.length === 1 ? "center" : "stretch",
        justifyContent: "center",
        margin: "2rem 0",
      }}
    >
      {tweets.map((tweet) => (
        <div
          key={tweet}
          style={{
            display: "flex",
            justifyContent: tweets.length === 1 ? "center" : "stretch",
          }}
        >
          <TweetBoundary tweetId={tweet}>
            <Tweet id={tweet} />
          </TweetBoundary>
        </div>
      ))}
    </div>
  );
};
