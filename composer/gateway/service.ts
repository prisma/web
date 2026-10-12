import node from "@prisma/composer/node";
import { compute } from "@prisma/composer-prisma-cloud";
import { type } from "arktype";

export default compute({
  name: "gateway",
  deps: {},
  input: type({
    site: "string",
    docs: "string",
    blog: "string",
    handbook: "string",
    eclipse: "string",
  }),
  build: node({ module: import.meta.url, dir: "../../dist/composer/gateway", entry: "server.mjs" }),
});
