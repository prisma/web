import { createMixedbreadSearchAPI } from "fumadocs-core/search/mixedbread";
import Mixedbread from "@mixedbread/sdk";
import { type BlogSearchResult } from "../../../lib/search-types";

// `generated_metadata` is stored as a generic object, but blog search always
// indexes the frontmatter fields below for each post.
export type GeneratedMetadata = {
  title: string;
  slug: string;
  date: string;
  authors: string[];
  metaTitle: string;
  metaDescription: string;
  metaImagePath: string;
  heroImagePath: string;
  heroImageAlt: string;
  tags: string[];
  excerpt: string;
};
export const dynamic = "force-dynamic";

const mixedbreadApiKey = process.env.MIXEDBREAD_API_KEY;
if (!mixedbreadApiKey) {
  throw new Error("MIXEDBREAD_API_KEY environment variable is required");
}
const client = new Mixedbread({ apiKey: mixedbreadApiKey });

export const { GET } = createMixedbreadSearchAPI({
  client,
  storeIdentifier: "blog-search",
  topK: 20,
  // Mixedbread can return multiple chunk hits for the same post. We normalize
  // each hit into the blog search UI shape, then sort and dedupe the results.
  transform: (results, _query) => {
    const seenUrls = new Set<string>();

    return results
      .flatMap((item) => {
        // Mixedbread types `generated_metadata` loosely, so we narrow it to the
        // frontmatter shape we index for blog posts.
        const metadata = item.generated_metadata as unknown as GeneratedMetadata;
        const slug = (metadata?.slug ?? "").replace(/^\/+/, "");
        const title = metadata?.metaTitle ?? metadata?.title ?? "Untitled";
        const formattedUrl = slug ? `/${slug}` : "#";
        const base = `${item.file_id}-${item.chunk_index}`;

        const chunkResults: BlogSearchResult[] = [
          {
            id: `${base}-page`,
            type: "page",
            content: title,
            url: formattedUrl,
            description: metadata?.metaDescription ?? "",
            heroImagePath: metadata?.heroImagePath ?? "",
            tags: metadata?.tags ?? [],
            date: metadata.date,
          },
        ];
        return chunkResults;
      })
      // Dates are indexed as `YYYY-MM-DD`, so string comparison sorts them
      // chronologically without converting them to `Date` objects.
      .sort((a, b) => b.date.localeCompare(a.date))
      // Keep only the first hit for each post URL after sorting so duplicate
      // chunk matches collapse into one search result.
      .filter((item) => {
        if (seenUrls.has(item.url)) {
          return false;
        }

        seenUrls.add(item.url);
        return true;
      });
  },
});
