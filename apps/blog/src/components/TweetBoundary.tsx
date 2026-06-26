"use client";
import { Component, type ReactNode } from "react";

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
      return (
        <a
          href={`https://x.com/i/status/${this.props.tweetId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full rounded-xl border border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-600 no-underline hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-300"
        >
          View this post on X →
        </a>
      );
    }
    return this.props.children;
  }
}
