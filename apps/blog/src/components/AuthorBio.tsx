import Link from "next/link";
import { Action, Avatar } from "@prisma/eclipse";
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
}: {
  socials: AuthorSocial[];
  name: string;
  className?: string;
}) {
  if (socials.length === 0) return null;

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
            className="text-lg transition-colors hover:[&>div]:bg-background-ppg-strong"
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

  return (
    <section
      aria-label={profiles.length === 1 ? "About the author" : "About the authors"}
      className="mt-8 rounded-xl border border-stroke-neutral-strong p-5 sm:p-6"
    >
      <h2 className="text-xs uppercase tracking-wide font-semibold text-foreground-neutral-weak mb-5">
        {profiles.length === 1 ? "About the author" : "About the authors"}
      </h2>
      <div className="flex flex-col gap-6">
        {profiles.map(({ name, slug, bio }) => {
          const imageSrc = getAuthorImageSrc(name);
          return (
            <div key={slug} className="flex gap-4">
              {imageSrc ? (
                <Link href={`/author/${slug}`} className="shrink-0">
                  <Avatar
                    format="image"
                    src={withBlogBasePathForImageSrc(imageSrc)}
                    alt={name}
                    size="xl"
                  />
                </Link>
              ) : null}
              <div className="min-w-0">
                <Link
                  href={`/author/${slug}`}
                  className="type-title-md text-foreground-neutral hover:text-fd-primary hover:underline"
                >
                  {name}
                </Link>
                <p className="mt-1 mb-2 text-sm text-foreground-neutral-weak">{bio?.bio}</p>
                <AuthorSocialLinks socials={bio?.socials ?? []} name={name} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
