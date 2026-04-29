"use client";
import { Tweet } from "react-tweet";

export const TweetEmbedComp = ({ tweets }: { tweets: string[] }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: tweets.length === 1 ? "1fr" : "repeat(auto-fit, minmax(330px, 1fr))",
        gap: "2rem",
        justifyItems: tweets.length === 1 ? "center" : "stretch",
        justifyContent: "center",
        // Responsive: add some margin top and bottom
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
