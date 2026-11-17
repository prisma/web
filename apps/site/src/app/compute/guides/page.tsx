import { GuideIndex, getGuideIndexMetadata } from "@/components/answer-pages/guide-index";

export const metadata = getGuideIndexMetadata("compute");

/** List the Compute guide collection in its product directory. */
export default function ComputeGuidesPage() {
  return <GuideIndex product="compute" />;
}
