import Link from "next/link";
import type { ReactNode } from "react";
import { Avatar } from "@prisma/eclipse";
import { getAuthorProfiles, toAuthorSlug } from "@/lib/authors";
import { withBlogBasePathForImageSrc } from "@/lib/url";
import { versionPublicImage } from "@/lib/public-image-version";

type AuthorAvatarGroupProps = {
  authors?: string[];
  className?: string;
  linkAuthors?: boolean;
  /**
   * "byline" is the post header's quiet version (client, 2026-11-25: "more
   * elegant and simple", then "this looked better next to each other"):
   * round 28px portraits with a ring where they overlap, names in medium
   * weight, and `meta` (date, read time) on the same line. Cards keep the
   * default.
   */
  variant?: "default" | "byline";
  /** byline only: quiet details after the names (date, read time). */
  meta?: ReactNode;
};
export function AuthorAvatarGroup({
  authors = [],
  className,
  linkAuthors = true,
  variant = "default",
  meta,
}: AuthorAvatarGroupProps) {
  const byline = variant === "byline";
  const profiles = getAuthorProfiles(authors);

  if (profiles.length === 0) {
    return null;
  }

  return (
    <span
      className={
        className ??
        (byline
          ? "flex items-center gap-2.5 text-sm"
          : "mt-auto flex items-center gap-2 font-semibold text-sm")
      }
    >
      <span className="flex items-center">
        {profiles.map((profile, index) =>
          profile.imageSrc && byline ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={profile.name}
              src={versionPublicImage(withBlogBasePathForImageSrc(profile.imageSrc))}
              alt={profile.name}
              width={28}
              height={28}
              loading="lazy"
              className={
                "size-7 rounded-full object-cover ring-2 ring-background-default" +
                (index > 0 ? " -ml-2" : "")
              }
            />
          ) : profile.imageSrc ? (
            <Avatar
              key={profile.name}
              format="image"
              src={versionPublicImage(withBlogBasePathForImageSrc(profile.imageSrc))}
              alt={profile.name}
              size="lg"
              loading="lazy"
              className={index > 0 ? "-ml-1.5 border border-background-default" : ""}
            />
          ) : null,
        )}
      </span>
      <span className={byline ? "flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1" : undefined}>
        <span className={byline ? "font-medium text-foreground-neutral-strong" : undefined}>
          {profiles.map((profile, i) => {
            const slug = toAuthorSlug(profile.name);
            const sep = i < profiles.length - 1 ? ", " : "";
            if (linkAuthors && slug) {
              return (
                <span key={profile.name}>
                  <Link
                    href={`/author/${slug}`}
                    className="underline decoration-transparent underline-offset-4 transition-colors duration-300 hover:text-foreground-neutral-strong hover:decoration-prism-cyan-400 motion-reduce:transition-none"
                  >
                    {profile.name}
                  </Link>
                  {sep}
                </span>
              );
            }
            return (
              <span key={profile.name}>
                {profile.name}
                {sep}
              </span>
            );
          })}
        </span>
        {byline && meta ? (
          <span className="flex flex-wrap items-center gap-x-4 gap-y-1 text-foreground-neutral-weak tabular-nums">
            {meta}
          </span>
        ) : null}
      </span>
    </span>
  );
}
