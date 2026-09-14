/**
 * The centered hero the archive pages share.
 *
 * CF's centered hero on calm prismatic ground: spectral washes only. The page's
 * single ray lives on the featured-series card below — one brand moment per
 * view, and a diagonal band can't safely cross centered text at every
 * breakpoint anyway. Static by design.
 *
 * Lifted out of `(blog)/page.tsx` unchanged so `/blog/page/N` and
 * `/blog/tag/X` wear the same header.
 */
export function BlogListingHero({
  title,
  description,
  eyebrow,
}: {
  title: string;
  description: string;
  eyebrow?: string;
}) {
  return (
    <header className="relative isolate mx-auto max-w-2xl py-16 text-center sm:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-24 -inset-y-8 -z-10 overflow-hidden dark:opacity-70"
      >
        <div
          className="absolute inset-0"
          style={{
            background: [
              "radial-gradient(34% 48% at 18% 30%, color-mix(in srgb, var(--color-prism-cyan-400) 16%, transparent), transparent 68%)",
              "radial-gradient(30% 42% at 84% 24%, color-mix(in srgb, var(--color-prism-yellow-300) 13%, transparent), transparent 66%)",
              "radial-gradient(30% 44% at 70% 88%, color-mix(in srgb, var(--color-prism-red-500) 12%, transparent), transparent 68%)",
            ].join(","),
          }}
        />
      </div>
      {eyebrow ? (
        <div className="type-heading-2xs mb-3 text-foreground-neutral-weak">{eyebrow}</div>
      ) : null}
      <h1 className="landing-h1">{title}</h1>
      <p className="mt-6 text-lg leading-relaxed text-foreground-neutral-weak text-balance">
        {description}
      </p>
    </header>
  );
}
