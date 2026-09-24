import parse from "html-react-parser";

type WhySectionData = {
  title: string;
  cards: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
};

// Benefit cards in the new language: white hairline cards with prism accent
// bars replacing the old icon chips (the data's fa-* icon names are unused).
export function WhySection({ data }: { data: WhySectionData }) {
  return (
    <section className="bg-white px-4 py-20 sm:px-8">
      <div className="mx-auto max-w-site">
        <h2 className="mx-auto max-w-[26ch] text-balance text-center text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
          {data.title}
        </h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {data.cards.map((card, i) => (
            <div
              key={card.title}
              className="relative flex flex-col gap-2.5 overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_1px_2px_rgba(21,21,21,0.04)] sm:p-7"
            >
              <span
                aria-hidden
                className={
                  "absolute left-0 top-0 h-1 w-full " +
                  ["bg-prism-cyan-400/70", "bg-prism-yellow-300", "bg-prism-red-400/80"][i % 3]
                }
              />
              <h3 className="text-lg leading-snug">{parse(card.title)}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {parse(card.description)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
