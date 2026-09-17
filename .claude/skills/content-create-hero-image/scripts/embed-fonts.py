#!/usr/bin/env python3
"""Embed Prisma brand fonts into a cover SVG so it renders correctly anywhere.

A cover SVG that only references the brand families by name renders with fallback
fonts wherever they are not installed (browsers, Figma, GitHub preview). This subsets
Sora, Inter and Mona Sans Mono (variable fonts) to just the glyphs the SVG uses,
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

# 2026 brand faces. All three are variable fonts, so the @font-face rule carries
# a weight RANGE and one embed serves every weight the SVG uses (Sora 500/600,
# Inter 400/600, Mona Sans Mono 500). The old static faces (Mona Sans 800,
# Geist Mono) are retired but their files remain for re-rendering legacy covers.
FACES = [
    ("Sora", "100 800", "Sora-VF.woff2"),
    ("Inter", "100 900", "Inter-VF.woff2"),
    ("Mona Sans Mono", "200 900", "MonaSansMono-VF.woff2"),
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
