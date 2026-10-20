export const answerProducts = {
  postgres: {
    name: "Prisma Postgres",
    path: "/postgres",
    guidesPath: "/postgres/guides",
    guidesTitle: "Prisma Postgres guides",
    description:
      "Practical answers to choosing, hosting and running Postgres for your TypeScript app.",
    accent: "yellow",
  },
  compute: {
    name: "Prisma Compute",
    path: "/compute",
    guidesPath: "/compute/guides",
    guidesTitle: "Prisma Compute guides",
    description:
      "Practical answers to hosting TypeScript apps, managing costs and choosing a deployment setup.",
    accent: "red",
  },
} as const;

export type AnswerProduct = keyof typeof answerProducts;
export const answerProductIds = Object.keys(answerProducts) as AnswerProduct[];

/** Resolve a guide's product context, rejecting folders without a registered route adapter. */
export function getAnswerProduct(product: string) {
  if (!Object.hasOwn(answerProducts, product))
    throw new Error(`Unknown answer-page product: ${product}`);
  return answerProducts[product as AnswerProduct];
}
