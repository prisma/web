#!/usr/bin/env python3
"""Flags staccato prose: runs of short, one-clause sentences with no connective between them.

Usage: check-staccato.py <file.mdx> [more files...]   Exit 1 on any hit.

A hit is a paragraph containing three or more consecutive sentences that are each
under MAX_WORDS words. Fenced code, tables, headings, list items, front matter, and
import lines are skipped. Colons that introduce a code span or example are not
treated as sentence ends. The heuristic is deliberately simple: it finds the
paragraphs a human should read aloud, and the reader decides whether the sentences
belong together. Rejoin them with "because", "so", "but", "while", or a colon when
they are cause and effect, contrast, or condition and result. Leave them apart when
they are separate ideas.
"""
import re
import sys

MAX_WORDS = 9
RUN = 3

CODE = re.compile(r"`[^`]*`")
LINK = re.compile(r"\]\([^)]*\)")
SENT_END = re.compile(r"(?<=[.!?])\s+(?=[A-Z`\"'(])")


def paragraphs(text):
    """Yield (line_number, paragraph) for prose paragraphs only."""
    lines = text.split("\n")
    out, start, infence, infront = [], None, False, False
    for i, line in enumerate(lines, 1):
        if i == 1 and line.strip() == "---":
            infront = True
            continue
        if infront:
            if line.strip() == "---":
                infront = False
            continue
        if re.match(r"^\s*(```|~~~)", line):
            infence = not infence
            continue
        if infence or line.startswith(("    ", "\t")):
            continue
        stripped = line.strip()
        if not stripped:
            if out:
                yield start, " ".join(out)
            out, start = [], None
            continue
        if re.match(r"^(#|\||[-*+] |\d+\. |import |export |<|{/\*)", stripped):
            if out:
                yield start, " ".join(out)
            out, start = [], None
            continue
        if start is None:
            start = i
        out.append(stripped)
    if out:
        yield start, " ".join(out)


def sentences(para):
    para = CODE.sub("CODE", para)
    para = LINK.sub("]", para)
    return [s.strip() for s in SENT_END.split(para) if s.strip()]


def check(path):
    hits = []
    text = open(path, encoding="utf-8").read()
    for lineno, para in paragraphs(text):
        sents = sentences(para)
        short = [len(s.split()) < MAX_WORDS for s in sents]
        run = 0
        for j, is_short in enumerate(short):
            run = run + 1 if is_short else 0
            if run == RUN:
                first = j - RUN + 1
                hits.append((lineno, " | ".join(sents[first : j + 1])))
                break
    return hits


def main(argv):
    status = 0
    for path in argv:
        hits = check(path)
        if hits:
            status = 1
            print(f"== {path}")
            for lineno, snippet in hits:
                print(f"{lineno}: {snippet[:180]}")
    print("staccato check: clean" if status == 0 else "staccato check: clipped runs found, read them aloud")
    return status


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
