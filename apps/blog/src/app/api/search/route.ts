import { blog as source } from "@/lib/source";
import { createFromSource } from "fumadocs-core/search/server";

export const revalidate = false;
export const dynamic = "force-dynamic";
export const { GET } = createFromSource(source, {
  // https://docs.orama.com/docs/orama-js/supported-languages
  language: "english",
});
