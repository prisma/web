import Image from "next/image";
import parse from "html-react-parser";
import { ArrowRight } from "@/components/icons/forma";

type CommunitySectionData = {
  title: string;
  cards: Array<{
    icon?: string;
    image?: string;
    title: string;
    description: string;
    btn?: {
      label: string;
      url: string;
    };
    btns?: Array<{
      label: string;
      url: string;
    }>;
  }>;
};

// Community/link cards in the site's card language. The data's fa-* icon
// names are unused; image marks (tech logos) keep rendering.
export function CommunitySection({ data }: { data: CommunitySectionData }) {
  return (
    <section className="bg-white px-4 py-20 pb-24 sm:px-8 sm:pb-32">
      <div className="mx-auto max-w-site">
        <h2 className="mx-auto max-w-[26ch] text-balance text-center text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
          {data.title}
        </h2>
        <div className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2 md:grid-cols-3">
          {data.cards.map((card, idx) => {
            const buttons = card.btns ?? (card.btn ? [card.btn] : []);
            return (
              <div
                key={idx}
                className="flex flex-col gap-3 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_1px_2px_rgba(21,21,21,0.04)] sm:p-7"
              >
                <div className="flex items-center gap-3">
                  {card.image && (
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#eef4f3]">
                      <Image src={card.image} alt="" width={22} height={22} />
                    </span>
                  )}
                  <h3 className="text-lg leading-snug">{parse(card.title)}</h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground [&_a]:font-semibold [&_a]:text-prism-cyan-700">
                  {parse(card.description)}
                </p>
                {buttons.length > 0 && (
                  <div className="mt-auto flex flex-wrap gap-x-6 gap-y-2 pt-2">
                    {buttons.map((btn) => (
                      <a
                        key={btn.url}
                        href={btn.url}
                        className="group flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-prism-cyan-700"
                      >
                        {btn.label}
                        <ArrowRight
                          className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                          aria-hidden
                        />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
