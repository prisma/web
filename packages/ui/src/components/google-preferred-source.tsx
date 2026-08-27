import { AnchorHTMLAttributes } from "react";
import { cn } from "../lib/cn";

/**
 * Google "Preferred Sources" deeplink.
 * https://developers.google.com/search/docs/appearance/preferred-sources
 *
 * Uses the no-JavaScript deeplink form so no third-party script is loaded
 * (keeps the CookieYes consent surface unchanged). Google allows custom
 * button designs as long as the link targets the preferences URL.
 */
export const GOOGLE_PREFERRED_SOURCE_DOMAIN = "prisma.io";
export const GOOGLE_PREFERRED_SOURCE_URL = `https://www.google.com/preferences/source?q=${GOOGLE_PREFERRED_SOURCE_DOMAIN}`;

const GoogleG = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 shrink-0">
    <path
      fill="#4285F4"
      d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.26-2.09 3.55-5.17 3.55-8.87Z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.94-2.91l-3.87-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A12 12 0 0 0 12 24Z"
    />
    <path
      fill="#FBBC05"
      d="M5.27 14.29A7.2 7.2 0 0 1 4.89 12c0-.8.14-1.57.38-2.29V6.62H1.29A12 12 0 0 0 0 12c0 1.94.46 3.77 1.29 5.38l3.98-3.09Z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
    />
  </svg>
);

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  label?: string;
};

export function GooglePreferredSourceButton({
  className,
  label = "Make us preferred on Google",
  ...rest
}: Props) {
  return (
    <a
      href={GOOGLE_PREFERRED_SOURCE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} (opens Google search preferences)`}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-stroke-neutral-weak bg-background-default px-4 py-2 text-sm font-semibold leading-none text-foreground-neutral no-underline transition-colors hover:bg-background-neutral-weak",
        className,
      )}
      {...rest}
    >
      <GoogleG />
      <span>{label}</span>
    </a>
  );
}

/**
 * Richer call-out for article pages: heading + explanation + button.
 */
export function GooglePreferredSourceCallout({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        "flex flex-col gap-4 rounded-square border border-stroke-neutral-weak bg-background-default p-5 md:flex-row md:items-center md:justify-between",
        className,
      )}
    >
      <div className="flex flex-col gap-1">
        <span className="font-semibold text-foreground-neutral">See us more often in Google</span>
        <span className="text-sm text-foreground-neutral-weak">
          One click marks prisma.io as a preferred source, so our articles show up more often in
          your Top Stories and AI Overviews.
        </span>
      </div>
      <GooglePreferredSourceButton className="shrink-0" />
    </aside>
  );
}
