import { createMixedbreadSearchAPI } from "fumadocs-core/search/mixedbread";
import Mixedbread from "@mixedbread/sdk";
import { type BlogSearchResult } from "../../../lib/search-types";

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
}
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
  transform: (results, _query) => {
    return results.flatMap((item) => {
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
        },
      ];
      return chunkResults;
    });
  },
});
