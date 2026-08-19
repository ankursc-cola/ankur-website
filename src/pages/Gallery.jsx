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

const FALLBACK_PHOTOS = [
  { _id: "f1", url: pandalWide1, caption: "The pandal, full view" },
  { _id: "f2", url: idols1, caption: "Durga and family, evening light" },
  { _id: "f3", url: pandalWide2, caption: "Sarbojanin Durgotsav stage" },
  { _id: "f4", url: durgaPortrait1, caption: "Devi, full portrait" },
  { _id: "f5", url: durgaFaceClose, caption: "Devi, close detail" },
  { _id: "f6", url: idols2, caption: "The full pandal" },
  { _id: "f7", url: ganeshClose, caption: "Ganesh, close detail" },
  { _id: "f8", url: pujaRitual, caption: "Pujo in progress" },
  { _id: "f9", url: idols3, caption: "Stage, wide angle" },
  { _id: "f10", url: idolsSide, caption: "Idols, side view" },
  { _id: "f11", url: deviDetail, caption: "Devi, portrait detail" },
  { _id: "f12", url: durgaStage, caption: "Sarbojanin Durgotsav, presented by Ankur" },
];

export default function Gallery() {
  useReveal();
  const { data: rawPhotos } = useSanityData(fetchGalleryPhotos, null);

  // Sanity photos need urlFor() to become real URLs; fallback photos
  // are already plain URLs from the local imports above.
  const photos = rawPhotos
    ? rawPhotos.map((p) => ({
        _id: p._id,
        url: urlFor(p.image).width(800).url(),
        caption: p.caption,
      }))
    : FALLBACK_PHOTOS;

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
        <div className="gallery-grid reveal">
          {photos.map((p) => (
            <div className="gallery-item" key={p._id}>
              <img src={p.url} alt={p.caption} loading="lazy" />
              <span className="cap">{p.caption}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
