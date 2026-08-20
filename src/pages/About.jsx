import GlowLayer from "../components/GlowLayer.jsx";
import useReveal from "../hooks/useReveal.js";
import idolsSide from "../assets/img/idols-side.jpg";
import RisingEmbers from "../components/RisingEmbers.jsx";

export default function About() {
  useReveal();
  return (
    <>
      <header className="page-header">
        <GlowLayer />
          <RisingEmbers count={35} />
        <span className="kicker">Who We Are</span>
        <h1>About Ankur</h1>
        <h1 className="headline font-bangla">আমাদের কথা</h1>
        <p>
          Ankur — meaning "sprout" — is the Bengali Association of South Carolina
        </p>
      </header>

      <section className="section dark-text">
        <span className="kicker">Our Story</span>
        <h2 className="dark-text">A Community Built by Its Members</h2>
        <p className="lead">
          From a handful of families gathering for Saraswati Puja to a full calendar of
          festivals culminating in our main Sarbojanin Durgotsav each October, Ankur has
          grown into a home away from home for Bengali families in South Carolina
        </p>
        <div className="gallery-grid compact reveal" style={{ marginTop: 40 }}>
          <div className="gallery-item">
            <img src={idolsSide} alt="Durga Puja idols, side view" />
          </div>
        </div>
      </section>

      <section className="section light-text" style={{ background: "var(--ink-light)" }}>
          {/* NEW: gives this section its own dark background, since it's the
      only one on the page meant to sit on dark instead of cream.
      Keeping "card on-dark" as you originally had it — it was
      correctly styled all along, just missing a dark backdrop to
      actually sit on. */}

        <span className="kicker" style={{ color: "var(--gold-glow)" }}>What We Value</span>
        <h2>Mission &amp; Vision</h2>
        <div className="card-row reveal">
          <div className="card on-dark">
            <span className="tag">Mission</span>
            <h3>Culture, Kept Alive</h3>
            <p>Preserve and share Bengali traditions, language, and celebrations with every generation.</p>
          </div>
          <div className="card on-dark">
            <span className="tag">Vision</span>
            <h3>A Welcoming Home</h3>
            <p>Be the gathering point where Bengali families in South Carolina feel at home, together.</p>
          </div>
          <div className="card on-dark">
            <span className="tag">How</span>
            <h3>Volunteer-Led</h3>
            <p>Every event, from decoration to cooking to cultural programs, is run by our own members.</p>
          </div>
        </div>
      </section>
    </>
  );
}
