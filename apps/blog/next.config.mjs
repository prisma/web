import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: "export",
  images: { unoptimized: true },
  transpilePackages: ["@prisma/eclipse"],
};

export default withMDX(config);
