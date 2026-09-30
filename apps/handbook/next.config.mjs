import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

// The handbook is its own multi-zone app, mounted at /handbook the same way
// docs and blog are mounted at /docs and /blog. apps/site does not forward
// /handbook/* yet; see README.md for the rewrite to add when it goes public.
// No CSP/security headers yet either: copy the block from apps/blog when this
// gets a public origin.

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  basePath: "/handbook",
  assetPrefix: "/handbook-static",
  images: { unoptimized: true },
  transpilePackages: ["@prisma/eclipse"],
  async redirects() {
    return [
      {
        source: "/",
        destination: "/handbook",
        permanent: false,
        basePath: false,
      },
    ];
  },
};

export default withMDX(config);
