import { defineComputeConfig } from "@prisma/compute-sdk/config";

const computeEnv = {
  vars: {
    PRISMA_COMPUTE_DEPLOY: "true",
  },
};

const docsComputeOrigin = "https://cmqkoe8hg0cyt03l79u7thj20.fra.prisma.build";
const blogComputeOrigin = "https://cmqkpw54o0yp4zndvj3zei5ml.fra.prisma.build";

const siteComputeEnv = {
  vars: {
    ...computeEnv.vars,
    NEXT_DOCS_ORIGIN: docsComputeOrigin,
    NEXT_BLOG_ORIGIN: blogComputeOrigin,
  },
};

export default defineComputeConfig({
  apps: {
    site: {
      name: "site",
      root: "apps/site",
      framework: "nextjs",
      httpPort: 3000,
      env: siteComputeEnv,
      build: {
        command: `NEXT_DOCS_ORIGIN=${docsComputeOrigin} NEXT_BLOG_ORIGIN=${blogComputeOrigin} PRISMA_COMPUTE_DEPLOY=true node ../../scripts/compute-build-app.mjs site`,
        outputDirectory: ".next/standalone",
      },
    },
    blog: {
      name: "blog",
      root: "apps/blog",
      framework: "bun",
      entry: ".compute/server.ts",
      httpPort: 3000,
      env: computeEnv,
      build: {
        command: "PRISMA_COMPUTE_DEPLOY=true node ../../scripts/compute-build-static-app.mjs blog",
      },
    },
    docs: {
      name: "docs",
      root: "apps/docs",
      framework: "bun",
      entry: ".compute/server.ts",
      httpPort: 3000,
      env: computeEnv,
      build: {
        command: "PRISMA_COMPUTE_DEPLOY=true node ../../scripts/compute-build-static-app.mjs docs",
      },
    },
  },
});
