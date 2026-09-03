import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

/**
 * ---------------------------------------------------------------
 * SANITY CONNECTION
 * ---------------------------------------------------------------
 * These two values come from your Sanity project (shown in the
 * terminal after `npm create sanity@latest`, and always visible at
 * https://www.sanity.io/manage under your project's Settings tab).
 *
 * They live in a .env file at your project root, NOT hardcoded here,
 * so you never accidentally commit them differently per environment.
 * See .env.example for the exact two lines to add.
 * --------------------------------------------------------------- */
export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: true, // fast, cached reads — fine for public content like this
});

const builder = imageUrlBuilder(sanityClient);

/** Turns a Sanity image reference into an actual usable URL, with optional sizing. */
export function urlFor(source) {
  return builder.image(source);
}

/**
 * ---------------------------------------------------------------
 * GALLERY EVENT LIST
 * ---------------------------------------------------------------
 * This is the single source of truth on the frontend for which
 * event a gallery photo can belong to (folder labels + slugs used
 * in routes like /gallery/durga-puja). It must stay in sync with
 * the `options.list` in ankur-cms/schemaTypes/galleryPhoto.js —
 * adding a new event means updating BOTH files, since the two
 * repos don't share code.
 * --------------------------------------------------------------- */
export const EVENT_OPTIONS = [
  { value: "saraswati-puja", title: "Saraswati Puja" },
  { value: "holi", title: "Holi" },
  { value: "poila-boishak", title: "Poila Boishak" },
  { value: "summer-picnic", title: "Summer Picnic" },
  { value: "durga-puja", title: "Durga Puja" },
  { value: "bijoya-sammiloni", title: "Bijoya Sammiloni" },
  { value: "deepaboli", title: "Deepaboli" },
  { value: "new-year", title: "New Year" },
];


/**
 * ---------------------------------------------------------------
 * FETCH HELPERS
 * ---------------------------------------------------------------
 * Every function below follows the same rule: if the fetch fails
 * (wrong project ID not set up yet, network hiccup, empty dataset),
 * return an EMPTY ARRAY rather than throwing. Every page component
 * that calls these is written to fall back to sensible placeholder
 * content when it gets nothing back — the site should never show a
 * blank broken page just because Sanity had a bad moment.
 * --------------------------------------------------------------- */

async function safeFetch(query, params = {}) {
  try {
    return await sanityClient.fetch(query, params);
  } catch (err) {
    console.error("Sanity fetch failed:", err);
    return [];
  }
}

export function fetchCommittee() {
  return safeFetch(
    `*[_type == "committeeMember" && active == true] | order(term desc, order asc) {
      _id, role, name, photo, order, term
    }`
  );
}

export function fetchGalleryPhotos() {
  return safeFetch(
    `*[_type == "galleryPhoto"] | order(event asc, year desc, order asc, _createdAt desc) {
      _id, image, caption, order, year, event
    }`
  );
}

export function fetchHomeGalleryPhotos() {
  return safeFetch(
    `*[_type == "galleryPhoto" && featuredOnHome == true] | order(order asc) [0...4] {
      _id, image, caption
    }`
  );
}

export function fetchPublications() {
  return safeFetch(
    `*[_type == "publication"] | order(year desc) {
      _id, year, title, blurb, "pdfUrl": pdfFile.asset->url, coverImage
    }`
  );
}

export function fetchSponsors() {
  return safeFetch(
    `*[_type == "sponsor" && active == true] {
      _id, name, tier, logo, website
    }`
  );
}

export function fetchEvents() {
  return safeFetch(
    `*[_type == "event"] | order(order asc) {
            _id, name, nameBangla, dateText, blurb, featured, "flyerUrl": flyer.asset->url, "memberFlyerUrl": memberFlyer.asset->url
    }`
  );
}

export function fetchFeaturedEvent() {
  return safeFetch(
    `*[_type == "event" && featured == true][0] {
      _id, name, nameBangla, dateText, blurb, "flyerUrl": flyer.asset->url, alponaStyle
    }`
  );
}
