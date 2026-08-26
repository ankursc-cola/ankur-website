# Ankur Website & CMS — Project Reference

**Purpose of this document**: a complete handoff reference for a new conversation/project continuing work on this codebase. Written to be self-contained — everything needed to pick this project up without re-deriving context from scratch.

---

## 1. What This Project Is

A public website for **Ankur — Bengali Association of South Carolina**, built as a React + Vite static site, connected to a **Sanity.io** headless CMS so non-technical committee members can update content (Committee roster, Gallery photos, Sponsors, Publications, Events) every year without touching code or asking a developer.

- **Live domain**: `ankursc.org`
- **CMS dashboard**: `ankur-cms.sanity.studio`

---

## 2. Architecture — Two Independent Systems

These never share a server, a deploy step, or a database. They only communicate over the public internet via Sanity's API, using a Project ID.

| | `ankur-website` | `ankur-cms` |
|---|---|---|
| What it is | The public site visitors see | The content-editing dashboard |
| Stack | React 18 + Vite + React Router | Sanity Studio (React-based, TypeScript) |
| Hosted at | GitHub Pages (`ankursc.org`) | Sanity's own hosting (`ankur-cms.sanity.studio`) |
| Deploy mechanism | GitHub Actions (auto, on push to `main`) | Manual: `npx sanity deploy` |
| Repo | `github.com/ankursc-cola/ankur-website` (public) | `github.com/ankursc-cola/ankur-cms` (private) |

**Critical mental model**: updating content in Sanity (adding a committee member, changing an event date) takes effect **immediately** on the live site — no redeploy needed, since the site fetches live data via API on every page load. Redeploying the *website* is only needed when the **code** changes. Redeploying the *Studio* (`npx sanity deploy`) is only needed when the **schema** (field definitions) changes — content edits never require it.

---

## 3. Accounts & Locations

| | Value |
|---|---|
| GitHub account (owns both repos) | `ankursc-cola` |
| Sanity organization | Ankur |
| Sanity project | "Ankur CMS", Project ID `7aecejp4`, dataset `production` |
| Domain registrar | Wix (domain: `ankursc.org`) |
| Website hosting | GitHub Pages |
| Form handling | Formspree (endpoint: `https://formspree.io/f/mvkpeqez`) |

**Local machine paths** (Windows, user `banerjes`):
```
C:\Users\banerjes\ankur-website
C:\Users\banerjes\ankur-cms
```

**Important quirk**: the developer's personal/work GitHub identity is a *different* account (`imapsproducts` / `githubsourav`) than the project's dedicated account (`ankursc-cola`). This repeatedly caused Windows' cached-credential authentication to silently push/pull as the wrong account, producing confusing "repository not found" or "403 permission denied" errors even when the code and remote URL were correct. See **Section 9** for the fix.

---

## 4. Repo Structure — `ankur-website`

```
ankur-website/
├── .github/workflows/deploy.yml    # GitHub Actions: builds + deploys on push to main
├── public/
│   └── 404.html                    # SPA-routing fix for GitHub Pages (see Section 8)
├── src/
│   ├── components/
│   │   ├── Nav.jsx                 # route-aware: light text on Home's dark hero, dark text elsewhere
│   │   ├── Footer.jsx
│   │   ├── LiveAlpona.jsx          # original animated alpona (Durga Puja / classic)
│   │   ├── HoliAlpona.jsx          # Holi-themed alpona variant
│   │   ├── BoiAlpona.jsx           # Saraswati Puja-themed alpona variant
│   │   ├── NoboAlpona.jsx          # Poila Boishakh-themed alpona variant
│   │   ├── GlowLayer.jsx
│   │   └── RisingEmbers.jsx
│   ├── pages/
│   │   ├── Home.jsx, About.jsx, Events.jsx, Gallery.jsx,
│   │   ├── ExecutiveCommittee.jsx, Publications.jsx,
│   │   └── Sponsors.jsx, Contact.jsx
│   ├── hooks/
│   │   ├── useReveal.js            # scroll-triggered fade-in animation (see Section 8 gotcha)
│   │   └── useSanityData.js        # data-fetching hook with graceful fallback
│   ├── lib/
│   │   └── sanity.js               # Sanity client + all fetch helper functions
│   ├── assets/                     # local images, also used as hardcoded fallback data
│   └── index.css                   # palette tokens ("Avro Palette"), all section styles
├── index.html
├── vite.config.js
└── package.json
```

**`ankur-cms` structure**:
```
ankur-cms/
├── schemaTypes/
│   ├── committeeMember.js
│   ├── galleryPhoto.js
│   ├── publication.js
│   ├── sponsor.js
│   ├── event.js
│   └── index.js                    # registers all schema types with the Studio
├── sanity.config.ts
└── sanity.cli.ts
```

---

## 5. The Avro Palette (design system)

Colors drawn from Ankur's own artwork, not a generic template:

```css
--crimson: #7A1B1F
--vermillion: #C63822
--orange: #E8721F
--amber: #F5A623
--gold-glow: #FCD34D
--mahogany: #33190F   /* dark accent, NOT near-black */
--cream: #FDF3E2       /* site-wide background */
```

Fonts: **Spectral** (display/headlines), **Tiro Bangla** (Bengali text), **Hind Siliguri** (body).

Hero gradient: Crimson (top) → Gold-Glow (45%) → Cream (85%) — bright and celebratory, dark tones reserved as accents only.

---

## 6. Sanity Content Types (Schema)

### `committeeMember`
`role`, `name`, `photo` (optional), `order` (number), `term` (string, e.g. "2026"), `active` (boolean, "Show on website?"). The website **auto-detects the current term** as whichever term string is numerically highest — no manual toggle needed. Past terms show in a collapsible "Past Leadership" section on the Executive Committee page.

### `galleryPhoto`
`image`, `caption`, `order`, `featuredOnHome` (boolean, shows in the homepage gallery preview).

### `publication`
`year`, `title`, `blurb`, `pdfFile`, `coverImage` (optional).

### `sponsor`
`name`, `tier` (Platinum/Gold/Silver), `logo` (optional), `website` (optional), `active` (boolean).

### `event`
Shared by **both** the homepage hero badge and the full Events page — this eliminated a bug where the Durga Puja date was previously typed in three separate hardcoded places.
- `name`, `nameBangla` (optional), `dateText` (free text), `blurb`
- `featured` (boolean) — exactly one event should be Featured at a time; that's the one shown on the homepage hero
- `order` (number, for the Events page list order)
- `flyer` (optional file, PDF or image) — if uploaded, a "Download Flyer" button appears next to the hero badge (if Featured) and on that event's card on the Events page
- `alponaStyle` (dropdown: `classic` / `holi` / `boi` / `nobo`) — selects which animated alpona component renders on the homepage hero when this event is Featured

---

## 7. Key Architectural Patterns Established

### 7.1 Light-text / dark-text CSS system
A single modifier class on a `<section>` (`.dark-text` or `.light-text`) drives every child's color via CSS inheritance + descendant selectors. Components meant to work on either background need **both** color variants explicitly written — a component that only defines one will silently break the first time it's used on the other background. This happened repeatedly (kicker, h2, Mission & Vision cards, People cards) before the pattern was fully internalized.

### 7.2 `useSanityData` hook + graceful fallback
Every page that fetches from Sanity has a hardcoded `FALLBACK_*` constant matching the expected shape. If Sanity is unreachable or returns nothing, the page falls back to that constant instead of showing a blank page. **Known gotcha**: the hook must check `Array.isArray(result)` before applying `.length > 0` — a query ending in `[0]` (like `fetchFeaturedEvent`) returns a single object, not an array, and objects have no `.length` property. An earlier version of the hook didn't check this and silently discarded every real single-object result forever.

### 7.3 The `useReveal` + conditional-mount gotcha (hit repeatedly — memorize this one)
`useReveal()` scans the page **once** on mount for elements with class `reveal` and watches them via `IntersectionObserver` to fade them in on scroll. If an element with that class is later **unmounted and re-mounted** (a conditional `{hasData && <div className="reveal">}` swapping fallback content for real data, or a tab that only renders on click), the new DOM node was never scanned and **stays permanently invisible** — not hidden, just never given the class that makes it visible.
- **Safe pattern**: put `reveal` on a wrapper that's *always* present at mount; only its children's content changes.
- **Unsafe pattern**: put `reveal` on an element that's conditionally rendered.
- This bug appeared on: Home.jsx's Upcoming Celebrations, Sponsors.jsx's sponsor list, and the Committee page's Past Leadership panel.

### 7.4 SVG `transform` attribute vs. CSS `transform` property conflict
If an SVG element has **both** an XML `transform` attribute (for static positioning) and a CSS animation that also animates `transform`, the CSS property **completely overrides/replaces** the attribute in modern browsers — they don't compose. This caused the original `LiveAlpona`'s kalka ring to collapse to one point, and later caused `BoiAlpona`'s particles to fly off past the canvas edge when both a static rotate attribute and an animated rotate were applied to the same element. **Fix**: never combine both on the same element — use a wrapping `<g>` for static positioning and apply all animation to a child, or drop one of the two approaches entirely.

### 7.5 SVG `viewBox` clipping is rectangular, not circular
`viewBox` clips content in a straight-edged rectangle. Circular/radiating content (alpona rings, particle bursts) that pokes past a square boundary gets clipped flat specifically at the four cardinal points (top/right/bottom/left), while diagonal content is untouched — this is the exact visual signature to recognize this bug. **Fix**: always leave generous margin between the outermost content radius and the viewBox edge (e.g., particles traveling up to 300 units from center need at least ~320 units of margin). When adding any new radiating/animated SVG component, **verify programmatically** (via a headless browser + bounding-box check) that no element touches the viewBox edge across multiple points in time — visual spot-checking alone has missed this bug more than once.

### 7.6 Per-event alpona style architecture
```jsx
// Home.jsx
const ALPONA_COMPONENTS = {
  classic: LiveAlpona,
  holi: HoliAlpona,
  boi: BoiAlpona,
  nobo: NoboAlpona,
};
// ...
const AlponaComponent = ALPONA_COMPONENTS[featuredEvent.alponaStyle] || LiveAlpona;
<AlponaComponent size={320} />
```
Adding a new style requires: (1) a new themed component file, (2) one new line in this map, (3) one new option in the Sanity schema's `alponaStyle` dropdown list. The page-level render logic never changes again.

---

## 8. Deployment Process

### Website (`ankur-website`) — GitHub Pages via GitHub Actions
- Workflow file: `.github/workflows/deploy.yml` — runs `npm ci` → `npm run build` → `deploy-pages` on every push to `main`
- **Repo must stay Public** — free GitHub Pages does not work on a private repo (requires GitHub Enterprise for that)
- Environment variables: repo **Settings → Secrets and variables → Actions** — `VITE_SANITY_PROJECT_ID` as a Secret, `VITE_SANITY_DATASET` as a Variable
- Custom domain: **Settings → Pages → Custom domain** field (auto-creates a `CNAME` file). DNS at the registrar needs 4 A records (`185.199.108.153`, `.109.153`, `.110.153`, `.111.153`) plus a `www` CNAME to `ankursc-cola.github.io`
- **SPA routing fix required**: GitHub Pages has no server-side routing, so a deep link like `/about` 404s on direct load or refresh. Fixed via `public/404.html` (redirects into the SPA) + a matching decode script in `index.html`'s `<head>`.
- **Domain host quirk**: `ankursc.org` was purchased through **Wix**, which does not allow changing nameservers (NS records are locked, confirmed via Wix's own UI). GitHub Pages' A-record method works fine regardless, since it doesn't require nameserver control — only Cloudflare's approach required that and was abandoned for this reason.

### CMS (`ankur-cms`) — manual Sanity deploy
```powershell
npx sanity deploy
```
Select the **existing** hostname (`ankur-cms`) when prompted — never "Create new studio hostname," which would spin up a separate, disconnected Studio address.

### CORS (required for both, easy to forget)
Every domain that fetches from Sanity needs its own entry under **Sanity → API → CORS Origins**: `localhost:5173` (or whatever port `npm run dev` uses), the GitHub Pages preview URL, and the live `https://ankursc.org` + `https://www.ankursc.org`. Missing this causes the live site to silently show fallback/placeholder content instead of real data — not an error, just quietly wrong data.

---

## 9. Git / GitHub Multi-Account Management

The developer has **multiple GitHub accounts** on the same machine (personal + this project's dedicated `ankursc-cola`). Windows caches a GitHub login **per website** (`github.com`), not per account — this repeatedly caused pushes/clones to silently authenticate as the wrong account, producing "repository not found" or 403 errors even with correct code and remote URLs.

**Working fixes, in order of robustness:**
1. **Personal Access Token embedded in the remote URL** (most reliable, doesn't touch Windows' credential store at all):
   ```powershell
   git remote set-url origin https://USERNAME:TOKEN@github.com/ankursc-cola/REPO.git
   ```
2. **Clear the cached credential**: `cmdkey /delete:git:https://github.com` (or via Credential Manager GUI if available), then retry — forces a fresh login prompt.

**The real long-term fix** (designed but not yet fully implemented as of this document): SSH keys with per-account host aliases in `~/.ssh/config`, so the remote URL itself (`git@github-acc1:...` vs `git@github-acc2:...`) deterministically selects the correct identity with zero shared cache involved. A full step-by-step protocol deck for this exists separately (see "Existing deliverables" below).

**Security note**: any Personal Access Token pasted into chat or a terminal that gets shared should be **revoked immediately after use** and regenerated fresh next time — treat it like a password, not a reusable credential.

---

## 10. Working Style / How This Developer Likes to Collaborate

Worth preserving for continuity in a new conversation:

- **Wants things actually verified, not just asserted.** Repeatedly caught cases where code "should work" but hadn't been tested — expects genuine testing (build it, run it, screenshot it, check for errors) before being told something is done.
- **Prefers seeing a design/plan before code is written** for anything with a visual or architectural choice involved (asked for this explicitly multiple times: committee history layout, per-event alpona styles).
- **Notices and calls out inconsistencies immediately** (e.g., flower petals looking like "eggs," particles disappearing too early) — expects iteration based on specific, concrete feedback, and expects the fix to be re-verified, not just claimed fixed.
- **Learning-oriented**: frequently asks *why* something works, not just *what* to type — appreciates mechanism-level explanations (e.g., how CSS inheritance/cascade works, why `git pull` doesn't help after a fresh clone).
- **Not deeply technical but engaged and capable** — comfortable in a terminal and VS Code, but benefits from exact commands, exact file paths, and being told precisely where to click.
- **Values honesty about mistakes.** Has responded well when told directly "I made an error here, here's the actual fix" rather than glossing over it.
- **Appreciates knowing the "why" behind a recommendation**, especially for irreversible or costly decisions (e.g., the domain-refund conversation, GitHub Pages vs. Cloudflare).

---

## 11. Outstanding / Known Open Items (as of this document)

- [ ] Confirm all 3 new alpona components (`Holi`, `Boi`, `Nobo`) work correctly when switching styles live in the actual project (tested in isolation, not yet confirmed integrated)
- [ ] Push latest changes (alpona styles + working contact form) to `ankur-website` — was blocked by a credential/permission error at time of writing
- [ ] Deploy schema changes to the public Sanity Studio via `npx sanity deploy`
- [ ] `@sanity/image-url` deprecation warning — using default export, should migrate to named export `createImageUrlBuilder` (cosmetic, not urgent)
- [ ] Sponsors page has no dark-background styling variant for sponsor logos (currently only tuned for light sections)
- [ ] Full SSH multi-account protocol not yet implemented, only documented as a plan
- [ ] Confirm `ankursc.org` HTTPS/SSL certificate fully active and "Enforce HTTPS" checked in GitHub Pages settings

## 12. Existing Deliverables From This Project (for reference, may exist as separate files)

- `Ankur-Project-Overview.pptx` — high-level overview deck for future committees
- `Ankur-Developer-Guide.pptx` — technical deep-dive for developers
- `Ankur-Simple-User-Guide.pptx` — step-by-step Sanity Studio guide for non-technical users
- `Ankur-Switching-GitHub-Accounts.pptx` — protocol for moving a repo between GitHub accounts
- `GitHub-Multi-Account-Protocol.pptx` — the SSH-based long-term fix for managing 3 separate GitHub accounts on one machine
- `SANITY_SETUP.md` — original step-by-step Sanity CMS setup guide

---

*This document reflects the state of the project as of the conversation it was generated from. Treat Section 11 (Outstanding Items) as the most likely starting point for continuing work.*
