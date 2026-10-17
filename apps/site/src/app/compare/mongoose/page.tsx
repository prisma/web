import { getComparisonMetadata } from "@/lib/comparison-metadata";
import { MongoosePage } from "./_sections";

export const metadata = getComparisonMetadata("mongoose");

/** Render the comparison. The compare layout emits its structured data. */
export default function Page() {
  return <MongoosePage />;
}
