import { PostCard } from "@prisma-docs/ui/components/post-card";

type ResourcesSectionData = {
  title: string;
  cards: Array<{
    image: string;
    url: string;
    badge?: string;
    date?: string;
    title: string;
    description: string;
    author?: {
      name: string;
      avatar: string;
    };
  }>;
};

export function ResourcesSection({ data }: { data: ResourcesSectionData }) {
  return (
    <div className="my-12">
      <div className="px-4 md:px-8 py-12 flex flex-col gap-12 max-w-344 w-full mx-auto">
        <h2 className="stretch-display text-foreground-neutral text-4xl font-bold text-center font-sans-display mx-auto">
          {data.title}
        </h2>
        <div className="cards grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3! gap-6">
          {data.cards.map((card, idx: number) => (
            <div
              key={idx}
              className="border rounded-square border-stroke-neutral"
            >
              <PostCard
                vertical
                featured
                post={{
                  url: card.url,
                  title: card.title,
                  date: card.date ?? "",
                  excerpt: card.description,
                  author: card.author
                    ? {
                        name: card.author.name,
                        imageSrc: card.author.avatar,
                      }
                    : undefined,
                  imageSrc: card.image,
                  imageAlt: "Post image",
                  badge: card.badge,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
