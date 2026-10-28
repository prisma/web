import { registerHooks } from "node:module";

// Node's SSR/content tests do not run Next's static-image loader. Supply its
// data shape for image imports; real URLs/dimensions/layout are exercised by
// the production build and browser/Composer smoke checks.
registerHooks({
  load(url, context, nextLoad) {
    if (/\.(?:avif|webp|png|jpe?g|gif)$/.test(url)) {
      return {
        format: "module",
        shortCircuit: true,
        source: `export default ${JSON.stringify({ src: new URL(url).pathname, width: 1, height: 1 })};`,
      };
    }
    return nextLoad(url, context);
  },
});
