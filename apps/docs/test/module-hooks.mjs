// Resolution hooks that let node:test render app components which import assets
// and Next-only modules. Registered from `test/register-hooks.mjs`.
const STUBS = {
  "next/image": new URL("./stubs/next-image.mjs", import.meta.url).href,
  "next/link": new URL("./stubs/next-link.mjs", import.meta.url).href,
};

const SVG_STUB = new URL("./stubs/svg.mjs", import.meta.url).href;
const EMPTY_STUB = new URL("./stubs/empty.mjs", import.meta.url).href;

export async function resolve(specifier, context, nextResolve) {
  const stub = STUBS[specifier];
  if (stub) return { url: stub, shortCircuit: true };
  // PNGs too: the shared brand menu around the navbar logo imports both.
  if (/\.(svg|png)$/.test(specifier)) return { url: SVG_STUB, shortCircuit: true };
  if (specifier.endsWith(".css")) return { url: EMPTY_STUB, shortCircuit: true };
  return nextResolve(specifier, context);
}
