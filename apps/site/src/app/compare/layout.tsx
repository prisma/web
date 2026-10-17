import type { ReactNode } from "react";
import {
  getComparisonDirectoryStructuredData,
  getComparisonFaqStructuredData,
  getComparisonStructuredData,
} from "@/lib/comparison-metadata";
import { ComparisonStructuredData } from "./comparison-structured-data";
import { COMPARISONS } from "./comparisons";

/** Structured data for the directory and every registered head-to-head. */
export default function CompareLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ComparisonStructuredData
        directory={getComparisonDirectoryStructuredData()}
        pages={COMPARISONS.map((entry) => ({
          slug: entry.slug,
          article: getComparisonStructuredData(entry.slug),
          faq: getComparisonFaqStructuredData(entry.slug),
        }))}
      />
      {children}
    </>
  );
}
