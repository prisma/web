import { getComparisonMetadata } from "@/lib/comparison-metadata";
import { KyselyPage } from "./_sections";

export const metadata = getComparisonMetadata("kysely");

/** Render the comparison. The compare layout emits its structured data. */
export default function Page() {
  return <KyselyPage />;
}
