import { Link } from "react-router-dom";
import GlowLayer from "../components/GlowLayer.jsx";
import RisingEmbers from "../components/RisingEmbers.jsx";
import LiveAlpona from "../components/LiveAlpona.jsx";
import useReveal from "../hooks/useReveal.js";
import useSanityData from "../hooks/useSanityData.js";
import { fetchFeaturedEvent, fetchHomeGalleryPhotos, urlFor } from "../lib/sanity.js";

import durgaStage from "../assets/img/durga-puja-stage.jpg";
import deviDetail from "../assets/img/devi-detail.jpg";
import idols1 from "../assets/img/idols-1.jpg";
import idols2 from "../assets/img/idols-2.jpg";
import ganeshClose from "../assets/img/ganesh-close.jpg";
import pujaRitual from "../assets/img/puja-ritual.jpg";
import HoliAlpona from "../components/HoliAlpona.jsx";
import BoiAlpona from "../components/BoiAlpona.jsx";
import NoboAlpona from "../components/NoboAlpona.jsx";

import culturalPrograms from "../assets/img/cultural-programs.png";
import sindurKhela from "../assets/img/sindur-khela.png";
import communityFeast from "../assets/img/community-feast.png";



// The hero's "Next Event" badge is the only thing on this page that's
// dynamic (pulled from Sanity's featured event). If Sanity has no
// event marked "Featured" yet, or can't be reached, this shows instead.
const FALLBACK_FEATURED_EVENT = {
  name: "Durga Puja",
  nameBangla: "সার্বজনীন দুর্গোৎসব ২০২৬",
  dateText: "Oct 16–18 · 2026",
  alponaStyle: "classic",
};

// The full yearly festival calendar is intentionally STATIC — it
// barely changes year to year, so it is not fetched from Sanity at
// all. Only WHICH ONE is highlighted changes, driven by comparing
// each card's name against the Sanity-fetched featuredEvent below.
// If you add/rename/remove a festival, edit this array directly.
const EVENTS = [
  { _id: "e1", name: "Saraswati Puja", blurb: "Honoring the goddess of knowledge and the arts, welcomed with our children in their new clothes." },
  { _id: "e2", name: "Holi", blurb: "Colors, music, and spring joy shared across the whole community." },
  { _id: "e21", name: "Poila Boishak", blurb: "Bengali new year food, music, and spring joy shared across the whole community." },
  { _id: "e3", name: "Summer Picnic", blurb: "A relaxed outdoor gathering — food, games, and catching up under the sun." },
  { _id: "e4", name: "Durga Puja", blurb: "Our main annual event — three days of pujo, cultural programs, and community feasting." },
  { _id: "e5", name: "Bijoya Sammiloni", blurb: "A warm farewell gathering following Durga Puja, with music and reunion." },
  { _id: "e6", name: "Deepaboli", blurb: "Lights, sweets, and community diya-lighting for the festival of lights." },
  { _id: "e61", name: "New Year", blurb: "English New Year Celebration, food, music, dance, and community feasting" },
];

const FALLBACK_GALLERY = [
  { _id: "g1", url: idols1, caption: "Sarbojanin Durgotsav" },
  { _id: "g2", url: ganeshClose, caption: "Ganesh" },
  { _id: "g3", url: pujaRitual, caption: "Pujo in progress" },
  { _id: "g4", url: idols2, caption: "The full pandal" },
];

const ALPONA_COMPONENTS = {
  classic: LiveAlpona,
  holi: HoliAlpona,
  boi: BoiAlpona,
  nobo: NoboAlpona,
};

export default function Home() {
  useReveal();

  const { data: featuredEvent } = useSanityData(fetchFeaturedEvent, FALLBACK_FEATURED_EVENT);

  const { data: rawGallery } = useSanityData(fetchHomeGalleryPhotos, null);
  const gallery = rawGallery
    ? rawGallery.map((p) => ({ _id: p._id, url: urlFor(p.image).width(500).url(), caption: p.caption }))
    : FALLBACK_GALLERY;

  return (
    <>
      <section className="hero">
        <GlowLayer />
        <RisingEmbers count={100} />

        <div className="eyebrow">Bengali Association of South Carolina</div>
        <h1 className="headline font-bangla">অঙ্কুর</h1>
        <p className="sub">
          Ankur means sprout: a seed that refuses to forget where it came from.
        </p>



        <div className="cta-row">
          <Link to="/events" className="btn btn-primary">
            {featuredEvent.nameBangla ? `${featuredEvent.nameBangla} · ` : ""}
            {featuredEvent.name} · {featuredEvent.dateText}
          </Link>
          
            {featuredEvent.flyerUrl && (
              <a
                href={featuredEvent.flyerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
                style={{ borderColor: "var(--gold-glow)", color: "var(--gold-glow)" }}
              >
                Download Flyer
              </a>
            )}
            <Link to="/events" className="btn btn-ghost">See All Events</Link>
        </div>


        <div className="hero-photo-wrap">
          <img className="hero-photo" src={durgaStage} alt="Sarbojanin Durgotsav, presented by Ankur, South Carolina" />
          <img className="hero-photo-accent" src={deviDetail} alt="Devi, close detail" />
        </div>

        <div className="alpona-wrap">
          {(() => {
            const AlponaComponent = ALPONA_COMPONENTS[featuredEvent.alponaStyle] || LiveAlpona;
            return <AlponaComponent size={320} />;
          })()}
        </div>

        <div className="scroll-cue">↓ scroll</div>
      </section>

      <section className="section">
        <span className="kicker">Year after Year</span>
        <h2 className="dark-text">Our Main Celebrations</h2>
        <div className="card-row reveal">
          {EVENTS.map((e) => {
            const isFeatured =
              featuredEvent?.name &&
              e.name.toLowerCase() === featuredEvent.name.toLowerCase();
            return (
              <div key={e._id} className={`card ${isFeatured ? "highlight" : ""}`}>
                <h3>{e.name}</h3>
                <p>{e.blurb}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section" style={{ background: "rgba(51,25,15,0.04)" }}>
        <span className="kicker">From Last Season</span>
        <h2 className="dark-text">A Glimpse of the Pandal</h2>
        <p className="lead">
          Every year our community transforms a hall into a home for the Devi, hand-decorated,
          lit, and filled with the whole family মা দুর্গা . গণেশ . লক্ষী . সরস্বতী . ও . কার্তিক.
        </p>
        <div className="gallery-grid reveal">
          {gallery.map((g) => (
            <div className="gallery-item" key={g._id}>
              <img src={g.url} alt={g.caption} />
              <span className="cap">{g.caption}</span>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 24 }}>
          <Link to="/gallery" className="btn btn-ghost" style={{ borderColor: "var(--vermillion)", color: "var(--vermillion)" }}>
            View Full Gallery →
          </Link>
        </p>
      </section>

      <section className="section dark-text">
        <span className="kicker" style={{ color: "var(--crimson)" }}>Our Community</span>
        <h2>A Family That Grows Every Year</h2>
        <p className="lead">
          Ankur is run entirely by volunteers — families who show up early to decorate, cook,
          rehearse, and welcome newcomers.
        </p>
        <div className="card-row reveal">
          <div className="people-card">
            
            <img className="people-avatar" src={culturalPrograms} alt="Cultural Programs" />
            <h4>Cultural Programs</h4>
            <p>Dance, music, and drama rehearsed by our own members each season.</p>
          </div>
          <div className="people-card">
            
            <img className="people-avatar" src={sindurKhela} alt="Sindur Khela" />
            <h4>Sindur Khela</h4>
            <p>Married women marking Bijoya with vermillion, laughter, and blessings.</p>
          </div>
          <div className="people-card">
            
            <img className="people-avatar" src={communityFeast} alt="Community Feast" />
            <h4>Community Feast</h4>
            <p>Bhog and community dinners that bring every generation to one table.</p>
          </div>
        </div>
      </section>
    </>
  );
}
