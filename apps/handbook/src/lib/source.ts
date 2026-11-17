import { handbook } from "../../.source/server";
import { type InferPageType, loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";

// See https://fumadocs.dev/docs/headless/source-api
export const source = loader({
  baseUrl: "/",
  source: handbook.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export type HandbookPage = InferPageType<typeof source>;
