#!/usr/bin/env python3

import argparse
import re
import sys
from pathlib import Path


WEAK_PHRASES = [
    "this guide walks you through",
    "simply",
    "easily",
    "just",
    "seamlessly",
    "powerful",
    "robust",
    "intuitive",
    "comprehensive",
    "leverage",
    "utilize",
    "allows you to",
    "in order to",
    "navigate to",
    "you can now",
]

AMBIGUOUS_HEADINGS = {"overview", "concepts", "advanced", "more", "notes"}
PLACEHOLDER_PATTERNS = [
    re.compile(r"\bTODO\b", re.IGNORECASE),
    re.compile(r"\bFIXME\b", re.IGNORECASE),
    re.compile(r"\bTBD\b", re.IGNORECASE),
    re.compile(r"\[your [^\]]+\]", re.IGNORECASE),
    re.compile(r"\byour-new-guide\b", re.IGNORECASE),
    re.compile(r"\blorem ipsum\b", re.IGNORECASE),
]
VERIFY_TERMS = ("verify", "verification", "expected result", "check the result")
PROCEDURE_HEADING_RE = re.compile(r"^#{2,3}\s+\d+([.)]|\s)")
HEADING_RE = re.compile(r"^(#{1,6})\s+(.+?)\s*$")
LINK_RE = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")
FRONTMATTER_RE = re.compile(r"\A---\n(.*?)\n---\n?", re.DOTALL)


def parse_args():
    parser = argparse.ArgumentParser(
        description="Check Markdown or MDX files for high-value structural doc issues.",
    )
    parser.add_argument("files", nargs="+", help="Markdown or MDX files to check")
    return parser.parse_args()


def load_file(path):
    text = path.read_text(encoding="utf-8")
    frontmatter = {}
    body = text
    body_line_offset = 0

    match = FRONTMATTER_RE.match(text)
    if match:
        body = text[match.end() :]
        body_line_offset = text[: match.end()].count("\n")
        for raw_line in match.group(1).splitlines():
            if ":" not in raw_line:
                continue
            key, value = raw_line.split(":", 1)
            frontmatter[key.strip()] = value.strip().strip("'\"")

    return frontmatter, body, body_line_offset


def normalize_heading(text):
    text = re.sub(r"`+", "", text)
    text = re.sub(r"\s+", " ", text.strip().lower())
    return text


def iter_non_fence_lines(body, body_line_offset):
    in_fence = False
    fence_delim = None

    for line_no, line in enumerate(body.splitlines(), start=1):
        stripped = line.lstrip()
        match = re.match(r"^(`{3,})(.*)$", stripped)
        if match:
            ticks = match.group(1)
            if not in_fence:
                in_fence = True
                fence_delim = ticks
            elif ticks == fence_delim:
                in_fence = False
                fence_delim = None
            continue

        if not in_fence:
            yield line_no + body_line_offset, line


def find_code_fence_issues(body, body_line_offset):
    errors = []
    in_fence = False
    fence_delim = None

    for line_no, line in enumerate(body.splitlines(), start=1):
        stripped = line.lstrip()
        match = re.match(r"^(`{3,})(.*)$", stripped)
        if not match:
            continue

        ticks, rest = match.groups()
        if not in_fence:
            info = rest.strip()
            if not info:
                errors.append((line_no, "Code fence is missing a language"))
            else:
                first = info.split()[0]
                if "=" in first:
                    errors.append((line_no, "Code fence is missing a language"))
            in_fence = True
            fence_delim = ticks
        elif ticks == fence_delim:
            in_fence = False
            fence_delim = None

    return [(line_no + body_line_offset, message) for line_no, message in errors]


def intro_word_count(body):
    first_h2 = re.search(r"^##\s+", body, re.MULTILINE)
    intro = body[: first_h2.start()] if first_h2 else body
    intro = re.sub(r"```.*?```", "", intro, flags=re.DOTALL)
    words = re.findall(r"\b\w+\b", intro)
    return len(words)


def has_verification_heading(headings):
    for _level, text, _line_no in headings:
        lowered = normalize_heading(text)
        if any(term in lowered for term in VERIFY_TERMS):
            return True
    return False


def looks_procedural(body, headings):
    numbered_list_items = re.findall(r"^\s*\d+\.\s+", body, re.MULTILINE)
    numbered_headings = [h for h in headings if PROCEDURE_HEADING_RE.match(f"{'#' * h[0]} {h[1]}")]
    return len(numbered_list_items) >= 3 or len(numbered_headings) >= 2


def collect_headings(body, body_line_offset):
    headings = []
    for line_no, line in iter_non_fence_lines(body, body_line_offset):
        match = HEADING_RE.match(line)
        if match:
            level = len(match.group(1))
            text = match.group(2).strip()
            headings.append((level, text, line_no))
    return headings


def check_file(path):
    frontmatter, body, body_line_offset = load_file(path)
    errors = []
    warnings = []

    title = frontmatter.get("title")
    headings = collect_headings(body, body_line_offset)
    body_h1s = [(level, text, line_no) for level, text, line_no in headings if level == 1]
    total_h1s = len(body_h1s) + (1 if title else 0)

    if total_h1s == 0:
        errors.append((1, "Missing H1 (frontmatter title or markdown # heading)"))
    elif total_h1s > 1:
        errors.append((body_h1s[0][2] if body_h1s else 1, "More than one H1"))

    errors.extend(find_code_fence_issues(body, body_line_offset))

    for pattern in PLACEHOLDER_PATTERNS:
        for match in pattern.finditer(body):
            line_no = body[: match.start()].count("\n") + 1 + body_line_offset
            errors.append((line_no, f"Placeholder text found: {match.group(0)!r}"))

    seen_h2 = {}
    seen_h3 = {}
    current_h2 = None
    for level, text, line_no in headings:
        if level in (2, 3):
            normalized = normalize_heading(text)
            if level == 2:
                current_h2 = normalized
                if normalized in seen_h2:
                    errors.append((line_no, f"Duplicate H2 heading: {text}"))
                else:
                    seen_h2[normalized] = line_no
            else:
                key = (current_h2, normalized)
                if key in seen_h3:
                    errors.append((line_no, f"Duplicate H3 heading: {text}"))
                else:
                    seen_h3[key] = line_no

            if normalized in AMBIGUOUS_HEADINGS:
                warnings.append((line_no, f"Ambiguous heading: {text}"))

    weak_pattern = re.compile(
        "|".join(
            rf"\b{re.escape(phrase)}\b" if phrase.isalpha() or " " in phrase else re.escape(phrase)
            for phrase in WEAK_PHRASES
        ),
        re.IGNORECASE,
    )
    for line_no, line in iter_non_fence_lines(body, body_line_offset):
        stripped = line.strip()
        if stripped.startswith("Bad:") or stripped.startswith("Better:"):
            continue
        if stripped.startswith("`") and stripped.endswith("`"):
            continue
        if re.match(r"^\s*-\s*`.*`\s*$", line):
            continue
        for match in weak_pattern.finditer(line):
            warnings.append((line_no, f"Weak phrase: {match.group(0)!r}"))

    for line_no, line in iter_non_fence_lines(body, body_line_offset):
        for match in LINK_RE.finditer(line):
            label = match.group(1).strip().lower()
            if label in {"here", "click here"}:
                errors.append((line_no, f"Ambiguous link text: {match.group(1)!r}"))

    intro_words = intro_word_count(body)
    if intro_words > 140:
        warnings.append((body_line_offset + 1, f"Intro before first H2 is long ({intro_words} words)"))

    if looks_procedural(body, headings) and not has_verification_heading(headings):
        warnings.append((body_line_offset + 1, "Page looks procedural but has no verification section"))

    return errors, warnings


def main():
    args = parse_args()
    error_count = 0
    warning_count = 0

    for raw_path in args.files:
        path = Path(raw_path)
        if not path.exists():
            print(f"ERROR {raw_path}: file not found")
            error_count += 1
            continue

        errors, warnings = check_file(path)

        for line_no, message in errors:
            print(f"ERROR {path}:{line_no}: {message}")
        for line_no, message in warnings:
            print(f"WARNING {path}:{line_no}: {message}")

        error_count += len(errors)
        warning_count += len(warnings)

    if error_count:
        print(f"\nFound {error_count} error(s) and {warning_count} warning(s).")
        sys.exit(2)
    if warning_count:
        print(f"\nFound {warning_count} warning(s).")
        sys.exit(1)

    print("No issues found.")
    sys.exit(0)


if __name__ == "__main__":
    main()
