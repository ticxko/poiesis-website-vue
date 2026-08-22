#!/usr/bin/env bash
# Optimize poiesis.id images: cap dimensions, re-encode, generate webp siblings,
# and build small grid thumbnails. Run from the vue project root.
set -euo pipefail
cd "$(dirname "$0")/public/images"

MAXDIM=2000
JQ=82        # jpeg quality for full images
WQ=80        # webp quality
TQ=78        # thumbnail jpeg quality
THUMB=800    # grid thumbnail longest side

echo "== [1/4] capping + optimizing JPEGs in place =="
find . -type f \( -iname '*.jpg' -o -iname '*.jpeg' \) -print0 |
  while IFS= read -r -d '' f; do
    convert "$f" -auto-orient -strip -resize "${MAXDIM}x${MAXDIM}>" \
      -interlace JPEG -sampling-factor 4:2:0 -quality "$JQ" "$f"
  done

echo "== [2/4] capping + stripping PNGs in place =="
find . -type f -iname '*.png' -print0 |
  while IFS= read -r -d '' f; do
    convert "$f" -auto-orient -strip -resize "${MAXDIM}x${MAXDIM}>" "$f"
  done

echo "== [3/4] generating .webp siblings for every raster =="
find . -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \) -print0 |
  while IFS= read -r -d '' f; do
    convert "$f" -quality "$WQ" -define webp:method=6 "${f}.webp"
  done

echo "== [4/4] building small grid thumbnails (-sm.jpg + .webp) from projects.json =="
# thumbnails referenced by the grid: the "thumbnail" field of each project
python3 - "$THUMB" "$TQ" "$WQ" <<'PY'
import json, os, subprocess, sys
thumb, tq, wq = sys.argv[1], sys.argv[2], sys.argv[3]
data = json.load(open("../data/projects.json"))
seen = set()
for p in data:
    t = p.get("thumbnail", "")
    if not t or t in seen:
        continue
    seen.add(t)
    rel = "." + t[len("/images"):]  # /images/x/y.png -> ./x/y.png
    if not os.path.exists(rel):
        print("  MISSING:", rel); continue
    base, ext = os.path.splitext(rel)
    sm = base + "-sm.jpg"
    subprocess.run(["convert", rel, "-auto-orient", "-strip",
                    "-resize", f"{thumb}x{thumb}>", "-interlace", "JPEG",
                    "-sampling-factor", "4:2:0", "-quality", tq, sm], check=True)
    subprocess.run(["convert", sm, "-quality", wq, "-define", "webp:method=6",
                    sm + ".webp"], check=True)
print("  thumbnails generated:", len(seen))
PY

echo "== done =="
du -sh .
