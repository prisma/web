import Link from "next/link";
import { Action } from "@prisma/eclipse";
import { cn } from "@prisma-docs/ui/lib/cn";

import { getAuthorImageSrc, toAuthorSlug } from "@/lib/authors";
import { getAuthorBioByName, type AuthorSocial } from "@/lib/author-bios";
import { withBlogBasePathForImageSrc } from "@/lib/url";

const SOCIAL_META: Record<AuthorSocial["platform"], { icon: string; label: string }> = {
  x: { icon: "fa-brands fa-x-twitter", label: "X (Twitter)" },
  linkedin: { icon: "fa-brands fa-square-linkedin", label: "LinkedIn" },
  github: { icon: "fa-brands fa-github", label: "GitHub" },
  mastodon: { icon: "fa-brands fa-mastodon", label: "Mastodon" },
};

/**
 * A row of social profile links rendered as FontAwesome brand icons. Used on
 * both the author page and the per-post "About the author" section.
 */
export function AuthorSocialLinks({
  socials,
  name,
  className,
  plain = false,
}: {
  socials: AuthorSocial[];
  name: string;
  className?: string;
  /** Bare icons aligned with the text, for the end-of-post author block. */
  plain?: boolean;
}) {
  if (socials.length === 0) return null;

  if (plain) {
    return (
      <div className={cn("flex items-center gap-4", className)}>
        {socials.map((social) => {
          const meta = SOCIAL_META[social.platform];
          return (
            <a
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="me noopener noreferrer"
              aria-label={`${name} on ${meta.label}`}
              title={meta.label}
              className="-m-2 inline-flex size-9 items-center justify-center rounded-full text-[17px] text-foreground-neutral-weak no-underline transition-colors duration-200 hover:text-foreground-neutral-strong motion-reduce:transition-none"
            >
              <i className={meta.icon} aria-hidden="true" />
            </a>
          );
        })}
      </div>
    );
  }

  // Matches the icon-button treatment used by the footer and article share row
  // (eclipse Action box + gap-2), so social links read as a consistent set.
  // The -ml offset cancels the first box's padding to align flush-left.
  return (
    <div className={cn("-ml-2 flex items-center gap-1", className)}>
      {socials.map((social) => {
        const meta = SOCIAL_META[social.platform];
        return (
          <a
            key={social.platform}
            href={social.url}
            target="_blank"
            rel="me noopener noreferrer"
            aria-label={`${name} on ${meta.label}`}
            title={meta.label}
            className="text-lg transition-colors hover:[&>div]:bg-background-neutral hover:[&_i]:text-foreground-neutral"
          >
            <Action color="neutral" size="lg">
              <i
                className={`${meta.icon} text-current text-foreground-neutral-weak transition-colors`}
                aria-hidden="true"
              />
            </Action>
          </a>
        );
      })}
    </div>
  );
}

/**
 * E-E-A-T "About the author" card rendered at the end of a blog post, so
 * readers reach the author credentials right after finishing the article.
 * Renders one entry per author that has a published bio; authors without a
 * bio are silently skipped.
 */
export function AuthorBio({ authors = [] }: { authors?: string[] }) {
  const seen = new Set<string>();
  const profiles = (Array.isArray(authors) ? authors : [])
    .filter((name): name is string => typeof name === "string" && name.trim().length > 0)
    .map((name) => name.trim())
    .map((name) => ({ name, slug: toAuthorSlug(name), bio: getAuthorBioByName(name) }))
    .filter((entry) => entry.slug && entry.bio)
    .filter((entry) => {
      if (seen.has(entry.slug)) return false;
      seen.add(entry.slug);
      return true;
    });

  if (profiles.length === 0) return null;

  // The end-of-post author block (client, 2026-11-25: "make this element
  // much nicer", "get this off a card", then "light, simple, and elegant").
  // A hairline closes the article; each author is a round portrait beside
  // their name, then the bio and one line of profiles and "More from" on
  // the same left edge as everything else in the post's ending. The section
  // heading stays for screen readers only.
  return (
    <section aria-labelledby="about-the-author" className="mt-14 border-t border-stroke-neutral pt-10">
      <h2 id="about-the-author" className="sr-only">
        {profiles.length === 1 ? "About the author" : "About the authors"}
      </h2>
      <div className="flex flex-col gap-10">
        {profiles.map(({ name, slug, bio }) => {
          const imageSrc = getAuthorImageSrc(name);
          const firstName = name.split(/\s+/)[0];
          return (
            <div key={slug}>
              <div className="flex items-center gap-3">
                {imageSrc ? (
                  <Link href={`/author/${slug}`} tabIndex={-1} aria-hidden className="shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={withBlogBasePathForImageSrc(imageSrc)}
                      alt=""
                      width={40}
                      height={40}
                      loading="lazy"
                      className="size-10 rounded-full object-cover ring-1 ring-stroke-neutral"
                    />
                  </Link>
                ) : null}
                <h3 className="m-0 text-base font-semibold leading-snug text-foreground-neutral-strong">
                  <Link
                    href={`/author/${slug}`}
                    className="no-underline decoration-prism-cyan-400/60 underline-offset-4 hover:underline"
                  >
                    {name}
                  </Link>
                </h3>
              </div>
              <p className="mt-4 mb-0 max-w-[44rem] text-[15px] leading-[1.7] text-foreground-neutral-weak">
                {bio?.bio}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                <AuthorSocialLinks socials={bio?.socials ?? []} name={name} plain />
                <Link
                  href={`/author/${slug}`}
                  className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground-neutral no-underline hover:text-foreground-neutral-strong"
                >
                  More from {firstName}
                  <span
                    aria-hidden
                    className="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
                  >
                    →
                  </span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
