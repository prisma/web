import { module } from "@prisma/composer";
import gateway from "./composer/gateway/service.ts";
import site from "./composer/site.ts";
import docs from "./composer/docs.ts";
import blog from "./composer/blog.ts";
import handbook from "./composer/handbook.ts";
import eclipse from "./composer/eclipse.ts";
import { websiteInputs } from "./composer/website.ts";
import { envSecret } from "@prisma/composer-prisma-cloud";

export default module("web", ({ provision }) => {
  provision(gateway, {
    deps: {
      site: provision(site, { input: websiteInputs.site }).http,
      docs: provision(docs, { input: websiteInputs.docs }).http,
      blog: provision(blog, { input: websiteInputs.blog }).http,
      handbook: provision(handbook, { input: websiteInputs.handbook }).http,
      eclipse: provision(eclipse, { input: websiteInputs.eclipse }).http,
    },
    input: { proxyKey: envSecret("WEB_PROXY_KEY") },
  });
});
