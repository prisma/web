#!/usr/bin/env bash
# Build contact sheets from rendered meta.png covers for batch design review.
#
# Usage: contact-sheet.sh <out-dir> <meta.png> [<meta.png> ...]
# Emits <out-dir>/sheet-NN.png, 24 covers per sheet (6x4), each 300px wide —
# the thumbnail size the review must pass at. Inspect every sheet for repeated
# layouts, repeated gradients, density, and thumbnail legibility.
set -euo pipefail
OUT="${1:?out dir required}"; shift
mkdir -p "$OUT"
i=0; page=0; batch=()
flush() {
  [ ${#batch[@]} -eq 0 ] && return
  page=$((page+1))
  magick montage "${batch[@]}" -tile 6x -geometry 300x158+6+6 -background '#d8d8d8' \
    "$OUT/$(printf 'sheet-%02d.png' "$page")"
  batch=()
}
for f in "$@"; do
  batch+=("$f"); i=$((i+1))
  [ $((i % 24)) -eq 0 ] && flush
done
flush
echo "wrote $page sheet(s) to $OUT"
