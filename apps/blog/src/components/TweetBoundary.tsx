"use client";
import { Component, type ReactNode } from "react";

// Shared degraded state for every tweet embed path: unfetchable payload,
// payload react-tweet chokes on, or a render throw caught by the boundary.
export function TweetFallbackLink({ tweetId }: { tweetId: string }) {
  return (
    <a
      href={`https://x.com/i/status/${tweetId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full rounded-square-high border border-stroke-neutral bg-paper p-6 text-center text-sm text-foreground-neutral-weak no-underline transition-colors duration-300 hover:border-stroke-neutral-strong hover:text-foreground-neutral motion-reduce:transition-none"
    >
      View this post on X →
    </a>
  );
}

// Safety net around react-tweet's <EmbeddedTweet>. enrichTweet() still runs on
// the client during hydration; if it throws on an unexpected payload, contain
// the failure to this one embed instead of blanking the whole page, and fall
// back to a plain link to the post on X.
export class TweetBoundary extends Component<
  { tweetId: string; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return <TweetFallbackLink tweetId={this.props.tweetId} />;
    }
    return this.props.children;
  }
}
