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
  // much nicer … light, solid, and look high quality"). A white card with a
  // hairline border and a soft two-layer shadow, so it sits on the page
  // rather than in it; no all-caps eyebrow. Each author: a round portrait
  // beside their name and a bio at reading width, then a footer strip with
  // their profiles on the left and a link to the rest of their posts on the
  // right. The section heading stays for screen readers only, so the
  // outline reads "About the author" → name.
  return (
    <section
      aria-labelledby="about-the-author"
      className="mt-14 overflow-hidden rounded-2xl border border-stroke-neutral bg-background-default shadow-[0_1px_2px_rgba(21,21,21,0.04),0_10px_28px_-14px_rgba(21,21,21,0.14)]"
    >
      <h2 id="about-the-author" className="sr-only">
        {profiles.length === 1 ? "About the author" : "About the authors"}
      </h2>
      {profiles.map(({ name, slug, bio }, i) => {
        const imageSrc = getAuthorImageSrc(name);
        const firstName = name.split(/\s+/)[0];
        return (
          <div key={slug} className={cn(i > 0 && "border-t border-stroke-neutral")}>
            {/* Portrait beside the name; the bio runs under the name from sm
                up and full width on phones, where a portrait column would
                squeeze it into a strip. */}
            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 p-6 sm:gap-x-5 sm:p-7">
              {imageSrc ? (
                <Link
                  href={`/author/${slug}`}
                  tabIndex={-1}
                  aria-hidden
                  className="shrink-0 sm:row-span-2 sm:self-start"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={withBlogBasePathForImageSrc(imageSrc)}
                    alt=""
                    width={56}
                    height={56}
                    loading="lazy"
                    className="size-12 rounded-full object-cover ring-1 ring-stroke-neutral ring-offset-2 ring-offset-background-default sm:size-14"
                  />
                </Link>
              ) : null}
              <h3
                className={cn(
                  "m-0 text-[17px] font-semibold leading-snug text-foreground-neutral-strong",
                  !imageSrc && "col-span-2",
                )}
              >
                <Link
                  href={`/author/${slug}`}
                  className="no-underline decoration-prism-cyan-400/60 underline-offset-4 hover:underline"
                >
                  {name}
                </Link>
              </h3>
              <p
                className={cn(
                  "col-span-2 mt-3 mb-0 max-w-[62ch] text-[15px] leading-[1.65] text-foreground-neutral-weak sm:mt-2",
                  imageSrc && "sm:col-span-1 sm:col-start-2",
                )}
              >
                {bio?.bio}
              </p>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-stroke-neutral px-6 py-3 sm:px-7">
              <AuthorSocialLinks socials={bio?.socials ?? []} name={name} plain />
              <Link
                href={`/author/${slug}`}
                className="group ml-auto inline-flex items-center gap-1.5 py-1.5 text-sm font-medium text-foreground-neutral no-underline hover:text-foreground-neutral-strong"
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
    </section>
  );
}
