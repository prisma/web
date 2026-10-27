import { BrandGrain } from "@prisma-docs/ui/components/brand-grain";
// Reuse the exact brand grain as a baked, content-hashed picture. It needs
// neither a cold image conversion nor a basePath-specific optimizer URL.
export function PaperGround() {
  return (
    <div
      aria-hidden
      className="brand-grain-picture pointer-events-none fixed inset-0 -z-10 dark:hidden"
      style={{
        opacity: 0.05,
        mixBlendMode: "multiply",
      }}
    >
      <BrandGrain eager />
    </div>
  );
}
