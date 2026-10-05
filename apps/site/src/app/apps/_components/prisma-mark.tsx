// The Prisma logomark as an inline SVG so it takes the ink colour of the chip
// it sits in (the only mark asset under /public is the white-on-dark one).
export function PrismaMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 134 154" fill="currentColor" aria-hidden className={className}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M120.662 122.152 48 142.605c-2.22.626-4.347-1.202-3.88-3.332L70.076 20.958c.486-2.212 3.7-2.564 4.713-.515l48.063 97.136c.906 1.832-.128 3.993-2.191 4.573m12.461-4.825L77.473 4.857c-1.396-2.812-4.309-4.67-7.61-4.842-3.386-.187-6.42 1.367-8.132 4.013L1.376 97.066c-1.87 2.9-1.833 6.475.106 9.339l29.503 43.496c1.758 2.596 4.805 4.099 7.971 4.099.898 0 1.8-.12 2.688-.371l85.639-24.105c2.623-.739 4.768-2.505 5.891-4.847a8.36 8.36 0 0 0-.051-7.35"
      />
    </svg>
  );
}
