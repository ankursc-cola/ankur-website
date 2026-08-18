import GlowLayer from "../components/GlowLayer.jsx";
import useReveal from "../hooks/useReveal.js";

// Replace with the current year's committee — this list changes annually.
const COMMITTEE = [
  { role: "President", name: "Name Here" },
  { role: "Vice President", name: "Name Here" },
  { role: "General Secretary", name: "Name Here" },
  { role: "Treasurer", name: "Name Here" },
  { role: "Cultural Secretary", name: "Name Here" },
  { role: "Publicity Secretary", name: "Name Here" },
];

export default function ExecutiveCommittee() {
  useReveal();
  return (
    <>
      <header className="page-header">
        <GlowLayer />
        <span className="kicker">2026 Term</span>
        <h1>Executive Committee</h1>
        <p>
          Ankur is run by a volunteer committee elected each year. This page is meant to be
          updated by the incoming committee without needing a developer.
        </p>
      </header>

      <section className="section">
        <div className="committee-grid reveal">
          {COMMITTEE.map((m) => (
            <div className="committee-card" key={m.role}>
              <div className="role">{m.role}</div>
              <div className="name">{m.name}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
