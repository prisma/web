import { highlight, type HighlightedCode } from "codehike/code";
import { HashDemoClient, type HashPhase } from "./HashDemoClient";

const SOURCE = `function hashes(item) {
  const h1 = fnv1a(item)   % 16;
  const h2 = djb2(item)    % 16;
  const h3 = murmur3(item) % 16;
  return [h1, h2, h3];
}

hashes("alice"); // [2, 7, 11]`;

const PHASES: HashPhase[] = [
  {
    label: "Input",
    caption:
      'We need three independent bit positions for "alice". Start by feeding the name into the first hash.',
    lines: { from: 1, to: 1 },
    completed: 0,
    activeHash: null,
  },
  {
    label: "h1 = fnv1a(item) % 16",
    caption: "FNV-1a churns the bytes of 'alice' into a 32-bit number, then mod 16 picks bit 2.",
    lines: { from: 2, to: 2 },
    completed: 0,
    activeHash: 0,
  },
  {
    label: "h2 = djb2(item) % 16",
    caption: "DJB2 is a different mixer, so the same input lands on bit 7. The three hashes are independent.",
    lines: { from: 3, to: 3 },
    completed: 1,
    activeHash: 1,
  },
  {
    label: "h3 = murmur3(item) % 16",
    caption: "MurmurHash3 closes out the trio with bit 11.",
    lines: { from: 4, to: 4 },
    completed: 2,
    activeHash: 2,
  },
  {
    label: "return [h1, h2, h3]",
    caption:
      "Bits 2, 7, and 11 are the fingerprint of 'alice'. The bloom filter sets these three bits to remember her.",
    lines: { from: 5, to: 5 },
    completed: 3,
    activeHash: null,
  },
];

export async function HashDemo() {
  const baseCode = (await highlight(
    { value: SOURCE, lang: "typescript", meta: "" },
    "github-from-css",
  )) as HighlightedCode;
  return <HashDemoClient baseCode={baseCode} phases={PHASES} />;
}
