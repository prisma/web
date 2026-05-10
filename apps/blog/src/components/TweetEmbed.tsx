"use client";
import dynamic from "next/dynamic";

// Lazy-load react-tweet so it is excluded from the global MDX component bundle.
// Because TweetEmbedComp is registered in getMDXComponents(), a static import
// would embed the Twitter/X widget SDK in every blog post's JS bundle even for
// posts that contain no tweets.
const Tweet = dynamic(() => import("react-tweet").then((m) => m.Tweet), {
  ssr: false,
});

export const TweetEmbedComp = ({ tweets }: { tweets: string[] }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          tweets.length === 1 ? "1fr" : "repeat(auto-fit, minmax(330px, 1fr))",
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
          <Tweet id={tweet} />
        </div>
      ))}
    </div>
  );
};
