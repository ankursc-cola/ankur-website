import { Link } from "react-router-dom";
import GlowLayer from "../components/GlowLayer.jsx";
import useReveal from "../hooks/useReveal.js";
import ankurLogo from "../assets/ankur-logo.png";
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
        <p>
          From a handful of families gathering for Saraswati Puja to a full calendar of
          festivals culminating in our main Sarbojanin Durgotsav each October, Ankur has
          grown into a home away from home for Bengali families in South Carolina.
        </p>
        <p>
          We're based in Columbia, but our members travel in from across the Midlands and
          beyond — some driving over an hour, year after year, because there's nowhere
          closer that feels quite like this. What started as a small circle of families
          who wanted their children to grow up knowing the sound of the dhak and the
          smell of khichuri on Ashtami has become a full community calendar. We start the
          year with Saraswati Puja in late winter, welcoming our students and their books
          for blessing. Spring brings Holi, color and water and music spilling across
          someone's backyard. Poila Boishakh marks the Bengali New Year with new clothes,
          alpona at the door, and the hope that comes with a fresh start. Summer is for
          the picnic — no ritual, no program, just food and children running and the easy
          kind of gathering that doesn't need an occasion. Then autumn arrives, and
          everything builds toward Durga Pujo: three days of pandal, pujo, cultural
          programs, and feasts that take a full community effort to pull off, followed by
          the bittersweet close of Bijoya Sammiloni. The year ends with Deepaboli's
          lights and sweets, carrying us back around to Saraswati again.
        </p>
        <p>
          Ankur means <em>sprout</em> — a seed that remembers where it came from, even as
          it grows into something new. That's the balance we're always trying to strike:
          honoring the traditions our parents and grandparents carried with them, while
          making room for a version of Bengali identity that our children — many of whom
          have never set foot in Kolkata — can call their own. For a lot of our families,
          Ankur is the one place all year where that identity doesn't have to be
          explained or translated. It just is.
        </p>
          <div className="gallery-grid compact reveal" style={{ marginTop: 40 }}>
            <div
              className="gallery-item"
              style={{
                aspectRatio: "1 / 1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                overflow: "hidden",
                boxShadow: "none",
                border: "none",
                background: "transparent",
              }}
            >
              <img
                src={ankurLogo}
                alt="Ankur logo"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
          </div>
      </section>

      <section className="section" style={{ background: "rgba(51,25,15,0.04)" }}>
        <span className="kicker">How We Run</span>
        <h2 className="dark-text">Who We Are</h2>
        <p className="lead">
          Ankur is entirely volunteer-run — there's no paid staff, no office, no budget
          line for the work that actually makes these events happen.
        </p>
        <p className="lead">
          It's families who take vacation days to decorate the pandal, spend weekends
          rehearsing cultural programs with kids who'd rather be doing anything else
          (until the night they're on stage, and suddenly they wouldn't miss it), and
          cook for hundreds out of home kitchens and borrowed hotel banquet space. Our
          Executive Committee changes hands every two years, which keeps the organization
          from calcifying around any one family or generation, even as the values it was
          built on stay the same.
        </p>
        <p style={{ marginTop: 24 }}>
          <Link
            to="/committee"
            className="btn btn-ghost"
            style={{ borderColor: "var(--vermillion)", color: "var(--vermillion)" }}
          >
            Meet Our Present and Past Leadership →
          </Link>
        </p>
      </section>

      <section className="section light-text" style={{ background: "var(--ink-light)" }}>
        {/* Gives this section its own dark background, since it's the only one
        on the page meant to sit on dark instead of cream. */}
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

      <section className="section dark-text">
        <span className="kicker">Join Us</span>
        <h2 className="dark-text">Get Involved</h2>
        <p>
          Whether you just moved to Columbia last month or you've been part of this
          community since before Ankur had a name, whether you grew up with these
          festivals or you're curious what a real Durga Pujo pandal looks like from the
          inside — there's a place for you here.
        </p>
        <p>
          Come to an event first, no membership required. If it feels like home, we hope
          you'll join us as a member and help carry it forward for the next family who
          walks in the door for the first time.
        </p>
        <div className="cta-row" style={{ marginTop: 24 }}>
          <Link
            to="/members"
            className="btn btn-ghost"
            style={{ borderColor: "var(--vermillion)", color: "var(--vermillion)" }}
          >
            See Upcoming Events
          </Link>
          <Link
            to="/members"
            className="btn btn-ghost"
            style={{ borderColor: "var(--vermillion)", color: "var(--vermillion)" }}
          >
            Become a Member
          </Link>
          <a
          
            href="https://www.facebook.com/groups/239252402772665/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
            style={{
              borderColor: "var(--vermillion)",
              color: "var(--vermillion)",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06C2 17.06 5.66 21.2 10.44 21.95V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.95C18.34 21.2 22 17.06 22 12.06Z" />
            </svg>
            Follow Us on Facebook
          </a>
        </div>
      </section>
    </>
  );
}
