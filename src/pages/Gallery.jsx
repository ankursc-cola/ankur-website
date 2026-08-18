import GlowLayer from "../components/GlowLayer.jsx";
import useReveal from "../hooks/useReveal.js";

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

const PHOTOS = [
  { src: pandalWide1, cap: "The pandal, full view" },
  { src: idols1, cap: "Durga and family, evening light" },
  { src: pandalWide2, cap: "Sarbojanin Durgotsav stage" },
  { src: durgaPortrait1, cap: "Devi, full portrait" },
  { src: durgaFaceClose, cap: "Devi, close detail" },
  { src: idols2, cap: "The full pandal" },
  { src: ganeshClose, cap: "Ganesh, close detail" },
  { src: pujaRitual, cap: "Pujo in progress" },
  { src: idols3, cap: "Stage, wide angle" },
  { src: idolsSide, cap: "Idols, side view" },
  { src: deviDetail, cap: "Devi, portrait detail" },
  { src: durgaStage, cap: "Sarbojanin Durgotsav, presented by Ankur" },
];

export default function Gallery() {
  useReveal();
  return (
    <>
      <header className="page-header">
        <GlowLayer />
        <span className="kicker">Moments</span>
        <h1>Gallery</h1>
        <p>Photos from our celebrations — replace or add to this collection as each new event passes.</p>
      </header>

      <section className="section">
        <div className="gallery-grid reveal">
          {PHOTOS.map((p) => (
            <div className="gallery-item" key={p.cap}>
              <img src={p.src} alt={p.cap} loading="lazy" />
              <span className="cap">{p.cap}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
