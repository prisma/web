import { Shield } from "@/components/icons/forma";
import { Bar, CardChrome, SectionLabel, SurfaceCard } from "./parts";

// "Predictable pricing" — operations metered against a limit you set, and a free
// tier with a hard cap. Deliberately unnumbered: the claim is the shape of the
// bill, not a price, and inventing figures here would invent a price list. The
// meter sits well short of the cap because that is what the copy describes.

export function SpendLimits() {
  return (
    <SurfaceCard label="Illustration of operation-based pricing: usage metered well below a spend limit you set yourself, with a free tier capped hard">
      <CardChrome file="usage" />
      <div className="flex flex-1 flex-col justify-center gap-3.5 px-4 py-3 text-[0.625rem] leading-none">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <SectionLabel>Operations</SectionLabel>
            <span className="ml-auto flex items-center gap-1 font-mono text-[0.5625rem] font-semibold text-prism-cyan-700">
              <Shield className="size-2.5" />
              spend limit
            </span>
          </div>

          {/* the meter, with the limit marked well above where usage sits */}
          <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-foreground/[0.07]">
            <span className="absolute inset-y-0 left-0 w-[38%] rounded-full bg-prism-cyan-400" />
            <span
              aria-hidden
              className="absolute inset-y-[-2px] left-[72%] w-[2px] rounded-full bg-prism-red-500"
            />
          </div>
          <div className="flex items-center justify-between font-mono text-[0.5625rem] text-muted-foreground">
            <span>this month</span>
            <span className="text-prism-red-600">your cap</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-lg border border-border/80 bg-muted/30 p-2.5">
          <div className="flex items-center gap-2">
            <span className="rounded border border-prism-cyan-200 bg-prism-cyan-50 px-1.5 py-0.5 text-[0.5625rem] font-semibold text-prism-cyan-800">
              Free tier
            </span>
            <span className="font-mono text-[0.5625rem] text-muted-foreground">hard cap</span>
          </div>
          <Bar className="h-1 w-2/3" />
          <p className="font-mono text-[0.5625rem] text-muted-foreground/80">no credit card</p>
        </div>
      </div>
    </SurfaceCard>
  );
}
