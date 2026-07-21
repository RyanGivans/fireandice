# Fire & Ice Restaurant & Bar

A custom, cinematic, multi-page website for Fire & Ice Restaurant & Bar inside the Oasis Hotel & Convention Center in Springfield, Missouri.

## Pages

- Home — immersive brand story and primary reservation journey
- Menus — full lunch, dinner, cocktails, wine, beer, and spirits in compact accordions
- Experiences — ice bar, elemental atmosphere, interactive presentations, and hospitality
- Gallery — filterable masonry gallery with lightbox
- Private Dining — event positioning, planning process, and email-based inquiry form
- Our Story — brand narrative and service values
- Visit — hours, location, directions, contact information, and reservations

## Technical approach

This is a dependency-free static site built with semantic HTML, modern CSS, and small vanilla JavaScript modules. It does not require a paid theme, page builder, database, or runtime build step.

Features include:

- Responsive mobile-first layouts
- Accessible navigation and accordions
- Reduced-motion support
- Lightweight scroll reveals and parallax
- Custom elemental particle effect in the home hero
- Complete structured menu data
- SEO metadata and Restaurant structured data
- GitHub Pages deployment workflow
- Curated official Fire & Ice/Oasis photography copied into the deployed artifact

## Preview locally

The downloadable review package includes the image library. In a fresh Git checkout, first run the image-fetch helper, then start a static server:

```bash
bash scripts/fetch-images.sh
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Deploy with GitHub Pages

1. Merge the website pull request into `main`.
2. In GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, select **GitHub Actions**.
4. The included `Deploy Fire & Ice to GitHub Pages` workflow will publish the site.

## Production launch checklist

Before replacing the current production site:

- Confirm final menu items and prices.
- Confirm operating hours and reservation URL.
- Confirm the event inquiry email address.
- Connect the `oasisfireandice.com` custom domain.
- Add analytics and consent controls if desired.
- Replace or supplement gallery assets as new professional photography becomes available.
- Review accessibility and browser behavior on the final hosting domain.

## Photography

The site uses a curated set of images from Fire & Ice and Oasis's official websites. The GitHub Pages workflow copies those images into the deployed artifact during publication. The separate review ZIP includes optimized local copies for offline preview. Before moving the production domain, archive the original high-resolution photography in the repository or a permanent media CDN so future deployments do not depend on the legacy WordPress host.
