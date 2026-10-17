import { getComparisonMetadata } from "@/lib/comparison-metadata";
import { ConvexPage } from "./_sections";

export const metadata = getComparisonMetadata("convex");

/** Render the comparison. The compare layout emits its structured data. */
export default function Page() {
  return <ConvexPage />;
}
