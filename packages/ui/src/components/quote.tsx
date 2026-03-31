import { Avatar, Separator } from "@prisma/eclipse";
import { cn } from "../lib/cn";
export const Quote = ({
  children,
  author,
  className,
  color,
}: {
  children: React.ReactNode;
  author?: { name: string; imageUrl: string; title?: string; company?: string };
  className?: string;
  color?: "orm" | "ppg";
}) => {
  return (
    <blockquote
      className={cn(
        "text-2xl text-foreground-neutral flex flex-col gap-12 bg-background-neutral-weaker border border-stroke-neutral p-8 rounded-square",
        className,
      )}
    >
      <span className="font-sans-display contents font-bold">{children}</span>
      {author && (
        <footer className="flex gap-2 justify-start items-center">
          <Avatar
            format="image"
            src={author.imageUrl}
            alt={author.name}
            size="2xl"
          />
          <div className="flex flex-col gap-1 text-base text-foreground-neutral-weak">
            <cite className="[font-style:normal] font-[650]">
              {author.name}
            </cite>
            <div className="title flex items-center">
              {author.title && (
                <span className="font-[600] text-2xs uppercase">
                  {author.title}
                </span>
              )}
              {author.company && (
                <>
                  <Separator orientation="vertical" className="mx-1 h-3.5" />
                  <span
                    className={cn(
                      "font-[400] text-xs uppercase",
                      color === "orm"
                        ? "text-foreground-orm"
                        : "text-foreground-ppg",
                    )}
                  >
                    {author.company}
                  </span>
                </>
              )}
            </div>
          </div>
        </footer>
      )}
    </blockquote>
  );
};
