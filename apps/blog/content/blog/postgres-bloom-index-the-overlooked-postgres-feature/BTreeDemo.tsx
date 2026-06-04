import { highlight, type HighlightedCode } from "codehike/code";
import { BTreeDemoClient, type BTreePhase } from "./BTreeDemoClient";

const SOURCE = `function lookup(tree, key) {
  let node = tree.root;
  while (!node.isLeaf) {
    const child = node.childFor(key);
    node = child;
  }
  return node.findEntry(key)?.rowPointer;
}

lookup(idx, "t42"); // -> row 142`;

const PHASES: BTreePhase[] = [
  {
    label: "Start at the root",
    caption:
      "A B-tree is a sorted tree of (key, pointer) entries. Lookups always start at the root.",
    lines: { from: 1, to: 2 },
    activeRoot: false,
    activeLeaf: null,
    matchedKey: null,
    query: null,
  },
  {
    label: 'lookup("t42")',
    caption: "We want to find the row for tenant t42. Compare against the root keys.",
    lines: { from: 10, to: 10 },
    activeRoot: true,
    activeLeaf: null,
    matchedKey: null,
    query: "t42",
  },
  {
    label: "Pick the child",
    caption:
      "t42 is greater than or equal to t20 and less than t50, so descend into the middle child.",
    lines: { from: 3, to: 5 },
    activeRoot: true,
    activeLeaf: 1,
    matchedKey: null,
    query: "t42",
  },
  {
    label: "Search the leaf",
    caption: "The middle leaf is sorted. Scan it for the exact key.",
    lines: { from: 7, to: 7 },
    activeRoot: false,
    activeLeaf: 1,
    matchedKey: "t42",
    query: "t42",
  },
  {
    label: "Return the row pointer",
    caption: "The leaf entry holds a pointer to row 142 on disk. Follow it to read the row.",
    lines: { from: 7, to: 7 },
    activeRoot: false,
    activeLeaf: 1,
    matchedKey: "t42",
    query: "t42",
    found: true,
  },
];

export async function BTreeDemo() {
  const baseCode = (await highlight(
    { value: SOURCE, lang: "typescript", meta: "" },
    "github-from-css",
  )) as HighlightedCode;
  return <BTreeDemoClient baseCode={baseCode} phases={PHASES} />;
}
