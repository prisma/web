import { ArrowRight } from "@/components/icons/forma";

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

// Resource cards in the site's story-card language (image, title, excerpt,
// read-on arrow), replacing the old PostCard dependency.
export function ResourcesSection({ data }: { data: ResourcesSectionData }) {
  return (
    <section className="bg-white px-4 py-20 sm:px-8">
      <div className="mx-auto max-w-site">
        <h2 className="mx-auto max-w-[26ch] text-balance text-center text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
          {data.title}
        </h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {data.cards.map((card) => (
            <a
              key={card.url}
              href={card.url}
              className="group flex flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(21,21,21,0.04)] transition-[border-color,box-shadow] duration-300 hover:border-black/[0.12] hover:shadow-[0_6px_20px_rgba(21,21,21,0.07)]"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-[#eef4f3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.image}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03] motion-reduce:transition-none"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-6">
                {card.badge && (
                  <span className="w-fit rounded-full bg-[#dcfdff] px-2.5 py-0.5 text-xs font-semibold text-prism-cyan-700">
                    {card.badge}
                  </span>
                )}
                <h3 className="text-lg leading-snug">{card.title}</h3>
                <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {card.description}
                </p>
                <span className="mt-auto flex items-center justify-between pt-2 text-sm text-muted-foreground">
                  {card.author?.name ?? card.date ?? ""}
                  <ArrowRight
                    className="size-4 text-foreground transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                    aria-hidden
                  />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
