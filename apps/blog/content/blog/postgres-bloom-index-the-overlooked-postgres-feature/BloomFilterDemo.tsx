import { highlight, type HighlightedCode } from "codehike/code";
import { BloomFilterDemoClient } from "./BloomFilterDemoClient";

const SNIPPETS: string[] = [
  `const bits = new Uint8Array(16);
// all zeros, nothing added`,

  `function add(item) {
  for (const i of hashes(item)) {
    bits[i] = 1;
  }
}

add("alice"); // hashes -> [2, 7, 11]`,

  `add("bob"); // hashes -> [4, 7, 13]
// bit 7 was already 1 from alice
// no way to tell who set it`,

  `function check(item) {
  return hashes(item).every(
    (i) => bits[i] === 1,
  );
}

check("alice"); // [2, 7, 11] all 1
// probably present, recheck`,

  `check("carol"); // [0, 5, 9]
// bits[0] is 0
// definitely not present`,

  `check("dave"); // [4, 11, 13]
// all three happen to be 1
// from alice + bob
// dave was never added
// false positive`,
];

export async function BloomFilterDemo() {
  const highlighted = (await Promise.all(
    SNIPPETS.map((value) => highlight({ value, lang: "typescript", meta: "" }, "github-from-css")),
  )) as HighlightedCode[];
  return <BloomFilterDemoClient snippets={highlighted} />;
}
