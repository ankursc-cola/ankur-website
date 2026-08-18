import GlowLayer from "../components/GlowLayer.jsx";
import useReveal from "../hooks/useReveal.js";

const ISSUES = [
  { year: "2025", title: "Durga Puja Souvenir Magazine", blurb: "Our annual keepsake — member writing, art, and event highlights." },
  { year: "2024", title: "Durga Puja Souvenir Magazine", blurb: "Last year's edition, archived here for the community." },
];

export default function Publications() {
  useReveal();
  return (
    <>
      <header className="page-header">
        <GlowLayer />
        <span className="kicker">Read</span>
        <h1>Publications</h1>
        <p>Our annual souvenir magazine and other community writing, past and present.</p>
      </header>

      <section className="section">
        <div className="card-row reveal">
          {ISSUES.map((i) => (
            <div className="card" key={i.year + i.title}>
              <span className="tag">{i.year}</span>
              <h3>{i.title}</h3>
              <p>{i.blurb}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
