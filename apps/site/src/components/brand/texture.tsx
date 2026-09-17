import Image from "next/image";
import { cn } from "@/lib/utils";

type TextureProps = {
  className?: string;
  opacity?: number;
  blend?: "hard-light" | "multiply";
};

// Brand grain texture overlay. Drop inside any `relative` container.
// Standard since the bold pass: 0.06 opacity with multiply blending on
// color-washed section panels (hard-light is nearly invisible on light
// surfaces — only reach for it on dark imagery).
export function Texture({ className, opacity = 0.06, blend = "multiply" }: TextureProps) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <Image
        src="/brand/texture.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        style={{ opacity, mixBlendMode: blend }}
      />
    </div>
  );
}
