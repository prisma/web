#!/usr/bin/env python3
"""Embed Prisma brand fonts into a cover SVG so it renders correctly anywhere.

A cover SVG that only references the brand families by name renders with fallback
fonts wherever they are not installed (browsers, Figma, GitHub preview). This subsets
Mona Sans (800), Inter (400) and Geist Mono (500) to just the glyphs the SVG uses,
then injects them as base64 @font-face rules. If fonttools/brotli are unavailable,
it embeds the bundled WOFF2 files whole. The fallback is larger but keeps the SVG
self-contained without a Python dependency install. The PNG export does not need
this (it resolves fonts via fontconfig), but a committed/shared SVG should be
embedded.

Usage:
  python3 embed-fonts.py <hero.svg> [--fonts <dir>]

<dir> defaults to the bundled assets/fonts directory. fonttools + brotli are optional
(`pip install fonttools brotli`) and make smaller SVGs. Idempotent: skips a file that
already has an @font-face block.
"""
import argparse
import base64
import io
import re
import sys
from pathlib import Path

FACES = [
    ("Mona Sans", 800, "MonaSans.woff2"),
    ("Inter", 400, "Inter-Regular.woff2"),
    ("Geist Mono", 500, "GeistMono.woff2"),
]


def find_fonts_dir(explicit: str | None) -> Path:
    if explicit:
        return Path(explicit)
    # the skill bundles its brand fonts next to this script
    cand = Path(__file__).resolve().parent.parent / "assets" / "fonts"
    if cand.is_dir():
        return cand
    sys.exit("error: no --fonts dir given and no bundled assets/fonts found")


def used_chars(svg: str) -> str:
    # collect text inside <text>/<tspan>, ignore markup; add a safe punctuation set
    chars = set("0123456789%,/.()-:· ")
    for m in re.findall(r"<(?:text|tspan)[^>]*>([^<]*)</", svg):
        chars.update(m)
    return "".join(sorted(chars))


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("svg")
    ap.add_argument("--fonts")
    args = ap.parse_args()

    try:
        from fontTools import subset  # noqa: F401
        import brotli  # noqa: F401
    except ImportError:
        subset = None
    else:
        from fontTools import subset

    svg_path = Path(args.svg)
    svg = svg_path.read_text()
    if "@font-face" in svg:
        print(f"{svg_path}: already has embedded fonts — skipping")
        return

    fonts = find_fonts_dir(args.fonts)
    text = used_chars(svg)
    rules = []
    for family, weight, fname in FACES:
        font_path = fonts / fname
        if not font_path.is_file():
            sys.exit(f"error: bundled font not found: {font_path}")
        if subset:
            opts = subset.Options()
            opts.flavor = "woff2"
            opts.desubroutinize = True
            font = subset.load_font(str(font_path), opts)
            ss = subset.Subsetter(options=opts)
            ss.populate(text=text)
            ss.subset(font)
            buf = io.BytesIO()
            subset.save_font(font, buf, opts)
            font_bytes = buf.getvalue()
        else:
            font_bytes = font_path.read_bytes()
        b64 = base64.b64encode(font_bytes).decode()
        rules.append(
            f"    @font-face{{font-family:'{family}';font-style:normal;"
            f"font-weight:{weight};src:url(data:font/woff2;base64,{b64}) format('woff2');}}"
        )
    style = "  <style>\n" + "\n".join(rules) + "\n  </style>\n"

    if "<defs>" in svg:
        svg = svg.replace("<defs>\n", "<defs>\n" + style, 1)
    else:
        svg = re.sub(r"(<svg[^>]*>\n)", r"\1  <defs>\n" + style + "  </defs>\n", svg, 1)
    svg_path.write_text(svg)
    mode = "subset" if subset else "full-font fallback"
    print(f"{svg_path}: embedded {', '.join(f for f, _, _ in FACES)} via {mode} ({len(svg)} bytes)")


if __name__ == "__main__":
    main()
