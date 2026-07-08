/**
 * The Bun mark, drawn as a single-colour silhouette (with eyes + smile cut out
 * via even-odd) in currentColor so it matches the Prisma mark's treatment.
 */
export function BunMark({ className }: { className?: string }) {
  const silhouette =
    "M38,65.75C17.32,65.75.5,52.27.5,35.7c0-10,6.18-19.33,16.53-24.92,3-1.6,5.57-3.21,7.86-4.62,1.26-.78,2.45-1.51,3.6-2.19C32,1.89,35,.5,38,.5s5.62,1.2,8.9,3.14c1,.57,2,1.19,3.07,1.87,2.49,1.54,5.3,3.28,9,5.27C69.32,16.37,75.5,25.69,75.5,35.7,75.5,52.27,58.68,65.75,38,65.75Z";
  const leftEye = "M20.19,33.29a5.51,5.51 0 1,0 11.02,0a5.51,5.51 0 1,0 -11.02,0Z";
  const rightEye = "M44.96,33.29a5.51,5.51 0 1,0 11.02,0a5.51,5.51 0 1,0 -11.02,0Z";
  const mouth =
    "M45.05,43a8.93,8.93,0,0,1-2.92,4.71,6.81,6.81,0,0,1-4,1.88A6.84,6.84,0,0,1,34,47.71,8.93,8.93,0,0,1,31.12,43a.72.72,0,0,1,.8-.81H44.26A.72.72,0,0,1,45.05,43Z";
  return (
    <svg viewBox="0 0 76 66" className={className} fill="currentColor" aria-hidden>
      <path d={`${silhouette} ${leftEye} ${rightEye} ${mouth}`} fillRule="evenodd" />
    </svg>
  );
}
