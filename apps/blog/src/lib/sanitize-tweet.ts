import type { Tweet, TweetEntities } from "react-tweet/api";

// react-tweet 3.3.0's getEntities() iterates entities.hashtags / user_mentions
// / urls / symbols without guarding undefined, so a tweet whose syndication
// payload omits one of those (common on newer tweets with media or cards)
// throws "undefined is not iterable" and crashes the page. Backfill the arrays
// before handing the tweet to <EmbeddedTweet>.
//
// enrichTweet() runs getEntities() twice — once on the tweet, once on
// tweet.quoted_tweet — so both need the backfill; a quote-tweet with a partial
// inner payload crashed even with the outer entities patched.
//
// Shared by the server-rendered <TweetColumns> and the lazily hydrated
// <TweetEmbedComp>; both paths reach the same enrichTweet() code.
// Type-only import of react-tweet/api keeps this module free of runtime deps,
// so importing it never pulls the widget code into a bundle.
function backfillEntities(entities: TweetEntities | undefined): TweetEntities {
  const source = entities ?? ({} as TweetEntities);
  return {
    ...source,
    hashtags: source.hashtags ?? [],
    user_mentions: source.user_mentions ?? [],
    urls: source.urls ?? [],
    symbols: source.symbols ?? [],
  };
}

export function sanitizeTweet(tweet: Tweet): Tweet {
  return {
    ...tweet,
    entities: backfillEntities(tweet.entities),
    quoted_tweet: tweet.quoted_tweet
      ? {
          ...tweet.quoted_tweet,
          entities: backfillEntities(tweet.quoted_tweet.entities),
        }
      : undefined,
  };
}
