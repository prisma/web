import type { ReactNode } from "react";

export type ProofItem = {
  name: string;
  role: string;
  company: string;
  quote: string;
  logo: { src: string; width: number };
};

/**
 * Separate quote cards: own surface, padding, and gap. Not a fused slab.
 * Called as a function so Markdown still sees the figures.
 */
export function comparisonProofCards(items: readonly ProofItem[]): ReactNode {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <figure
          key={item.name}
          className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6"
        >
          <img
            src={item.logo.src}
            alt=""
            width={item.logo.width}
            height={20}
            className="h-5 w-auto self-start"
          />
          <blockquote className="text-pretty text-lg leading-8 text-primary">
            &ldquo;{item.quote}&rdquo;
          </blockquote>
          <figcaption className="text-sm leading-6 text-muted-foreground">
            <span className="font-medium text-foreground">{item.name}</span>, {item.role},{" "}
            {item.company}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
