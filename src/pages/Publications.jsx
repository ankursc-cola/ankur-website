import GlowLayer from "../components/GlowLayer.jsx";
import useReveal from "../hooks/useReveal.js";
import RisingEmbers from "../components/RisingEmbers.jsx";
import useSanityData from "../hooks/useSanityData.js";
import { fetchPublications, urlFor } from "../lib/sanity.js";

import { Helmet } from 'react-helmet-async';

const FALLBACK_ISSUES = [
  { _id: "f1", year: "2025", title: "Durga Puja Souvenir", blurb: "Our annual keepsake — member writing, art, and event highlights.", pdfUrl: null, coverImage: null },
  { _id: "f2", year: "2024", title: "Durga Puja Souvenir", blurb: "Last year's edition, archived here for the community.", pdfUrl: null, coverImage: null },
];

export default function Publications() {
  useReveal();
  const { data: issues } = useSanityData(fetchPublications, FALLBACK_ISSUES);

  return (
    <>
          <Helmet>
              <title>Publications | Ankur Bengali Association SC</title>
              <meta name="description" content="Ankur's community publications and newsletters for the Bengali community in South Carolina." />
          </Helmet>
      <header className="page-header">
        <GlowLayer />
        <RisingEmbers count={35} />
        <span className="kicker">Read</span>
        <h1>Publications</h1>
        <h1 className="headline font-bangla">শারদীয়া সঙ্কলন</h1>
        <p>Our annual souvenir magazine and other community writing, past and present.</p>
      </header>

      <section className="section">
        {/* pub-card-row instead of the shared card-row: this page needs cards
            that never shrink, whereas card-row elsewhere is allowed to. */}
        <div className="pub-card-row reveal">
          {issues.map((i) => (
            <div className="card pub-card" key={i._id}>
              <div className="pub-row">
                {i.coverImage && (
                  <img
                    src={urlFor(i.coverImage).width(220).height(285).fit("crop").url()}
                    alt={`${i.title} cover`}
                    className="pub-thumb"
                  />
                )}
                <div className="pub-side">
                  <span className="tag pub-year">{i.year}</span>
                  <h3 className="pub-title">{i.title}</h3>
                  <p className="pub-blurb">{i.blurb}</p>
                  {i.pdfUrl && (
                    <a
                      href={i.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost pub-pdf-btn"
                    >
                      Read the PDF →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
