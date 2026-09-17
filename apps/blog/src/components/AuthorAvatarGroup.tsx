import Link from "next/link";
import { Avatar } from "@prisma/eclipse";
import { getAuthorProfiles, toAuthorSlug } from "@/lib/authors";
import { withBlogBasePathForImageSrc } from "@/lib/url";

type AuthorAvatarGroupProps = {
  authors?: string[];
  className?: string;
  linkAuthors?: boolean;
};
export function AuthorAvatarGroup({
  authors = [],
  className,
  linkAuthors = true,
}: AuthorAvatarGroupProps) {
  const profiles = getAuthorProfiles(authors);

  if (profiles.length === 0) {
    return null;
  }

  return (
    <span className={className ?? "mt-auto flex items-center gap-2 font-semibold text-sm"}>
      <span className="flex items-center">
        {profiles.map((profile, index) =>
          profile.imageSrc ? (
            <Avatar
              key={profile.name}
              format="image"
              src={withBlogBasePathForImageSrc(profile.imageSrc)}
              alt={profile.name}
              size="lg"
              className={index > 0 ? "-ml-1.5 border border-background-default" : ""}
            />
          ) : null,
        )}
      </span>
      <span>
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
    </span>
  );
}
