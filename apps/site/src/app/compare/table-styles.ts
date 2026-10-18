/** Table cell padding comes from `.answer-prose`; these set the frame, type and column widths. */
export const TABLE_FRAME =
  "compare-table-frame relative overflow-x-auto max-sm:overflow-visible rounded-xl border border-border outline-none focus-visible:ring-2 focus-visible:ring-ring";

/**
 * Below 640px each row becomes a labelled card (`display: block` + `data-label`).
 * Pair with `data-label` on every `td`. Unlayered CSS in `globals.css` owns the
 * reflow so it can override `.answer-prose table { min-width: 720px }`.
 */
export const TABLE_STACK = "compare-stack";

export const TH_COL = "bg-neutral-50 text-sm font-semibold leading-6 text-primary";
export const TH_ROW = "bg-background text-sm font-semibold leading-6 text-primary";
export const TD = "text-sm leading-6 text-foreground";

/**
 * A shadow at the right edge while more columns sit off-screen. The `local`
 * cover scrolls with the table and hides the shadow once the last column is in view.
 * Hidden on phones, where rows stack instead of scrolling sideways.
 */
export const SCROLL_HINT = {
  background:
    "linear-gradient(to right, transparent, var(--background) 70%) 100% 0 / 2.5rem 100% no-repeat local, radial-gradient(farthest-side at 100% 50%, rgb(0 0 0 / 0.12), transparent) 100% 0 / 0.875rem 100% no-repeat scroll, var(--background)",
};

/** Keeps each row's label in view while the table scrolls sideways from `sm` up. */
export const STICKY =
  "max-sm:static max-sm:bg-transparent max-sm:before:hidden max-sm:after:hidden sticky left-0 z-10 before:absolute before:inset-y-0 before:-left-1 before:w-1 before:bg-inherit after:absolute after:inset-y-0 after:right-0 after:w-px after:bg-black/[0.06]";

export const QUIET_NOTE = "max-w-[32rem] !text-sm !leading-6 !text-muted-foreground";
export const QUIET_LINK =
  "underline underline-offset-4 decoration-black/35 transition-colors hover:text-foreground hover:decoration-black/50";
