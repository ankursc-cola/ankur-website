import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import GlowLayer from "../components/GlowLayer.jsx";
import useReveal from "../hooks/useReveal.js";
import RisingEmbers from "../components/RisingEmbers.jsx";
import useSanityData from "../hooks/useSanityData.js";
import { fetchGalleryPhotos, urlFor, EVENT_OPTIONS } from "../lib/sanity.js";

// Fallback photos (used if Sanity is unreachable), all Durga Puja,
// so the /gallery/durga-puja route always has something to show.
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

const FALLBACK_PHOTOS = [
  { _id: "f1", url: pandalWide1, caption: "The pandal, full view", year: "2025", event: "durga-puja" },
  { _id: "f2", url: idols1, caption: "Durga and family, evening light", year: "2025", event: "durga-puja" },
  { _id: "f3", url: pandalWide2, caption: "Sarbojanin Durgotsav stage", year: "2025", event: "durga-puja" },
  { _id: "f4", url: durgaPortrait1, caption: "Devi, full portrait", year: "2025", event: "durga-puja" },
  { _id: "f5", url: durgaFaceClose, caption: "Devi, close detail", year: "2025", event: "durga-puja" },
  { _id: "f6", url: idols2, caption: "The full pandal", year: "2025", event: "durga-puja" },
  { _id: "f7", url: ganeshClose, caption: "Ganesh, close detail", year: "2025", event: "durga-puja" },
  { _id: "f8", url: pujaRitual, caption: "Pujo in progress", year: "2025", event: "durga-puja" },
  { _id: "f9", url: idols3, caption: "Stage, wide angle", year: "2025", event: "durga-puja" },
  { _id: "f10", url: idolsSide, caption: "Idols, side view", year: "2025", event: "durga-puja" },
  { _id: "f11", url: deviDetail, caption: "Devi, portrait detail", year: "2025", event: "durga-puja" },
  { _id: "f12", url: durgaStage, caption: "Sarbojanin Durgotsav, presented by Ankur", year: "2025", event: "durga-puja" },
];

const EVENT_LABELS = EVENT_OPTIONS.reduce((acc, o) => {
  acc[o.value] = o.title;
  return acc;
}, {});

export default function GalleryEvent() {
  useReveal();
  const { eventSlug } = useParams();
  const { data: rawPhotos } = useSanityData(fetchGalleryPhotos, null);

  const allPhotos = rawPhotos
    ? rawPhotos.map((p) => ({
        _id: p._id,
        thumbUrl: urlFor(p.image).width(800).url(),
        fullUrl: urlFor(p.image).width(1800).url(),
        caption: p.caption,
        year: p.year,
        event: p.event,
      }))
    : FALLBACK_PHOTOS.map((p) => ({ ...p, thumbUrl: p.url, fullUrl: p.url }));

  // Everything below this line is scoped to just this event's photos —
  // the year filter, folder-safe reveal wrapper, and lightbox all work
  // exactly as they did on the single-gallery page, just pre-filtered.
  const photos = useMemo(
    () => allPhotos.filter((p) => (p.event || "uncategorized") === eventSlug),
    [allPhotos, eventSlug]
  );

  const years = useMemo(() => {
    const set = new Set(photos.map((p) => p.year || "Undated"));
    return Array.from(set).sort((a, b) => {
      if (a === "Undated") return 1;
      if (b === "Undated") return -1;
      return b.localeCompare(a);
    });
  }, [photos]);

  const [selectedYear, setSelectedYear] = useState(null);

  useEffect(() => {
    // Reset to the newest year whenever the event itself changes
    // (navigating from one folder straight to another).
    setSelectedYear(years[0] || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventSlug, years.length]);

  const filteredPhotos = useMemo(
    () => photos.filter((p) => (p.year || "Undated") === selectedYear),
    [photos, selectedYear]
  );

  const [lightboxIndex, setLightboxIndex] = useState(null);
  const closeLightbox = () => setLightboxIndex(null);
  const showPrev = () =>
    setLightboxIndex((i) => (i - 1 + filteredPhotos.length) % filteredPhotos.length);
  const showNext = () =>
    setLightboxIndex((i) => (i + 1) % filteredPhotos.length);

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
  const eventLabel = EVENT_LABELS[eventSlug] || "Gallery";

  return (
    <>
      <header className="page-header">
        <GlowLayer />
        <RisingEmbers count={35} />
        <span className="kicker">Moments</span>
        <h1>{eventLabel}</h1>
        <h1 className="headline font-bangla">স্মৃতিকথা</h1>
        <p>
          <Link to="/gallery" className="gallery-back-link">
            &larr; All events
          </Link>
        </p>
      </header>

      <section className="section">
        {photos.length === 0 ? (
          <p>No photos have been added for this event yet.</p>
        ) : (
          <>
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
          </>
        )}
      </section>

      {activePhoto && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Close">
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
