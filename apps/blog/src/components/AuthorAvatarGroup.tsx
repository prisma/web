import { Avatar } from "@prisma/eclipse";
import { getAuthorProfiles } from "@/lib/authors";
import { withBlogBasePathForImageSrc } from "@/lib/url";

type AuthorAvatarGroupProps = {
  authors?: string[];
  className?: string;
};
export function AuthorAvatarGroup({ authors = [], className }: AuthorAvatarGroupProps) {
  const profiles = getAuthorProfiles(authors);

  if (profiles.length === 0) {
    return null;
  }

  return (
    <span className={className ?? "mt-auto flex items-center gap-2 font-semibold text-sm"}>
      <span className="flex items-center">
        {profiles.map((profile, index) => (
          profile.imageSrc ? (
            <Avatar
              key={profile.name}
              format="image"
              src={withBlogBasePathForImageSrc(profile.imageSrc)}
              alt={profile.name}
              size="lg"
              className={index > 0 ? "-ml-1.5 border border-background-default" : ""}
            />
          ) : null
        ))}
      </span>
      <span>{profiles.map((profile) => profile.name).join(", ")}</span>
    </span>
  );
}
