import GlowLayer from "../components/GlowLayer.jsx";
import useReveal from "../hooks/useReveal.js";
import RisingEmbers from "../components/RisingEmbers.jsx";
import useSanityData from "../hooks/useSanityData.js";
import { fetchEvents } from "../lib/sanity.js";

const FALLBACK_EVENTS = [
  { _id: "f1", name: "Saraswati Puja", dateText: "Winter / Early Spring", blurb: "Honoring the goddess of knowledge and the arts, welcomed with our children in their new clothes.", featured: false },
  { _id: "f2", name: "Holi", dateText: "Spring", blurb: "Colors, music, and spring joy shared across the whole community.", featured: false },
  { _id: "f3", name: "Summer Picnic", dateText: "Summer", blurb: "A relaxed outdoor gathering — food, games, and catching up under the sun.", featured: false },
  { _id: "f4", name: "Sarbojanin Durgotsav (Durga Puja)", dateText: "October 16–18, 2026", blurb: "Our main annual event — three days of pujo, cultural programs, and community feasting.", featured: true },
  { _id: "f5", name: "Bijoya Sammiloni", dateText: "Following Durga Puja", blurb: "A warm farewell gathering with music, food, and reunion.", featured: false },
  { _id: "f6", name: "Deepaboli", dateText: "Autumn", blurb: "Lights, sweets, and community diya-lighting for the festival of lights.", featured: false },
  { _id: "f7", name: "Poila Baishakh (New Year)", dateText: "Mid-April", blurb: "Bengali New Year — a fresh start celebrated together as one Ankur family.", featured: false },
];

export default function Events() {
  useReveal();
  const { data: events } = useSanityData(fetchEvents, FALLBACK_EVENTS);

  return (
    <>
      <header className="page-header">
        <GlowLayer />
        <RisingEmbers count={35} />
        <span className="kicker">Our Calendar</span>
        <h1>Events</h1>
        <h1 className="headline font-bangla">আমাদের উৎসব</h1>
        <p>The festivals and gatherings that bring the Ankur community together, year after year.</p>
      </header>

      <section className="section">
        
          <div className="card-row events-row reveal">
          {events.map((e) => (
          <div key={e._id} className={`card ${e.featured ? "highlight" : ""}`}>
            <span className="tag">{e.dateText}</span>
            <h3>{e.name}</h3>
            {e.nameBangla && (
              <p className="font-bangla" style={{ margin: "2px 0 8px", opacity: 0.75 }}>
                {e.nameBangla}
              </p>
            )}
            <p>{e.blurb}</p>
            {e.flyerUrl && (
              <p style={{ marginTop: 12 }}>
                <a
                  href={e.flyerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                  style={{ borderColor: "var(--vermillion)", color: "var(--vermillion)" }}
                >
                  Download Flyer →
                </a>
              </p>
            )}
          </div>
          ))}
        </div>
      </section>
    </>
  );
}
