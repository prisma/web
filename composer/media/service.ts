import node from "@prisma/composer/node";
import { rawHttpContract } from "@prisma/composer/http";
import { compute } from "@prisma/composer-prisma-cloud";
import { type } from "arktype";

export const mediaNames = ["blogmedia0", "blogmedia1", "blogmedia2", "blogmedia3"] as const;

export function mediaService(name: (typeof mediaNames)[number], source: string) {
  return compute({
    name,
    deps: {},
    expose: { http: rawHttpContract },
    input: type({}),
    build: node({
      module: source,
      dir: `../../dist/composer/${name}`,
      entry: "server.mjs",
    }),
  });
}
