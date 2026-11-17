import { BrandGrain } from "@prisma-docs/ui/components/brand-grain";
import { cn } from "@/lib/utils";

type TextureProps = {
  className?: string;
  opacity?: number;
  eager?: boolean;
  blend?: "hard-light" | "multiply";
};

// Brand grain texture overlay. Drop inside any `relative` container.
// Standard since the bold pass: 0.06 opacity with multiply blending on
// color-washed section panels (hard-light is nearly invisible on light
// surfaces — only reach for it on dark imagery).
export function Texture({
  className,
  opacity = 0.06,
  blend = "multiply",
  eager = false,
}: TextureProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "brand-grain-picture pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
      style={{
        opacity,
        mixBlendMode: blend,
      }}
    >
      <BrandGrain eager={eager} />
    </div>
  );
}
