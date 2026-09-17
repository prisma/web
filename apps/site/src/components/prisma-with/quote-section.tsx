type QuoteSectionData = {
  text: string;
  author: {
    name: string;
    imageUrl: string;
    title: string;
    company: string;
  };
};

// Pull-quote on the card-wash surface, matching the partners page quotes.
export function QuoteSection({ data }: { data: QuoteSectionData }) {
  return (
    <section className="bg-white px-4 py-16 sm:px-8">
      <figure className="mx-auto flex max-w-3xl flex-col gap-5 rounded-2xl bg-[#eef4f3] p-8 sm:p-10">
        <blockquote className="text-pretty text-lg font-medium leading-relaxed text-foreground sm:text-xl">
          &ldquo;{data.text}&rdquo;
        </blockquote>
        <figcaption className="flex items-center gap-3.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.author.imageUrl}
            alt=""
            loading="lazy"
            className="size-11 shrink-0 rounded-full object-cover ring-1 ring-black/[0.08]"
          />
          <div>
            <p className="text-sm font-semibold text-foreground">{data.author.name}</p>
            <p className="text-sm text-muted-foreground">
              {data.author.title}, {data.author.company}
            </p>
          </div>
        </figcaption>
      </figure>
    </section>
  );
}
