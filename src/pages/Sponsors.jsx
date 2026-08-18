import GlowLayer from "../components/GlowLayer.jsx";
import useReveal from "../hooks/useReveal.js";

const TIERS = [
  { name: "Platinum", blurb: "Top billing on the Durga Puja banner, souvenir magazine, and website." },
  { name: "Gold", blurb: "Featured logo placement at the main event and in the souvenir magazine." },
  { name: "Silver", blurb: "Logo listed on the website and event program." },
];

export default function Sponsors() {
  useReveal();
  return (
    <>
      <header className="page-header">
        <GlowLayer />
        <span className="kicker">Support Ankur</span>
        <h1>Sponsors</h1>
        <p>Our celebrations are made possible by generous community and business sponsors.</p>
      </header>

      <section className="section">
        <div className="card-row reveal">
          {TIERS.map((t) => (
            <div className="card" key={t.name}>
              <span className="tag">Tier</span>
              <h3>{t.name}</h3>
              <p>{t.blurb}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
