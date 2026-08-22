#!/usr/bin/env bash
# Convert opaque (photographic) PNGs to JPEG to shrink the WebP fallback + repo.
# Skips public/images/brand/* (logos/marks with transparency). Regenerates the
# .jpg.webp sibling and drops the old .png / .png.webp. Run from project root.
set -euo pipefail
cd "$(dirname "$0")/public/images"

JQ=82   # jpeg quality
WQ=80   # webp quality
converted=0

while IFS= read -r -d '' f; do
  case "$f" in ./brand/*) continue;; esac
  # only opaque PNGs (transparency-bearing PNGs are left as PNG)
  opaque=$(identify -format '%[opaque]' "$f" 2>/dev/null | tr '[:upper:]' '[:lower:]')
  [ "$opaque" = "true" ] || { echo "  SKIP (alpha): $f"; continue; }
  jpg="${f%.png}.jpg"
  convert "$f" -auto-orient -strip -interlace JPEG -sampling-factor 4:2:0 -quality "$JQ" "$jpg"
  convert "$jpg" -quality "$WQ" -define webp:method=6 "${jpg}.webp"
  rm -f "$f" "${f}.webp"
  converted=$((converted+1))
done < <(find . -type f -iname '*.png' ! -iname '*-sm*' -print0)

echo "converted $converted PNG -> JPG"
