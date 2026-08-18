import { Link } from "react-router-dom";
import GlowLayer from "../components/GlowLayer.jsx";
import RisingEmbers from "../components/RisingEmbers.jsx";
import LiveAlpona from "../components/LiveAlpona.jsx";
import useReveal from "../hooks/useReveal.js";

import durgaStage from "../assets/img/durga-puja-stage.jpg";
import deviDetail from "../assets/img/devi-detail.jpg";
import idols1 from "../assets/img/idols-1.jpg";
import idols2 from "../assets/img/idols-2.jpg";
import ganeshClose from "../assets/img/ganesh-close.jpg";
import pujaRitual from "../assets/img/puja-ritual.jpg";

const EVENTS = [
  { name: "Saraswati Puja", blurb: "Honoring the goddess of knowledge and the arts, welcomed with our children in their new clothes." },
  { name: "Holi", blurb: "Colors, music, and spring joy shared across the whole community." },
  { name: "Summer Picnic", blurb: "A relaxed outdoor gathering — food, games, and catching up under the sun." },
  { name: "Durga Puja", blurb: "Our main annual event — three days of pujo, cultural programs, and community feasting.", highlight: true },
  { name: "Bijoya Sammiloni", blurb: "A warm farewell gathering following Durga Puja, with music and reunion." },
  { name: "Deepaboli", blurb: "Lights, sweets, and community diya-lighting for the festival of lights." },
];

export default function Home() {
  useReveal();

  return (
    <>
      <section className="hero">
        <GlowLayer />
        <RisingEmbers count={26} />

        <div className="eyebrow">Bengali Association of South Carolina</div>
        <h1 className="headline font-bangla">অঙ্কুর</h1>
        <p className="sub">
            Ankur means sprout — what a seed becomes when it refuses to forget where it came from.
        </p>

        <div className="cta-row">
          <Link to="/events" className="btn btn-primary">Durga Puja · Oct 16–18</Link>
          <Link to="/events" className="btn btn-ghost">See All Events</Link>
        </div>

        <div className="hero-photo-wrap">
          <img className="hero-photo" src={durgaStage} alt="Sarbojanin Durgotsav, presented by Ankur, South Carolina" />
          <img className="hero-photo-accent" src={deviDetail} alt="Devi, close detail" />
        </div>

        <div className="alpona-wrap">
          <LiveAlpona size={230} />
        </div>

        <div className="scroll-cue">↓ scroll</div>
      </section>

      <section className="section">
        <span className="kicker">This Year</span>
        <h2 className="dark-text">Upcoming Celebrations</h2>
        <div className="card-row">
          {EVENTS.map((e) => (
            <div key={e.name} className={`card reveal ${e.highlight ? "highlight" : ""}`}>
              <h3>{e.name}</h3>
              <p>{e.blurb}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section" style={{ background: "rgba(51,25,15,0.04)" }}>
        <span className="kicker">From Last Season</span>
        <h2 className="dark-text">A Glimpse of the Pandal</h2>
        <p className="lead">
          Every year our community transforms a hall into a home for the Devi — hand-decorated,
          lit, and filled with the whole family from Ganesh to Kartik.
        </p>
        <div className="gallery-grid reveal">
          <div className="gallery-item">
            <img src={idols1} alt="Durga idols on stage" />
            <span className="cap">Sarbojanin Durgotsav</span>
          </div>
          <div className="gallery-item">
            <img src={ganeshClose} alt="Ganesh idol, close detail" />
            <span className="cap">Ganesh</span>
          </div>
          <div className="gallery-item">
            <img src={pujaRitual} alt="Puja ritual in progress" />
            <span className="cap">Pujo in progress</span>
          </div>
          <div className="gallery-item">
            <img src={idols2} alt="Full pandal stage" />
            <span className="cap">The full pandal</span>
          </div>
        </div>
        <p style={{ marginTop: 24 }}>
          <Link to="/gallery" className="btn btn-ghost" style={{ borderColor: "var(--vermillion)", color: "var(--vermillion)" }}>
            View Full Gallery →
          </Link>
        </p>
      </section>

      <section className="section light-text">
        <span className="kicker" style={{ color: "var(--gold-glow)" }}>Our Community</span>
        <h2>A Family That Grows Every Year</h2>
        <p className="lead">
          Ankur is run entirely by volunteers — families who show up early to decorate, cook,
          rehearse, and welcome newcomers. Placeholders below mark where real member and event
          photography will go.
        </p>
        <div className="card-row reveal">
          <div className="people-card">
            <div className="people-avatar">অ</div>
            <h4>Cultural Programs</h4>
            <p>Dance, music, and drama rehearsed by our own members each season.</p>
          </div>
          <div className="people-card">
            <div className="people-avatar">সি</div>
            <h4>Sindur Khela</h4>
            <p>Married women marking Bijoya with vermillion, laughter, and blessings.</p>
          </div>
          <div className="people-card">
            <div className="people-avatar">খ</div>
            <h4>Community Feast</h4>
            <p>Bhog and community dinners that bring every generation to one table.</p>
          </div>
        </div>
      </section>
    </>
  );
}
