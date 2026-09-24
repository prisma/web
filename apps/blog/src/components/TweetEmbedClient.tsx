"use client";
import { EmbeddedTweet, TweetSkeleton, useTweet } from "react-tweet";
import { sanitizeTweet } from "@/lib/sanitize-tweet";
import { TweetFallbackLink } from "./TweetBoundary";

// Stand-in for react-tweet's own <Tweet>, which renders the fetched payload
// straight into <EmbeddedTweet> and therefore hits the getEntities() crash
// described in @/lib/sanitize-tweet. Same fetch (useTweet is react-tweet's own
// SWR hook), same skeleton, but the payload goes through sanitizeTweet first —
// mirroring what the server-rendered <TweetColumns> already does.
//
// This module is the lazy-loading boundary: TweetEmbed.tsx pulls it in via
// next/dynamic so react-tweet stays out of the bundle of posts with no tweets.
export function SafeTweet({ id }: { id: string }) {
  const { data, error, isLoading } = useTweet(id);

  if (isLoading) return <TweetSkeleton />;
  if (error || !data) return <TweetFallbackLink tweetId={id} />;

  return <EmbeddedTweet tweet={sanitizeTweet(data)} />;
}
