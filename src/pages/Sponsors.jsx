import GlowLayer from "../components/GlowLayer.jsx";
import useReveal from "../hooks/useReveal.js";
import RisingEmbers from "../components/RisingEmbers.jsx";
import useSanityData from "../hooks/useSanityData.js";
import { fetchSponsors, urlFor } from "../lib/sanity.js";

// Shown when there are no real sponsors in Sanity yet — same
// tier-description content as the original page, so this still looks
// complete before anyone's actually added a sponsor.
const TIERS = [
  { name: "Platinum", blurb: "Top billing on the Durga Puja banner, souvenir magazine, and website." },
  { name: "Gold", blurb: "Featured logo placement at the main event and in the souvenir magazine." },
  { name: "Silver", blurb: "Logo listed on the website and event program." },
];

const TIER_ORDER = ["Platinum", "Gold", "Silver"];

export default function Sponsors() {
  useReveal();
  const { data: sponsors } = useSanityData(fetchSponsors, []);

  const hasRealSponsors = sponsors.length > 0;

  return (
    <>
      <header className="page-header">
        <GlowLayer />
        <RisingEmbers count={35} />
        <span className="kicker">Support Ankur</span>
        <h1>Sponsors</h1>
        <h1 className="headline font-bangla">আমাদের সহযোগী</h1>
        <p>Our celebrations are made possible by generous community and business sponsors.</p>
      </header>

      {!hasRealSponsors && (
        <section className="section">
          <div className="card-row reveal">
            {TIERS.map((t) => (
              <div className="card" key={t.name}>
                <span className="tag">Tier</span>
                <h3>{t.name}</h3>
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
              <span className="kicker">{tierName} Sponsors</span>
              <div className="card-row reveal">
                {inTier.map((s) => (
                  <div className="card" key={s._id}>
                    {s.logo && (
                      <img
                        src={urlFor(s.logo).width(240).url()}
                        alt={s.name}
                        style={{ maxWidth: "100%", height: 60, objectFit: "contain", marginBottom: 12 }}
                      />
                    )}
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
            </section>
          );
        })}
    </>
  );
}
