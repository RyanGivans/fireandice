#!/usr/bin/env bash
set -euo pipefail

# Curated photography from Fire & Ice and Oasis's official websites.
# The deployment workflow downloads these into the static Pages artifact so the
# published site is fast and self-contained without committing large binaries.

DEST="assets/images"
mkdir -p "$DEST"

fetch() {
  local url="$1"
  local file="$2"
  echo "Fetching ${file}"
  curl --fail --location --silent --show-error \
    --retry 3 --retry-delay 2 --retry-all-errors \
    --user-agent "Fire-and-Ice-Website-Deployment/1.0" \
    "$url" --output "$DEST/$file"
}

BASE="https://oasisfireandice.com/wp-content/uploads/2024/11"

fetch "$BASE/Women-at-Ice-Bar-2-Landscape.webp" "hero-home.webp"
cp "$DEST/hero-home.webp" "$DEST/icebar-guests.webp"
cp "$DEST/hero-home.webp" "$DEST/social-card.webp"

fetch "$BASE/Scallops-landcape.webp" "experience-smoke.webp"
fetch "$BASE/martini-at-ice-bar.webp" "cocktail-ice.webp"
fetch "$BASE/Fireplace-scaled-1.webp" "fireplace.webp"
fetch "$BASE/VFW_4825_6_7_tonemapped-scaled-1.webp" "icebar-wide.webp"
fetch "$BASE/Fire-Ice-R3-scaled-1.webp" "dining-room.webp"
fetch "$BASE/New-Steak-scaled-1.webp" "steak.webp"
fetch "$BASE/New-Salmon.webp" "salmon.webp"
fetch "$BASE/Oasis-FireIce-7-scaled-1.webp" "small-plates.webp"
fetch "$BASE/IMG_7444-scaled-1.webp" "dessert.webp"
fetch "$BASE/Photo-Aug-29-2024-5-10-56-PM-scaled-1.webp" "amber-cocktail.webp"
fetch "$BASE/Catering_desserts.webp" "event-desserts.webp"
fetch "$BASE/Oasis_Convention_Center_2-1024x682.webp" "convention-center.webp"

# A missing or zero-byte file should fail the deployment rather than publish a
# visually broken site.
for image in "$DEST"/*.webp; do
  test -s "$image"
done

echo "Curated image set is ready."
