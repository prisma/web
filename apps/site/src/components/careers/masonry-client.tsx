"use client";

import dynamic from "next/dynamic";

const MasonryPict = dynamic(
  () =>
    import("./masonry").then((mod) => ({
      default: mod.MasonryPict,
    })),
  { ssr: false },
);

export default MasonryPict;
