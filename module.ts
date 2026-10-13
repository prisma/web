import { module } from "@prisma/composer";
import gateway from "./composer/gateway/service.ts";
import site from "./composer/site.ts";
import docs from "./composer/docs.ts";
import blog from "./composer/blog.ts";
import handbook from "./composer/handbook.ts";
import eclipse from "./composer/eclipse.ts";
import { websiteInputs } from "./composer/website.ts";
import { serviceOrigin } from "@prisma/composer-prisma-cloud";

export default module("web", ({ provision }) => {
  provision(gateway, {
    input: {
      site: serviceOrigin("site"),
      docs: serviceOrigin("docs"),
      blog: serviceOrigin("blog"),
      handbook: serviceOrigin("handbook"),
      eclipse: serviceOrigin("eclipse"),
    },
  });
  provision(site, { input: websiteInputs.site });
  provision(docs, { input: websiteInputs.docs });
  provision(blog, { input: websiteInputs.blog });
  provision(handbook, { input: websiteInputs.handbook });
  provision(eclipse, { input: websiteInputs.eclipse });
});
