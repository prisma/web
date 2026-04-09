import { Avatar } from "@prisma/eclipse";

export type AuthorProfile = {
  name: string;
  imageSrc?: string | null;
};

type AuthorAvatarGroupProps = {
  authors: AuthorProfile[];
  className?: string;
};

export function AuthorAvatarGroup({
  authors = [],
  className,
}: AuthorAvatarGroupProps) {
  if (authors.length === 0) {
    return null;
  }

  return (
    <span
      className={
        className ?? "mt-auto flex items-center gap-2 font-semibold text-sm"
      }
    >
      <span className="flex items-center">
        {authors.map((author, index) =>
          author.imageSrc ? (
            <Avatar
              key={author.name}
              format="image"
              src={author.imageSrc}
              alt={author.name}
              size="lg"
              className={
                index > 0 ? "-ml-1.5 border border-background-default" : ""
              }
            />
          ) : null,
        )}
      </span>
      <span>{authors.map((author) => author.name).join(", ")}</span>
    </span>
  );
}
