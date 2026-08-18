import GlowLayer from "../components/GlowLayer.jsx";
import useReveal from "../hooks/useReveal.js";
import RisingEmbers from "../components/RisingEmbers.jsx";

const EVENTS = [
  { name: "Saraswati Puja", season: "Winter / Early Spring", blurb: "Honoring the goddess of knowledge and the arts, welcomed with our children in their new clothes." },
  { name: "Holi", season: "Spring", blurb: "Colors, music, and spring joy shared across the whole community." },
  { name: "Summer Picnic", season: "Summer", blurb: "A relaxed outdoor gathering — food, games, and catching up under the sun." },
  { name: "Sarbojanin Durgotsav (Durga Puja)", season: "October 16–18, 2026", blurb: "Our main annual event — three days of pujo, cultural programs, and community feasting.", highlight: true },
  { name: "Bijoya Sammiloni", season: "Following Durga Puja", blurb: "A warm farewell gathering with music, food, and reunion." },
  { name: "Deepaboli", season: "Autumn", blurb: "Lights, sweets, and community diya-lighting for the festival of lights." },
  { name: "Poila Baishakh (New Year)", season: "Mid-April", blurb: "Bengali New Year — a fresh start celebrated together as one Ankur family." },
];

export default function Events() {
  useReveal();
  return (
    <>
      <header className="page-header page-header--tall">
        <GlowLayer />
        <RisingEmbers count={35} />
        <span className="kicker">Our Calendar</span>
        <h1>Events</h1>
        <p>The festivals and gatherings that bring the Ankur community together, year after year.</p>
      </header>

      <section className="section">
        <div className="card-row reveal">
          {EVENTS.map((e) => (
            <div key={e.name} className={`card ${e.highlight ? "highlight" : ""}`}>
              <span className="tag">{e.season}</span>
              <h3>{e.name}</h3>
              <p>{e.blurb}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
