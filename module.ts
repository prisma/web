import { module } from "@prisma/composer";
import gateway from "./composer/gateway/service.ts";
import site from "./composer/site.ts";
import docs from "./composer/docs.ts";
import blog from "./composer/blog.ts";
import handbook from "./composer/handbook.ts";
import eclipse from "./composer/eclipse.ts";
import { websiteInputs } from "./composer/website.ts";
import { envSecret, serviceOrigin } from "@prisma/composer-prisma-cloud";
import { mediaNames } from "./composer/media/service.ts";
import { blogMedia } from "./composer/media/services.ts";

export default module("web", ({ provision }) => {
  provision(gateway, {
    input: {
      site: serviceOrigin("site"),
      docs: serviceOrigin("docs"),
      blog: serviceOrigin("blog"),
      handbook: serviceOrigin("handbook"),
      eclipse: serviceOrigin("eclipse"),
      proxyKey: envSecret("WEB_PROXY_KEY"),
      ...(Object.fromEntries(mediaNames.map((name) => [name, serviceOrigin(name)])) as Record<
        (typeof mediaNames)[number],
        ReturnType<typeof serviceOrigin>
      >),
    },
  });
  provision(site, { input: websiteInputs.site });
  provision(docs, { input: websiteInputs.docs });
  provision(blog, { input: websiteInputs.blog });
  provision(handbook, { input: websiteInputs.handbook });
  provision(eclipse, { input: websiteInputs.eclipse });
  for (const service of blogMedia) provision(service, { input: {} });
});
