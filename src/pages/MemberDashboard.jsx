import GlowLayer from "../components/GlowLayer.jsx";
import useReveal from "../hooks/useReveal.js";
import RisingEmbers from "../components/RisingEmbers.jsx";
import useSanityData from "../hooks/useSanityData.js";
import { fetchEvents } from "../lib/sanity.js";
import { FALLBACK_EVENTS } from "./Events.jsx";
import { EVENTS } from "./Home.jsx";
import { EVENT_IMAGE_RULES } from "../lib/eventImages.js";
import zelleQR from "../assets/zelle-qr.png";

import { Helmet } from 'react-helmet-async';

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
    price: "$200",
    period: "/ year",
    for:"/ individual",
    description: "Includes admission to every Ankur event for the full year.",
    recommended: true,
  },
   {
    id: "annual",
    title: "Student Family Annual Membership",
    price: "$300",
    period: "/ year",
    for:"/ family",
    description: "Includes admission to every Ankur event for the full year.",
    recommended: true,
  },
  {
    id: "annual",
    title: "Student Annual Membership",
    price: "$150",
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
          <Helmet>
              <title> Our Members | Ankur Bengali Association SC</title>
              <meta name="description" content="Ankur is the Bengali cultural association of South Carolina, hosting Durga Puja, Poila Boishakh, and community events for Bengalis across SC." />
          </Helmet>
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
        <h2 className="dark-text">Events Included in Membership</h2>
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
        <span className="kicker">Full Rate Card</span>
        <h2 className="dark-text">Membership, Donation &amp; Entry Fees  2026 - 2027</h2>
        <p style={{ opacity: 0.85, marginBottom: "1.5rem", maxWidth: 720 }}>
          Here's the complete breakdown — and why the <strong>Member Family</strong> plan
          is our recommended option. At $400, it bundles your full year of membership{" "}
          <em>and</em> your Durga Puja donation into a single payment — less than a
          non-member family would pay just to attend one weekend of Durga Puja on its own.
        </p>

        <div className="rate-card-wrap">
          <h3 className="rate-card-title">Ankur Members</h3>
          <div className="rate-card-table-scroll">
            <table className="rate-card-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Membership</th>
                  <th>Durga Puja Donation</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="recommended-row">
                  <td>
                    Member Family
                    <span className="best-value-tag">Best Value</span>
                  </td>
                  <td>$250</td>
                  <td>$150</td>
                  <td>$400</td>
                </tr>
                <tr>
                  <td>Member Single</td>
                  <td>$100</td>
                  <td>$100</td>
                  <td>$200</td>
                </tr>
                <tr>
                  <td>Member Student Family</td>
                  <td>$200</td>
                  <td>$100</td>
                  <td>$300</td>
                </tr>
                <tr>
                  <td>Member Student Single</td>
                  <td>$75</td>
                  <td>$75</td>
                  <td>$150</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="rate-card-title" style={{ marginTop: "2.5rem" }}>
            Durga Puja — Non-Members
          </h3>
          <div className="rate-card-table-scroll">
            <table className="rate-card-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>2 Days</th>
                  <th>1 Day</th>
                  <th>Saturday Morning</th>
                  <th>Saturday Evening</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Non-Member Entry Per Adult*</td>
                  <td>$150</td>
                  <td>$100</td>
                  <td>$50</td>
                  <td>$50</td>
                </tr>
                <tr>
                  <td>Non-Member Student Entry Per Adult*</td>
                  <td>$100</td>
                  <td>$75</td>
                  <td>$40</td>
                  <td>$40</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="rate-card-footnote">
            * Children under 13 years old, when accompanied by an adult, can enter free of charge.
          </p>

          <div className="rate-card-cultural-fee">
            <span>Cultural Program Participation Fee for Non-Members^</span>
            <strong>$30</strong>
          </div>
          <p className="rate-card-footnote">
            ^ This is in addition to the entry fee. The entry fee must be paid to
            participate in the cultural program.
          </p>
        </div>
      </section>



      <section className="section">
        <span className="kicker">Become a Member Sponsor</span>
        <h2 className="dark-text">Sponsorship Levels</h2>
        <p style={{ opacity: 0.85, marginBottom: "1.5rem", maxWidth: 720 }}>
          Sponsors help make every Ankur event possible. Choose a tier below,
          then pay using the Zelle details below.
        </p>

        <div className="sponsor-cards">
          <div className="sponsor-card tier-platinum">
            <div className="sponsor-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="34" height="34" fill="currentColor">
                <path d="M12 2l2.9 6.26L21 9.27l-4.5 4.38L17.8 21 12 17.77 6.2 21l1.3-7.35L3 9.27l6.1-1.01z" />
              </svg>
            </div>
            <h3>Platinum</h3>
            <p className="sponsor-price">$1,000</p>
          </div>
          <div className="sponsor-card tier-gold">
            <div className="sponsor-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="34" height="34" fill="currentColor">
                <path d="M12 2l2.9 6.26L21 9.27l-4.5 4.38L17.8 21 12 17.77 6.2 21l1.3-7.35L3 9.27l6.1-1.01z" />
              </svg>
            </div>
            <h3>Gold</h3>
            <p className="sponsor-price">$750</p>
          </div>
          <div className="sponsor-card tier-silver">
            <div className="sponsor-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="34" height="34" fill="currentColor">
                <path d="M12 2l2.9 6.26L21 9.27l-4.5 4.38L17.8 21 12 17.77 6.2 21l1.3-7.35L3 9.27l6.1-1.01z" />
              </svg>
            </div>
            <h3>Silver</h3>
            <p className="sponsor-price">$500</p>
          </div>
        </div>
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
