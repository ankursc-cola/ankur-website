import GlowLayer from "../components/GlowLayer.jsx";
import useReveal from "../hooks/useReveal.js";
import RisingEmbers from "../components/RisingEmbers.jsx";
import useSanityData from "../hooks/useSanityData.js";
import { fetchCommittee, urlFor } from "../lib/sanity.js";
import { useState } from "react";

// Shown only if Sanity has no committee members yet (or isn't connected
// yet) — keeps the page looking correct during setup, same content as
// before this file was wired to the CMS.
const FALLBACK_COMMITTEE = [
  { _id: "fallback-1", role: "President", name: "Sourav Banerjee", photo: null },
  { _id: "fallback-2", role: "Vice President", name: "Siddhartha Sarkar", photo: null },
  { _id: "fallback-3", role: "Secretary", name: "Pramita Saha", photo: null },
  { _id: "fallback-4", role: "Treasurer", name: "Sahadeb De", photo: null },
  { _id: "fallback-5", role: "Member at large", name: "Samrat Datta", photo: null },
  { _id: "fallback-6", role: "Member at large", name: "Sunanda Sarkar", photo: null },
  { _id: "fallback-7", role: "Member at large", name: "Soumyajit Roy", photo: null },
];

export default function ExecutiveCommittee() {
  useReveal();
  const { data: committee } = useSanityData(fetchCommittee, FALLBACK_COMMITTEE);

  return (
    <>
      <header className="page-header">
        <GlowLayer />
        <RisingEmbers count={35} />
        <span className="kicker">2026 Term</span>
        <h1>Executive Committee</h1>
        <h1 className="headline font-bangla">নেতৃত্বে</h1>
        <p>Ankur is run by a volunteer committee elected each year</p>
      </header>

      <section className="section">
        <div className="committee-grid reveal">
          {committee.map((m) => (
            <div className="committee-card" key={m._id}>
              <div className="committee-photo-wrap">
                <CommitteePhoto photo={m.photo} role={m.role} />
              </div>
              <div className="role">{m.role}</div>
              <div className="name">{m.name}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

// Same onError-based fallback logic as before — now also treats a
// missing Sanity `photo` field the same way as a broken image link.
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
