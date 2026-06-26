#!/usr/bin/env bash
# Export a cover SVG to a pixel-exact PNG in Prisma's brand fonts.
#
# Usage:
#   export-png.sh <input.svg> <output.png> <width> <height>
#
# Example (social/OG):
#   export-png.sh hero.svg meta.png 1200 630
#
# Fonts: covers use Mona Sans (display/headings), Inter (body) and Geist Mono (data/code).
# This skill bundles those families in assets/fonts, and the script points
# fontconfig at them for the render. To render with a different set, point
# FONT_DIR at a folder of font files.
set -euo pipefail

IN="${1:?input svg required}"
OUT="${2:?output png required}"
W="${3:?width required}"
H="${4:?height required}"

[ -f "$IN" ] || { echo "error: input not found: $IN" >&2; exit 1; }

# --- resolve a fonts directory --------------------------------------------
# Use the skill's bundled brand fonts (Mona Sans, Inter, Geist Mono). Override with FONT_DIR.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
: "${FONT_DIR:=}"
if [ -z "$FONT_DIR" ] && [ -d "$SCRIPT_DIR/../assets/fonts" ]; then
  FONT_DIR="$SCRIPT_DIR/../assets/fonts"
fi

FC_CONF=""
if [ -n "$FONT_DIR" ] && [ -d "$FONT_DIR" ]; then
  FC_CONF="$(mktemp)"
  cat >"$FC_CONF" <<EOF
<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <dir>$FONT_DIR</dir>
  <include ignore_missing="yes">/etc/fonts/fonts.conf</include>
  <cachedir>$(mktemp -d)</cachedir>
</fontconfig>
EOF
  export FONTCONFIG_FILE="$FC_CONF"
  echo "fonts: using $FONT_DIR" >&2
fi

# --- warn only when no brand fonts directory was resolved ------------------
# (fc-list does not reliably list .woff2 from a temp config, so per-family
# checks give false negatives; instead trust a resolved FONT_DIR.)
if [ -z "$FONT_DIR" ] || [ ! -d "$FONT_DIR" ]; then
  echo "warning: no brand-fonts directory found; Mona Sans/Inter/Geist Mono will fall back to a generic sans. Set FONT_DIR to a folder of font files." >&2
fi

# --- render -----------------------------------------------------------------
# Prefer a Chromium-based browser. It honors the SVG's embedded @font-face, so the
# PNG matches EXACTLY how the SVG renders in a browser/Figma (real Mona Sans/Inter/
# Geist Mono). librsvg ignores @font-face and, when the brand families are not
# installed as .ttf/.otf, silently falls back to a generic sans — which is why PNGs
# used to look different from the SVGs. Embed fonts (embed-fonts.py) BEFORE exporting
# so Chrome has the faces to use. rsvg/magick remain as fallbacks (warned).
ABS_IN="$(cd "$(dirname "$IN")" && pwd)/$(basename "$IN")"

find_chrome() {
  if [ -n "${CHROME_BIN:-}" ] && [ -x "$CHROME_BIN" ]; then echo "$CHROME_BIN"; return 0; fi
  local c
  for c in \
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    "/Applications/Chromium.app/Contents/MacOS/Chromium" \
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" \
    google-chrome-stable google-chrome chromium chromium-browser; do
    [ -x "$c" ] && { echo "$c"; return 0; }
    command -v "$c" >/dev/null 2>&1 && { command -v "$c"; return 0; }
  done
  return 1
}
CHROME="$(find_chrome || true)"

if [ -n "$CHROME" ]; then
  if ! grep -q "@font-face" "$IN"; then
    echo "warning: $IN has no embedded @font-face — run embed-fonts.py first or the browser render will use fallback fonts." >&2
  fi
  echo "render: chrome headless (embedded fonts, browser-accurate) — $CHROME" >&2
  # Optional supersampling: SCALE=2 renders at 2x then downsamples for crisper text.
  # Default SCALE=1 writes the target size directly (atomic, no resize step).
  SCALE="${SCALE:-1}"
  # Headless Chrome occasionally hangs; bound each attempt with a hard timeout and retry
  # so the export is reliable (no stuck processes, no stale half-written files).
  TIMEOUT="${CHROME_TIMEOUT:-30}"
  rm -f "$OUT"
  for attempt in 1 2; do
    PROFILE="$(mktemp -d)"
    ( "$CHROME" --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
        --user-data-dir="$PROFILE" --force-device-scale-factor="$SCALE" \
        --window-size="${W},${H}" --virtual-time-budget=3000 \
        --default-background-color=00000000 \
        --screenshot="$OUT" "file://$ABS_IN" >/dev/null 2>&1 ) &
    CPID=$!
    ( sleep "$TIMEOUT"; kill -9 "$CPID" 2>/dev/null ) & TPID=$!
    wait "$CPID" 2>/dev/null || true
    kill "$TPID" 2>/dev/null || true
    rm -rf "$PROFILE"
    [ -s "$OUT" ] && break
    echo "warning: chrome render attempt $attempt produced no output; retrying" >&2
  done
  if [ ! -s "$OUT" ]; then
    echo "error: chrome render produced no output after retries" >&2; exit 1
  fi
  if [ "$SCALE" != "1" ] && command -v magick >/dev/null 2>&1; then
    magick "$OUT" -resize "${W}x${H}" "$OUT"
  fi
elif command -v rsvg-convert >/dev/null 2>&1; then
  echo "warning: rendering with rsvg-convert — it ignores embedded @font-face; PNG may use fallback fonts and differ from the SVG. Install Chrome/Chromium for brand-accurate output." >&2
  rsvg-convert -w "$W" -h "$H" "$IN" -o "$OUT"
elif command -v magick >/dev/null 2>&1; then
  magick -background none -density 300 "$IN" -resize "${W}x${H}!" "$OUT"
elif command -v inkscape >/dev/null 2>&1; then
  inkscape "$IN" --export-type=png --export-filename="$OUT" -w "$W" -h "$H"
else
  echo "error: no SVG renderer found (need Chrome/Chromium, rsvg-convert, magick, or inkscape)" >&2
  exit 1
fi

[ -n "$FC_CONF" ] && rm -f "$FC_CONF"
echo "wrote $OUT ($(magick identify -format '%wx%h' "$OUT" 2>/dev/null || echo "${W}x${H}"))"
