import Image from "next/image";
import { cn } from "@/lib/utils";
import type { FrameworkMeta, GalleryTemplate } from "../_lib/catalog";

// The card's primary visual: a screenshot of the template running, captured
// from the dev server at 1024x640, or, for a template the registry has no
// screenshot for yet, a brand panel carrying the framework mark. Either way
// the framework badge sits in the corner so the stack reads at a glance.

export function TemplatePreview({ template }: { template: GalleryTemplate }) {
  return (
    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
      {template.preview ? (
        <Image
          src={template.preview}
          alt={`${template.name} running in a browser`}
          fill
          sizes="(min-width: 1280px) 400px, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-top transition-transform duration-500 ease-out group-hover/card:scale-[1.03] motion-reduce:transition-none"
        />
      ) : (
        <PreviewFallback framework={template.framework} />
      )}
      <FrameworkBadge framework={template.framework} />
    </div>
  );
}

export function FrameworkLogo({
  framework,
  className,
}: {
  framework: FrameworkMeta;
  className?: string;
}) {
  if (!framework.logo) return null;
  return (
    <img
      src={framework.logo}
      alt=""
      width={16}
      height={16}
      loading="lazy"
      className={cn("size-4 shrink-0 object-contain", className)}
    />
  );
}

function FrameworkBadge({ framework }: { framework: FrameworkMeta }) {
  return (
    <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-lg border border-black/[0.08] bg-white/95 px-2 py-1.5 text-xs font-semibold leading-none text-foreground shadow-[0_1px_2px_rgba(21,21,21,0.06)] backdrop-blur-sm">
      <FrameworkLogo framework={framework} />
      {framework.label}
    </span>
  );
}

// The panel idiom in miniature, same washes as IconTile, with the framework
// mark on a tile in the middle.
function PreviewFallback({ framework }: { framework: FrameworkMeta }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white">
      <span
        aria-hidden
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(70% 55% at 15% 100%, color-mix(in srgb, var(--color-prism-cyan-300) 40%, transparent), transparent 70%)",
            "radial-gradient(60% 50% at 50% 100%, color-mix(in srgb, var(--color-prism-yellow-300) 34%, transparent), transparent 68%)",
            "radial-gradient(70% 52% at 88% 100%, color-mix(in srgb, var(--color-prism-red-300) 36%, transparent), transparent 70%)",
          ].join(","),
        }}
      />
      <span className="relative flex size-20 items-center justify-center rounded-2xl border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(21,21,21,0.04),0_12px_24px_-12px_rgba(21,21,21,0.14)]">
        {framework.logo ? (
          <img
            src={framework.logo}
            alt=""
            width={40}
            height={40}
            loading="lazy"
            className="size-10 object-contain"
          />
        ) : (
          <span className="font-heading text-2xl text-foreground">
            {framework.label.charAt(0)}
          </span>
        )}
      </span>
    </div>
  );
}
