import GlowLayer from "../components/GlowLayer.jsx";
import useReveal from "../hooks/useReveal.js";
import RisingEmbers from "../components/RisingEmbers.jsx";
import useSanityData from "../hooks/useSanityData.js";
import { fetchEvents } from "../lib/sanity.js";
import { FALLBACK_EVENTS } from "./Events.jsx";
import { EVENTS } from "./Home.jsx";
import { EVENT_IMAGE_RULES } from "../lib/eventImages.js";
import zelleQR from "../assets/zelle-qr.png";

// ---------------------------------------------------------------------------
// TODO (auth): This page is intentionally open for now. When real member
// login exists, gate it — e.g. wrap the returned JSX in <RequireAuth> or
// redirect unauthenticated visitors before render. Nothing else here needs
// to change when that happens.
// ---------------------------------------------------------------------------

const MEMBERSHIP_TIERS = [
  {
    id: "annual",
    title: "Annual Membership",
    price: "$400",
    period: "/ year",
    for:"/ family",
    description: "Includes admission to every Ankur event for the full year.",
    recommended: true,
  },
  {
    id: "annual",
    title: "Annual Membership",
    price: "$250",
    period: "/ year",
    for:"/ individual",
    description: "Includes admission to every Ankur event for the full year.",
    recommended: true,
  },
  {
    id: "per-event",
    title: "Per-Event Participation Fee",
    price: "$150",
    period: "/ event",
    for:"/ family",
    description: "Covers a single event of your choice.",
    recommended: false,
  },

];

// ---------------------------------------------------------------------------
// EVENTS (imported above) holds fixed, hand-written text — same as the
// homepage's "Our Main Celebrations" cards. It is NOT edited via Sanity.
// The only thing that comes from Sanity per event is the Member Flyer file,
// so this helper matches each fixed EVENTS entry to its live Sanity event
// using the same keyword table Events.jsx uses for images — one shared
// source of truth instead of a third copy of event-name matching logic.
//
// KNOWN COLLISION: "New Year" (English) and "Poila Boishak" (Bengali New
// Year) both contain "new year" once a Sanity name like
// "Poila Baishakh (New Year)" is lowercased, so the generic "new year"
// keyword would otherwise match the wrong event. Fixed below by excluding
// Poila/Boishak-named events from that specific keyword's match.
// ---------------------------------------------------------------------------
function findMatchingSanityEvent(staticEvent, sanityEvents) {
  const staticLower = staticEvent.name.toLowerCase();
  const rule = EVENT_IMAGE_RULES.find((r) => staticLower.includes(r.keyword));
  if (!rule) return null;
  return (
    sanityEvents.find((se) => {
      const name = se.name?.toLowerCase() || "";
      if (rule.keyword === "new year" && (name.includes("poila") || name.includes("boishak") || name.includes("baishak"))) {
        return false;
      }
      return name.includes(rule.keyword);
    }) || null
  );
}

function ZelleBlock({ label }) {
  return (
    <div className="zelle-block">
      <img src={zelleQR} alt="Scan to pay Ankur via Zelle" className="zelle-qr-img" />
      <div className="zelle-details">
        <p className="zelle-label">{label}</p>
        <p className="zelle-name">ANKUR</p>
        <p className="zelle-email">ankursc.treasurer@gmail.com</p>
        <p className="zelle-note">
          After paying, please email us your name and which membership / event
          this is for, so we can confirm it on our end.
        </p>
      </div>
    </div>
  );
}

function ZelleBlockDonate({ label }) {
  return (
    <div className="zelle-block">
      <img src={zelleQR} alt="Scan to pay Ankur via Zelle" className="zelle-qr-img" />
      <div className="zelle-details">
        <p className="zelle-label">{label}</p>
        <p className="zelle-name">ANKUR</p>
        <p className="zelle-email">ankursc.treasurer@gmail.com</p>
        <p className="zelle-note">
          After your donation, please email us your name. Thank you for your donation to Ankur
        </p>
      </div>
    </div>
  );
}
export default function MemberDashboard() {
  useReveal();
  const { data: events } = useSanityData(fetchEvents, FALLBACK_EVENTS);

  return (
    <>
      <header className="page-header">
        <GlowLayer />
        <RisingEmbers count={35} />
        <span className="kicker">Members Only</span>
        <h1>Member Dashboard</h1>
         <h1 className="headline font-bangla">সদস্য তথ্যফলক</h1>
        <p>Event flyers, membership dues, and ways to support Ankur.</p>
      </header>

      <section className="section">
        <span className="kicker">For Members</span>
        <h2 className="dark-text">Events</h2>
        <p style={{ opacity: 0.85, marginBottom: "1.5rem" }}>
          Download the member flyer for any event below, if one's been posted.
        </p>

        <div className="card-row reveal">
          {EVENTS.map((e) => {
            const match = findMatchingSanityEvent(e, events);
            return (
              <div key={e._id} className={`card ${match?.featured ? "highlight" : ""}`}>
                <h3>{e.name}</h3>
                <p>{e.blurb}</p>
                {match?.memberFlyerUrl ? (
                  <p style={{ marginTop: 12 }}>
                    <a
                      href={match.memberFlyerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost"
                      style={{ borderColor: "var(--vermillion)", color: "var(--vermillion)" }}
                    >
                      Download Member Flyer →
                    </a>
                  </p>
                ) : (
                  <p style={{ marginTop: 12, opacity: 0.6, fontStyle: "italic" }}>
                    No member flyer uploaded yet
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="section">
        <span className="kicker">Every Year</span>
        <h2 className="dark-text">Membership Dues</h2>
        <p style={{ opacity: 0.85, marginBottom: "1.5rem" }}>
          We highly recommend the Annual Membership — one payment covers every
          Ankur event for the year.
        </p>

        <div className="membership-cards">
          {MEMBERSHIP_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`membership-card${tier.recommended ? " recommended" : ""}`}
            >
              {tier.recommended && <span className="recommended-badge">Recommended</span>}
              <h3>{tier.title}</h3>
              <p className="membership-price">
                {tier.price}
                <span className="membership-period">{tier.period}</span>
                <span className="membership-period">{tier.for}</span>
              </p>
              <p style={{ opacity: 0.85 }}>{tier.description}</p>
            </div>
          ))}
        </div>

        <ZelleBlock label="Pay membership dues with Zelle" />
      </section>

      <section className="section">
        <span className="kicker">Give Back</span>
        <h2 className="dark-text">Support Ankur</h2>
        <p style={{ opacity: 0.85, marginBottom: "1.5rem" }}>
          Want to contribute beyond your membership? Donations of any amount
          help fund our events throughout the year.
        </p>
        <ZelleBlockDonate label="Donate to Ankur with Zelle" />
      </section>
    </>
  );
}
