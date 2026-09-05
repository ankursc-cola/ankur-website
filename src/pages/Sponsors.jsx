import GlowLayer from "../components/GlowLayer.jsx";
import useReveal from "../hooks/useReveal.js";
import RisingEmbers from "../components/RisingEmbers.jsx";
import useSanityData from "../hooks/useSanityData.js";
import { fetchSponsors, urlFor } from "../lib/sanity.js";
import RectAlpona from "../components/RectAlpona.jsx";

import { Helmet } from 'react-helmet-async';

// Shown when there are no real sponsors in Sanity yet — same
// tier-description content as the original page, so this still looks
// complete before anyone's actually added a sponsor.
const TIERS = [
  { name: "Platinum", blurb: "Top billing on the Durga Puja banner, souvenir magazine, and website." },
  { name: "Gold", blurb: "Featured logo placement at the main event and in the souvenir magazine." },
  { name: "Silver", blurb: "Logo listed on the website and event program." },
  { name: "Business", blurb: "General business support, with recognition on the website." },
];

// tier value stored in Sanity -> full display label. Kept separate from
// the raw tier value because "Business Sponsors" doesn't follow the
// same "<Tier> Member Sponsors" pattern as the other three.
const TIER_LABELS = {
  Platinum: "Platinum Member Sponsors",
  Gold: "Gold Member Sponsors",
  Silver: "Silver Member Sponsors",
  Business: "Business Sponsors",
};

const TIER_ORDER = ["Platinum", "Gold", "Silver", "Business"];

/*function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}*/

export default function Sponsors() {
  useReveal();
  const { data: sponsors } = useSanityData(fetchSponsors, []);

  const hasRealSponsors = sponsors.length > 0;

  return (
    <>
          <Helmet>
              <title>Our Sponsors | Ankur Bengali Association SC</title>
              <meta name="description" content="Businesses and organizations supporting Ankur's Bengali cultural programming in South Carolina." />
          </Helmet>
      <header className="page-header">
        <GlowLayer />
        <RisingEmbers count={35} />
        <span className="kicker">Support Ankur</span>
        <h1>Sponsors</h1>
        <h1 className="headline font-bangla">পৃষ্ঠপোষক</h1>
        <p>Our celebrations are made possible by generous community and business sponsors.</p>
      </header>

      {!hasRealSponsors && (
        <section className="section">
          <div className="card-row">
            {TIERS.map((t) => (
              <div className="card" key={t.name}>
                <span className="tag">Tier</span>
                <h3>{TIER_LABELS[t.name]}</h3>
                <p>{t.blurb}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {hasRealSponsors &&
        TIER_ORDER.map((tierName) => {
          const inTier = sponsors.filter((s) => s.tier === tierName);
          if (inTier.length === 0) return null;
          return (
            <section className="section" key={tierName}>
              <span className="kicker sponsor-tier-kicker">{TIER_LABELS[tierName]}</span>
              <RectAlpona tier={tierName.toLowerCase()}>
                <div className="card-row">
                  {inTier.map((s) => (
                    <div className="card" key={s._id}>
                      {s.logo ? (
                        <img
                          src={urlFor(s.logo).width(240).url()}
                          alt={s.name}
                          style={{ maxWidth: "100%", height: 60, objectFit: "contain", marginBottom: 12 }}
                        />
                      /*) : (*/
                        /*<div className="sponsor-card-initials">{getInitials(s.name)}</div>*/
                      ): null}
                      <h3>
                        {s.website ? (
                          <a href={s.website} target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>
                            {s.name}
                          </a>
                        ) : (
                          s.name
                        )}
                      </h3>
                    </div>
                  ))}
                </div>
              </RectAlpona>
            </section>
          );
        })}
    </>
  );
}
