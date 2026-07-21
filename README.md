# Fire & Ice Restaurant & Bar

A custom, cinematic, multi-page website for Fire & Ice Restaurant & Bar inside the Oasis Hotel & Convention Center in Springfield, Missouri.

## What is included

- Home — immersive brand story, custom no-people elemental hero, cinematic entry, and primary reservation journey
- Menus — complete lunch, dinner, cocktails, wine, beer, and spirits in compact clickable accordions
- Experiences — ice bar, elemental atmosphere, interactive presentations, and hospitality
- Gallery — more than 50 image placements, category filtering, editorial masonry layout, and full-screen lightbox
- Private Dining — event positioning, planning process, and email-based inquiry form
- Our Story — brand narrative and service values
- Visit — hours, location, directions, contact information, and reservations

## Signature motion system

The Fire & Ice theme is expressed through atmosphere rather than a bright red/blue split:

- drifting ember and crystal particles
- subtle heat-haze displacement over the warm side of the hero
- animated fog and frost layers
- mouse-responsive hero perspective
- an interactive Fire-to-Ice reveal section
- restrained 3D card movement
- reflective button sweeps
- cinematic horizontal image rail
- scroll-triggered transitions and parallax
- full reduced-motion support for accessibility

## Technical approach

This is a dependency-free static site built with semantic HTML, modern CSS, SVG filters, Canvas, and small vanilla JavaScript modules. It does not require a paid theme, page builder, database, or runtime build step.

Core photography is stored inside `assets/images`, including the custom hero composite and 12 additional editorial crops. The expanded gallery also references Fire & Ice's current official WordPress gallery images. If a remote gallery image becomes unavailable, that card automatically hides rather than displaying a broken-image box.

## Preview locally

The ZIP is self-contained. Start a static server from this folder:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Deploy with GitHub Pages

1. Copy the contents of this folder into the repository root.
2. Commit and push the files to `main` using GitHub Desktop.
3. In GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, select **GitHub Actions**.
5. The included `Deploy Fire & Ice to GitHub Pages` workflow publishes the checked-in site exactly as uploaded.

The deployment no longer downloads the core image library during publication. This prevents the broken-image problem caused by a build step succeeding differently from the public Pages artifact.

## Validation

Run:

```bash
node --check assets/js/main.js
node --check assets/js/menu.js
node scripts/validate-menu.js
python3 scripts/validate.py
```

## Production launch checklist

- Confirm final menu items and prices.
- Confirm operating hours and reservation URL.
- Confirm the private-dining inquiry email address.
- Connect the `oasisfireandice.com` custom domain.
- Add analytics and consent controls if desired.
- Replace or supplement gallery assets as new professional photography becomes available.
- Complete final accessibility and device review on the production domain.
