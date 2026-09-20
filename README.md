# Resume-s

This repository contains my resume in both Turkish and English.

## Portfolio site

The root `index.html` is a dependency-free static portfolio site for
[dogukanakin.github.io](https://dogukanakin.github.io). It is intentionally
built with plain HTML, CSS, and JavaScript so it can run directly on GitHub
Pages without a build step, paid service, domain, or API key.

The theme follows `prefers-color-scheme` on first load. The accessible header
toggle lets visitors choose light or dark mode, and that manual choice is
remembered in `localStorage`.

The site also includes a production-ready favicon, Apple touch icon, web
manifest, Open Graph/Twitter share metadata, canonical URL, `robots.txt`,
`sitemap.xml`, and a limited `Person` JSON-LD record. The social share image is
the local `assets/og-image.png` file; no analytics, tracking, paid service, or
API key is required.

### Localization

The portfolio supports English and Turkish without a build step or backend.
Language resolution follows this order: an explicit `?lang=en` or `?lang=tr`
query parameter, the previously selected `language` value in `localStorage`,
the `Europe/Istanbul` timezone, a Turkish browser locale, and English as the
final fallback. The header language control updates the page in place, keeps
the selected language in `localStorage`, and preserves the current URL hash.

Translation dictionaries live in `locales/en.js` and `locales/tr.js`, while
`localization.js` updates visible content and localized SEO metadata. This is a
deterministic browser-locale fallback, not IP-based country detection; the
site does not request location permission or call a geolocation service.
