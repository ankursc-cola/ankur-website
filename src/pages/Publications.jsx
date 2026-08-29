import GlowLayer from "../components/GlowLayer.jsx";
import useReveal from "../hooks/useReveal.js";
import RisingEmbers from "../components/RisingEmbers.jsx";
import useSanityData from "../hooks/useSanityData.js";
import { fetchPublications, urlFor } from "../lib/sanity.js";

const FALLBACK_ISSUES = [
  { _id: "f1", year: "2025", title: "Durga Puja Souvenir Magazine", blurb: "Our annual keepsake — member writing, art, and event highlights.", pdfUrl: null, coverImage: null },
  { _id: "f2", year: "2024", title: "Durga Puja Souvenir Magazine", blurb: "Last year's edition, archived here for the community.", pdfUrl: null, coverImage: null },
];

export default function Publications() {
  useReveal();
  const { data: issues } = useSanityData(fetchPublications, FALLBACK_ISSUES);

  return (
    <>
      <header className="page-header">
        <GlowLayer />
        <RisingEmbers count={35} />
        <span className="kicker">Read</span>
        <h1>Publications</h1>
        <h1 className="headline font-bangla">শারদীয়া সঙ্কলন</h1>
        <p>Our annual souvenir magazine and other community writing, past and present.</p>
      </header>

      <section className="section">
        <div className="card-row reveal">
          {issues.map((i) => (
            <div className="card" key={i._id}>
              {i.coverImage && (
                <img
                  src={urlFor(i.coverImage).width(200).height(260).fit("crop").url()}
                  alt={`${i.title} cover`}
                  style={{
                    width: "140px",
                    aspectRatio: "200 / 260",
                    objectFit: "cover",
                    borderRadius: 8,
                    marginBottom: 12,
                  }}
                />
              )}
              <span className="tag" style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                {i.year}
              </span>
              <h3>{i.title}</h3>
              <p style={{ fontSize: "1.15rem", lineHeight: 1.5 }}>{i.blurb}</p>
              {i.pdfUrl && (
                <p style={{ marginTop: 12 }}>
                  <a
                    href={i.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost"
                    style={{ borderColor: "var(--vermillion)", color: "var(--vermillion)" }}
                  >
                    Read the PDF →
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
