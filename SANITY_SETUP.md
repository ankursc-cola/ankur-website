# Setting Up Your Ankur CMS — Your Part

I've built and verified everything on the code side. This is what's left,
and it genuinely has to be you — none of it can be done from a chat.

Total time: roughly 20–30 minutes for setup, then as long as you like to
add real content.

---

## Step 1 — Update your website's dependencies

In your `ankur-website` folder:

```bash
npm install @sanity/client @sanity/image-url
```

## Step 2 — Replace your `src` folder

Unzip `src-updated.zip` and replace your existing `src/` folder with it
entirely. This contains:
- Everything you already had, untouched (Nav, Footer, LiveAlpona, GlowLayer,
  RisingEmbers, useReveal, all your CSS, all your images)
- Two new files: `src/lib/sanity.js` and `src/hooks/useSanityData.js`
- Six updated page files: Home, Events, Gallery, ExecutiveCommittee,
  Publications, Sponsors — same markup and CSS classes as before, now
  pulling from Sanity with a fallback to your current content if Sanity
  isn't reachable yet.

**Nothing will look different yet** — until Step 5, every page still shows
exactly what it shows today, via the fallback data built into each file.

## Step 3 — Create your Sanity project

```bash
npm create sanity@latest -- --project ankur-studio --dataset production --template clean --typescript false
```

This will:
- Open a browser tab asking you to log in or sign up (free — use Google,
  GitHub, or email)
- Ask a few questions — accept the defaults for everything except the
  project name (call it something like "Ankur CMS")
- Create a new folder, separate from your website, e.g. `ankur-studio/`

**When it finishes, it will print two values you need — write them down:**
```
Project ID: xxxxxxxx
Dataset: production
```

## Step 4 — Install the schemas I wrote

1. Unzip `ankur-studio-schemas.zip`
2. Copy its `schemaTypes/` folder into the `ankur-studio/` folder that
   `npm create sanity@latest` just created — **replace** the `schemaTypes/`
   folder that's already there
3. Open `ankur-studio/sanity.config.js` and confirm it has this line (it
   should already, from the template):
   ```js
   import { schemaTypes } from "./schemaTypes";
   // ...
   schema: { types: schemaTypes },
   ```

## Step 5 — Connect your website to your Studio

Back in your **website** folder (`ankur-website`, not `ankur-studio`),
create a file called `.env` in the root with the two values from Step 3:

```
VITE_SANITY_PROJECT_ID=xxxxxxxx
VITE_SANITY_DATASET=production
```

Run `npm run dev` — your site now talks to your real (currently empty)
Sanity project. Every page will still show fallback content, because
there's no real content yet.

**Important:** add `.env` to your `.gitignore` if it isn't already there,
so these values don't end up in your public GitHub repo.

## Step 6 — Run your Studio and add real content

In the `ankur-studio` folder:

```bash
npm run dev
```

This opens a local dashboard (usually `http://localhost:3333`). This is
where you'll add:
- Committee members (name, role, photo)
- Gallery photos
- Publications (upload the actual PDF)
- Sponsors (name, tier, logo, website)
- Events — **mark exactly one as "Featured"**, that's the one that shows
  on your homepage hero. When the season changes, uncheck the old one and
  check the new one — the date updates everywhere on the site instantly.

As soon as you add something in the Studio, refresh your website's dev
server tab — the fallback content is replaced with your real content
automatically. No code changes, no redeploy needed for content updates.

## Step 7 — Deploy your Studio so others can use it (optional, but recommended)

Right now the Studio only runs on your own computer. To let next year's
committee use it too, deploy it for free:

```bash
cd ankur-studio
npx sanity deploy
```

This gives you a URL like `ankur-studio.sanity.studio` that anyone with
login access can visit from any browser — including a phone.

## Step 8 — Deploy your website with the new environment variables

Since you're on Cloudflare Pages: go to your project's settings → Environment
Variables, and add the same two values from Step 3 (`VITE_SANITY_PROJECT_ID`,
`VITE_SANITY_DATASET`). Without this, your **live** site will keep showing
fallback content even after your local dev server shows real content — the
live build needs its own copy of these values.

---

## If something breaks

Come back with:
1. The exact error message
2. Which step you were on

Same as everything else in this project — I'll need to see the actual
error to fix it precisely, not guess.
