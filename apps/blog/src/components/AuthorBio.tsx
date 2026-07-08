import Link from "next/link";
import { Avatar } from "@prisma/eclipse";

import { getAuthorImageSrc, toAuthorSlug } from "@/lib/authors";
import { getAuthorBioByName, type AuthorSocial } from "@/lib/author-bios";
import { withBlogBasePathForImageSrc } from "@/lib/url";

const SOCIAL_META: Record<AuthorSocial["platform"], { icon: string; label: string }> = {
  x: { icon: "fa-brands fa-x-twitter", label: "X (Twitter)" },
  linkedin: { icon: "fa-brands fa-linkedin", label: "LinkedIn" },
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

  return (
    <div className={className ?? "flex items-center gap-3"}>
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
            className="text-lg text-foreground-neutral-weak transition-colors hover:text-foreground-neutral"
          >
            <i className={meta.icon} aria-hidden="true" />
          </a>
        );
      })}
    </div>
  );
}

/**
 * E-E-A-T "About the author" section shown at the end of a blog post. Renders
 * a card per author that has a published bio; authors without a bio are
 * silently skipped.
 */
export function AuthorBio({ authors = [] }: { authors?: string[] }) {
  const seen = new Set<string>();
  const profiles = authors
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
    <section className="mt-12 border-t border-stroke-neutral-strong pt-8">
      <h2 className="type-title-lg text-foreground-neutral mb-6">
        {profiles.length === 1 ? "About the author" : "About the authors"}
      </h2>
      <div className="flex flex-col gap-8">
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
                <p className="mt-1 mb-3 text-sm text-foreground-neutral-weak">{bio?.bio}</p>
                <AuthorSocialLinks socials={bio?.socials ?? []} name={name} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
