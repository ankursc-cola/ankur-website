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
              <div style={{ display: "flex", gap: 16, alignItems: "stretch" }}>
                {i.coverImage && (
                  <img
                    src={urlFor(i.coverImage).width(200).height(260).fit("crop").url()}
                    alt={`${i.title} cover`}
                    style={{
                      width: "140px",
                      flexShrink: 0,
                      aspectRatio: "200 / 260",
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                )}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <span className="tag" style={{ fontSize: "2rem", fontWeight: 600 }}>
                    {i.year}
                  </span>
                  {i.pdfUrl && (
                    <a
                      href={i.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost"
                      style={{ borderColor: "var(--vermillion)", color: "var(--vermillion)" }}
                    >
                      Read the PDF →
                    </a>
                  )}
                </div>
              </div>
              <h3 style={{ marginTop: 16 }}>{i.title}</h3>
              <p style={{ fontSize: "1.15rem", lineHeight: 1.5 }}>{i.blurb}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
