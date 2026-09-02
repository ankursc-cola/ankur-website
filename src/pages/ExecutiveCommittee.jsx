import GlowLayer from "../components/GlowLayer.jsx";
import useReveal from "../hooks/useReveal.js";
import RisingEmbers from "../components/RisingEmbers.jsx";
import useSanityData from "../hooks/useSanityData.js";
import { fetchCommittee, urlFor } from "../lib/sanity.js";
import { useState } from "react";

// Shown only if Sanity has no committee members yet, or isn't reachable.
// Every entry needs a "term" now, since the page groups by it.
const FALLBACK_COMMITTEE = [
  { _id: "fallback-1", role: "President", name: "Sourav Banerjee", photo: null, term: "2026" },
  { _id: "fallback-2", role: "Vice President", name: "Siddhartha Sarkar", photo: null, term: "2026" },
  { _id: "fallback-3", role: "Secretary", name: "Pramita Saha", photo: null, term: "2026" },
  { _id: "fallback-4", role: "Treasurer", name: "Sahadeb De", photo: null, term: "2026" },
  { _id: "fallback-5", role: "Member at large", name: "Samrat Chakraborty", photo: null, term: "2026" },
  { _id: "fallback-6", role: "Member at large", name: "Sunanda Sarkar", photo: null, term: "2026" },
  { _id: "fallback-7", role: "Member at large", name: "Soumyajeet Samanta", photo: null, term: "2026" },
];

export default function ExecutiveCommittee() {
  useReveal();
  const { data: committee } = useSanityData(fetchCommittee, FALLBACK_COMMITTEE);
  const [openTerm, setOpenTerm] = useState(null);

  // Group members by term, then figure out which term is "current" —
  // simply whichever term string is numerically highest. No manual
  // flag to remember: the moment next year's members get added with
  // term "2027", they become current automatically.
  const grouped = committee.reduce((acc, m) => {
    const t = m.term || "Unassigned";
    (acc[t] = acc[t] || []).push(m);
    return acc;
  }, {});
  /*const terms = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));
  const currentTerm = terms[0];
  const pastTerms = terms.slice(1);*/
const terms = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));
const currentTerm = terms[0];
const realPastTerms = terms.slice(1);

// Always show at least one "past" tab — the year right before the
// current term — even with zero members added for it yet. Otherwise
// this whole feature stays invisible until someone happens to add
// older data first, with no hint it exists at all.
const fallbackPriorYear =
  currentTerm && !isNaN(Number(currentTerm)) ? String(Number(currentTerm) - 1) : null;
const pastTerms =
  fallbackPriorYear && !realPastTerms.includes(fallbackPriorYear)
    ? [fallbackPriorYear, ...realPastTerms]
    : realPastTerms;
  

  return (
    <>
      <header className="page-header">
        <GlowLayer />
        <RisingEmbers count={35} />
        <span className="kicker">{currentTerm} Term</span>
        <h1>Executive Committee</h1>
        <h1 className="headline font-bangla">নির্বাহী সমিতি</h1>
        <p>Ankur is run by a volunteer committee elected each year</p>
      </header>

      <section className="section">
        <div className="committee-grid reveal">
          {(grouped[currentTerm] || []).map((m) => (
            <div className="committee-card" key={m._id}>
              <div className="committee-photo-wrap">
                <CommitteePhoto photo={m.photo} role={m.role} />
              </div>
              <div className="role">{m.role}</div>
              <div className="name">{m.name}</div>
            </div>
          ))}
        </div>

        {pastTerms.length > 0 && (
          <div className="past-leadership">
            <p className="past-leadership-label">Past Leadership</p>
            <div className="term-tabs">
              {pastTerms.map((t) => (
                <button
                  key={t}
                  className={`term-tab ${openTerm === t ? "term-tab-active" : ""}`}
                  onClick={() => setOpenTerm(openTerm === t ? null : t)}
                >
                  {t}
                </button>
              ))}
            </div>

              {openTerm && (
                <div className="past-list">
                  {grouped[openTerm] && grouped[openTerm].length > 0 ? (
                    grouped[openTerm].map((m) => (
                      <div className="past-row" key={m._id}>
                        <PastAvatar photo={m.photo} role={m.role} />
                        <span className="past-name">{m.name}</span>
                        <span className="past-role">{m.role}</span>
                      </div>
                    ))
                  ) : (
                    <p className="past-empty">
                      No {openTerm} committee members added yet — add them in Sanity under Committee
                      Member, with Term set to "{openTerm}".
                    </p>
                  )}
                </div>
              )}
          </div>
        )}
      </section>
    </>
  );
}

// Same onError-based fallback logic as before — a missing Sanity
// `photo` field is treated the same as a broken image link.
function CommitteePhoto({ photo, role }) {
  const [failed, setFailed] = useState(false);
  const src = photo ? urlFor(photo).width(200).height(200).url() : null;

  if (!src || failed) {
    return <div className="committee-photo-placeholder">{role.charAt(0)}</div>;
  }
  return (
    <img
      className="committee-photo"
      src={src}
      alt={role}
      onError={() => setFailed(true)}
    />
  );
}

// A smaller, self-contained avatar for the compact past-term rows —
// deliberately not reusing CommitteePhoto's sizing, since that's
// tuned for the large current-term cards.
function PastAvatar({ photo, role }) {
  const [failed, setFailed] = useState(false);
  const src = photo ? urlFor(photo).width(80).height(80).url() : null;

  if (!src || failed) {
    return <div className="past-avatar-placeholder">{role.charAt(0)}</div>;
  }
  return (
    <img
      className="past-avatar"
      src={src}
      alt={role}
      onError={() => setFailed(true)}
    />
  );
}