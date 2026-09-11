// Stands in for `import logo from "./logo.svg"`, which only Next's webpack/turbopack
// loader understands. Shaped like the StaticImageData object Next hands to <Image>.
export default {
  src: "/docs-static/logo.svg",
  height: 28,
  width: 96,
  blurWidth: 0,
  blurHeight: 0,
};
