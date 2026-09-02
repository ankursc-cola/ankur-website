import { useMemo } from "react";
import GlowLayer from "../components/GlowLayer.jsx";
import useReveal from "../hooks/useReveal.js";
import RisingEmbers from "../components/RisingEmbers.jsx";
import useSanityData from "../hooks/useSanityData.js";
import { fetchGalleryPhotos, urlFor, EVENT_OPTIONS } from "../lib/sanity.js";
import GalleryFolderCard from "../components/GalleryFolderCard.jsx";

// Fallback photos (used if Sanity is unreachable) — all tagged to the
// same event since they're all from past Durga Puja celebrations.
import pandalWide1 from "../assets/img/pandal-wide-1.jpg";
import idols1 from "../assets/img/idols-1.jpg";
import durgaPortrait1 from "../assets/img/durga-portrait-1.jpg";

const FALLBACK_PHOTOS = [
  { _id: "f1", url: pandalWide1, event: "durga-puja", year: "2025" },
  { _id: "f2", url: idols1, event: "durga-puja", year: "2025" },
  { _id: "f4", url: durgaPortrait1, event: "durga-puja", year: "2025" },
];

// slug -> display title, built once from the shared EVENT_OPTIONS list
// in lib/sanity.js so this page and the schema dropdown stay aligned.
const EVENT_LABELS = EVENT_OPTIONS.reduce((acc, o) => {
  acc[o.value] = o.title;
  return acc;
}, {});

export default function Gallery() {
  useReveal();
  const { data: rawPhotos } = useSanityData(fetchGalleryPhotos, null);

  const photos = rawPhotos
    ? rawPhotos.map((p) => ({
        _id: p._id,
        thumbUrl: urlFor(p.image).width(500).url(),
        event: p.event,
        year: p.year,
      }))
    : FALLBACK_PHOTOS.map((p) => ({ ...p, thumbUrl: p.url }));

  // One folder per distinct event, using the first photo found for
  // that event as the folder's cover image, and a running count.
  // Photos with no event tag yet (not migrated in Studio) land in an
  // "Uncategorized" folder rather than silently disappearing.
  const folders = useMemo(() => {
    const map = new Map();
    photos.forEach((p) => {
      const slug = p.event || "uncategorized";
      if (!map.has(slug)) {
        map.set(slug, { slug, cover: p.thumbUrl, count: 0, years: new Set() });
      }
      const entry = map.get(slug);
      entry.count += 1;
      if (p.year) entry.years.add(p.year);
    });
    return Array.from(map.values()).map((f) => ({
      slug: f.slug,
      cover: f.cover,
      count: f.count,
      yearsCount: f.years.size,
    }));
  }, [photos]);

  return (
    <>
      <header className="page-header">
        <GlowLayer />
        <RisingEmbers count={35} />
        <span className="kicker">Moments</span>
        <h1>Gallery</h1>
        <h1 className="headline font-bangla">স্মৃতি-মুহূর্ত</h1>
        <p>Browse photos by event — pick a celebration below to see every year we've captured.</p>
      </header>

      <section className="section">
        {/*
          This wrapper always stays mounted (only the folder cards
          inside it change as data loads), so it's safe for useReveal
          — see project reference section 7.3.
        */}
        <div className="gallery-folder-grid reveal">
          {folders.map((f) => (
            <GalleryFolderCard
              key={f.slug}
              to={`/gallery/${f.slug}`}
              label={EVENT_LABELS[f.slug] || "Uncategorized"}
              coverUrl={f.cover}
              count={f.count}
              yearsCount={f.yearsCount}
            />
          ))}
        </div>
      </section>
    </>
  );
}
