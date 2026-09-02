import type { SVGProps } from "react";

/**
 * Lucide-style bucket for the Storage product: an elliptical rim with a
 * tapered body, in the S3-bucket silhouette. Lucide ships no plain bucket
 * (only PaintBucket), so this fills the gap; sized and stroked to match so
 * it can sit anywhere a lucide icon does.
 */
export function BucketIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <ellipse cx="12" cy="5.5" rx="8.5" ry="2.5" />
      <path d="M20.5 5.5 18.7 18.8a2 2 0 0 1-2 1.7H7.3a2 2 0 0 1-2-1.7L3.5 5.5" />
    </svg>
  );
}
