/**
 * The one browser frame every Studio screenshot on /studio sits in, hero and
 * tour alike: three dots, the localhost:5555 address bar (so no caption has to
 * say where Studio opens), a hairline under it, and a soft shadow.
 */
export function BrowserFrame({
  children,
  address = "localhost:5555",
}: {
  children: React.ReactNode;
  /** What the address bar shows; the embed screenshot sits in a host app. */
  address?: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/[0.08] bg-[#f6f6f4] shadow-[0_1px_2px_rgba(21,21,21,0.04),0_8px_16px_-4px_rgba(21,21,21,0.06),0_24px_48px_-16px_rgba(21,21,21,0.12)]">
      <div className="flex items-center gap-3 px-4 py-2.5">
        <span aria-hidden className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-black/[0.12]" />
          <span className="size-2.5 rounded-full bg-black/[0.12]" />
          <span className="size-2.5 rounded-full bg-black/[0.12]" />
        </span>
        <span className="mx-auto rounded-md bg-white px-10 py-1 font-mono text-xs text-muted-foreground shadow-[0_0_0_1px_rgba(21,21,21,0.06)]">
          {address}
        </span>
        <span aria-hidden className="w-[2.625rem]" />
      </div>
      <div className="border-t border-black/[0.08]">{children}</div>
    </div>
  );
}
