import node from "@prisma/composer/node";
import { compute } from "@prisma/composer-prisma-cloud";
import { type } from "arktype";
import { secretString } from "@prisma/composer/arktype";
import { rawHttp } from "@prisma/composer/http";

export default compute({
  name: "gateway",
  deps: {
    site: rawHttp(),
    docs: rawHttp(),
    blog: rawHttp(),
    handbook: rawHttp(),
    eclipse: rawHttp(),
  },
  input: type({
    proxyKey: secretString(),
    "agentFront?": type({
      "ORA_INGEST_KEY?": secretString(),
      "ORA_KEY?": secretString(),
      "ORA_SALT?": secretString(),
      "ORA_DOMAIN_ID?": "string",
      "ORA_POLICY_URL?": "string",
      "ORA_EDGE?": "string",
      "ORA_INGEST_URL?": "string",
      "ORA_INGEST?": "string",
    }),
  }),
  build: node({ module: import.meta.url, dir: "../../dist/composer/gateway", entry: "server.mjs" }),
});
