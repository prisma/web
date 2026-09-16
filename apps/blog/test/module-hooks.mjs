// Resolution hooks that let node:test render app components which import
// Next-only modules. Registered from `test/register-hooks.mjs`.
const STUBS = {
  "next/link": new URL("./stubs/next-link.mjs", import.meta.url).href,
  "next/navigation": new URL("./stubs/next-navigation.mjs", import.meta.url).href,
};

export async function resolve(specifier, context, nextResolve) {
  const stub = STUBS[specifier];
  if (stub) return { url: stub, shortCircuit: true };
  return nextResolve(specifier, context);
}
