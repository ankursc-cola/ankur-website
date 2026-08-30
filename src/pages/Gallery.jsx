import { useEffect, useMemo, useState } from "react";
import GlowLayer from "../components/GlowLayer.jsx";
import useReveal from "../hooks/useReveal.js";
import RisingEmbers from "../components/RisingEmbers.jsx";
import useSanityData from "../hooks/useSanityData.js";
import { fetchGalleryPhotos, urlFor } from "../lib/sanity.js";

// Your original local photos, kept as the fallback — shown until real
// photos are added in Sanity, or if the CMS is ever unreachable.
import pandalWide1 from "../assets/img/pandal-wide-1.jpg";
import pandalWide2 from "../assets/img/pandal-wide-2.jpg";
import idols1 from "../assets/img/idols-1.jpg";
import idols2 from "../assets/img/idols-2.jpg";
import idols3 from "../assets/img/idols-3.jpg";
import idolsSide from "../assets/img/idols-side.jpg";
import durgaPortrait1 from "../assets/img/durga-portrait-1.jpg";
import durgaFaceClose from "../assets/img/durga-face-close.jpg";
import ganeshClose from "../assets/img/ganesh-close.jpg";
import pujaRitual from "../assets/img/puja-ritual.jpg";
import deviDetail from "../assets/img/devi-detail.jpg";
import durgaStage from "../assets/img/durga-puja-stage.jpg";

// Fallback photos all get a placeholder year so the year-filter UI still
// has something to show if Sanity is unreachable. Once real data flows
// in from Sanity, real "year" values (set per photo in Studio) take over.
const FALLBACK_PHOTOS = [
  { _id: "f1", url: pandalWide1, caption: "The pandal, full view", year: "2025" },
  { _id: "f2", url: idols1, caption: "Durga and family, evening light", year: "2025" },
  { _id: "f3", url: pandalWide2, caption: "Sarbojanin Durgotsav stage", year: "2025" },
  { _id: "f4", url: durgaPortrait1, caption: "Devi, full portrait", year: "2025" },
  { _id: "f5", url: durgaFaceClose, caption: "Devi, close detail", year: "2025" },
  { _id: "f6", url: idols2, caption: "The full pandal", year: "2025" },
  { _id: "f7", url: ganeshClose, caption: "Ganesh, close detail", year: "2025" },
  { _id: "f8", url: pujaRitual, caption: "Pujo in progress", year: "2025" },
  { _id: "f9", url: idols3, caption: "Stage, wide angle", year: "2025" },
  { _id: "f10", url: idolsSide, caption: "Idols, side view", year: "2025" },
  { _id: "f11", url: deviDetail, caption: "Devi, portrait detail", year: "2025" },
  { _id: "f12", url: durgaStage, caption: "Sarbojanin Durgotsav, presented by Ankur", year: "2025" },
];

export default function Gallery() {
  useReveal();
  const { data: rawPhotos } = useSanityData(fetchGalleryPhotos, null);

  // Sanity photos need urlFor() to become real URLs; fallback photos
  // are already plain URLs from the local imports above.
  // Two sizes: a smaller one for the grid thumbnail, a larger one for
  // the lightbox, so the enlarged view isn't stretching an 800px image.
  const photos = rawPhotos
    ? rawPhotos.map((p) => ({
        _id: p._id,
        thumbUrl: urlFor(p.image).width(800).url(),
        fullUrl: urlFor(p.image).width(1800).url(),
        caption: p.caption,
        year: p.year,
      }))
    : FALLBACK_PHOTOS.map((p) => ({ ...p, thumbUrl: p.url, fullUrl: p.url }));

  // Distinct years present in the data, newest first. Photos with no
  // year set (e.g. not yet tagged in Studio after the schema update)
  // are grouped under "Undated" so nothing silently disappears.
  const years = useMemo(() => {
    const set = new Set(photos.map((p) => p.year || "Undated"));
    return Array.from(set).sort((a, b) => {
      if (a === "Undated") return 1;
      if (b === "Undated") return -1;
      return b.localeCompare(a);
    });
  }, [photos]);

  const [selectedYear, setSelectedYear] = useState(null);

  // Default to the newest year once data has loaded.
  useEffect(() => {
    if (years.length > 0 && !selectedYear) {
      setSelectedYear(years[0]);
    }
  }, [years, selectedYear]);

  const filteredPhotos = useMemo(
    () => photos.filter((p) => (p.year || "Undated") === selectedYear),
    [photos, selectedYear]
  );

  // Lightbox state: null = closed, otherwise the index into filteredPhotos.
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const closeLightbox = () => setLightboxIndex(null);
  const showPrev = () =>
    setLightboxIndex((i) => (i - 1 + filteredPhotos.length) % filteredPhotos.length);
  const showNext = () =>
    setLightboxIndex((i) => (i + 1) % filteredPhotos.length);

  // Close the lightbox if the year changes underneath it (filteredPhotos
  // shifts), and wire up keyboard navigation while it's open.
  useEffect(() => {
    setLightboxIndex(null);
  }, [selectedYear]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxIndex, filteredPhotos.length]);

  const activePhoto = lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null;

  return (
    <>
      <header className="page-header">
        <GlowLayer />
        <RisingEmbers count={35} />
        <span className="kicker">Moments</span>
        <h1>Gallery</h1>
        <h1 className="headline font-bangla">স্মৃতিকথা</h1>
        <p>Photos from our celebrations — replace or add to this collection as each new event passes.</p>
      </header>

      <section className="section">
        {years.length > 1 && (
          <div className="gallery-year-tabs">
            {years.map((y) => (
              <button
                key={y}
                type="button"
                className={`year-btn${y === selectedYear ? " active" : ""}`}
                onClick={() => setSelectedYear(y)}
              >
                {y}
              </button>
            ))}
          </div>
        )}

        {/*
          IMPORTANT: this wrapper div keeps the "reveal" class and never
          unmounts when the year changes — only its children (the photos
          inside) swap out. This avoids the useReveal conditional-mount
          bug (see project reference, section 7.3): if "reveal" lived on
          something that got unmounted/remounted per year, the new grid
          would never get scanned by the IntersectionObserver and would
          stay invisible.
        */}
        <div className="gallery-grid reveal">
          {filteredPhotos.map((p, i) => (
            <div
              className="gallery-item"
              key={p._id}
              onClick={() => setLightboxIndex(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setLightboxIndex(i);
              }}
            >
              <img src={p.thumbUrl} alt={p.caption} loading="lazy" />
              <span className="cap">{p.caption}</span>
            </div>
          ))}
        </div>
      </section>

      {activePhoto && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button
            className="lightbox-close"
            onClick={closeLightbox}
            aria-label="Close"
          >
            &times;
          </button>

          {filteredPhotos.length > 1 && (
            <button
              className="lightbox-arrow lightbox-arrow-left"
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
              aria-label="Previous photo"
            >
              &#8249;
            </button>
          )}

          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={activePhoto.fullUrl} alt={activePhoto.caption} />
            {activePhoto.caption && (
              <span className="lightbox-caption">{activePhoto.caption}</span>
            )}
          </div>

          {filteredPhotos.length > 1 && (
            <button
              className="lightbox-arrow lightbox-arrow-right"
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              aria-label="Next photo"
            >
              &#8250;
            </button>
          )}
        </div>
      )}
    </>
  );
}
