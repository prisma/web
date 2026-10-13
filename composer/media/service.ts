import node from "@prisma/composer/node";
import { compute } from "@prisma/composer-prisma-cloud";
import { type } from "arktype";

export const mediaNames = ["blogmedia0", "blogmedia1", "blogmedia2", "blogmedia3"] as const;
export const mediaInputSchema = Object.fromEntries(
  mediaNames.map((name) => [name, "string"]),
) as Record<(typeof mediaNames)[number], "string">;

export function mediaService(name: (typeof mediaNames)[number], source: string) {
  return compute({
    name,
    deps: {},
    input: type({}),
    build: node({
      module: source,
      dir: `../../dist/composer/${name}`,
      entry: "server.mjs",
    }),
  });
}
