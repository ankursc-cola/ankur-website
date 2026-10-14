import { lazy, Suspense, useCallback, useRef, useState } from "react";
import GlowLayer from "../components/GlowLayer.jsx";
import useReveal from "../hooks/useReveal.js";
import RisingEmbers from "../components/RisingEmbers.jsx";
import useSanityData from "../hooks/useSanityData.js";
import { fetchPublications, urlFor } from "../lib/sanity.js";
// Styles are tiny (~3 KB) so they load with the page. That way the "Opening…" fallback
// below is already styled while the heavy viewer code is still downloading.
import "../components/FlipbookViewer.css";

// The flipbook pulls in pdf.js + the page-flip engine (~1 MB). `lazy` means that code is
// only downloaded when someone actually clicks "Read the Magazine", so the rest of
// the site stays exactly as fast as before.
const FlipbookViewer = lazy(() => import("../components/FlipbookViewer.jsx"));

const FALLBACK_ISSUES = [
  { _id: "f1", year: "2025", title: "Durga Puja Souvenir", blurb: "Our annual keepsake — member writing, art, and event highlights.", pdfUrl: null, coverImage: null },
  { _id: "f2", year: "2024", title: "Durga Puja Souvenir", blurb: "Last year's edition, archived here for the community.", pdfUrl: null, coverImage: null },
];

export default function Publications() {
  useReveal();
  const { data: issues } = useSanityData(fetchPublications, FALLBACK_ISSUES);

  const [openIssue, setOpenIssue] = useState(null);
  const triggerRef = useRef(null); // the button that opened the viewer, so focus can return to it

  const openViewer = (issue, e) => {
    triggerRef.current = e.currentTarget;
    setOpenIssue(issue);
  };

  const closeViewer = useCallback(() => {
    setOpenIssue(null);
    triggerRef.current?.focus();
  }, []);

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
                    <button
                      type="button"
                      className="btn btn-ghost pub-pdf-btn"
                      onClick={(e) => openViewer(i, e)}
                    >
                      Read the Magazine →
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The viewer lives OUTSIDE the .reveal row on purpose. useReveal scans for
          .reveal elements once on mount, so anything conditionally mounted inside one
          would stay invisible. This modal is never inside a reveal element. */}
      {openIssue && (
        <Suspense
          fallback={
            <div className="flip-overlay">
              <div className="flip-stage">
                <div className="flip-message"><p>Opening the magazine…</p></div>
              </div>
            </div>
          }
        >
          <FlipbookViewer
            pdfUrl={openIssue.pdfUrl}
            title={openIssue.title}
            year={openIssue.year}
            onClose={closeViewer}
          />
        </Suspense>
      )}
    </>
  );
}
