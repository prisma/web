#!/usr/bin/env bash
# Validate a set of rendered covers: dimensions, size budget, embedded fonts, frontmatter wiring.
#
# Usage:
#   validate-covers.sh <blog-app-dir> <slug> [<slug> ...]
#   validate-covers.sh <blog-app-dir> --all        # every slug in content/blog
#
# Checks per slug:
#   - public/<slug>/imgs/hero.svg exists, declares viewBox 0 0 1200 630, has embedded @font-face
#   - public/<slug>/imgs/meta.png exists, is exactly 1200x630, under 1 MB
#   - content/blog/<slug>/index.mdx frontmatter points at /<slug>/imgs/hero.svg and meta.png
set -uo pipefail

BLOG="${1:?blog app dir required (e.g. apps/blog)}"; shift
if [ "${1:-}" = "--all" ]; then
  SLUGS=$(ls "$BLOG/content/blog")
else
  SLUGS="$*"
fi

fail=0
for slug in $SLUGS; do
  dir="$BLOG/public/$slug/imgs"
  mdx="$BLOG/content/blog/$slug/index.mdx"
  err=""
  if [ ! -f "$dir/hero.svg" ]; then err="$err no-hero-svg"; else
    grep -q 'viewBox="0 0 1200 630"' "$dir/hero.svg" || err="$err bad-viewbox"
    grep -q '@font-face' "$dir/hero.svg" || err="$err fonts-not-embedded"
  fi
  if [ ! -f "$dir/meta.png" ]; then err="$err no-meta-png"; else
    dim=$(magick identify -format '%wx%h' "$dir/meta.png" 2>/dev/null)
    [ "$dim" = "1200x630" ] || err="$err meta-dim=$dim"
    sz=$(stat -f%z "$dir/meta.png" 2>/dev/null || stat -c%s "$dir/meta.png")
    [ "$sz" -lt 1048576 ] || err="$err meta-size=$sz"
  fi
  if [ -f "$mdx" ]; then
    grep -q "heroImagePath: \"/$slug/imgs/hero.svg\"" "$mdx" || err="$err frontmatter-hero"
    grep -q "metaImagePath: \"/$slug/imgs/meta.png\"" "$mdx" || err="$err frontmatter-meta"
  fi
  if [ -n "$err" ]; then echo "FAIL $slug:$err"; fail=1; fi
done
[ "$fail" = 0 ] && echo "all covers valid"
exit $fail
