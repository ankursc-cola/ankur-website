<<<<<<< HEAD
# Ankur — Bengali Association of South Carolina

React + Vite site. Palette, nav, hero (with LiveAlpona), and 8 routed pages
are wired up and building clean.

## Run locally
```
npm install
npm run dev
```

## Build for production
```
npm run build
```
Outputs to `dist/`.

## Structure
- `src/components/LiveAlpona.jsx` — your uploaded hero mandala animation, unchanged
- `src/components/Nav.jsx` / `Footer.jsx` — shared across all pages
- `src/pages/*.jsx` — Home, About, Events, Gallery, Executive Committee, Publications, Sponsors, Contact
- `src/assets/img/` — your uploaded event photos, already wired into Home and Gallery
- `src/index.css` — palette variables, Option A gradient, all animation/motion CSS

## Known placeholders to swap before launch
- Executive Committee names (`src/pages/ExecutiveCommittee.jsx`)
- Contact form isn't wired to a backend yet — hook it to Formspree, EmailJS, or your own endpoint
- "Our Community" section on Home uses illustrated placeholder avatars, not photos (see chat notes)
- About page history paragraph is placeholder copy
=======
# ankur-website
A website for a Community
>>>>>>> 650e973bedd03a8f3208ead7fb8cb86ef27b7696
